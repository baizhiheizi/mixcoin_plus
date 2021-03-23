import { ToastError } from 'apps/application/utils';
import { PUSD_ASSET_ID, USDT_ASSET_ID } from 'apps/shared';
import BigNumber from 'bignumber.js';
import { OceanMarket, useCreateOceanOrderMutation } from 'graphqlTypes';
import React, { useState } from 'react';
import { ChevronDown as ChevronDownIcon } from 'react-feather';
import { useTranslation } from 'react-i18next';
import { ActionSheet, Button, Input, Modal, Toast } from 'zarm';

BigNumber.config({
  FORMAT: {
    decimalSeparator: '.',
    groupSeparator: ',',
    groupSize: 3,
    secondaryGroupSize: 0,
  },
});

export default function ActionComponent(props: {
  market: Partial<OceanMarket>;
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
  const { t } = useTranslation();
  const [actionSheetVisible, setActionSheetVisible] = useState(false);
  const [orderSide, setOrderSide] = useState<'ask' | 'bid'>('bid');
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
    if (
      orderType === 'limit' &&
      !Boolean(orderAmount) &&
      !Boolean(orderPrice)
    ) {
      return;
    } else if (orderType === 'market' && !Boolean(orderAmount)) {
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

  function placeOrder() {
    if (paying) {
      return;
    }
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
    if (!validateOrder(funds)) {
      return;
    }

    setPaying(true);
    createOceanOrder({
      variables: {
        input: {
          oceanMarketId: market.id,
          side: orderSide,
          orderType,
          price: orderPrice,
          funds,
        },
      },
    });
  }

  function validateOrder(funds: any) {
    if (!funds.isFinite() || funds.lt('0.00000001')) {
      return;
    }
    const maxPrice = new BigNumber(10);
    const maxAmount = new BigNumber(500000);
    const maxFunds = maxPrice.times(maxAmount);

    if (orderType === 'limit') {
      const price = new BigNumber(orderPrice);
      let quoteMaxPrice = maxPrice;
      if ([USDT_ASSET_ID, PUSD_ASSET_ID].includes(market.quoteAssetId)) {
        quoteMaxPrice = maxPrice.times(10000);
      }
      if (price.gt(quoteMaxPrice)) {
        ToastError(t('price_too_high'));
        return false;
      }
    }

    if (orderSide === 'bid') {
      let minFunds = '0.0001';
      if ([USDT_ASSET_ID, PUSD_ASSET_ID].includes(market.quoteAssetId)) {
        minFunds = '1';
      }
      if (funds.lt(minFunds)) {
        ToastError(t('order_too_small'));
        return false;
      }
      let quoteMaxFunds = maxFunds;
      if ([USDT_ASSET_ID, PUSD_ASSET_ID].includes(market.quoteAssetId)) {
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
      if ([USDT_ASSET_ID, PUSD_ASSET_ID].includes(market.quoteAssetId)) {
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

  function parseNumber(str: any) {
    if (str === undefined || str === '') {
      return new BigNumber(0);
    }
    const value: any = new BigNumber(str);

    if (isNaN(value)) {
      return new BigNumber(0);
    }

    return value;
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
                type='price'
                value={orderPrice}
                onChange={(value: string) => setOrderPrice(value)}
                placeholder={`${t('price')}(${market.quoteAsset.symbol})`}
                className='w-full h-10 p-2 text-base text-center border rounded'
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
          <div className='mb-2 text-base text-gray-700'>
            {t('market_order_warning')}
          </div>
        )}
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
            {orderSide === 'bid'
              ? `${t('buy')} ${market.baseAsset.symbol}`
              : `${t('sell')} ${market.baseAsset.symbol}`}
          </div>
        )}
      </div>
    </div>
  );
}
