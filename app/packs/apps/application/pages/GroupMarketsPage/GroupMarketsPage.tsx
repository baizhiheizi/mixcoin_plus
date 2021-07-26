import { Down as DownIcon } from '@icon-park/react';
import { useDebounce } from 'ahooks';
import PullComponent from 'apps/application/components/PullComponent/PullComponent';
import {
  useCurrentConversation,
  useCurrentUser,
} from 'apps/application/contexts';
import {
  Market,
  useCreateGroupMarketMutation,
  useDeleteGroupMarketMutation,
  useMarketConnectionQuery,
} from 'graphqlTypes';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';
import {
  ActivityIndicator,
  Button,
  Cell,
  Message,
  SearchBar,
  Select,
  SwipeAction,
} from 'zarm';
import Popup from 'zarm/lib/popup/Popup';

export default function GroupMarketsPage() {
  const history = useHistory();
  const { currentUser } = useCurrentUser();
  const { currentConversation } = useCurrentConversation();
  const { t } = useTranslation();
  const { loading, data, refetch } = useMarketConnectionQuery({
    variables: { type: 'recommended' },
  });
  const [popupVisible, setPopupVisible] = useState(false);
  const [pickerVisible, setPickerVisible] = useState(false);
  const [selectedMarket, setSelectedMarket] = useState<Partial<Market>>();
  const [baseAssetQuery, setBaseAssetQuery] = useState('');
  const debouncedBaseAssetQuery = useDebounce(baseAssetQuery, { wait: 1000 });
  const [quote, setQuote] = useState('USDT');

  const {
    data: baseAssetData,
    refetch: refetchBaseAsset,
    fetchMore: fetchMoreBaseAsset,
  } = useMarketConnectionQuery({
    variables: { query: debouncedBaseAssetQuery, type: quote },
  });

  const [createGroupMarket] = useCreateGroupMarketMutation({
    update() {
      refetch();
    },
  });
  const [deleteGroupMarket] = useDeleteGroupMarketMutation({
    update() {
      refetch();
    },
  });

  if (!currentConversation?.adminUuids?.includes(currentUser?.mixinUuid)) {
    location.replace('/');
    return;
  }

  if (loading) {
    return (
      <div className='flex items-center justify-center w-full py-4'>
        <ActivityIndicator size='lg' />
      </div>
    );
  }

  const {
    marketConnection: {
      nodes: markets,
      pageInfo: { hasNextPage },
    },
  } = data;

  return (
    <>
      <Message className='mb-2' size='lg' theme='primary'>
        {t('group_admin_notice')}
      </Message>
      <div className='mb-2 bg-white dark:bg-dark'>
        <div className='flex items-center px-4'>
          <div className='flex-1'>
            <div
              className='flex items-center'
              onClick={() => setPopupVisible(true)}
            >
              <div className='flex-1'>
                {selectedMarket ? (
                  <div className='flex items-center flex-1'>
                    <div className='relative mr-2'>
                      <img
                        className='w-6 h-6 rounded-full'
                        src={selectedMarket.baseAsset.iconUrl}
                      />
                      {selectedMarket.baseAsset.chainAsset && (
                        <img
                          className='absolute bottom-0 left-0 w-2 h-2 rounded-full'
                          src={selectedMarket.baseAsset.chainAsset.iconUrl}
                        />
                      )}
                    </div>
                    <div className='text-base'>
                      {selectedMarket.baseAsset.symbol}
                    </div>
                  </div>
                ) : (
                  <span className='text-gray-500'>{t('choose')}</span>
                )}
              </div>
              <DownIcon className='text-gray-500' size='1.2rem' />
            </div>
          </div>
          <div className='px-4 text-gray-500'>/</div>
          <div className='flex-1'>
            <Select
              placeholder={t('choose')}
              visible={pickerVisible}
              value={quote}
              dataSource={[
                { value: 'USDT', label: 'USDT' },
                { value: 'pUSD', label: 'pUSD' },
                { value: 'BTC', label: 'BTC' },
                { value: 'XIN', label: 'XIN' },
              ]}
              onOk={(selected: Array<{ [key: string]: string }>) => {
                if (selected[0].value !== selectedMarket.baseAsset?.assetId) {
                  setQuote(selected[0].value);
                }
              }}
              onCancel={() => setPickerVisible(false)}
            />
          </div>
        </div>
        <div className='p-4'>
          <Button
            theme='primary'
            block
            disabled={!(Boolean(selectedMarket) && Boolean(quote))}
            onClick={() =>
              createGroupMarket({
                variables: {
                  input: {
                    baseAssetId: selectedMarket.baseAsset.assetId,
                    quote,
                  },
                },
              })
            }
          >
            {t('add')}
          </Button>
        </div>
      </div>
      <PullComponent refetch={refetch} hasNextPage={hasNextPage}>
        {markets.map((market) => (
          <SwipeAction
            right={[
              <Button
                size='lg'
                shape='rect'
                theme='danger'
                onClick={() =>
                  deleteGroupMarket({
                    variables: {
                      input: {
                        marketId: market.id,
                      },
                    },
                  })
                }
              >
                {t('remove')}
              </Button>,
            ]}
          >
            <Cell
              key={market.id}
              title={
                <div className='flex-1'>
                  <div className='flex items-baseline'>
                    <div className='text-base font-semibold'>
                      {market.baseAsset.symbol}
                    </div>
                    <div className='text-xs text-gray-500'>
                      /{market.quoteAsset.symbol}
                    </div>
                  </div>
                </div>
              }
            />
          </SwipeAction>
        ))}
      </PullComponent>
      <Popup visible={popupVisible} onMaskClick={() => setPopupVisible(false)}>
        <div
          className='bg-white rounded-t-lg dark:bg-dark'
          style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
        >
          <div className='py-4'>
            <SearchBar
              onSubmit={(value) => setBaseAssetQuery(value)}
              onClear={() => setBaseAssetQuery('')}
              onCancel={() => setBaseAssetQuery('')}
            />
          </div>
          <div className='overflow-auto overscroll-y-auto min-h-96 max-h-screen-3/4'>
            <PullComponent
              hasNextPage={
                baseAssetData?.marketConnection?.pageInfo?.hasNextPage
              }
              refetch={refetchBaseAsset}
              fetchMore={() =>
                fetchMoreBaseAsset({
                  variables: {
                    after: baseAssetData?.marketConnection?.pageInfo?.endCursor,
                  },
                })
              }
            >
              {(baseAssetData?.marketConnection?.nodes || []).map((market) => (
                <Cell
                  key={market.baseAsset.assetId}
                  hasArrow
                  title={market.baseAsset.symbol}
                  icon={
                    <div className='relative'>
                      <img
                        className='w-6 h-6 rounded-full'
                        src={market.baseAsset.iconUrl}
                      />
                      {market.baseAsset.chainAsset && (
                        <img
                          className='absolute bottom-0 left-0 w-2 h-2 rounded-full'
                          src={market.baseAsset.chainAsset.iconUrl}
                        />
                      )}
                    </div>
                  }
                  onClick={() => {
                    setSelectedMarket(market as Market);
                    setPopupVisible(false);
                  }}
                />
              ))}
            </PullComponent>
          </div>
        </div>
      </Popup>
    </>
  );
}
