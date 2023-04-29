import { useEffect, useCallback, useState } from "react";
import { Centrifuge } from "centrifuge";
import { useDispatch } from "react-redux";

const { REACT_APP_SERVER, REACT_APP_JWT } = process.env;
const TRANSPORT = [
  {
    transport: "websocket",
    endpoint: REACT_APP_SERVER,
  },
  {
    transport: "http_stream",
    endpoint: "/markets/orderbook",
  },
];
let curSequence = null;

export const useSocketData = () => {
  const [centrifuge, setCentrifuge] = useState(null);
  const [subscriber, setSubscriber] = useState(null);

  const dispatch = useDispatch();

  const ConnectHandler = () => {
    if (!centrifuge) return;

    centrifuge.on("connected", function () {
      if (!centrifuge.getSubscription()) {
        const sub = centrifuge.newSubscription("orderbook:BTC-USD");

        setSubscriber(sub);
      }
    });
    return () => {
      centrifuge.disconnect();
      dispatch.orderbook.clearOrderbookState();
    };
  };

  const SubscribeHandler = () => {
    if (!subscriber) return;

    //resolve the initial snapshot
    subscriber.on("subscribed", function (ctx) {
      const { asks, bids, sequence } = ctx.data;
      curSequence = sequence;
      dispatch.orderbook.initSnapshot({
        asks,
        bids,
      });
    });
    // update the incoming data
    subscriber.on("publication", function (ctx) {
      const { asks, bids, sequence } = ctx.data;

      if (curSequence === sequence - 1) {
        curSequence = sequence;
        asks.length > 0 && dispatch.orderbook.udpateAsks({ asks });
        bids.length > 0 && dispatch.orderbook.updateBids({ bids });
      } else {
        // Lost package, need to resubscribe
        const sub = centrifuge.newSubscription("orderbook:BTC-USD");

        setSubscriber(sub);
      }
    });

    subscriber.subscribe();

    return () => subscriber.unsubscribe();
  };

  const ErrorHandler = () => {
    if (!subscriber || centrifuge) return;

    centrifuge.on("error", function (ctx) {
      // Some error handlers
    });
    subscriber.on("error", function () {
      /**
       * The client will automatically reconnect when error caused by network disconnect
       * Here we can do some error logs reporting
       */
    });
  };

  useEffect(ConnectHandler, [centrifuge]);
  useEffect(SubscribeHandler, [subscriber]);
  useEffect(ErrorHandler, [subscriber]);

  const connectSocket = useCallback(() => {
    /**
     * Connect the socket server with `TRANSPORT` array,
     * Inside also add the `http_stream` for fallback in case the websocket server is not working
     * NOTICE: I didn't implement the logic of http fallback
     */
    const ct = new Centrifuge(TRANSPORT, {
      // TODO: it would be better to get the `JWT` from an auth api with the `getToken` parameter
      token: REACT_APP_JWT,
    });

    ct.connect();
    setCentrifuge(ct);
  }, []);

  const closeSocket = useCallback(() => {
    centrifuge && centrifuge.disconnect();
  }, [centrifuge]);

  return { connectSocket, closeSocket };
};
