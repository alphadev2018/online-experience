import React, { Component } from 'react';

import '../assets/styles/overPan.css';


export default class OverPan extends Component {
	constructor(props) {
		super(props);
		this.state = {buttonArr:props.buttonArr, hide:""}
	}

	componentDidMount() {
	}
	componentWillReceiveProps(nextProps) {
		if (this.state.buttonArr !== nextProps.buttonArr) {
			this.setState({buttonArr:nextProps.buttonArr});
		}
	}

	clickButton = (str) => {
		if (str === "first") {
			this.setState({hide:"hide"});
			setTimeout(() => {
				this.props.callClickButton(str);
			}, 500);
		}
	}

	render() {
		return (
			<div className={"over-pan "+this.state.hide}>
				{this.state.buttonArr && this.state.buttonArr.length &&
					<div className={"button-wrapper button_"+this.state.buttonArr.length}>
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
