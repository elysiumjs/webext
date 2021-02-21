export type WebWorker = typeof Worker & { new (): Worker };
export type KeysOfUnion<T> = T extends any ? keyof T : never;
/// <reference types="webextension-polyfill-ts" />

declare var browser: Browser;