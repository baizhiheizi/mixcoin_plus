import { useCurrentUser } from 'apps/application/contexts';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';
import { Button, Cell, Modal, Panel, Radio } from 'zarm';

export default function MineComponent() {
  const history = useHistory();
  const { currentUser } = useCurrentUser();
  const { t, i18n } = useTranslation();

  if (!currentUser) {
    return (
      <div className='px-4 pt-32'>
        <Button
          block
          onClick={() =>
            Modal.confirm({
              content: t('authorize_tips'),
              onOk: () => location.replace('/login'),
            })
          }
          theme='primary'
        >
          {t('please_log_in_first')}
        </Button>
      </div>
    );
  }

  return (
    <>
      <div className='pt-8 text-center'>
        <img
          className='object-cover mx-auto mb-2 bg-gray-500 rounded-full w-14 h-14'
          src={currentUser.avatar}
        />
        <div className='dark:text-gray-200'>{currentUser.name}</div>
      </div>
      <Panel>
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
      </Panel>
      <Panel>
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
    </>
  );
}
