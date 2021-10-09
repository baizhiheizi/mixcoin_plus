import {
  AddOne as AddIcon,
  Close as CloseIcon,
  Down as DownIcon,
} from '@icon-park/react';
import Applet4swapActionFormComponent from 'apps/ifttb/components/Applet4swapActionFormComponent/Applet4swapActionFormComponent';
import Applet4swapActionItemComponent from 'apps/ifttb/components/Applet4swapActionItemComponent/Applet4swapActionItemComponent';
import Applet4swapTriggerFormComponent from 'apps/ifttb/components/Applet4swapTriggerFormComponent/Applet4swapTriggerFormComponent';
import Applet4swapTriggerItemComponent from 'apps/ifttb/components/Applet4swapTriggerItemComponent/Applet4swapTriggerItemComponent';
import AppletActionServicesComponent from 'apps/ifttb/components/AppletActionServicesComponent/AppletActionServicesComponent';
import AppletAlertActionFormComponent from 'apps/ifttb/components/AppletAlertActionFormComponent/AppletAlertActionFormComponent';
import AppletAlertActionItemComponent from 'apps/ifttb/components/AppletAlertActionItemComponent/AppletAlertActionItemComponent';
import AppletDatetimeTriggerFormComponent from 'apps/ifttb/components/AppletDatetimeTriggerFormComponent/AppletDatetimeTriggerFormComponent';
import AppletDatetimeTriggerItemComponent from 'apps/ifttb/components/AppletDatetimeTriggerItemComponent/AppletDatetimeTriggerItemComponent';
import AppletMixSwapActionFormComponent from 'apps/ifttb/components/AppletMixSwapActionFormComponent/AppletMixSwapActionFormComponent';
import AppletMixSwapActionItemComponent from 'apps/ifttb/components/AppletMixSwapActionItemComponent/AppletMixSwapActionItemComponent';
import AppletPandoLeafTriggerFormComponent from 'apps/ifttb/components/AppletPandoLeafTriggerFormComponent/AppletPandoLeafTriggerFormComponent';
import AppletPandoLeafTriggerItemComponent from 'apps/ifttb/components/AppletPandoLeafTriggerItemComponent/AppletPandoLeafTriggerItemComponent';
import AppletTriggerServicesComponent from 'apps/ifttb/components/AppletTriggerServicesComponent/AppletTriggerServicesComponent';
import { AppletFormContext } from 'apps/ifttb/contexts';
import {
  AppletActionInput,
  AppletTriggerInput,
  CreateAppletMutationInput,
  useCreateAppletMutation,
} from 'graphqlTypes';
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Popup } from 'zarm';

const APPLET_FORM_TEMP = {
  title: '',
  appletActionsAttributes: [],
  appletTriggersAttributes: [],
};
export default function NewAppletPage() {
  const history = useHistory();
  const [appletForm, setAppletForm] =
    useState<CreateAppletMutationInput>(APPLET_FORM_TEMP);

  const [createApplet] = useCreateAppletMutation({
    update: () => {
      setAppletForm(APPLET_FORM_TEMP);
      history.replace('/');
    },
  });

  // Trigger
  const [
    appletTriggerServicesPopupVisible,
    setAppletTriggerServicesPopupVisible,
  ] = useState(false);
  const [editingAppletTrigger, setEditingAppletTriiger] = useState<
    null | 'AppletDatetimeTrigger' | 'Applet4swapTrigger' | 'AppletPandoLeafTrigger'
  >(null);
  const [editingAppletDatetimeTrigger, setEditingAppletDatetimeTrigger] =
    useState<
      | null
      | 'AppletDatetimeMinuteTrigger'
      | 'AppletDatetimeHourTrigger'
      | 'AppletDatetimeDayTrigger'
      | 'AppletDatetimeWeekTrigger'
      | 'AppletDatetimeMonthTrigger'
    >(null);
  const [editingApplet4swapTrigger, setEditingApplet4swapTrigger] = useState<
    null | 'Applet4swapPriceTrigger'
  >(null);
  const [editingAppletPandoLeafTrigger, setEditingAppletPandoLeafTrigger] = useState<
    null | 'AppletPandoLeafBidingFlipTrigger'
  >(null);
  const [selectedTriggerIndex, setSelectedTriggerIndex] = useState<
    null | number
  >(null);

  // Action
  const [
    appletActionServicesPopupVisible,
    setAppletActionServicesPopupVisible,
  ] = useState(false);
  const [editingAppletAction, setEditingAppletAction] = useState<
    null | 'Applet4swapAction' | 'AppletMixSwapAction' | 'AppletAlertAction'
  >(null);
  const [editingApplet4swapAction, setEditingApplet4swapAction] = useState<
    null | 'Applet4swapTradeAction'
  >(null);
  const [editingAppletMixSwapAction, setEditingAppletMixSwapAction] = useState<
    null | 'AppletMixSwapTradeAction'
  >(null);
  const [editingAppletAlertAction, setEditingAppletAlertAction] = useState<
    null | 'AppletAlertMessengerAction'
  >(null);

  const [selectedActionIndex, setSelectedActionIndex] = useState<null | number>(
    null,
  );

  const removeTrigger = (index: number) => {
    let appletTriggersAttributes = [...appletForm.appletTriggersAttributes];
    appletTriggersAttributes.splice(index, 1);
    setAppletForm(Object.assign({}, appletForm, { appletTriggersAttributes }));
  };

  const removeAction = (index: number) => {
    let appletActionsAttributes = [...appletForm.appletActionsAttributes];
    appletActionsAttributes.splice(index, 1);
    setAppletForm(Object.assign({}, appletForm, { appletActionsAttributes }));
  };

  const saveTrigger = (trigger: AppletTriggerInput) => {
    console.log(trigger);
    let appletTriggersAttributes = [...appletForm.appletTriggersAttributes];
    const index = appletTriggersAttributes.findIndex(
      (_trigger) => _trigger.type === trigger.type,
    );

    if (index < 0) {
      appletTriggersAttributes.push(trigger);
    } else {
      appletTriggersAttributes[index] = trigger;
    }

    setAppletForm(Object.assign({}, appletForm, { appletTriggersAttributes }));
  };

  const saveAction = (action: AppletActionInput) => {
    console.log(action);
    let appletActionsAttributes = [...appletForm.appletActionsAttributes];
    const index = appletActionsAttributes.findIndex(
      (_action) => _action.type === action.type,
    );

    if (index < 0) {
      appletActionsAttributes.push(action);
    } else {
      appletActionsAttributes[index] = action;
    }

    setAppletForm(Object.assign({}, appletForm, { appletActionsAttributes }));
  };

  return (
    <AppletFormContext.Provider value={{ appletForm, setAppletForm }}>
      <div className='sticky top-0 z-10 p-4 mb-8 text-xl font-bold bg-white'>
        <CloseIcon
          onClick={() => history.goBack()}
          className='absolute pt-1 left-8'
          size='1.25rem'
        />
        <div className='text-center'>Create Applet</div>
      </div>
      <div className='px-4'>
        {appletForm.appletTriggersAttributes.map((trigger, index) => (
          <div key={index}>
            {
              {
                AppletDatetimeTrigger: (
                  <AppletDatetimeTriggerItemComponent
                    trigger={trigger}
                    onClick={() => setSelectedTriggerIndex(index)}
                  />
                ),
                Applet4swapTrigger: (
                  <Applet4swapTriggerItemComponent
                    trigger={trigger}
                    onClick={() => setSelectedTriggerIndex(index)}
                  />
                ),
                AppletPandoLeafTrigger: (
                  <AppletPandoLeafTriggerItemComponent
                    trigger={trigger}
                    onClick={() => setSelectedTriggerIndex(index)}
                  />
                ),
              }[trigger.type]
            }
          </div>
        ))}
        {appletForm.appletTriggersAttributes.length < 1 ? (
          <div
            className='flex items-center justify-around p-4 mb-8 text-3xl font-bold rounded-lg cursor-pointer bg-dark'
            onClick={() => setAppletTriggerServicesPopupVisible(true)}
          >
            <span className='text-white'>If This</span>
            <span className='px-2 py-1 text-lg bg-white rounded-xl'>Add</span>
          </div>
        ) : appletForm.appletTriggersAttributes.length < 2 ? (
          <div
            className='flex items-center justify-center mb-8 text-lg space-x-2'
            onClick={() => setAppletTriggerServicesPopupVisible(true)}
          >
            <span>and</span> <AddIcon size='2rem' />
          </div>
        ) : null}

        {appletForm.appletActionsAttributes.map((action) => (
          <div key={action.type}>
            {
              {
                Applet4swapAction: (
                  <Applet4swapActionItemComponent
                    action={action}
                    onClick={() => {}}
                  />
                ),
                AppletMixSwapAction: (
                  <AppletMixSwapActionItemComponent
                    action={action}
                    onClick={() => {}}
                  />
                ),
                AppletAlertAction: (
                  <AppletAlertActionItemComponent
                    action={action}
                    onClick={() => {}}
                  />
                ),
              }[action.type]
            }
          </div>
        ))}

        {appletForm.appletActionsAttributes.length < 1 && (
          <div
            className={`flex items-center justify-around p-4 mb-8 text-3xl font-bold rounded-lg bg-dark ${
              appletForm.appletTriggersAttributes.length > 0
                ? 'opacity-100'
                : 'opacity-50'
            }`}
            onClick={() => {
              if (appletForm.appletTriggersAttributes.length > 0) {
                setAppletActionServicesPopupVisible(true);
              }
            }}
          >
            <span className='text-white'>Then Buy</span>
            <span className='px-2 py-1 text-lg bg-white rounded-xl'>Add</span>
          </div>
        )}
      </div>

      {appletForm.appletTriggersAttributes.length > 0 &&
        appletForm.appletActionsAttributes.length > 0 && (
          <div className='fixed bottom-0 z-10 w-full p-4 bg-white max-w-screen-md'>
            <div
              className='p-4 mt-8 text-3xl text-center text-white rounded-full cursor-pointer bg-dark'
              onClick={() => {
                console.log(appletForm);
                createApplet({
                  variables: {
                    input: {
                      ...appletForm,
                      title: [
                        'If',
                        appletForm.appletTriggersAttributes
                          .map((trigger) => trigger.params.description)
                          .join(', '),
                        'then',
                        appletForm.appletActionsAttributes
                          .map((action) => action.params.description)
                          .join(', '),
                      ]
                        .filter((item) => !!item)
                        .join(', '),
                    },
                  },
                });
              }}
            >
              Continue
            </div>
            <div style={{ paddingBottom: 'env(safe-area-inset-bottom)' }} />
          </div>
        )}

      <Popup
        visible={typeof selectedTriggerIndex === 'number'}
        onMaskClick={() => setSelectedTriggerIndex(null)}
      >
        <div className='bg-white rounded-t-lg min-h-screen-1/3'>
          <div className='sticky flex justify-center p-2'>
            <DownIcon size='2rem' />
          </div>
          <div className='p-4'>
            <div
              className='p-4 text-xl font-bold text-center text-white rounded-full cursor-pointer bg-dark'
              onClick={() => {
                removeTrigger(selectedTriggerIndex);
                setSelectedTriggerIndex(null);
              }}
            >
              Remove trigger
            </div>
          </div>
        </div>
      </Popup>

      <Popup
        visible={typeof selectedActionIndex === 'number'}
        onMaskClick={() => setSelectedActionIndex(null)}
      >
        <div className='bg-white rounded-t-lg min-h-screen-1/3'>
          <div className='sticky flex justify-center p-2'>
            <DownIcon size='2rem' />
          </div>
          <div className='p-4'>
            <div
              className='p-4 text-xl font-bold text-center text-white rounded-full cursor-pointer bg-dark'
              onClick={() => {
                removeAction(selectedActionIndex);
                setSelectedActionIndex(null);
              }}
            >
              Remove action
            </div>
          </div>
        </div>
      </Popup>

      {/**
       * select trigger service
       */}
      <AppletTriggerServicesComponent
        visible={appletTriggerServicesPopupVisible}
        onSelected={(selected) => setEditingAppletTriiger(selected)}
        onCancel={() => setAppletTriggerServicesPopupVisible(false)}
      />

      {/**
       * Datetime trigger form
       */}
      <AppletDatetimeTriggerFormComponent
        visible={editingAppletTrigger === 'AppletDatetimeTrigger'}
        triggerType={editingAppletDatetimeTrigger}
        onSelected={(selected) => setEditingAppletDatetimeTrigger(selected)}
        onCancel={() => setEditingAppletTriiger(null)}
        onOk={(trigger) => {
          saveTrigger(trigger);
          setEditingAppletDatetimeTrigger(null);
          setEditingAppletTriiger(null);
          setAppletTriggerServicesPopupVisible(false);
        }}
      />

      {/**
       * 4swap trigger form
       */}
      <Applet4swapTriggerFormComponent
        visible={editingAppletTrigger === 'Applet4swapTrigger'}
        triggerType={editingApplet4swapTrigger}
        onSelected={(selected) => setEditingApplet4swapTrigger(selected)}
        onCancel={() => setEditingAppletTriiger(null)}
        onOk={(trigger) => {
          saveTrigger(trigger);
          setEditingApplet4swapTrigger(null);
          setEditingAppletTriiger(null);
          setAppletTriggerServicesPopupVisible(false);
        }}
      />

      {/**
       * pando leaf trigger form
       */}
      <AppletPandoLeafTriggerFormComponent
        visible={editingAppletTrigger === 'AppletPandoLeafTrigger'}
        triggerType={editingAppletPandoLeafTrigger}
        onSelected={(selected) => setEditingAppletPandoLeafTrigger(selected)}
        onCancel={() => setEditingAppletTriiger(null)}
        onOk={(trigger) => {
          saveTrigger(trigger);
          setEditingAppletPandoLeafTrigger(null);
          setEditingAppletTriiger(null);
          setAppletTriggerServicesPopupVisible(false);
        }}
      />

      {/**
       * select action service
       */}
      <AppletActionServicesComponent
        visible={appletActionServicesPopupVisible}
        onSelected={(selected) => setEditingAppletAction(selected)}
        onCancel={() => setAppletActionServicesPopupVisible(false)}
      />

      {/**
       * 4swap action form
       */}
      <Applet4swapActionFormComponent
        visible={editingAppletAction === 'Applet4swapAction'}
        actionType={editingApplet4swapAction}
        onSelected={(selected) => setEditingApplet4swapAction(selected)}
        onCancel={() => setEditingAppletAction(null)}
        onOk={(action) => {
          saveAction(action);
          setEditingApplet4swapAction(null);
          setEditingAppletAction(null);
          setAppletActionServicesPopupVisible(false);
        }}
      />

      {/**
       * MixSwap action form
       */}
      <AppletMixSwapActionFormComponent
        visible={editingAppletAction === 'AppletMixSwapAction'}
        actionType={editingAppletMixSwapAction}
        onSelected={(selected) => setEditingAppletMixSwapAction(selected)}
        onCancel={() => setEditingAppletAction(null)}
        onOk={(action) => {
          saveAction(action);
          setEditingAppletMixSwapAction(null);
          setEditingAppletAction(null);
          setAppletActionServicesPopupVisible(false);
        }}
      />

      {/**
       * Alert action form
       */}
      <AppletAlertActionFormComponent
        visible={editingAppletAction === 'AppletAlertAction'}
        actionType={editingAppletAlertAction}
        onSelected={(selected) => setEditingAppletAlertAction(selected)}
        onCancel={() => setEditingAppletAction(null)}
        onOk={(action) => {
          saveAction(action);
          setEditingAppletAlertAction(null);
          setEditingAppletAction(null);
          setAppletActionServicesPopupVisible(false);
        }}
      />
    </AppletFormContext.Provider>
  );
}
