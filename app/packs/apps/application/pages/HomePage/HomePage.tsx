import { User as UserIcon } from '@icon-park/react';
import LoginComponent from 'apps/application/components/LoginComponent/LoginComponent';
import MarketsComponent from 'apps/application/components/MarketsComponent/MarketsComponent';
import TabbarComponent from 'apps/application/components/TabbarComponent/TabbarComponent';
import { useCurrentUser } from 'apps/application/contexts';
import { useCurrentConversation } from 'apps/application/contexts/CurrentConversationContext';
import { imageAsset } from 'apps/application/utils';
import { useMixin } from 'apps/shared';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';
import { Message, Popup, Tabs } from 'zarm';
import MineComponent from './components/MineComponent';

export default function HomePage() {
  const { currentUser } = useCurrentUser();
  const { currentConversation } = useCurrentConversation();
  const history = useHistory();
  const tabs = ['favorite', 'recommended', 'hot'];
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const cachedTabIndex = tabs.findIndex(
    (tab) => tab === localStorage.getItem('_cachedQuote'),
  );
  const [tabIndex, setTabIndex] = useState(
    cachedTabIndex > -1 ? cachedTabIndex : currentUser ? 0 : 1,
  );
  const { t } = useTranslation();
  const { platform } = useMixin();
  const [logging, setLogging] = useState(false);

  return (
    <div className='min-h-screen pb-24 bg-white dark:bg-dark'>
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
            size='1.5rem'
            className='ml-4 mr-2'
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
          {currentConversation?.category === 'GROUP' ? (
            <Tabs.Panel title={t('group')}></Tabs.Panel>
          ) : (
            <Tabs.Panel title={t('recommend')}></Tabs.Panel>
          )}
          <Tabs.Panel title={t('hot')}></Tabs.Panel>
        </Tabs>
      </div>
      {!currentUser && (
        <Message size='lg' theme='warning'>
          <div>
            <span>{t('connect_wallet_to_exhange')}</span>
            <a
              className='mx-1 font-semibold cursor-pointer'
              onClick={() => {
                if (platform) {
                  location.replace('/login');
                } else {
                  setLogging(true);
                }
              }}
            >
              {t('connect_wallet')}
            </a>
          </div>
          <LoginComponent logging={logging} setLogging={setLogging} />
        </Message>
      )}
      <MarketsComponent type={tabs[tabIndex]} />
      <Popup
        direction='left'
        onMaskClick={() => setSidebarVisible(false)}
        visible={sidebarVisible}
      >
        <MineComponent />
      </Popup>
      <TabbarComponent activeTabKey='home' />
    </div>
  );
}
