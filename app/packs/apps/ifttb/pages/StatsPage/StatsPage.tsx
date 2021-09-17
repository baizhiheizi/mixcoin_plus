import { Left as LeftIcon } from '@icon-park/react';
import LoaderComponent from 'apps/shared/components/LoaderComponent/LoaderComponent';
import { useIfttbUserStatsQuery } from 'graphqlTypes';
import React from 'react';
import { useHistory } from 'react-router-dom';

export default function StatsPage() {
  const history = useHistory();
  const { loading, data } = useIfttbUserStatsQuery({
    nextFetchPolicy: 'cache-and-network',
  });

  if (loading) {
    return <LoaderComponent />;
  }

  const {
    currentUser: { ifttbStats },
  } = data;

  return (
    <>
      <div className='relative p-4 text-xl font-bold'>
        <LeftIcon
          onClick={() => history.goBack()}
          className='absolute pt-1 left-8'
          size='1.25rem'
        />
        <div className='text-center'>User Stats</div>
      </div>
      <div className='px-4'>
        <div className='p-4 border rounded shadow'>
          <div className='mb-4'>
            <div className='font-bold'>Completed Activities</div>
            <div className='flex items-center justify-end space-x-2'>
              <span>{ifttbStats.appletActivitiesCompletedCount}</span>
              <span>times</span>
            </div>
          </div>
          {ifttbStats.payAssets && ifttbStats.fillAssets && (
            <>
              <div className='mb-2'>
                <div className='font-bold'>Received</div>
                {ifttbStats.fillAssets.map((fillAsset) => (
                  <div key={fillAsset.assetId}>
                    <div className='flex items-center justify-end space-x-2'>
                      <img
                        className='w-6 h-6 rounded-full'
                        src={fillAsset.iconUrl}
                      />
                      <span>{fillAsset.fillTotal}</span>
                      <span>{fillAsset.symbol}</span>
                    </div>
                    <div className='flex items-center justify-end space-x-2'>
                      <span>≈</span>
                      <span>${fillAsset.fillTotalUsd.toFixed(2)}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className='mb-2'>
                <div className='font-bold'>Received total</div>
                <div className='flex items-center justify-end space-x-2'>
                  <span>≈</span>
                  <span>${ifttbStats.fillTotalUsd.toFixed(2)}</span>
                </div>
              </div>
              <div className='mb-2'>
                <div className='font-bold'>Paid</div>
                {ifttbStats.payAssets.map((payAsset) => (
                  <div key={payAsset.assetId}>
                    <div className='flex items-center justify-end space-x-2'>
                      <img
                        className='w-6 h-6 rounded-full'
                        src={payAsset.iconUrl}
                      />
                      <span>{payAsset.payTotal}</span>
                      <span>{payAsset.symbol}</span>
                    </div>
                    <div className='flex items-center justify-end space-x-2'>
                      <span>≈</span>
                      <span>${payAsset.payTotalUsd.toFixed(2)}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className='mb-2'>
                <div className='font-bold'>Paid total</div>
                <div className='flex items-center justify-end space-x-2'>
                  <span>≈</span>
                  <span>${ifttbStats.payTotalUsd.toFixed(2)}</span>
                </div>
              </div>
              <div className='mb-2'>
                <div className='font-bold'>Profit</div>
                <div className='flex items-center justify-end space-x-2'>
                  {ifttbStats.profit >= 0 ? (
                    <span className='text-green-500'>
                      +$
                      {(
                        ifttbStats.fillTotalUsd - ifttbStats.payTotalUsd
                      ).toFixed(2)}
                    </span>
                  ) : (
                    <span className='text-red-500'>
                      -$
                      {(
                        ifttbStats.payTotalUsd - ifttbStats.fillTotalUsd
                      ).toFixed(2)}
                    </span>
                  )}
                </div>
                <div className='flex items-center justify-end space-x-2'>
                  {ifttbStats.profit >= 0 ? (
                    <span className='text-green-500'>
                      +{(ifttbStats.profit * 100).toFixed(2)}%
                    </span>
                  ) : (
                    <span className='text-red-500'>
                      -{(-ifttbStats.profit * 100).toFixed(2)}%
                    </span>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
