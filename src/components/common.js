import * as THREE from 'three';
import {Tween, autoPlay, Easing} from "es6-tween";

const island0 = require("../assets/models/island_0.fbx");
const island1 = require("../assets/models/island_1.fbx");
const island2 = require("../assets/models/island_2.fbx");
const island3 = require("../assets/models/island_3.fbx");

autoPlay(true);

export const modelArr = [
    {file:island0, size:15, pos:{x:  0, y:0, z:0}},
    {file:island1, size:15, pos:{x:-20, y:0, z:-20}},
    {file:island2, size:15, pos:{x: 20, y:0, z:-20}},
    {file:island3, size:15, pos:{x:  0, y:0, z: 30}},
];

export function SetTween (obj, attr, info, easeTime) {
    var tweenData = {};
	//  Linear.None Quadratic, Cubic, Quartic, Quintic, Sinusoidal, Exponential, Circular, Elastic, Back, Bounce
    const easeType = Easing.Cubic.InOut; //, Easing.Quadratic.Out
    if      (attr === "scale")    tweenData = {'scale.x': info, 'scale.y': info};
    else if (attr === "position") tweenData = {'position.x': info.x, 'position.z': info.z };
    else if (attr === "z")        tweenData = {'position.z': info };
    else if (attr === "near")     tweenData = {'near': info };
    else if (attr === "color")    tweenData = {'r': info.r, 'g':info.g, 'b':info.b };
    new Tween(obj).to( tweenData , easeTime ).easing(easeType).start();
   	// .repeat(Infinity)  .yoyo(true)
}

