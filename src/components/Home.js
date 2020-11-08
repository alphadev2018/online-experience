import React, { Component } from 'react';
import jQuery from 'jquery';
import * as THREE from 'three';
import {FBXLoader} from "three/examples/jsm/loaders/FBXLoader";
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';
import {TransformControls} from 'three/examples/jsm/controls/TransformControls';

import {modelArr, gameInfoArr, easeTime, gameReadyTime, SetTween, AnimateReturn, AnimateRotate, AnimatePlane, GotoIsland, GetRayCastObject, CheckGameModel, GetStepInfo, CheckClash, modalInfo, CheckRoundVal, Get2DPos, controlsMin, controlsMax} from "./common";
import '../assets/styles/home.css';
import '../assets/styles/overPan.css';

import undoImg from "../assets/images/undo.png";
import redoImg from "../assets/images/redo.png";
import {ReactComponent as TransMoveIcon} from "../assets/images/trans_move.svg";
import {ReactComponent as TransRotateIcon} from "../assets/images/trans_rotate.svg";

import { products, capabilities, iconicBuildingInfo } from '@db/database';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import * as Actions from 'store/actions';

class Home extends Component {
	constructor(props) {
		super(props);
		this.cWidth = jQuery(window).width();  this.mouseX = 0;
		this.cHeight = jQuery(window).height();this.mouseY = 0;
		this.raycaster = new THREE.Raycaster(); this.mouse = new THREE.Vector2();
		this.animate = this.animate.bind(this);
		this.meshArr = []; this.selLandName = ""; this.mouseStatus = "";
		this.cloudArr = []; this.windBaseArr = []; this.ballonArr = []; this.tonArr = []; this.roundPlayArr = []; this.airPlaneArr = [];
		this.device = ( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) )?"mobile":"web";
		this.state = { overModal:true, gameStatus:null, gameTime:-1, selHot:"", stepNum:-1, maxStepNum:-1, selTrans:"translate", crashModalId:false, transMesh:null, transChange:false, mask_A_PosArr:[], mask_B_PosArr:[], hotPosArr:[], menuItem:"" };
		this.gameMeshArr = []; this.gameIslandPlane = null;
		this.hotMeshArr = []; this.stepArr = []; this.mask_A_Arr = []; this.mask_B_Arr = []; this.hotBuildingArr = [];
		this.totalModelCount = modelArr.length + gameInfoArr.length; this.loadModelNum = 0;
		this.transError = {clash:0, quality:0};
		this.mouseCapture = false;
		this.timer = null;
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
		window.addEventListener("touchend", this.touchEnd, false);
	}

	UNSAFE_componentWillReceiveProps(nextProps) {
		if (nextProps.menuItem !== "first" && this.selLandName !== nextProps.menuItem) {
			// if (this.totalModelCount > this.loadModelNum) return;
			if (this.selLandName === "") SetTween(this.scene.fog, "far", 50, easeTime);
			
			if (this.props.app.app.models.indexOf(nextProps.menuItem) === -1) {
				modelArr.map(model => {
					if (model.id !== nextProps.menuItem) return;
					this.loadIslandModel(model);
				})
			}
			GotoIsland(this, nextProps.menuItem);
			this.setState({menuItem:nextProps.menuItem});
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
			setTimeout(() => { this.controls.minDistance = controlsMin; }, easeTime);
			this.gameGroup.visible = true;
			var gamePlaneTrans = false, gamePlaneCol = 0x2ECE3A, transRotCol = "#0000FF";
			if (nextProps.game === "gameMedium") { gamePlaneTrans = true; gamePlaneCol = 0x083D8A; transRotCol="#00FF00";}
			this.gameIslandPlane.material.color.setHex(gamePlaneCol);
			this.gameIslandPlane.material.transparent = gamePlaneTrans;
			this.gameIslandPlane.material.opacity = 0.7;
			this.transform.children[0].children[1].children.forEach(child => {
				if (child instanceof THREE.Mesh) child.material = new THREE.MeshBasicMaterial({color:transRotCol, depthTest:false});
				else  child.material = new THREE.LineBasicMaterial({color:transRotCol, depthTest:false});
			});

			this.gameLevel = nextProps.game; 
			const gameModelId = {gameEasy:"building", gameMedium:"bridge", gameDifficult:"stadium"};
			this.gameGroup.children.forEach((gameModel, idx) => {
				if (gameModelId[nextProps.game] === gameModel.gameId) {
					this.gameModel = gameModel; this.rotAxis = gameModel.rotAxis;
					this.totalTime = gameModel.gameTime;
					gameModel.visible = true;
					gameModel.children.forEach(child => {
						child.position.set(child.oriPos.x, child.oriPos.y, child.oriPos.z);
						const rotAxis = (child.name.indexOf("light") > -1)?"z":this.rotAxis;
						child.rotation[rotAxis] = child.oriRot;
					});
				}
				else gameModel.visible = false;
			});
			this.setState({gameTime:this.totalTime+gameReadyTime, gameStatus:"start", gamePro:0}, ()=>{this.setStartTime();});
		}
		else if (this.state.gameStatus && !nextProps.game) { this.setEndGame(); }
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

	processClickEvent=(mouseX, mouseY, target)=>{
		if (this.state.overModal) return;
		if (this.state.gameStatus === "process") {
			if (target) {
				const item = jQuery(target).closest(".life-item ")[0];
				if (!this.autoBuild && !this.footerId && item) {
					this.footerId = jQuery(item).attr("id");
					var {gameTime} = this.state, panaltyTime = 0, delayTime = 2000;
					if 		(this.footerId === "footer_assist") {this.setAssist(); panaltyTime = 20; delayTime = 1000;}
					else if (this.footerId === "footer_auto") this.setAutoBuild();
					else if (this.footerId === "footer_design") { panaltyTime = 30;  delayTime = 3000;}
					this.setState({gameTime:gameTime - panaltyTime});
					setTimeout(() => { this.footerId = undefined; }, delayTime);
					console.log(this.footerId);
				}
			}
			return;
		}
		const intersect = GetRayCastObject(this, mouseX, mouseY, this.meshArr);
		if (intersect) {
			const landName = intersect.object.landChildName;
			if (landName !== this.selLandName) {
				GotoIsland(this, landName);
				this.props.callMenuItem(landName);
			}
			else if (intersect.object.name.indexOf("hot_building") > -1 || intersect.object.name.indexOf("Eco_City_Lighting_1_Balance_Arch_polySurface025") > -1) {
				this.setState({
					maskAShow: false,
					maskBShow: false
				})
				
				SetTween(this.camera, "camPos", 3, easeTime);
				// -5.53, 2.36, 7.08
				if (intersect.object.name === "hot_building_1") {
					SetTween(this.camera, "position", {x:-5.53, y: 2.36, z: 7.08}, easeTime);
				} else {
					SetTween(this.camera, "position", {x:-7.1, y: 1.7, z: 5.6}, easeTime);
				}

				setTimeout(() => {
					this.setState({
					maskAShow: intersect.object.name !== "hot_building_1", 
					maskBShow: intersect.object.name === "hot_building_1"
				}) }, 1000);
			}
		}
		// var hotInfo;
		// if (this.device === "web") hotInfo = this.state.selHot;
		// else {
		// 	const hotIntersect = GetRayCastObject(this, mouseX, mouseY, this.hotMeshArr);
		// 	hotInfo = (hotIntersect)?hotIntersect.object.name.substring(4):"";
		// }
		// this.props.callHotSpot(hotInfo, this.selLandName);
		const hotIntersect = GetRayCastObject(this, mouseX, mouseY, this.hotMeshArr);
		if (hotIntersect) {
			this.props.callHotSpot(hotIntersect.object.name, this.selLandName);
		}
	}

	touchEnd = (event) => { this.processClickEvent(event.changedTouches[0].pageX, event.changedTouches[0].pageY); }
	mouseClick = (event) => { this.processClickEvent(event.clientX, event.clientY, event.target); }

	mouseDown = (event) => {
		this.mouseStatus = "down";
		this.mouseCapture = true;
		if (this.state.gameStatus !== "process") return;
	}

	mouseMove = (event) => {
		if (this.mouseCapture) {
			if (this.state.maskAShow || this.state.maskBShow) {
				this.setState({maskAShow:false, maskBShow:false})
			}
		}
		this.mouseStatus = "move";
		if (this.selLandName === "media") {
			const intersect = GetRayCastObject(this, event.clientX, event.clientY, this.hotBuildingArr);
			
			this.hotBuildingArr.forEach(hotBuilding => {
				let buildingCol = 0xFFFFFF;
				if (intersect && hotBuilding.name === intersect.object.name) {
					buildingCol = 0xFF0000;
				}
				if (hotBuilding.material.length) {
					hotBuilding.material.forEach(mat => {
						mat.color.setHex(buildingCol);
					});
				}
				else hotBuilding.material.color.setHex(buildingCol);
			});
		}
		else {
			const intersect = GetRayCastObject(this, event.clientX, event.clientY, this.hotMeshArr);
			if (!intersect) {
				clearInterval(this.timer);
			}
			this.hotMeshArr.forEach(hotMesh => {
				if (intersect && hotMesh.name === intersect.object.name){
					clearInterval(this.timer);
					this.timer = setInterval( () => {
						this.startHotspotTween(hotMesh);
					}, 50);
				} else {
					hotMesh.material.color.setHex(0xFF0000);
				}
			});
		}
	}

	mouseUp = (event) => {
		this.mouseCapture = false;
		if (this.state.gameStatus !== "process") return;
		if ((typeof event.target.className === "string") && event.target.className.indexOf("mesh-control") > -1) return;
		if (this.mouseStatus === "down" && this.state.transChange === false) {
			const intersect = GetRayCastObject(this, event.clientX, event.clientY, this.gameMeshArr);
			if (intersect) { this.transform.attach(intersect.object); this.setState({transMesh:intersect.object});}
		}
		else { 
			const stepInfo = GetStepInfo(this.gameMeshArr, this.stepArr[this.state.stepNum]);
			if (stepInfo) {
				if (this.state.transMesh) this.setState({transChange:true});
				const newStepNum = this.state.stepNum + 1;
				this.stepArr[newStepNum] = stepInfo;
				this.setState({stepNum:newStepNum, maxStepNum:newStepNum});
			}
		}
		this.mouseStatus = "";
	}

	checkGameStatus () {
		const checkGamePro = CheckGameModel(this.gameMeshArr, this.gameLevel);
		this.setState({gamePro:checkGamePro});
		if (checkGamePro === 100) {
			const gameTime = (this.state.gameTime < 0)?0:this.state.gameTime
			this.props.callGameResult("success", this.totalTime, gameTime, checkGamePro, this.transError);
			this.setEndGame();
		}
		return checkGamePro;
	}

	startHotspotTween = (hotspot) => {
		let color = hotspot.material.color;
		if (color.getHex() >= 16777215) {
			clearInterval(this.timer);
			return;
		}
		hotspot.material.color.setRGB( color.r, color.g + 0.2, color.b + 0.2);
	}

	// setStep=(delta)=>{
	// 	const {stepNum, maxStepNum} = this.state;
	// 	if ((stepNum <= 0 || stepNum <= maxStepNum - 5) && delta === -1) return;
	// 	if (stepNum >= maxStepNum && delta === 1) return;
	// 	const newStepNum = stepNum + delta;
	// 	const stepInfo = this.stepArr[newStepNum];
	// 	this.stepChange = true;
	// 	this.transform.detach();
	// 	this.setState({transMesh:null});
	// 	this.gameMeshArr.forEach((mesh, idx) => {
	// 		const posInfo = stepInfo[idx].pos;
	// 		const rotInfo = stepInfo[idx].rot;
	// 		SetTween(mesh, "position", {x:posInfo.x, y:posInfo.y, z:posInfo.z}, easeTime);
	// 		SetTween(mesh, "rotation", {x:rotInfo.x, y:rotInfo.y, z:rotInfo.z}, easeTime, this.gameLevel);
	// 	});
	// 	setTimeout(() => { this.setState({stepNum:newStepNum}); this.stepChange = false; }, easeTime);
	// }

	setEndGame=()=>{
		this.setState({gameStatus:null, transMesh:null, transChange:false});
		this.gameGroup.visible = false;
		this.totalGroup.children.forEach(island => { island.visible = true; });
		this.transform.detach(); this.autoBuild = false; this.transError = {clash:0, quality:0};
	}

	setStartTime=()=> {
		if (!this.state.gameStatus) {this.props.callGameStatus(false); return;}
		setTimeout(() => {
			if (!this.state.gameStatus) { this.props.callGameStatus(false); return;}
			const remainTime = this.state.gameTime;
			if (remainTime <= 0) {
				this.props.callGameResult("timeOut", this.totalTime, this.state.gameTime, this.state.gamePro, this.transError);
				this.setEndGame();
			}
			else {
				if		(remainTime > this.totalTime) { this.setState({gameStatus:"start"}); }
				else if (remainTime === this.totalTime) { this.startGame(); this.setState({gameStatus:"process"}); this.props.callGameStatus(true)}
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
		const dis = this.gameModel.areaDis, snapDis = this.gameModel.snapDis, dAngle = Math.PI * 2/this.gameMeshArr.length, rIdx = Math.round(Math.random() * 6);
		this.transform.setTranslationSnap(snapDis);
		this.gameMeshArr.forEach((mesh, idx) => {
			const posX = Math.sin(dAngle * (idx+rIdx)) * dis/2;
			const posZ = Math.cos(dAngle * (idx+rIdx)) * dis/2;
			const rotY = Math.round(Math.random() * 1) * Math.PI/2;
			const rotAxis = (mesh.name.indexOf("light") > -1)?"z":this.rotAxis;
			SetTween(mesh, "position", {x:posX, y:0, z:posZ}, easeTime);
			SetTween(mesh, "rotation", {axis:rotAxis, rot:mesh.oriRot + rotY}, easeTime);
		});
		setTimeout(() => {
			const stepInfo = GetStepInfo(this.gameMeshArr, []);
			this.stepArr = [stepInfo];
			this.setState({stepNum:0, maxStepNum:0});
		}, easeTime * 2);
	}

	setRotate=(dir)=>{
		var mesh = this.transform.object;
		if (!mesh) return;
		const rotAxis = (mesh.name.indexOf("light") > -1)?"z":this.rotAxis;
		SetTween(mesh, "rotation", {axis:rotAxis, rot:mesh.rotation[rotAxis] + Math.PI/2*dir}, easeTime);
		setTimeout(() => {
			const {rRange} = mesh;
			// while (mesh.rotation[rAxis] >= rRange || mesh.rotation[rAxis] < -rRange) {
				if (mesh.rotation[rotAxis] >= rRange) mesh.rotation[rotAxis] -= rRange * 2;
				if (mesh.rotation[rotAxis] < -rRange) mesh.rotation[rotAxis] += rRange * 2;
			// }
		}, easeTime + 10);
		this.setState({transChange:true});
	}

	setTrans=(str)=>{
		this.setState({selTrans:str});
		this.transform.setMode( str );
		this.transform.showX = this.transform.showZ = (str === "translate")?true:false;
	}

	setAutoBuild=()=>{
		this.autoBuild = true;
		var childArr = this.gameModel.children;
		this.props.callGameStatus(false);
		for (let i = 0; i < childArr.length; i++) {
			setTimeout(() => {
				const oriPos = childArr[i].oriPos, rotAxis = (childArr[i].name.indexOf("light") > -1)?"z":this.rotAxis;
				SetTween(childArr[i], "position", {x:oriPos.x, y:oriPos.y, z:oriPos.z}, easeTime);
				SetTween(childArr[i], "rotation", {axis:rotAxis, rot:childArr[i].oriRot}, easeTime);
			}, i * easeTime / 2);
		}
		setTimeout(() => {
			console.log(this.transError)
			this.props.callGameResult("autoBuild", this.totalTime, 0, this.state.gamePro, this.transError);
			this.setEndGame();
			this.setState({autoBuild:false});
		}, childArr.length * easeTime / 2 + 500);
	}

	setPlace=()=>{
		if (!this.transform.object) return;
		if (this.checkGameStatus() === 100) return;
		const checkClashStatus = CheckClash(this.gameMeshArr, this.transform.object, this.gameLevel, this.rotAxis);
		if (checkClashStatus) {
			if (checkClashStatus === "clash") this.transError.clash++; else this.transError.quality++;
			console.log(this.transError);
			this.setState({crashModalId:checkClashStatus});
			setTimeout(() => { this.setState({crashModalId:false}); }, 3000);
		}
		this.transform.detach(); this.setState({transMesh:null, transChange:false});
	}

	setAssist=()=>{
		var diffMesh;
		this.gameMeshArr.forEach(mesh => {
			// if (diffMesh) return;
			const pos = mesh.position, rotAxis = (mesh.name.indexOf("light") > -1)?"z":this.rotAxis;
			["x", "y", "z"].forEach(axis => {
				if (CheckRoundVal(mesh.oriPos[axis], pos[axis]) === false) diffMesh = mesh;
			});
			if (CheckRoundVal(mesh.oriRot, mesh.rotation[rotAxis])  === false) {
				diffMesh = mesh;
			}
		});
		if (diffMesh) {
			const oriPos = diffMesh.oriPos, oriRot=diffMesh.oriRot;
			const rotAxis = (diffMesh.name.indexOf("light") > -1)?"z":this.rotAxis;
			this.transform.attach(diffMesh);
			this.props.callGameStatus(false);
			SetTween(diffMesh, "position", {x:oriPos.x, y:oriPos.y, z:oriPos.z}, easeTime);
			SetTween(diffMesh, "rotation", {axis:rotAxis, rot:diffMesh.oriRot}, easeTime);
			setTimeout(() => {
				this.transform.detach();
				this.checkGameStatus();
				this.setState({transMesh:null, transChange:false});
				this.props.callGameStatus(true);
			}, easeTime + 10);
		}
	}

	clickMask=(item)=>{
		this.props.callProduct( item );
		// this.setState({maskAShow:false, maskBShow:false});
	}

	loadIslandModel=(info)=>{
		new FBXLoader().load(info.file, (object)=>{
			object.children.forEach(child => {
				if (child instanceof THREE.Mesh) {
					child.landChildName = info.islandName; this.meshArr.push(child);
					if (info.islandName === "game" && child.name.indexOf("sea_trans") > -1) {child.receiveShadow = true; this.gameIslandPlane = child;}
					if (child.material.length) {
						child.material.forEach(mat => { mat.side = THREE.DoubleSide; });
					}
					else child.material.side=THREE.DoubleSide;
				}				
				if (child.name.indexOf("__") > -1) {
					const colVal = child.name.split("__")[1];
					child.material = new THREE.MeshPhongMaterial({color:"#"+colVal, side:2});
				}
				["Tube", "Tubea", "Array_1", "Array_2"].forEach(str => {
					if (child.name === str) child.visible = false;
				});
				if (child.name.indexOf("wind_group") > -1) this.windBaseArr.push(child);
				else if (child.name.indexOf("crane") > -1 || child.name.indexOf("cloud") > -1) {
					child.curVal = Math.round(Math.random() * 100);
					child.dir = (Math.random() > 0.5)? 1:-1;
					if (child.name.indexOf("cloud") > -1) {
						if 		(info.islandName === "home0") child.moveDis = 0.008;
						else if (info.islandName === "home1") child.moveDis = 0.7;
						else if (info.islandName === "home2") child.moveDis = 0.4;
						else if (info.islandName === "game") child.moveDis = 0.005;
						this.cloudArr.push(child);
					} //child['position']['y'] += 8; 
					else if (child.name.indexOf("crane") > -1) this.tonArr.push(child);
				}
				else if (child.name.indexOf("roundPlay") > -1) this.roundPlayArr.push(child);
				else if (child.name.indexOf("ballon") > -1) this.ballonArr.push(child);
				else if (child.name.indexOf("mask_0") > -1) {this.mask_A_Arr.push(child); child.visible = false;}
				else if (child.name.indexOf("mask_B") > -1) {this.mask_B_Arr.push(child); child.visible = false;}
				else if (child.name === "plane") {child.dir = 1; this.airPlaneArr.push(child);}
				else if (child.name.indexOf("hot_building") > -1 || child.name.indexOf("Eco_City_Lighting_1_Balance_Arch_polySurface025") > -1) {
					this.hotBuildingArr.push(child);
				}
				else if ( Object.keys(iconicBuildingInfo).indexOf(child.name) !== -1 ) this.hotMeshArr.push(child);
			});
			var vSize = new THREE.Box3().setFromObject(object).getSize();
			var scl = info.size/vSize.x;
			
			// if (info.islandName.indexOf("home") > -1) scl = 0.009;

			object.scale.set(scl, scl, scl);
			object.position.set(info.pos.x, info.pos.y, info.pos.z);
			object.islandName = info.islandName;
			this.totalGroup.add(object);
			this.addLoadModelNum();			
			this.props.loadModel(info.id);
		}, undefined, ( error )=> { console.error( error ); this.addLoadModelNum(); } );
	}
	addLoadModelNum=()=>{
		this.loadModelNum++;
		this.props.callAddLoadNum(this.totalModelCount, this.loadModelNum);
	};

	// addSubModels=(parent, subFile)=>{
	// 	new FBXLoader().load(subFile, (object)=>{
	// 		console.log(object);
	// 		var vSize = new THREE.Box3().setFromObject(object).getSize();
	// 		console.log(vSize);
	// 		// const scl = 15/vSize.x;
	// 		// object.scale.set(scl, scl, scl);
	// 		// parent.add(object);
	// 		object.children.forEach(child => {
	// 			var scl, pos;
	// 			if 		(child.name === "roundPlay_1") {scl = 4; pos={x:-240, y:120, z:-35}}
	// 			else if (child.name === "wind_group001"){scl = 0.7; pos={x:300, y:45, z:-15}}
	// 			else if (child.name === "wind_group002"){scl = 0.7; pos={x:-50, y:45, z:350}}
	// 			child.scale.set(scl, scl, scl);
	// 			child.position.set(pos.x, pos.y, pos.z);
	// 			// child.material = new THREE.MeshPhongMaterial({color:0xFF0000, side:2});
	// 			parent.add(child);
	// 		});
	// 		console.log(parent);
	// 	});
	// }

	loadGameModel(info) {
		new FBXLoader().load(info.file, (object)=>{
			const roundDelta = (info.id === "building")?10:1;
			switch (info.id) {
				case "building":object.rotAxis = "y"; break;
				case "bridge":	object.rotAxis = "z"; break;
				case "stadium":	object.rotAxis = "y"; break;
				default: 		object.rotAxis = "y";  break;
			}
			object.children.forEach(child => {
				const rotAxis = (child.name.indexOf("light") > -1)?"z":object.rotAxis;
				["x", "y", "z"].forEach(axis => {
					child.position[axis] = Math.round(child.position[axis] * roundDelta) / roundDelta;
				});
				if (info.id === "building") {
					child.rRange = Math.PI / 2;
					if (child.name !== "Basic") child.rotation.y = Math.PI/-6;
				}
				else if (info.id === "bridge") {
					child.rRange = Math.PI / 2; child.rotation.z = 0;
				}
				else if (info.id === "stadium") {
					child.rRange = Math.PI / 2;
					if 		(child.name === "display") {child.rotation.y = Math.PI / -2; child.rRange = Math.PI;}
					else if (child.name === "gate") {child.rRange = Math.PI;}
					else if (child.name === "floor_0" || child.name === "floor_2") {child.rRange = Math.PI;}
					else if (child.name.indexOf("light") > -1) {
						child.rRange = Math.PI;
						if		(child.name === "light_000") {child.rotation.z = Math.PI / -4; }
						else if (child.name === "light_001") {child.rotation.z = Math.PI / 4; }
						else if (child.name === "light_002") {child.rotation.z = Math.PI * 3 / 4;}
						else if (child.name === "light_003") {child.rotation.z = Math.PI * 3 /-4;}
					}
				}
				const childPos = child.position, childRot = child.rotation[rotAxis];
				child.oriPos = {x:Math.round(childPos.x * 10) / 10, y:Math.round(childPos.y * 10) / 10, z: Math.round(childPos.z * 10) / 10};
				child.position.set(child.oriPos.x, child.oriPos.y, child.oriPos.z);
				child.oriRot = childRot;
				// child.geometry = new THREE.Geometry().fromBufferGeometry( child.geometry );
				child.castShadow = true;
				child.receiveShadow = true;
				
				if (child.material.length) {
					child.material.forEach(mat => { mat.side = THREE.DoubleSide; });
				}
				else child.material.side = THREE.DoubleSide;
				if (child.name.indexOf("__") > -1) {
					const colVal = child.name.split("__")[1];
					child.material = new THREE.MeshPhongMaterial({color:"#"+colVal});
				}
			});
			var vSize = new THREE.Box3().setFromObject(object).getSize();
			const scl = info.size/vSize.y;
			object.scale.set(scl, scl, scl);
			// object.position.set(info.pos.x, info.pos.y, info.pos.z);
			object.gameId = info.id;
			object.gameTime = info.time;
			object.basicModel = info.basicName;
			object.areaDis = 8 / scl;
			object.snapDis = info.snapDis;
			this.gameGroup.add(object);
			this.addLoadModelNum();
		}, undefined, ( error ) =>{ console.error( error ); this.addLoadModelNum();});
	}

	init() {
		var self = this, backCol = 0x3D94CA;//0x6CB3C5;
		this.renderer = new THREE.WebGLRenderer({antialias:true, alpha:true});
		this.renderer.setSize(this.cWidth, this.cHeight);
		if (!document.getElementById("container")) return false;
		document.getElementById("container").appendChild(this.renderer.domElement);
		this.renderer.setClearColor(backCol, 1);
		this.renderer.shadowMap.enabled = (this.device === "web")?true:false;
		this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

		this.camera = new THREE.PerspectiveCamera(60, this.cWidth / this.cHeight, 1, 500);
		this.camera.position.set(0, 1.5, 10);
		if (this.device === "mobile") this.camera.position.set(0, 3, 20);
		this.scene = new THREE.Scene(); this.scene.fog = new THREE.Fog(backCol, 0, 200);
		this.totalGroup = new THREE.Group(); this.scene.add(this.totalGroup); this.totalGroup.position.set(0, -5, -70);
		this.gameGroup = new THREE.Group(); this.scene.add(this.gameGroup); this.gameGroup.visible = false;

		this.controls = new OrbitControls(this.camera, this.renderer.domElement); this.controls.enablePan = false;
		this.controls.minDistance = controlsMin; this.controls.maxDistance = controlsMax; this.controls.maxPolarAngle = Math.PI/2;

        this.transform = new TransformControls( this.camera, this.renderer.domElement ); this.scene.add(this.transform);
        this.transform.setTranslationSnap(10); this.transform.setRotationSnap( THREE.MathUtils.degToRad( 90 ) );
        this.transform.setSize(0.8);
		this.transform.addEventListener( 'dragging-changed', function ( event ) { self.controls.enabled = ! event.value; } );

		const ambientLight = new THREE.AmbientLight( 0xFFFFFF, 0.4 ); this.scene.add( ambientLight );
		this.mainLight = new THREE.DirectionalLight( 0x9E9E9E, 1.0 ); this.scene.add( this.mainLight );
		// this.mainLight = new THREE.DirectionalLight( 0xFFFFFF, 1.0 ); this.scene.add( this.mainLight );
		this.mainLight.position.set(-50, 50, 50); this.mainLight.castShadow = true;

		this.subLight = new THREE.DirectionalLight( 0xFFFFFF, 0.5 ); this.scene.add( this.subLight );
		// this.loadIslandModel(modelArr[0])
		modelArr.forEach(modelInfo => { this.loadIslandModel(modelInfo); });
		gameInfoArr.forEach(gameInfo => { this.loadGameModel(gameInfo); });
	}

	animate () {
		if (!this.camera || !this.scene) return;
		
		requestAnimationFrame(this.animate);

		AnimateRotate(this.windBaseArr, "y", 0.005, "wind");
		AnimateRotate(this.roundPlayArr, "x", 0.005);
		AnimateReturn(this.cloudArr, "position", "x", 0.01);
		AnimateReturn(this.tonArr, "rotation", "y", 0.01);
		AnimatePlane(this.airPlaneArr);
		this.camera.lookAt( 0, 0, 0 );
		const camPos = this.camera.position;
		this.subLight.position.set(camPos.x, camPos.y, camPos.z);
		if (this.selLandName === "media") {
			var mask_A_PosArr = [], mask_B_PosArr = [];
			this.mask_A_Arr.forEach((mask_A_Mesh, idx) => {
				mask_A_PosArr[idx] = Get2DPos(mask_A_Mesh, this.cWidth, this.cHeight, this.camera);
			});
			this.mask_B_Arr.forEach((mask_B_Mesh, idx) => {
				mask_B_PosArr[idx] = Get2DPos(mask_B_Mesh, this.cWidth, this.cHeight, this.camera);
			});
			this.setState({mask_A_PosArr, mask_B_PosArr});
			// const controlAngle = this.controls.getAzimuthalAngle();
			// const maskAShow = (controlAngle < 0 );
			// const maskBShow = (controlAngle > -2.3 && controlAngle < 0.7);
			// this.setState({maskAShow, maskBShow});
		}
		// var hotPosArr = [];
		// this.hotMeshArr.forEach((hotMesh, idx) => {
		// 	hotPosArr[idx] = Get2DPos(hotMesh, this.cWidth, this.cHeight, this.camera);
		// 	hotPosArr[idx].islandName = hotMesh.islandName;
		// 	hotPosArr[idx].hotName = hotMesh.hotName;
		// });
		// this.setState({hotPosArr});
		this.renderer.render(this.scene, this.camera);
	}
	
	render() {
		const {maxStepNum, stepNum, selTrans, gameStatus, gameTime, crashModalId, transMesh, transChange, mask_A_PosArr, mask_B_PosArr, hotPosArr, menuItem, maskAShow, maskBShow} = this.state;
		const rotateClassStr=(transMesh)?"":"disable", placeClassStr=(transChange)?"":"disable";
		return (
			<div className="home">
				<div id="container"></div>
				{gameStatus === "start" &&
					<div className="game-ready">
						<div className="start-time">
							<div className="game-ready-label">{gameTime - this.totalTime}</div>
						</div>
					</div>
				}
				{gameStatus === "process" &&
					<div>
						<div className="process-time">
							<div className="label">{gameTime}</div>
						</div>
						{/* <div className="step">
							<div className={`step-item ${(stepNum<=0 || stepNum <= maxStepNum - 5)?"disable":""}`} onClick={()=>this.setStep(-1)}>
								<img src={undoImg}></img>
							</div>
							<div className={`step-item ${(stepNum>=maxStepNum)?"disable":""}`} onClick={()=>this.setStep(1)}>
								<img src={redoImg}></img>
							</div>
						</div> */}

						<div className="rotate-wrapper">
							<div className={`rotate-item ${rotateClassStr}`} onClick={()=>this.setRotate(-1)}>
								<img className="mesh-control rotate-img" src={undoImg}></img>
							</div>
							<div className={`rotate-item  ${rotateClassStr}`} onClick={()=>this.setRotate(1)}>
								<img className="mesh-control rotate-img" src={redoImg}></img>
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
						<div className={"mesh-control set-place "+placeClassStr} onClick={this.setPlace}>Place</div>
					</div>
				}
				{/*hotPosArr.map((pos, idx) =>
					<div className={`hot-item ${(pos.islandName===menuItem)?"show":""}`} key={idx} style={{left:pos.x, top:pos.y}} onClick={()=>this.props.callHotSpot(pos.hotName)}></div>
				)*/}
				{ this.selLandName === "media" &&
					<div>
						{mask_A_PosArr.map((pos, idx) =>
							<div className={`mask-item ${maskAShow?'fade-in':''}`} key={idx} style={{left:pos.x, top:pos.y}} onClick={()=>this.clickMask(capabilities[mask_A_PosArr.length - idx - 1])}>
								<div className={`item-icon ${idx < 7 ? 'left':'right'}`} data-detail={capabilities[mask_A_PosArr.length - idx - 1].title}>
									{ capabilities[mask_A_PosArr.length - idx - 1].icon ? 
										<img src={capabilities[mask_A_PosArr.length - idx - 1].icon} /> :
										<i className="fa fa-dot-circle-o" aria-hidden="true"></i>
									}									
								</div>
							</div>
						)}
						{mask_B_PosArr.map((pos, idx) =>
							<div className={`mask-item ${maskBShow?'fade-in':''}`} key={idx} style={{left:pos.x, top:pos.y}} onClick={()=>this.clickMask(products[mask_B_PosArr.length - idx - 1])}>
								<div className={`item-icon ${[0,1,2,3,8].indexOf(idx) !== -1 ? 'left':'right'}`} data-detail={products[mask_B_PosArr.length - idx - 1].title}>
									{ products[mask_B_PosArr.length - idx - 1].icon ? 
										<img src={products[mask_B_PosArr.length - idx - 1].icon} /> :
										<i className="fa fa-dot-circle-o" aria-hidden="true"></i>
									}
								</div>
							</div>
						)}
					</div>
				}
				<div id="test_hotspot"></div>
			</div>
		)
	}
}

function mapDispatchToProps(dispatch)
{
    return bindActionCreators({
		loadModel: Actions.loadModel
    }, dispatch);
}

function mapStateToProps(props)
{
    return {
        app:       props.app
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);