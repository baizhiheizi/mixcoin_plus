import { useCurrentUser } from 'apps/application/contexts';
import { ToastError } from 'apps/application/utils';
import { useFennec } from 'apps/shared';
import { useLoginWithTokenMutation } from 'graphqlTypes';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { ActionSheet, Toast } from 'zarm';

export default function LoginComponent(props: {
  logging: boolean;
  setLogging?: (logging: boolean) => any;
}) {
  const { logging, setLogging } = props;
  const { t } = useTranslation();
  const { setCurrentUser } = useCurrentUser();
  const { fennec } = useFennec();
  const [loginWithToken] = useLoginWithTokenMutation({
    update(_, { data: { loginWithToken: user } }) {
      if (user) {
        Toast.show(t('success_logged_in'));
        setCurrentUser(user);
      }
    },
  });

  return (
    <ActionSheet
      visible={logging}
      actions={[
        {
          text: t('connect_mixin_messenger_wallet'),
          onClick: () => location.replace('/login'),
        },
        {
          text: t('connect_fennec_wallet'),
          onClick: async () => {
            if (fennec) {
              const token = await fennec.wallet.signToken({
                payload: { from: 'Mixcoin' },
              });
              loginWithToken({ variables: { input: { token } } });
            } else {
              ToastError(t('fennec_not_found'));
            }
          },
        },
      ]}
      onMaskClick={() => setLogging && setLogging(false)}
    />
  );
}
