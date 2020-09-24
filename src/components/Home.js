import React, { Component } from 'react';
import jQuery from 'jquery';
import * as THREE from 'three';
import OrbitControls from 'three-orbitcontrols';
import {FBXLoader} from "three/examples/jsm/loaders/FBXLoader";

import {modelArr, SetTween, easeTime, AnimateReturn, AnimateRotate} from "./common";
import '../assets/styles/home.css';

export default class Home extends Component {
	constructor(props) {
		super(props);
		this.cWidth = jQuery(window).width();  this.mouseX = 0;
		this.cHeight = jQuery(window).height();this.mouseY = 0;
		this.raycaster = new THREE.Raycaster(); this.mouse = new THREE.Vector2();
		this.animate = this.animate.bind(this);
		this.meshArr = []; this.selLandName = "";
		this.cloudArr = []; this.windBaseArr = []; this.carArr = []; this.tonArr = [];
		this.state = { overModal:true }
	}
	
	componentDidMount() {
		this.init();
		this.animate();
		this.setCanvasSize();
		window.addEventListener('resize', this.setCanvasSize);
		window.addEventListener( 'click', this.mouseClick, false );
		// window.addEventListener( 'mousemove', this.mouseMove, false );
		// window.addEventListener("touchstart", this.touchStart, false);
		// window.addEventListener("touchmove", this.touchMove, false);
		// window.addEventListener("touchend", this.touchEnd, false);
		// window.addEventListener("touchcancel", this.touchEnd, false);
	}

	UNSAFE_componentWillReceiveProps(nextProps) {
		if (this.selLandName !== nextProps.menuItem) {
			this.gotoIsland(nextProps.menuItem);
		}
		if (this.state.overModal !== nextProps.overModal) {
			this.setState({overModal:nextProps.overModal});
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
		if (this.state.overModal) return;
		this.mouse.x = ( event.clientX / this.cWidth ) * 2 - 1;
		this.mouse.y = - ( event.clientY / this.cHeight ) * 2 + 1;

		this.raycaster.setFromCamera( this.mouse, this.camera );
		const intersect = this.raycaster.intersectObjects( this.meshArr )[0];
		if (intersect) {
			const landName = intersect.object.landChildName;
			if (landName !== this.selLandName) {
				this.gotoIsland(landName);
				this.props.callMenuItem(landName);
			}
			// else 
		}
		else {
		}
	}

	gotoIsland=(str)=>{
		modelArr.forEach(islandItem => {
			if (islandItem.islandName === str) {
				const landPos = islandItem.pos;
				SetTween(this.totalGroup, "position", {x:landPos.x * -1, z:landPos.z * -1}, easeTime);
			}
		});
		if (str === "map") {
			this.controls.maxDistance = 70;
			SetTween(this.totalGroup, "position", {x:0, z:0}, easeTime);
			SetTween(this.camera, "camPos", 60, easeTime);
			setTimeout(() => {
				this.controls.minDistance = 50;
				this.controls.maxPolarAngle = 0.2;
			}, easeTime);
		}
		else if (this.selLandName === "map") {
			this.controls.minDistance = 5;
			SetTween(this.camera, "camPos", 2, easeTime);
			SetTween(this.camera, "position", {x:0, z:10}, easeTime);
			setTimeout(() => {
				this.controls.maxDistance = 25;
				this.controls.maxPolarAngle = Math.PI/2;
			}, easeTime);
		}
		this.selLandName = str;
	}

	init() {
		this.renderer = new THREE.WebGLRenderer({antialias:true, alpha:true});
		this.renderer.setSize(this.cWidth, this.cHeight);
		if (!document.getElementById("container")) return false;
		document.getElementById("container").appendChild(this.renderer.domElement);
		this.renderer.setClearColor(0x6cb3c5, 1);

		this.camera = new THREE.PerspectiveCamera(60, this.cWidth / this.cHeight, 1,  300);
		this.camera.position.set(0, 1.5, 10);
		this.scene = new THREE.Scene();
		this.totalGroup = new THREE.Group(); this.scene.add(this.totalGroup); this.totalGroup.position.set(0, 0, -70);

		this.controls = new OrbitControls(this.camera, this.renderer.domElement); // this.controls.enabled = false;
		this.controls.minDistance = 5; this.controls.maxDistance = 25; this.controls.maxPolarAngle = Math.PI/2;

		const ambientLight = new THREE.AmbientLight( 0xFFFFFF, 0.2 ); this.scene.add( ambientLight );
		this.mainLight = new THREE.DirectionalLight( 0xFFFFFF, 1.5 ); this.scene.add( this.mainLight );
		this.mainLight.position.set(-50, 50, 50);
		modelArr.forEach((modelInfo, idx) => { this.loadModel(modelInfo, idx); });
	}

	loadModel(info, idx) {
		var self = this;
		// const markMap = new THREE.TextureLoader().load(markImg);
		// const envMapItem = new THREE.CubeTextureLoader().load( [
		// 	XXXRT_img, XXXLF_img, XXXUP_img, XXXDN_img, XXXFR_img, XXXBK_img,
		// 	posxImg, negxImg, posyImg, negyImg, poszImg, negzImg 
		// ] );

		new FBXLoader().load(info.file, async function (object){
			object.traverse(function(child) {
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
			});
			var vSize = await new THREE.Box3().setFromObject(object).getSize();
			const scl = info.size/vSize.x;
			object.scale.set(scl, scl, scl);
			object.position.set(info.pos.x, info.pos.y, info.pos.z);
			object.modelNum = info.islandName;
			self.totalGroup.add(object);
		});
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
			</div>
		)
	}
}
