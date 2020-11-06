import React from "react";
import ReactDOM from "react-dom";
import Provider from 'react-redux/es/components/Provider';

import App from "./App";
import store from 'store';

import {register} from './serviceWorker';

setTimeout(function() {
    ReactDOM.render(
        <Provider store={store}>
            <App />
        </Provider>, 
        document.getElementById('root')
    );

    register();
}, 1000);