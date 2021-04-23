import BigNumber from 'bignumber.js';
import { BigNumberConfig, ITick } from '../utils';

BigNumber.config(BigNumberConfig);

export const orderBookMessageReducer = (
  book: { asks: ITick[]; bids: ITick[] },
  msg: {
    event: 'BOOK-T0' | 'ORDER-OPEN' | 'ORDER-CANCEL' | 'ORDER-MATCH';
    data: { asks: ITick[]; bids: ITick[] } & ITick;
  },
) => {
  console.log(msg);
  switch (msg.event) {
    case 'BOOK-T0':
      return {
        asks: [...msg.data.asks.slice(0, 1000)],
        bids: [...msg.data.bids.slice(0, 1000)],
      };
    case 'ORDER-OPEN':
      const openTick = msg.data;
      const openPrice = new BigNumber(openTick.price);
      const openAmount = new BigNumber(openTick.amount);
      const openAsks = [...book.asks];
      const openBids = [...book.bids];

      if (openTick.side === 'ASK') {
        for (let i = 0; i < openAsks.length; i++) {
          const bo = openAsks[i];
          const bp = new BigNumber(bo.price);
          if (bp.isEqualTo(openPrice)) {
            bo.amount = new BigNumber(bo.amount).plus(openAmount).toFixed(4);
            return { asks: openAsks, bids: openBids };
          }
          if (bp.isGreaterThan(openPrice)) {
            openAsks.splice(i, 0, openTick);
            return { asks: openAsks, bids: openBids };
          }
        }
        openAsks.push(openTick);
      } else if (openTick.side === 'BID') {
        for (let i = 0; i < openBids.length; i++) {
          const bo = openBids[i];
          const bp = new BigNumber(bo.price);
          if (bp.isEqualTo(openPrice)) {
            bo.amount = new BigNumber(bo.amount).plus(openAmount).toFixed(4);
            return { asks: openAsks, bids: openBids };
          }
          if (bp.isLessThan(openPrice)) {
            openBids.splice(i, 0, openTick);
            return { asks: openAsks, bids: openBids };
          }
        }
        openBids.push(openTick);
      }

      return { asks: openAsks, bids: openBids };
    case 'ORDER-CANCEL':
    case 'ORDER-MATCH':
      const removeTick = msg.data;
      const removePice = new BigNumber(removeTick.price);
      const removeAmount = new BigNumber(removeTick.amount);
      const removedAsks = [...book.asks];
      const removedBids = [...book.bids];

      if (removeTick.side === 'BID') {
        const index = removedBids.findIndex((bid) =>
          new BigNumber(bid.price).isEqualTo(removePice),
        );
        if (index > -1) {
          removedBids[index].amount = new BigNumber(removedBids[index].amount)
            .minus(removeAmount)
            .toFixed(4);
          if (removedBids[index].amount === '0.0000') {
            removedBids.splice(index, 1);
          }
        }
      } else if (removeTick.side === 'ASK') {
        const index = removedAsks.findIndex((ask) =>
          new BigNumber(ask.price).isEqualTo(removePice),
        );
        if (index > -1) {
          removedAsks[index].amount = new BigNumber(removedAsks[index].amount)
            .minus(removeAmount)
            .toFixed(4);
          if (removedAsks[index].amount === '0.0000') {
            removedAsks.splice(index, 1);
          }
        }
      }
      return { asks: removedAsks, bids: removedBids };
    default:
      console.log(msg.event);
      return book;
  }
};
