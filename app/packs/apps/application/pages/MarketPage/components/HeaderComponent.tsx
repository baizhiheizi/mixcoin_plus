import { useMixinBot } from 'apps/shared';
import { OceanMarket } from 'graphqlTypes';
import { shareMixinAppCard } from 'mixin-messenger-utils';
import React from 'react';
import { Share2 as Share2Icon } from 'react-feather';
import { useHistory } from 'react-router';

export default function HeaderComponent(props: {
  market: Partial<OceanMarket> & any;
}) {
  const history = useHistory();
  const { market } = props;
  const { appId, appName } = useMixinBot();

  return (
    <>
      <div className='flex items-center px-4 py-2 mb-1 bg-white dark:bg-gray-800 dark:text-white'>
        <div className='mr-2 text-lg font-semibold'>
          {market.baseAsset.symbol}/{market.quoteAsset.symbol}
        </div>
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
      </div>
    </>
  );
}
