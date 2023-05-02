import React, { useEffect } from "react";
import PriceLevelItem from "./PriceLevelItem";
import { useSocketData } from "../hooks";
import { useSelector } from "react-redux";
import { orderbookSelector } from "../model/selector";
import "./index.css";

const OrderType = {
  BIDS: "bids",
  ASKS: "asks",
};
const ORDERBOO_SIZE = 12;

function Orderbook() {
  const { connectSocket, closeSocket } = useSocketData();
  const { bids, asks } = useSelector(orderbookSelector);

  useEffect(() => {
    connectSocket();
  }, [connectSocket]);

  const renderPriceLevels = (levels, orderType) => {
    const highlightColor =
      orderType === OrderType.BIDS ? "#00800030" : "#ff09092b";

    const sortedLevels = [...levels].sort((currentLevel, nextLevel) => {
      if (orderType === OrderType.BIDS) {
        return nextLevel[0] - currentLevel[0];
      } else return currentLevel[0] - nextLevel[0];
    });

    return sortedLevels.slice(0, ORDERBOO_SIZE).map((level, idx) => {
      return (
        <PriceLevelItem
          highlisghtStyle={idx === 0 ? { backgroundColor: highlightColor } : {}}
          key={idx + level[0]}
          price={level[0]}
          size={level[1]}
          total={level[2]}
        />
      );
    });
  };

  return (
    <>
      <div className="container">
        <div className="head">
          <strong>{`Price(USD)`}</strong>
          <strong>{`Amount(BTC)`}</strong>
          <strong>{`Total`}</strong>
        </div>
        <div className="data-wrapper">
          <div className="ask-wrapper">
            {renderPriceLevels(asks, OrderType.ASKS)}
          </div>
          <div className="bid-wrapper">
            {renderPriceLevels(bids, OrderType.BIDS)}
          </div>
        </div>
      </div>
      <div>
        <button onClick={connectSocket}>connect</button>
        <button onClick={closeSocket}>disconnect</button>
      </div>
    </>
  );
}

export default React.memo(Orderbook);
