import { createStore } from "./store";

const ctx = self;
const store = createStore();
console.log("in worker", store);
ctx.postMessage("ayyy");

store.subscribe(() => ctx.postMessage(store.getState()));
ctx.addEventListener("message", ({ data }) => data.type && store.dispatch(data));
ctx.postMessage({ state: "ready" });


// Expose the right type when imported via worker-loader.
// export default {} as typeof Worker & {new (): Worker};

export default {};