
import * as THREE from 'three';
import {FBXLoader} from "three/examples/jsm/loaders/FBXLoader";
import {Tween, autoPlay, Easing} from "es6-tween";

// import hotImgEMEA from "../assets/images/hot_EMEA.png";
// import hotImgACPA from "../assets/images/hot_ACPA.png";
// import hotImgAMERICA from "../assets/images/hot_AMERICA.png";

// const island0 = require("assets/models/island_0.fbx");
const islandHome0 = require("assets/models/EMEA_custom.fbx");//  _test building
const islandHome1 = require("assets/models/APAC.fbx"); // _custom _test
const islandHome2 = require("assets/models/AMERACAS.fbx"); //_custom_test
const islandGame = require("assets/models/island_game.fbx");
const islandMedia = require("assets/models/island_media.fbx");
// const islandHome0Sub = require("assets/models/EMEA_sub.fbx");
// const island3 = require("assets/models/island_3.fbx");

const gameModelCrane = require("assets/models/crane.fbx");
const gameModelBuilding = require("assets/models/building.fbx");
const gameModelBridge = require("assets/models/bridge.fbx");
const gameModelStadium = require("assets/models/stadium.fbx");

// export const hotNameArr = ["EMEA", "EMEA_other", "AMERICA", "ACPA", "AMERICA_other"];

autoPlay(true);

export const easeTime = 1000, gameReadyTime = 5, controlsMin = 8.5, controlsMax = 30;
export const menuHomeArr=[
	{label:"home0", value:"home0", label:"EMEA Island"},
	{label:"home1", value:"home1", label:"APAC Island"},
	{label:"home2", value:"home2", label:"AMER Island"}
];
export const menuArr = [
	{label:"Media", 	value:"media", label:"Product Island"},
	{label:"Game", 		value:"game", label:"Game Island"},
	{label:"Map", 		value:"map", label:"Plan View"},
	{label:"Conductive",value:"conductive", label:"Back to AU Construction"}
];
export const modelArr = [
	{id: "home0", file:islandHome0, size:10, pos:{x: 20, y:0, z: 20}, islandName:menuHomeArr[0].value}, //, subFile:islandHome0Sub
	{id: "home1", file:islandHome1, size:13, pos:{x:-20, y:0, z: 20}, islandName:menuHomeArr[1].value},
	{id: "home2", file:islandHome2, size:13, pos:{x:  0, y:0, z:-30}, islandName:menuHomeArr[2].value},
	{id: "game", file:islandGame,  size:11, pos:{x: 25, y:0, z:-25}, islandName:menuArr[1].value},
	{id: "media", file:islandMedia, size:13, pos:{x:-45, y:0, z:-25}, islandName:menuArr[0].value},
	// {file:island3,     size:15, pos:{x:  0, y:0, z: 35}, islandName:menuArr[1].value},
];
export const gameInfoArr = [
	{id:"building", file:gameModelBuilding, size:5, time:500, basicName:"Basic", snapDis:4.6},
	{id:"bridge", file:gameModelBridge, size:2, time:500, basicName:"Support_000", snapDis:3},
	{id:"stadium", file:gameModelStadium, size:1.6, time:500, basicName:"ground", snapDis:1}
];

export function SetTween (obj, attr, info, easeTime) {
	var tweenData = {};
	//  Linear.None Quadratic, Cubic, Quartic, Quintic, Sinusoidal, Exponential, Circular, Elastic, Back, Bounce
   	// .repeat(Infinity)  .yoyo(true)
	const easeType = Easing.Cubic.InOut; //, Easing.Quadratic.Out
	if (attr === "rotation") {
		if 		(info.axis === "y") tweenData = {"y":info.rot};
		else if (info.axis === "z") tweenData = {"z":info.rot};
		new Tween(obj.rotation).to( tweenData , easeTime ).easing(easeType).start();
	}
	else {
		if      (attr === "scale")    tweenData = {'scale.x': info, 'scale.y': info};
		else if (attr === "camPos")   tweenData = {'position.y':info };
		else if (attr === "far")      tweenData = {'far': info };
		else if (attr === "color")    tweenData = {'r': info.r, 'g':info.g, 'b':info.b };
		else if (attr === "position") tweenData = {'position.x':info.x, 'position.y':info.y, 'position.z':info.z };
		new Tween(obj).to( tweenData , easeTime ).easing(easeType).start();
	}
}

export function AnimateRotate(arr, axis, value, type) {
	arr.forEach(modelItem => {
		modelItem.rotation[axis] += value;
		if (type === "wind") modelItem.children[0].rotation.z += 0.03;
	});
}

export function AnimateReturn(arr, type, axis, value) {
	arr.forEach(modelItem => {
		var moveDis = modelItem.moveDis?modelItem.moveDis:value;
		modelItem.curVal += modelItem.dir;
		modelItem[type][axis] += modelItem.dir * moveDis;
		// if (modelItem.parent.islandName === 'home0' && !modelItem.name.indexOf('cloud')) {
		// 	modelItem[type]['z'] += modelItem.dir * value * 3;
		// }
		if 		(modelItem.curVal >= 100) modelItem.dir = -1;
		else if (modelItem.curVal <= 0) modelItem.dir = 1;
	});
}

export function AnimatePlane(arr) {
	arr.forEach(item => {
		var posDelta = 0.05, maxDis = 30;
		// if (item.landChildName === "media") {posDelta = 0.05; maxDis = 30;}
		item.position.x += posDelta * item.dir;
		if (item.position.x >= maxDis) {item.dir = -1; item.rotation.y = Math.PI/-2;}
		if (item.position.x <= -maxDis) {item.dir = 1;item.rotation.y = Math.PI/2;}
		item.children[0].rotation.y += 0.18;
	});
}

export function LoadIslandModel(info, self) {
	new FBXLoader().load(info.file, async function (object){
		object.traverse(function(child) {
			if (info.islandName === "game" && child.name === "rect__FFFFFF") {child.visible = false;}
			if (child.name.indexOf("wind_basic") > -1) self.windBaseArr.push(child);
			else if (child.name.indexOf("car") > -1) self.carArr.push(child);
			else if(child.name.indexOf("ton") > -1 || child.name.indexOf("cloud") > -1) {
				child.curVal = Math.round(Math.random() * 100);
				child.dir = (Math.random() > 0.5)? 1:-1;
				if (child.name.indexOf("cloud") > -1) self.cloudArr.push(child);
				else if (child.name.indexOf("ton") > -1) self.tonArr.push(child);
			}
			if (child instanceof THREE.Mesh) {
				child.landChildName = info.islandName; self.meshArr.push(child);
			}
			if (child.name.indexOf("__") > -1) {
				const colVal = child.name.split("__")[1];
				child.material = new THREE.MeshPhongMaterial({color:"#"+colVal});
				if (child.name.indexOf("trans")>-1) {
					child.material.transparent=true; child.material.opacity=0.7;
				}
			}
		});
		var vSize = await new THREE.Box3().setFromObject(object).getSize();
		const scl = (info.islandName === "home1")?0.003:info.size/vSize.x;
		// const scl = info.size/vSize.x;
		object.scale.set(scl, scl, scl);
		object.position.set(info.pos.x, info.pos.y, info.pos.z);
		object.islandName = info.islandName;
		self.totalGroup.add(object);
	}, undefined, function ( error ) { console.error( error ); });
}

export function isIOS() {
	return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || /iPad|iPhone|iPod/.test(navigator.platform) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
}

export function GotoIsland(self, str) {
	window.analytics(str);
	
	self.controls.enabled = false;
	modelArr.forEach(islandItem => {
		if (islandItem.islandName === str) {
			const landPos = islandItem.pos;
			SetTween(self.totalGroup, "position", {x:landPos.x * -1, z:landPos.z * -1}, easeTime);
			SetTween(self.totalGroup, "camPos", 0, easeTime);
			if (str === "media") {
				SetTween(self.camera, "position", {x:-7.1, y: 1.7, z: 12.6}, easeTime);
			} else {
				SetTween(self.camera, "camPos", 3, easeTime);
			}
		}
	});
	if (str === "map") {
		self.controls.maxDistance = 120;
		SetTween(self.totalGroup, "position", {x:0, z:0}, easeTime);
		SetTween(self.camera, "camPos", 90, easeTime);
		SetTween(self.scene.fog, "far", 500, easeTime);
		setTimeout(() => {
			self.controls.minDistance = 80;
			self.controls.maxPolarAngle = 0.2;
		}, easeTime);
	}
	else if (self.selLandName === "map") {
		self.controls.minDistance = controlsMin;
		SetTween(self.camera, "camPos", 3, easeTime);
		SetTween(self.camera, "position", {x:0, z:10}, easeTime);
		SetTween(self.scene.fog, "far", 50, easeTime);
		setTimeout(() => {
			self.controls.maxDistance = 25;
			self.controls.maxPolarAngle = Math.PI/2;
		}, easeTime);
	}
	self.selLandName = str;
	setTimeout(() => { self.controls.enabled = true; }, easeTime);
}

export function GetRayCastObject(self, mouseX, mouseY, meshArr) {
	self.mouse.x = ( mouseX / self.cWidth ) * 2 - 1;
	self.mouse.y = - ( mouseY / self.cHeight ) * 2 + 1;

	self.raycaster.setFromCamera( self.mouse, self.camera );
	return self.raycaster.intersectObjects( meshArr )[0];
}

export function CheckGameModel(children, level) {
	var remainCount = 0; // children = model.children, 
	if (level === "gameMedium") {
		var keyArr = [{name:"Road", y:3}, {name:"Support", y:0}, {name:"Line", y:3}], posZArr=[-12, 0, 12];
		posZArr.forEach(posZ => {
			keyArr.forEach(key => {
				var subCheckVal = false;
				children.forEach(child => {
					if (child.name.indexOf(key.name) > -1) {
						const {x, y, z} = child.position;
						if (Math.round(x) === 0 && Math.round(y) === key.y && Math.round(z) === posZ && CheckRoundVal(child.rotation.z, 0)) subCheckVal = true;
					}
				});
				if (subCheckVal === false) remainCount++;
			});
		});
		remainCount--;
	}
	else if (level === "gameEasy") {
		children.forEach(item => {
			const oriPos = item.oriPos, oriRot = item.oriRot, curPos = item.position, curRot = item.rotation.y;
			var subCheckVal = true;
			["x", "y", "z"].forEach(axis => {
				if (CheckRoundVal(oriPos[axis], curPos[axis]) === false) subCheckVal = false;
			});
			if (CheckRoundVal(oriRot, curRot) === false) subCheckVal = false;
			if (subCheckVal === false) { remainCount++; }
		});
	}
	else if (level === "gameDifficult") {
		children.forEach(item => {
			const oriPos = item.oriPos, oriRot = item.oriRot, curPos = item.position, curRot = item.rotation.y;
			if (item.name.indexOf("light") > -1) {
				var lightCheck = false;
				lightArr.forEach(lightItem => {
					if (curPos.x === lightItem.posX && curPos.z === lightItem.posZ && CheckRoundVal(lightItem.rot, item.rotation.z) === true)
						lightCheck = true;
				});
				if (lightCheck === false) remainCount++;
			}
			else {
				var subCheckVal = true;
				["x", "y", "z"].forEach(axis => {
					if (CheckRoundVal(oriPos[axis], curPos[axis]) === false) subCheckVal = false;
				});
				if (CheckRoundVal(oriRot, curRot) === false) subCheckVal = false;
				if (subCheckVal === false) { remainCount++; }
			}
		});
	}
	return 100 - Math.round(remainCount / children.length * 100);
}

// export const hotModalInfo={
// 	ACPA:{
// 		title:"ACPA hot modal title",
// 		content:"ACPA hot modal title",
// 		img:hotImgACPA
// 	},
// 	EMEA:{
// 		title:"EMEA hot modal title",
// 		content:"EMEA hot modal content",
// 		img:hotImgEMEA
// 	},
// 	EMEA_other:{
// 		title:"EMEA hot modal title",
// 		content:"EMEA hot modal content",
// 		img:hotImgEMEA
// 	},
// 	AMERICA:{
// 		title:"AMERICA hot modal title",
// 		content:"AMERICA hot modal content",
// 		img:hotImgAMERICA
// 	},
// 	AMERICA_other:{
// 		title:"AMERICA_other hot modal title",
// 		content:"AMERICA_other hot modal content",
// 		img:hotImgAMERICA
// 	}
// }

export function GetStepInfo(newArr, oldArr) {
	var stepInfo = [], checkDiff = false;
	newArr.forEach((newMesh, idx) => {
		const oldMesh = (oldArr && oldArr[idx])?oldArr[idx]:null;
		const newPos = newMesh.position, newRot = newMesh.rotation;
		if (oldMesh) {
			["x", "y", "z"].forEach(axis => {
				if (Math.round(newPos[axis]) !== Math.round(oldMesh.pos[axis])) checkDiff = true;
				if (Math.round(newRot[axis] * 10) !== Math.round(oldMesh.rot[axis] * 10)) checkDiff = true;
			});
		}
		else checkDiff = true;
		stepInfo[idx] = {pos:{x:newPos.x, y:newPos.y, z:newPos.z},
						 rot:{x:newRot.x, y:newRot.y, z:newRot.z}};
	});
	return (checkDiff === true)?stepInfo:false;
}

export function CheckClash(meshArr, selMesh, level, rotAxis) {
	const roundDelta = (level === "gameEasy")?10:1;
	["x", "y", "z"].forEach(axis => {
		selMesh.position[axis] = Math.round(selMesh.position[axis] * roundDelta) / roundDelta;
	});

	var clash = false, checkPosRot = true;
	const selMeshPos = selMesh.position;
	["x", "y", "z"].forEach(axis => {
		if (selMeshPos[axis] !== selMesh.oriPos[axis]) checkPosRot = false;
	});
	// console.log(selMeshPos, selMesh.oriPos);
	var selRotAxis = (selMesh.name.indexOf("light") > -1)?"z":rotAxis;
	if (CheckRoundVal(selMesh.rotation[selRotAxis], selMesh.oriRot) === false) checkPosRot = false;
	// console.log(checkPosRot);
	// console.log(selMesh.rotation[rotAxis], selMesh.oriRot);
	if (checkPosRot === true) return false;

	if (level === "gameEasy") {

	}
	else if (level === "gameMedium") {
		var keyArr = [{name:"Road", y:3}, {name:"Support", y:0}, {name:"Line", y:3}], posZArr=[-12, 0, 12];
		const {x, y, z} = selMesh.position;
		var subCheckVal = true;
		posZArr.forEach(posZ => {
			keyArr.forEach(key => {
				if (selMesh.name.indexOf(key.name) > -1) {
					if (Math.round(x) === 0 && Math.round(y) === key.y && Math.round(z) === posZ && CheckRoundVal(selMesh.rotation.z, 0)) subCheckVal = false;
				}
			});
		});
		if (subCheckVal === false) return false;
	}
	else if (level === "gameDifficult") {
		if (selMesh.name.indexOf("light") > -1) {
			const curPos = selMesh.position, curRot = selMesh.rotation.y;
			var lightCheck = false;
			console.log(selMesh);
			lightArr.forEach(lightItem => {
				if (curPos.x === lightItem.posX && curPos.z === lightItem.posZ) {
					console.log(lightItem.rot );
					console.log(selMesh.rotation.z);
					console.log(CheckRoundVal(lightItem.rot, selMesh.rotation.z));
				}
					
				if (curPos.x === lightItem.posX && curPos.z === lightItem.posZ && CheckRoundVal(lightItem.rot, selMesh.rotation.z) === true)
					lightCheck = true;
			});
			if (lightCheck === true) {console.log(lightCheck); return false;}
		}
	}

	// var originPoint = selMesh.position.clone();
	// var overMeshArr = [];
	// meshArr.forEach(mesh => {
	// 	if (mesh.name !== selMesh.name) overMeshArr.push(mesh);
	// });

	// for (var i = 0; i < selMesh.geometry.vertices.length; i++) {		
	// 	var localVertex = selMesh.geometry.vertices[i].clone();
	// 	var globalVertex = localVertex.applyMatrix4( selMesh.matrix );
	// 	var directionVector = globalVertex.sub( selMesh.position );
		
	// 	var ray = new THREE.Raycaster( originPoint, directionVector.clone().normalize() );
	// 	var collisionResults = ray.intersectObjects( overMeshArr );
	// 	if ( collisionResults.length > 0 && collisionResults[0].distance < directionVector.length() ) {
	// 		console.log("clash");
	// 		clash = true;
	// 	}
	// }


	const selVPos = GetMeshArea(selMesh);
	var ePosArr = [];
	for (let xPos = selVPos.min.x; xPos <= selVPos.max.x; xPos+=0.1) {
		for (let yPos = selVPos.min.y; yPos <= selVPos.max.y; yPos+=0.1) {
			for (let zPos = selVPos.min.z; zPos <= selVPos.max.z; zPos+=0.1) {
				ePosArr.push({x: xPos, y: yPos, z: zPos});
			}
		}
	}

	meshArr.forEach(mesh => {
		if (mesh.name === selMesh.name || clash === true) return;
		const vPos = GetMeshArea(mesh);
		ePosArr.forEach(ePos => {
			if (ePos.x >= vPos.min.x && ePos.x <= vPos.max.x && 
				ePos.y >= vPos.min.y && ePos.y <= vPos.max.y && 
				ePos.z >= vPos.min.z && ePos.z <= vPos.max.z )
				clash = true;
		});
	});
	return (clash === true)?"clash":"wrong";
}

export const modalInfo = {
	clash:{title:"CLASH WARNING!", description : "Your design is poorly coordinated, this has coursed a clash on site, you have been penalized 15 seconds for rework costs."},
	wrong:{title:"QUALITY WARNING!", description : "You have incorrectly laid out the design, an issue has been raised, you have been penalized 10 seconds for rework costs."}
}

function GetMeshArea(mesh) {
	var vPos = new THREE.Box3().setFromObject(mesh);
	["min", "max"].forEach(level => {
		["x", "y", "z"].forEach(axis=> {
			const posVal = vPos[level][axis];
			const dir = (posVal >= 0)?1:-1;
			const tVal = Math.floor(Math.abs(posVal) * 10) / 10;
			vPos[level][axis] = tVal * dir;
		});
	});
	return vPos;
}

export function CheckRoundVal(val0, val1) {
	// if (val1 === undefined || val1 === null) {
	// 	return Math.round(val0 * 10) / 10;
	// }
	// else {
		return (Math.round(val0 * 10) / 10 === Math.round(val1 * 10) / 10)?true:false;
	// }
}

const lightArr = [
	{posX:-6, posZ: 6, rot:-0.25 * Math.PI},
	{posX: 6, posZ: 6, rot: 0.25 * Math.PI},
	{posX: 6, posZ:-6, rot: 0.75 * Math.PI},
	{posX:-6, posZ:-6, rot:-0.75 * Math.PI},
]

export function Get2DPos(obj, cWidth, cHeight, camera) {
	var vector = new THREE.Vector3();
	var widthHalf = 0.5 * cWidth;
	var heightHalf = 0.5 * cHeight;
	obj.updateMatrixWorld();
	vector.setFromMatrixPosition(obj.matrixWorld);
	vector.project(camera);
	vector.x = ( vector.x * widthHalf ) + widthHalf;
	vector.y = - ( vector.y * heightHalf ) + heightHalf;
	return {  x: vector.x, y: vector.y };
};
