import React, { Component } from 'react';
import gameImgEasy from "../assets/images/game_easy.png";
import gameImgMedium from "../assets/images/game_medium.png";
import gameImgDifficult from "../assets/images/game_difficult.png";

import 'assets/styles/footer.css';

export default class Footer extends Component {
	constructor(props) {
		super(props);
		this.footerBtnArr = [
			{label:"Projects Team Assist", value:"assist"},
			{label:"Design Reveal", value:"design"},
			{label:"Auto complete", value:"auto"},
		];
		this.state = {game:false, selButton:null, gameNum:-1, gameStatus:false};
		this.gamePreImg = {gameEasy:gameImgEasy, gameMedium:gameImgMedium, gameDifficult:gameImgDifficult};
	}

	componentDidMount() {
	}

	UNSAFE_componentWillReceiveProps(nextProps) {
		if (this.state.game !== nextProps.game) {
			this.setState({game:nextProps.game});
			if (!nextProps.game) this.setState({selButton:null});
		}
		if (this.state.gameStatus !== nextProps.gameStatus) {
			this.setState({gameStatus:nextProps.gameStatus});
		}
	}
	clickItem=(str)=>{
		if (this.state.selButton) return;
		if (!this.state.gameStatus) return;
		this.setState({selButton:str});
		if (str === "auto") this.props.callAutoBuild();
		else if (str === "assist") {
			this.props.callAssist();
			setTimeout(() => { this.setState({selButton:null}); }, 1000);
		}
		else if (str === "design") {
			setTimeout(() => { this.setState({selButton:null}); }, 3000);
		}
	}

	render() {
		const {game, selButton}=this.state;
		return (
			<div className="footer">
				{ game !== false &&
					<div className="life-lines">
						<div className="title">Lifelines</div>
						<div className="life-btn-wrapper">
							{this.footerBtnArr.map((item, index) =>
								<div className={`life-item `} onClick={()=>this.clickItem(item.value)} key={item.value}>
									<label style={{lineHeight: index ? 'normal' : '0.9'}}>{item.label}</label>
								</div>
							)}
						</div>
					</div>
				}
				{/* {selButton === "assist" &&
					<div className="image-wrapper assist">
						<div className="label">Team Assist</div>
						<img src={this.gamePreImg[game]}></img>
					</div>
				} */}
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
