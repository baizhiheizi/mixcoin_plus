import { useDebounce } from 'ahooks';
import MarketsComponent from 'apps/application/components/MarketsComponent/MarketsComponent';
import TabbarComponent from 'apps/application/components/TabbarComponent/TabbarComponent';
import { useCurrentUser } from 'apps/application/contexts';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Message, SearchBar, Tabs } from 'zarm';

export default function MarketsPage() {
  const { currentUser } = useCurrentUser();
  const { t } = useTranslation();
  const tabs = ['favorite', 'USDT', 'pUSD', 'BTC', 'XIN'];
  const cachedTabIndex = tabs.findIndex(
    (tab) => tab === localStorage.getItem('_cachedQuote'),
  );
  const [tabIndex, setTabIndex] = useState(
    cachedTabIndex > -1 ? cachedTabIndex : currentUser ? 0 : 1,
  );
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, { wait: 500 });

  return (
    <div className='min-h-screen pb-24 bg-white dark:bg-dark'>
      <SearchBar
        placeholder={t('search_any_asset')}
        value={query}
        onChange={(value: string) => setQuery(value)}
        onClear={() => setQuery('')}
        onCancel={() => setQuery('')}
      />
      {!currentUser && (
        <Message size='lg' theme='warning'>
          <div>
            <span>{t('connect_wallet_to_exhange')}</span>
            <a
              className='mx-1 font-semibold cursor-pointer'
              onClick={() => location.replace('/login')}
            >
              {t('connect_wallet')}
            </a>
          </div>
        </Message>
      )}
      <Tabs
        className='flex-1'
        value={tabIndex}
        onChange={(index) => {
          setTabIndex(index);
          localStorage.setItem('_cachedQuote', tabs[index]);
        }}
      >
        <Tabs.Panel title={t('favorite')}></Tabs.Panel>
        <Tabs.Panel title='USDT'></Tabs.Panel>
        <Tabs.Panel title='pUSD'></Tabs.Panel>
        <Tabs.Panel title='BTC'></Tabs.Panel>
        <Tabs.Panel title='XIN'></Tabs.Panel>
      </Tabs>
      <MarketsComponent type={tabs[tabIndex]} query={debouncedQuery} />
      <TabbarComponent activeTabKey='markets' />
    </div>
  );
}
