import React, { Component } from 'react';
import jQuery from 'jquery';
import * as THREE from 'three';
import OrbitControls from 'three-orbitcontrols';
// import FBXLoader from 'three-fbxloader-offical';
import FBXLoader from "three-fbx-loader";
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";

import {modelArr, SetTween} from "./common";
import '../assets/styles/home.css';

export default class Home extends Component {
	constructor(props) {
		super(props);
		this.cWidth = jQuery(window).width();  this.mouseX = 0;
		this.cHeight = jQuery(window).height();this.mouseY = 0;
		this.raycaster = new THREE.Raycaster(); this.mouse = new THREE.Vector2();
		this.mainHeight = 10;
		this.animate = this.animate.bind(this);
		this.meshArr = []; this.selLandNum = 0; this.cloudArr = [];
		this.state = { }
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
		this.mouse.x = ( event.clientX / this.cWidth ) * 2 - 1;
		this.mouse.y = - ( event.clientY / this.cHeight ) * 2 + 1;

		this.raycaster.setFromCamera( this.mouse, this.camera );
		const intersect = this.raycaster.intersectObjects( this.meshArr )[0];
		if (intersect) {
			if (intersect.object.landChildNum !== this.selLandNum) {
				this.selLandNum = intersect.object.landChildNum;
				const landPos = modelArr[this.selLandNum].pos;
				SetTween(this.totalGroup, "position", {x:landPos.x * -1, z:landPos.z * -1}, 1000);
			}
			// else 
		}
		else {
			
		}
	}

	init() {
		this.renderer = new THREE.WebGLRenderer({antialias:true, alpha:true});
		this.renderer.setSize(this.cWidth, this.cHeight);
		if (!document.getElementById("container")) return false;
		document.getElementById("container").appendChild(this.renderer.domElement);
		this.renderer.setClearColor(0xaef7ff, 1);

		this.camera = new THREE.PerspectiveCamera(60, this.cWidth / this.cHeight, 0.1,  50);
		this.camera.position.set(-7, 5, 10);
		this.scene = new THREE.Scene();
		this.totalGroup = new THREE.Group(); this.scene.add(this.totalGroup);

		this.controls = new OrbitControls(this.camera, this.renderer.domElement); // this.controls.enabled = false;
		this.controls.minDistance = 10; this.controls.maxDistance = 25;

		const ambientLight = new THREE.AmbientLight( 0xFFFFFF, 0.2 ); this.scene.add( ambientLight );
		this.mainLight = new THREE.DirectionalLight( 0xFFFFFF, 1 ); this.scene.add( this.mainLight );
		this.mainLight.position.set(-50, 50, 50);
		modelArr.forEach((modelInfo, idx) => {
			this.loadModel(modelInfo, idx);
		});
		// this.loadPlane();
	}

	loadPlane(){
		const testGeo = new THREE.BoxGeometry(2, 3, 4);
		const testMat = new THREE.MeshPhongMaterial({color:0xFF0000});
		const testMesh = new THREE.Mesh(testGeo, testMat);
		var testObj = new THREE.Group(); testObj.add(testMesh);
		const vPos = new THREE.Box3().setFromObject(testObj);
		this.totalGroup.add(testObj);
	}

	async loadModel(info, idx) {
		var self = this;
		// const markMap = new THREE.TextureLoader().load(markImg);
		// const envMapItem = new THREE.CubeTextureLoader().load( [
		// 	XXXRT_img, XXXLF_img, XXXUP_img, XXXDN_img, XXXFR_img, XXXBK_img,
		// 	posxImg, negxImg, posyImg, negyImg, poszImg, negzImg 
		// ] );
		new GLTFLoader().load(info.file, async function (gltf){
			var object = gltf.scene;
			object.traverse(function(child) {
				if (child.name === "propeller") self.propeller = child;
				else if(child.name.indexOf("cloud") > -1) {
					child.posVal = Math.round(Math.random() * 100);
					child.dir = (Math.random() > 0.5)? 1:-1;
					self.cloudArr.push(child);
				}
				if (child instanceof THREE.Mesh) {
					child.landChildNum = idx; self.meshArr.push(child);
				}
			})
			var vSize = await new THREE.Box3().setFromObject(object).getSize();
			const scl = info.size/vSize.x;
			object.scale.set(scl, scl, scl);
			object.position.set(info.pos.x, info.pos.y, info.pos.z);
			object.modelNum = idx;
			self.totalGroup.add(object);
		});
	}

	animate () {
		if (!this.camera || !this.scene) return;
		requestAnimationFrame(this.animate);
		if (this.propeller) this.propeller.rotation.y += 0.02;
		this.cloudArr.forEach(cloud => {
			cloud.posVal += cloud.dir;
			cloud.position.x += cloud.dir * 0.01;
			if (cloud.posVal >= 100) cloud.dir = -1;
			else if (cloud.posVal <= 0) cloud.dir = 1;
		});
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
