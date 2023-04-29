import { init } from "@rematch/core";
import * as models from "./orderbook";

const store = init({ models });

export default store;
