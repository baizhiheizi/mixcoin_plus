import { BigNumber } from 'bignumber.js';
import * as Highcharts from 'highcharts/highstock';
import 'moment-timezone';
import moment from 'moment';
import { ITick, ITrade } from './oceanApi';

export function prepareCandleData(data: Array<Array<number>>) {
  let ohlc = [],
    volume = [],
    dataLength = data.length;

  for (let i = 0; i < dataLength; i += 1) {
    ohlc.push([
      data[i][0] * 1000, // the date
      data[i][3], // open
      data[i][2], // high
      data[i][1], // low
      data[i][4], // close
    ]);

    volume.push([
      parseFloat(new BigNumber(data[i][0]).times(1000).toFixed(8)), // the date
      parseFloat(new BigNumber(data[i][5]).toFixed(8)), // the volume
    ]);
  }

  return [ohlc, volume];
}

export function priceChartOptions(data: any[]): Highcharts.Options {
  return {
    navigator: {
      enabled: false,
    },
    scrollbar: {
      enabled: false,
    },
    rangeSelector: {
      enabled: false,
    },
    chart: {
      panning: {
        enabled: false,
      },
    },
    series: [
      {
        type: 'area',
        name: 'Price',
        data,
        tooltip: {
          valueDecimals: 2,
        },
        fillColor: {
          linearGradient: {
            x1: 0,
            y1: 0,
            x2: 0,
            y2: 1,
          },
          stops: [
            [0, '#7cb5ec'],
            [1, 'rgba(124,181,236, 0)'],
          ],
        },
        threshold: null,
      },
    ],
  };
}

export function candleChartOptions(
  currency: string,
  candles: Array<Array<number>>,
): Highcharts.Options {
  const data = prepareCandleData(candles);
  const ohlc = data[0];
  const volume = data[1];
  const groupingUnits: Array<[string, Array<number> | null]> = [
    ['minute', [1, 5, 15, 30]],
    ['hour', [1, 6, 12, 24]],
  ];

  return {
    chart: {
      panning: { enabled: false },
      spacing: [0, 0, 0, 0],
    },
    time: {
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      moment: moment,
    },
    title: { text: undefined },

    credits: {
      enabled: false,
    },

    rangeSelector: {
      enabled: false,
    },

    scrollbar: {
      enabled: false,
    },

    navigator: {
      enabled: false,
    },

    legend: {
      enabled: false,
    },

    plotOptions: {
      series: {
        stickyTracking: false,
        showInLegend: false,
      },
    },

    yAxis: [
      {
        labels: {
          align: 'right',
          x: -3,
          formatter: (obj) => {
            return new BigNumber(obj.value).toString(10);
          },
        },
        height: '70%',
        resize: { enabled: true },
        gridLineWidth: 0.5,
        lineWidth: 0,
        title: { text: null },
      },
      {
        labels: {
          align: 'right',
          x: -3,
        },
        top: '70%',
        height: '30%',
        offset: 0,
        gridLineWidth: 0.5,
        lineWidth: 0,
        title: { text: null },
      },
    ],

    tooltip: {
      followPointer: true,
      followTouchMove: false,
      split: true,
    },

    series: [
      {
        type: 'column',
        name: 'Volume',
        data: volume,
        yAxis: 1,
        dataGrouping: {
          units: groupingUnits,
        },
        color: 'rgba(41,149,242,0.3)',
      },
      {
        type: 'candlestick',
        id: 'candle',
        name: currency,
        data: ohlc,
        dataGrouping: {
          units: groupingUnits,
        },
      },
      {
        type: 'ema',
        linkedTo: 'candle',
        params: {
          period: 12,
        },
        color: 'rgba(255,155,100,0.5)',
        lineWidth: 1,
      },
      {
        type: 'ema',
        linkedTo: 'candle',
        params: {
          period: 26,
        },
        color: 'rgba(100,155,255,0.5)',
        lineWidth: 1,
      },
    ],
  };
}

export function depthChartOptions(
  asks: ITick[],
  bids: ITick[],
  depth: number = 0,
): Highcharts.Options {
  let bidsData = [];
  for (let i = 0; i < bids.length; i++) {
    bids[i].volume = parseFloat(bids[i].amount);
    if (i > 0) {
      bids[i].volume = parseFloat(
        new BigNumber(bids[i - 1].volume).plus(bids[i].volume).toFixed(8),
      );
    }
    bidsData.push({
      x: parseFloat(bids[i].price),
      y: bids[i].volume,
    });
  }
  let start = (bidsData.length * 1) / 4 + (bidsData.length * depth) / 2;
  if (bidsData.length > 1000) {
    start = bidsData.length - 1000 + (1000 * 1) / 4 + (1000 * depth) / 2;
  }
  bidsData = bidsData.reverse();
  bidsData = bidsData.splice(start);

  let asksInput = [];
  for (let i = 0; i < asks.length; i++) {
    asks[i].volume = parseFloat(parseFloat(asks[i].amount).toFixed(4));
    if (i > 0) {
      asks[i].volume = parseFloat(
        new BigNumber(asks[i - 1].volume).plus(asks[i].volume).toFixed(4),
      );
    }
    asksInput.push({
      x: parseFloat(asks[i].price),
      y: asks[i].volume,
    });
  }
  let asksData = [];
  let priceThreshold =
    bidsData[bidsData.length - 1].x + asksInput[0].x - bidsData[0].x;
  for (let i = 0; i < asksInput.length; i++) {
    let point = asksInput[i];
    if (point.x > priceThreshold && asksData.length > 10) {
      break;
    }
    asksData.push(point);
  }

  if (asksData.length > 1000) {
    asksData = asksData.slice(0, 1000);
  }
  let minPrice = bidsData[0].x;
  let maxPrice = asksData[asksData.length - 1].x;
  let maxVolume = bidsData[0].y;
  if (asksData[asksData.length - 1].y > maxVolume) {
    maxVolume = asksData[asksData.length - 1].y;
  }

  return {
    chart: {
      panning: { enabled: false },
      spacing: [0, 0, 0, 0],
    },

    credits: {
      enabled: false,
    },

    rangeSelector: {
      enabled: false,
    },

    scrollbar: {
      enabled: false,
    },

    navigator: {
      enabled: false,
    },

    legend: {
      enabled: false,
    },

    title: {
      text: null,
    },

    xAxis: {
      gridLineWidth: 0.5,
      min: minPrice,
      max: maxPrice,
      labels: {
        formatter: function () {
          return new BigNumber(this.value).toString(10);
        },
      },
    },

    yAxis: {
      opposite: true,
      labels: {
        align: 'right',
        x: -3,
        y: -2,
        formatter: function () {
          return new BigNumber(this.value).toString(10);
        },
      },
      lineWidth: 0,
      resize: {
        enabled: true,
      },
      gridLineWidth: 0.5,
      max: maxVolume,
      min: 0,
      title: {
        text: '',
      },
    },

    plotOptions: {
      series: {
        stickyTracking: false,
        animation: false,
        marker: {
          enabled: false,
          symbol: 'circle',
          states: {
            hover: {
              enabled: true,
            },
          },
        },
      },
    },
    tooltip: {
      followPointer: true,
      followTouchMove: false,
    },
    series: [
      {
        type: 'area',
        name: 'Buy orders',
        data: bidsData,
        color: 'rgba(1,170,120,1.0)',
        fillColor: 'rgba(1,170,120,0.2)',
      },
      {
        type: 'area',
        name: 'Sell orders',
        data: asksData,
        color: 'rgba(255,95,115,1.0)',
        fillColor: 'rgba(255,95,115,0.2)',
      },
    ],
  };
}
