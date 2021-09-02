import { Down as DownIcon, Left as LeftIcon } from '@icon-park/react';
import { useCurrentUser } from 'apps/ifttb/contexts';
import LoaderComponent from 'apps/shared/components/LoaderComponent/LoaderComponent';
import {
  useCreateIfttbBrokerWithdrawTransferMutation,
  useIfttbBrokerBalanceQuery,
} from 'graphqlTypes';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Loading, Modal, Popup } from 'zarm';

export default function WithdrawPage() {
  const history = useHistory();
  const { currentUser } = useCurrentUser();
  const [assetsPopupVisible, setAssetsPopupVisible] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [amount, setAmount] = useState('');
  const [selectedAsset, setSelectedAsset] = useState(null);
  const { loading, data, refetch } = useIfttbBrokerBalanceQuery({
    skip: !currentUser,
    fetchPolicy: 'cache-and-network',
  });
  const [createIfttbBrokerWithdrawTransfer] =
    useCreateIfttbBrokerWithdrawTransferMutation({
      update: () => {
        Loading.hide();
        refetch();
      },
    });

  useEffect(() => {
    if (data?.ifttbBrokerBalance?.length > 0) {
      setSelectedAsset(data?.ifttbBrokerBalance[0]);
    }
  }, [data?.ifttbBrokerBalance]);

  if (loading) {
    return <LoaderComponent />;
  }

  if (!currentUser) {
    location.replace('/ifttb/login');
    return;
  }

  const { ifttbBrokerBalance: assets } = data;

  const formValidate = () => {
    if (
      !selectedAsset ||
      !parseFloat(amount) ||
      parseFloat(amount) > selectedAsset?.balance
    ) {
      return false;
    }
    return true;
  };

  return (
    <>
      <div className='relative p-4 text-xl font-bold'>
        <LeftIcon
          onClick={() => history.goBack()}
          className='absolute pt-1 left-8'
          size='1.25rem'
        />
        <div className='text-center'>Withdraw</div>
      </div>
      <div className='p-4'>
        <div
          className='flex items-center justify-center mb-4'
          onClick={() => setAssetsPopupVisible(true)}
        >
          {selectedAsset && (
            <div className='flex items-center space-x-4'>
              <img
                src={selectedAsset?.iconUrl}
                className='w-10 h-10 rounded-full'
              />
              <span className='text-lg'>{selectedAsset?.symbol}</span>
              <span className='text-sm text-gray-500'>
                {selectedAsset?.balance}
              </span>
            </div>
          )}
          <DownIcon size='1rem' />
        </div>
        <div className='mb-8 text-center'>
          <input
            placeholder={selectedAsset?.balance || 'Input value'}
            className='p-2 text-center border-b'
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>
        <div
          className={`p-4 text-xl text-center text-white rounded-full bg-dark ${
            formValidate() ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'
          }`}
          onClick={() => {
            if (formValidate()) {
              setConfirming(true);
            }
          }}
        >
          Withdraw
        </div>
      </div>
      <Popup
        visible={assetsPopupVisible}
        direction='bottom'
        onMaskClick={() => {
          setAssetsPopupVisible(false);
        }}
      >
        <div className='pt-12 overflow-scroll bg-white rounded-t-lg min-h-screen-3/4 max-h-screen-3/4'>
          <div className='fixed top-0 z-10 w-full p-2 bg-white rounded-t-lg'>
            <div className='flex justify-center'>
              <DownIcon size='2rem' />
            </div>
          </div>
          {assets.map((asset) => (
            <div
              className='flex items-center justify-between px-4 py-2'
              key={asset.assetId}
              onClick={() => {
                setSelectedAsset(asset);
                setAssetsPopupVisible(false);
              }}
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
        </div>
      </Popup>
      <Modal
        visible={confirming}
        onCancel={() => setConfirming(false)}
        maskClosable
        closable
        title='Confirm'
      >
        <div className='mb-6 text-lg'>
          Are you sure to withdraw {amount} {selectedAsset?.symbol} ?
        </div>
        <div
          className='px-4 py-2 text-xl text-center text-white rounded-full bg-dark'
          onClick={() => {
            Loading.show();
            createIfttbBrokerWithdrawTransfer({
              variables: {
                input: {
                  assetId: selectedAsset.assetId,
                  amount,
                },
              },
            });
            setConfirming(false);
          }}
        >
          Confirm
        </div>
      </Modal>
    </>
  );
}
