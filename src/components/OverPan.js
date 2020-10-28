import React, { Component } from 'react';

import '../assets/styles/overPan.css';
import {ReactComponent as GamePlayIcon} from "../assets/images/game_modal_play.svg";
import {ReactComponent as GameLeaderIcon} from "../assets/images/game_modal_leader.svg";
import {ReactComponent as GameRuleIcon} from "../assets/images/game_modal_rule.svg";
import {ReactComponent as BtnPreIcon} from "../assets/images/btn_pre.svg";
import {ReactComponent as BtnNextIcon} from "../assets/images/btn_next.svg";
import {ReactComponent as BtnPlayIcon} from "../assets/images/btn_play.svg";
import {ReactComponent as BtnRuleIcon} from "../assets/images/btn_rules.svg";
import {ReactComponent as BtnLeaderboardIcon} from "../assets/images/btn_leaderboard.svg";
import gameImgEasy from "../assets/images/game_easy.png";
import gameImgMedium from "../assets/images/game_medium.png";
import gameImgDifficult from "../assets/images/game_difficult.png";
import closeImg from "../assets/images/close.png";
import resultAssembleImg from "../assets/images/result_assemble.png";
import resultBimImg from "../assets/images/result_bim.png";
import resultBuildingImg from "../assets/images/result_building.png";
import resultPlangridImg from "../assets/images/result_plangrid.png";

import {hotModalInfo, GotoIsland} from "./common";
import {products} from "@db/database";

export default class OverPan extends Component {
	constructor(props) {
		super(props);
		this.gameMenuArr = [
			{type:"button", label:"Play", value:"play"},
			{type:"button", label:"Leaderboard", value:"leader"},
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
		];
		this.leaderColumns = [{ Header: 'Position', accessor: 'no'},
							{ Header: 'Time taken', accessor: 'name' },
							{ Header: 'Score', accessor: 'score' }] ;
		this.leaderBoardArr = [];
		for (let i = 0; i < 7; i++) {
			this.leaderBoardArr[i] = {no:i+1, name:"Person_"+i, score:Math.round(Math.random() * 300)};
		}
		this.state = {itemArr:[], hide:"hide", modalInfo:props.modalInfo, overPanClass:"", gameRuleNum:0,gameLevelNum:0, loadPro:0};
	}

	componentDidMount() {
	}
	componentWillUnmount() {

	}
	
	componentWillReceiveProps(nextProps) {
		if (this.state.loadPro !== nextProps.loadPro) {
			this.setState({loadPro:nextProps.loadPro});
		}
	}

	clickButton = (str, hide) => {
		if (hide) {
			this.setState({hide:"hide"});
			setTimeout(() => { this.props.callClickButton(str); }, 500);
		}
		if (str === "first") {
			document.getElementById('background_music').volume = 0.1;
			document.getElementById('background_music').play();
		}
		this.setState({modalInfo:str});
		if (str === "rule") this.setState({gameRuleNum:0});
	}

	setRuleStepNum=(delta)=>{
		if (this.state.gameRuleNum <= 0 && delta < 0) return;
		if (this.state.gameRuleNum >= this.gameRuleArr.length-1 && delta > 0) return;
		const gameRuleNum = this.state.gameRuleNum + delta;
		this.setState({gameRuleNum:gameRuleNum});
	}

	setLevelStepNum=(delta)=>{
		if (this.state.gameLevelNum <= 0 && delta < 0) return;
		if (this.state.gameLevelNum >= 2 && delta > 0) return;
		const gameLevelNum = this.state.gameLevelNum + delta;
		this.setState({gameLevelNum:gameLevelNum});
	}

	linkProduct = (details) => {
		let product = products[2];

		if (details.transError) {
			if (details.transError.quality >= 2) {
				product = products[0];
			}

			if (details.transError.clash >= 2) {
				product = products[3];
			}
		}
		this.props.modalDetailInfo = product;
		this.setState({ modalInfo: false });
		setTimeout(() => { 
			this.props.callLinkProduct(product);
		}, 100);
		setTimeout(() => {
			this.setState({ modalInfo: "product" });
		}, 1000);
	}

	render() {
		const {modalInfo, gameRuleNum, gameLevelNum, loadPro} = this.state;
		var totalTime, gameTime, level, gamePro, hotStr="", transError, resultImg;
		// const loadingClassStr = (loadPro < 100)?"back-loading":"back-enter";
		if (this.props && this.props.modalDetailInfo) {
			const detailInfo = this.props.modalDetailInfo;
			totalTime = detailInfo.totalTime;
			gameTime = detailInfo.gameTime;
			level = detailInfo.level;
			gamePro = detailInfo.gamePro;
			transError = detailInfo.transError;
			resultImg = resultPlangridImg;
			if (transError) {
				if (transError.quality >= 2) resultImg = resultAssembleImg;
				if (transError.clash >= 2) resultImg = resultBimImg; 
			}
			hotStr = detailInfo;
		}
		return (
			<div className={`over-pan ${this.state.hide}`}>
				{modalInfo === "first" &&
					<div className={"first-button"}>
						{loadPro >= 100 &&
							<div onClick={()=>this.clickButton("first", true)}>
								<div className="back-yellow"></div>
								<div className="label enter-label">Enter</div>
							</div>
						}
						{loadPro < 100 &&
							<div>
								<div className="back-loading" style={{top:(100-loadPro)+"%"}}></div>
								<div className="label loading-label">Loading</div>
								<div className="label pro-label">{loadPro} %</div>
							</div>
						}
					</div>
				}
				{modalInfo === "game" &&
					<div className="modal-wrapper game-menu">
						<div className="title">Construction Clouds</div>
						{this.gameMenuArr.map((item, idx) =>
							<div className="game-menu-item" key={idx} onClick={()=>this.clickButton(item.value, false)}>
								<div className="game-menu-icon">
									{item.value === "play" && <BtnPlayIcon></BtnPlayIcon>}
									{item.value === "leader" && <BtnLeaderboardIcon></BtnLeaderboardIcon>}
									{item.value === "rule" && <BtnRuleIcon></BtnRuleIcon>}
								</div>
								<div className="text"> {item.label} </div>
							</div>
						)}
					</div>
				}
				{modalInfo === "play" &&
					<div className="modal-wrapper game-level">
						<div className="title game-level-title">Choose Difficulty</div>
						<div className="body">
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
						<div className="body-mobile">
							<div style={{margin: 'auto'}}>
								{this.gameLevelArr.map((item, idx) => {
									if (gameLevelNum !== idx)
										return;
									return <div className="game-level-item" key={idx} onClick={()=>this.clickButton(item.value, true)}>
										<div className="img">
											<img src={item.imgSrc}></img>
										</div>
										<div className="label">
											{item.label}
										</div>
									</div>
								})}
							</div>
							<div className="rule-step">
								<BtnPreIcon className="btn-rule btn-rule-pre" onClick={()=>this.setLevelStepNum(-1)}></BtnPreIcon>
								<BtnNextIcon className="btn-rule btn-rule-next" onClick={()=>this.setLevelStepNum(1)}></BtnNextIcon>
								<div className="dot-wrapper">
									{[0,1,2].map((idx) =>
										<div className={`game-rule-dot ${gameLevelNum===idx?"active":""}`} key={idx}></div>
									)}
								</div>
							</div>
						</div>
					</div>
				}
				{modalInfo === "rule" &&
					<div className="modal-wrapper game-rule">
						<div className="title">Game Rules</div>
						{this.gameRuleArr.map((item, idx) =>
							<div className={`game-rule-item ${gameRuleNum===idx?"show":""}`} key={idx}>
								<div className="text"> {item} </div>
								<div className="rule-img"></div>
							</div>
						)}
						<div className="rule-step">
							<BtnPreIcon className="btn-rule btn-rule-pre" onClick={()=>this.setRuleStepNum(-1)}></BtnPreIcon>
							<BtnNextIcon className="btn-rule btn-rule-next" onClick={()=>this.setRuleStepNum(1)}></BtnNextIcon>
							<div className="dot-wrapper">
								{this.gameRuleArr.map((item, idx) =>
									<div className={`game-rule-dot ${gameRuleNum===idx?"active":""}`} key={idx}></div>
								)}
							</div>
						</div>
						<div className="game-menu-item" onClick={()=>this.clickButton("play", false)}>
							<div className="text">Play</div>
						</div>
					</div>
				}
				{(modalInfo === "success" || modalInfo === "autoBuild" || modalInfo === "timeOut") &&
					<div className="modal-wrapper game-end">
						<div className="title">
							{modalInfo === "success" && "Success Game"}
							{modalInfo === "autoBuild" && "End auto build"}
							{modalInfo === "timeOut" && "Time Up"}
						</div>
						<div className="game-result">
							<div className="game-result-timeOut">
								<div className="single sub-title">You Scored {gameTime + gamePro} points</div>
								<div className="half-row">
									<div className="half-part half-left">Time taken</div>
									<div className="half-part half-right">{totalTime - gameTime} s</div>
								</div>
								<div className="half-row">
									<div className="half-part half-left">Difficulty</div>
									<div className="half-part half-right">
										{level === "gameEasy" && "Easy"}
										{level === "gameMedium" && "Medium"}
										{level === "gameDifficult" && "Hard"}
									</div>
								</div>
								<div className="half-row">
									<div className="half-part half-left">Completion amount</div>
									<div className="half-part half-right">{gamePro} %</div>
								</div>
								<div className="half-row">
									<div className="half-part half-left">Wrong moves</div>
									<div className="half-part half-right">{transError.clash + transError.quality}</div>
								</div>
								<div className="label">You could improve this by using</div>
								<div className="single assemble">
									<div className="result-img"><img src={resultImg}></img></div>
								</div>
								<div className="single game-menu-item media-link" onClick={()=>this.linkProduct(this.props.modalDetailInfo)}>View more information</div>
							</div>
						</div>
						<div className="game-button">
							<div className="game-menu-item left" onClick={()=>this.clickButton("play", false)}>
								Play Again
							</div>
							<div className="game-menu-item right" onClick={()=>this.clickButton("leader", false)}>
								LeaderBoard
							</div>
						</div>
					</div>
				}
				{modalInfo === "leader" &&
					<div className="modal-wrapper leader-board">
						<div className="title">Leaderboard</div>
						<div className="leader-content">
							<div className="leader-line th">
								<div className="no leader-cell">Position</div>
								<div className="name leader-cell">Time Taken</div>
								<div className="score leader-cell">Score</div>
							</div>
							{this.leaderBoardArr.map((item, idx) =>
								<div className="leader-line" key={idx}>
									<div className="no leader-cell">{item.no}</div>
									<div className="name leader-cell">{item.name}</div>
									<div className="score leader-cell">{item.score}</div>
								</div>
							)}
						</div>
						<div className="game-button">
							<div className="game-menu-item center" onClick={()=>this.clickButton("play", false)}>
								Play Again
							</div>
						</div>
					</div>
				}
				{modalInfo === "hotSpot" &&
					<div className="modal-wrapper hotspot">
						<div className="title">{hotModalInfo[hotStr].title}</div>
						<div className="sub-content">
							<div className="description">{hotModalInfo[hotStr].content}</div>
							<div className="image">
								<img src={hotModalInfo[hotStr].img}></img>
								<div className="game-menu-item">
									<div className="text">Learn more</div>
								</div>
							</div>
						</div>
						<div className="close-hot" onClick={()=>this.clickButton("", true)}>
							<i className="fa fa-close" style={{color: 'white'}}></i>
						</div>
					</div>
				}
				{modalInfo === "product" &&
					<div className="modal-wrapper product">
						<div className="title">{this.props.modalDetailInfo.title}</div>
						<div className="close-btn" onClick={()=>this.clickButton("", true)}>
							<i className="fa fa-close" style={{color: 'white'}}></i>
						</div>
						<div className="body">
							<p>{this.props.modalDetailInfo.description}</p>
							<label>Capabilities</label>
							<p>{this.props.modalDetailInfo.capabilities}</p>
						</div>
						<div style={{padding: '1rem'}}>
							<a href={this.props.modalDetailInfo.murl} target="_blank">
								More information
							</a>
						</div>
					</div>
				}
			</div>
		);
	}
}