import { useInterval } from 'ahooks';
import LoaderComponent from 'apps/application/components/LoaderComponent/LoaderComponent';
import NavbarComponent from 'apps/application/components/NavbarComponent/NavbarComponent';
import TabbarComponent from 'apps/application/components/TabbarComponent/TabbarComponent';
import { useCurrentUser } from 'apps/application/contexts';
import { fetchTiker, ITrade } from 'apps/application/utils';
import { Market, useMarketQuery } from 'graphqlTypes';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';
import { Button, Modal, Tabs } from 'zarm';
import ActionComponent from './components/ActionComponent';
import BookComponent from './components/BookComponent';
import HeaderComponent from './components/HeaderComponent';
import OceanOrdersComponent from './components/OceanOrdersComponent';

export default function ExchangePage() {
  const history = useHistory();
  const marketIdParam = new URLSearchParams(history.location.search).get(
    'market',
  );
  const { t } = useTranslation();
  const { currentUser } = useCurrentUser();
  const [marketId, setMarketId] = useState(
    marketIdParam || localStorage.getItem('_cachedMarketId') || '',
  );
  const [orderPrice, setOrderPrice] = useState<string>('');
  const [orderAmount, setOrderAmount] = useState<string>('');
  const { loading, data } = useMarketQuery({
    variables: { id: marketId },
  });
  const [ticker, setTicker] = useState<ITrade>();

  async function refreshTicker() {
    if (data?.market?.oceanMarketId) {
      const res = await fetchTiker(data?.market?.oceanMarketId);
      if (res.data && res.data.data) {
        setTicker(res.data.data);
      }
    }
  }

  useEffect(() => {
    if (!marketIdParam) {
      history.replace({
        ...history.location,
        search: `?market=${marketId}`,
      });
    }
  }, [marketId]);

  useEffect(() => {
    refreshTicker();
  }, [data?.market]);

  useInterval(() => {
    refreshTicker();
  }, 5000);

  if (loading) {
    return <LoaderComponent />;
  }

  const { market } = data;

  if (!Boolean(market)) {
    return <div className='pt-32 text-center'>:(</div>;
  }

  if (market.id !== marketId) {
    setMarketId(market.id);
  }

  return (
    <div className='pb-24'>
      <NavbarComponent />
      <HeaderComponent
        market={market}
        setMarketId={setMarketId}
        ticker={ticker}
      />
      <div className='flex items-center p-4 mb-1 bg-white dark:bg-dark'>
        <div className='w-3/5 pr-2 h-96'>
          <ActionComponent
            market={market as Market}
            orderPrice={orderPrice}
            setOrderPrice={setOrderPrice}
            orderAmount={orderAmount}
            setOrderAmount={setOrderAmount}
          />
        </div>
        <div className='w-2/5'>
          <BookComponent
            market={market as Market}
            setOrderPrice={setOrderPrice}
            setOrderAmount={setOrderAmount}
            ticker={ticker}
          />
        </div>
      </div>
      <div className='mb-1 overflow-y-scroll bg-white min-h-72 overscroll-y-contain dark:bg-dark'>
        {currentUser && (
          <Tabs defaultValue={0}>
            <Tabs.Panel title={t('my_open_orders')}>
              <OceanOrdersComponent marketId={market.id} filter='booking' />
            </Tabs.Panel>
            <Tabs.Panel title={t('my_order_history')}>
              <OceanOrdersComponent marketId={market.id} filter='history' />
            </Tabs.Panel>
          </Tabs>
        )}
      </div>
      <Modal
        visible={!currentUser}
        maskClosable
        onCancel={() => history.replace('/')}
        footer={
          <Button
            block
            theme='primary'
            onClick={() => location.replace('/login')}
          >
            {t('connect_wallet')}
          </Button>
        }
      ></Modal>
      <TabbarComponent activeTabKey='exchange' />
    </div>
  );
}
