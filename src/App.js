import React from "react";
import Orderbook from "./orderbook";
import { Provider, connect } from "react-redux";
import store from "./model/store";

import "./App.css";

require("dotenv").config();

function App() {
  const mapState = (state) => ({
    orderbook: state.orderbook,
  });
  const mapDispatch = (dispatch) => ({});
  const OrderbookContainer = connect(mapState, mapDispatch)(Orderbook);

  return (
    <div className="App">
      <header className="App-header">
        <strong>Orderbook</strong>

        <Provider store={store}>
          <OrderbookContainer />
        </Provider>
      </header>
    </div>
  );
}

export default App;
