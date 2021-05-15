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
  const { setFennec, fennec } = useFennec();
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
            const ext = checkFennec();
            if (!ext) {
              return;
            }
            let ctx: any;
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

export const checkFennec = (retryTimes = 0) => {
  const { t } = useTranslation();

  Toast.show(t('checking_fennec'));
  if ((window as any)?.__MIXIN__?.mixin_ext) {
    const ext = (window as any).__MIXIN__.mixin_ext;
    return ext;
  }
  if (retryTimes < 3) {
    setTimeout(() => {
      checkFennec(retryTimes + 1);
    }, 1000);
  } else {
    ToastError(t('fennec_not_found'));
  }
};
