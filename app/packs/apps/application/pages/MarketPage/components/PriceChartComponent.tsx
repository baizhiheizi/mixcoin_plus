import { priceChartOptions } from 'apps/application/utils';
import { useMarketPriceChartDataQuery } from 'graphqlTypes';
import HighchartsReact from 'highcharts-react-official';
import Highcharts from 'highcharts/highstock';
import Ema from 'highcharts/indicators/ema.js';
import Indicators from 'highcharts/indicators/indicators.js';
import 'moment-timezone';
import React from 'react';
import { ActivityIndicator } from 'zarm';

Indicators(Highcharts);
Ema(Highcharts);

export default function PriceChartComponent(props: { marketId: string }) {
  const { marketId } = props;
  const { loading, data } = useMarketPriceChartDataQuery({
    variables: { marketId },
  });

  return (
    <>
      <div className='px-4 pb-4 mb-1 bg-white'>
        {loading ? (
          <div className='flex h-60'>
            <ActivityIndicator type='spinner' className='m-auto' />
          </div>
        ) : (
          <HighchartsReact
            containerProps={{ className: 'h-60' }}
            highcharts={Highcharts}
            constructorType={'stockChart'}
            options={priceChartOptions(data?.marketPriceChartData)}
          />
        )}
      </div>
    </>
  );
}
