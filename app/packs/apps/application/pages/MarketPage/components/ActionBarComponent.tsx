import { Share as ShareIcon, Star as StarIcon } from '@icon-park/react';
import { useCurrentUser } from 'apps/application/contexts';
import { useMixinBot } from 'apps/shared';
import {
  Market,
  useFavoriteMarketMutation,
  useUnfavoriteMarketMutation,
} from 'graphqlTypes';
import { shareMixinAppCard } from 'mixin-messenger-utils';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';
import { Modal } from 'zarm';

export default function ActionBarComponent(props: { market: Market }) {
  const history = useHistory();
  const { currentUser } = useCurrentUser();
  const { market } = props;
  const { t } = useTranslation();
  const [favorite] = useFavoriteMarketMutation({
    variables: { input: { marketId: market.id } },
  });
  const [unfavorite] = useUnfavoriteMarketMutation({
    variables: { input: { marketId: market.id } },
  });
  const { appId, appName } = useMixinBot();

  return (
    <div className='fixed bottom-0 z-50 w-full py-4 bg-white shadow-inner dark:bg-dark'>
      <div className='flex items-center w-full px-2'>
        <div className='mx-2 text-center'>
          <StarIcon
            size='1rem'
            className='flex justify-center mb-1'
            fill={market.favorited ? '#F59E0B' : '#aaa'}
            theme={market.favorited ? 'filled' : 'outline'}
            onClick={() => {
              if (!currentUser) {
                Modal.confirm({
                  content: t('connect_wallet'),
                  onOk: () => location.replace('/'),
                });
              } else if (market.favorited) {
                Modal.confirm({
                  content: t('confirm_unfavorite_market'),
                  onOk: () => unfavorite(),
                });
              } else {
                favorite();
              }
            }}
          />
          <div className='text-xs text-gray-500 dark:text-gray-100'>
            {t('favorite')}
          </div>
        </div>
        <div className='mx-2'>
          <ShareIcon
            size='1rem'
            className='flex justify-center mb-1'
            fill='#aaa'
            onClick={() =>
              shareMixinAppCard({
                data: {
                  action: `${location.href}?invite_code=${
                    currentUser?.inviteCode || ''
                  }`,
                  app_id: appId,
                  description: appName,
                  icon_url: market.baseAsset.iconUrl,
                  title: `${market.baseAsset.symbol}/${market.quoteAsset.symbol}`,
                },
              })
            }
          />
          <div className='text-xs text-gray-500 dark:text-gray-100'>
            {t('share')}
          </div>
        </div>
        <a
          className='flex-1 py-2 mx-2 text-center text-white bg-green-500 rounded'
          onClick={() => {
            history.push(`/exchange?market=${market.id}&side=bid`);
          }}
        >
          {t('buy')}
        </a>
        <a
          className='flex-1 py-2 mx-2 text-center text-white bg-red-500 rounded'
          onClick={() => {
            history.push(`/exchange?market=${market.id}&side=ask`);
          }}
        >
          {t('sell')}
        </a>
      </div>
      <div style={{ height: 'env(safe-area-inset-bottom)' }}></div>
    </div>
  );
}
