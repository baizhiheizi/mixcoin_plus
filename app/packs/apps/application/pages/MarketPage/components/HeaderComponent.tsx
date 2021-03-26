import { useCurrentUser } from 'apps/application/contexts';
import { useMixinBot } from 'apps/shared';
import {
  OceanMarket,
  useFavoriteOceanMarketMutation,
  useUnfavoriteOceanMarketMutation,
} from 'graphqlTypes';
import { shareMixinAppCard } from 'mixin-messenger-utils';
import React from 'react';
import { Share2 as Share2Icon, Star as StarIcon } from 'react-feather';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';
import { Modal } from 'zarm';

export default function HeaderComponent(props: {
  market: Partial<OceanMarket> | any;
}) {
  const history = useHistory();
  const { market } = props;
  const { t } = useTranslation();
  const { currentUser } = useCurrentUser();
  const { appId, appName } = useMixinBot();
  const [favorite] = useFavoriteOceanMarketMutation({
    variables: { input: { oceanMarketId: market.id } },
  });
  const [unfavorite] = useUnfavoriteOceanMarketMutation({
    variables: { input: { oceanMarketId: market.id } },
  });

  return (
    <>
      <div className='flex items-center px-4 py-2 mb-1 bg-white dark:bg-dark dark:text-white'>
        <div className='mr-4 text-lg font-semibold'>
          {market.baseAsset.symbol}/{market.quoteAsset.symbol}
        </div>
        <StarIcon
          className={`h-5 mr-4 ${
            market.favorited ? 'text-yellow-500' : 'text-gray-500'
          }`}
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
        <Share2Icon
          className='h-5 text-blue-500'
          onClick={() =>
            shareMixinAppCard({
              data: {
                action: location.href,
                app_id: appId,
                description: appName,
                icon_url: market.baseAsset.iconUrl,
                title: `${market.baseAsset.symbol}/${market.quoteAsset.symbol}`,
              },
            })
          }
        />
        <div className='ml-auto text-right'>
          {market.baseAsset.changeUsd && (
            <div
              className={`${
                market.baseAsset.changeUsd > 0
                  ? 'text-green-500'
                  : 'text-red-500'
              }`}
            >
              {(market.baseAsset.changeUsd * 100)?.toFixed(2)}%
            </div>
          )}
          {market.baseAsset.priceUsd && (
            <div className='text-xs text-gray-300'>
              ≈ ${market.baseAsset.priceUsd?.toFixed(2)}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
