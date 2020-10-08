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
				<MainLogoIcon className="logo-icon"></MainLogoIcon>
			</div>
		);
	}
}
