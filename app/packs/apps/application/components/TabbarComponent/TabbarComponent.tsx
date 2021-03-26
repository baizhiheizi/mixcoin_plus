import React from 'react';
import {
  BarChart2 as BarChartIcon,
  DollarSign as DollarSignIcon,
  RefreshCw as RefreshCwIcon,
} from 'react-feather';
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
            icon={<BarChartIcon />}
          />
          <TabBar.Item
            itemKey='exchange'
            title={t('exchange')}
            icon={<RefreshCwIcon />}
          />
          <TabBar.Item
            itemKey='wallet'
            title={t('wallet')}
            icon={<DollarSignIcon />}
          />
        </TabBar>
        <div
          className='fixed bottom-0 w-full bg-white'
          style={{ height: 'env(safe-area-inset-bottom)' }}
        />
      </div>
    </>
  );
}
