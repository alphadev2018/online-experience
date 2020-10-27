
import * as THREE from 'three';
import {FBXLoader} from "three/examples/jsm/loaders/FBXLoader";
import {Tween, autoPlay, Easing} from "es6-tween";

import hotImgEMEA from "../assets/images/hot_EMEA.png";
import hotImgACPA from "../assets/images/hot_ACPA.png";
import hotImgAMERICA from "../assets/images/hot_AMERICA.png";

// const island0 = require("assets/models/island_0.fbx");
const islandHome0 = require("assets/models/EMEA_custom_test.fbx");//  building
const islandHome1 = require("assets/models/APAC_custom_test.fbx");
const islandHome2 = require("assets/models/AMERACAS_custom_test.fbx");
const islandGame = require("assets/models/island_game.fbx");
const islandMedia = require("assets/models/island_media.fbx");
// const island3 = require("assets/models/island_3.fbx");

const gameModelCrane = require("assets/models/crane.fbx");
const gameModelBuilding = require("assets/models/building.fbx");
const gameModelBridge = require("assets/models/bridge_old.fbx");
const gameModelStadium = require("assets/models/stadium.fbx");

export const hotNameArr = ["EMEA", "AMERICA", "ACPA"];

autoPlay(true);

export const easeTime = 1000, gameReadyTime = 5;
export const menuHomeArr=[
	{label:"home0", value:"home0", label:"EMEA"},
	{label:"home1", value:"home1", label:"APAC"},
	{label:"home2", value:"home2", label:"Americas"}
];
export const menuArr = [
	{label:"Media", 	value:"media", label:"Media Island"},
	{label:"Game", 		value:"game", label:"Game Island"},
	{label:"Map", 		value:"map", label:"Map"},
	{label:"Conductive",value:"conductive", label:"Autodesk Construnction"}
];
export const modelArr = [
	{file:islandHome0, size:12, pos:{x: 20, y:0, z: 20}, islandName:menuHomeArr[0].value},
	{file:islandHome1, size:20, pos:{x:-20, y:0, z: 20}, islandName:menuHomeArr[1].value},
	{file:islandHome2, size:20, pos:{x:  0, y:0, z:-30}, islandName:menuHomeArr[2].value},
	{file:islandGame,  size:15, pos:{x: 25, y:0, z:-25}, islandName:menuArr[1].value},
	{file:islandMedia, size:15, pos:{x:-25, y:0, z:-25}, islandName:menuArr[0].value},
	// {file:island3,     size:15, pos:{x:  0, y:0, z: 35}, islandName:menuArr[1].value},
];
export const gameInfoArr = [
	{id:"building", file:gameModelBuilding, size:5, time:500, basicName:"Basic", snapDis:4.6},
	{id:"bridge", file:gameModelBridge, size:2, time:500, basicName:"Support_0", snapDis:1},
	{id:"stadium", file:gameModelStadium, size:1.6, time:500, basicName:"Asphalt", snapDis:1}
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
		modelItem.curVal += modelItem.dir;
		modelItem[type][axis] += modelItem.dir * value;
		if 		(modelItem.curVal >= 100) modelItem.dir = -1;
		else if (modelItem.curVal <= 0) modelItem.dir = 1;
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

export function GotoIsland(self, str) {
	self.controls.enabled = false;
	modelArr.forEach(islandItem => {
		if (islandItem.islandName === str) {
			const landPos = islandItem.pos;
			SetTween(self.totalGroup, "position", {x:landPos.x * -1, z:landPos.z * -1}, easeTime);
			SetTween(self.totalGroup, "camPos", 0, easeTime);
			SetTween(self.camera, "camPos", 3, easeTime);
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
		self.controls.minDistance = 5;
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
	console.log(children);
	if (level === "gameMedium") {
		var keyArr = [{name:"Road", y:120}, {name:"Support", y:0}, {name:"Suspenders", y:120}], posZArr=[-480, 0, 480];
		posZArr.forEach(posZ => {
			keyArr.forEach(key => {
				var subCheckVal = false;
				children.forEach(child => {
					if (child.name.indexOf(key.name) > -1) {
						const {x, y, z} = child.position;
						if (Math.round(x) === 0 && Math.round(y) === key.y && Math.round(z) === posZ) subCheckVal = true;
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
			if (item.name.indexOf("projector") > -1) {
				var lightCheck = false;
				lightArr.forEach(lightItem => {
					if (curPos.x === lightItem.posX && curPos.z === lightItem.posZ && CheckRoundVal(lightItem.rot, curRot) === true)
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

export const hotModalInfo={
	ACPA:{
		title:"ACPA hot modal title",
		content:"ACPA hot modal title",
		img:hotImgACPA
	},
	EMEA:{
		title:"EMEA hot modal title",
		content:"EMEA hot modal content",
		img:hotImgEMEA
	},
	AMERICA:{
		title:"AMERICA hot modal title",
		content:"AMERICA hot modal content",
		img:hotImgAMERICA
	}
}

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
	if (CheckRoundVal(selMesh.rotation[rotAxis], selMesh.oriRot) === false) checkPosRot = false;
	// console.log(checkPosRot);
	// console.log(selMesh.rotation[rotAxis], selMesh.oriRot);
	if (checkPosRot === true) return false;

	if (level === "gameEasy") {

	}
	else if (level === "gameMedium") {
		var keyArr = [{name:"Road", y:120}, {name:"Support", y:0}, {name:"Suspenders", y:120}], posZArr=[-480, 0, 480];
		const {x, y, z} = selMesh.position;
		var subCheckVal = true;
		posZArr.forEach(posZ => {
			keyArr.forEach(key => {
				if (selMesh.name.indexOf(key.name) > -1) {
					if (Math.round(x) === 0 && Math.round(y) === key.y && Math.round(z) === posZ) subCheckVal = false;
				}
			});
		});
		if (subCheckVal === false) return false;
	}
	else if (level === "gameDifficult") {
		if (selMesh.name.indexOf("projector") > -1) {
			const curPos = selMesh.position, curRot = selMesh.rotation.y;
			var lightCheck = false;
			lightArr.forEach(lightItem => {
				if (curPos.x === lightItem.posX && curPos.z === lightItem.posZ && CheckRoundVal(lightItem.rot, curRot) === true)
					lightCheck = true;
			});
			if (lightCheck === true) return false;
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
	clash:{title:"CLASH WARNING!", description : "Your design is poorly coordinated, this has coursed a clash on site, you have been penalized $xxx for rework costs."},
	wrong:{title:"QUALITY WARNING!", description : "You have incorrectly laid out the design, an issue has been raised, you have been penalized $xxx for rework costs."}
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
	{posX:-240, posZ: 240, rot:-0.25 * Math.PI},
	{posX: 240, posZ: 240, rot:-0.25 * Math.PI},
	{posX: 240, posZ:-240, rot: 0.25 * Math.PI},
	{posX:-240, posZ:-240, rot: 0.25 * Math.PI},
]
