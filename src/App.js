import React, { Component } from 'react';
import {connect} from 'react-redux';

// import './App.css';

import Home   from './components/Home';
import Header   from './components/Header';
import Footer   from './components/Footer';
import Sidebar   from './components/Sidebar';
import OverPan from "./components/OverPan";

import 'style.css';

import { easeTime } from './components/common';
import {API_CONFIG} from "ApiConfig";

class App extends Component {
	constructor(props) {
		super(props);
		this.state={menuItem:"first", modalInfo:"first", first:true, selGame:false, gameResult:null, loadPro:0, gameStatus:false, showMobileMenu:false}; //, autoBuild:false
	}

	componentDidMount() {
	}

	callAddLoadNum=(totalNum, loadNum)=>{
		this.setState({loadPro:Math.round(loadNum * 100 / totalNum)});
	}

	callMenuItem=(str)=>{
		console.log(str);
		this.setState({menuItem:str, selGame:false}, ()=>{
			if (str === "game") 
				setTimeout(() => { this.setState({modalInfo:"game"}); }, easeTime);
			else if (str === "conductive") window.open("https://www.autodesk.com/autodesk-university/Construction", "_blank"); 
			else this.setState({modalInfo:false});
		});
	}

	callHotSpot=(str, land)=>{
		if (str === "") return;
		this.setState({modalInfo:"hotSpot", modalDetailInfo:{ hotspot: str, land: land }});
	}

	callProduct=(product)=>{
		this.setState({modalInfo:"product", modalDetailInfo: product});
	}

	callGameResult=(status, totalTime, gameTime, gamePro, transError)=>{
		if (this.props.app.app.user_name) {
			fetch(`${API_CONFIG}/score?name=${this.props.app.app.user_name}&score=${gameTime+gamePro}`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				}
			});
		}
		this.setState({modalInfo:status, selGame:false, modalDetailInfo:{totalTime, gameTime, level:this.state.selGame, gamePro, transError}});
	}

	callModal=(str)=>{
		this.setState({modalInfo: str});
	}

	callModalButton=(str)=>{
		if (str === "first") {
			this.setState({menuItem:"home0"});
		}
		else if (str.indexOf("game") > -1) {
			this.setState({selGame:str, gameStatus:false});
		}
		this.setState({modalInfo:false});
	}
	callMobileMenu=()=>{
		this.setState({showMobileMenu:!this.state.showMobileMenu});
	}
	callLinkProduct=(product)=>{
		this.setState({menuItem:"media", modalDetailInfo: product});
	}

	render() {
		const {selGame,modalInfo, first, menuItem, modalDetailInfo, loadPro, gameStatus, showMobileMenu} = this.state;
		
		return (
			
			<div>
				<Home
					game={selGame}
					overModal={modalInfo}
					first={first}
					menuItem={menuItem}
					callMenuItem={this.callMenuItem}
					callGameStatus={(val)=>this.setState({gameStatus:val})}
					callGameResult={this.callGameResult}
					callHotSpot={this.callHotSpot}
					callProduct={this.callProduct}
					callModal={this.callModal}
					callAddLoadNum={this.callAddLoadNum}
				></Home>
				<Header
					menuItem={menuItem}
					callMobileMenu={this.callMobileMenu}
				></Header>
				<Footer
					gameStatus={gameStatus}
					game={selGame}
				></Footer>
				<Sidebar
					menuItem={menuItem}
					showMobileMenu={showMobileMenu}
					callMenuItem={this.callMenuItem}
					callMobileMenu={this.callMobileMenu}
				></Sidebar>
				{modalInfo &&
					<OverPan
						loadPro={loadPro}
						modalInfo={modalInfo}
						modalDetailInfo={modalDetailInfo}
						callClickButton={this.callModalButton}
						callLinkProduct={this.callLinkProduct}
					></OverPan>
				}
			</div>
		)
	}
}

function mapStateToProps(props)
{
    return {
        app:       props.app
    }
}

export default connect(mapStateToProps, null)(App);