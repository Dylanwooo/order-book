import { groupByPrice } from "../utils";
const INIT_STATE = { bids: [], asks: [], snapshotAsks: [], snapshotBids: [] };
const ORDERBOO_SIZE = 12;
/**
 * Caculate the `Total` field, which is the summed amount of each order's size
 * The bids list display in a reversed order
 * @param {*} orders
 * @returns
 */
const applySumTotal = (levels, idBid) => {
  if (!levels) return;

  const totalSums = [];
  const traverseLevels = idBid ? [...levels].reverse() : [...levels];

  const updatedLevels = traverseLevels.map((level, idx) => {
    const size = Number(level[1]);
    if (typeof level[2] !== "undefined") {
      totalSums.push(Number(level[2]));
      return level;
    } else {
      const newLevel = [...level];
      const totalSum = idx === 0 ? size : size + totalSums[idx - 1];
      newLevel[2] = totalSum;
      totalSums.push(totalSum);

      return newLevel;
    }
  });

  return updatedLevels;
};

/**
 *
 * @param {*} updatedLevel
 * @param {*} levels
 * @returns
 */
const updatePriceLevel = (updatedLevel, levels) => {
  return levels.map((level) => {
    if (level[0] === updatedLevel[0]) {
      level = updatedLevel;
    }
    return level;
  });
};
/**
 *
 * @param {*} orderPrice current icoming order price
 * @param {*} currentLevels
 * @returns
 */
const isLevelExist = (orderPrice, currentLevels) =>
  currentLevels.some((level) => level[0] === orderPrice);

/**
 *
 * @param {*} order
 * @param {*} levels
 * @param {*} idBid
 * @returns
 */
const addPriceLevel = (order, levels, idBid) => {
  return [...levels, order].sort((cur, next) =>
    idBid ? next[0] - cur[0] : cur[0] - next[0]
  );
};
/**
 * @param {*} currentLevels current bids/asks levels
 * @param {*} orders incoming orders
 * @returns
 */
const mergeOrdersToLevels = (currentLevels, orders, idBid = false) => {
  let updatedLevels = currentLevels;

  orders.forEach((order) => {
    const orderPrice = order[0];
    const orderSize = order[1];

    // If the incoming order size is 0 - delete the price level
    if (Number(orderSize) === 0 && updatedLevels.length > ORDERBOO_SIZE) {
      updatedLevels = updatedLevels.filter((level) => level[0] !== orderPrice);
    } else {
      // If the price level exists, update it with the incoming one
      if (isLevelExist(orderPrice, currentLevels)) {
        updatedLevels = updatePriceLevel(order, updatedLevels);
      } else {
        updatedLevels = addPriceLevel(order, updatedLevels, idBid);
      }
    }
  });

  return updatedLevels;
};
// orderbook model for data logic handling
export const orderbook = {
  state: INIT_STATE,
  reducers: {
    updateState(preState, payload) {
      return { ...preState, ...payload };
    },
  },
  effects: (dispatch) => ({
    initSnapshot(payload) {
      const bids = applySumTotal(groupByPrice(payload.bids), true);
      const asks = applySumTotal(groupByPrice(payload.asks));

      dispatch.orderbook.updateState({
        snapshotAsks: groupByPrice(payload.asks),
        snapshotBids: groupByPrice(payload.bids),
        bids,
        asks,
      });
    },
    udpateAsks(payload, { orderbook }) {
      const asks = applySumTotal(
        mergeOrdersToLevels(
          groupByPrice(orderbook.snapshotAsks),
          groupByPrice(payload.asks)
        )
      );

      dispatch.orderbook.updateState({
        asks,
      });
    },
    updateBids(payload, { orderbook }) {
      const bids = applySumTotal(
        mergeOrdersToLevels(
          groupByPrice(orderbook.snapshotBids),
          groupByPrice(payload.bids),
          true
        ),
        true
      );

      dispatch.orderbook.updateState({
        bids,
      });
    },
    clearOrderbookState() {
      dispatch.orderbook.updateState(INIT_STATE);
    },
  }),
};
