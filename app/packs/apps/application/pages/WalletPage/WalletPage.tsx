import LoaderComponent from 'apps/application/components/LoaderComponent/LoaderComponent';
import LoginComponent from 'apps/application/components/LoginComponent/LoginComponent';
import NavbarComponent from 'apps/application/components/NavbarComponent/NavbarComponent';
import PullComponent from 'apps/application/components/PullComponent/PullComponent';
import TabbarComponent from 'apps/application/components/TabbarComponent/TabbarComponent';
import { useCurrentUser } from 'apps/application/contexts';
import { useUserAssetsQuery } from 'graphqlTypes';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';
import { Button } from 'zarm';

export default function WalletPage() {
  const { currentUser } = useCurrentUser();
  const { t } = useTranslation();
  const [logging, setLogging] = useState(false);
  return (
    <>
      {currentUser ? (
        <UserAssets />
      ) : (
        <div className='flex w-full h-screen'>
          <Button
            className='m-auto'
            theme='primary'
            onClick={() => setLogging(true)}
          >
            {t('connect_wallet')}
          </Button>
          <LoginComponent logging={logging} setLogging={setLogging} />
        </div>
      )}
      <TabbarComponent activeTabKey='wallet' />
    </>
  );
}

function UserAssets() {
  const { currentUser } = useCurrentUser();
  const { t } = useTranslation();
  const history = useHistory();
  const { loading, data, refetch } = useUserAssetsQuery({ skip: !currentUser });

  if (loading) {
    return <LoaderComponent />;
  }

  const { userAssets = [] } = data || {};
  const total = userAssets
    .map((asset) => asset.balanceUsd)
    .reduce((prev, cur) => prev + cur, 0);
  const totalBtc = userAssets.reduce(
    (prev, cur) => prev + cur.balance * cur.priceBtc,
    0,
  );

  return (
    <div className='pb-24'>
      <NavbarComponent />
      <div className='py-6 mb-1 text-center bg-white dark:bg-dark'>
        <div className='flex items-start justify-center'>
          <div className='mr-1 text-gray-500 dark:text-gray-100'>$</div>
          <div className='text-3xl'>{total.toFixed(2)}</div>
        </div>
        <div className='flex items-start justify-center text-xs'>
          <div className='mr-1'>{totalBtc.toFixed(8)}</div>
          <div className='text-gray-500 dark:text-gray-100'>BTC</div>
        </div>
      </div>
      <PullComponent refetch={refetch} hasNextPage={false}>
        {userAssets.map((asset) => (
          <div
            key={asset.assetId}
            className='flex items-center px-4 py-2 bg-white dark:bg-dark'
            onClick={() => history.push(`/snapshots/${asset.assetId}`)}
          >
            <div className='relative'>
              <img
                className='w-10 h-10 mr-2 rounded-full'
                src={asset.iconUrl.replace(/s128$/, 's64')}
              />
              {asset.chainAsset && (
                <img
                  className='absolute bottom-0 left-0 w-4 h-4 border border-white rounded-full'
                  src={asset.chainAsset.iconUrl.replace(/s128/, 's32')}
                />
              )}
            </div>
            <div className=''>
              <div className='flex items-baseline'>
                <div className='mr-1 text-base font-bold'>{asset.balance}</div>
                <div className='text-sm font-light'>{asset.symbol}</div>
              </div>
              <div className='text-xs text-gray-300'>
                ≈ ${asset.balanceUsd.toFixed(2)}
              </div>
            </div>
            <div className='ml-auto text-right'>
              <div
                className={`${
                  asset.changeUsd > 0 ? 'text-green-500' : 'text-red-500'
                }`}
              >
                {(asset.changeUsd * 100).toFixed(2)}%
              </div>
              <div className='text-xs text-gray-300'>
                ≈ ${asset.priceUsd.toFixed(2)}
              </div>
            </div>
          </div>
        ))}
      </PullComponent>
    </div>
  );
}
