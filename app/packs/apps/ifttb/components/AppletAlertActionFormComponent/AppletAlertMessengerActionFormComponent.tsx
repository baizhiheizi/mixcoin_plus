import { useAppletForm } from 'apps/ifttb/contexts';
import { AppletActionInput } from 'graphqlTypes';
import React, { useState } from 'react';

export default function AppletAlertMessengerActionFormComponent(props: {
  onFinish: (action: AppletActionInput) => any;
}) {
  const { appletForm } = useAppletForm();
  const appletAlertAction = appletForm?.appletActionsAttributes?.find(
    (action) => action.type === 'AppletAlertAction',
  );

  const [data, setData] = useState<string>(
    appletAlertAction?.params?.data || '',
  );

  const validateParams = () => {
    if (!data) {
      return false;
    }

    return true;
  };

  const createAction = () => {
    if (validateParams()) {
      const action = {
        type: 'AppletAlertAction',
        params: {
          description: `send alert (${data}) via Mixin Messenger`,
          via: 'mixin_messenger',
          data,
        },
      };
      props.onFinish(action);
    }
  };

  return (
    <div className='p-4'>
      <div className='mb-8'>
        <textarea
          className='w-full p-2 border rounded'
          placeholder={appletForm.appletTriggersAttributes
            .map((trigger) => trigger.params.description)
            .join(', ')}
          value={data}
          onChange={(e) => setData(e.currentTarget.value)}
        />
      </div>
      <div
        className={`w-full bg-blue-600 text-white p-4 text-xl text-center rounded-full cursor-pointer ${
          validateParams() ? 'opacity-100' : 'opacity-50'
        }`}
        onClick={() => createAction()}
      >
        Save Action
      </div>
    </div>
  );
}
