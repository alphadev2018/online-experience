import React, { Component } from 'react';
import jQuery from 'jquery';
import * as THREE from 'three';
import {FBXLoader} from "three/examples/jsm/loaders/FBXLoader";
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';
import {TransformControls} from 'three/examples/jsm/controls/TransformControls';

import {modelArr, gameInfoArr, easeTime, gameReadyTime, SetTween, AnimateReturn, AnimateRotate, LoadGameModel, GotoIsland, GetRayCastObject, CheckGameModel, hotNameArr, GetStepInfo, CheckCrash, modalInfo} from "./common";
import '../assets/styles/home.css';
import '../assets/styles/overPan.css';

import undoImg from "../assets/images/undo.png";
import redoImg from "../assets/images/redo.png";
import {ReactComponent as TransMoveIcon} from "../assets/images/trans_move.svg";
import {ReactComponent as TransRotateIcon} from "../assets/images/trans_rotate.svg";

export default class Home extends Component {
	constructor(props) {
		super(props);
		this.cWidth = jQuery(window).width();  this.mouseX = 0;
		this.cHeight = jQuery(window).height();this.mouseY = 0;
		this.raycaster = new THREE.Raycaster(); this.mouse = new THREE.Vector2();
		this.animate = this.animate.bind(this);
		this.meshArr = []; this.selLandName = "";
		this.cloudArr = []; this.windBaseArr = []; this.ballonArr = []; this.tonArr = []; this.roundPlayArr = [];
		this.mouseStatus = "";
		this.state = { overModal:true, gameStatus:null, gameTime:-1, autoBuild:false, selHot:"", stepNum:-1, maxStepNum:-1, selTrans:"translate", crashModalId:false };
		this.gameMeshArr = []; this.gameIslandPlane = null; this.gameIslandLine = null;
		this.hotMeshArr = []; this.hotOverArr = []; this.stepArr = [];
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
			SetTween(this.camera, "position", {x:-10, y:this.camera.position.y, z:0}, easeTime);
			setTimeout(() => { this.controls.minDistance = 5; }, easeTime);
			this.gameGroup.visible = true;
			var gamePlaneTrans = false, gamePlaneCol = 0x0E5E1A, transRotCol = "#0000FF";
			if (nextProps.game === "gameMedium") { gamePlaneTrans = true; gamePlaneCol = 0x083D8A; transRotCol="#00FF00";}
			this.gameIslandPlane.material = new THREE.MeshPhongMaterial({transparent:gamePlaneTrans, opacity:0.7, color:gamePlaneCol});
			this.transform.children[0].children[1].children.forEach(child => {
				if (child instanceof THREE.Mesh) child.material = new THREE.MeshBasicMaterial({color:transRotCol, depthTest:false});
				else  child.material = new THREE.LineBasicMaterial({color:transRotCol, depthTest:false});
			});

			this.gameLevel = nextProps.game;
			const gameModelId = {gameEasy:"building", gameMedium:"bridge", gameDifficult:"stadium"};
			this.gameGroup.children.forEach((gameModel, idx) => {
				if (gameModelId[nextProps.game] === gameModel.gameId) {
					this.gameModel = gameModel;
					this.totalTime = gameModel.gameTime;
					gameModel.visible = true;
					gameModel.children.forEach(child => {
						child.position.set(child.oriPos.x, child.oriPos.y, child.oriPos.z);
						child.rotation.set(child.oriRot.x, child.oriRot.y, child.oriRot.z);
					});
				}
				else gameModel.visible = false;
			});
			
			this.setState({gameTime:this.totalTime+gameReadyTime, gameStatus:"start", gamePro:0}, ()=>{this.setStartTime();});
		}
		else if (this.state.gameStatus && !nextProps.game) {
			this.setEndGame();
		}
		if (this.state.autoBuild !== nextProps.autoBuild) {
			this.setState({autoBuild:nextProps.autoBuild});
			if (nextProps.autoBuild) this.setAutoBuild();
		}
		if (!this.state.gameAssist && nextProps.gameAssist) {
			this.setState({gameAssist:true});
			this.setAssist();
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
		const hotIntersect = GetRayCastObject(this, event.clientX, event.clientY, this.hotMeshArr);
		const intersect = GetRayCastObject(this, event.clientX, event.clientY, this.meshArr);
		if (hotIntersect) this.props.callHotSpot(intersect.object.hotStr);
		else if (intersect) {
			const landName = intersect.object.landChildName;
			if (landName !== this.selLandName) {
				if (landName !== "home" && this.selLandName !== "home") return;
				GotoIsland(this, landName);
				this.props.callMenuItem(landName);
			}
		}
	}

	mouseDown = (event) => {
		this.mouseStatus = "down";
		if (this.state.gameStatus !== "process") return;
	}

	mouseMove = (event) => {
		const intersect = GetRayCastObject(this, event.clientX, event.clientY, this.hotMeshArr);
		if (intersect) {
			const hotStr = intersect.object.hotStr;
			this.setHotMeshCol(this.hotMeshArr, hotStr, 0xFF8888, 0xFFFFFF);
			this.setHotMeshCol(this.hotOverArr, hotStr, 0xFFFF00, 0xFF0000);
			document.getElementById("container").style.cursor = "pointer";
		}
		else {
			this.setHotMeshCol(this.hotMeshArr, "", 0xFF8888, 0xFFFFFF);
			this.setHotMeshCol(this.hotOverArr, "", 0xFFFF00, 0xFF0000);
			document.getElementById("container").style.cursor = "default";
		}
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
		else { this.checkGameStatus(); }
		this.mouseStatus = "";
	}

	checkGameStatus = ()=>{
		const checkGamePro = CheckGameModel(this.gameMeshArr, this.gameLevel);
		this.setState({gamePro:checkGamePro});
		if (checkGamePro === 100) {
			this.props.callGameResult("success", this.totalTime, this.state.gameTime, checkGamePro);
		}
		else {
			const stepInfo = GetStepInfo(this.gameMeshArr, this.stepArr[this.state.stepNum]);
			if (stepInfo) {
				const newStepNum = this.state.stepNum + 1;
				this.stepArr[newStepNum] = stepInfo;
				this.setState({stepNum:newStepNum, maxStepNum:newStepNum});
				const checkCrash = CheckCrash(this.gameMeshArr, this.transform.object);
				this.setState({crashModalId:checkCrash});
				setTimeout(() => { this.setState({crashModalId:false}); }, 1000);
			}
		}
	}

	setStep=(delta)=>{
		const {stepNum, maxStepNum} = this.state;
		if ((stepNum <= 0 || stepNum <= maxStepNum - 5) && delta === -1) return;
		if (stepNum >= maxStepNum && delta === 1) return;
		const newStepNum = stepNum + delta;
		const stepInfo = this.stepArr[newStepNum];
		this.stepChange = true;
		this.transform.detach();
		this.gameMeshArr.forEach((mesh, idx) => {
			const posInfo = stepInfo[idx].pos;
			const rotInfo = stepInfo[idx].rot;
			SetTween(mesh, "position", {x:posInfo.x, y:posInfo.y, z:posInfo.z}, easeTime);
			SetTween(mesh, "rotation", {x:rotInfo.x, y:rotInfo.y, z:rotInfo.z}, easeTime, this.gameLevel);
		});
		setTimeout(() => { this.setState({stepNum:newStepNum}); this.stepChange = false; }, easeTime);
		
	}

	setHotMeshCol=(arr, str, overCol, noCol)=>{
		arr.forEach(mesh => {
			if (mesh.hotStr === str) mesh.material.color.setHex(overCol);
			else mesh.material.color.setHex(noCol);
		});
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
		this.gameModel.children.forEach((child, idx) => {
			if (child.name !== this.gameModel.basicModel) this.gameMeshArr.push(child);
		});
		const dis = this.gameModel.areaDis, snapDis = this.gameModel.snapDis;
		this.transform.setTranslationSnap(snapDis);
		this.gameMeshArr.forEach(mesh => {
			const posX = Math.round(Math.random() * dis/snapDis) * snapDis - dis/2;
			const posZ = Math.round(Math.random() * dis/snapDis) * snapDis - dis/2;
			const rotY = mesh.oriRot.y + Math.round(Math.random() * 2) * Math.PI/2;
			SetTween(mesh, "position", {x:posX, y:0, z:posZ}, easeTime);
			if (this.gameLevel === "gameMedium") SetTween(mesh, "rotation", {x:mesh.oriRot.x, y:mesh.oriRot.y, z:rotY}, easeTime);
			else 								 SetTween(mesh, "rotation", {x:mesh.oriRot.x, y:rotY, z:mesh.oriRot.z}, easeTime);
		});
		setTimeout(() => {
			const stepInfo = GetStepInfo(this.gameMeshArr, []);
			this.stepArr = [stepInfo];
			this.setState({stepNum:0, maxStepNum:0});
		}, easeTime * 2);
	}

	setTrans=(str)=>{
		this.setState({selTrans:str});
		this.transform.setMode( str );
		this.transform.showX = this.transform.showZ = (str === "translate")?true:false;
	}

	setAutoBuild=()=>{
		var childArr = this.gameModel.children;
		for (let i = 0; i < childArr.length; i++) {
			setTimeout(() => {
				const oriPos = childArr[i].oriPos, oriRot=childArr[i].oriRot;
				SetTween(childArr[i], "position", {x:oriPos.x, y:oriPos.y, z:oriPos.z}, easeTime);
				SetTween(childArr[i], "rotation", {x:oriRot.x, y:oriRot.y, z:oriRot.z}, easeTime);
			}, i * easeTime / 2);
		}
		setTimeout(() => {
			this.setEndGame();
			this.props.callGameResult("autoBuild", this.totalTime, this.state.gameTime, this.state.gamePro);
		}, childArr.length * easeTime / 2 + 1000);
	}

	setAssist=()=>{
		var diffMesh;
		this.gameMeshArr.forEach(mesh => {
			if (diffMesh) return;
			var pos = mesh.position, rot = mesh.rotation, checkDiff = false;
			["x", "y", "z"].forEach(axis => {
				if (Math.round(pos[axis]) !== Math.round(mesh.oriPos[axis]) ||
					Math.round(rot[axis] * 100) !== Math.round(mesh.oriRot[axis] * 100))
					diffMesh = mesh;
			});
		});
		if (diffMesh) {
			const oriPos = diffMesh.oriPos, oriRot=diffMesh.oriRot;
			SetTween(diffMesh, "position", {x:oriPos.x, y:oriPos.y, z:oriPos.z}, easeTime);
			SetTween(diffMesh, "rotation", {x:oriRot.x, y:oriRot.y, z:oriRot.z}, easeTime);
			setTimeout(() => { this.checkGameStatus(); this.setState({gameAssist:false}); }, easeTime);
		}
	}

	loadIslandModel=(info)=>{
		new FBXLoader().load(info.file, (object)=>{
			object.children.forEach(child => {
				if (child instanceof THREE.Mesh) {
					child.landChildName = info.islandName; this.meshArr.push(child);
					if (info.islandName === "game") child.receiveShadow = true;
				}
				if (child.name.indexOf("__") > -1) {
					const colVal = child.name.split("__")[1];
					child.material = new THREE.MeshPhongMaterial({color:"#"+colVal});
					if (child.name === "rect__FFFFFF" || child.name === "plane__000000") {child.visible = false;}
					if (colVal === "448888") {child.material.transparent = true; child.material.opacity = 0.7}
					if (info.islandName === "game") {
						if (child.name.indexOf("trans")>-1) this.gameIslandPlane = child;
						else if (child.name.indexOf("line")>-1) this.gameIslandLine = child;
					}
				}
				if		(child.name.indexOf("wind_group") > -1) this.windBaseArr.push(child);
				else if (child.name.indexOf("crane") > -1 || child.name.indexOf("cloud") > -1) {
					child.curVal = Math.round(Math.random() * 100);
					child.dir = (Math.random() > 0.5)? 1:-1;
					if (child.name.indexOf("cloud") > -1) this.cloudArr.push(child);
					else if (child.name.indexOf("crane") > -1) this.tonArr.push(child);
				}
				else if (child.name.indexOf("roundPlay") > -1) this.roundPlayArr.push(child);
				else if (child.name.indexOf("ballon") > -1) this.ballonArr.push(child);
				hotNameArr.forEach(str => {
					if (child.name === "hot_"+str+"_hover") {child.hotStr=str; this.hotOverArr.push(child);}
					else if (child.name === "hot_"+str) {child.hotStr=str; this.hotMeshArr.push(child);}
				});
			});
			var vSize = new THREE.Box3().setFromObject(object).getSize();
			var scl = info.size/vSize.x;
			if (info.islandName.indexOf("home") > -1) scl = 0.09;
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
        this.transform.setTranslationSnap(10); this.transform.setRotationSnap( THREE.MathUtils.degToRad( 90 ) );
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
		AnimateRotate(this.windBaseArr, "y", 0.005, "wind");
		AnimateRotate(this.roundPlayArr, "x", 0.005);
		AnimateReturn(this.cloudArr, "position", "x", 0.05);
		AnimateReturn(this.tonArr, "rotation", "y", 0.01);
		this.camera.lookAt( 0, 0, 0 );
		this.renderer.render(this.scene, this.camera);
	}
	
	render() {
		const {maxStepNum, stepNum, selTrans, gameStatus, gameTime, crashModalId} = this.state;
		return (
			<div className="home">
				<div id="container"></div>
				{gameStatus === "start" &&
					<div className="over-pan">
						<div className="modal-wrapper game-ready">
							<div className="title">Get ready ...</div>
							<div className="start-time">
								<div className="game-ready-label">{gameTime - this.totalTime}</div>
							</div>
						</div>
					</div>
				}
				{gameStatus === "process" &&
					<div>
						<div className="process-time">
							<div className="label">{gameTime}</div>
						</div>
						<div className="step">
							<div className={`step-item ${(stepNum<=0 || stepNum <= maxStepNum - 5)?"disable":""}`} onClick={()=>this.setStep(-1)}>
								<img src={undoImg}></img>
							</div>
							<div className={`step-item ${(stepNum>=maxStepNum)?"disable":""}`} onClick={()=>this.setStep(1)}>
								<img src={redoImg}></img>
							</div>
						</div>
						<div className="trans-option">
							<div className={`trans-item ${(selTrans==="translate")?"active":""}`} onClick={()=>this.setTrans("translate")}>
								<TransMoveIcon></TransMoveIcon>
							</div>
							<div className={`trans-item ${(selTrans==="rotate")?"active":""}`} onClick={()=>this.setTrans("rotate")}>
								<TransRotateIcon></TransRotateIcon>
							</div>
						</div>
						{crashModalId !== false &&
							<div className="clash-modal">
								<div className="clash-title">{modalInfo[crashModalId].title}</div>
								<div className="clash-des">{modalInfo[crashModalId].description}</div>
							</div>
						}
					</div>
				}
				<div id="test_hotspot"></div>
			</div>
		)
	}
}
