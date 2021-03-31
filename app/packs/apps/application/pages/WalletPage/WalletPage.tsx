import LoaderComponent from 'apps/application/components/LoaderComponent/LoaderComponent';
import PullComponent from 'apps/application/components/PullComponent/PullComponent';
import TabbarComponent from 'apps/application/components/TabbarComponent/TabbarComponent';
import { useCurrentUser } from 'apps/application/contexts';
import { useUserAssetsQuery } from 'graphqlTypes';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';
import { Button } from 'zarm';

export default function WalletPage() {
  const { currentUser } = useCurrentUser();
  const { t } = useTranslation();
  return (
    <>
      {currentUser ? (
        <UserAssets />
      ) : (
        <div className='flex w-full h-screen'>
          <Button
            className='m-auto'
            theme='primary'
            onClick={() => location.replace('/login')}
          >
            {t('connect_wallet')}
          </Button>
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
  return (
    <>
      <div className='py-4 mb-1 text-2xl text-center text-gray-700 bg-white text-gray-50 dark:bg-dark dark:text-white'>
        ≈ ${total.toFixed(2)}
      </div>
      <PullComponent refetch={refetch} hasNextPage={false}>
        {userAssets.map((asset) => (
          <div
            key={asset.assetId}
            className='flex items-center px-4 py-2 bg-white dark:bg-dark'
            onClick={() => history.push(`/snapshots/${asset.assetId}`)}
          >
            <img
              className='w-10 h-10 mr-2 rounded-full'
              src={asset.iconUrl.replace(/s128$/, 's64')}
            />
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
    </>
  );
}
