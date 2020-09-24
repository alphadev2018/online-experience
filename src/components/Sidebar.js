import React, { Component } from 'react';
import {ReactComponent as MenuHomeIcon} from '../assets/images/menu_home.svg';
import {ReactComponent as MenuMediaIcon} from '../assets/images/menu_media.svg';
import {ReactComponent as MenuConductiveIcon} from '../assets/images/menu_conductive.svg';
import {ReactComponent as MenuGameIcon} from '../assets/images/menu_game.svg';
import {ReactComponent as MenuMapIcon} from '../assets/images/menu_map.svg';

import {menuArr} from "./common";
import '../assets/styles/side.css';
import 'assets/styles/home.css';

export default class Sidebar extends Component {
	constructor(props) {
		super(props);
		this.state = {selMenu:""}
	}

	componentDidMount() {
	}

	UNSAFE_componentWillReceiveProps(nextProps) {
		if (this.state.selMenu !== nextProps.menuItem) {
			this.setState({selMenu:nextProps.menuItem});
		}
	}

	clickItem=(str)=>{
		if (this.state.selMenu === str) return;
		this.setState({selMenu:str});
		setTimeout(() => {
			this.props.callMenuItem(str);
		}, 0);
	}

	render() {
		return (
			<div className={`side ${(this.state.selMenu)?"active":""}`}>
				{menuArr.map(menuItem =>
					<div className={`side-item ${(this.state.selMenu === menuItem.value)?"active":""}`} onClick={()=>this.clickItem(menuItem.value)} key={menuItem.value}>
						{menuItem.value === "home" && <MenuHomeIcon></MenuHomeIcon>}
						{menuItem.value === "media" && <MenuMediaIcon></MenuMediaIcon>}
						{menuItem.value === "conductive" && <MenuConductiveIcon></MenuConductiveIcon>}
						{menuItem.value === "game" && <MenuGameIcon></MenuGameIcon>}
						{menuItem.value === "map" && <MenuMapIcon></MenuMapIcon>}
						{menuItem.value === "other" && <MenuHomeIcon></MenuHomeIcon>}
					</div>
				)}
			</div>
		);
	}
}
