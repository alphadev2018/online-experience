import React, { Component } from 'react';

import 'assets/styles/home.css';
import {ReactComponent as MainLogoIcon} from "../assets/images/main-logo.svg";

export default class Header extends Component {
	constructor(props) {
		super(props);
		this.state = {}
	}

	componentDidMount() {
	}

	render() {
		return (
			<div className="header">
				<div className="logo-icon" />
				<a href="#" className="menu-toggle">
					<i className="fa fa-bars" aria-hidden="true"></i>
				</a>
			</div>
		);
	}
}
