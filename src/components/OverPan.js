import React, { Component } from 'react';

import '../assets/styles/overPan.css';
import {easeTime} from "./common";


export default class OverPan extends Component {
	constructor(props) {
		super(props);
		this.state = {buttonArr:[], hide:"hide", menuItem:props.menuItem}
	}

	componentDidMount() {
		var buttonArr = [];
		if (this.props.menuItem === "first") buttonArr = [{label:"Enter Experience", value:"first"}];
		else if (this.props.menuItem === "game")
			buttonArr = [
				{label:"Play", value:"play"},
				{label:"Leader Boards", value:"leader"},
				{label:"Rules", value:"rules"}
			];
		setTimeout(() => {
			this.setState({hide:"", buttonArr:buttonArr}); 
		},easeTime);
	}
	
	componentWillReceiveProps(nextProps) {
		if (this.state.menuItem !== nextProps.menuItem) {
			this.setState({menuItem:nextProps.menuItem});
		}
	}

	clickButton = (str) => {
		this.setState({hide:"hide"});
		setTimeout(() => { this.props.callClickButton(str); }, 500);
}

	render() {
		const buttonLength = this.state.buttonArr.length;
		return (
			<div className={`over-pan ${this.state.hide}`}>
				{this.state.buttonArr && buttonLength &&
					<div className={`button-wrapper button_${buttonLength}`}>
						{this.state.buttonArr.map(button =>
							<div className="button" onClick={()=>this.clickButton(button.value)} key={button.value}>
								{button.label}
							</div>
						)}
					</div>
				}
			</div>
		);
	}
}
