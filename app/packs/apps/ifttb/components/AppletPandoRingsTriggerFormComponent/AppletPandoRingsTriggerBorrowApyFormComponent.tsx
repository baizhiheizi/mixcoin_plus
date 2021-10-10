import MixinAssetsComponent from 'apps/ifttb/components/MixinAssetsComponent/MixinAssetsComponent';
import { PandoRingsActionThemeColor } from 'apps/ifttb/constants';
import { useAppletForm } from 'apps/ifttb/contexts';
import { AppletTriggerInput, MixinAsset } from 'graphqlTypes';
import React, { useState } from 'react';
import { Picker, Popup } from 'zarm';

export default function AppletPandoRingsTriggerBorrowApyFormComponent(props: {
  onFinish: (trigger: AppletTriggerInput) => any;
}) {
  const { appletForm } = useAppletForm();
  const appletPandoRingsTrigger = appletForm?.appletTriggersAttributes?.find(
    (trigger) =>
      trigger.type === 'AppletPandoRingsTrigger' &&
      ['borrow_apy'].includes(trigger.params?.targetIndex),
  );
  const [asset, setAsset] = useState<null | MixinAsset>(
    appletPandoRingsTrigger?.asset || null,
  );
  const [targetValue, setTargetValue] = useState(
    appletPandoRingsTrigger
      ? (appletPandoRingsTrigger.params.targetValue * 100).toFixed(2)
      : '',
  );
  const [compareAction, setCompareAction] = useState<
    'larger_than' | 'less_than'
  >(appletPandoRingsTrigger?.params?.compareAction || 'larger_than');

  const [choosingCompareAction, setChoosingCompareAction] = useState(false);
  const [selectingAsset, setSelectingAsset] = useState<boolean>(false);

  const validateParams = () => {
    if (
      !asset ||
      !parseFloat(targetValue) ||
      parseFloat(targetValue) < 0.01 ||
      !compareAction
    ) {
      return false;
    }
    return true;
  };

  const createTrigger = () => {
    const trigger = {
      type: 'AppletPandoRingsTrigger',
      params: {
        description: `Borrow APY of ${asset.symbol} (from Pando Rings) ${
          compareAction === 'larger_than' ? '>=' : '<='
        } ${targetValue}%`,
        assetId: asset?.assetId,
        targetIndex: 'borrow_apy',
        targetValue: parseFloat(targetValue) / 100,
        compareAction,
      },
    };
    props.onFinish(trigger);
  };

  return (
    <div className='p-4'>
      <div className='mb-8 text-lg'>
        <div className='mb-4'>Run your applet when borrow APY of</div>
        <div
          className='flex items-center justify-center mb-2 space-x-2'
          onClick={() => setSelectingAsset(true)}
        >
          {asset ? (
            <>
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
            </>
          ) : (
            <div className='w-10 h-10 p-2 text-xl font-bold text-center text-gray-300 bg-gray-100 rounded-full'>
              ?
            </div>
          )}
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
          onCancel={() => setChoosingCompareAction(false)}
          itemRender={(data) => data.label}
        />
        <div className='flex items-center justify-center space-x-4'>
          <input
            className='py-2 text-right border-b w-36'
            value={targetValue}
            placeholder='input target APY'
            onChange={(e) => setTargetValue(e.target.value)}
          />
          <span>%</span>
        </div>
      </div>
      <div
        className={`w-full p-4 text-xl text-center rounded-full cursor-pointer ${
          validateParams() ? 'opacity-100' : 'opacity-50'
        }`}
        style={{ background: PandoRingsActionThemeColor }}
        onClick={() => createTrigger()}
      >
        Save Trigger
      </div>
      <Popup
        visible={selectingAsset}
        onMaskClick={() => setSelectingAsset(false)}
      >
        <MixinAssetsComponent
          source='PandoRings'
          onClick={(asset) => {
            setAsset(asset);
            setSelectingAsset(false);
          }}
        />
      </Popup>
    </div>
  );
}
