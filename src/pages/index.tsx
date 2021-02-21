import Head from "next/head";
import { Global, css } from "@emotion/react";
import styled from "@emotion/styled";
import { Tabs } from "webextension-polyfill-ts";
import { useEffect, useState } from "react";
import { normalize } from "polished";
import { useSelector } from "../hooks/useSelector";

const Container = styled.div`
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    background: rgba(42, 42, 46, 1);
    padding: 8px 12px;
    & > * + * {
        margin-block-end: 8px;
    } 
`;

const globalStyle = css`
    ${normalize()}
`;

const Tab = styled.button`
    background-color: pink;
    color: white;
    border: 0;
`;

export default function Home() {
    const tabs = useSelector(({ tabs }) => (tabs.ids.map(id => tabs.entities[id])));

    useEffect(() => {
        // const worker = new Worker(new URL("../worker.ts", import.meta.url));
        // worker.addEventListener("message", ({ data }) => );
        // const worker = new (HelloWorker as WebWorker)();
        // worker.addEventListener("message", ({ data }) => {
        //     console.log("main ctx message", data);
        //     setContent(JSON.stringify(data));
        // });
        // worker.addEventListener("error", (evt) => {
        //     throw evt;
        //     setError(true);
        // });
        // setWorker(worker);
        // browser.theme.update(undefined, {
        //     colors: {
        //         "reload-button": "white",
        //     } as any,
        // });
        // const tabs = browser.tabs.query({});
        // debugger;
        // setContent(JSON.stringify(tabs));
    }, []);

    return (
        <>
            <Head>
                <title>Elysium</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Container>
                {tabs.map((tab) => (
                    <Tab>{tab.title}</Tab>
                ))}
                <button
                    onClick={() =>
                        browser.tabs
                            .query({})
                            .then((tabs) =>
                                navigator.clipboard.writeText(
                                    JSON.stringify(tabs, null, 2)
                                )
                            )
                    }
                >
                    Click me
                </button>
            </Container>
            <Global styles={globalStyle} />
        </>
    );
}
