import {
  ExchangeThree as ExchangeIcon,
  HomeTwo as HomeIcon,
  WalletTwo as WalletIcon,
} from '@icon-park/react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';
import { TabBar } from 'zarm';

type ITabKey = 'home' | 'exchange' | 'wallet';

export default function TabbarComponent(props: { activeTabKey: ITabKey }) {
  const { activeTabKey } = props;
  const { t } = useTranslation();
  const history = useHistory();

  return (
    <>
      <div className='fixed z-50 bg-white shadow-inner'>
        <TabBar
          style={{ bottom: 'env(safe-area-inset-bottom)' }}
          activeKey={activeTabKey}
          onChange={(value: ITabKey) => {
            if (value === 'home') {
              history.replace('/');
            } else {
              history.replace(`/${value}`);
            }
          }}
        >
          <TabBar.Item
            itemKey='home'
            title={t('home')}
            icon={<HomeIcon size='1.5rem' />}
          />
          <TabBar.Item
            itemKey='exchange'
            title={t('exchange')}
            icon={<ExchangeIcon size='1.5rem' />}
          />
          <TabBar.Item
            itemKey='wallet'
            title={t('wallet')}
            icon={<WalletIcon size='1.5rem' />}
          />
        </TabBar>
        <div
          className='fixed bottom-0 w-full bg-white dark:bg-dark'
          style={{ height: 'env(safe-area-inset-bottom)' }}
        />
      </div>
    </>
  );
}
