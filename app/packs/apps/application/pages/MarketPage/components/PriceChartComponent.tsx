import { ITrade, priceChartOptions } from 'apps/application/utils';
import { Market } from 'graphqlTypes';
import HighchartsReact from 'highcharts-react-official';
import Highcharts from 'highcharts/highstock';
import Ema from 'highcharts/indicators/ema.js';
import Indicators from 'highcharts/indicators/indicators.js';
import 'moment-timezone';
import React from 'react';
import { ActivityIndicator } from 'zarm';

Indicators(Highcharts);
Ema(Highcharts);

export default function PriceChartComponent(props: {
  fetched: boolean;
  market: Partial<Market> & any;
  trades: ITrade[];
}) {
  const { trades, fetched } = props;

  return (
    <>
      <div className='px-4 pb-4 mb-1 bg-white'>
        {fetched ? (
          <HighchartsReact
            containerProps={{ className: 'h-80' }}
            highcharts={Highcharts}
            constructorType={'stockChart'}
            options={priceChartOptions(trades)}
          />
        ) : (
          <div className='flex h-80'>
            <ActivityIndicator type='spinner' className='m-auto' />
          </div>
        )}
      </div>
    </>
  );
}
