import React, { Component } from 'react';
import Provider from 'react-redux/es/components/Provider';
import { BrowserRouter as Router } from 'react-router-dom';

import history from './history';
import store from './store';
import Layout from './components/Layout';

import 'style.css';

export default class App extends Component {

	render() {
		return (
			<Provider store={store}>
				<Router history={history}>
					<Layout />
				</Router>
			</Provider>
		);
	}
}
