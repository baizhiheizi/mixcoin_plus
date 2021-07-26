import { Left as LeftIcon } from '@icon-park/react';
import { imageAsset } from 'apps/application/utils';
import React, { useEffect, useState } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import { NavBar } from 'zarm';

export default function NavbarComponent(props: { title?: string }) {
  const { title } = props;
  const history = useHistory();
  const location = useLocation();
  const [showBack, setShowBack] = useState(location.pathname !== '/');

  useEffect(() => {
    setShowBack(location.pathname !== '/');
  }, [location.pathname]);

  return (
    <NavBar
      className='sticky top-0 z-50 bg-white dark:bg-dark dark:text-white'
      title={
        <div className='flex items-center'>
          <img
            className='w-6 h-6 mr-2 rounded-full'
            src={imageAsset('logo.png')}
          />
          <div className='font-semibold'>{title || 'Mixcoin'}</div>
        </div>
      }
      left={
        showBack && (
          <div
            onClick={() => {
              if (history.length <= 1) {
                history.replace('/');
              } else {
                history.goBack();
              }
            }}
          >
            <LeftIcon size='1.5rem' />
          </div>
        )
      }
    />
  );
}
