import React, { Component } from 'react';

import 'assets/styles/home.css';

export default class Footer extends Component {
	constructor(props) {
		super(props);
		this.state = {}
	}

	componentDidMount() {
	}

	render() {
		return (
			<div className="footer d-flex">
				<a className="footer-link" href="#">
					<i class="fa fa-window-maximize"></i>
				</a>
				<a className="footer-link" href="#">
					<i class="fa fa-volume-down"></i>
				</a>
			</div>
		);
	}
}
