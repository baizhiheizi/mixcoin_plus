import MixinAssetsComponent from 'apps/ifttb/components/MixinAssetsComponent/MixinAssetsComponent';
import { PandoLeafActionThemeColor } from 'apps/ifttb/constants';
import { useAppletForm } from 'apps/ifttb/contexts';
import { AppletTriggerInput, MixinAsset } from 'graphqlTypes';
import React, { useState } from 'react';
import { Picker, Popup } from 'zarm';

export default function AppletPandoLeafTriggerOracleFormComponent(props: {
  onFinish: (trigger: AppletTriggerInput) => any;
}) {
  const { appletForm } = useAppletForm();
  const appletPandoLeafTrigger = appletForm?.appletTriggersAttributes?.find(
    (trigger) =>
      trigger.type === 'AppletPandoLeafTrigger' &&
      ['oracle_next_price'].includes(trigger.params?.targetIndex),
  );
  const [asset, setAsset] = useState<null | MixinAsset>(
    appletPandoLeafTrigger?.asset || null,
  );
  const [targetValue, setTargetValue] = useState(
    appletPandoLeafTrigger?.params?.targetValue || '',
  );
  const [compareAction, setCompareAction] = useState<
    'larger_than' | 'less_than'
  >(appletPandoLeafTrigger?.params?.compareAction || 'less_than');

  const [choosingCompareAction, setChoosingCompareAction] = useState(false);

  const [selectingAsset, setSelectingAsset] = useState<boolean>(false);

  const validateParams = () => {
    if (
      !asset ||
      !parseFloat(targetValue) ||
      parseFloat(targetValue) < 0 ||
      !compareAction
    ) {
      return false;
    }
    return true;
  };

  const createTrigger = () => {
    const trigger = {
      type: 'AppletPandoLeafTrigger',
      params: {
        description: `Next price of ${asset.symbol} from Pando Leaf oracle ${
          compareAction === 'larger_than' ? '>=' : '<='
        } ${targetValue}`,
        assetId: asset.assetId,
        targetIndex: 'oracle_next_price',
        targetValue: parseFloat(targetValue),
        compareAction,
      },
    };
    props.onFinish(trigger);
  };

  return (
    <div className='p-4'>
      <div className='mb-8 text-lg'>
        <div className='mb-4'>Run your applet when next price of</div>
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
            placeholder='target price'
            onChange={(e) => setTargetValue(e.target.value)}
          />
        </div>
      </div>
      <div
        className={`w-full p-4 text-xl text-center rounded-full cursor-pointer ${
          validateParams() ? 'opacity-100' : 'opacity-50'
        }`}
        style={{ background: PandoLeafActionThemeColor }}
        onClick={() => createTrigger()}
      >
        Save Trigger
      </div>
      <Popup
        visible={selectingAsset}
        onMaskClick={() => setSelectingAsset(false)}
      >
        <MixinAssetsComponent
          source='PandoLeaf'
          onClick={(asset) => {
            setAsset(asset);
            setSelectingAsset(false);
          }}
        />
      </Popup>
    </div>
  );
}
