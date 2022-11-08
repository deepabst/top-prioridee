import React from "react";
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import myFont from 'three/examples/fonts/helvetiker_regular.typeface.json';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import { extend } from '@react-three/fiber';

extend({ TextGeometry })

function Text(props) {
    const font = new FontLoader().parse(myFont);
    return (
        <mesh position={props.position}>
            <textGeometry args={[props.label, { font, size: 0.8, height: 0.5 }]} />
            <meshLambertMaterial attach='material' color={'gold'} />
        </mesh>
    )
}

export default Text;