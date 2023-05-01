## Hello! Thanks for your time on this `Simple orderbook` project

### **Getting start**

1. yarn / npm install
2. yarn start
3. yarn test for testing

### **Key points**

1. React.js for Orderbook UI
2. Establish socket connection and get bids and asks data.
3. Merge the push data to the orderbook
4. Edge cases handle: automatic reconnect/resubscription, fallbacks with api, error handlers.
5. Memory performance review
6. Some e2e test cases with cypress.

### **Structure**

1. **Rematch** for Redux management, which handled all the data update logic.

The orderbook model should look like this:

```javascript
export const orderbook = {
  state: INIT_STATE, // initial state of the orderbook
  reducers: {}, // reducers
  effects: (dispatch) => ({
    // effects handlers
    initSnapshot() {},
    udpateAsks() {}
    updateBids() {}
  }),
};
```

Use the `Provider` to wrap our `Orderbook` component and pass the `store` prop.

```javascript
<Provider store={store}>
  <OrderbookContainer />
</Provider>
```

When we use the event handler to manage the data, we dispatch the data

```javascript
subscriber.on("subscribed", function () {
  const { asks, bids } = ctx.data;
  dispatch.orderbook.initSnapshot({
    asks,
    bids,
  });
});
```

### The benefit of using `Rematch` is to avoid writing boilerplate code when using the `Redux`

2. `/hooks` for managing event handlers

```javascript
export const useSocketData = () => {
  /**
   * Event handlers
   * 1. ws connect handler
   * 2. data subscribe handler
   * 3. error handler
   */
};
```

3. `/orderbook` for UI rendering

4. **centrifugal.js** for websocket management

5. Generating the `jwt_token`:

```python
from websocket import WebSocketApp
from rabbitx import const
from rabbitx.client import Client, WSClient, WSClientCallback

if __name__ == '__main__':
    private_key = 'PRIVATE_KEY'
 # change this to your private key
    testnet=True # change this to False if using on mainnet
    if testnet:
        client = Client(api_url=const.TESTNET_URL, private_key=private_key)
    else:
        client = Client(api_url=const.URL, private_key=private_key)
    x=client.onboarding.onboarding()

    print(x)
```

In this project, I put the generated token in the `.env` file. However, it's a better option to get `jwt_token` from an endpoint.

6.  `cypress` for some e2e tests. They may not be so thourough

### **Challenges**

- I spent quite some time for python environment setting... But finally run `onboarding.py` successfully on venv with `poetry`
- It took some time on the socket data update logic. It was hard to debug at the beginning and couldn't calculate the `level Total` correctly

### **Areas for imporvements**

- Add the fallbacks if websocket is down, such as `http_stream`, `socketJS` and `sse`
- Add the market `depth`, making the Orderbook more complete.
- The calculation inside the `orderbook` model effects would be overloaded when the push data comes frequently. It's probably a performance issue. `Web worker` could be a good solution to handle the complex calculation in the background thread and send back the result to main thread.
- Use `styled-system` for responsive components
- Error reports to some platform like `Sentry.io` for errors tracking
- Should refactor the code into Typescript
