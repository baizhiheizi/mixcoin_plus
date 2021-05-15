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
  const { fennec, setFennec } = useFennec();
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
            let ctx: any;
            const ext = (window as any).__MIXIN__?.mixin_ext;
            if (!ext) {
              ToastError(t('fennec_not_found'));
              return;
            }

            if (fennec) {
              ctx = fennec;
            } else {
              ctx = await ext.enable('Mixcoin');
              setFennec(ctx);
            }
            const token = await ctx.wallet.signToken({
              payload: { from: 'Mixcoin' },
            });
            loginWithToken({ variables: { input: { token } } });
          },
        },
      ]}
      onMaskClick={() => setLogging && setLogging(false)}
    />
  );
}
