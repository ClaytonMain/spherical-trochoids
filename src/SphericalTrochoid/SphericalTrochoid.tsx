import {
    BufferGeometryNode,
    MaterialNode,
    extend,
    useFrame,
} from "@react-three/fiber";
import { DataInput } from "leva/dist/declarations/src/types/internal";
import { MeshLineGeometry, MeshLineMaterial } from "meshline";
import { useRef } from "react";
import * as THREE from "three";
import { useSaved } from "../stores/useSaved.tsx";
import { useTemporary } from "../stores/useTemporary.tsx";
import Calculations from "./Calculations.tsx";
import TController from "./TController.tsx";

extend({ MeshLineGeometry, MeshLineMaterial });

declare module "@react-three/fiber" {
    interface ThreeElements {
        meshLineGeometry: BufferGeometryNode<
            MeshLineGeometry,
            typeof MeshLineGeometry
        >;
        meshLineMaterial: MaterialNode<
            MeshLineMaterial,
            typeof MeshLineMaterial
        >;
    }
}

/**
 * Just a reminder because braining is hard.
 * useTemporary((state) => state.whatever) is reactive (I think I'm using that word correctly)
 * useTemporary.getState((state) => state.whatever) is not reactive.
 * Try not to forget this and waste a shitload of time trying to figure
 * out why things aren't working again, ok?
 */

const sphereGeometry = new THREE.SphereGeometry(1, 32, 16);
const circleGeometry = new THREE.CircleGeometry();
const boxGeometry = new THREE.BoxGeometry();

const InnerGeometry = () => {
    const shape = useSaved((state) => state.plotHistory[0].innerGeometryShape);
    const radius1 = useSaved(
        (state) => state.plotHistory[0].innerGeometryRadius1
    );
    const radius2 = useSaved(
        (state) => state.plotHistory[0].innerGeometryRadius2
    );

    const styleStore = useTemporary((state) => state.levaStores.style);
    const color = styleStore?.useStore(
        (state) =>
            (state.data["Inner Geometry.innerGeometryColor"] as DataInput)
                .value as string
    );

    return (
        <>
            <mesh
                geometry={sphereGeometry}
                scale={radius1}
                // visible={shape === "Sphere"}
                visible={false}
            >
                <meshStandardMaterial color={color || "red"} />
            </mesh>

            <mesh
                visible={shape === "Torus"}
                // visible={false}
            >
                <torusGeometry args={[radius1, radius2, 16, 100]} />
                <meshStandardMaterial color={color || "red"} />
            </mesh>
        </>
    );
};

const OuterGeometry = () => {
    const lValues = useTemporary((state) => state.lValues);
    const parser = useTemporary((state) => state.parser);
    const ind = useTemporary((state) => state.ind);
    const t = useTemporary((state) => state.t);
    const groupRef = useRef<THREE.Group>(null!);
    const axesRef = useRef<THREE.Group>(null!);
    const putCameraHereRef = useRef<THREE.Mesh>(null!);
    const radius = useSaved(
        (state) => state.plotHistory[0].outerGeometryRadius
    );
    const transformMatrix = new THREE.Matrix4();
    const basisMatrix4 = new THREE.Matrix4();
    const basisMatrix3 = new THREE.Matrix3();
    let indMod;
    useFrame(() => {
        indMod = ind % 1;
        parser.set("t", t);
        parser.set(
            "L",
            lValues[ind >> 0] * (1 - indMod) + lValues[(ind >> 0) + 1] * indMod
        );
        parser.evaluate("alpha = L / r");
        transformMatrix.fromArray(
            parser.evaluate(`flatten(transpose(transformMatrix(t)))`).toArray()
        );
        groupRef.current.position.setFromMatrixPosition(transformMatrix);
        groupRef.current.setRotationFromMatrix(transformMatrix);
        axesRef.current.position.setFromMatrixPosition(transformMatrix);
        axesRef.current.setRotationFromMatrix(
            basisMatrix4.setFromMatrix3(
                basisMatrix3.fromArray(
                    parser
                        .evaluate("flatten(transpose(outerCenterBasis(t)))")
                        .toArray()
                )
            )
        );
    });

    return (
        <>
            <group ref={axesRef}>
                <arrowHelper args={[new THREE.Vector3(1, 0, 0)]} />
                <arrowHelper args={[new THREE.Vector3(0, 1, 0)]} />
                <arrowHelper args={[new THREE.Vector3(0, 0, 1)]} />
                <mesh
                    ref={putCameraHereRef}
                    position={[-5, 1, 1]}
                />
            </group>
            <group ref={groupRef}>
                <mesh
                    geometry={circleGeometry}
                    scale={radius}
                >
                    <meshStandardMaterial
                        color="coral"
                        side={THREE.DoubleSide}
                    />
                </mesh>
                <DLine />
                <DPoint />
            </group>
        </>
    );
};

const DLine = () => {
    const dRadius = useSaved((state) => state.plotHistory[0].dLineRadius);
    const width = 0.1;
    return (
        <mesh
            scale={[dRadius, width, width]}
            geometry={boxGeometry}
            position={[-dRadius / 2, 0, 0]}
        >
            <meshStandardMaterial color={"red"} />
        </mesh>
    );
};

const DPoint = () => {
    const dRadius = useSaved((state) => state.plotHistory[0].dLineRadius);
    const radius = 0.25;
    return (
        <mesh
            scale={radius}
            geometry={sphereGeometry}
            position={[-dRadius, 0, 0]}
        >
            <meshStandardMaterial color={"red"} />
        </mesh>
    );
};

const Curve = () => {
    const ind = useTemporary((state) => state.ind);
    const points = useTemporary((state) => state.fixedIntervalCurvePoints);
    const styleStore = useTemporary((state) => state.levaStores.style);
    const geometryRef = useRef<MeshLineGeometry>(null!);

    const color = styleStore?.useStore(
        (state) => (state.data["Curve.curveColor"] as DataInput).value as string
    );

    useFrame(() => {
        geometryRef.current.drawRange.count = ind * 6;
    });

    return (
        <mesh>
            <meshLineGeometry
                ref={geometryRef}
                points={points}
            />
            <meshLineMaterial
                color={color || "red"}
                lineWidth={0.1}
            />
        </mesh>
    );
};

const SphericalTrochoid = () => {
    return (
        <>
            <TController />
            <Calculations />
            <InnerGeometry />
            <OuterGeometry />
            <Curve />
        </>
    );
};

export default SphericalTrochoid;
