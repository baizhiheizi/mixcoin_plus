import { StockMarket } from '@icon-park/react';
import { useCurrentUser } from 'apps/application/contexts';
import { ToastError } from 'apps/application/utils';
import {
  CHINESE_COMMUNITY_ID,
  ERC20_USDT_ASSET_ID,
  OMNI_USDT_ASSET_ID,
  PUSD_ASSET_ID,
} from 'apps/shared';
import BigNumber from 'bignumber.js';
import { Market, useCreateOceanOrderMutation } from 'graphqlTypes';
import React, { useState } from 'react';
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
  const {
    market,
    orderPrice,
    setOrderPrice,
    orderAmount,
    setOrderAmount,
  } = props;
  const { t, i18n } = useTranslation();
  const { currentUser } = useCurrentUser();
  const history = useHistory();
  const side = new URLSearchParams(history.location.search).get('side');
  const [actionSheetVisible, setActionSheetVisible] = useState(false);
  const [orderSide, setOrderSide] = useState<'ask' | 'bid'>(
    side === 'ask' ? 'ask' : 'bid',
  );
  const [orderType, setOrderType] = useState<'limit' | 'market'>('limit');
  const [paying, setPaying] = useState<boolean>(false);
  const [createOceanOrder] = useCreateOceanOrderMutation({
    update(
      _,
      {
        data: {
          createOceanOrder: { payUrl },
        },
      },
    ) {
      location.replace(payUrl);
    },
  });

  function confirmBeforePlaceOrder() {
    if (!currentUser) {
      location.replace('/login');
      return;
    } else if (!validateOrder()) {
      return;
    }

    let confirmText: string;
    let warningText: string;

    if (orderType === 'limit') {
      confirmText = `${
        orderSide === 'ask'
          ? t('confirm_place_ask_order')
          : t('confirm_place_bid_order')
      } ${orderAmount} ${market.baseAsset.symbol} (${t(
        'price',
      )}: ${orderPrice} ${market.quoteAsset.symbol})?`;
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
        (market.quoteAsset.priceUsd * parseFloat(orderPrice)) /
          market.baseAsset.priceUsd >
          1.2) ||
      (market.quoteAsset.priceUsd * parseFloat(orderPrice)) /
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

    if (orderType === 'limit' && orderSide === 'bid') {
      funds = new BigNumber(orderAmount).times(orderPrice);
    }
    if (orderType === 'limit') {
      if (orderSide === 'bid') {
        funds = new BigNumber(orderAmount).times(orderPrice);
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
          price: orderPrice,
          funds: calculateFunds(),
        },
      },
    });
  }

  function validateOrder() {
    if (orderType === 'limit') {
      if (parseFloat(orderPrice) <= 0) {
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
      const price = new BigNumber(orderPrice);
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
      if (orderType === 'limit' && amount.times(orderPrice).lt(minFunds)) {
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
              <Input
                disabled={paying}
                type='price'
                value={orderPrice}
                onChange={(value: string) => setOrderPrice(value)}
                placeholder={`${t('price')}(${market.quoteAsset.symbol})`}
                className='w-full h-10 p-2 text-base text-center border rounded dark:border-gray-500'
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
            <div className='p-2 text-gray-500'>
              ≈{' $'}
              {(
                market.quoteAsset.priceUsd * parseFloat(orderPrice) || 0
              ).toFixed(4)}
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
              <Input
                disabled={paying}
                type='price'
                value={orderAmount}
                onChange={(value: string) => setOrderAmount(value)}
                placeholder={`${t('volume')}(${market.baseAsset.symbol})`}
                className='w-full h-10 p-2 text-base text-center border rounded dark:border-gray-500'
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
            <div className='p-2 text-gray-500'>
              ≈{' $'}
              {(
                market.baseAsset.priceUsd * parseFloat(orderAmount) || 0
              ).toFixed(4)}
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
