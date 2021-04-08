import NavbarComponent from 'apps/application/components/NavbarComponent/NavbarComponent';
import { imageAsset } from 'apps/application/utils';
import React from 'react';
import { useTranslation } from 'react-i18next';

export default function CommissionPage() {
  const { t } = useTranslation();
  return (
    <div className='min-h-screen bg-white dark:bg-dark'>
      <NavbarComponent back />
      <div
        className='flex items-center w-full h-40 mb-2 bg-white bg-right bg-no-repeat bg-contain dark:bg-dark'
        style={{ backgroundImage: `url(${imageAsset('cashback.svg')})` }}
      >
        <div className='p-6'>
          <div className='text-xl font-bold text-yellow-500'>
            {t('commission_plan')}
          </div>
          <div className='text-base text-gray-500'>
            {t('grow_along_with_mixcoin')}
          </div>
        </div>
      </div>
      <div className='px-4'>
        <div className='mb-4'>
          {t('you_have_two_ways_to_earn_your_commission')}
        </div>
        <div className='mb-2 text-lg text-yellow-500'>
          {t('invitation_commission')}
        </div>
        <ol className='px-6 mb-2 list-decimal'>
          <li>{t('invitation_commission_rule_1')}</li>
          <li>{t('invitation_commission_rule_2')}</li>
          <li>{t('invitation_commission_rule_3')}</li>
        </ol>
        <div className='mb-2 text-lg text-yellow-500'>
          {t('group_owner_commission')}
        </div>
        <ol className='px-6 mb-2 list-decimal'>
          <li>{t('group_owner_commission_rule_1')}</li>
          <li>{t('group_owner_commission_rule_2')}</li>
        </ol>
        <div className='mb-2 text-lg text-yellow-500'>
          {t('commission_plan_notice')}
        </div>
        <ol className='px-6 mb-2 list-decimal'>
          <li>{t('commission_plan_notice_1')}</li>
          <li>{t('commission_plan_notice_2')}</li>
        </ol>
      </div>
    </div>
  );
}
