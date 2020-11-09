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
		if (this.state.menuItem !== nextProps.menuItem) {
			this.setState({menuItem:nextProps.menuItem});
		}
	}
	
	mute = () => {
		let element = document.getElementById('background_music');
		if (element.volume === 0.1) {
			element.volume = 0;
		} else {
			element.volume = 0.1;
		}
	}
	fullScreen = () => {
		window.toggleFullScreen();
	}

	isIOS = () => {
		return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || /iPad|iPhone|iPod/.test(navigator.platform) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
	}

	render() {
		const { menuItem } = this.state;
		return (
			<div className="header">
				<div className="logo-icon" />
				{menuItem && menuItem !== "first" &&
					<>
						<a href="#" className="menu-toggle" onClick={()=>{
							this.props.callMobileMenu();
						}}>
							<i className="fa fa-bars" aria-hidden="true"></i>
						</a>

						
						<div className="footer-menu" style={{display: this.isIOS() ? 'none':'flex'}}>
							<a href="#" onClick={this.fullScreen} >
								<i className="fa fa-window-maximize" aria-hidden="true"></i>
							</a>
							<a href="#" onClick={this.mute}>
								<i className="fa fa-volume-off" aria-hidden="true"></i>
							</a>
						</div>
					</>
				}
			</div>
		);
	}
}
