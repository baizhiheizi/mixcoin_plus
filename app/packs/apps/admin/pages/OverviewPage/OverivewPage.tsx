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
          title='Daily Active Users Count'
          value={appStatistic.dailyActiveUsersCount}
        />
        <Statistic
          title='Weekly Active Users Count'
          value={appStatistic.weeklyActiveUsersCount}
        />
        <Statistic
          title='Monthly Active Users Count'
          value={appStatistic.monthlyActiveUsersCount}
        />
        <Statistic
          title='Connected Applets Count'
          value={appStatistic.connectedAppletsCount}
        />
        <Statistic
          title='Applet Activities Count'
          value={appStatistic.appletActivitiesCount}
        />
        <Statistic
          title='Applet Activity Swap Orders Count'
          value={appStatistic.appletActivitySwapOrdersCount}
        />
        <Statistic
          title='Applet Activity Swap Orders Traded Total(USD)'
          value={appStatistic.appletActivitySwapOrdersTradedTotalUsd.toFixed(2)}
        />
        <Statistic
          title='Ocean Orders Count'
          value={appStatistic.validOceanOrdersCount}
        />
        <Statistic title='Markets Count' value={appStatistic.marketsCount} />
        <Statistic
          title='Match Total(USD)'
          precision={2}
          value={appStatistic.matchTotalUsd.toFixed(2)}
        />
        <Statistic
          title='Fee Total(USD)'
          value={appStatistic.feeTotalUsd.toFixed(2)}
          precision={2}
        />
        <Statistic
          title='Invitation Commission Total(USD)'
          value={appStatistic.invitationCommissionTotalUsd.toFixed(2)}
          precision={2}
        />
        <Statistic
          title='Group Owner Commission Total(USD)'
          value={appStatistic.groupOwnerCommissionTotalUsd.toFixed(2)}
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
          title='Connected Applets Count'
          value={appStatistic.connectedAppletsCount}
          valueStyle={{
            color:
              appStatistic.connectedAppletsCount > 0 ? '#3f8600' : '#cf1322',
          }}
          prefix={appStatistic.connectedAppletsCount > 0 && <ArrowUpOutlined />}
        />
        <Statistic
          title='Applet Activities Count'
          value={appStatistic.appletActivitiesCount}
          valueStyle={{
            color:
              appStatistic.appletActivitiesCount > 0 ? '#3f8600' : '#cf1322',
          }}
          prefix={appStatistic.appletActivitiesCount > 0 && <ArrowUpOutlined />}
        />
        <Statistic
          title='Applet Activity Swap Orders Count'
          value={appStatistic.appletActivitySwapOrdersCount}
          valueStyle={{
            color:
              appStatistic.appletActivitySwapOrdersCount > 0
                ? '#3f8600'
                : '#cf1322',
          }}
          prefix={
            appStatistic.appletActivitySwapOrdersCount > 0 && (
              <ArrowUpOutlined />
            )
          }
        />
        <Statistic
          title='Applet Activity Swap Orders Traded Total(USD)'
          value={appStatistic.appletActivitySwapOrdersTradedTotalUsd.toFixed(2)}
          valueStyle={{
            color:
              appStatistic.appletActivitySwapOrdersTradedTotalUsd > 0
                ? '#3f8600'
                : '#cf1322',
          }}
          prefix={
            appStatistic.appletActivitySwapOrdersTradedTotalUsd > 0 && (
              <ArrowUpOutlined />
            )
          }
        />
        <Statistic
          title='Valid Orders Count'
          value={appStatistic.validOceanOrdersCount}
          valueStyle={{
            color:
              appStatistic.validOceanOrdersCount > 0 ? '#3f8600' : '#cf1322',
          }}
          prefix={appStatistic.validOceanOrdersCount > 0 && <ArrowUpOutlined />}
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
          value={appStatistic.matchTotalUsd.toFixed(2)}
          precision={4}
          valueStyle={{
            color: appStatistic.matchTotalUsd > 0 ? '#3f8600' : '#cf1322',
          }}
          prefix={appStatistic.matchTotalUsd > 0 && <ArrowUpOutlined />}
        />
        <Statistic
          title='Fee Total(USD)'
          value={appStatistic.feeTotalUsd.toFixed(2)}
          precision={4}
          valueStyle={{
            color: appStatistic.feeTotalUsd > 0 ? '#3f8600' : '#cf1322',
          }}
          prefix={appStatistic.feeTotalUsd > 0 && <ArrowUpOutlined />}
        />
        <Statistic
          title='Invitation Commission Total(USD)'
          value={appStatistic.invitationCommissionTotalUsd.toFixed(2)}
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
          value={appStatistic.groupOwnerCommissionTotalUsd.toFixed(2)}
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
