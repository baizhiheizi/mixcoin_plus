import {
  AlarmClock as AlarmClockIcon,
  Close as CloseIcon,
  Down as DownIcon,
  AddOne as AddIcon,
} from '@icon-park/react';
import { ChooseAppletActionComponent } from 'apps/ifttb/components/ChooseAppletActionComponent/ChooseAppletActionComponent';
import { ChooseAppletTriggerComponent } from 'apps/ifttb/components/ChooseAppletTriggerComponent/ChooseAppletTriggerComponent';
import { FSwapActionThemeColor, FSwapLogoUrl } from 'apps/ifttb/constants';
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
    null | 'applet4swapAction'
  >(null);

  const appletFormTriggerCreated =
    appletForm?.appletDatetimeTrigger || appletForm?.applet4swapTrigger;
  const mayAddTrigger = !(
    appletForm?.appletDatetimeTrigger && appletForm?.applet4swapTrigger
  );
  const appletFormActionCreated = appletForm?.applet4swapAction;

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
          <div
            className='flex items-start p-4 mb-8 text-lg font-bold text-white bg-gray-800 rounded-lg cursor-pointer space-x-2'
            onClick={() => setEditingTrigger('appletDatetimeTrigger')}
          >
            <span className='text-xl'>If</span>
            <span>
              <AlarmClockIcon size='1.75rem' />
            </span>
            <span className='leading-7'>
              {appletForm?.appletDatetimeTrigger?.description}
            </span>
          </div>
        )}
        {appletForm?.applet4swapTrigger && (
          <div
            className='flex items-start p-4 mb-8 text-lg font-bold rounded-lg cursor-pointer space-x-2'
            style={{ background: FSwapActionThemeColor }}
            onClick={() => setEditingTrigger('applet4swapTrigger')}
          >
            <span className='text-xl'>If</span>
            <img className='rounded-full w-7 h-7' src={FSwapLogoUrl} />
            <span className='leading-7'>
              {appletForm?.applet4swapTrigger?.description}
            </span>
          </div>
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
          <div
            className='flex items-start p-4 mb-8 text-lg font-bold rounded-lg cursor-pointer space-x-2'
            onClick={() => setEditingAction('applet4swapAction')}
            style={{ background: FSwapActionThemeColor }}
          >
            <span className='text-xl'>Then</span>
            <img className='rounded-full w-7 h-7' src={FSwapLogoUrl} />
            <span className='leading-7'>
              {appletForm?.applet4swapAction?.description}
            </span>
          </div>
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
      <Popup
        visible={chooseTriggerPopupVisible}
        direction='bottom'
        onMaskClick={() => setChooseTriggerPopupVisible(false)}
      >
        <ChooseAppletTriggerComponent
          onOk={() => setChooseTriggerPopupVisible(false)}
          onCancel={() => setChooseTriggerPopupVisible(false)}
        />
      </Popup>
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
