import {
  AddOne as AddIcon,
  Close as CloseIcon,
  Down as DownIcon,
} from '@icon-park/react';
import Applet4swapActionItemComponent from 'apps/ifttb/components/Applet4swapActionItemComponent/Applet4swapActionItemComponent';
import Applet4swapTriggerItemComponent from 'apps/ifttb/components/Applet4swapTriggerItemComponent/Applet4swapTriggerItemComponent';
import AppletDatetimeTriggerItemComponent from 'apps/ifttb/components/AppletDatetimeTriggerItemComponent/AppletDatetimeTriggerItemComponent';
import AppletMixSwapActionItemComponent from 'apps/ifttb/components/AppletMixSwapActionItemComponent/AppletMixSwapActionItemComponent';
import { AppletFormContext, useCurrentUser } from 'apps/ifttb/contexts';
import LoaderComponent from 'apps/shared/components/LoaderComponent/LoaderComponent';
import {
  AppletTriggerInput,
  UpdateAppletMutationInput,
  useAppletQuery,
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

  const [editingTrigger, setEditingTrigger] =
    useState<null | AppletTriggerInput>(null);
  const [selectedTrigger, setSelectedTrigger] =
    useState<null | AppletTriggerInput>(null);
  const [chooseTriggerPopupVisible, setChooseTriggerPopupVisible] =
    useState(false);

  const { loading, data } = useAppletQuery({ variables: { id } });

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
  };

  const removeTrigger = (trigger) => {
    const triggerIndex = appletForm.appletTriggersAttributes.findIndex(
      (_trigger) => _trigger.id === trigger.id,
    );
    let _appletTriggersAttributes = [...appletForm.appletTriggersAttributes];
    _appletTriggersAttributes[triggerIndex] = Object.assign(
      {},
      _appletTriggersAttributes[triggerIndex],
      { _destroy: true },
    );

    setAppletForm(
      Object.assign({}, appletForm, {
        appletTriggersAttributes: _appletTriggersAttributes,
      }),
    );
  };

  const saveTrigger = (trigger) => {};

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
              onClick={() => setChooseTriggerPopupVisible(true)}
            >
              <span className='text-white'>If This</span>
              <span className='px-2 py-1 text-lg bg-white rounded-xl'>Add</span>
            </div>
          ) : validTriggers().length < 2 ? (
            <div
              className='flex items-center justify-center mb-8 text-lg space-x-2'
              onClick={() => setChooseTriggerPopupVisible(true)}
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
                      onClick={() => {}}
                    />
                  ),
                  AppletMixSwapAction: (
                    <AppletMixSwapActionItemComponent
                      action={action}
                      onClick={() => {}}
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
              console.log(appletForm);
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
        </div>
      </Popup>
    </AppletFormContext.Provider>
  );
}
