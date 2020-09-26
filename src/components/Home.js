import React, { Component } from 'react';
import jQuery from 'jquery';
import * as THREE from 'three';
import OrbitControls from 'three-orbitcontrols';

import {modelArr, gameInfoArr, SetTween, easeTime, AnimateReturn, AnimateRotate, gameTime, LoadIslandModel, LoadGameModel} from "./common";
import '../assets/styles/home.css';

export default class Home extends Component {
	constructor(props) {
		super(props);
		this.cWidth = jQuery(window).width();  this.mouseX = 0;
		this.cHeight = jQuery(window).height();this.mouseY = 0;
		this.raycaster = new THREE.Raycaster(); this.mouse = new THREE.Vector2();
		this.animate = this.animate.bind(this);
		this.meshArr = []; this.selLandName = "";
		this.cloudArr = []; this.windBaseArr = []; this.carArr = []; this.tonArr = [];
		this.state = { overModal:true, gameStatus:null, gameTime:-1 };
		this.gameMeshArr = [];
	}
	
	componentDidMount() {
		this.init();
		this.animate();
		this.setCanvasSize();
		window.addEventListener('resize', this.setCanvasSize);
		window.addEventListener( 'click', this.mouseClick, false );
		// window.addEventListener( 'mousemove', this.mouseMove, false );
		// window.addEventListener("touchstart", this.touchStart, false);
		// window.addEventListener("touchmove", this.touchMove, false);
		// window.addEventListener("touchend", this.touchEnd, false);
		// window.addEventListener("touchcancel", this.touchEnd, false);
	}

	UNSAFE_componentWillReceiveProps(nextProps) {
		if (this.selLandName !== nextProps.menuItem) {
			this.gotoIsland(nextProps.menuItem);
		}
		if (this.state.overModal !== nextProps.overModal) {
			this.setState({overModal:nextProps.overModal});
		}
		if (!this.state.gameStatus && nextProps.game) {
			this.setState({gameStatus:"start"});
			this.gameGroup.visible = true;
			this.totalGroup.children.forEach(island => {
				island.visible = (island.islandName === "game");
			});
			this.controls.minDistance = 0.1;
			SetTween(this.camera, "position", {x:-10, z:0}, easeTime);
			setTimeout(() => { this.controls.minDistance = 5; }, easeTime);
			this.setStartTime();
		}
		else if (this.state.gameStatus && !nextProps.game) {
			this.setEndGame();
		}
	}

	setCanvasSize = () => {
		this.cWidth = jQuery(window).width();
		this.cHeight = jQuery(window).height();
		if (this.renderer && this.camera) {
			this.renderer.setSize(this.cWidth, this.cHeight);
			this.camera.aspect = this.cWidth/this.cHeight;
			this.camera.updateProjectionMatrix();
		}
	}

	mouseClick = (event) => {
		if (this.state.overModal) return;
		this.mouse.x = ( event.clientX / this.cWidth ) * 2 - 1;
		this.mouse.y = - ( event.clientY / this.cHeight ) * 2 + 1;

		this.raycaster.setFromCamera( this.mouse, this.camera );
		const intersect = this.raycaster.intersectObjects( this.meshArr )[0];
		if (intersect) {
			const landName = intersect.object.landChildName;
			if (landName !== this.selLandName) {
				this.gotoIsland(landName);
				this.props.callMenuItem(landName);
			}
		}
		else {
		}
	}

	setEndGame=()=>{
		this.setState({gameStatus:null});
		this.gameGroup.visible = false;
		this.totalGroup.children.forEach(island => { island.visible = true; });
	}

	setStartTime=()=> {
		this.setState({gameTime:gameTime+5});
		var startPlayTime = setInterval(() => {
			const remainTime = this.state.gameTime;
			if 		(remainTime > gameTime) { this.setState({gameStatus:"start"}); }
			else if (remainTime === gameTime) { this.startGame(); this.setState({gameStatus:"process"});}
			else if (remainTime >=  0) {  }
			else {this.setEndGame(); clearInterval(startPlayTime);}
			this.setState({gameTime:remainTime -1});
		}, 1000);
	}

	startGame=()=>{
		this.gameMeshArr = [];
		var gameModel = this.gameGroup.children[0];
		gameModel.children.forEach(child => {
			this.gameMeshArr.push(child);
		});
		const dis = 200;
		this.gameMeshArr.forEach(mesh => {
			const posX = Math.round(Math.random() * dis) - dis/2;
			const posZ = Math.round(Math.random() * dis) - dis/2;
			SetTween(mesh, "position", {x:posX, z:posZ}, easeTime);
			SetTween(mesh, "camPos", 0, easeTime);
		});
	}

	gotoIsland=(str)=>{
		modelArr.forEach(islandItem => {
			if (islandItem.islandName === str) {
				const landPos = islandItem.pos;
				SetTween(this.totalGroup, "position", {x:landPos.x * -1, z:landPos.z * -1}, easeTime);
				SetTween(this.totalGroup, "camPos", 0, easeTime);
				SetTween(this.camera, "camPos", 3, easeTime);
			}
		});
		if (str === "map") {
			this.controls.maxDistance = 70;
			SetTween(this.totalGroup, "position", {x:0, z:0}, easeTime);
			SetTween(this.camera, "camPos", 60, easeTime);
			setTimeout(() => {
				this.controls.minDistance = 50;
				this.controls.maxPolarAngle = 0.2;
			}, easeTime);
		}
		else if (this.selLandName === "map") {
			this.controls.minDistance = 5;
			SetTween(this.camera, "camPos", 3, easeTime);
			SetTween(this.camera, "position", {x:0, z:10}, easeTime);
			setTimeout(() => {
				this.controls.maxDistance = 25;
				this.controls.maxPolarAngle = Math.PI/2;
			}, easeTime);
		}
		this.selLandName = str;
	}

	init() {
		this.renderer = new THREE.WebGLRenderer({antialias:true, alpha:true});
		this.renderer.setSize(this.cWidth, this.cHeight);
		if (!document.getElementById("container")) return false;
		document.getElementById("container").appendChild(this.renderer.domElement);
		this.renderer.setClearColor(0x6cb3c5, 1);

		this.camera = new THREE.PerspectiveCamera(60, this.cWidth / this.cHeight, 1,  300);
		this.camera.position.set(0, 1.5, 10);
		this.scene = new THREE.Scene();
		this.totalGroup = new THREE.Group(); this.scene.add(this.totalGroup); this.totalGroup.position.set(0, -5, -70);
		this.gameGroup = new THREE.Group(); this.scene.add(this.gameGroup); this.gameGroup.visible = false;

		this.controls = new OrbitControls(this.camera, this.renderer.domElement); // this.controls.enabled = false;
		this.controls.minDistance = 5; this.controls.maxDistance = 25; this.controls.maxPolarAngle = Math.PI/2;

		const ambientLight = new THREE.AmbientLight( 0xFFFFFF, 0.2 ); this.scene.add( ambientLight );
		this.mainLight = new THREE.DirectionalLight( 0xFFFFFF, 1.5 ); this.scene.add( this.mainLight );
		this.mainLight.position.set(-50, 50, 50);
		modelArr.forEach(modelInfo => { LoadIslandModel(modelInfo, this);  });
		gameInfoArr.forEach((gameInfo, idx) => { LoadGameModel(gameInfo, this); });
	}

	animate () {
		if (!this.camera || !this.scene) return;
		requestAnimationFrame(this.animate);
		AnimateRotate(this.windBaseArr, "y", 0.005, "wind");
		AnimateRotate(this.carArr, "y", 0.005, "car");
		AnimateReturn(this.cloudArr, "position", "x", 0.5);
		AnimateReturn(this.tonArr, "rotation", "y", 0.01);
		this.camera.lookAt( 0, 0, 0 );
		this.renderer.render(this.scene, this.camera);
	}
	
	render() {
		return (
			<div className="home">
				<div id="container"></div>
				{this.state.gameStatus === "start" && <div className="start-time">{this.state.gameTime - gameTime} ...</div> }
				{this.state.gameStatus === "process" &&
					<div className="process-time">
						<div> Remain Time </div>
						<div>{this.state.gameTime} second</div>
					</div>
				}
			</div>
		)
	}
}
