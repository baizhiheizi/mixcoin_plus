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
import AppletTriggerServicesComponent from 'apps/ifttb/components/AppletTriggerServicesComponent/AppletTriggerServicesComponent';
import { AppletFormContext, useCurrentUser } from 'apps/ifttb/contexts';
import LoaderComponent from 'apps/shared/components/LoaderComponent/LoaderComponent';
import {
  AppletActionInput,
  AppletTriggerInput,
  UpdateAppletMutationInput,
  useAppletQuery,
  useUpdateAppletMutation,
} from 'graphqlTypes';
import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { Popup } from 'zarm';

export default function EditAppletPage() {
  const history = useHistory();
  const { currentUser } = useCurrentUser();
  const { id } = useParams<{ id: string }>();
  const [appletForm, setAppletForm] =
    useState<UpdateAppletMutationInput | null>(null);

  // Trigger
  const [
    appletTriggerServicesPopupVisible,
    setAppletTriggerServicesPopupVisible,
  ] = useState(false);
  const [editingAppletTrigger, setEditingAppletTriiger] = useState<
    null | 'AppletDatetimeTrigger' | 'Applet4swapTrigger' | string
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
  const [selectedTrigger, setSelectedTrigger] =
    useState<null | AppletTriggerInput>(null);

  // Action
  const [
    appletActionServicesPopupVisible,
    setAppletActionServicesPopupVisible,
  ] = useState(false);
  const [editingAppletAction, setEditingAppletAction] = useState<
    null | 'Applet4swapAction' | 'AppletMixSwapAction' | string
  >(null);
  const [editingApplet4swapAction, setEditingApplet4swapAction] = useState<
    null | 'Applet4swapTradeAction'
  >(null);
  const [editingAppletMixSwapAction, setEditingAppletMixSwapAction] = useState<
    null | 'AppletMixSwapTradeAction' | 'AppletMixSwapTradeAction'
  >(null);
  const [editingAppletAlertAction, setEditingAppletAlertAction] = useState<
    null | 'AppletAlertMessengerAction'
  >(null);

  const [selectedAction, setSelectedAction] =
    useState<null | AppletActionInput>(null);

  const { loading, data } = useAppletQuery({ variables: { id } });
  const [updateApplet] = useUpdateAppletMutation({
    update: () => {
      history.replace(`/applets/${id}`);
    },
  });

  useEffect(() => {
    if (data?.applet) {
      setAppletForm({
        id: applet.id,
        title: applet.title,
        appletTriggersAttributes: applet.appletTriggers,
        appletActionsAttributes: applet.appletActions,
      });
    }
  }, [data?.applet]);

  const validTriggers = () =>
    (appletForm?.appletTriggersAttributes || []).filter(
      (_trigger) => !_trigger._destroy,
    );

  const validateForm = () => {
    if (validTriggers().length < 1) {
      return false;
    }

    return true;
  };

  const removeTrigger = (trigger: AppletTriggerInput) => {
    const index = appletForm.appletTriggersAttributes.findIndex(
      (_trigger) => _trigger.type === trigger.type,
    );
    let appletTriggersAttributes = [...appletForm.appletTriggersAttributes];
    appletTriggersAttributes[index] = Object.assign(
      {},
      appletTriggersAttributes[index],
      { _destroy: true },
    );

    setAppletForm(
      Object.assign({}, appletForm, {
        appletTriggersAttributes,
      }),
    );
  };

  const saveTrigger = (trigger: AppletTriggerInput) => {
    console.log(trigger);
    const index = appletForm.appletTriggersAttributes.findIndex(
      (_trigger) => _trigger.type === trigger.type,
    );
    let appletTriggersAttributes = [...appletForm.appletTriggersAttributes];

    if (index > -1) {
      appletTriggersAttributes[index] = Object.assign(
        {},
        appletTriggersAttributes[index],
        { ...trigger, _destroy: false },
      );
    } else {
      appletTriggersAttributes.push(trigger);
    }

    setAppletForm(Object.assign({}, appletForm, { appletTriggersAttributes }));
  };

  const saveAction = (action: AppletActionInput) => {
    console.log(action);
    const index = appletForm.appletActionsAttributes.findIndex(
      (_action) => _action.type === action.type,
    );
    let appletActionsAttributes = [...appletForm.appletActionsAttributes];

    if (index > -1) {
      appletActionsAttributes[index] = Object.assign(
        {},
        appletActionsAttributes[index],
        { ...action, _destroy: false },
      );
    }

    setAppletForm(Object.assign({}, appletForm, { appletActionsAttributes }));
  };

  if (loading) {
    return <LoaderComponent />;
  }

  const { applet } = data;

  return (
    <AppletFormContext.Provider value={{ appletForm, setAppletForm }}>
      <div className='pb-16'>
        <div className='relative p-4 mb-4 text-xl font-bold bg-white'>
          <CloseIcon
            onClick={() => history.goBack()}
            className='absolute pt-1 left-8'
            size='1.25rem'
          />
          <div className='text-center'>Edit Applet</div>
        </div>
        <div className='p-4 mb-4'>
          {validTriggers().map((trigger) => (
            <div key={trigger.type}>
              {
                {
                  AppletDatetimeTrigger: (
                    <AppletDatetimeTriggerItemComponent
                      trigger={trigger}
                      onClick={() => setSelectedTrigger(trigger)}
                    />
                  ),
                  Applet4swapTrigger: (
                    <Applet4swapTriggerItemComponent
                      trigger={trigger}
                      onClick={() => setSelectedTrigger(trigger)}
                    />
                  ),
                }[trigger.type]
              }
            </div>
          ))}
          {validTriggers().length < 1 ? (
            <div
              className='flex items-center justify-around p-4 mb-8 text-3xl font-bold rounded-lg cursor-pointer bg-dark'
              onClick={() => setAppletTriggerServicesPopupVisible(true)}
            >
              <span className='text-white'>If This</span>
              <span className='px-2 py-1 text-lg bg-white rounded-xl'>Add</span>
            </div>
          ) : validTriggers().length < 2 ? (
            <div
              className='flex items-center justify-center mb-8 text-lg space-x-2'
              onClick={() => setAppletTriggerServicesPopupVisible(true)}
            >
              <span>and</span> <AddIcon size='2rem' />
            </div>
          ) : null}
          {(appletForm?.appletActionsAttributes || []).map((action) => (
            <div key={action.type}>
              {
                {
                  Applet4swapAction: (
                    <Applet4swapActionItemComponent
                      action={action}
                      onClick={() => setSelectedAction(action)}
                    />
                  ),
                  AppletMixSwapAction: (
                    <AppletMixSwapActionItemComponent
                      action={action}
                      onClick={() => setSelectedAction(action)}
                    />
                  ),
                  AppletAlertAction: (
                    <AppletAlertActionItemComponent
                      action={action}
                      onClick={() => setSelectedAction(action)}
                    />
                  ),
                }[action.type]
              }
            </div>
          ))}
        </div>
      </div>
      <div className='fixed bottom-0 z-10 w-full p-4 bg-white max-w-screen-md'>
        <div
          className='p-4 mt-8 text-3xl text-center text-white rounded-full cursor-pointer bg-dark'
          onClick={() => {
            console.log(appletForm);
            if (validateForm()) {
              updateApplet({
                variables: {
                  input: {
                    id: appletForm.id,
                    title: [
                      'If',
                      appletForm.appletTriggersAttributes
                        .filter((trigger) => !trigger._destroy)
                        .map((trigger) => trigger.params.description)
                        .join(', '),
                      'then',
                      appletForm.appletActionsAttributes
                        .filter((action) => !action._destroy)
                        .map((action) => action.params.description)
                        .join(', '),
                    ]
                      .filter((item) => !!item)
                      .join(', '),
                    appletActionsAttributes:
                      appletForm.appletActionsAttributes.map((action) => {
                        return {
                          id: action.id,
                          type: action.type,
                          params: action.params,
                          _destroy: action._destroy,
                        };
                      }),
                    appletTriggersAttributes:
                      appletForm.appletTriggersAttributes.map((trigger) => {
                        return {
                          id: trigger.id,
                          type: trigger.type,
                          params: trigger.params,
                          _destroy: trigger._destroy,
                        };
                      }),
                  },
                },
              });
            }
          }}
        >
          Update
        </div>
        <div style={{ paddingBottom: 'env(safe-area-inset-bottom)' }} />
      </div>

      <Popup
        visible={Boolean(selectedTrigger)}
        onMaskClick={() => setSelectedTrigger(null)}
      >
        <div className='bg-white rounded-t-lg min-h-screen-1/3'>
          <div className='sticky flex justify-center p-2'>
            <DownIcon size='2rem' />
          </div>
          <div className='p-4'>
            <div
              className='p-4 text-xl font-bold text-center text-white rounded-full cursor-pointer bg-dark'
              onClick={() => {
                removeTrigger(selectedTrigger);
                setSelectedTrigger(null);
              }}
            >
              Remove trigger
            </div>
          </div>
          <div className='p-4'>
            <div
              className='p-4 text-xl font-bold text-center text-white rounded-full cursor-pointer bg-dark'
              onClick={() => {
                setEditingAppletTriiger(selectedTrigger.type);
                setSelectedTrigger(null);
              }}
            >
              Edit trigger
            </div>
          </div>
        </div>
      </Popup>

      <Popup
        visible={Boolean(selectedAction)}
        onMaskClick={() => setSelectedAction(null)}
      >
        <div className='bg-white rounded-t-lg min-h-screen-1/3'>
          <div className='sticky flex justify-center p-2'>
            <DownIcon size='2rem' />
          </div>
          <div className='p-4'>
            <div
              className='p-4 text-xl font-bold text-center text-white rounded-full cursor-pointer bg-dark'
              onClick={() => {
                setEditingAppletAction(selectedAction.type);
                setSelectedAction(null);
                if (selectedAction.type === 'Applet4swapAction') {
                  setEditingApplet4swapAction('Applet4swapTradeAction');
                } else if (selectedAction.type === 'AppletMixSwapAction') {
                  setEditingAppletMixSwapAction('AppletMixSwapTradeAction');
                } else if (selectedAction.type === 'AppletAlertAction') {
                  setEditingAppletAlertAction('AppletAlertMessengerAction');
                }
              }}
            >
              Edit action
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
