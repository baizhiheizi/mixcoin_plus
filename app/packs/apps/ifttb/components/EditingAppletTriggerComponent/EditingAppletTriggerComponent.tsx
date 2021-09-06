import AppletDatetimeTriggerFormComponent from 'apps/ifttb/components/AppletDatetimeTriggerFormComponent/AppletDatetimeTriggerFormComponent';
import { useAppletForm } from 'apps/ifttb/contexts';
import React from 'react';
import { Popup } from 'zarm';
import Applet4swapTriggerFormComponent from '../Applet4swapTriggerFormComponent/Applet4swapTriggerFormComponent';

export default function EditingAppletTriggerComponent(props: {
  onOk: () => any;
  onCancel: () => any;
  triggerType: 'AppletDatetimeTrigger' | 'Applet4swapTrigger' | string;
}) {
  const { onOk, onCancel, triggerType } = props;
  const { appletForm, setAppletForm } = useAppletForm();
  return (
    <Popup
      visible={Boolean(triggerType)}
      direction='bottom'
      onMaskClick={onCancel}
    >
      <div className='h-screen bg-white'>
        {
          {
            AppletDatetimeTrigger: (
              <AppletDatetimeTriggerFormComponent
                onCancel={onCancel}
                onFinish={(trigger) => {
                  console.log(trigger);
                  let _appletTriggersAttributes = [
                    ...appletForm.appletTriggersAttributes,
                  ];

                  const index = appletForm.appletTriggersAttributes.findIndex(
                    (_trigger) => _trigger.type === 'AppletDatetimeTrigger',
                  );
                  if (index > -1) {
                    _appletTriggersAttributes[index] = Object.assign(
                      {},
                      _appletTriggersAttributes[index],
                      { params: trigger, _destroy: false },
                    );
                  } else {
                    _appletTriggersAttributes.push({
                      type: 'AppletDatetimeTrigger',
                      params: trigger,
                    });
                  }

                  setAppletForm(
                    Object.assign({}, appletForm, {
                      appletTriggersAttributes: _appletTriggersAttributes,
                    }),
                  );
                  onOk();
                }}
              />
            ),
            Applet4swapTrigger: (
              <Applet4swapTriggerFormComponent
                onCancel={onCancel}
                onFinish={(trigger) => {
                  console.log(trigger);
                  let _appletTriggersAttributes = [
                    ...appletForm.appletTriggersAttributes,
                  ];
                  const index = appletForm.appletTriggersAttributes.findIndex(
                    (_trigger) => _trigger.type === 'Applet4swapTrigger',
                  );

                  if (index > -1) {
                    _appletTriggersAttributes[index] = Object.assign(
                      {},
                      _appletTriggersAttributes[index],
                      { params: trigger, _destroy: false },
                    );
                  } else {
                    _appletTriggersAttributes.push({
                      type: 'Applet4swapTrigger',
                      params: trigger,
                    });
                  }

                  setAppletForm(
                    Object.assign({}, appletForm, {
                      appletTriggersAttributes: _appletTriggersAttributes,
                    }),
                  );
                  onOk();
                }}
              />
            ),
          }[triggerType]
        }
      </div>
    </Popup>
  );
}
