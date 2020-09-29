import React, { Component } from 'react';
import jQuery from 'jquery';
import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';
import {TransformControls} from 'three/examples/jsm/controls/TransformControls';
// import OrbitControls from 'three-orbitcontrols';

import {modelArr, gameInfoArr, SetTween, easeTime, AnimateReturn, AnimateRotate, LoadIslandModel, LoadGameModel, GotoIsland, GetRayCastObject} from "./common";
import '../assets/styles/home.css';

export default class Home extends Component {
	constructor(props) {
		super(props);
		this.cWidth = jQuery(window).width();  this.mouseX = 0;
		this.cHeight = jQuery(window).height();this.mouseY = 0;
		this.raycaster = new THREE.Raycaster(); this.mouse = new THREE.Vector2();
		this.animate = this.animate.bind(this);
		this.meshArr = []; this.selLandName = "";
		this.cloudArr = []; this.windBaseArr = []; this.carArr = []; this.tonArr = []; this.mouseStatus = "";
		this.state = { overModal:true, gameStatus:null, gameTime:-1 };
		this.gameMeshArr = [];
	}
	
	componentDidMount() {
		this.init();
		this.animate();
		this.setCanvasSize();
		window.addEventListener('resize', this.setCanvasSize);
		window.addEventListener( 'click', this.mouseClick, false );
		window.addEventListener( 'pointerdown', this.mouseDown, false );
		window.addEventListener( 'pointermove', this.mouseMove, false );
		window.addEventListener( 'pointerup', this.mouseUp, false );
		// window.addEventListener("touchstart", this.touchStart, false);
		// window.addEventListener("touchmove", this.touchMove, false);
		// window.addEventListener("touchend", this.touchEnd, false);
		// window.addEventListener("touchcancel", this.touchEnd, false);
	}

	UNSAFE_componentWillReceiveProps(nextProps) {
		if (this.selLandName !== nextProps.menuItem) {
			if (this.selLandName === "") SetTween(this.scene.fog, "far", 50, easeTime);
			GotoIsland(this, nextProps.menuItem);
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
			this.gameNum = 0;
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
		if (this.state.overModal || this.state.gameStatus === "process") return;
		const intersect = GetRayCastObject(this, event.clientX, event.clientY, this.meshArr);
		if (intersect) {
			const landName = intersect.object.landChildName;
			if (landName !== this.selLandName) {
				if (landName !== "home" && this.selLandName !== "home") return;
				GotoIsland(this, landName);
				this.props.callMenuItem(landName);
			}
		}
		else {
		}
	}

	mouseDown = (event) => {
		this.mouseStatus = "down";
		if (this.state.gameStatus !== "process") return;
	}

	mouseMove = (event) => {
		this.mouseStatus = "move";
		if (this.state.gameStatus !== "process") return;
	}

	mouseUp = (event) => {
		if (this.mouseStatus === "down") {
			if (this.state.gameStatus !== "process") return;
			const intersect = GetRayCastObject(this, event.clientX, event.clientY, this.gameMeshArr);
			if (intersect) {
				this.transform.attach(intersect.object);
			}
			else {
				this.transform.detach();
			}
		}
		this.mouseStatus = "";
	}

	setEndGame=()=>{
		this.setState({gameStatus:null});
		this.gameGroup.visible = false;
		this.totalGroup.children.forEach(island => { island.visible = true; });
	}

	setStartTime=()=> {
		this.totalTime = gameInfoArr[this.gameNum].time;
		this.setState({gameTime:this.totalTime+1});
		var startPlayTime = setInterval(() => {
			const remainTime = this.state.gameTime;
			if 		(remainTime > this.totalTime) { this.setState({gameStatus:"start"}); }
			else if (remainTime === this.totalTime) { this.startGame(); this.setState({gameStatus:"process"});}
			else if (remainTime > 0) {  }
			else {this.setEndGame(); clearInterval(startPlayTime);}
			this.setState({gameTime:remainTime -1});
		}, 1000);
	}

	startGame=()=>{
		this.gameMeshArr = [];
		var gameModel = this.gameGroup.children[this.gameNum];
		console.log(gameModel);
		gameModel.children.forEach((child, idx) => {
			if (child.name !== gameModel.basicModel) this.gameMeshArr.push(child);
		});
		const dis = 200;
		this.gameMeshArr.forEach(mesh => {
			const posX = Math.round(Math.random() * dis/10) * 10 - dis/2;
			const posZ = Math.round(Math.random() * dis/10) * 10 - dis/2;
			SetTween(mesh, "position", {x:posX, z:posZ}, easeTime);
			SetTween(mesh, "camPos", 0, easeTime);
		});
	}

	init() {
		var self = this, backCol = 0x6CB3C5;
		this.renderer = new THREE.WebGLRenderer({antialias:true, alpha:true});
		this.renderer.setSize(this.cWidth, this.cHeight);
		if (!document.getElementById("container")) return false;
		document.getElementById("container").appendChild(this.renderer.domElement);
		this.renderer.setClearColor(backCol, 1);

		this.camera = new THREE.PerspectiveCamera(60, this.cWidth / this.cHeight, 1,  300);
		this.camera.position.set(0, 1.5, 10);
		this.scene = new THREE.Scene(); this.scene.fog = new THREE.Fog(backCol, 0, 200);
		this.totalGroup = new THREE.Group(); this.scene.add(this.totalGroup); this.totalGroup.position.set(0, -5, -70);
		this.gameGroup = new THREE.Group(); this.scene.add(this.gameGroup); this.gameGroup.visible = false;

		this.controls = new OrbitControls(this.camera, this.renderer.domElement); // this.controls.enabled = false;
		this.controls.minDistance = 5; this.controls.maxDistance = 25; this.controls.maxPolarAngle = Math.PI/2;

        this.transform = new TransformControls( this.camera, this.renderer.domElement ); this.scene.add(this.transform);
        // this.transform.showZ = false;
        this.transform.setTranslationSnap(10);
        this.transform.setSize(0.8);
        this.transform.addEventListener( 'dragging-changed', function ( event ) { self.controls.enabled = ! event.value; } );

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
				{this.state.gameStatus === "start" && <div className="start-time">{this.state.gameTime - this.totalTime} ...</div> }
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
