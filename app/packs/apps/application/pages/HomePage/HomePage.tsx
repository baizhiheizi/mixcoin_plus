import React, { useState } from 'react';
import { Home as HomeIcon, User as UserIcon } from 'react-feather';
import { useTranslation } from 'react-i18next';
import { useHistory, useLocation } from 'react-router';
import { TabBar } from 'zarm';
import HomeComponent from './components/HomeComponent';
import MineComponent from './components/MineComponent';

type ITabKey = 'home' | 'mine';

export default function HomePage() {
  const { t } = useTranslation();
  const history = useHistory();
  const location = useLocation<{ activeTabKey?: ITabKey }>();
  const [activeTabKey, setActiveTabKey] = useState<ITabKey>(
    location.state?.activeTabKey || 'home',
  );

  return (
    <>
      <div className='fixed z-50 shadow-inner'>
        <TabBar
          activeKey={activeTabKey}
          onChange={(value: ITabKey) => {
            setActiveTabKey(value);
            history.replace({
              ...history.location,
              state: { ...location.state, activeTabKey: value },
            });
          }}
        >
          <TabBar.Item itemKey='home' title={t('home')} icon={<HomeIcon />} />
          <TabBar.Item itemKey='mine' title={t('mine')} icon={<UserIcon />} />
        </TabBar>
      </div>
      {activeTabKey === 'home' && <HomeComponent />}
      {activeTabKey === 'mine' && <MineComponent />}
    </>
  );
}
