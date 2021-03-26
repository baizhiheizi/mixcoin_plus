import { depthChartOptions, ITick } from 'apps/application/utils';
import HighchartsReact from 'highcharts-react-official';
import Highcharts from 'highcharts/highstock';
import Ema from 'highcharts/indicators/ema.js';
import Indicators from 'highcharts/indicators/indicators.js';
import 'moment-timezone';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator } from 'zarm';

Indicators(Highcharts);
Ema(Highcharts);

export default function DepthChartComponent(props: {
  connected: boolean;
  asks: ITick[];
  bids: ITick[];
}) {
  const { t } = useTranslation();
  const { asks, bids, connected } = props;

  return (
    <>
      <div className='px-4 pb-2 mb-1 bg-white dark:bg-dark'>
        {asks.length > 0 && bids.length > 0 ? (
          <HighchartsReact
            containerProps={{ className: 'h-80' }}
            highcharts={Highcharts}
            options={depthChartOptions(asks, bids)}
          />
        ) : connected ? (
          <div className='p-4 text-center text-red-500 h-80'>
            {t('no_depth_yet')}
          </div>
        ) : (
          <div className='flex p-4 h-80'>
            <ActivityIndicator type='spinner' className='m-auto' />
          </div>
        )}
      </div>
    </>
  );
}
