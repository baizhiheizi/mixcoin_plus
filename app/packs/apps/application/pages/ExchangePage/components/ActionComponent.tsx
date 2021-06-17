import { StockMarket } from '@icon-park/react';
import { useCurrentUser } from 'apps/application/contexts';
import { ToastError } from 'apps/application/utils';
import {
  CHINESE_COMMUNITY_ID,
  ERC20_USDT_ASSET_ID,
  OMNI_USDT_ASSET_ID,
  PUSD_ASSET_ID,
  useFennec,
  useMixin,
} from 'apps/shared';
import BigNumber from 'bignumber.js';
import { Market, useCreateOceanOrderMutation } from 'graphqlTypes';
import QRCode from 'qrcode.react';
import React, { useEffect, useState } from 'react';
import { ChevronDown as ChevronDownIcon } from 'react-feather';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';
import { ActionSheet, Button, Input, Modal, Popper, Toast } from 'zarm';

BigNumber.config({
  FORMAT: {
    decimalSeparator: '.',
    groupSeparator: ',',
    groupSize: 3,
    secondaryGroupSize: 0,
  },
});

export default function ActionComponent(props: {
  market: Partial<Market>;
  orderPrice: string;
  setOrderPrice: (params: any) => any;
  orderAmount: string;
  setOrderAmount: (params: any) => any;
}) {
  const { market, orderPrice, setOrderPrice, orderAmount, setOrderAmount } =
    props;
  const { t, i18n } = useTranslation();
  const { currentUser } = useCurrentUser();
  const { platform } = useMixin();
  const { fennec } = useFennec();
  const history = useHistory();
  const side = new URLSearchParams(history.location.search).get('side');
  const [actionSheetVisible, setActionSheetVisible] = useState(false);
  const [orderSide, setOrderSide] = useState<'ask' | 'bid'>(
    side === 'ask' ? 'ask' : 'bid',
  );
  const [orderType, setOrderType] = useState<'limit' | 'market'>('limit');
  const [paying, setPaying] = useState<boolean>(false);
  const [balance, setBalance] = useState({
    quoteAsset: market.quoteAsset.balance,
    baseAsset: market.baseAsset.balance,
  });
  const [createOceanOrder] = useCreateOceanOrderMutation({
    update(
      _,
      {
        data: {
          createOceanOrder: {
            payUrl,
            id,
            brokerId,
            paymentAmount,
            paymentAssetId,
            paymentMemo,
          },
        },
      },
    ) {
      if (currentUser.fennec) {
        fennec.wallet.transfer({
          asset_id: paymentAssetId,
          amount: paymentAmount,
          opponent_id: brokerId,
          memo: paymentMemo,
          trace_id: id,
        });
      } else if (platform) {
        location.replace(payUrl);
      } else {
        Modal.confirm({
          title: t('scan_with_mixin_messenger'),
          content: (
            <div className='flex items-center justify-center'>
              <QRCode value={payUrl} size={200} />
            </div>
          ),
        });
      }
    },
  });

  function confirmBeforePlaceOrder() {
    if (!currentUser) {
      location.replace('/login');
      return;
    } else if (!validateOrder()) {
      return;
    }
    const parsedOrderPrice = parseFloat(orderPrice).toFixed(4);

    let confirmText: string;
    let warningText: string;

    if (orderType === 'limit') {
      confirmText = `${
        orderSide === 'ask'
          ? t('confirm_place_ask_order')
          : t('confirm_place_bid_order')
      } ${orderAmount} ${market.baseAsset.symbol} (${t(
        'price',
      )}: ${parsedOrderPrice} ${market.quoteAsset.symbol})?`;
    } else {
      confirmText = `${
        orderSide === 'ask'
          ? `${t('confirm_place_ask_order')} ${orderAmount} ${
              market.baseAsset.symbol
            }`
          : `${t('confirm_place_bid_order')} ${orderAmount} ${
              market.quoteAsset.symbol
            } ${market.baseAsset.symbol}`
      } (${t('price')}: ${t('market_price')})?`;
    }

    if (
      (orderType === 'limit' &&
        (market.quoteAsset.priceUsd * parseFloat(parsedOrderPrice)) /
          market.baseAsset.priceUsd >
          1.2) ||
      (market.quoteAsset.priceUsd * parseFloat(parsedOrderPrice)) /
        market.baseAsset.priceUsd <
        0.8
    ) {
      warningText = t('important_warning');
    }

    Modal.confirm({
      content: (
        <div>
          {confirmText}{' '}
          {Boolean(warningText) && (
            <div className='text-bold'>{warningText}</div>
          )}
        </div>
      ),
      onOk: placeOrder,
    });
  }

  function calculateFunds() {
    let funds: any;
    const parsedOrderPrice = parseFloat(orderPrice).toFixed(4);

    if (orderType === 'limit' && orderSide === 'bid') {
      funds = new BigNumber(orderAmount).times(parsedOrderPrice);
    }
    if (orderType === 'limit') {
      if (orderSide === 'bid') {
        funds = new BigNumber(orderAmount).times(parsedOrderPrice);
      } else {
        funds = new BigNumber(orderAmount);
      }
    } else if (orderType === 'market') {
      funds = new BigNumber(orderAmount);
    }

    return funds;
  }

  function placeOrder() {
    if (paying) {
      return;
    }

    setPaying(true);
    createOceanOrder({
      variables: {
        input: {
          marketId: market.id,
          side: orderSide,
          orderType,
          price: parseFloat(orderPrice).toFixed(4),
          funds: calculateFunds().toFixed(4),
        },
      },
    });
  }

  function validateOrder() {
    const parsedOrderPrice = parseFloat(orderPrice).toFixed(4);
    setOrderPrice(parsedOrderPrice);

    if (orderType === 'limit') {
      if (parseFloat(parsedOrderPrice) <= 0) {
        ToastError(t('price_too_low'));
        return;
      } else if (parseFloat(orderAmount) <= 0) {
        ToastError(t('order_too_small'));
        return;
      }
    } else if (orderType === 'market' && parseFloat(orderAmount) <= 0) {
      ToastError(t('order_too_small'));
      return;
    }

    const funds = calculateFunds();
    if (!funds.isFinite() || funds.lt('0.00000001')) {
      return;
    }
    const maxPrice = new BigNumber(10);
    const maxAmount = new BigNumber(500000);
    const maxFunds = maxPrice.times(maxAmount);

    if (orderType === 'limit') {
      const price = new BigNumber(parsedOrderPrice);
      let quoteMaxPrice = maxPrice;
      if (
        [OMNI_USDT_ASSET_ID, ERC20_USDT_ASSET_ID, PUSD_ASSET_ID].includes(
          market.quoteAsset.assetId,
        )
      ) {
        quoteMaxPrice = maxPrice.times(50000);
      }
      if (price.gt(quoteMaxPrice)) {
        ToastError(t('price_too_high'));
        return false;
      }
    }

    if (orderSide === 'bid') {
      let minFunds = '0.0001';
      if (
        [OMNI_USDT_ASSET_ID, ERC20_USDT_ASSET_ID, PUSD_ASSET_ID].includes(
          market.quoteAsset.assetId,
        )
      ) {
        minFunds = '1';
      }
      if (funds.lt(minFunds)) {
        ToastError(t('order_too_small'));
        return false;
      }
      let quoteMaxFunds = maxFunds;
      if (
        [OMNI_USDT_ASSET_ID, ERC20_USDT_ASSET_ID, PUSD_ASSET_ID].includes(
          market.quoteAsset.assetId,
        )
      ) {
        quoteMaxFunds = maxFunds.times(10000);
      }
      if (funds.gt(quoteMaxFunds)) {
        ToastError(t('order_too_big'));
        return false;
      }

      const amount = new BigNumber(orderAmount);
      if (amount.gt(maxAmount)) {
        ToastError(t('order_too_big'));
        return false;
      }
    }

    if (orderSide === 'ask') {
      const amount = new BigNumber(orderAmount);
      let minFunds = '0.0001';
      if (
        [OMNI_USDT_ASSET_ID, ERC20_USDT_ASSET_ID, PUSD_ASSET_ID].includes(
          market.quoteAsset.assetId,
        )
      ) {
        minFunds = '1';
      }
      if (
        orderType === 'limit' &&
        amount.times(parsedOrderPrice).lt(minFunds)
      ) {
        ToastError(t('order_too_small'));
        return false;
      }
      if (orderType === 'market') {
        if (amount.lt('0.0001')) {
          ToastError(t('order_too_small'));
          return false;
        }
      }
      if (amount.gt(maxAmount)) {
        ToastError(t('order_too_big'));
        return false;
      }
    }

    return true;
  }

  const fetchBalanceFromFennec = async () => {
    const quoteAsset = await fennec.wallet.getAsset(market.quoteAsset.assetId);
    const baseAsset = await fennec.wallet.getAsset(market.baseAsset.assetId);
    setBalance({
      quoteAsset: parseFloat(quoteAsset.balance),
      baseAsset: parseFloat(baseAsset.balance),
    });
  };

  useEffect(() => {
    if (currentUser.fennec && fennec) {
      fetchBalanceFromFennec();
    }
  }, [market.id, fennec]);

  return (
    <div className='flex flex-col h-full'>
      <div className='flex justify-between mb-2 space-x-2'>
        <div
          className={`w-full text-lg py-2 text-center rounded ${
            orderSide === 'bid'
              ? 'bg-green-500 text-white'
              : 'bg-gray-200 text-gray-500'
          }`}
          onClick={() => setOrderSide('bid')}
        >
          {t('buy')}
        </div>
        <div
          className={`w-full text-lg py-2 text-center rounded ${
            orderSide === 'ask'
              ? 'bg-red-500 text-white ring-red-300'
              : 'bg-gray-200 text-gray-500'
          }`}
          onClick={() => setOrderSide('ask')}
        >
          {t('sell')}
        </div>
      </div>
      <div className='flex mb-2'>
        <div
          className='flex items-center h-8 p-2 text-base space-x-2'
          onClick={() => setActionSheetVisible(true)}
        >
          <div>
            {orderType === 'limit' ? t('limit_order') : t('market_order')}
          </div>
          <ChevronDownIcon className='w-4 h-4' />
        </div>
      </div>
      <ActionSheet
        destroy={false}
        visible={actionSheetVisible}
        onMaskClick={() => setActionSheetVisible(false)}
        actions={[
          {
            text: t('limit_order'),
            onClick: () => {
              setOrderType('limit');
              setActionSheetVisible(false);
            },
          },
          {
            text: t('market_order'),
            onClick: () => {
              setOrderType('market');
              setActionSheetVisible(false);
            },
          },
        ]}
      />
      {orderType === 'limit' ? (
        <>
          <div className='mb-4'>
            <div className='flex space-x-1'>
              <Button
                disabled={paying}
                size='sm'
                className='flex items-center justify-center h-10 text-base'
                onClick={() => {
                  if (!orderPrice) {
                    return;
                  } else if (new BigNumber(orderPrice).lt('0.0001')) {
                    setOrderPrice('');
                  } else {
                    setOrderPrice(
                      new BigNumber(orderPrice).minus('0.0001').toString(),
                    );
                  }
                }}
              >
                <div>-</div>
              </Button>
              <input
                disabled={paying}
                type='number'
                value={orderPrice}
                min='0.0001'
                onChange={(e: any) => setOrderPrice(e.target.value)}
                placeholder={`${t('price')}(${market.quoteAsset.symbol})`}
                className='w-full h-10 p-2 text-base text-center border rounded dark:border-gray-500 dark:bg-dark'
              />
              <Button
                disabled={paying}
                size='sm'
                className='flex items-center justify-center h-10 text-base'
                onClick={() => {
                  setOrderPrice(
                    new BigNumber(orderPrice || '0').plus('0.0001').toString(),
                  );
                }}
              >
                <div>+</div>
              </Button>
            </div>
            <div className='py-2 text-xs text-gray-500'>
              {balance.quoteAsset !== null && (
                <span>
                  {t('balance')}:{' '}
                  <span
                    className='text-blue-500'
                    onClick={() => {
                      if (orderSide === 'bid' && orderPrice) {
                        setOrderAmount(
                          (balance.quoteAsset / parseFloat(orderPrice)).toFixed(
                            4,
                          ),
                        );
                      }
                    }}
                  >
                    {balance.quoteAsset}
                  </span>{' '}
                  {market.quoteAsset.symbol}
                </span>
              )}
            </div>
          </div>
          <div className='mb-2'>
            <div className='flex space-x-1'>
              <Button
                disabled={paying}
                size='sm'
                className='flex items-center justify-center h-10 text-base'
                onClick={() => {
                  if (!orderAmount) {
                    return;
                  } else if (new BigNumber(orderAmount).lt('0.0001')) {
                    setOrderAmount('');
                  } else {
                    setOrderAmount(
                      new BigNumber(orderAmount).minus('0.0001').toString(),
                    );
                  }
                }}
              >
                <div>-</div>
              </Button>
              <input
                disabled={paying}
                type='number'
                value={orderAmount}
                onChange={(e: any) => setOrderAmount(e.target.value)}
                placeholder={`${t('volume')}(${market.baseAsset.symbol})`}
                className='w-full h-10 p-2 text-base text-center border rounded dark:border-gray-500 dark:bg-dark'
              />
              <Button
                disabled={paying}
                size='sm'
                className='flex items-center justify-center h-10 text-base'
                onClick={() => {
                  setOrderAmount(
                    new BigNumber(orderAmount || '0').plus('0.0001').toString(),
                  );
                }}
              >
                <div>+</div>
              </Button>
            </div>
            <div className='py-2 text-xs text-gray-500'>
              {balance.baseAsset !== null && (
                <span>
                  {t('balance')}:{' '}
                  <span
                    className='text-blue-500'
                    onClick={() => {
                      if (orderSide === 'ask' && orderType === 'limit') {
                        setOrderAmount(market.baseAsset.balance);
                      }
                    }}
                  >
                    {balance.baseAsset}
                  </span>{' '}
                  {market.baseAsset.symbol}
                </span>
              )}
            </div>
          </div>
        </>
      ) : (
        <>
          <div className='flex items-center justify-center h-10 mb-4 text-base text-gray-700 bg-gray-300 rounded'>
            {t('market_price')}({market.quoteAsset.symbol})
          </div>
          <div className='mb-4 text-base'>
            <div className='flex space-x-1'>
              <Button
                disabled={paying}
                size='sm'
                className='flex items-center justify-center h-10 text-base'
                onClick={() => {
                  if (new BigNumber(orderAmount).lt('0.0001')) {
                    setOrderAmount('');
                  } else {
                    setOrderAmount(
                      new BigNumber(orderAmount).minus('0.0001').toString(),
                    );
                  }
                }}
              >
                <div>-</div>
              </Button>
              <Input
                disabled={paying}
                type='price'
                value={orderAmount}
                onChange={(value: string) => setOrderAmount(value)}
                placeholder={`${t('volume')} ${
                  orderSide === 'bid'
                    ? market.quoteAsset.symbol
                    : market.baseAsset.symbol
                }`}
                className='w-full h-10 p-2 text-base text-center border rounded'
              />
              <Button
                disabled={paying}
                size='sm'
                className='flex items-center justify-center h-10 text-base'
                onClick={() => {
                  setOrderAmount(
                    new BigNumber(orderAmount || '0').plus('0.0001').toString(),
                  );
                }}
              >
                <div>+</div>
              </Button>
            </div>
          </div>
        </>
      )}
      <div className='mt-auto'>
        {orderType === 'market' && (
          <div className='mb-2 text-base font-semibold text-gray-500'>
            {t('market_order_warning')}
          </div>
        )}
        <div className='flex items-center justify-between mb-2'>
          <div className='flex items-center'>
            <Popper
              className='p-2 mb-1 text-xs bg-gray-100 dark:bg-dark dark:text-white'
              direction='topLeft'
              content='Maker & Taker: 0.1%'
            >
              <Button size='xs'>{t('fee')}</Button>
            </Popper>
            {i18n.language.match(/zh/) && (
              <Button
                className='ml-2'
                size='xs'
                onClick={() =>
                  location.replace(`mixin://users/${CHINESE_COMMUNITY_ID}`)
                }
              >
                社区
              </Button>
            )}
          </div>
          <StockMarket
            size='1.5rem'
            strokeWidth={2}
            theme='two-tone'
            fill={['#333', 'green']}
            onClick={() => history.push(`/markets/${market.id}`)}
          />
        </div>
        {paying ? (
          <div
            className='p-2 text-lg text-center text-gray-500 bg-gray-300 rounded'
            onClick={() => {
              Toast.show(t('order_will_be_handled'));
              setPaying(false);
              setOrderAmount('');
              setOrderPrice('');
            }}
          >
            {t('already_paid')}
          </div>
        ) : (
          <div
            className={`p-2 text-lg text-center text-white rounded ${
              orderSide === 'bid'
                ? 'bg-green-500 hover:bg-green-300'
                : 'bg-red-500 hover:bg-red-300'
            }`}
            onClick={confirmBeforePlaceOrder}
          >
            {currentUser
              ? orderSide === 'bid'
                ? `${t('buy')} ${market.baseAsset.symbol}`
                : `${t('sell')} ${market.baseAsset.symbol}`
              : t('connect_wallet')}
          </div>
        )}
      </div>
    </div>
  );
}
