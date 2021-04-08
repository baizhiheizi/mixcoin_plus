import NavbarComponent from 'apps/application/components/NavbarComponent/NavbarComponent';
import { useCurrentUser } from 'apps/application/contexts';
import { imageAsset } from 'apps/application/utils';
import React, { useState } from 'react';
import { User as UserIcon } from 'react-feather';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';
import { Popup, Tabs } from 'zarm';
import { MarketsComponent } from './components/MarketsComponent';
import MineComponent from './components/MineComponent';

export default function HomePage() {
  const { currentUser } = useCurrentUser();
  const history = useHistory();
  const tabs = ['favorite', 'USDT', 'pUSD', 'BTC', 'XIN'];
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
      <NavbarComponent />
      <div
        className='flex items-center w-full bg-white bg-right bg-no-repeat bg-contain h-36 dark:bg-dark'
        style={{ backgroundImage: `url(${imageAsset('cashback.svg')})` }}
        onClick={() => history.push('/commission')}
      >
        <div className='p-6'>
          <div className='text-xl font-bold text-yellow-500'>
            {t('commission_plan')}
          </div>
          <div className='text-base text-gray-500'>
            {t('grow_along_with_mixcoin')}
          </div>
        </div>
      </div>
      <div className='sticky z-10 flex items-center w-full bg-white top-10 dark:bg-dark'>
        {currentUser ? (
          <img
            className='w-8 h-8 ml-4 mr-2 rounded-full'
            src={currentUser.avatar.replace(/s128$/, 's64')}
            onClick={() => setSidebarVisible(!sidebarVisible)}
          />
        ) : (
          <UserIcon
            className='w-8 h-8 ml-4 mr-2'
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
          <Tabs.Panel title='USDT'></Tabs.Panel>
          <Tabs.Panel title='pUSD'></Tabs.Panel>
          <Tabs.Panel title='BTC'></Tabs.Panel>
          <Tabs.Panel title='XIN'></Tabs.Panel>
        </Tabs>
      </div>
      <div className='min-h-screen pb-16 bg-white dark:bg-dark'>
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
