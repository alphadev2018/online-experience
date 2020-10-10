import React, { Component } from 'react';
import gameImgMedium from "../assets/images/game_medium.png";

import 'assets/styles/footer.css';

export default class Footer extends Component {
	constructor(props) {
		super(props);
		this.footerBtnArr = [
			{label:"Team Assist", value:"assist"},
			{label:"Design Reveal", value:"design"},
			{label:"Auto complete", value:"auto"},
		]
		this.state = {game:false, selButton:null};
	}

	componentDidMount() {
	}

	UNSAFE_componentWillReceiveProps(nextProps) {
		if (this.state.game !== nextProps.game) {
			this.setState({game:nextProps.game});
		}
	}
	clickItem=(str)=>{
		if (str === "auto") {
			this.props.callAutoBuild();
		}
		else {
			if (this.state.selButton) return;
			this.setState({selButton:str});
			setTimeout(() => {
				this.setState({selButton:null});
			}, 3000);
		}
	}

	render() {
		const {game, selButton}=this.state;
		return (
			<div className="footer">
				{game !== false &&
					<div className="life-lines">
						<div className="title">Life Lines</div>
						<div className="life-btn-wrapper">
							{this.footerBtnArr.map(item =>
								<div className={`life-item `} onClick={()=>this.clickItem(item.value)} key={item.value}>
									{item.label}
								</div>
							)}
						</div>
					</div>
				}
				{selButton === "assist" &&
					<div className="image-wrapper assist">
						<div className="label">Team Assist</div>
						<img src={gameImgMedium}></img>
					</div>
				}
				{selButton === "design" &&
					<div className="image-wrapper design">
						<div className="label">Design Reveal</div>
						<img src={gameImgMedium}></img>
					</div>
				}
			</div>
		);
	}
}
