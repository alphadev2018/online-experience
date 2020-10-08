import React, { Component } from 'react';

import '../assets/styles/overPan.css';
import {easeTime} from "./common";
import {ReactComponent as GamePlayIcon} from "../assets/images/game_modal_play.svg";
import {ReactComponent as GameLeaderIcon} from "../assets/images/game_modal_leader.svg";
import {ReactComponent as GameRuleIcon} from "../assets/images/game_modal_rule.svg";
import {ReactComponent as BtnPreIcon} from "../assets/images/btn_pre.svg";
import {ReactComponent as BtnNextIcon} from "../assets/images/btn_next.svg";
import gameImgEasy from "../assets/images/game_easy.png";
import gameImgMedium from "../assets/images/game_medium.png";
import gameImgDifficult from "../assets/images/game_difficult.png";

export default class OverPan extends Component {
	constructor(props) {
		super(props);
		this.gameMenuArr = [
			{type:"button", label:"Play", value:"play"},
			{type:"button", label:"Leader Boards", value:"play"},
			{type:"button", label:"Rules", value:"rule", hide:false}
		];
		this.gameLevelArr = [
			{type:"img-button", imgSrc:gameImgEasy, label:"Easy", classStr:"easy", value:"gameEasy", hide:true},
			{type:"img-button", imgSrc:gameImgMedium, label:"Medium", classStr:"medium", value:"gameMedium", hide:true},
			{type:"img-button", imgSrc:gameImgDifficult, label:"Difficult", classStr:"difficult", value:"gameDifficult", hide:true}
		];
		this.gameRuleArr = [
			"1. this is first game rule. first game rule is simple and not difficult",
			"2. this is second game rule. second game rule is a little difficult",
			"3. this is third game rule. third game rule is very difficult and complex",
		]
		this.state = {itemArr:[], hide:"hide", menuItem:props.menuItem, overPanClass:"", gameRuleNum:0};
	}

	componentDidMount() {
	}
	componentWillUnmount() {

	}
	
	componentWillReceiveProps(nextProps) {
	}

	clickButton = (str, hide) => {
		if (hide) {
			this.setState({hide:"hide"});
			setTimeout(() => { this.props.callClickButton(str); }, 500);
		}
		this.setState({menuItem:str});
		if (str === "rule") this.setState({gameRuleNum:0});
	}

	setRuleStepNum=(delta)=>{
		if (this.state.gameRuleNum <= 0 && delta < 0) return;
		if (this.state.gameRuleNum >= this.gameRuleArr.length-1 && delta > 0) return;
		const gameRuleNum = this.state.gameRuleNum + delta;
		this.setState({gameRuleNum:gameRuleNum});
	}

	render() {
		const {menuItem, gameRuleNum} = this.state;
		const itemLength = this.state.itemArr.length;
		return (
			<div className={`over-pan ${this.state.hide}`}>
				{menuItem === "first" &&
					<div className={"first-button"} onClick={()=>this.clickButton("first", true)}>
						<div className="label">Enter</div>
					</div>
				}
				{menuItem === "game" &&
					<div className="modal-wrapper game-menu">
						<div className="title">Play - Built to Successeed</div>
						{this.gameMenuArr.map((item, idx) =>
							<div className="game-menu-item" key={idx} onClick={()=>this.clickButton(item.value, false)}>
								{item.value === "play" && <GamePlayIcon></GamePlayIcon>}
								{item.value === "leader" && <GameLeaderIcon></GameLeaderIcon>}
								{item.value === "rule" && <GameRuleIcon></GameRuleIcon>}
								<div className="text"> {item.label} </div>
							</div>
						)}
					</div>
				}
				{menuItem === "play" &&
					<div className="modal-wrapper game-level">
						<div className="title">Choose Difficulty</div>
						{this.gameLevelArr.map((item, idx) =>
							<div className="game-level-item" key={idx} onClick={()=>this.clickButton(item.value, true)}>
								<div className="img">
									<img src={item.imgSrc}></img>
								</div>
								<div className="label">
									{item.label}
								</div>
							</div>
						)}
					</div>
				}
				{menuItem === "rule" &&
					<div className="modal-wrapper game-rule">
						<div className="title">Game Rules</div>
						{this.gameRuleArr.map((item, idx) =>
							<div className={`game-rule-item ${gameRuleNum===idx?"show":""}`} key={idx}>
								<div className={"text"}> {item} </div>
							</div>
						)}
						<div className="rule-step">
							<BtnPreIcon className="btn-rule btn-rule-pre" onClick={()=>this.setRuleStepNum(-1)}></BtnPreIcon>
							<BtnNextIcon className="btn-rule btn-rule-next" onClick={()=>this.setRuleStepNum(1)}></BtnNextIcon>
						</div>
						<div className="game-menu-item" onClick={()=>this.clickButton("play", false)}>
							<div className="text">Play</div>
						</div>
					</div>
				}
			</div>
		);
	}
}
