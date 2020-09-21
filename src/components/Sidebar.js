import React, { Component } from 'react';

import '../assets/styles/home.css';

export default class Sidebar extends Component {
	constructor(props) {
		super(props);
		this.state = {}
	}

	componentDidMount() {
	}

	render() {
		return (
			<div className="side">
				Side bar
			</div>
		);
	}
}
