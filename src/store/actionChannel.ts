import { channel } from "redux-saga";
import { takeEvery, put } from "@redux-saga/core/effects";

export const actionChannel = channel();
export function* actionPortal(action: any) {
    yield put(action);
}
export function* actionSaga() {
    yield takeEvery(actionChannel, actionPortal);
}
