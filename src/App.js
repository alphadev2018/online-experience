import React, { Component } from 'react';

import Provider from 'react-redux/es/components/Provider';
import { BrowserRouter as Router } from 'react-router-dom';

// import './App.css';

import Home   from './components/Home';
import Header   from './components/Header';
import Footer   from './components/Footer';
import Sidebar   from './components/Sidebar';
import OverPan from "./components/OverPan";

import 'style.css';

export default class App extends Component {
	constructor(props) {
		super(props);
		this.state={menuItem:"first", first:true, overModal:true};
	}

	componentDidMount() {
	}

	callMenuItem=(str)=>{
		this.setState({menuItem:str}, ()=>{
			if (str === "game") this.setState({overModal:true});
		});
	}

	callClickButton=(str)=>{
		if (str === "first") {
			this.setState({menuItem:"home"});
		}
		this.setState({overModal:null});
	}

	render() {
		return (
			<div>
				<Home
					overModal={this.state.overModal}
					first={this.state.first}
					menuItem={this.state.menuItem}
					callMenuItem={this.callMenuItem}
				></Home>
				<Header></Header>
				<Footer></Footer>
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
