import React, { Component } from 'react';
// import {ReactComponent as MenuHomeIcon} from '../assets/images/menu_home.svg';
import {ReactComponent as MenuMediaIcon} from '../assets/images/menu_media.svg';
import {ReactComponent as MenuConductiveIcon} from '../assets/images/menu_conductive.svg';
import {ReactComponent as MenuGameIcon} from '../assets/images/menu_game.svg';
import {ReactComponent as MenuMapIcon} from '../assets/images/menu_map.svg';

import {ReactComponent as MenuHomeIcon0} from '../assets/images/menu_home_0.svg';
import {ReactComponent as MenuHomeIcon1} from '../assets/images/menu_home_1.svg';
import {ReactComponent as MenuHomeIcon2} from '../assets/images/menu_home_2.svg';

import {menuArr, menuHomeArr} from "./common";
import '../assets/styles/side.css';
import 'assets/styles/home.css';

export default class Sidebar extends Component {
	constructor(props) {
		super(props);
		this.state = {selMenu:"", showMobileMenu:false}
		this.device = ( /Android|webOS|iPhone|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) )?"mobile":"web";
	}

	componentDidMount() {
	}

	UNSAFE_componentWillReceiveProps(nextProps) {
		if (this.state.selMenu !== nextProps.menuItem) {
			this.setState({selMenu:nextProps.menuItem});
		}
		if (this.state.showMobileMenu !== nextProps.showMobileMenu) {
			this.setState({showMobileMenu:nextProps.showMobileMenu});
		}
	}

	clickItem=(str)=>{
		// if (str.indexOf("home") > -1) str = "home";
		if (this.device === "web" && this.state.selMenu === str) return;
		this.setState({selMenu:str});
		setTimeout(() => {
			this.props.callMenuItem(str);
			if (this.device === "mobile") this.props.callMobileMenu();
		}, 0);
	}

	render() {
		var menuActive = false;
		if (this.device === "web") {
			if (this.state.selMenu !== "" && this.state.selMenu !== "first") menuActive = true;
		}
		else {
			if (this.state.showMobileMenu === true) menuActive = true;
		}
		return (
			<div className={`side ${(menuActive === true)?"active":""} ${this.device}`}>
				<div style={{ transform: "translateY(-50%)", top: "50%", position: "absolute"}}>
					<div className="side-bar side-bar-top">
						{menuHomeArr.map(menuItem =>
							<div className={`side-item ${(this.state.selMenu === menuItem.value)?"active":""}`} onClick={()=>this.clickItem(menuItem.value)} key={menuItem.value} data-detail={menuItem.label}>
								{menuItem.value === "home0" && <MenuHomeIcon0 className="home0"></MenuHomeIcon0>}
								{menuItem.value === "home1" && <MenuHomeIcon1 className="home1"></MenuHomeIcon1>}
								{menuItem.value === "home2" && <MenuHomeIcon2 className="home2"></MenuHomeIcon2>}
								{this.device === "mobile" && <div className="menu-label">{menuItem.label}</div> }
							</div>
						)}
					</div>
					<div className="side-bar side-bar-bottom">
						{menuArr.map(menuItem =>
							<div className={`side-item ${(this.state.selMenu === menuItem.value)?"active":""}`} onClick={()=>this.clickItem(menuItem.value)} key={menuItem.value} data-detail={menuItem.label}>
								{menuItem.value === "media" && <MenuMediaIcon></MenuMediaIcon>}
								{menuItem.value === "game" && <MenuGameIcon></MenuGameIcon>}
								{menuItem.value === "map" && <MenuMapIcon></MenuMapIcon>}
								{menuItem.value === "conductive" && <MenuConductiveIcon></MenuConductiveIcon>}
								{this.device === "mobile" && <div className="menu-label">{menuItem.label}</div> }
							</div>
						)}
					</div>
				</div>
			</div>
		);
	}
}
