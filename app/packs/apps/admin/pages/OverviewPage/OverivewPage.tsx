import { PageHeader, Statistic } from 'antd';
import LoadingComponent from 'apps/admin/components/LoadingComponent/LoadingComponent';
import { useAdminAppStatisticQuery } from 'graphqlTypes';
import React from 'react';
import { ArrowUpOutlined } from '@ant-design/icons';

export default function OverviewPage() {
  return (
    <>
      <PageHeader title='Statistic' />
      <div className='mb-8'>
        <StatisticAllComponent />
      </div>
      <div className='mb-8'>
        <Statistic24hComponent />
      </div>
    </>
  );
}

function StatisticAllComponent() {
  const { loading, data } = useAdminAppStatisticQuery();
  if (loading) {
    return <LoadingComponent />;
  }

  const { adminAppStatistic: appStatistic } = data;

  return (
    <>
      <div className='mb-4 text-xl'>All Statistic</div>
      <div className='text-center grid grid-cols-1 md:grid-cols-4 gap-4'>
        <Statistic title='Users Count' value={appStatistic.usersCount} />
        <Statistic
          title='Valid Orders Count'
          value={appStatistic.validOrdersCount}
        />
        <Statistic title='Markets Count' value={appStatistic.marketsCount} />
        <Statistic
          title='Match Total(USD)'
          precision={2}
          value={appStatistic.matchTotalUsd}
        />
        <Statistic
          title='Fee Total(USD)'
          value={appStatistic.feeTotalUsd}
          precision={2}
        />
        <Statistic
          title='Invitation Commission Total(USD)'
          value={appStatistic.invitationCommissionTotalUsd}
          precision={2}
        />
        <Statistic
          title='Group Owner Commission Total(USD)'
          value={appStatistic.groupOwnerCommissionTotalUsd}
          precision={2}
        />
        <Statistic
          title='Unprocessed Snapshots'
          value={appStatistic.unprocessedSnapshotsCount}
          valueStyle={{
            color: appStatistic.unprocessedSnapshotsCount > 0 && '#cf1322',
          }}
        />
        <Statistic
          title='Unprocessed Transfers'
          value={appStatistic.unprocessedTransfersCount}
          valueStyle={{
            color: appStatistic.unprocessedTransfersCount > 0 && '#cf1322',
          }}
        />
      </div>
    </>
  );
}

function Statistic24hComponent() {
  const { loading, data } = useAdminAppStatisticQuery({
    variables: { scope: '24h' },
  });
  if (loading) {
    return <LoadingComponent />;
  }

  const { adminAppStatistic: appStatistic } = data;

  return (
    <>
      <div className='mb-4 text-xl'>24 Hours Statistic</div>
      <div className='text-center grid grid-cols-1 md:grid-cols-4 gap-4'>
        <Statistic
          title='Users Count'
          value={appStatistic.usersCount}
          valueStyle={{
            color: appStatistic.usersCount > 0 ? '#3f8600' : '#cf1322',
          }}
          prefix={appStatistic.usersCount > 0 && <ArrowUpOutlined />}
        />
        <Statistic
          title='Valid Orders Count'
          value={appStatistic.validOrdersCount}
          valueStyle={{
            color: appStatistic.validOrdersCount > 0 ? '#3f8600' : '#cf1322',
          }}
          prefix={appStatistic.validOrdersCount > 0 && <ArrowUpOutlined />}
        />
        <Statistic
          title='Markets Count'
          value={appStatistic.marketsCount}
          valueStyle={{
            color: appStatistic.marketsCount > 0 ? '#3f8600' : '#cf1322',
          }}
          prefix={appStatistic.marketsCount > 0 && <ArrowUpOutlined />}
        />
        <Statistic
          title='Match Total(USD)'
          value={appStatistic.matchTotalUsd}
          precision={4}
          valueStyle={{
            color: appStatistic.matchTotalUsd > 0 ? '#3f8600' : '#cf1322',
          }}
          prefix={appStatistic.matchTotalUsd > 0 && <ArrowUpOutlined />}
        />
        <Statistic
          title='Fee Total(USD)'
          value={appStatistic.feeTotalUsd}
          precision={4}
          valueStyle={{
            color: appStatistic.feeTotalUsd > 0 ? '#3f8600' : '#cf1322',
          }}
          prefix={appStatistic.feeTotalUsd > 0 && <ArrowUpOutlined />}
        />
        <Statistic
          title='Invitation Commission Total(USD)'
          value={appStatistic.invitationCommissionTotalUsd}
          precision={4}
          valueStyle={{
            color:
              appStatistic.invitationCommissionTotalUsd > 0
                ? '#3f8600'
                : '#cf1322',
          }}
          prefix={
            appStatistic.invitationCommissionTotalUsd > 0 && <ArrowUpOutlined />
          }
        />
        <Statistic
          title='Group Owner Commission Total(USD)'
          value={appStatistic.groupOwnerCommissionTotalUsd}
          precision={4}
          valueStyle={{
            color:
              appStatistic.groupOwnerCommissionTotalUsd > 0
                ? '#3f8600'
                : '#cf1322',
          }}
          prefix={
            appStatistic.groupOwnerCommissionTotalUsd > 0 && <ArrowUpOutlined />
          }
        />
        <Statistic
          title='Unprocessed Snapshots'
          value={appStatistic.unprocessedSnapshotsCount}
          valueStyle={{
            color:
              appStatistic.unprocessedSnapshotsCount > 0
                ? '#cf1322'
                : '#3f8600',
          }}
        />
        <Statistic
          title='Unprocessed Transfers'
          value={appStatistic.unprocessedTransfersCount}
          valueStyle={{
            color:
              appStatistic.unprocessedTransfersCount > 0
                ? '#cf1322'
                : '#3f8600',
          }}
        />
      </div>
    </>
  );
}
