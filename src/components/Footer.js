import React, { Component } from 'react';

import 'assets/styles/footer.css';

export default class Footer extends Component {
	constructor(props) {
		super(props);
		this.footerBtnArr = [
			{label:"Team Assist", value:"assist"},
			{label:"Design Reveal", value:"design"},
			{label:"Auto complete", value:"auto"},
		]
		this.state = {game:false};
	}

	componentDidMount() {
	}

	UNSAFE_componentWillReceiveProps(nextProps) {
		if (this.state.game !== nextProps.game) {
			this.setState({game:nextProps.game});
		}
	}


	render() {
		const {game}=this.state;
		return (
			<div className="footer">
				{game === true &&
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
			</div>
		);
	}
}
