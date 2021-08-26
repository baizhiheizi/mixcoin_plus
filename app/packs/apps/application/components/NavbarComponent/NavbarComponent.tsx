import { Left as LeftIcon, Setting as SettingIcon } from '@icon-park/react';
import { imageAsset } from 'apps/application/utils';
import { useMixin } from 'apps/shared';
import React, { useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { Popup } from 'zarm';
import SettingComponent from '../SettingComponent/SettingComponent';

export default function NavbarComponent(props: { title?: string }) {
  const { title } = props;
  const history = useHistory();
  const location = useLocation();
  const { immersive } = useMixin();
  const [showBack, setShowBack] = useState(location.pathname !== '/');
  const [sidebarVisible, setSidebarVisible] = useState(false);

  useEffect(() => {
    setShowBack(location.pathname !== '/');
    setSidebarVisible(false);
  }, [location.pathname]);

  return (
    <>
      <div className='sticky top-0 z-50 flex items-center px-2 py-1 bg-white shadow-sm dark:bg-dark dark:text-white'>
        {showBack && (
          <LeftIcon
            className='text-gray-500'
            size='1.5rem'
            onClick={() => {
              if (history.length <= 1) {
                history.replace('/');
              } else {
                history.goBack();
              }
            }}
          />
        )}
        <div className='flex items-center'>
          <img
            className='w-8 h-8 mx-2 rounded-full'
            src={imageAsset('logo.png')}
          />
          <div className='text-lg font-semibold'>{title || 'Mixcoin'}</div>
        </div>
        <SettingIcon
          className='ml-auto mr-2 text-gray-500'
          size='1.5rem'
          onClick={() => setSidebarVisible(!sidebarVisible)}
        />
        <div className={immersive && 'w-24'} />
      </div>
      <Popup
        direction='left'
        onMaskClick={() => setSidebarVisible(false)}
        visible={sidebarVisible}
      >
        <SettingComponent />
      </Popup>
    </>
  );
}
