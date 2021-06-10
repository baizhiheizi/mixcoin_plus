import { Button, Descriptions, PageHeader, Tabs } from 'antd';
import { useAdminBookingOrderActivityQuery } from 'graphqlTypes';
import LoadingComponent from 'apps/admin/components/LoadingComponent/LoadingComponent';
import BookingOrderSnapshotsComponent from 'apps/admin/components/BookingOrderSnapshotsComponent/BookingOrderSnapshotsComponent';
import BookingOrderActivityParticipantsComponent from 'apps/admin/components/BookingOrderActivityParticipantsComponent/BookingOrderActivityParticipantsComponent';
import React from 'react';
import { useParams } from 'react-router-dom';

export default function BookingOrderActivityPage() {
  const { id } = useParams<{ id: string }>();
  const { loading, data, refetch } = useAdminBookingOrderActivityQuery({
    variables: { id },
  });

  if (loading) {
    return <LoadingComponent />;
  }

  const { adminBookingOrderActivity: activity } = data;
  return (
    <>
      <PageHeader
        title='Booking Order Activity'
        extra={[
          <Button key='refresh' type='primary' onClick={() => refetch()}>
            Refresh
          </Button>,
        ]}
      />
      <Descriptions>
        <Descriptions.Item label='ID'>{activity.id}</Descriptions.Item>
        <Descriptions.Item label='Market'>
          {`${activity.market.baseAsset.symbol}/${activity.market.quoteAsset.symbol}`}
        </Descriptions.Item>
        <Descriptions.Item label='bonuse total'>
          {`${activity.bonusTotal} ${activity.bonusAsset.symbol}`}
        </Descriptions.Item>
        <Descriptions.Item label='scoresTotal'>
          {activity.scoresTotal}
        </Descriptions.Item>
      </Descriptions>
      <Tabs defaultActiveKey='snapshots'>
        <Tabs.TabPane tab='Participants' key='participants'>
          <BookingOrderActivityParticipantsComponent
            bookingOrderActivityId={activity.id}
          />
        </Tabs.TabPane>
        <Tabs.TabPane tab='Booking Orders' key='oceanOrders'>
          <BookingOrderSnapshotsComponent
            marketId={activity.marketId}
            startedAt={activity.startedAt}
            endedAt={activity.endedAt}
          />
        </Tabs.TabPane>
      </Tabs>
    </>
  );
}
