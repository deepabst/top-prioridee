import React, { useRef } from "react";
import Text from "./Text";

function QuadrantBox(props){
    const ref = useRef()
    return (
      <mesh
        {...props}
        position={props.position}
        color={props.color}
        label={props.label}
        ref={ref}
        onClick={() => {
          console.log("Pointer over", props.label);
        }}
      >
        <Text position={[-props.label.length / 3, 0, 0]} label={props.label} />
        <boxGeometry args={[10, 10, 1]} />
        <meshLambertMaterial opacity={0.2} color={props.color} transparent />
      </mesh>
    );
}

export default QuadrantBox;