import MixinAssetsComponent from 'apps/ifttb/components/MixinAssetsComponent/MixinAssetsComponent';
import { ExinLocalActionThemeColor } from 'apps/ifttb/constants';
import { useAppletForm } from 'apps/ifttb/contexts';
import { AppletTriggerInput, MixinAsset } from 'graphqlTypes';
import React, { useState } from 'react';
import { Picker, Popup } from 'zarm';

export default function Applet4swapTriggerPriceFormComponent(props: {
  onFinish: (trigger: AppletTriggerInput) => any;
}) {
  const { appletForm } = useAppletForm();
  const appletExinLocalTrigger = appletForm?.appletTriggersAttributes?.find(
    (trigger) =>
      trigger.type === 'AppletExinLocalTrigger' &&
      ['ask_price_cny', 'bid_price_cny'].includes(trigger.params?.targetIndex),
  );
  const [asset, setAsset] = useState<null | MixinAsset>(
    appletExinLocalTrigger?.asset || null,
  );
  const [selectingAsset, setSelectingAsset] = useState<boolean>(false);
  const [choosingTargetIndex, setChoosingTargetIndex] = useState(false);
  const [targetIndex, setTargetIndex] = useState<
    'ask_price_cny' | 'bid_price_cny'
  >(appletExinLocalTrigger?.params?.targetIndex || 'ask_price_cny');
  const [compareAction, setCompareAction] = useState<
    'larger_than' | 'less_than'
  >(appletExinLocalTrigger?.params?.compareAction || 'larger_than');
  const [choosingCompareAction, setChoosingCompareAction] = useState(false);
  const [targetValue, setTargetValue] = useState(
    appletExinLocalTrigger?.params?.targetValue || '',
  );

  const validateParams = () => {
    if (
      !asset ||
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
      type: 'AppletExinLocalTrigger',
      params: {
        description: `OTC price(from ExinLocal) of ${
          targetIndex === 'ask_price_cny' ? 'selling' : 'buying'
        } ${asset.symbol} ${
          compareAction === 'larger_than' ? '>=' : '<='
        } ${targetValue} CNY`,
        assetId: asset.assetId,
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
        <div className='mb-4'>Run your applet when OTC price of</div>
        <div className='flex items-center justify-center mb-2 space-x-2'>
          <span
            className='font-bold'
            onClick={() => setChoosingTargetIndex(true)}
          >
            {targetIndex === 'ask_price_cny' ? 'selling' : 'buying'}{' '}
          </span>
          {asset ? (
            <div
              className='flex items-center space-x-1'
              onClick={() => setSelectingAsset(true)}
            >
              <div className='relative'>
                <img
                  className='w-10 h-10 p-1 rounded-full'
                  src={asset.iconUrl}
                />
                <img
                  className='absolute bottom-0 right-0 w-4 h-4 rounded'
                  src={asset.chainAsset.iconUrl}
                />
              </div>
              <span>{asset.symbol}</span>
            </div>
          ) : (
            <div
              onClick={() => setSelectingAsset(true)}
              className='w-10 h-10 p-2 text-xl font-bold text-center text-gray-300 bg-gray-100 rounded-full'
            >
              ?
            </div>
          )}
        </div>
        <Picker
          visible={choosingTargetIndex}
          value={targetIndex}
          dataSource={[
            {
              value: 'ask_price_cny',
              label: `Price of selling`,
            },
            {
              value: 'bid_price_cny',
              label: `Price of buying`,
            },
          ]}
          onOk={(selected: any) => {
            setTargetIndex(selected[0].value);
            setChoosingTargetIndex(false);
          }}
          onCancel={() => setChoosingTargetIndex(false)}
          itemRender={(data) => data.label}
        />
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
          onCancel={() => setChoosingCompareAction(false)}
          itemRender={(data) => data.label}
        />
        <div className='flex items-center justify-center space-x-4'>
          <input
            className='py-2 text-right border-b w-36'
            value={targetValue}
            placeholder='target price'
            onChange={(e) => setTargetValue(e.target.value)}
          />
          <span>CNY</span>
        </div>
      </div>
      <div
        className={`w-full p-4 text-xl text-center rounded-full cursor-pointer ${
          validateParams() ? 'opacity-100' : 'opacity-50'
        }`}
        style={{ background: ExinLocalActionThemeColor }}
        onClick={() => createTrigger()}
      >
        Save Trigger
      </div>
      <Popup
        visible={Boolean(selectingAsset)}
        onMaskClick={() => setSelectingAsset(null)}
      >
        <MixinAssetsComponent
          source='ExinLocal'
          onClick={(asset) => {
            setAsset(asset);
            setSelectingAsset(false);
          }}
        />
      </Popup>
    </div>
  );
}
