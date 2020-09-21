import * as THREE from 'three';
import fontJson from "../assets/fonts/TimesNewRomanPSMT.json"; // font_bold

import image0_0 from '../assets/images/step0/image0.jpg';
import image0_1 from '../assets/images/step0/image1.jpg';
import image0_2 from '../assets/images/step0/image2.jpg';
import image0_3 from '../assets/images/step0/image3.jpg';

import imageExp from "../assets/images/step0/image_exp.jpg"

const font3D = new THREE.FontLoader().parse(fontJson);

export function boxMesh (size, map) {
    var boxGeo = new THREE.BoxGeometry(size.x, size.y, 0.01);
    var boxMat = new THREE.MeshPhongMaterial({map:map, color:0xFFFFFF});
    var boxMesh = new THREE.Mesh(boxGeo, boxMat);
    return boxMesh;
}

export function planeMesh(size, map) {
    var planeGeo = new THREE.PlaneGeometry(size.x, size.y);
    var planeMat = new THREE.MeshPhongMaterial({map: map, transparent:true});
    var planeMesh = new THREE.Mesh(planeGeo, planeMat);
    return planeMesh;
}

export function textMesh(str, posY, sizeStr) {
    var textGeo = new THREE.TextGeometry( str, { font: font3D, size: textSize[sizeStr], height: 0.01 } );
    if (sizeStr === "title") {
        textGeo.computeBoundingBox();
        textGeo.center();
    }
    var textMat = new THREE.MeshPhongMaterial();
    var textMesh = new THREE.Mesh(textGeo, textMat);
    const posX = (sizeStr === "title")?0:-150;
    textMesh.position.set(posX, posY, 0);
    return textMesh;
}

export const boxDis = 250;
export const textSize = {title:50, middle:18, small:10, des:4};
// export const videoSize = {width:1280, height:720, ratio:1280/720};
export const imageSize = {width:1280, height:720, ratio:1280/720};

export const imageArr = [
    {id:"imageExp0", image:imageExp, desStr:["Lorem ipsum dolor sit amet, consectetur adipiscing elit.", "Aenean vitae arcu interdum, semper urna non, volutpat enim.", "Suspendisse rutrum solicitudin nunc."], linkStr:"Click here for external link example", linkUrl:"https://www.google.com/"},
]

const titleY = textSize.title * -1;
const step0ItemArr = [
    {type:"text", pos:{x:0, y:titleY}, size:"title", string : ["Centuries", "of history"]},
    {type:"empty", pos:{x:-200, y:-50}},

    {type:"imageExp", pos:{x:-100, y:0}, size:{x:140, y:90}, source : imageArr[0]},

    {type:"image", pos:{x:100, y:0}, size:{x:150, y:218}, img : image0_0},
    {type:"text", pos:{x:-100, y:0, z:1},  size:"small", string : ["The Procuratie Vecchie is", "a 16th century Renaissance", "building looking out on one of the", "most famous squares in the world.", "", "Yet for its 500-year history,", "the general public has never", "been allowed in."]},

    {type:"image", pos:{x:-150, y:50, z:boxDis * 2}, size:{x:187, y:92}, img : image0_1},
    {type:"text", pos:{x:150, y:0, z:1}, size:"small", string : ["ARUP has worked with architect", "David Chipperfield on a hugely", "complex and sensitive restoration", "that will finally open its doors to", "the world."]},
    
    {type:"image", pos:{x:100, y:0, z:boxDis * 2}, size:{x:141, y:100}, img : image0_2},
    {type:"text", pos:{x:-100, y:0, z:1}, size:"small", string : ["Restoring such an old, listed", "building means understanding", "every corner.", "", "Only by knowing how the fragile", "building currently stays standing", "can you ensure that restoration", "work doesn't trigger a collapse."]},
    
    {type:"image", pos:{x:-200, y:0}, size:{x:141, y:100}, img : image0_3},
    {type:"empty", pos:{x:-200, y:-50}},

    // {type:"video", size:{x:160, y:90}, source : videoArr[0]},
    // {type:"pano", size:{x:160, y:90}, source : panoArr[0]},
    // {type:"animation", size:{x:160, y:90}, source : animationArr[0]},
    // {type:"image", size:{x:140, y:90}, img : image1},
]

export const moduleArr = [
    {color:{r:0.76, g:0.68, b:0.57}, itemArr:step0ItemArr},
]


export function getDis2D(pos0, pos1) {
    return Math.sqrt(Math.pow(pos0.x - pos1.x, 2) + Math.pow(pos0.y - pos1.y, 2));
}

export function getDis3D(pos0, pos1) {
    return Math.sqrt(Math.pow(pos0.x - pos1.x, 2) + Math.pow(pos0.y - pos1.y, 2) + Math.pow(pos0.z - pos1.z, 2));
}

export function GetSideNum(sideArr, posZ) {
    var sideNum = 0;
    sideArr.forEach(item => {
        if (item.s <= posZ) sideNum = item.idx;
    });
    return sideNum;
}
export function GetModuleNum(posZ) {
    var moduleNum = 0;
    moduleArr.forEach((module, idx) => {
        if (module.posStart <= posZ) moduleNum = idx;
    });
    return moduleNum;
}

export function GetImageSize (cWidth, cHeight, imgRatio) {
    const cRatio = cWidth/cHeight;
    var imgW = cWidth, imgL = 0;
    var imgH = cHeight, imgT = 0;
    if (imgRatio < cRatio) {
        imgH = cWidth / imgRatio;
        imgT = (cHeight - imgH) / 2;
    }
    else {
        imgW = cHeight * imgRatio;
        imgL = (cWidth - imgW) / 2;
    }
    return {imgW:imgW, imgH:imgH, imgL:imgL, imgT:imgT};
}
