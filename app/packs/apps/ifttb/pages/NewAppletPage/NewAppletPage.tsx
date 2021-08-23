import {
  AlarmClock as AlarmClockIcon,
  Close as CloseIcon,
  Down as DownIcon,
} from '@icon-park/react';
import { FSwapActionThemeColor, FSwapLogoUrl } from 'apps/ifttb/constants';
import { useAppletForm } from 'apps/ifttb/contexts';
import { useCreateAppletMutation } from 'graphqlTypes';
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Popup } from 'zarm';

export default function NewAppletPage() {
  const history = useHistory();
  const { appletForm, setAppletForm } = useAppletForm();

  const [createApplet] = useCreateAppletMutation({
    update: () => {
      setAppletForm(null);
    },
  });
  const [chooseTriggerPopupVisible, setChooseTriggerPopupVisible] =
    useState(false);
  const [chooseActionPopupVisible, setChooseActionPopupVisible] =
    useState(false);
  const [editingTrigger, setEditingTrigger] = useState<
    null | 'appletDatetimeTrigger'
  >(null);
  const [editingAction, setEditingAction] = useState<
    null | 'applet4swapAction'
  >(null);

  const appletFormTriggerCreated =
    appletForm?.appletDatetimeTrigger || appletForm?.appletTargetPriceTrigger;
  const appletFormActionCreated = appletForm?.applet4swapAction;

  return (
    <>
      <div className='relative p-4 mb-8 text-xl font-bold bg-white'>
        <CloseIcon
          onClick={() => history.goBack()}
          className='absolute pt-1 left-8'
          size='1.25rem'
        />
        <div className='text-center'>Create Applet</div>
      </div>
      <div className='p-4 mb-36'>
        {appletForm?.appletDatetimeTrigger ? (
          <div
            className='flex items-center p-4 mb-8 text-lg font-bold text-white rounded-lg cursor-pointer space-x-2 bg-dark'
            onClick={() => setEditingTrigger('appletDatetimeTrigger')}
          >
            <span className='text-xl'>If</span>
            <span>
              <AlarmClockIcon size='1.5rem' />
            </span>
            <span>{appletForm?.appletDatetimeTrigger?.description}</span>
          </div>
        ) : (
          <div
            className='flex items-center justify-around p-4 mb-8 text-3xl font-bold rounded-lg cursor-pointer bg-dark'
            onClick={() => setChooseTriggerPopupVisible(true)}
          >
            <span className='text-white'>If This</span>
            <span className='px-2 py-1 text-lg bg-white rounded-xl'>Add</span>
          </div>
        )}

        {appletForm?.applet4swapAction ? (
          <div
            className='flex items-center p-4 mb-8 text-lg font-bold rounded-lg cursor-pointer space-x-2'
            onClick={() => setEditingAction('applet4swapAction')}
            style={{ background: FSwapActionThemeColor }}
          >
            <span className='text-xl'>Then</span>
            <img className='w-6 h-6 rounded-full' src={FSwapLogoUrl} />
            <span>{appletForm?.applet4swapAction?.description}</span>
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
                      'then',
                      appletForm.applet4swapAction?.description,
                    ].join(', '),
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
              Remove Ttrigger
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
        <ChooseTriggerComponent />
      </Popup>
      <Popup
        visible={chooseActionPopupVisible}
        direction='bottom'
        onMaskClick={() => setChooseActionPopupVisible(false)}
      >
        <ChooseActionComponent />
      </Popup>
    </>
  );
}

function ChooseTriggerComponent() {
  const history = useHistory();
  return (
    <div className='relative overflow-scroll bg-white rounded-t-lg max-h-screen-3/4 min-h-screen-1/2'>
      <div className='sticky flex justify-center p-2'>
        <DownIcon size='2rem' />
      </div>
      <div className='p-4 grid grid-cols-2 gap-2'>
        <div
          className='p-4 text-white rounded-lg bg-dark'
          onClick={() => history.push('/triggers/new/datetime')}
        >
          <div className='flex justify-center mb-2 text-lg'>
            <AlarmClockIcon size='1.5rem' />
          </div>
          <div className='text-lg text-center'>Datetime</div>
        </div>
      </div>
    </div>
  );
}

function ChooseActionComponent() {
  const history = useHistory();
  return (
    <div className='relative overflow-scroll bg-white rounded-t-lg max-h-screen-3/4 min-h-screen-1/2'>
      <div className='sticky flex justify-center p-2'>
        <DownIcon size='2rem' />
      </div>
      <div className='p-4 grid grid-cols-2 gap-2'>
        <div
          className='p-4 rounded-lg'
          style={{ background: FSwapActionThemeColor }}
          onClick={() => history.push('/actions/new/4swap')}
        >
          <div className='flex justify-center mb-2'>
            <img className='w-10 h-10' src={FSwapLogoUrl} />
          </div>
          <div className='text-lg text-center'>4Swap</div>
        </div>
      </div>
    </div>
  );
}
