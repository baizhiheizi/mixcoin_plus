import { useCurrentUser } from 'apps/application/contexts';
import { useMixinBot } from 'apps/shared';
import { shareMixinAppCard } from 'mixin-messenger-utils';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';
import { Button, Cell, Modal, Panel, Radio } from 'zarm';

export default function MineComponent() {
  const history = useHistory();
  const { currentUser } = useCurrentUser();
  const { appId, appName, appIconUrl } = useMixinBot();
  const { t, i18n } = useTranslation();

  if (!currentUser) {
    return (
      <div className='flex w-64 h-screen bg-white'>
        <Button
          className='m-auto'
          onClick={() =>
            Modal.confirm({
              content: t('authorize_tips'),
              onOk: () => location.replace('/login'),
            })
          }
          theme='primary'
        >
          {t('connect_wallet')}
        </Button>
      </div>
    );
  }

  return (
    <div className='w-64 h-screen bg-white dark:bg-dark'>
      <div className='pt-8 text-center'>
        <img
          className='object-cover w-10 h-10 mx-auto mb-2 rounded-full bg-gray-50'
          src={currentUser.avatar}
        />
        <div className='dark:text-gray-200'>{currentUser.name}</div>
      </div>
      <Panel>
        <Cell
          title={t('orders')}
          hasArrow
          onClick={() => history.push('/orders')}
        />
        <Cell
          title={t('deprecated_orders')}
          hasArrow
          onClick={() => history.push('/deprecated_orders')}
        />
        <Cell
          title={t('commission_plan')}
          hasArrow
          onClick={() =>
            Modal.confirm({
              title: t('commission_plan'),
              content: (
                <div className='text-left whitespace-pre-line'>
                  {t('commission_plan_rules')}
                </div>
              ),
              okText: t('invite'),
              onOk: () =>
                shareMixinAppCard({
                  data: {
                    action: `${location.origin}/?invite_code=${currentUser.inviteCode}`,
                    app_id: appId,
                    description: t('exchange_any_asset'),
                    icon_url: appIconUrl,
                    title: appName,
                  },
                }),
            })
          }
        />
        <Cell
          title={t('language')}
          description={
            <Radio.Group
              type='button'
              compact
              value={i18n.language}
              onChange={(value: 'en' | 'zh-CN') => i18n.changeLanguage(value)}
            >
              <Radio value='en'>EN</Radio>
              <Radio value='zh-CN'>中文</Radio>
            </Radio.Group>
          }
        />
        <Cell
          hasArrow
          title={t('logout')}
          onClick={() =>
            Modal.confirm({
              content: t('logout_confirm'),
              onOk: () => location.replace('/logout'),
            })
          }
        ></Cell>
      </Panel>
    </div>
  );
}
