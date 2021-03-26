import { useCurrentUser } from 'apps/application/contexts';
import React, { useState } from 'react';
import { User as UserIcon } from 'react-feather';
import { useTranslation } from 'react-i18next';
import { Popup, Tabs } from 'zarm';
import { MarketsComponent } from './components/MarketsComponent';
import MineComponent from './components/MineComponent';

export default function HomePage() {
  const { currentUser } = useCurrentUser();
  const tabs = ['favorite', 'pUSD', 'BTC', 'XIN', 'USDT'];
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const cachedTabIndex = tabs.findIndex(
    (tab) => tab === localStorage.getItem('_cachedQuote'),
  );
  const [tabIndex, setTabIndex] = useState(
    cachedTabIndex > -1 ? cachedTabIndex : currentUser ? 0 : 1,
  );
  const { t } = useTranslation();

  return (
    <>
      <div className='fixed z-10 flex items-center w-full bg-white'>
        {currentUser ? (
          <img
            className='w-6 h-6 mx-2 rounded-full'
            src={currentUser.avatar.replace(/s128$/, 's32')}
            onClick={() => setSidebarVisible(!sidebarVisible)}
          />
        ) : (
          <UserIcon
            className='w-6 h-6 mx-2'
            onClick={() => setSidebarVisible(!sidebarVisible)}
          />
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
          <Tabs.Panel title='pUSD'></Tabs.Panel>
          <Tabs.Panel title='BTC'></Tabs.Panel>
          <Tabs.Panel title='XIN'></Tabs.Panel>
          <Tabs.Panel title='USDT'></Tabs.Panel>
        </Tabs>
      </div>
      <div className='pt-12 pb-16 bg-white'>
        <MarketsComponent type={tabs[tabIndex]} />
      </div>
      <Popup
        direction='left'
        onMaskClick={() => setSidebarVisible(false)}
        visible={sidebarVisible}
      >
        <MineComponent />
      </Popup>
    </>
  );
}
