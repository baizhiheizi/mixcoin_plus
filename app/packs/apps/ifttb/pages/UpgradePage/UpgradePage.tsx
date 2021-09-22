import { CheckOne as CheckIcon, Close as CloseIcon } from '@icon-park/react';
import { PUSD_ASESST } from 'apps/ifttb/constants';
import LoaderComponent from 'apps/shared/components/LoaderComponent/LoaderComponent';
import {
  useCreateIfttbOrderMutation,
  useIfttbCurrentUserQuery,
  useIfttbOrderLazyQuery,
  useMixinAssetsQuery,
} from 'graphqlTypes';
import moment from 'moment';
import React, { useState } from 'react';
import { useHistory } from 'react-router';
import { ActivityIndicator, Loading, Modal, Toast } from 'zarm';

export default function UpgradePage() {
  const history = useHistory();
  const [orderType, setOrderType] = useState<'pro_monthly' | 'pro_yearly'>(
    'pro_monthly',
  );
  const [assetId, setAssetId] = useState(PUSD_ASESST.assetId);
  const { loading, data } = useIfttbCurrentUserQuery({
    fetchPolicy: 'network-only',
  });
  const { data: mixinAssetsData } = useMixinAssetsQuery({
    variables: { source: 'ifttb_order' },
  });
  const [
    queryIfttbOrder,
    { data: ifttbOrderData, loading: queryingIfttbOrder, stopPolling },
  ] = useIfttbOrderLazyQuery({
    pollInterval: 500,
  });

  const [createIfttbOrder] = useCreateIfttbOrderMutation({
    update: (
      _,
      {
        data: {
          createIfttbOrder: { payUrl, id },
        },
      },
    ) => {
      Loading.hide();
      location.replace(payUrl);
      queryIfttbOrder({ variables: { id } });
    },
  });

  if (loading) {
    return <LoaderComponent />;
  }

  if (ifttbOrderData?.ifttbOrder?.state === 'completed') {
    Toast.show('Upgrade sucessfully!');
    stopPolling();
  }

  const { currentUser } = data;

  return (
    <>
      <div className='pb-28'>
        <div className='relative p-4 mb-4 text-xl font-bold bg-white'>
          <CloseIcon
            onClick={() => history.goBack()}
            className='absolute pt-1 left-8'
            size='1.25rem'
          />
          <div className='text-center'>Upgrade Plan</div>
        </div>
        <div className='px-4'>
          <div className='flex items-center justify-center mb-4 space-x-2'>
            <span className='text-3xl font-bold'>IFTTB</span>
            <span className='px-1 text-sm text-white rounded bg-btc'>pro</span>
          </div>
          {currentUser.ifttbRole === 'pro' && (
            <div className='mb-4 text-base'>
              Your Pro plan will expired at{' '}
              {moment(currentUser.ifttbProExpiredAt).format('YYYY-MM-DD HH:mm')}
            </div>
          )}

          <div className='flex p-2 mb-4 bg-gray-100'>
            <div
              className={`flex-1 p-4 text-center rounded ${
                orderType === 'pro_monthly' ? 'text-white bg-dark' : ''
              }`}
              onClick={() => setOrderType('pro_monthly')}
            >
              <div className='text-3xl'>$4.99</div>
              <div className='text-sm'>monthly</div>
            </div>
            <div
              className={`flex-1 p-4 text-center rounded ${
                orderType === 'pro_yearly' ? 'text-white bg-dark' : ''
              }`}
              onClick={() => setOrderType('pro_yearly')}
            >
              <div className='text-3xl'>$49.9</div>
              <div className='text-sm'>yearly</div>
            </div>
          </div>
          <div className='flex mb-8'>
            <div className='flex-1' />
            <div
              className={`flex-1 text-center ${
                orderType === 'pro_yearly' ? 'text-green-500' : ''
              }`}
            >
              save 17%
            </div>
          </div>

          <div className='mb-8'>
            <div className='flex items-start mb-4 space-x-2'>
              <div className='flex items-center h-6'>
                <CheckIcon size='1rem' theme='filled' fill='#1b1c1e' />
              </div>
              <span>Unlimited Applet creation</span>
            </div>
            <div className='flex items-start mb-4 space-x-2'>
              <div className='flex items-center h-6'>
                <CheckIcon size='1rem' theme='filled' fill='#1b1c1e' />
              </div>
              <span>Download order records</span>
            </div>
            <div className='flex items-start mb-4 space-x-2'>
              <div className='flex items-center h-6'>
                <CheckIcon size='1rem' theme='filled' fill='#1b1c1e' />
              </div>
              <span>More exciting features under development</span>
            </div>
          </div>

          <div className='flex p-2 mb-8 bg-gray-100 space-x-1'>
            {(mixinAssetsData?.mixinAssets || []).map((asset) => (
              <div
                className={`flex-1 p-1 flex justify-center items-center space-x-2 rounded ${
                  asset.assetId === assetId ? 'bg-dark text-white' : ''
                }`}
                onClick={() => setAssetId(asset.assetId)}
              >
                <img src={asset.iconUrl} className='w-8 h-8 rounded-rull' />
                <span>{asset.symbol}</span>
              </div>
            ))}
          </div>
          <div
            className='p-4 text-2xl text-center text-white rounded-full bg-dark'
            onClick={() => {
              Loading.show();
              createIfttbOrder({
                variables: {
                  input: {
                    orderType,
                    assetId,
                  },
                },
              });
            }}
          >
            {currentUser.ifttbRole === 'pro' ? 'Renew' : 'Upgrade'} Pro
          </div>
        </div>
      </div>
      <Modal
        closable
        visible={
          queryingIfttbOrder ||
          (ifttbOrderData?.ifttbOrder &&
            ifttbOrderData.ifttbOrder.state !== 'completed')
        }
        onCancel={() => {
          stopPolling();
          history.replace('/');
        }}
        afterClose={() => history.replace('/')}
        title='Checking payment'
      >
        <div className='text-center'>
          <ActivityIndicator size='lg' />
        </div>
        <div className='text-center'>Please wait a minute.</div>
      </Modal>
    </>
  );
}
