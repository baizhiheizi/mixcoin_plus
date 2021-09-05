import {
  AlarmClock as AlarmClockIcon,
  Close as CloseIcon,
} from '@icon-park/react';
import { FoxSwapActionThemeColor, FoxSwapLogoUrl } from 'apps/ifttb/constants';
import { useAppletForm, useCurrentUser } from 'apps/ifttb/contexts';
import LoaderComponent from 'apps/shared/components/LoaderComponent/LoaderComponent';
import {
  Applet4swapAction,
  AppletDatetimeTrigger,
  useAppletQuery,
  useToggleAppletConnectedMutation,
} from 'graphqlTypes';
import React from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { Loading } from 'zarm';

export default function EditAppletPage() {
  const history = useHistory();
  const { currentUser } = useCurrentUser();
  const { id } = useParams<{ id: string }>();
  const { appletForm } = useAppletForm();
  const [toggleAppletConnected] = useToggleAppletConnectedMutation({
    update: () => Loading.hide(),
  });
  const { loading, data } = useAppletQuery({ variables: { id } });

  if (loading) {
    return <LoaderComponent />;
  }

  const { applet } = data;

  return (
    <>
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
          {applet.appletTriggers.map((trigger) => (
            <div key={trigger.type}>
              {
                {
                  AppletDatetimeTrigger: (
                    <AppletDatetimeTriggerItem trigger={trigger} />
                  ),
                }[trigger.type]
              }
            </div>
          ))}
          {applet.appletActions.map((action) => (
            <div key={action.__typename}>
              {
                {
                  Applet4swapAction: <Applet4swapActionItem action={action} />,
                }[action.__typename]
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
          }}
        >
          Update
        </div>
        <div style={{ paddingBottom: 'env(safe-area-inset-bottom)' }} />
      </div>
    </>
  );
}

function AppletDatetimeTriggerItem(props: {
  trigger: Partial<AppletDatetimeTrigger> | any;
}) {
  return (
    <div className='flex items-center p-4 mb-8 text-lg font-bold text-white rounded-lg cursor-pointer space-x-2 bg-dark'>
      <span className='text-xl'>If</span>
      <span>
        <AlarmClockIcon size='1.5rem' />
      </span>
      <span>{props.trigger.description}</span>
    </div>
  );
}

function Applet4swapActionItem(props: {
  action: Partial<Applet4swapAction> | any;
}) {
  return (
    <div
      className='flex items-center p-4 mb-8 text-lg font-bold rounded-lg cursor-pointer space-x-2'
      style={{ background: FoxSwapActionThemeColor }}
    >
      <span className='text-xl'>Then</span>
      <img className='w-6 h-6 rounded-full' src={FoxSwapLogoUrl} />
      <span>{props.action.description}</span>
    </div>
  );
}
