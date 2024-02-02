import { Trail } from "@react-three/drei";
import { extend, useFrame } from "@react-three/fiber";
import { folder, useControls } from "leva";
import { MeshLineGeometry, MeshLineMaterial } from "meshline";
import { useRef } from "react";
import * as THREE from "three";
import { useTemporary } from "./stores/useTemporary";

extend({ MeshLineGeometry, MeshLineMaterial });

const sphereGeometry = new THREE.SphereGeometry(1, 32, 16);

const basicMaterial = new THREE.MeshBasicMaterial({ color: "coral" });

export const TrailCurve = () => {
    const headPosition = useRef<THREE.Mesh>(null!);

    const curveControls = useControls("Curve", {
        Trail: folder({
            decay: { value: 1, min: 0, max: 10, step: 0.01 },
            trailLength: { value: 100, min: 1, max: 1000, step: 1 },
        }),
    });

    useFrame((state) => {
        const time = state.clock.getElapsedTime();

        const x = Math.sin(time * 1.1) * 3;
        const y = Math.sin(time * 10) * 2;
        const z = Math.cos(time * 1.1) * 3;

        if (headPosition.current) headPosition.current.position.set(x, y, z);
    });

    return (
        <group>
            <Trail
                target={headPosition}
                decay={curveControls.decay}
                length={curveControls.trailLength}
            >
                <mesh
                    ref={headPosition}
                    geometry={sphereGeometry}
                    material={basicMaterial}
                    scale={[0.1, 0.1, 0.1]}
                />
            </Trail>
        </group>
    );
};

export const MeshlineLiveCurve = () => {
    const pointCount = 100;
    let pointArray = new Float32Array(pointCount * 100);
    pointArray = pointArray.map(() => Math.random());

    const headPosition = useRef<THREE.Mesh>(null!);
    // const meshLineRef = useRef<THREE.Mesh>(null!);
    // const meshLineGeometryRef = useRef({ points: pointArray });

    // const curveControls = useControls("Curve", {
    //     Trail: folder({
    //         decay: { value: 1, min: 0, max: 10, step: 0.01 },
    //         trailLength: { value: 100, min: 1, max: 1000, step: 1 },
    //     }),
    // });

    useFrame((state) => {
        const time = state.clock.getElapsedTime();

        const x = Math.sin(time * 1.1) * 3;
        const y = Math.sin(time * 10) * 2;
        const z = Math.cos(time * 1.1) * 3;

        if (headPosition.current) headPosition.current.position.set(x, y, z);
        // console.log(useTemporary.getState().t);
    });

    return (
        <group>
            <mesh
                ref={headPosition}
                geometry={sphereGeometry}
                material={basicMaterial}
                scale={[0.1, 0.1, 0.1]}
            />
            {/* <mesh ref={meshLineRef}>
                <meshLineGeometry points={pointArray} />
                <meshLineMaterial
                    lineWidth={0.1}
                    color="red"
                />
            </mesh> */}
        </group>
    );
};
