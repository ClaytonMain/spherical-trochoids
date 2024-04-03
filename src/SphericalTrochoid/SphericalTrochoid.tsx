import { Trail, shaderMaterial } from "@react-three/drei";
import {
    BufferGeometryNode,
    MaterialNode,
    extend,
    useFrame,
} from "@react-three/fiber";
import { DataInput } from "leva/dist/declarations/src/types/internal";
import { MeshLineGeometry, MeshLineMaterial } from "meshline";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { useSaved } from "../stores/useSaved.tsx";
import { useTemporary } from "../stores/useTemporary.tsx";
import Calculations from "./Calculations.tsx";
import TController from "./TController.tsx";
import { defaultStyleValues } from "./configs.tsx";

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

const InnerGeometry = () => {
    const shape = useSaved((state) => state.currentPlot.innerGeometryShape);
    const meshRef = useRef<THREE.Mesh>(null!);
    const radius1 = useSaved((state) => state.currentPlot.innerGeometryRadius1);
    const radius2 = useSaved((state) => state.currentPlot.innerGeometryRadius2);

    const styleStore = useTemporary((state) => state.levaStores.style);
    const identifier = "Inner Geometry.innerGeometry";
    const visible = styleStore?.useStore(
        (state) =>
            (state.data[`${identifier}Visible`] as DataInput).value as boolean
    );
    const materialType =
        styleStore?.useStore(
            (state) =>
                (state.data[`${identifier}Material`] as DataInput).value as
                    | "MeshBasicMaterial"
                    | "MeshStandardMaterial"
                    | "MeshNormalMaterial"
        ) || "MeshStandardMaterial";
    const color = styleStore?.useStore(
        (state) =>
            (state.data[`${identifier}Color`] as DataInput).value as string
    );
    const emissive = styleStore?.useStore(
        (state) =>
            (state.data[`${identifier}Emissive`] as DataInput).value as string
    );
    const emissiveIntensity = styleStore?.useStore(
        (state) =>
            (state.data[`${identifier}EmissiveIntensity`] as DataInput)
                .value as number
    );
    const metalness = styleStore?.useStore(
        (state) =>
            (state.data[`${identifier}Metalness`] as DataInput).value as number
    );
    const roughness = styleStore?.useStore(
        (state) =>
            (state.data[`${identifier}Roughness`] as DataInput).value as number
    );
    const flatShading = styleStore?.useStore(
        (state) =>
            (state.data[`${identifier}FlatShading`] as DataInput)
                .value as boolean
    );
    const wireframe = styleStore?.useStore(
        (state) =>
            (state.data[`${identifier}Wireframe`] as DataInput).value as boolean
    );

    const meshBasicMaterialRef = useRef<THREE.MeshBasicMaterial>(null!);
    const meshStandardMaterialRef = useRef<THREE.MeshStandardMaterial>(null!);
    const meshNormalMaterialRef = useRef<THREE.MeshNormalMaterial>(null!);
    const material = useMemo(
        () => ({
            MeshBasicMaterial: <meshBasicMaterial ref={meshBasicMaterialRef} />,
            MeshStandardMaterial: (
                <meshStandardMaterial ref={meshStandardMaterialRef} />
            ),
            MeshNormalMaterial: (
                <meshNormalMaterial ref={meshNormalMaterialRef} />
            ),
        }),
        []
    );

    useEffect(() => {
        if (meshBasicMaterialRef.current) {
            meshBasicMaterialRef.current.color = new THREE.Color(
                color || defaultStyleValues.innerGeometryColor
            );
            if (wireframe !== undefined) {
                meshBasicMaterialRef.current.wireframe = wireframe;
            }
        }

        if (meshStandardMaterialRef.current) {
            meshStandardMaterialRef.current.color = new THREE.Color(
                color || defaultStyleValues.innerGeometryColor
            );
            meshStandardMaterialRef.current.emissive = new THREE.Color(
                emissive || defaultStyleValues.innerGeometryEmissive
            );
            meshStandardMaterialRef.current.emissiveIntensity =
                emissiveIntensity ||
                defaultStyleValues.innerGeometryEmissiveIntensity;
            meshStandardMaterialRef.current.metalness =
                metalness || defaultStyleValues.innerGeometryMetalness;
            meshStandardMaterialRef.current.roughness =
                roughness || defaultStyleValues.innerGeometryRoughness;
            if (flatShading !== undefined) {
                meshStandardMaterialRef.current.flatShading = flatShading;
                meshStandardMaterialRef.current.needsUpdate = true;
            }
            if (wireframe !== undefined) {
                meshStandardMaterialRef.current.wireframe = wireframe;
            }
        }

        if (meshNormalMaterialRef.current) {
            if (flatShading !== undefined) {
                meshNormalMaterialRef.current.flatShading = flatShading;
                meshNormalMaterialRef.current.needsUpdate = true;
            }
            if (wireframe !== undefined) {
                meshNormalMaterialRef.current.wireframe = wireframe;
            }
        }
    }, [
        color,
        emissive,
        emissiveIntensity,
        metalness,
        roughness,
        flatShading,
        wireframe,
        materialType,
    ]);

    const geometry = useMemo(
        () => ({
            Sphere: <icosahedronGeometry args={[1, 5]} />,
            Torus: <torusGeometry args={[radius1, radius2, 48, 64]} />,
        }),
        [radius1, radius2]
    );

    return (
        <>
            <mesh
                ref={meshRef}
                scale={shape === "Sphere" ? radius1 : 1}
                visible={visible}
            >
                {geometry[shape]}
                {material[materialType]}
            </mesh>
        </>
    );
};

const OuterGeometry = () => {
    const lValues = useTemporary((state) => state.lValues);
    const transformMatrixValues = useTemporary(
        (state) => state.transformMatrixValues
    );
    const parser = useTemporary((state) => state.parser);
    const ind = useTemporary((state) => state.ind);
    const t = useTemporary((state) => state.t);
    const groupRef = useRef<THREE.Group>(null!);
    const animationStore = useTemporary((state) => state.levaStores.animation);
    const animationSpeed =
        animationStore?.useStore(
            (state) => (state.data["speed"] as DataInput).value as number
        ) || 1;

    const calculationType = useSaved(
        (state) => state.currentPlot.calculationType
    );
    const radius = useSaved((state) => state.currentPlot.outerGeometryRadius);
    const shape = useSaved((state) => state.currentPlot.outerGeometryShape);

    const transformMatrix = new THREE.Matrix4();
    const transformTranslation = new THREE.Vector3();
    const transformRotation = new THREE.Quaternion();
    const transformScale = new THREE.Vector3();

    useEffect(() => {
        const unsubscribeCalculationState = useTemporary.subscribe(
            (state) => state.calculationState,
            (value) => {
                if (calculationType === "Endless") {
                    if (value === "ready") {
                        parser.set("L", 0);
                        parser.set("tDelta", 0);
                        parser.set("dAlpha", 0);
                    }
                }
            }
        );
        return () => {
            unsubscribeCalculationState();
        };
    });

    const calculationState = useTemporary((state) => state.calculationState);

    let indMod, indInt;
    useFrame((_, delta) => {
        if (calculationState !== "ready") return;

        indMod = ind % 1;
        indInt = ind >> 0;

        parser.set("t", t);
        parser.set("tDelta", delta * animationSpeed * 0.5);

        if (calculationType === "Fixed Interval") {
            if (shape === "Circle") {
                parser.set(
                    "L",
                    lValues[indInt] * (1 - indMod) +
                        lValues[indInt + 1] * indMod
                );
                parser.evaluate("alpha = L / r");
                transformMatrix.fromArray(
                    parser
                        .evaluate(`flatten(transpose(transformMatrix(t)))`)
                        .toArray()
                );
            } else if (shape === "Sphere") {
                transformMatrix.fromArray(
                    transformMatrixValues.slice(indInt * 16, (indInt + 1) * 16)
                );
            }
        } else if (calculationType === "Endless") {
            if (shape === "Circle") {
                parser.evaluate("alpha = L / r");
                transformMatrix.fromArray(
                    parser
                        .evaluate(`flatten(transpose(transformMatrix(t)))`)
                        .toArray()
                );
                parser.evaluate("L = L + norm(contactPointDt(t)) * tDelta");
                parser.set("prevT", t);
            } else if (shape === "Sphere") {
                parser.evaluate(
                    "outerRotationMatrix = rotationMatrix(dAlpha, outerCenterBasisZ(t))\
                        * outerRotationMatrix"
                );
                transformMatrix.fromArray(
                    parser
                        .evaluate("flatten(transpose(transformMatrix(t)))")
                        .toArray()
                );
                parser.evaluate("dAlpha = norm(outerCenterDt(t)) / r * tDelta");
            }
        }
        transformMatrix.decompose(
            transformTranslation,
            transformRotation,
            transformScale
        );

        // I know that (s)lerping with `alpha` equal to 1 just sets it to
        // the vector/quaternion value. Was lerping previously,
        // might lerp again.
        groupRef.current.position.lerp(transformTranslation, 1);
        groupRef.current.quaternion.slerp(transformRotation, 1);
    });

    const styleStore = useTemporary((state) => state.levaStores.style);
    const identifier = "Outer Geometry.outerGeometry";
    const visible = styleStore?.useStore(
        (state) =>
            (state.data[`${identifier}Visible`] as DataInput).value as boolean
    );
    const materialType =
        styleStore?.useStore(
            (state) =>
                (state.data[`${identifier}Material`] as DataInput).value as
                    | "MeshBasicMaterial"
                    | "MeshStandardMaterial"
                    | "MeshNormalMaterial"
        ) || "MeshStandardMaterial";
    const color = styleStore?.useStore(
        (state) =>
            (state.data[`${identifier}Color`] as DataInput).value as string
    );
    const emissive = styleStore?.useStore(
        (state) =>
            (state.data[`${identifier}Emissive`] as DataInput).value as string
    );
    const emissiveIntensity = styleStore?.useStore(
        (state) =>
            (state.data[`${identifier}EmissiveIntensity`] as DataInput)
                .value as number
    );
    const metalness = styleStore?.useStore(
        (state) =>
            (state.data[`${identifier}Metalness`] as DataInput).value as number
    );
    const roughness = styleStore?.useStore(
        (state) =>
            (state.data[`${identifier}Roughness`] as DataInput).value as number
    );
    const flatShading = styleStore?.useStore(
        (state) =>
            (state.data[`${identifier}FlatShading`] as DataInput)
                .value as boolean
    );
    const wireframe = styleStore?.useStore(
        (state) =>
            (state.data[`${identifier}Wireframe`] as DataInput).value as boolean
    );

    const meshRef = useRef<THREE.Mesh>(null!);
    const meshBasicMaterialRef = useRef<THREE.MeshBasicMaterial>(null!);
    const meshStandardMaterialRef = useRef<THREE.MeshStandardMaterial>(null!);
    const meshNormalMaterialRef = useRef<THREE.MeshNormalMaterial>(null!);
    const material = useMemo(
        () => ({
            MeshBasicMaterial: <meshBasicMaterial ref={meshBasicMaterialRef} />,
            MeshStandardMaterial: (
                <meshStandardMaterial ref={meshStandardMaterialRef} />
            ),
            MeshNormalMaterial: (
                <meshNormalMaterial ref={meshNormalMaterialRef} />
            ),
        }),
        []
    );

    useEffect(() => {
        if (meshBasicMaterialRef.current) {
            meshBasicMaterialRef.current.color = new THREE.Color(
                color || defaultStyleValues.outerGeometryColor
            );
            if (wireframe !== undefined) {
                meshBasicMaterialRef.current.wireframe = wireframe;
            }
            if (shape === "Circle") {
                meshBasicMaterialRef.current.side = THREE.DoubleSide;
            } else {
                meshBasicMaterialRef.current.side = THREE.FrontSide;
            }
        }

        if (meshStandardMaterialRef.current) {
            meshStandardMaterialRef.current.color = new THREE.Color(
                color || defaultStyleValues.outerGeometryColor
            );
            meshStandardMaterialRef.current.emissive = new THREE.Color(
                emissive || defaultStyleValues.outerGeometryEmissive
            );
            meshStandardMaterialRef.current.emissiveIntensity =
                emissiveIntensity ||
                defaultStyleValues.outerGeometryEmissiveIntensity;
            meshStandardMaterialRef.current.metalness =
                metalness || defaultStyleValues.outerGeometryMetalness;
            meshStandardMaterialRef.current.roughness =
                roughness || defaultStyleValues.outerGeometryRoughness;
            if (flatShading !== undefined) {
                meshStandardMaterialRef.current.flatShading = flatShading;
                meshStandardMaterialRef.current.needsUpdate = true;
            }
            if (wireframe !== undefined) {
                meshStandardMaterialRef.current.wireframe = wireframe;
            }
            if (shape === "Circle") {
                meshStandardMaterialRef.current.side = THREE.DoubleSide;
            } else {
                meshStandardMaterialRef.current.side = THREE.FrontSide;
            }
        }

        if (meshNormalMaterialRef.current) {
            if (flatShading !== undefined) {
                meshNormalMaterialRef.current.flatShading = flatShading;
                meshNormalMaterialRef.current.needsUpdate = true;
            }
            if (wireframe !== undefined) {
                meshNormalMaterialRef.current.wireframe = wireframe;
            }
            if (shape === "Circle") {
                meshNormalMaterialRef.current.side = THREE.DoubleSide;
            } else {
                meshNormalMaterialRef.current.side = THREE.FrontSide;
            }
        }
    }, [
        color,
        emissive,
        emissiveIntensity,
        metalness,
        roughness,
        flatShading,
        wireframe,
        materialType,
        shape,
    ]);

    const geometry = useMemo(
        () => ({
            Circle: <circleGeometry />,
            Sphere: <icosahedronGeometry args={[1, 5]} />,
        }),
        []
    );

    return (
        <>
            <group ref={groupRef}>
                <mesh
                    ref={meshRef}
                    scale={radius}
                    visible={visible}
                >
                    {material[materialType]}
                    {geometry[shape]}
                </mesh>
                <DLine />
                <DPoint />
            </group>
        </>
    );
};

const DLine = () => {
    const dRadius = useSaved((state) => state.currentPlot.dLineRadius);
    const styleStore = useTemporary((state) => state.levaStores.style);
    const identifier = "d Line.dLine";
    const visible = styleStore?.useStore(
        (state) =>
            (state.data[`${identifier}Visible`] as DataInput).value as boolean
    );
    const width =
        styleStore?.useStore(
            (state) =>
                (state.data[`${identifier}Width`] as DataInput).value as number
        ) || 0.05;
    const materialType =
        styleStore?.useStore(
            (state) =>
                (state.data[`${identifier}Material`] as DataInput).value as
                    | "MeshBasicMaterial"
                    | "MeshStandardMaterial"
                    | "MeshNormalMaterial"
        ) || "MeshStandardMaterial";
    const color = styleStore?.useStore(
        (state) =>
            (state.data[`${identifier}Color`] as DataInput).value as string
    );
    const emissive = styleStore?.useStore(
        (state) =>
            (state.data[`${identifier}Emissive`] as DataInput).value as string
    );
    const emissiveIntensity = styleStore?.useStore(
        (state) =>
            (state.data[`${identifier}EmissiveIntensity`] as DataInput)
                .value as number
    );
    const metalness = styleStore?.useStore(
        (state) =>
            (state.data[`${identifier}Metalness`] as DataInput).value as number
    );
    const roughness = styleStore?.useStore(
        (state) =>
            (state.data[`${identifier}Roughness`] as DataInput).value as number
    );
    const flatShading = styleStore?.useStore(
        (state) =>
            (state.data[`${identifier}FlatShading`] as DataInput)
                .value as boolean
    );
    const wireframe = styleStore?.useStore(
        (state) =>
            (state.data[`${identifier}Wireframe`] as DataInput).value as boolean
    );

    const meshRef = useRef<THREE.Mesh>(null!);
    const meshBasicMaterialRef = useRef<THREE.MeshBasicMaterial>(null!);
    const meshStandardMaterialRef = useRef<THREE.MeshStandardMaterial>(null!);
    const meshNormalMaterialRef = useRef<THREE.MeshNormalMaterial>(null!);
    const material = useMemo(
        () => ({
            MeshBasicMaterial: <meshBasicMaterial ref={meshBasicMaterialRef} />,
            MeshStandardMaterial: (
                <meshStandardMaterial ref={meshStandardMaterialRef} />
            ),
            MeshNormalMaterial: (
                <meshNormalMaterial ref={meshNormalMaterialRef} />
            ),
        }),
        []
    );

    useEffect(() => {
        if (meshBasicMaterialRef.current) {
            meshBasicMaterialRef.current.color = new THREE.Color(
                color || defaultStyleValues.dLineColor
            );
            if (wireframe !== undefined) {
                meshBasicMaterialRef.current.wireframe = wireframe;
            }
        }

        if (meshStandardMaterialRef.current) {
            meshStandardMaterialRef.current.color = new THREE.Color(
                color || defaultStyleValues.dLineColor
            );
            meshStandardMaterialRef.current.emissive = new THREE.Color(
                emissive || defaultStyleValues.dLineEmissive
            );
            meshStandardMaterialRef.current.emissiveIntensity =
                emissiveIntensity || defaultStyleValues.dLineEmissiveIntensity;
            meshStandardMaterialRef.current.metalness =
                metalness || defaultStyleValues.dLineMetalness;
            meshStandardMaterialRef.current.roughness =
                roughness || defaultStyleValues.dLineRoughness;
            if (flatShading !== undefined) {
                meshStandardMaterialRef.current.flatShading = flatShading;
                meshStandardMaterialRef.current.needsUpdate = true;
            }
            if (wireframe !== undefined) {
                meshStandardMaterialRef.current.wireframe = wireframe;
            }
        }

        if (meshNormalMaterialRef.current) {
            if (flatShading !== undefined) {
                meshNormalMaterialRef.current.flatShading = flatShading;
                meshNormalMaterialRef.current.needsUpdate = true;
            }
            if (wireframe !== undefined) {
                meshNormalMaterialRef.current.wireframe = wireframe;
            }
        }
    }, [
        color,
        emissive,
        emissiveIntensity,
        metalness,
        roughness,
        flatShading,
        wireframe,
        materialType,
    ]);

    return (
        <mesh
            ref={meshRef}
            scale={[dRadius, width, width]}
            visible={visible}
            position={[-dRadius / 2, 0, 0]}
        >
            {material[materialType]}
            <boxGeometry />
        </mesh>
    );
};

const DPoint = () => {
    const dRadius = useSaved((state) => state.currentPlot.dLineRadius);
    const styleStore = useTemporary((state) => state.levaStores.style);
    const identifier = "d Point.dPoint";
    const visible = styleStore?.useStore(
        (state) =>
            (state.data[`${identifier}Visible`] as DataInput).value as boolean
    );
    const radius =
        styleStore?.useStore(
            (state) =>
                (state.data[`${identifier}Radius`] as DataInput).value as number
        ) || 0.1;
    const materialType =
        styleStore?.useStore(
            (state) =>
                (state.data[`${identifier}Material`] as DataInput).value as
                    | "MeshBasicMaterial"
                    | "MeshStandardMaterial"
                    | "MeshNormalMaterial"
        ) || "MeshStandardMaterial";
    const color = styleStore?.useStore(
        (state) =>
            (state.data[`${identifier}Color`] as DataInput).value as string
    );
    const emissive = styleStore?.useStore(
        (state) =>
            (state.data[`${identifier}Emissive`] as DataInput).value as string
    );
    const emissiveIntensity = styleStore?.useStore(
        (state) =>
            (state.data[`${identifier}EmissiveIntensity`] as DataInput)
                .value as number
    );
    const metalness = styleStore?.useStore(
        (state) =>
            (state.data[`${identifier}Metalness`] as DataInput).value as number
    );
    const roughness = styleStore?.useStore(
        (state) =>
            (state.data[`${identifier}Roughness`] as DataInput).value as number
    );
    const flatShading = styleStore?.useStore(
        (state) =>
            (state.data[`${identifier}FlatShading`] as DataInput)
                .value as boolean
    );
    const wireframe = styleStore?.useStore(
        (state) =>
            (state.data[`${identifier}Wireframe`] as DataInput).value as boolean
    );

    const meshRef = useRef<THREE.Mesh>(null!);
    const meshBasicMaterialRef = useRef<THREE.MeshBasicMaterial>(null!);
    const meshStandardMaterialRef = useRef<THREE.MeshStandardMaterial>(null!);
    const meshNormalMaterialRef = useRef<THREE.MeshNormalMaterial>(null!);
    const material = useMemo(
        () => ({
            MeshBasicMaterial: <meshBasicMaterial ref={meshBasicMaterialRef} />,
            MeshStandardMaterial: (
                <meshStandardMaterial ref={meshStandardMaterialRef} />
            ),
            MeshNormalMaterial: (
                <meshNormalMaterial ref={meshNormalMaterialRef} />
            ),
        }),
        []
    );

    useEffect(() => {
        if (meshBasicMaterialRef.current) {
            meshBasicMaterialRef.current.color = new THREE.Color(
                color || defaultStyleValues.dPointColor
            );
            if (wireframe !== undefined) {
                meshBasicMaterialRef.current.wireframe = wireframe;
            }
        }

        if (meshStandardMaterialRef.current) {
            meshStandardMaterialRef.current.color = new THREE.Color(
                color || defaultStyleValues.dPointColor
            );
            meshStandardMaterialRef.current.emissive = new THREE.Color(
                emissive || defaultStyleValues.dPointEmissive
            );
            meshStandardMaterialRef.current.emissiveIntensity =
                emissiveIntensity || defaultStyleValues.dPointEmissiveIntensity;
            meshStandardMaterialRef.current.metalness =
                metalness || defaultStyleValues.dPointMetalness;
            meshStandardMaterialRef.current.roughness =
                roughness || defaultStyleValues.dPointRoughness;
            if (flatShading !== undefined) {
                meshStandardMaterialRef.current.flatShading = flatShading;
                meshStandardMaterialRef.current.needsUpdate = true;
            }
            if (wireframe !== undefined) {
                meshStandardMaterialRef.current.wireframe = wireframe;
            }
        }

        if (meshNormalMaterialRef.current) {
            if (flatShading !== undefined) {
                meshNormalMaterialRef.current.flatShading = flatShading;
                meshNormalMaterialRef.current.needsUpdate = true;
            }
            if (wireframe !== undefined) {
                meshNormalMaterialRef.current.wireframe = wireframe;
            }
        }
    }, [
        color,
        emissive,
        emissiveIntensity,
        metalness,
        roughness,
        flatShading,
        wireframe,
        materialType,
    ]);

    const curveStyleStore = useTemporary((state) => state.levaStores.style);
    const curveIdentifier = "Curve.curve";
    const curveVisible = curveStyleStore?.useStore(
        (state) =>
            (state.data[`${curveIdentifier}Visible`] as DataInput)
                .value as boolean
    );
    const curveDrawType = curveStyleStore?.useStore(
        (state) =>
            (state.data[`${curveIdentifier}DrawType`] as DataInput)
                .value as string
    );
    const curveColor = curveStyleStore?.useStore(
        (state) =>
            (state.data[`${curveIdentifier}Color`] as DataInput).value as string
    );
    const curveWidth = curveStyleStore?.useStore(
        (state) =>
            (state.data[`${curveIdentifier}Width`] as DataInput).value as number
    );
    const curveTrailLength = curveStyleStore?.useStore(
        (state) =>
            (state.data[`${curveIdentifier}TrailLength`] as DataInput)
                .value as number
    );
    const curveTrailDecay = curveStyleStore?.useStore(
        (state) =>
            (state.data[`${curveIdentifier}TrailDecay`] as DataInput)
                .value as number
    );

    const trailRef = useRef<THREE.Mesh>(null!);
    useFrame(() => {
        if (trailRef.current && meshRef.current) {
            trailRef.current.position.set(
                ...meshRef.current.position.toArray()
            );
        }
    });
    const [hideTrail, setHideTrail] = useState(false);
    useEffect(() => {
        const unsubscribeCalculationState = useTemporary.subscribe(
            (state) => state.calculationState,
            (value) => {
                if (curveDrawType === "Trail") {
                    if (value === "calculating") {
                        setHideTrail(true);
                    } else if (value === "ready") {
                        const timeoutId = setTimeout(() => {
                            setHideTrail(false);
                            clearInterval(timeoutId);
                        }, 100);
                    }
                }
            }
        );
        return () => {
            unsubscribeCalculationState();
        };
    });
    const calculationState = useTemporary((state) => state.calculationState);

    return (
        <>
            <mesh
                ref={meshRef}
                scale={radius}
                visible={visible}
                position={[-dRadius, 0, 0]}
            >
                {material[materialType]}
                <icosahedronGeometry args={[1, 5]} />
            </mesh>
            {curveVisible &&
                curveDrawType === "Trail" &&
                calculationState === "ready" &&
                !hideTrail && (
                    <Trail
                        color={curveColor}
                        width={curveWidth! * 20}
                        length={curveTrailLength}
                        decay={curveTrailDecay}
                        stride={0.0001}
                        interval={1}
                    >
                        <mesh ref={trailRef} />
                    </Trail>
                )}
        </>
    );
};

const Curve = () => {
    const ind = useTemporary((state) => state.ind);
    const points = useTemporary((state) => state.fixedIntervalCurvePoints);
    const geometryRef = useRef<MeshLineGeometry>(null!);

    const identifier = "Curve.curve";
    const styleStore = useTemporary((state) => state.levaStores.style);
    const visible = styleStore?.useStore(
        (state) =>
            (state.data[`${identifier}Visible`] as DataInput).value as boolean
    );
    const drawType = styleStore?.useStore(
        (state) =>
            (state.data[`${identifier}DrawType`] as DataInput).value as string
    );
    const color = styleStore?.useStore(
        (state) =>
            (state.data[`${identifier}Color`] as DataInput).value as string
    );
    const width = styleStore?.useStore(
        (state) =>
            (state.data[`${identifier}Width`] as DataInput).value as number
    );

    useFrame(() => {
        if (drawType === "From Start Point") {
            geometryRef.current.drawRange.count = ind * 6;
        }
    });

    // Trail is implemented in dPoint component.
    return (
        <mesh visible={visible && drawType === "From Start Point"}>
            <meshLineGeometry
                ref={geometryRef}
                points={points}
            />
            <meshLineMaterial
                color={color || "red"}
                lineWidth={width}
            />
        </mesh>
    );
};

const threeBgColor = new THREE.Color();

const OverlayMaterial = shaderMaterial(
    { uColor: new THREE.Color(0.0, 0.0, 0.0), uAlpha: 1.0 },
    // vertex
    /*glsl*/ `
    void main() {
        gl_Position = vec4(position, 1.0);
    }`,
    // fragment shader
    /*glsl*/ `
    uniform vec3 uColor;
    uniform float uAlpha;

    void main() {
        gl_FragColor = vec4(uColor, uAlpha);
    }`
);
extend({ OverlayMaterial });

type OverlayMaterialImpl = {
    uColor: THREE.Color;
    uAlpha: number;
} & JSX.IntrinsicElements["shaderMaterial"];

declare module "@react-three/fiber" {
    interface ThreeElements {
        overlayMaterial: OverlayMaterialImpl;
    }
}

const Overlay = () => {
    const [calculating, setCalculating] = useState(true);
    const overlayMaterialRef = useRef<
        THREE.ShaderMaterial & OverlayMaterialImpl
    >(null!);

    const bgColor = useTemporary((state) =>
        state.levaStores.style?.get("Background.backgroundColor")
    );

    useEffect(() => {
        // threeBgColor.set(bgColor).convertLinearToSRGB();
        threeBgColor.set(bgColor);
        overlayMaterialRef.current.uColor = threeBgColor;
    }, [bgColor]);

    useEffect(() => {
        const unsubscribeCalculationState = useTemporary.subscribe(
            (state) => state.calculationState,
            (value) => {
                if (value === "calculating") {
                    setCalculating(true);
                } else if (value === "ready") {
                    setCalculating(false);
                }
            }
        );
        return () => {
            unsubscribeCalculationState();
        };
    });

    useFrame(() => {
        overlayMaterialRef.current.uAlpha = calculating
            ? THREE.MathUtils.lerp(overlayMaterialRef.current.uAlpha, 1.0, 0.25)
            : THREE.MathUtils.lerp(
                  overlayMaterialRef.current.uAlpha,
                  0.0,
                  0.025
              );
    });

    return (
        <mesh>
            <planeGeometry args={[2, 2, 1, 1]} />
            <overlayMaterial
                ref={overlayMaterialRef}
                uColor={threeBgColor}
                uAlpha={1.0}
                transparent
            />
        </mesh>
    );
};

const SphericalTrochoid = () => {
    return (
        <group>
            <Overlay />
            <TController />
            <Calculations />
            <InnerGeometry />
            <OuterGeometry />
            <Curve />
        </group>
    );
};

export default SphericalTrochoid;
