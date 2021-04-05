import { useInterval } from 'ahooks';
import LoaderComponent from 'apps/application/components/LoaderComponent/LoaderComponent';
import {
  fetchTrades,
  ITick,
  ITrade,
  WS_ENDPOINT,
} from 'apps/application/utils';
import BigNumber from 'bignumber.js';
import { Market, useMarketQuery } from 'graphqlTypes';
import pako from 'pako';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useParams } from 'react-router';
import useWebSocket from 'react-use-websocket';
import { v4 as uuid } from 'uuid';
import { Tabs } from 'zarm';
import BookComponent from './components/BookComponent';
import DepthChartComponent from './components/DepthChartComponent';
import HeaderComponent from './components/HeaderComponent';
import HistoryTradesComponent from './components/HistoryTradesComponent';
import PriceChartComponent from './components/PriceChartComponent';
BigNumber.config({
  FORMAT: {
    decimalSeparator: '.',
    groupSeparator: ',',
    groupSize: 3,
    secondaryGroupSize: 0,
  },
});

export default function MarketPage() {
  const history = useHistory();
  const { t } = useTranslation();
  const { marketId } = useParams<{ marketId: string }>();
  const { loading, data } = useMarketQuery({
    variables: { id: marketId },
  });
  const [bookConnected, setBookConnected] = useState(false);
  const [tradesFetched, setTradesFetched] = useState(false);
  const [trades, setTrades] = useState<ITrade[]>([]);
  const [book, setBook] = useState<{
    asks: ITick[];
    bids: ITick[];
  }>({ asks: [], bids: [] });

  async function refreshTrades() {
    if (data?.market) {
      const res = await fetchTrades(data?.market?.oceanMarketId);
      if (res?.data?.data) {
        setTrades(res.data.data);
        if (!tradesFetched) {
          setTradesFetched(true);
        }
      }
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
        setBookConnected(true);
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

  useEffect(() => {
    refreshTrades();
  }, [marketId]);

  useInterval(() => {
    refreshTrades();
  }, 5000);

  if (loading) {
    return <LoaderComponent />;
  }

  const { market } = data;

  if (!Boolean(market)) {
    return <div className='pt-32 text-center'>:(</div>;
  }

  return (
    <div className='pb-20'>
      <HeaderComponent market={market} />
      <PriceChartComponent
        market={market}
        trades={trades}
        fetched={tradesFetched}
      />
      <div className='mb-1'>
        <Tabs className='bg-white dark:bg-dark' defaultValue={0}>
          <Tabs.Panel title={t('open_orders')}>
            <BookComponent
              market={market}
              book={book}
              connected={bookConnected}
            />
          </Tabs.Panel>
          <Tabs.Panel title={t('depth_chart')}>
            <DepthChartComponent
              asks={book.asks}
              bids={book.bids}
              connected={bookConnected}
            />
          </Tabs.Panel>
          <Tabs.Panel title={t('history_trades')}>
            <HistoryTradesComponent
              fetched={tradesFetched}
              market={market as Market}
              trades={trades.slice(0, 20)}
            />
          </Tabs.Panel>
        </Tabs>
      </div>
      <div
        className='fixed bottom-0 z-50 flex w-full py-4 bg-white shadow-inner dark:bg-dark'
        style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      >
        <a
          className='flex-1 py-2 mx-2 text-center text-white bg-green-500 rounded'
          onClick={() => {
            history.push(`/exchange?market=${marketId}&side=bid`);
          }}
        >
          {t('buy')}
        </a>
        <a
          className='flex-1 py-2 mx-2 text-center text-white bg-red-500 rounded'
          onClick={() => {
            history.push(`/exchange?market=${marketId}&side=ask`);
          }}
        >
          {t('sell')}
        </a>
      </div>
    </div>
  );
}
