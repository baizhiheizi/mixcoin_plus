import { Left as LeftIcon } from '@icon-park/react';
import { imageAsset } from 'apps/application/utils';
import React from 'react';
import { useHistory } from 'react-router';
import { NavBar } from 'zarm';

export default function NavbarComponent(props: {
  title?: string;
  back?: boolean;
}) {
  const { title, back } = props;
  const history = useHistory();
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
        back && (
          <div
            onClick={() => {
              if (history.length === 1) {
                history.push('/');
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
