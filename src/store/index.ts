import {
    combineReducers,
    configureStore,
    createAction,
    createSlice,
    PayloadAction,
} from "@reduxjs/toolkit";
import createSagaMiddleware from "redux-saga";
import { all, spawn, call, delay } from "@redux-saga/core/effects";
import { BackoffTimeouts } from "../const";
import { tabsSaga, tabsStore } from "./tabs";
import { actionSaga } from "./actionChannel";

type TAppState = {
  foo: string;
};

const initialState: TAppState = {
  foo: ''
};

export const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setFoo(state, { payload: foo}: PayloadAction<string>) {
      state.foo = foo;
    }
  }
});
export const rootReducer = combineReducers({
  app: appSlice.reducer,
  tabs: tabsStore.reducer,
 });
export type IRootState = ReturnType<typeof rootReducer>;

export function* rootSaga() {
  const sagas = [tabsSaga, actionSaga];

  yield all(
    sagas.map((saga) =>
      spawn(function* () {
        let count = 0;
        while (true && count < BackoffTimeouts.length) {
          try {
            yield call(saga);
            break;
          } catch (e) {
            console.error(e);
            count += 1;
            yield delay(BackoffTimeouts[count] * 1000);
          }
        }
      })
    )
  );
}
export const createStore = () => {
  const saga = createSagaMiddleware();
  const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({ thunk: false }).concat(saga),
  });
  saga.run(rootSaga);
  return store;
};

export const store = createStore();

export const initApp = createAction("app/init");
