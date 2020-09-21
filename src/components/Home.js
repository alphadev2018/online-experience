import React, { Component } from 'react';
import jQuery from 'jquery';
import * as THREE from 'three';
import OrbitControls from 'three-orbitcontrols';
import FBXLoader from 'three-fbxloader-offical';

import island0 from "../assets/models/island_0.fbx";
import island1 from "../assets/models/island_1.fbx";
import island2 from "../assets/models/island_2.fbx";
import island3 from "../assets/models/island_3.fbx";
import island4 from "../assets/models/island_4.fbx";

import markImg from "../assets/images/mark.png";
import '../assets/styles/home.css';
import XXXBK_img from "../assets/images/XXX_BK.jpg";
import XXXRT_img from "../assets/images/XXX_RT.jpg";
import XXXLF_img from "../assets/images/XXX_LF.jpg";
import XXXUP_img from "../assets/images/XXX_UP.jpg";
import XXXDN_img from "../assets/images/XXX_DN.jpg";
import XXXFR_img from "../assets/images/XXX_FR.jpg";

import posxImg from "../assets/images/posx.jpg";
import posyImg from "../assets/images/posy.jpg";
import poszImg from "../assets/images/posz.jpg";
import negxImg from "../assets/images/negx.jpg";
import negyImg from "../assets/images/negy.jpg";
import negzImg from "../assets/images/negz.jpg";

export default class Home extends Component {
	constructor(props) {
		super(props);
		this.cWidth = jQuery(window).width();  this.mouseX = 0;
		this.cHeight = jQuery(window).height();this.mouseY = 0;
		this.mainHeight = 10;
		this.animate = this.animate.bind(this);
		this.state = { }
	}
	
	componentDidMount() {
		this.init();
		this.animate();
		this.setCanvasSize();
	}

	UNSAFE_componentWillReceiveProps(nextProps) {
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

	init() {
		this.renderer = new THREE.WebGLRenderer({antialias:true, alpha:true});
		this.renderer.setSize(this.cWidth, this.cHeight);
		if (!document.getElementById("container")) return false;
		document.getElementById("container").appendChild(this.renderer.domElement);
		this.renderer.setClearColor(0xaef7ff, 1);

		this.camera = new THREE.PerspectiveCamera(60, this.cWidth / this.cHeight, 0.1,  50);
		this.camera.position.set(-10, 5, -3);
		this.scene = new THREE.Scene();
		this.totalGroup = new THREE.Group(); this.scene.add(this.totalGroup);// this.totalGroup.position.y = this.mainHeight * -2;

		this.controls = new OrbitControls(this.camera, this.renderer.domElement); // this.controls.enabled = false;

		const ambientLight = new THREE.AmbientLight( 0xFFFFFF, 0.2 ); this.scene.add( ambientLight );
		this.mainLight = new THREE.DirectionalLight( 0xFFFFFF, 1 ); this.scene.add( this.mainLight );
		this.mainLight.position.set(-50, 50, 50);
		this.loadPlane();
		this.loadModel(island0, 5, {x:0, y:0, z:0});
		this.loadModel(island1, 5, {x:-10, y:0, z:-10});
		this.loadModel(island2, 5, {x:-10, y:0, z:10});
		this.loadModel(island3, 5, {x:10, y:0, z:-10});
		this.loadModel(island4, 5, {x:10, y:0, z:10});
	}

	loadPlane(){
		// const planeGeo = new THREE.BoxGeometry(this.mainHeight * 10, 0.01, this.mainHeight * 10);
		// const planeMat = new THREE.MeshPhongMaterial({color:0xAAAAAA});
		// const planeMesh = new THREE.Mesh(planeGeo, planeMat);
		// this.totalGroup.add(planeMesh);
	}
	
	loadModel(loadFile, size, pos) {
		var self = this;
		// const markMap = new THREE.TextureLoader().load(markImg);
		// const envMapItem = new THREE.CubeTextureLoader().load( [
		// 	XXXRT_img, XXXLF_img, XXXUP_img, XXXDN_img, XXXFR_img, XXXBK_img,
		// 	posxImg, negxImg, posyImg, negyImg, poszImg, negzImg 
		// ] );
		// console.log(envMapItem);
		
		new FBXLoader().load(loadFile, function (object){
			// for (let i = object.children.length - 1; i >= 0; i--) {
			// 	var child = object.children[i];
			// 	for (let j = child.children.length - 1; j >= 0; j++) {
			// 		var subChild = child.children[j];
			// 		if (subChild.type.toLowerCase().indexOf("light") > -1)
			// 			child.remove(subChild);
			// 	}
			// 	if (child.type.toLowerCase().indexOf("light") > -1)
			// 		object.remove(subChild);
			// }
			object.traverse(function (child){
				if (child.type.toLowerCase().indexOf("light") > -1){
					child.intensity = 0;
					// console.log(child);
				}
					
			});
			var vSize = new THREE.Box3().setFromObject(object).getSize();
			// console.log(vSize);
			const scl = size/vSize.x;
			object.scale.set(scl, scl, scl);
			object.position.set(pos.x, pos.y, pos.z);
			self.totalGroup.add(object);
			console.log(object);
		});
	}

	animate () {
		if (!this.camera || !this.scene) return;
		requestAnimationFrame(this.animate);
		this.renderer.render(this.scene, this.camera);
	}
	
	render() {
		return (
			<div className="home">
				<div id="container"></div>
			</div>
		)
	}
}
