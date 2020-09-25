import React, { Component } from 'react';

import '../assets/styles/overPan.css';
import {easeTime} from "./common";
import gameImgEasy from "../assets/images/game_easy.png";
import gameImgMedium from "../assets/images/game_medium.png";
import gameImgDifficult from "../assets/images/game_difficult.png";

export default class OverPan extends Component {
	constructor(props) {
		super(props);
		this.state = {itemArr:[], hide:"hide", menuItem:props.menuItem, overPanClass:""}
	}

	componentDidMount() {
		var itemArr = [];
		if (this.props.menuItem === "first") itemArr = [{type:"button", label:"Enter Experience", value:"first", hide:true}];
		else if (this.props.menuItem === "game")
			itemArr = [
				{type:"button", label:"Play", value:"play"},
				{type:"button", label:"Leader Boards", value:"leader"},
				{type:"button", label:"Rules", value:"rules", hide:false}
			];
		setTimeout(() => { this.setState({hide:"", itemArr:itemArr}); },easeTime);
	}
	componentWillUnmount() {

	}
	
	componentWillReceiveProps(nextProps) {
		if (this.state.menuItem !== nextProps.menuItem) {
			this.setState({menuItem:nextProps.menuItem});
		}
		if (this.state.sideItem !== nextProps.sideItem) {
			this.setState({sideItem:nextProps.sideItem});
		}
	}

	clickButton = (str, hide) => {
		if (hide) {
			this.setState({hide:"hide"});
			setTimeout(() => { this.props.callClickButton(str); }, 500);
		}
		if (this.props.menuItem === "game") {
			if (str === "play") {
				const itemArr = [
					{type:"img-button", imgSrc:gameImgEasy, label:"Easy", classStr:"easy", value:"gameEasy", hide:true},
					{type:"img-button", imgSrc:gameImgMedium, label:"Medium", classStr:"medium", value:"gameMedium", hide:true},
					{type:"img-button", imgSrc:gameImgDifficult, label:"Difficult", classStr:"difficult", value:"gameDifficult", hide:true},
				];
				this.setState({itemArr:itemArr, overPanClass:"game-level"});
			}
			else if (str === "leader") {
				console.log("leader");
			}
			else if (str === "rules") {
				const itemArr = [
					{type:"text", label:"After choosing the difficulty level, the player is shown the completed model for a short time period. \n The aim is to build this model from individual pieces in the time frame. Penalites are added for wrong placements etc.", classStr:""},
					{type:"button", label:"Play", value:"play"}
				];
				this.setState({itemArr:itemArr});
			}
			// else if (str.indexOf("game") > -1) {
			// 	this.setState({overPanClass:"", itemArr:[]});
			// 	this.setStartTime();
			// }
		}
	}


	render() {
		const itemLength = this.state.itemArr.length;
		return (
			<div className={`over-pan ${this.state.hide}`}>
				{itemLength &&
					<div className={`over-wrapper button_${itemLength} ${this.state.overPanClass}`}>
						{this.state.itemArr.map((item, idx) =>
							<div className="over-item" key={idx}>
								{item.type === "text" &&
									<div className={"text "+item.classStr}> {item.label} </div>
								}
								{item.type === "button" &&
									<div className="button" onClick={()=>this.clickButton(item.value, item.hide)}>
										{item.label}
									</div>
								}
								{item.type === "img-button" &&
									<div className={"img-button "+item.classStr}>
										<div className="img">
											<img src={item.imgSrc}></img>
										</div>
										<div className="button" onClick={()=>this.clickButton(item.value, item.hide)}>
											{item.label}
										</div>
									</div>
								}
							</div>
						)}
					</div>
				}
			</div>
		);
	}
}
