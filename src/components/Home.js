import React, { Component } from 'react';
import jQuery from 'jquery';
import * as THREE from 'three';
import {FBXLoader} from "three/examples/jsm/loaders/FBXLoader";
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';
import {TransformControls} from 'three/examples/jsm/controls/TransformControls';

import {modelArr, gameInfoArr, easeTime, gameReadyTime, SetTween, AnimateReturn, AnimateRotate, LoadIslandModel, LoadGameModel, GotoIsland, GetRayCastObject, CheckGameModel} from "./common";
import '../assets/styles/home.css';
import '../assets/styles/overPan.css';

export default class Home extends Component {
	constructor(props) {
		super(props);
		this.cWidth = jQuery(window).width();  this.mouseX = 0;
		this.cHeight = jQuery(window).height();this.mouseY = 0;
		this.raycaster = new THREE.Raycaster(); this.mouse = new THREE.Vector2();
		this.animate = this.animate.bind(this);
		this.meshArr = []; this.selLandName = "";
		this.cloudArr = []; this.windBaseArr = []; this.carArr = []; this.tonArr = []; this.mouseStatus = "";
		this.state = { overModal:true, gameStatus:null, gameTime:-1, autoBuild:false };
		this.gameMeshArr = []; this.gameIslandPlane = null; this.gameIslandLine = null;
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
			this.totalGroup.children.forEach(island => {
				island.visible = (island.islandName === "game");
			});
			this.controls.minDistance = 0.1;
			SetTween(this.camera, "position", {x:-10, z:0}, easeTime);
			setTimeout(() => { this.controls.minDistance = 5; }, easeTime);
			this.gameGroup.visible = true;
			if 		(nextProps.game === "gameEasy") 	this.gameNum = 0;
			else if (nextProps.game === "gameMedium") 	this.gameNum = 1;
			else if (nextProps.game === "gameDifficult")this.gameNum = 2;
			if (this.gameNum === 1) {
				this.gameIslandPlane.material = new THREE.MeshPhongMaterial({transparent:true, opacity:0.7, color:0x083D8A});
			}
			else {
				this.gameIslandPlane.material = new THREE.MeshPhongMaterial({color:0x7E9E3A});
			}


			this.gameGroup.children.forEach((gameModel, idx) => {
				gameModel.visible = (idx === this.gameNum)?true:false;
			});
			this.totalTime = gameInfoArr[this.gameNum].time;
			this.setState({gameTime:this.totalTime+gameReadyTime, gameStatus:"start", gamePro:0}, ()=>{
				this.setStartTime();
			});
			
		}
		else if (this.state.gameStatus && !nextProps.game) {
			this.setEndGame();
		}
		if (this.state.autoBuild !== nextProps.autoBuild) {
			this.setState({autoBuild:nextProps.autoBuild});
			if (nextProps.autoBuild) this.setAutoBuild();
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
		if (this.state.gameStatus !== "process") return;
		if (this.mouseStatus === "down") {
			const intersect = GetRayCastObject(this, event.clientX, event.clientY, this.gameMeshArr);
			if (intersect) { this.transform.attach(intersect.object); }
			else 			{ this.transform.detach(); }
		}
		else {
			const checkGamePro = CheckGameModel(this.gameGroup.children, this.gameNum);
			this.setState({gamePro:checkGamePro});
			console.log(checkGamePro);
			if (checkGamePro === 100) {
				this.props.callGameResult("success", this.totalTime, this.state.gameTime, checkGamePro);
			}
		}
		this.mouseStatus = "";
	}

	setEndGame=()=>{
		this.setState({gameStatus:null});
		this.gameGroup.visible = false;
		this.totalGroup.children.forEach(island => { island.visible = true; });
		this.transform.detach();
	}

	setStartTime=()=> {
		if (!this.state.gameStatus) return;
		setTimeout(() => {
			const remainTime = this.state.gameTime;
			if (remainTime <= 0) {
				this.setEndGame();
				this.props.callGameResult("timeOut", this.totalTime, this.state.gameTime, this.state.gamePro);
			}
			else {
				if		(remainTime > this.totalTime) { this.setState({gameStatus:"start"}); }
				else if (remainTime === this.totalTime) { this.startGame(); this.setState({gameStatus:"process"});}
				else if (remainTime > 0) {  }
				this.setState({gameTime:remainTime -1});
				this.setStartTime();
			}
		}, 1000);
	}

	startGame=()=>{
		this.gameMeshArr = [];
		var gameModel = this.gameGroup.children[this.gameNum];
		gameModel.children.forEach((child, idx) => {
			if (child.name !== gameModel.basicModel) this.gameMeshArr.push(child);
		});
		const dis = gameModel.areaDis, snapDis = gameModel.snapDis;
		this.transform.setTranslationSnap(snapDis)
		this.gameMeshArr.forEach(mesh => {
			const posX = Math.round(Math.random() * dis/snapDis) * snapDis - dis/2;
			const posZ = Math.round(Math.random() * dis/snapDis) * snapDis - dis/2;
			SetTween(mesh, "position", {x:posX, z:posZ}, easeTime);
			SetTween(mesh, "camPos", 0, easeTime);
		});
	}

	setAutoBuild=()=>{
		var childArr = this.gameGroup.children[this.gameNum].children;
		for (let i = 0; i < childArr.length; i++) {
			setTimeout(() => {
				const oriPos = childArr[i].oriPos;
				SetTween(childArr[i], "position", {x:oriPos.x, z:oriPos.z}, easeTime);
				SetTween(childArr[i], "camPos", oriPos.y, easeTime);
			}, i * easeTime / 2);
		}
		setTimeout(() => {
			this.setEndGame();
			this.props.callGameResult("autoBuild", this.totalTime, this.state.gameTime, this.state.gamePro);
		}, childArr.length * easeTime / 2 + 1000);
	}

	loadIslandModel=(info)=>{
		new FBXLoader().load(info.file, (object)=>{
			object.children.forEach(child => {
				if (info.islandName === "game") console.log(child.name)
				if (info.islandName === "game" && (child.name === "rect__FFFFFF" || child.name === "plane__000000") ) {child.visible = false;}
				if (child instanceof THREE.Mesh) {
					child.landChildName = info.islandName; this.meshArr.push(child);
					if (info.islandName === "game") child.receiveShadow = true;
				}
				if (child.name.indexOf("__") > -1) {
					const colVal = child.name.split("__")[1];
					child.material = new THREE.MeshPhongMaterial({color:"#"+colVal});
					if (info.islandName === "game") {
						if (child.name.indexOf("trans")>-1) this.gameIslandPlane = child;
						else if (child.name.indexOf("line")>-1) this.gameIslandLine = child;
					}
				}
				else if (child.name.indexOf("multi_mat") > -1) {
					child.material[0].color.setHex(0x775935);
					child.material[1].color.setHex(0xA78868);
					child.material[2].color.setHex(0x5C7725);
				}
			});
			var vSize = new THREE.Box3().setFromObject(object).getSize();
			var scl = info.size/vSize.x;
			if 		(info.islandName === "home0") { scl = 0.09; }
			else if (info.islandName === "home1") { scl = 0.09; }
			else if (info.islandName === "home2") { scl = 0.09; }
			// const scl = info.size/vSize.x;
			object.scale.set(scl, scl, scl);
			object.position.set(info.pos.x, info.pos.y, info.pos.z);
			object.islandName = info.islandName;
			this.totalGroup.add(object);
		});
	}

	init() {
		var self = this, backCol = 0x3D94CA;//0x6CB3C5;
		this.renderer = new THREE.WebGLRenderer({antialias:true, alpha:true});
		this.renderer.setSize(this.cWidth, this.cHeight);
		if (!document.getElementById("container")) return false;
		document.getElementById("container").appendChild(this.renderer.domElement);
		this.renderer.setClearColor(backCol, 1);
		this.renderer.shadowMap.enabled = true;
		this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

		this.camera = new THREE.PerspectiveCamera(60, this.cWidth / this.cHeight, 1, 500);
		this.camera.position.set(0, 1.5, 10);
		this.scene = new THREE.Scene(); this.scene.fog = new THREE.Fog(backCol, 0, 200);
		this.totalGroup = new THREE.Group(); this.scene.add(this.totalGroup); this.totalGroup.position.set(0, -5, -70);
		this.gameGroup = new THREE.Group(); this.scene.add(this.gameGroup); this.gameGroup.visible = false;

		this.controls = new OrbitControls(this.camera, this.renderer.domElement); this.controls.enablePan = false;
		this.controls.minDistance = 5; this.controls.maxDistance = 25; this.controls.maxPolarAngle = Math.PI/2;

        this.transform = new TransformControls( this.camera, this.renderer.domElement ); this.scene.add(this.transform);
        this.transform.setTranslationSnap(10);
        this.transform.setSize(0.8);
        this.transform.addEventListener( 'dragging-changed', function ( event ) { self.controls.enabled = ! event.value; } );

		const ambientLight = new THREE.AmbientLight( 0xFFFFFF, 0.3 ); this.scene.add( ambientLight );
		this.mainLight = new THREE.DirectionalLight( 0xFFFFFF, 1.5 ); this.scene.add( this.mainLight );
		this.mainLight.position.set(-50, 50, 50);
		this.mainLight.castShadow = true;
		modelArr.forEach(modelInfo => { this.loadIslandModel(modelInfo, this); });
		gameInfoArr.forEach(gameInfo => { LoadGameModel(gameInfo, this); });
	}

	animate () {
		if (!this.camera || !this.scene) return;
		requestAnimationFrame(this.animate);
		// AnimateRotate(this.windBaseArr, "y", 0.005, "wind");
		// AnimateRotate(this.carArr, "y", 0.005, "car");
		// AnimateReturn(this.cloudArr, "position", "x", 0.5);
		// AnimateReturn(this.tonArr, "rotation", "y", 0.01);
		this.camera.lookAt( 0, 0, 0 );
		this.renderer.render(this.scene, this.camera);
	}
	
	render() {
		return (
			<div className="home">
				<div id="container"></div>
				{this.state.gameStatus === "start" &&
					<div className="over-pan">
						<div className="modal-wrapper game-ready">
							<div className="title">Get ready ...</div>
							<div className="start-time">
								<div className="game-ready-label">{this.state.gameTime - this.totalTime}</div>
							</div>
						</div>
					</div>
				}
				{this.state.gameStatus === "process" &&
					<div className="process-time">
						<div className="label">{this.state.gameTime}</div>
					</div>
				}
			</div>
		)
	}
}
