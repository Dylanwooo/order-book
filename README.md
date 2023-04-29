### Getting start

1. yarn / npm install
2. yarn start
3. yarn test for testing

### Implementations of the orderbook

1. Order book UI
2. Establish socket connection and get bids and asks data
3. Merge the push data to show on the orderbook list
4. Edge cases handle: automatic reconnect/resubscription, fallbacks with api, error handlers
5. Memory performance review
6. Some e2e test cases with cypress.

### Approches for implementation

- **Rematch** for Redux management, which handled all the data update logic. See `/model` for more details
- `/hooks` for managing event handlers
- `/orderbook` for UI rendering
- **centrifugal.js** for websocket management
- The `jwt_token` was generated from `onboarding.py`, and in this project I stored it in the `.env` file. However, it's a better option to get `jwt_token` from an endpoint.
- `cypress` for some e2e tests. They may not be so thourough

### Challenges

- I spent quite some time for python environment setting... But finally run `onboarding.py` successfully on venv with the `poetry`
- It took some time on the socket data update logic. It was hard to debug at the beginning and couldn't calculate the `level Total` correctly

### Areas for imporvements

- The `Total` field of the bids data may update incorrectly.
- Implemetation of the fallbacks when socket is down, like `http_stream`, `socketJS` and `sse`
- Add the market `depth` for orderbook
- Use `styled-system` for responsive web
- Error reports to some platform like `Sentry.io` for errors tracking
