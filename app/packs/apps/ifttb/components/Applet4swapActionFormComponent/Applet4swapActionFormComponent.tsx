import { Close as CloseIcon, Down as DownIcon } from '@icon-park/react';
import {
  FoxSwapActionThemeColor,
  FoxSwapAppId,
  FoxSwapLogoUrl,
} from 'apps/ifttb/constants';
import { MixinAsset } from 'graphqlTypes';
import React, { useState } from 'react';
import { Popup } from 'zarm';
import MixinAssetsComponent from '../MixinAssetsComponent/MixinAssetsComponent';

export default function Applet4swapActionFormComponent(props: {
  onCancel: () => any;
  onFinish: (action) => any;
}) {
  const { onCancel, onFinish } = props;
  const [type, setType] = useState<null | 'swap' | 'add' | 'remove'>(null);
  const FswapTriggerItem = (props: {
    className?: string;
    children: JSX.Element | string;
    onClick?: () => any;
  }) => (
    <div
      onClick={props.onClick}
      className={`p-4 mb-4 text-center rounded ${props.className}`}
      style={{ background: FoxSwapActionThemeColor }}
    >
      {props.children}
    </div>
  );

  return (
    <>
      <div
        className='relative p-4 text-xl font-bold'
        style={{ background: FoxSwapActionThemeColor }}
      >
        <CloseIcon
          onClick={onCancel}
          className='absolute pt-1 left-8'
          size='1.25rem'
        />
        <div className='text-center'>Create 4swap Action</div>
      </div>
      <div
        className='px-4 pt-4 pb-8 mb-4'
        style={{ background: FoxSwapActionThemeColor }}
      >
        <div className='flex justify-center mb-4'>
          <img className='w-12 h-12' src={FoxSwapLogoUrl} />
        </div>
        <div className='mb-2 text-base'>
          Use 4swap to swap asset or add / remove liquidity.
        </div>
        <div className='text-base'>
          <a
            className='text-blue-500'
            href={`mixin://users/${FoxSwapAppId}`}
            target='_blank'
          >
            4swap
          </a>{' '}
          is a decentralized protocal implement for automated liquidity
          provision on Mixin Network.
        </div>
      </div>
      <div className='p-4 bg-white'>
        <FswapTriggerItem onClick={() => setType('swap')}>
          Swap
        </FswapTriggerItem>
        <FswapTriggerItem className='opacity-50'>
          Add liquidity
        </FswapTriggerItem>
        <FswapTriggerItem className='opacity-50'>
          Remove liquidity
        </FswapTriggerItem>
      </div>
      <Popup visible={Boolean(type)} onMaskClick={() => setType(null)}>
        <div className='relative overflow-scroll bg-white rounded-t-lg max-h-screen-3/4 min-h-screen-1/2'>
          <div className='sticky flex justify-center p-2'>
            <DownIcon size='2rem' />
          </div>
          {
            {
              swap: (
                <EditSwapAction
                  onFinish={(action) => {
                    onFinish(action);
                    setType(null);
                  }}
                />
              ),
            }[type]
          }
        </div>
      </Popup>
    </>
  );
}

function EditSwapAction(props: { onFinish: (action) => any }) {
  const [payAsset, setPayAsset] = useState<null | Partial<MixinAsset>>(null);
  const [payAmount, setPayAmount] = useState<null | string>('');
  const [fillAsset, setFillAsset] = useState<null | Partial<MixinAsset>>(null);
  const [selectingAsset, setSelectingAsset] = useState<
    null | 'payAsset' | 'fillAsset'
  >(null);
  const [slippage, setSlippage] = useState<0.001 | 0.005 | 0.01>(0.001);
  const payValue = payAsset?.priceUsd * parseFloat(payAmount);

  const validateParams = () => {
    if (
      !payAsset?.assetId ||
      !fillAsset?.assetId ||
      !parseFloat(payAmount) ||
      payValue < 0.1 ||
      !slippage
    ) {
      return false;
    }

    return true;
  };

  const createAction = () => {
    if (validateParams()) {
      const action = {
        description: `swap ${payAmount} ${payAsset.symbol} to ${fillAsset.symbol} using 4swap`,
        payAssetId: payAsset.assetId,
        fillAssetId: fillAsset.assetId,
        payAmount: parseFloat(payAmount),
        slippage,
      };
      props.onFinish(action);
    }
  };

  return (
    <div className='p-4'>
      <div className='mb-4'>
        <div className='flex items-center w-full bg-gray-100 rounded-full'>
          <div
            className='flex items-center space-x-2'
            onClick={() => setSelectingAsset('payAsset')}
          >
            {payAsset ? (
              <>
                <div className='relative'>
                  <img
                    className='p-1 rounded-full w-14 h-14'
                    src={payAsset.iconUrl}
                  />
                  <img
                    className='absolute bottom-0 right-0 w-6 h-6 rounded'
                    src={payAsset.chainAsset.iconUrl}
                  />
                </div>
                <span>{payAsset.symbol}</span>
              </>
            ) : (
              <div className='p-4 text-xl font-bold text-center text-gray-300 bg-gray-100 rounded-full w-14 h-14'>
                ?
              </div>
            )}
          </div>
          <input
            className='flex-1 p-4 text-right bg-gray-100 rounded-r-full'
            placeholder='FROM'
            value={payAmount}
            onChange={(e) => setPayAmount(e.target.value)}
          />
        </div>
        {payAsset && (
          <div className='text-sm text-right text-gray-500'>
            (At least $0.1) ≈ ${payValue?.toFixed(2)}
          </div>
        )}
      </div>
      <div className='flex items-center w-full mb-4 bg-gray-100 rounded-full'>
        <div
          className='flex items-center space-x-2'
          onClick={() => setSelectingAsset('fillAsset')}
        >
          {fillAsset ? (
            <>
              <div className='relative'>
                <img
                  className='p-1 rounded-full w-14 h-14'
                  src={fillAsset.iconUrl}
                />
                <img
                  className='absolute bottom-0 right-0 w-6 h-6 rounded'
                  src={fillAsset.chainAsset.iconUrl}
                />
              </div>
              <span>{fillAsset.symbol}</span>
            </>
          ) : (
            <div className='p-4 text-xl font-bold text-center text-gray-300 bg-gray-100 rounded-full w-14 h-14'>
              ?
            </div>
          )}
        </div>
        <input
          className='flex-1 p-4 text-right bg-gray-100 rounded-r-full'
          placeholder='TO'
          disabled
        />
      </div>
      <div className='flex items-center mb-8 space-x-4'>
        <div className='text-gray-500'>Slippage:</div>
        <div className='flex items-center justify-around flex-1 text-xs'>
          <div
            className={`py-1 px-4 border cursor-pointer rounded ${
              slippage === 0.001 ? 'bg-dark text-white' : 'bg-white'
            }`}
            onClick={() => setSlippage(0.001)}
          >
            0.1%
          </div>
          <div
            className={`py-1 px-4 border cursor-pointer rounded ${
              slippage === 0.005 ? 'bg-dark text-white' : 'bg-white'
            }`}
            onClick={() => setSlippage(0.005)}
          >
            0.5%
          </div>
          <div
            className={`py-1 px-4 border cursor-pointer rounded ${
              slippage === 0.01 ? 'bg-dark text-white' : 'bg-white'
            }`}
            onClick={() => setSlippage(0.01)}
          >
            1%
          </div>
        </div>
      </div>
      <div
        className={`w-full p-4 text-xl text-center rounded-full cursor-pointer ${
          validateParams() ? 'opacity-100' : 'opacity-50'
        }`}
        style={{ background: FoxSwapActionThemeColor }}
        onClick={() => createAction()}
      >
        Create Action
      </div>
      <Popup
        visible={Boolean(selectingAsset)}
        onMaskClick={() => setSelectingAsset(null)}
      >
        <MixinAssetsComponent
          source='4swap'
          onClick={(asset) => {
            switch (selectingAsset) {
              case 'payAsset':
                if (asset.assetId != fillAsset?.assetId) {
                  setPayAsset(asset);
                  setPayAmount('1');
                  setSelectingAsset(null);
                }
                break;
              case 'fillAsset':
                if (asset.assetId != payAsset?.assetId) {
                  setFillAsset(asset);
                  setSelectingAsset(null);
                }
                break;
            }
          }}
        />
      </Popup>
    </div>
  );
}

function EditAddLiquidityAction() {}

function EditRemoveLiquidityAction() {}
