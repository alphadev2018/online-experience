import React, { Component } from 'react';
import gameImgEasy from "../assets/images/game_easy.png";
import gameImgMedium from "../assets/images/game_medium.png";
import gameImgDifficult from "../assets/images/game_difficult.png";

import 'assets/styles/footer.css';

export default class Footer extends Component {
	constructor(props) {
		super(props);
		this.footerBtnArr = [
			// {label:"Team Assist", value:"assist"},
			// {label:"Design Reveal", value:"design"},
			// {label:"Auto complete", value:"auto"},
			{label:["Team", "Assist"], value:"assist"},
			{label:["Design", "Reveal"], value:"design"},
			{label:["Auto", "complete"], value:"auto"},
		];
		this.state = {game:false, selButton:null, gameNum:-1};
		// this.gamePreImg = [gameImgEasy, gameImgMedium, gameImgDifficult];
		this.gamePreImg = {gameEasy:gameImgEasy, gameMedium:gameImgMedium, gameDifficult:gameImgDifficult};
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
						<div className="title">Lifelines</div>
						<div className="life-btn-wrapper">
							{this.footerBtnArr.map(item =>
								<div className={`life-item `} onClick={()=>this.clickItem(item.value)} key={item.value}>
									<div>{item.label[0]}</div>
									<div>{item.label[1]}</div>
									{/* {item.label} */}
								</div>
							)}
						</div>
					</div>
				}
				{selButton === "assist" &&
					<div className="image-wrapper assist">
						<div className="label">Team Assist</div>
						<img src={this.gamePreImg[game]}></img>
					</div>
				}
				{selButton === "design" &&
					<div className="image-wrapper design">
						<div className="label">Design Reveal</div>
						<img src={this.gamePreImg[game]}></img>
					</div>
				}
			</div>
		);
	}
}
