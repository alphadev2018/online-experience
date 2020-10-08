
import * as THREE from 'three';
import {FBXLoader} from "three/examples/jsm/loaders/FBXLoader";
import {Tween, autoPlay, Easing} from "es6-tween";

const island0 = require("assets/models/island_0.fbx");
const island1 = require("assets/models/island_1.fbx");
const island2 = require("assets/models/island_4.fbx");
const island3 = require("assets/models/island_3.fbx");

const gameModelCrane = require("assets/models/crane.fbx");
const gameModelBridge = require("assets/models/bridge.fbx");

autoPlay(true);

export const easeTime = 1000, gameReadyTime = 5;
export const menuHomeArr=[
	{label:"home0", value:"home0"},
	{label:"home1", value:"home1"},
	{label:"home2", value:"home2"}
];
export const menuArr = [
	{label:"Media", 	value:"media"},
	{label:"Conductive",value:"conductive"},
	{label:"Game", 		value:"game"},
	{label:"Map", 		value:"map"}
];
export const modelArr = [
	{file:island0, size:15, pos:{x:  0, y:0, z:  0}, islandName:"home"},
	{file:island1, size:15, pos:{x: 20, y:0, z: 20}, islandName:menuArr[0].value},
	{file:island2, size:15, pos:{x:-20, y:0, z: 20}, islandName:menuArr[2].value},
	{file:island3, size:15, pos:{x:  0, y:0, z:-30}, islandName:menuArr[1].value},
];
export const gameInfoArr = [
	{id:"bridge", file:gameModelBridge, size:3, time:500, basicName:"Support_0"},
	// {id:"crane", file:gameModelCrane, size:5, time:500, basicName:"basic_0"}
]

export function SetTween (obj, attr, info, easeTime) {
	var tweenData = {};
	//  Linear.None Quadratic, Cubic, Quartic, Quintic, Sinusoidal, Exponential, Circular, Elastic, Back, Bounce
   	// .repeat(Infinity)  .yoyo(true)
	const easeType = Easing.Cubic.InOut; //, Easing.Quadratic.Out
	if      (attr === "scale")    tweenData = {'scale.x': info, 'scale.y': info};
	else if (attr === "position") tweenData = {'position.x':info.x, 'position.z':info.z };
	else if (attr === "camPos")   tweenData = {'position.y':info };
	else if (attr === "far")      tweenData = {'far': info };
	else if (attr === "color")    tweenData = {'r': info.r, 'g':info.g, 'b':info.b };
	new Tween(obj).to( tweenData , easeTime ).easing(easeType).start();
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
			if (info.islandName === "game") console.log(child.name);
			if (child.name.indexOf("wind_basic") > -1) self.windBaseArr.push(child);
			else if (child.name.indexOf("car") > -1) self.carArr.push(child);
			else if(child.name.indexOf("ton") > -1 || child.name.indexOf("cloud") > -1) {
				child.curVal = Math.round(Math.random() * 100);
				child.dir = (Math.random() > 0.5)? 1:-1;
				if (child.name.indexOf("cloud") > -1) self.cloudArr.push(child);
				else if (child.name.indexOf("ton") > -1) self.tonArr.push(child);
			}
			// else if (child.name === "game_pan") child.material.color.setHex(0x336182);
			// else if (child.name.indexOf("gameline") > -1) child.material.color.setHex(0x999999);
			if (child instanceof THREE.Mesh) {
				child.landChildName = info.islandName; self.meshArr.push(child);
			}
			if (child.name.indexOf("__") > -1) {
				const colVal = child.name.split("__")[1];
				console.log(colVal);
				child.material = new THREE.MeshPhongMaterial({color:"#"+colVal});
				if (child.name.indexOf("trans")>-1) {
					child.material.transparent=true; child.material.opacity=0.7;
					console.log(child);
				}
			}
		});
		var vSize = await new THREE.Box3().setFromObject(object).getSize();
		const scl = info.size/vSize.x;
		object.scale.set(scl, scl, scl);
		object.position.set(info.pos.x, info.pos.y, info.pos.z);
		object.islandName = info.islandName;
		self.totalGroup.add(object);
	});
}

export function LoadGameModel(info, self) {
	new FBXLoader().load(info.file, async function (object){
		object.children.forEach(child => {
			const childPos = child.position;
			child.oriPos = {x:childPos.x, y:childPos.y, z:childPos.z};
			if (child.name.indexOf("Suspenders") > -1) child.material.color.setHex(0xA75A00);
		});
		var vSize = await new THREE.Box3().setFromObject(object).getSize();
		const scl = info.size/vSize.y;
		object.scale.set(scl, scl, scl);
		// object.position.set(info.pos.x, info.pos.y, info.pos.z);
		object.gameId = info.id;
		object.basicModel = info.basicName;
		self.gameGroup.add(object);
	});
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
		self.controls.maxDistance = 70;
		SetTween(self.totalGroup, "position", {x:0, z:0}, easeTime);
		SetTween(self.camera, "camPos", 60, easeTime);
		SetTween(self.scene.fog, "far", 300, easeTime);
		setTimeout(() => {
			self.controls.minDistance = 50;
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
