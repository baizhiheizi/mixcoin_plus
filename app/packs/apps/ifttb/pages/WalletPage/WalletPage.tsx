import { Left as LeftIcon } from '@icon-park/react';
import { useCurrentUser } from 'apps/ifttb/contexts';
import LoaderComponent from 'apps/shared/components/LoaderComponent/LoaderComponent';
import { useIfttbBrokerBalanceQuery } from 'graphqlTypes';
import React from 'react';
import { useHistory } from 'react-router-dom';

export default function WalletPage() {
  const history = useHistory();
  const { currentUser } = useCurrentUser();
  const { loading, data } = useIfttbBrokerBalanceQuery({ skip: !currentUser });

  if (loading) {
    return <LoaderComponent />;
  }

  if (!currentUser) {
    location.replace('/ifttb/login');
    return;
  }

  const { ifttbBrokerBalance: assets } = data;

  const total = assets
    .map((asset: any) => parseFloat(asset.balance) * parseFloat(asset.priceUsd))
    .reduce((prev, cur) => prev + cur, 0);
  const totalBtc = assets.reduce(
    (prev: any, cur: any) =>
      prev + parseFloat(cur.balance) * parseFloat(cur.priceBtc),
    0,
  );

  return (
    <>
      <div className='relative p-4 text-xl font-bold'>
        <LeftIcon
          onClick={() => history.goBack()}
          className='absolute pt-1 left-8'
          size='1.25rem'
        />
        <div className='text-center'>IFTTB Wallet</div>
      </div>
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
      <div className='flex items-center justify-center mb-4'>
        <div
          onClick={() =>
            location.replace(`mixin://transfer/${currentUser.ifttbBrokerId}`)
          }
          className='px-4 py-2 text-white rounded-full bg-dark'
        >
          Deposit
        </div>
      </div>
      {assets.map((asset) => (
        <div
          className='flex items-center justify-between px-4 py-2'
          key={asset.assetId}
        >
          <div className='flex items-center space-x-4'>
            <div className='relative'>
              <img className='w-10 h-10 rounded-full' src={asset.iconUrl} />
              {asset.chainAsset && (
                <img
                  className='absolute bottom-0 left-0 w-4 h-4 border border-white rounded-full'
                  src={asset.chainAsset.iconUrl.replace(/s128/, 's32')}
                />
              )}
            </div>
            <span>{asset.symbol}</span>
          </div>
          <div className=''>{asset.balance}</div>
        </div>
      ))}
    </>
  );
}
