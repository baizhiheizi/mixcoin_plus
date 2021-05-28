import { useInterval, useWebSocket } from 'ahooks';
import LoaderComponent from 'apps/application/components/LoaderComponent/LoaderComponent';
import NavbarComponent from 'apps/application/components/NavbarComponent/NavbarComponent';
import { orderBookMessageReducer } from 'apps/application/reducers';
import { fetchTrades, ITrade, WS_ENDPOINT } from 'apps/application/utils';
import { ReadyState } from 'apps/shared';
import BigNumber from 'bignumber.js';
import { Market, useMarketQuery } from 'graphqlTypes';
import pako from 'pako';
import React, { useEffect, useReducer, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useParams } from 'react-router';
import { v4 as uuid } from 'uuid';
import { Tabs } from 'zarm';
import ActionBarComponent from './components/ActionBarComponent';
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
  const [tradesFetched, setTradesFetched] = useState(false);
  const [trades, setTrades] = useState<ITrade[]>([]);
  const [book, dispatchBook] = useReducer(orderBookMessageReducer, {
    asks: [],
    bids: [],
  });
  const [subscribed, setSubscribed] = useState(false);

  async function refreshTrades() {
    if (data?.market?.oceanMarketId) {
      const res = await fetchTrades(data?.market?.oceanMarketId);
      if (res?.data?.data) {
        setTrades(res.data.data);
        if (!tradesFetched) {
          setTradesFetched(true);
        }
      }
    }
  }

  const { latestMessage, sendMessage, readyState } = useWebSocket(WS_ENDPOINT, {
    onError: (e) => {
      console.error(e);
    },
    reconnectLimit: Infinity,
    reconnectInterval: 500,
  });

  const sendSubscribeMessage = () => {
    const msg = {
      action: 'SUBSCRIBE_BOOK',
      id: uuid().toLowerCase(),
      params: { market: market?.oceanMarketId },
    };
    sendMessage(pako.gzip(JSON.stringify(msg)));
  };

  useEffect(() => {
    if (readyState === ReadyState.Open) {
      sendSubscribeMessage();
    }
  }, [marketId, readyState]);

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
        if (!subscribed && msg.data?.event === 'BOOK-T0') {
          setSubscribed(true);
        }
        dispatchBook(msg.data);
      };
      fileReader.readAsArrayBuffer(latestMessage.data);
    }
  }, [marketId, latestMessage]);
  useInterval(
    () => {
      refreshTrades();
    },
    5000,
    { immediate: true },
  );

  useInterval(() => {
    if (subscribed) {
      return;
    }
    sendSubscribeMessage();
  }, 1000);

  useEffect(() => {
    if (data?.market) {
      document.title = `${data.market.baseAsset.symbol}/${data.market.quoteAsset.symbol}`;
    }

    return () => {
      document.title = 'Mixcoin';
    };
  }, [data?.market]);

  if (loading) {
    return <LoaderComponent />;
  }

  const { market } = data;

  if (!Boolean(market)) {
    return <div className='pt-32 text-center'>:(</div>;
  }

  return (
    <div className='pb-28'>
      <NavbarComponent back />
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
              connected={readyState === ReadyState.Open}
            />
          </Tabs.Panel>
          <Tabs.Panel title={t('depth_chart')}>
            <DepthChartComponent
              asks={book.asks}
              bids={book.bids}
              connected={readyState === ReadyState.Open}
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
      <ActionBarComponent market={market as Market} />
    </div>
  );
}
