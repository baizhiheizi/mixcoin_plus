import { MixSwapActionThemeColor } from 'apps/ifttb/constants';
import { useAppletForm } from 'apps/ifttb/contexts';
import { AppletActionInput, MixinAsset } from 'graphqlTypes';
import React, { useState } from 'react';
import { Popup } from 'zarm';
import MixinAssetsComponent from '../MixinAssetsComponent/MixinAssetsComponent';

export default function AppletMixSwapActionTradeFormComponent(props: {
  onFinish: (action: AppletActionInput) => any;
}) {
  const { appletForm } = useAppletForm();
  const appletMixSwapAction = appletForm?.appletActionsAttributes?.find(
    (action) => action.type === 'AppletMixSwapAction',
  );

  const [payAsset, setPayAsset] = useState<null | MixinAsset>(
    appletMixSwapAction?.payAsset || null,
  );
  const [payAmount, setPayAmount] = useState<null | string>(
    appletMixSwapAction?.params?.payAmount || '',
  );
  const [fillAsset, setFillAsset] = useState<null | MixinAsset>(
    appletMixSwapAction?.fillAsset || null,
  );
  const [selectingAsset, setSelectingAsset] = useState<
    null | 'payAsset' | 'fillAsset'
  >(null);
  const [slippage, setSlippage] = useState<0.002 | 0.005 | 0.01>(
    appletMixSwapAction?.params?.slippage || 0.002,
  );
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
        type: 'AppletMixSwapAction',
        params: {
          description: `swap ${payAmount} ${payAsset.symbol} to ${fillAsset.symbol} using MixSwap`,
          payAssetId: payAsset.assetId,
          fillAssetId: fillAsset.assetId,
          payAmount: parseFloat(payAmount),
          slippage,
        },
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
            onClick={() => {
              if (Boolean(appletMixSwapAction?.id)) {
                return;
              }
              setSelectingAsset('payAsset');
            }}
          >
            {payAsset ? (
              <>
                <div className='relative w-14'>
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
            className='flex-1 w-full p-4 text-right bg-gray-100 rounded-r-full'
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
          onClick={() => {
            if (Boolean(appletMixSwapAction?.id)) {
              return;
            }
            setSelectingAsset('fillAsset');
          }}
        >
          {fillAsset ? (
            <>
              <div className='relative w-14'>
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
          className='flex-1 w-full p-4 text-right bg-gray-100 rounded-r-full'
          placeholder='TO'
          disabled
        />
      </div>
      <div className='flex items-center mb-8 space-x-4'>
        <div className='text-gray-500'>Slippage:</div>
        <div className='flex items-center justify-around flex-1 text-xs'>
          <div
            className={`py-1 px-4 border cursor-pointer rounded ${
              slippage === 0.002 ? 'bg-dark text-white' : 'bg-white'
            }`}
            onClick={() => setSlippage(0.002)}
          >
            0.2%
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
        style={{ background: MixSwapActionThemeColor }}
        onClick={() => createAction()}
      >
        Save Action
      </div>
      <Popup
        visible={Boolean(selectingAsset)}
        onMaskClick={() => setSelectingAsset(null)}
      >
        <MixinAssetsComponent
          source='MixSwap'
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
