import React, { useRef } from 'react';
import { Canvas, useFrame } from 'react-three-fiber';

import { OrbitControls } from 'drei';

import './App.scss';

const Box = ( ) => {
    const mesh = useRef(null);

    useFrame(() => mesh.current.rotation.x = mesh.current.rotation.y += 0.01)

    return <>
        <mesh ref={mesh}>
            <boxBufferGeometry attach='geometry' args={[1,1,1]} />
            <meshStandardMaterial attach='material' />
        </mesh>
    </>;
}

function App() {
    return <>
        <Canvas camera={{position: [-5,2,10], fov: 20}} colorManagement>
            <ambientLight intensity={0.3} />
            
            {/* <group>
                <mesh receiveShadow rotation={[ -Math.PI / 2, 0, 0]} position={[ 0, -3, 0]}>
                    <planeBufferGeometry attach='geometry' args={[100,100]} />
                    <shaderMaterial attach='material' color={'white'}/>
                </mesh>
            </group> */}

            <Box />
            <OrbitControls />
        </Canvas>
    </>;
}

export default App;
