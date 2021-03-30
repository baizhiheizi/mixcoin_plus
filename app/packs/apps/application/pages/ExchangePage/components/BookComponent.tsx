import { useInterval } from 'ahooks';
import { fetchTiker, ITick, ITrade, WS_ENDPOINT } from 'apps/application/utils';
import BigNumber from 'bignumber.js';
import { Market } from 'graphqlTypes';
import pako from 'pako';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import useWebSocket from 'react-use-websocket';
import { v4 as uuid } from 'uuid';
import { ActivityIndicator } from 'zarm';

BigNumber.config({
  FORMAT: {
    decimalSeparator: '.',
    groupSeparator: ',',
    groupSize: 3,
    secondaryGroupSize: 0,
  },
});

export default function BookComponent(props: {
  market: Partial<Market>;
  setOrderPrice: (params: any) => any;
  setOrderAmount: (params: any) => any;
}) {
  const { t } = useTranslation();
  const { market, setOrderPrice, setOrderAmount } = props;
  const [connected, setConnected] = useState(false);
  const [book, setBook] = useState<{
    asks: ITick[];
    bids: ITick[];
  }>({ asks: [], bids: [] });
  const [ticker, setTicker] = useState<ITrade>();

  async function refreshTicker() {
    const res = await fetchTiker(market.oceanMarketId);
    if (res.data && res.data.data) {
      setTicker(res.data.data);
    }
  }

  function handleOrderOpenOnBook(tick: ITick) {
    const price = new BigNumber(tick.price);
    const amount = new BigNumber(tick.amount);
    const { asks, bids } = book;

    if (tick.side === 'ASK') {
      for (let i = 0; i < book.asks.length; i++) {
        const bo = book.asks[i];
        const bp = new BigNumber(bo.price);
        if (bp.isEqualTo(price)) {
          bo.amount = new BigNumber(bo.amount).plus(amount).toFixed(4);
          return;
        }
        if (bp.isGreaterThan(price)) {
          book.asks.splice(i, 0, tick);
          return;
        }
      }
      asks.push(tick);
    } else if (tick.side === 'BID') {
      for (let i = 0; i < book.bids.length; i++) {
        const bo = book.bids[i];
        const bp = new BigNumber(bo.price);
        if (bp.isEqualTo(price)) {
          bo.amount = new BigNumber(bo.amount).plus(amount).toFixed(4);
          return;
        }
        if (bp.isLessThan(price)) {
          book.bids.splice(i, 0, tick);
          return;
        }
      }
      bids.push(tick);
    }
    setBook(Object.assign({}, { asks, bids }));
  }

  function handleOrderRemoveFromBook(tick: ITick) {
    const price = new BigNumber(tick.price);
    const amount = new BigNumber(tick.amount);

    const { asks, bids } = book;
    if (tick.side === 'BID') {
      const index = bids.findIndex((bid) =>
        new BigNumber(bid.price).isEqualTo(price),
      );
      if (index > -1) {
        bids[index].amount = new BigNumber(bids[index].amount)
          .minus(amount)
          .toFixed(4);
        if (bids[index].amount === '0.0000') {
          bids.splice(index, 1);
        }
      }
    } else if (tick.side === 'ASK') {
      const index = asks.findIndex((ask) =>
        new BigNumber(ask.price).isEqualTo(price),
      );
      if (index > -1) {
        asks[index].amount = new BigNumber(asks[index].amount)
          .minus(amount)
          .toFixed(4);
        if (asks[index].amount === '0.0000') {
          asks.splice(index, 1);
        }
      }
    }

    setBook(Object.assign({}, { asks, bids }));
  }

  function handleMessage(raw: string) {
    let msg: any;
    try {
      msg = JSON.parse(raw);
    } catch {
      msg = {};
    }
    switch (msg.data.event) {
      case 'BOOK-T0':
        const { asks, bids } = msg.data.data;
        setBook({ asks: asks.slice(0, 1000), bids: bids.slice(0, 1000) });
        setConnected(true);
        break;
      case 'HEARTBEAT':
        return;
      case 'ORDER-OPEN':
        handleOrderOpenOnBook(msg.data.data);
        break;
      case 'ORDER-CANCEL':
        handleOrderRemoveFromBook(msg.data.data);
        break;
      case 'ORDER-MATCH':
        handleOrderRemoveFromBook(msg.data.data);
        break;
    }
  }

  const { sendMessage } = useWebSocket(WS_ENDPOINT, {
    onMessage: (event) => {
      const fileReader = new FileReader();
      fileReader.onload = (e: any) => {
        const msg = pako.ungzip(new Uint8Array(e.target.result), {
          to: 'string',
        });
        handleMessage(msg);
      };
      fileReader.readAsArrayBuffer(event.data);
    },
    onOpen: () => {
      const msg = {
        action: 'SUBSCRIBE_BOOK',
        id: uuid().toLowerCase(),
        params: { market: market.oceanMarketId },
      };
      sendMessage(pako.gzip(JSON.stringify(msg)));
    },
    reconnectAttempts: Infinity,
    reconnectInterval: 1000,
    retryOnError: true,
    shouldReconnect: () => true,
  });

  const parseNumber = (str: string) => {
    const number = new BigNumber(str);
    if (number.isLessThan(1)) {
      return number.toFixed(8);
    } else if (number.isLessThan(10)) {
      return number.toFixed(6);
    } else if (number.isLessThan(100)) {
      return number.toFixed(4);
    } else if (number.isLessThan(10000)) {
      return number.toFixed(2);
    } else {
      return number.toFixed(0);
    }
  };

  useEffect(() => {
    refreshTicker();
  }, [market]);

  useInterval(() => {
    refreshTicker();
  }, 5000);

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
          book.asks
            .slice(0, 10)
            .reverse()
            .map((ask, index) => (
              <div
                key={index}
                className='flex items-center justify-between'
                onClick={() => {
                  setOrderPrice(new BigNumber(ask.price).toFixed(8));
                  setOrderAmount(new BigNumber(ask.amount).toFixed(8));
                }}
              >
                <div className='text-green-500'>{parseNumber(ask.price)}</div>
                <div className='text-gray-700'>{parseNumber(ask.amount)}</div>
              </div>
            ))
        ) : connected ? (
          <div className='text-center text-green-500'>{t('no_ask_order')}</div>
        ) : (
          <div className='flex p-4'>
            <ActivityIndicator type='spinner' className='m-auto' />
          </div>
        )}
      </div>
      <div className='h-48 text-xs'>
        <div className='flex items-center justify-between p-1 mb-2 bg-gray-200'>
          <div
            className={`${
              ticker?.side === 'ASK' ? 'text-green-500' : 'text-red-500'
            } font-bold`}
          >
            {ticker?.price || '-'}
          </div>
          {ticker && (
            <div className='px-2 text-gray-500 line-clamp-1'>
              {`≈ $${(
                market.quoteAsset.priceUsd * parseFloat(ticker.price) || 0
              ).toFixed(2)}`}
            </div>
          )}
        </div>
        {book.bids.length > 0 ? (
          book.bids.slice(0, 10).map((bid, index) => (
            <div
              key={index}
              className='flex items-center justify-between'
              onClick={() => {
                setOrderPrice(new BigNumber(bid.price).toFixed(8));
                setOrderAmount(new BigNumber(bid.amount).toFixed(8));
              }}
            >
              <div className='text-red-500'>{parseNumber(bid.price)}</div>
              <div className='text-gray-700'>{parseNumber(bid.amount)}</div>
            </div>
          ))
        ) : connected ? (
          <div className='text-center text-red-500'>{t('no_bid_order')}</div>
        ) : (
          <div className='flex p-4'>
            <ActivityIndicator type='spinner' className='m-auto' />
          </div>
        )}
      </div>
    </>
  );
}
