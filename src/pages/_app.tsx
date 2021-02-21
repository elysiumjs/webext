import { store } from "../store";
import { Provider } from 'react-redux';

function MyApp({ Component, pageProps }: any) {
    return (
        <Provider store={store}>
            <Component {...pageProps} />
        </Provider>
    );
}

export default MyApp;
