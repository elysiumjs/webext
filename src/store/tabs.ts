import { appSlice } from "./index";
import { call, put } from "@redux-saga/core/effects";
import {
    createEntityAdapter,
    createSlice,
    EntityAdapter,
} from "@reduxjs/toolkit";
import { actionChannel } from "./actionChannel";
import { KeysOfUnion } from "../types";
import { Tabs } from "webextension-polyfill-ts";

const mapFFTabToInternalTab = ({ id, title, url }: Tabs.Tab) => ({
    id,
    title,
    url,
});
const pickReducers = <T>(
    adapter: EntityAdapter<T>,
    keys: Array<keyof EntityAdapter<T>>
) => {
    return Object.fromEntries(
        Object.entries(adapter).filter(([key]) => {
            if (
                key === "selectId" ||
                key === "sortComparer" ||
                key === "getSelectors"
            )
                return false;
            return keys.includes(key as keyof EntityAdapter<T>);
        })
    ) as Omit<
        EntityAdapter<T>,
        "selectId" | "sortComparer" | "getSelectors" | KeysOfUnion<typeof keys>
    >;
};

type Tab = {
    id: number;
    title: string;
    url: string;
};

const adapter = createEntityAdapter<Tab>({
    // Assume IDs are stored in a field other than `book.id`
    selectId: ({ id }) => id,
    // Keep the "all IDs" array sorted based on book titles
    sortComparer: (a, b) => a.title.localeCompare(b.title),
});

export const tabsStore = createSlice({
    name: "tabs",
    initialState: adapter.getInitialState({ selectedTab: null } as {
        selectedTab: number | null;
    }),
    reducers: pickReducers(adapter, [
        "addOne",
        "addMany",
        "updateOne",
        "removeOne",
    ]),
});

export function* tabsSaga() {
    if (!browser) return;
    const tabs = yield call(() => browser.tabs.query({}));
    const listOfTabs = tabs.map(mapFFTabToInternalTab);
    yield put(tabsStore.actions.addMany(listOfTabs));
    browser.tabs.onCreated.addListener((tab) => {
        if (tab.id !== undefined) {
            throw Error("Encountered tab without id");
        } else {
            actionChannel.put(
                tabsStore.actions.addOne(mapFFTabToInternalTab(tab))
            );
        }
    });
    browser.tabs.onUpdated.addListener((id, _, tab) => {
        actionChannel.put(
            tabsStore.actions.updateOne({
                id,
                changes: mapFFTabToInternalTab(tab),
            })
        );
    });
    browser.tabs.onRemoved.addListener((id) => {
        actionChannel.put(tabsStore.actions.removeOne(id));
    });
}
