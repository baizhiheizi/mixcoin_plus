import { useDebounce } from 'ahooks';
import { Button, Input, PageHeader, Select, Space, Table } from 'antd';
import { ColumnProps } from 'antd/lib/table';
import LoadingComponent from 'apps/admin/components/LoadingComponent/LoadingComponent';
import {
  BTC_ASSET_ID,
  ERC20_USDT_ASSET_ID,
  OMNI_USDT_ASSET_ID,
  PUSD_ASSET_ID,
  XIN_ASSET_ID,
} from 'apps/shared';
import {
  useAdminHideMarketMutation,
  useAdminMarketConnectionQuery,
  useAdminRankMarketMutation,
  useAdminRecommendMarketMutation,
  useAdminToggleMarketBookingOrderActivityEnableMarketMutation,
  useAdminUnhideMarketMutation,
  useAdminUnrecommendMarketMutation,
} from 'graphqlTypes';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function MarketsPage() {
  const [quoteAssetId, setQuoteAssetId] = useState('');
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, { wait: 1000 });
  const { loading, data, refetch, fetchMore } = useAdminMarketConnectionQuery({
    variables: { query: debouncedQuery, quoteAssetId },
  });
  const [rankMarket] = useAdminRankMarketMutation({
    update: () => refetch(),
  });
  const [recommendMarket] = useAdminRecommendMarketMutation({
    update: () => refetch(),
  });
  const [unrecommendMarket] = useAdminUnrecommendMarketMutation({
    update: () => refetch(),
  });
  const [hideMarket] = useAdminHideMarketMutation({
    update: () => refetch(),
  });
  const [unhideMarket] = useAdminUnhideMarketMutation({
    update: () => refetch(),
  });
  const [toggleBookingOrderActivityEnable] =
    useAdminToggleMarketBookingOrderActivityEnableMarketMutation({
      update: () => refetch(),
    });

  if (loading) {
    return <LoadingComponent />;
  }

  const {
    adminMarketConnection: {
      nodes: markets,
      pageInfo: { hasNextPage, endCursor },
    },
  } = data;

  const columns: Array<ColumnProps<any>> = [
    {
      dataIndex: 'id',
      key: 'id',
      title: 'ID',
    },
    {
      dataIndex: 'base/quote',
      key: 'base/quote',
      render: (_, market) =>
        `${market.baseAsset.symbol}/${market.quoteAsset.symbol}`,
      title: 'base/quote',
    },
    {
      dataIndex: 'rank',
      key: 'rank',
      title: 'rank',
    },
    {
      dataIndex: 'oceanOrdersCount',
      key: 'oceanOrdersCount',
      title: 'oceanOrdersCount',
    },
    {
      dataIndex: 'tradesCount',
      key: 'tradesCount',
      title: 'tradesCount',
    },
    {
      dataIndex: 'createdAt',
      key: 'createdAt',
      title: 'createdAt',
    },
    {
      dataIndex: 'Actions',
      key: 'Actions',
      render: (_, market) => (
        <Space>
          <Link to={`/markets/${market.id}`}>Detail</Link>

          {market.recommended ? (
            <a
              onClick={() =>
                unrecommendMarket({
                  variables: {
                    input: { marketId: market.id },
                  },
                })
              }
            >
              Unrecommend
            </a>
          ) : (
            <a
              onClick={() =>
                recommendMarket({
                  variables: {
                    input: { marketId: market.id },
                  },
                })
              }
            >
              Recommend
            </a>
          )}
          {market.hiddenAt ? (
            <a
              onClick={() =>
                unhideMarket({
                  variables: {
                    input: { marketId: market.id },
                  },
                })
              }
            >
              Unhide
            </a>
          ) : (
            <a
              onClick={() =>
                hideMarket({
                  variables: {
                    input: { marketId: market.id },
                  },
                })
              }
            >
              Hide
            </a>
          )}
          <a
            onClick={() =>
              toggleBookingOrderActivityEnable({
                variables: {
                  input: { marketId: market.id },
                },
              })
            }
          >
            {market.bookingOrderActivityEnable
              ? 'Disable Activity'
              : 'Enable Activity'}
          </a>
          <a
            onClick={() =>
              rankMarket({
                variables: {
                  input: { marketId: market.id, position: 'top' },
                },
              })
            }
          >
            Top
          </a>
          <a
            onClick={() =>
              rankMarket({
                variables: { input: { marketId: market.id, position: 'higher' } },
              })
            }
          >
            Higher
          </a>
          <a
            onClick={() =>
              rankMarket({
                variables: { input: { marketId: market.id, position: 'lower' } },
              })
            }
          >
            Lower
          </a>
          <a
            onClick={() =>
              rankMarket({
                variables: { input: { marketId: market.id, position: 'bottom' } },
              })
            }
          >
            Bottom
          </a>
        </Space>
      ),
      title: 'Actions',
    },
  ];

  return (
    <>
      <PageHeader title='Market Manage' />
      <div className='flex justify-between mb-4'>
        <div>
          <Input
            className='w-32 mr-2'
            placeholder='base'
            value={query}
            onChange={(e) => setQuery(e.currentTarget.value)}
          />
          <Select
            placeholder='quote'
            className='w-32'
            value={quoteAssetId}
            onChange={(value) => setQuoteAssetId(value)}
          >
            <Select.Option value=''>All</Select.Option>
            <Select.Option value={BTC_ASSET_ID}>BTC</Select.Option>
            <Select.Option value={XIN_ASSET_ID}>XIN</Select.Option>
            <Select.Option value={PUSD_ASSET_ID}>pUSD</Select.Option>
            <Select.Option value={ERC20_USDT_ASSET_ID}>
              USDT@ERC20
            </Select.Option>
            <Select.Option value={OMNI_USDT_ASSET_ID}>USDT@Omni</Select.Option>
          </Select>
        </div>
        <Button key='refresh' type='primary' onClick={() => refetch()}>
          Refresh
        </Button>
      </div>
      <Table
        scroll={{ x: true }}
        columns={columns}
        dataSource={markets}
        rowKey='id'
        pagination={false}
        size='small'
      />
      <div className='m-4 text-center'>
        <Button
          type='link'
          loading={loading}
          disabled={!hasNextPage}
          onClick={() => {
            fetchMore({
              variables: {
                after: endCursor,
              },
            });
          }}
        >
          {hasNextPage ? 'Load More' : 'No More'}
        </Button>
      </div>
    </>
  );
}
