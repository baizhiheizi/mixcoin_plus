import MixinAssetsComponent from 'apps/ifttb/components/MixinAssetsComponent/MixinAssetsComponent';
import { FoxSwapActionThemeColor } from 'apps/ifttb/constants';
import { useAppletForm } from 'apps/ifttb/contexts';
import { AppletTriggerInput, MixinAsset } from 'graphqlTypes';
import React, { useState } from 'react';
import { Picker, Popup } from 'zarm';

export default function Applet4swapTriggerPriceFormComponent(props: {
  onFinish: (trigger: AppletTriggerInput) => any;
}) {
  const { appletForm } = useAppletForm();
  const applet4swapTrigger = appletForm?.appletTriggersAttributes?.find(
    (trigger) =>
      trigger.type === 'Applet4swapTrigger' &&
      ['ask_price', 'bid_price'].includes(trigger.params?.targetIndex),
  );
  const [baseAsset, setBaseAsset] = useState<null | MixinAsset>(
    applet4swapTrigger?.baseAsset || null,
  );
  const [quoteAsset, setQuoteAsset] = useState<null | MixinAsset>(
    applet4swapTrigger?.quoteAsset || null,
  );
  const [selectingAsset, setSelectingAsset] = useState<
    null | 'baseAsset' | 'quoteAsset'
  >(null);
  const [targetIndex, setTargetIndex] = useState<'ask_price' | 'bid_price'>(
    applet4swapTrigger?.params?.targetIndex || 'ask_price',
  );
  const [choosingTargetIndex, setChoosingTargetIndex] = useState(false);
  const [compareAction, setCompareAction] = useState<
    'larger_than' | 'less_than'
  >(applet4swapTrigger?.params?.compareAction || 'larger_than');
  const [choosingCompareAction, setChoosingCompareAction] = useState(false);
  const [targetValue, setTargetValue] = useState(
    applet4swapTrigger?.params?.targetValue || '',
  );

  const validateParams = () => {
    if (
      !baseAsset ||
      !quoteAsset ||
      !targetIndex ||
      !parseFloat(targetValue) ||
      parseFloat(targetValue) < 0.000_000_01 ||
      !compareAction
    ) {
      return false;
    }
    return true;
  };

  const createTrigger = () => {
    const trigger = {
      type: 'Applet4swapTrigger',
      params: {
        description: `price(from 4swap) of ${
          targetIndex === 'ask_price' ? 'selling' : 'buying'
        } ${baseAsset.symbol} ${
          compareAction === 'larger_than' ? '>=' : '<='
        } ${targetValue} ${quoteAsset.symbol}`,
        baseAssetId: baseAsset.assetId,
        quoteAssetId: quoteAsset.assetId,
        targetIndex,
        targetValue: parseFloat(targetValue),
        compareAction,
      },
    };
    props.onFinish(trigger);
  };

  return (
    <div className='p-4'>
      <div className='mb-8 text-lg'>
        <div className='flex items-center justify-center mb-4 space-x-4'>
          <div
            className='flex items-center space-x-2'
            onClick={() => setSelectingAsset('baseAsset')}
          >
            {baseAsset ? (
              <>
                <div className='relative'>
                  <img
                    className='w-12 h-12 p-1 rounded-full'
                    src={baseAsset.iconUrl}
                  />
                  <img
                    className='absolute bottom-0 right-0 w-4 h-4 rounded'
                    src={baseAsset.chainAsset.iconUrl}
                  />
                </div>
                <span>{baseAsset.symbol}</span>
              </>
            ) : (
              <div className='w-12 h-12 p-3 text-xl font-bold text-center text-gray-300 bg-gray-100 rounded-full'>
                ?
              </div>
            )}
          </div>
          <span>/</span>
          <div
            className='flex items-center space-x-2'
            onClick={() => setSelectingAsset('quoteAsset')}
          >
            {quoteAsset ? (
              <>
                <div className='relative'>
                  <img
                    className='w-12 h-12 p-1 rounded-full'
                    src={quoteAsset.iconUrl}
                  />
                  <img
                    className='absolute bottom-0 right-0 w-4 h-4 rounded'
                    src={quoteAsset.chainAsset.iconUrl}
                  />
                </div>
                <span>{quoteAsset.symbol}</span>
              </>
            ) : (
              <div className='w-12 h-12 p-3 text-xl font-bold text-center text-gray-300 bg-gray-100 rounded-full'>
                ?
              </div>
            )}
          </div>
        </div>
        {baseAsset && quoteAsset && (
          <>
            <div className='mb-4'>Run your applet when</div>
            <div
              className='flex items-center justify-center mb-2 space-x-4'
              onClick={() => setChoosingTargetIndex(true)}
            >
              <span className='font-bold'>
                Price of {targetIndex === 'ask_price' ? 'selling' : 'buying'}{' '}
                {baseAsset.symbol}
              </span>
            </div>
            <div
              className='mb-2 font-bold text-center'
              onClick={() => setChoosingCompareAction(true)}
            >
              {compareAction === 'larger_than' ? '>=' : '<='}
            </div>
            <Picker
              visible={choosingCompareAction}
              value={compareAction}
              dataSource={[
                {
                  value: 'larger_than',
                  label: '>=',
                },
                {
                  value: 'less_than',
                  label: '<=',
                },
              ]}
              onOk={(selected: any) => {
                setCompareAction(selected[0].value);
                setChoosingCompareAction(false);
              }}
              onCancel={() => setChoosingTargetIndex(false)}
              itemRender={(data) => data.label}
            />
            <div className='flex items-center justify-center space-x-4'>
              <input
                className='py-2 text-right border-b w-36'
                value={targetValue}
                placeholder='input target price'
                onChange={(e) => setTargetValue(e.target.value)}
              />
              <span>{quoteAsset.symbol}</span>
            </div>
            <Picker
              visible={choosingTargetIndex}
              value={targetIndex}
              dataSource={[
                {
                  value: 'ask_price',
                  label: `Price of selling ${baseAsset.symbol}`,
                },
                {
                  value: 'bid_price',
                  label: `Price of buying ${baseAsset.symbol}`,
                },
              ]}
              onOk={(selected: any) => {
                setTargetIndex(selected[0].value);
                setChoosingTargetIndex(false);
              }}
              onCancel={() => setChoosingTargetIndex(false)}
              itemRender={(data) => data.label}
            />
          </>
        )}
      </div>
      <div
        className={`w-full p-4 text-xl text-center rounded-full cursor-pointer ${
          validateParams() ? 'opacity-100' : 'opacity-50'
        }`}
        style={{ background: FoxSwapActionThemeColor }}
        onClick={() => createTrigger()}
      >
        Save Trigger
      </div>
      <Popup
        visible={Boolean(selectingAsset)}
        onMaskClick={() => setSelectingAsset(null)}
      >
        <MixinAssetsComponent
          source='4swap'
          onClick={(asset) => {
            switch (selectingAsset) {
              case 'baseAsset':
                if (asset.assetId != quoteAsset?.assetId) {
                  setBaseAsset(asset);
                  setSelectingAsset(null);
                }
                break;
              case 'quoteAsset':
                if (asset.assetId != baseAsset?.assetId) {
                  setQuoteAsset(asset);
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
