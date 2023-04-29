import React from "react";
import { formatNumber } from "../utils";
import "./index.css";

function PriceLevelItem({ price, size, total, highlisghtStyle = {} }) {
  return (
    <div className="item-wrapper" style={highlisghtStyle}>
      <span>{formatNumber(price)}</span>
      <span>{size}</span>
      <span>{total.toFixed(5)}</span>
    </div>
  );
}

export default React.memo(PriceLevelItem);
