import React, { Component } from 'react';

import 'assets/styles/home.css';

export default class Sidebar extends Component {
	constructor(props) {
		super(props);
	}

	componentDidMount() {
	}

	render() {
		return (
			<div className="side">
				<ul>
					<li class="active">
						<a href="#">
							<i class="fa fa-home"></i>
						</a>
					</li>
					<li>
						<a href="#">
							<i class="fa fa-file-video-o"></i>
						</a>
					</li>
					<li>
						<a href="#">
							<i class="fa fa-bolt"></i>
						</a>
					</li>
					<li>
						<a href="#">
							<i class="fa fa-trophy"></i>
						</a>
					</li>
					<li>
						<a href="#" style={{fontSize: '15px'}}>
							<i class="fa fa-map-o"></i>
						</a>
					</li>
				</ul>

				<a href="#" class="nav-arrow">
					<i class="fa fa-arrows"></i>
				</a>
				
			</div>
		);
	}
}
