import { Close as CloseIcon, Left as LeftIcon } from '@icon-park/react';
import PullComponent from 'apps/application/components/PullComponent/PullComponent';
import { useCurrentUser } from 'apps/ifttb/contexts';
import LoaderComponent from 'apps/shared/components/LoaderComponent/LoaderComponent';
import {
  MixinAsset,
  useIfttbBrokerBalanceQuery,
  useIfttbBrokerSnapshotsQuery,
} from 'graphqlTypes';
import moment from 'moment';
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Popup } from 'zarm';

export default function WalletPage() {
  const history = useHistory();
  const { currentUser } = useCurrentUser();
  const [selectedAsset, setSelectedAsset] = useState(null);
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
    .map(
      (asset: Partial<MixinAsset> | any) =>
        parseFloat(asset.balance) * parseFloat(asset.priceUsd),
    )
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
      <div className='flex items-center justify-center mb-4 space-x-6'>
        <div
          onClick={() =>
            location.replace(`mixin://transfer/${currentUser.ifttbBrokerId}`)
          }
          className='px-4 py-2 text-white rounded-full bg-dark'
        >
          Deposit
        </div>
        <div
          className='px-4 py-2 border rounded-full'
          onClick={() => history.push('/withdraw')}
        >
          Withdraw
        </div>
      </div>
      {assets.map((asset) => (
        <div
          className='flex items-center justify-between px-4 py-2'
          key={asset.assetId}
          onClick={() => setSelectedAsset(asset)}
        >
          <div className='flex items-center space-x-4'>
            <div className='relative'>
              <img className='w-10 h-10 rounded-full' src={asset.iconUrl} />
            </div>
            <span>{asset.symbol}</span>
          </div>
          <div className=''>{asset.balance}</div>
        </div>
      ))}
      <Popup
        visible={Boolean(selectedAsset)}
        direction='bottom'
        onMaskClick={() => {
          setSelectedAsset(null);
        }}
      >
        <div className='h-screen overflow-scroll bg-white'>
          <div className='relative sticky top-0 z-10 p-4 text-xl font-bold text-white bg-dark'>
            <CloseIcon
              onClick={() => {
                setSelectedAsset(null);
              }}
              className='absolute pt-1 left-8'
              size='1.25rem'
            />
            <div className='text-center'>Snapshots</div>
          </div>
          {selectedAsset && <IfttbBrokerAssetComponent asset={selectedAsset} />}
          <IfttbBrokerSnapshotsComponent assetId={selectedAsset?.assetId} />
        </div>
      </Popup>
    </>
  );
}

function IfttbBrokerAssetComponent(props: { asset: Partial<MixinAsset> }) {
  const { asset } = props;
  return (
    <>
      <div className='py-6 mb-1 text-center bg-white dark:bg-dark'>
        <div className='flex items-center justify-center'>
          <img src={asset.iconUrl} className='w-10 h-10 mr-2 rounded-full' />
          <div className='text-3xl'>{asset.balance.toFixed(2)}</div>
        </div>
        <div className='flex items-start justify-center text-xs'>
          <div className='mr-1 text-gray-500 dark:text-gray-100'>≈ $</div>
          <div className=''>{(asset.priceUsd * asset.balance).toFixed(2)}</div>
        </div>
      </div>
    </>
  );
}

function IfttbBrokerSnapshotsComponent(props: { assetId?: string }) {
  const { loading, data, refetch, fetchMore } = useIfttbBrokerSnapshotsQuery({
    variables: { asset: props.assetId },
  });

  if (loading) {
    return <LoaderComponent />;
  }

  const { ifttbBrokerSnapshots: snapshots } = data;

  return (
    <PullComponent
      hasNextPage={snapshots.length % 50 === 0}
      refetch={refetch}
      fetchMore={() =>
        fetchMore({
          variables: { offset: snapshots[snapshots.length - 1].createdAt },
        })
      }
    >
      {snapshots.map((snapshot) => (
        <div
          key={snapshot.snapshotId}
          className='flex items-center px-4 py-2 bg-white dark:bg-dark'
        >
          <div className='relative'>
            <img
              className='w-8 h-8 rounded-full'
              src={snapshot.asset.iconUrl.replace(/s128$/, 's64')}
            />
            {snapshot.asset.chainAsset && (
              <img
                className='absolute bottom-0 left-0 w-2.5 h-2.5 border border-white rounded-full'
                src={snapshot.asset.chainAsset.iconUrl.replace(/s128/, 's32')}
              />
            )}
          </div>
          <div
            className={`text-bold text-lg ml-2 ${
              snapshot.amount < 0 ? 'text-red-500' : 'text-green-500'
            }`}
          >
            {snapshot.amount > 0 && '+'}
            {snapshot.amount.toFixed(8)}
          </div>
          <div className='ml-1 text-xs font-light'>{snapshot.asset.symbol}</div>
          <div className='ml-auto text-xs text-gray-500 dark:text-gray-300'>
            {moment(snapshot.createdAt).format('YYYY-MM-DD HH:mm:ss')}
          </div>
        </div>
      ))}
    </PullComponent>
  );
}
