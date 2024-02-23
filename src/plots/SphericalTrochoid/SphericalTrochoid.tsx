import { BufferGeometryNode, extend, MaterialNode } from "@react-three/fiber";
import { button, folder, useControls } from "leva";
import { MeshLineGeometry, MeshLineMaterial } from "meshline";
import * as THREE from "three";
import { useTemporary } from "../../stores/useTemporary.tsx";
import Calculations from "./Calculations.tsx";

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

const sphereGeometry = new THREE.SphereGeometry(1, 32, 16);

interface GeneralControlsProps {
    plotId: number;
}
const GeneralControls = ({ plotId }: GeneralControlsProps) => {
    useControls(`Plot ${plotId}`, {
        "Spherical Trochoid": folder({
            Calculation: folder(
                {
                    calculationType: {
                        label: "Calculation Type",
                        options: ["Fixed Interval", "Endless"],
                    },
                },
                {}
            ),
            "Update Parameters": folder(
                {
                    Update: button(() => null),
                },
                {
                    order: 1,
                }
            ),
        }),
    });
    return null;
};

interface InnerGeometryProps {
    plotId: number;
}
const InnerGeometry = ({ plotId }: InnerGeometryProps) => {
    useControls(`Plot ${plotId}`, {
        "Spherical Trochoid": folder({
            "Inner Geometry": folder(
                {
                    visible: {
                        label: "Visible",
                        value: true,
                    },
                    shape: {
                        label: "Shape",
                        options: ["Sphere", "Torus"],
                    },
                    radius1: {
                        label: "Radius 1",
                        value: 4,
                        render: () => false,
                    },
                },
                {
                    render: () => true,
                    collapsed: false,
                }
            ),
        }),
    });
    return (
        <mesh geometry={sphereGeometry}>
            <meshStandardMaterial color="coral" />
        </mesh>
    );
};

interface OuterGeometryProps {
    plotId: number;
}
const OuterGeometry = ({ plotId }: OuterGeometryProps) => {
    console.log(`OuterGeometry plotId: ${plotId}`);
    return (
        <mesh geometry={sphereGeometry}>
            <meshStandardMaterial color="limegreen" />
        </mesh>
    );
};

interface CurveProps {
    plotId: number;
}
const Curve = ({ plotId }: CurveProps) => {
    const fixedIntervalCurvePoints = useTemporary(
        (state) =>
            state.plots[plotId].sphericalTrochoid.fixedInterval.valueArrays
                .curvePoints
    );

    return (
        <mesh>
            <meshLineGeometry points={fixedIntervalCurvePoints} />
            <meshLineMaterial
                color="red"
                lineWidth={0.1}
            />
        </mesh>
    );
};

interface SphericalTrochoidProps {
    plotId: number;
}

const SphericalTrochoid = ({ plotId }: SphericalTrochoidProps) => {
    const updateFixedIntervalCalcStatus =
        useTemporary.getState().plots[plotId].sphericalTrochoid
            .updateFixedIntervalCalcStatus;

    useControls("Calculation", {
        calculate: button(() =>
            updateFixedIntervalCalcStatus(plotId, "needs calculating")
        ),
    });

    return (
        <>
            <GeneralControls plotId={plotId} />
            <Calculations plotId={plotId} />
            <InnerGeometry plotId={plotId} />
            <OuterGeometry plotId={plotId} />
            <Curve plotId={plotId} />
        </>
    );
};

export default SphericalTrochoid;
