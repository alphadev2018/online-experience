import React, { Component } from 'react';

import './App.css';

import Home   from './components/Home';
import Header   from './components/Header';
import Footer   from './components/Footer';
import Sidebar   from './components/Sidebar';


export default class App extends Component {
	constructor(props) {
		super(props);
	}

	componentDidMount() {
	}

	render() {
		return (
			<div>
				<Home
				></Home>
				<Header></Header>
				<Footer></Footer>
				<Sidebar></Sidebar>
			</div>
		);
	}
}
