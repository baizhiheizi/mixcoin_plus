import { useWebSocket } from 'ahooks';
import { orderBookMessageReducer } from 'apps/application/reducers';
import {
  BigNumberConfig,
  ITrade,
  parseBookNumber,
  WS_ENDPOINT,
} from 'apps/application/utils';
import { ReadyState } from 'apps/shared';
import BigNumber from 'bignumber.js';
import { Market } from 'graphqlTypes';
import pako from 'pako';
import React, { useEffect, useReducer } from 'react';
import { useTranslation } from 'react-i18next';
import { v4 as uuid } from 'uuid';
import { ActivityIndicator } from 'zarm';

BigNumber.config(BigNumberConfig);

export default function BookComponent(props: {
  market: Partial<Market>;
  setOrderPrice: (params: any) => any;
  setOrderAmount: (params: any) => any;
  ticker?: ITrade;
  timestamp?: number;
  setTimestamp: (params: number) => any;
}) {
  const { t } = useTranslation();
  const { market, setOrderPrice, setOrderAmount, ticker, setTimestamp } = props;
  const [book, dispatchBook] = useReducer(orderBookMessageReducer, {
    asks: [],
    bids: [],
  });

  const { sendMessage, readyState, latestMessage } = useWebSocket(WS_ENDPOINT, {
    onMessage: () => {},
    onOpen: () => {},
    onError: (e) => {
      console.error(e);
    },
    reconnectLimit: Infinity,
    reconnectInterval: 500,
  });

  useEffect(() => {
    if (readyState === ReadyState.Open) {
      const msg = {
        action: 'SUBSCRIBE_BOOK',
        id: uuid().toLowerCase(),
        params: { market: market?.oceanMarketId },
      };
      sendMessage && sendMessage(pako.gzip(JSON.stringify(msg)));
    }
  }, [market, readyState]);

  useEffect(() => {
    if (latestMessage) {
      const fileReader = new FileReader();
      fileReader.onload = (e: any) => {
        let msg: any = pako.ungzip(new Uint8Array(e.target.result), {
          to: 'string',
        });
        try {
          msg = JSON.parse(msg);
        } catch {
          msg = {};
        }
        dispatchBook(msg.data);
        setTimestamp(Date.now());
      };
      fileReader.readAsArrayBuffer(latestMessage.data);
    }
  }, [market, latestMessage]);

  return (
    <>
      <div className='h-48 text-xs'>
        <div className='flex items-center justify-between mb-2'>
          <div>
            {t('price')}({market.quoteAsset.symbol})
          </div>
          <div>
            {t('volume')}({market.baseAsset.symbol})
          </div>
        </div>
        {book.asks.length > 0 ? (
          <div className='flex flex-col-reverse'>
            {book.asks.slice(0, 10).map((ask, index) => (
              <div
                key={index}
                className='flex items-center justify-between'
                onClick={() => {
                  setOrderPrice(new BigNumber(ask.price).toFixed(4));
                  setOrderAmount(new BigNumber(ask.amount).toFixed(4));
                }}
              >
                <div className='text-red-500'>{parseBookNumber(ask.price)}</div>
                <div className='text-gray-500'>
                  {parseBookNumber(ask.amount)}
                </div>
              </div>
            ))}
          </div>
        ) : readyState === ReadyState.Open ? (
          <div className='text-center text-red-500'>{t('no_ask_order')}</div>
        ) : (
          <div className='flex p-4'>
            <ActivityIndicator type='spinner' className='m-auto' />
          </div>
        )}
      </div>
      <div className='h-48 text-xs'>
        <div className='flex items-center justify-between p-1 mb-2 bg-gray-200 dark:bg-gray-500'>
          <div
            className={`${
              ticker?.side === 'ASK' ? 'text-red-500' : 'text-green-500'
            } font-bold`}
          >
            {ticker?.price || '-'}
          </div>
        </div>
        {book.bids.length > 0 ? (
          book.bids.slice(0, 10).map((bid, index) => (
            <div
              key={index}
              className='flex items-center justify-between'
              onClick={() => {
                setOrderPrice(new BigNumber(bid.price).toFixed(4));
                setOrderAmount(new BigNumber(bid.amount).toFixed(4));
              }}
            >
              <div className='text-green-500'>{parseBookNumber(bid.price)}</div>
              <div className='text-gray-500'>{parseBookNumber(bid.amount)}</div>
            </div>
          ))
        ) : readyState === ReadyState.Open ? (
          <div className='text-center text-green-500'>{t('no_bid_order')}</div>
        ) : (
          <div className='flex p-4'>
            <ActivityIndicator type='spinner' className='m-auto' />
          </div>
        )}
      </div>
    </>
  );
}
