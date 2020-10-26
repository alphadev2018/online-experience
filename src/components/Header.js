import React, { Component } from 'react';

import 'assets/styles/home.css';
import {ReactComponent as MainLogoIcon} from "../assets/images/main-logo.svg";

export default class Header extends Component {
	state = {
		menu: 0
	};

	constructor(props) {
		super(props);
	}

	componentDidMount() {
	}

	render() {
		const { menu } = this.state;
		return (
			<div className="header">
				<div className="logo-icon" />
				<a href="#" className="menu-toggle" onClick={()=>{
					
				}}>
					<i className="fa fa-bars" aria-hidden="true"></i>
				</a>
			</div>
		);
	}
}
