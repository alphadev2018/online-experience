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
		this.state={menuItem:"first", first:true, overModal:true, game:false};
	}

	componentDidMount() {
	}

	callMenuItem=(str)=>{
		this.setState({menuItem:str, game:false}, ()=>{
			if (str === "game") 
			setTimeout(() => {
				this.setState({overModal:true});
			}, easeTime);
		});
	}

	callClickButton=(str)=>{
		if (str === "first") {
			this.setState({menuItem:"home"});
		}
		else if (str.indexOf("game") > -1) this.setState({game:true});
		this.setState({overModal:null});
	}

	render() {
		return (
			<div>
				<Home
					game={this.state.game}
					overModal={this.state.overModal}
					first={this.state.first}
					menuItem={this.state.menuItem}
					callMenuItem={this.callMenuItem}
				></Home>
				<Header></Header>
				<Footer
					game={this.state.game}
				></Footer>
				<Sidebar
					menuItem={this.state.menuItem}
					callMenuItem={this.callMenuItem}
				></Sidebar>
				{this.state.overModal &&
					<OverPan
						menuItem={this.state.menuItem}
						callClickButton={this.callClickButton}
					></OverPan>
				}
			</div>
		)
	}
}
