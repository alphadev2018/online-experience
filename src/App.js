import React, { Component } from 'react';

// import './App.css';

import Home   from './components/Home';
import Header   from './components/Header';
import Footer   from './components/Footer';
import Sidebar   from './components/Sidebar';
import OverPan from "./components/OverPan";

import 'style.css';
import { easeTime } from './components/common';

export default class App extends Component {
	constructor(props) {
		super(props);
		this.state={menuItem:"first", modalInfo:"first", first:true, game:false, gameResult:null, autoBuild:false};
	}

	componentDidMount() {
	}

	callMenuItem=(str)=>{
		this.setState({menuItem:str, game:false}, ()=>{
			if (str === "game") 
				setTimeout(() => { this.setState({modalInfo:"game"}); }, easeTime);
		});
	}

	callGameResult=(status, time)=>{
		this.setState({modalInfo:status, game:false, modalDetailInfo:{time}, autoBuild:false});
	}

	callModalButton=(str)=>{
		if (str === "first") {
			this.setState({menuItem:"home"});
		}
		else if (str.indexOf("game") > -1) this.setState({game:true});
		this.setState({modalInfo:false});
	}

	render() {
		return (
			<div>
				<Home
					game={this.state.game}
					overModal={this.state.modalInfo}
					first={this.state.first}
					menuItem={this.state.menuItem}
					autoBuild={this.state.autoBuild}
					callMenuItem={this.callMenuItem}
					callGameResult={this.callGameResult}
				></Home>
				<Header></Header>
				<Footer
					game={this.state.game}
					callAutoBuild={()=>this.setState({autoBuild:true})}
				></Footer>
				<Sidebar
					menuItem={this.state.menuItem}
					callMenuItem={this.callMenuItem}
				></Sidebar>
				{this.state.modalInfo &&
					<OverPan
						modalInfo={this.state.modalInfo}
						modalDetailInfo={this.state.modalDetailInfo}
						callClickButton={this.callModalButton}
					></OverPan>
				}
			</div>
		)
	}
}
