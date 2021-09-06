import {
  AddOne as AddIcon,
  Close as CloseIcon,
  Down as DownIcon,
} from '@icon-park/react';
import Applet4swapActionItemComponent from 'apps/ifttb/components/Applet4swapActionItemComponent/Applet4swapActionItemComponent';
import Applet4swapTriggerItemComponent from 'apps/ifttb/components/Applet4swapTriggerItemComponent/Applet4swapTriggerItemComponent';
import AppletDatetimeTriggerItemComponent from 'apps/ifttb/components/AppletDatetimeTriggerItemComponent/AppletDatetimeTriggerItemComponent';
import AppletMixSwapActionItemComponent from 'apps/ifttb/components/AppletMixSwapActionItemComponent/AppletMixSwapActionItemComponent';
import ChooseAppletActionComponent from 'apps/ifttb/components/ChooseAppletActionComponent/ChooseAppletActionComponent';
import ChooseAppletTriggerComponent from 'apps/ifttb/components/ChooseAppletTriggerComponent/ChooseAppletTriggerComponent';
import { AppletFormContext } from 'apps/ifttb/contexts';
import {
  CreateAppletMutationInput,
  useCreateAppletMutation,
} from 'graphqlTypes';
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Popup } from 'zarm';

export default function NewAppletPage() {
  const history = useHistory();
  const [appletForm, setAppletForm] =
    useState<CreateAppletMutationInput | null>(null);

  const [createApplet] = useCreateAppletMutation({
    update: () => {
      setAppletForm(null);
      history.replace('/');
    },
  });
  const [chooseTriggerPopupVisible, setChooseTriggerPopupVisible] =
    useState(false);
  const [chooseActionPopupVisible, setChooseActionPopupVisible] =
    useState(false);
  const [editingTrigger, setEditingTrigger] = useState<
    null | 'appletDatetimeTrigger' | 'applet4swapTrigger'
  >(null);
  const [editingAction, setEditingAction] = useState<
    null | 'applet4swapAction' | 'appletMixSwapAction'
  >(null);

  const appletFormTriggerCreated =
    appletForm?.appletDatetimeTrigger || appletForm?.applet4swapTrigger;
  const mayAddTrigger = !(
    appletForm?.appletDatetimeTrigger && appletForm?.applet4swapTrigger
  );
  const appletFormActionCreated =
    appletForm?.applet4swapAction || appletForm?.appletMixSwapAction;

  return (
    <AppletFormContext.Provider value={{ appletForm, setAppletForm }}>
      <div className='relative sticky top-0 z-10 p-4 mb-8 text-xl font-bold bg-white'>
        <CloseIcon
          onClick={() => history.goBack()}
          className='absolute pt-1 left-8'
          size='1.25rem'
        />
        <div className='text-center'>Create Applet</div>
      </div>
      <div className='p-4'>
        {appletForm?.appletDatetimeTrigger && (
          <AppletDatetimeTriggerItemComponent
            trigger={appletForm?.appletDatetimeTrigger}
            onClick={() => setEditingTrigger('appletDatetimeTrigger')}
          />
        )}
        {appletForm?.applet4swapTrigger && (
          <Applet4swapTriggerItemComponent
            trigger={appletForm?.applet4swapTrigger}
            onClick={() => setEditingTrigger('applet4swapTrigger')}
          />
        )}
        {mayAddTrigger &&
          (appletFormTriggerCreated ? (
            <div
              className='flex items-center justify-center mb-8 text-lg space-x-2'
              onClick={() => setChooseTriggerPopupVisible(true)}
            >
              <span>and</span> <AddIcon size='2rem' />
            </div>
          ) : (
            <div
              className='flex items-center justify-around p-4 mb-8 text-3xl font-bold rounded-lg cursor-pointer bg-dark'
              onClick={() => setChooseTriggerPopupVisible(true)}
            >
              <span className='text-white'>If This</span>
              <span className='px-2 py-1 text-lg bg-white rounded-xl'>Add</span>
            </div>
          ))}

        {appletForm?.applet4swapAction ? (
          <Applet4swapActionItemComponent
            action={appletForm.applet4swapAction}
            onClick={() => setEditingAction('applet4swapAction')}
          />
        ) : appletForm?.appletMixSwapAction ? (
          <AppletMixSwapActionItemComponent
            action={appletForm.appletMixSwapAction}
            onClick={() => setEditingAction('appletMixSwapAction')}
          />
        ) : (
          <div
            className={`flex items-center justify-around p-4 mb-8 text-3xl font-bold rounded-lg bg-dark ${
              appletFormTriggerCreated ? 'opacity-100' : 'opacity-50'
            }`}
            onClick={() => {
              if (appletFormTriggerCreated) {
                setChooseActionPopupVisible(true);
              }
            }}
          >
            <span className='text-white'>Then Buy</span>
            <span className='px-2 py-1 text-lg bg-white rounded-xl'>Add</span>
          </div>
        )}
      </div>
      {appletFormTriggerCreated && appletFormActionCreated && (
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
                      appletForm.appletDatetimeTrigger?.description,
                      appletForm.applet4swapTrigger?.description,
                      'then',
                      appletForm.applet4swapAction?.description,
                      appletForm.appletMixSwapAction?.description,
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
        visible={Boolean(editingTrigger)}
        onMaskClick={() => setEditingTrigger(null)}
      >
        <div className='bg-white rounded-t-lg min-h-screen-1/3'>
          <div className='sticky flex justify-center p-2'>
            <DownIcon size='2rem' />
          </div>
          <div className='p-4'>
            <div
              className='p-4 text-xl font-bold text-center text-white rounded-full cursor-pointer bg-dark'
              onClick={() => {
                switch (editingTrigger) {
                  case 'appletDatetimeTrigger':
                    setAppletForm(
                      Object.assign({
                        ...appletForm,
                        appletDatetimeTrigger: null,
                      }),
                    );
                    break;
                  case 'applet4swapTrigger':
                    setAppletForm(
                      Object.assign({
                        ...appletForm,
                        applet4swapTrigger: null,
                      }),
                    );
                    break;
                  default:
                    break;
                }
                setEditingTrigger(null);
              }}
            >
              Remove trigger
            </div>
          </div>
        </div>
      </Popup>
      <Popup
        visible={Boolean(editingAction)}
        onMaskClick={() => setEditingAction(null)}
      >
        <div className='bg-white rounded-t-lg min-h-screen-1/3'>
          <div className='sticky flex justify-center p-2'>
            <DownIcon size='2rem' />
          </div>
          <div className='p-4'>
            <div
              className='p-4 text-xl font-bold text-center text-white rounded-full cursor-pointer bg-dark'
              onClick={() => {
                switch (editingAction) {
                  case 'applet4swapAction':
                    setAppletForm(
                      Object.assign({ ...appletForm, applet4swapAction: null }),
                    );
                    break;
                  case 'appletMixSwapAction':
                    setAppletForm(
                      Object.assign({
                        ...appletForm,
                        appletMixSwapAction: null,
                      }),
                    );
                    break;
                  default:
                    break;
                }
                setEditingAction(null);
              }}
            >
              Remove action
            </div>
          </div>
        </div>
      </Popup>
      <ChooseAppletTriggerComponent
        visible={chooseTriggerPopupVisible}
        onOk={() => setChooseTriggerPopupVisible(false)}
        onCancel={() => setChooseTriggerPopupVisible(false)}
      />
      <Popup
        visible={chooseActionPopupVisible}
        direction='bottom'
        onMaskClick={() => setChooseActionPopupVisible(false)}
      >
        <ChooseAppletActionComponent
          onOk={() => setChooseActionPopupVisible(false)}
          onCancel={() => setChooseActionPopupVisible(false)}
        />
      </Popup>
    </AppletFormContext.Provider>
  );
}
