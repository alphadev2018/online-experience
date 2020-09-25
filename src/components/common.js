
import * as THREE from 'three';
import {Tween, autoPlay, Easing} from "es6-tween";

const island0 = require("assets/models/island_0.fbx");
const island1 = require("assets/models/island_1.fbx");
const island2 = require("assets/models/island_2.fbx");
const island3 = require("assets/models/island_3.fbx");

const gameModelCrane = require("assets/models/crane.fbx");

autoPlay(true);

export const easeTime = 1000;
export const menuArr = [
	{label:"Home", 		value:"home"},
	{label:"Media", 	value:"media"},
	{label:"Conductive",value:"conductive"},
	{label:"Game", 		value:"game"},
	{label:"Map", 		value:"map"},
	{label:"Other", 	value:"other"},
];
export const modelArr = [
	{file:island0, size:15, pos:{x:  0, y:0, z:  0}, islandName:menuArr[0].value},
	{file:island1, size:15, pos:{x: 20, y:0, z: 20}, islandName:menuArr[1].value},
	{file:island2, size:15, pos:{x:-20, y:0, z: 20}, islandName:menuArr[3].value},
	{file:island3, size:15, pos:{x:  0, y:0, z:-30}, islandName:menuArr[2].value},
];
export function SetTween (obj, attr, info, easeTime) {
	var tweenData = {};
	//  Linear.None Quadratic, Cubic, Quartic, Quintic, Sinusoidal, Exponential, Circular, Elastic, Back, Bounce
   	// .repeat(Infinity)  .yoyo(true)
	const easeType = Easing.Cubic.InOut; //, Easing.Quadratic.Out
	if      (attr === "scale")    tweenData = {'scale.x': info, 'scale.y': info};
	else if (attr === "position") tweenData = {'position.x':info.x, 'position.z':info.z };
	else if (attr === "camPos")   tweenData = {'position.y':info };
	else if (attr === "near")     tweenData = {'near': info };
	else if (attr === "color")    tweenData = {'r': info.r, 'g':info.g, 'b':info.b };
	new Tween(obj).to( tweenData , easeTime ).easing(easeType).start();
}

export function AnimateRotate(arr, axis, value, type) {
	arr.forEach(modelItem => {
		modelItem.rotation[axis] += value;
		if (type === "wind") {
			modelItem.children[0].rotation.z += 0.03;
		}
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

export const gameInfoArr = [
	{id:"crane", file:gameModelCrane, size:5}
]

export const gameTime = 10;