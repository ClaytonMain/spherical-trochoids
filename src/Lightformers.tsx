import { Lightformer } from "@react-three/drei";
import { DataInput } from "leva/dist/declarations/src/types";
import * as THREE from "three";
import { useTemporary } from "./stores/useTemporary";

const Lightformers = () => {
    const lightsStore = useTemporary((state) => state.levaStores.lights);

    const lightformer1Enabled = lightsStore?.useStore(
        (state) =>
            (state.data["Lightformer 1.lightformer1Enabled"] as DataInput)
                .value as boolean
    );
    const lightformer1Form = lightsStore?.useStore(
        (state) =>
            (state.data["Lightformer 1.lightformer1Form"] as DataInput)
                .value as "ring" | "rect" | "circle"
    );
    const lightformer1Intensity = lightsStore?.useStore(
        (state) =>
            (state.data["Lightformer 1.lightformer1Intensity"] as DataInput)
                .value as number
    );
    const lightformer1Color = lightsStore?.useStore(
        (state) =>
            (state.data["Lightformer 1.lightformer1Color"] as DataInput)
                .value as THREE.Color
    );
    const lightformer1Scale = lightsStore?.useStore(
        (state) =>
            (state.data["Lightformer 1.lightformer1Scale"] as DataInput)
                .value as number
    );
    const lightformer1Position = lightsStore?.useStore(
        (state) =>
            (state.data["Lightformer 1.lightformer1Position"] as DataInput)
                .value as [number, number, number]
    );

    const lightformer2Enabled = lightsStore?.useStore(
        (state) =>
            (state.data["Lightformer 2.lightformer2Enabled"] as DataInput)
                .value as boolean
    );
    const lightformer2Form = lightsStore?.useStore(
        (state) =>
            (state.data["Lightformer 2.lightformer2Form"] as DataInput)
                .value as "ring" | "rect" | "circle"
    );
    const lightformer2Intensity = lightsStore?.useStore(
        (state) =>
            (state.data["Lightformer 2.lightformer2Intensity"] as DataInput)
                .value as number
    );
    const lightformer2Color = lightsStore?.useStore(
        (state) =>
            (state.data["Lightformer 2.lightformer2Color"] as DataInput)
                .value as THREE.Color
    );
    const lightformer2Scale = lightsStore?.useStore(
        (state) =>
            (state.data["Lightformer 2.lightformer2Scale"] as DataInput)
                .value as number
    );
    const lightformer2Position = lightsStore?.useStore(
        (state) =>
            (state.data["Lightformer 2.lightformer2Position"] as DataInput)
                .value as [number, number, number]
    );

    const lightformer3Enabled = lightsStore?.useStore(
        (state) =>
            (state.data["Lightformer 3.lightformer3Enabled"] as DataInput)
                .value as boolean
    );
    const lightformer3Form = lightsStore?.useStore(
        (state) =>
            (state.data["Lightformer 3.lightformer3Form"] as DataInput)
                .value as "ring" | "rect" | "circle"
    );
    const lightformer3Intensity = lightsStore?.useStore(
        (state) =>
            (state.data["Lightformer 3.lightformer3Intensity"] as DataInput)
                .value as number
    );
    const lightformer3Color = lightsStore?.useStore(
        (state) =>
            (state.data["Lightformer 3.lightformer3Color"] as DataInput)
                .value as THREE.Color
    );
    const lightformer3Scale = lightsStore?.useStore(
        (state) =>
            (state.data["Lightformer 3.lightformer3Scale"] as DataInput)
                .value as number
    );
    const lightformer3Position = lightsStore?.useStore(
        (state) =>
            (state.data["Lightformer 3.lightformer3Position"] as DataInput)
                .value as [number, number, number]
    );

    return (
        <>
            <Lightformer
                visible={lightformer1Enabled}
                form={lightformer1Form}
                intensity={lightformer1Intensity}
                color={lightformer1Color}
                scale={lightformer1Scale}
                position={lightformer1Position}
                target={[0, 0, 0]}
            />
            <Lightformer
                visible={lightformer2Enabled}
                form={lightformer2Form}
                intensity={lightformer2Intensity}
                color={lightformer2Color}
                scale={lightformer2Scale}
                position={lightformer2Position}
                target={[0, 0, 0]}
            />
            <Lightformer
                visible={lightformer3Enabled}
                form={lightformer3Form}
                intensity={lightformer3Intensity}
                color={lightformer3Color}
                scale={lightformer3Scale}
                position={lightformer3Position}
                target={[0, 0, 0]}
            />
        </>
    );
};

export default Lightformers;
