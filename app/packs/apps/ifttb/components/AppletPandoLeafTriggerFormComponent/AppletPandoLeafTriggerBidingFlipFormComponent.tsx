import MixinAssetsComponent from 'apps/ifttb/components/MixinAssetsComponent/MixinAssetsComponent';
import { PandoLeafActionThemeColor } from 'apps/ifttb/constants';
import { useAppletForm } from 'apps/ifttb/contexts';
import { AppletTriggerInput, MixinAsset } from 'graphqlTypes';
import React, { useState } from 'react';
import { Popup } from 'zarm';

export default function AppletPandoLeafTriggerBidingFlipFormComponent(props: {
  onFinish: (trigger: AppletTriggerInput) => any;
}) {
  const { appletForm } = useAppletForm();
  const appletPandoLeafTrigger = appletForm?.appletTriggersAttributes?.find(
    (trigger) =>
      trigger.type === 'AppletPandoLeafTrigger' &&
      ['biding_flips'].includes(trigger.params?.targetIndex),
  );
  const [asset, setAsset] = useState<null | MixinAsset>(
    appletPandoLeafTrigger?.asset || null,
  );
  const [selectingAsset, setSelectingAsset] = useState<boolean>(false);

  const validateParams = () => {
    return true;
  };

  const createTrigger = () => {
    const trigger = {
      type: 'AppletPandoLeafTrigger',
      params: {
        description: `Pando Leaf has ongoing auctions for collateral of ${
          asset ? asset.symbol : 'any asset'
        }`,
        assetId: asset?.assetId,
        targetIndex: 'biding_flips',
        targetValue: null,
        compareAction: 'present',
      },
    };
    props.onFinish(trigger);
  };

  return (
    <div className='p-4'>
      <div className='mb-8 text-lg'>
        <div className='mb-4'>
          Run your applet when there are ongoing auction for
        </div>
        <div
          className='flex items-center justify-center space-x-2'
          onClick={() => setSelectingAsset(true)}
        >
          <span className='font-bold'>
            collateral of {asset ? asset.symbol : 'any'} asset
          </span>
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
