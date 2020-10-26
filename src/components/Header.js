import React, { Component } from 'react';

import 'assets/styles/home.css';
import {ReactComponent as MainLogoIcon} from "../assets/images/main-logo.svg";

export default class Header extends Component {
	state = {
		menu: 0
	};

	constructor(props) {
		super(props);
		this.state={menuItem:"first"};
	}

	componentDidMount() {
	}

	UNSAFE_componentWillReceiveProps(nextProps) {
		console.log(nextProps);
		if (this.state.menuItem !== nextProps.menuItem) {
			console.log(nextProps.menuItem);
			this.setState({menuItem:nextProps.menuItem});
		}
	}

	render() {
		const { menuItem } = this.state;
		return (
			<div className="header">
				<div className="logo-icon" />
				{menuItem && menuItem !== "first" &&
					<a href="#" className="menu-toggle" onClick={()=>{
						this.props.callMobileMenu();
					}}>
						<i className="fa fa-bars" aria-hidden="true"></i>
					</a>
				}
			</div>
		);
	}
}
