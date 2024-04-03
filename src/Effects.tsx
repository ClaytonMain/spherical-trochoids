import {
    Bloom,
    ChromaticAberration,
    EffectComposer,
} from "@react-three/postprocessing";
import { DataInput } from "leva/dist/declarations/src/types";
import { useTemporary } from "./stores/useTemporary";

const Effects = () => {
    const styleStore = useTemporary((state) => state.levaStores.style);

    const effectsBloomEnabled = styleStore?.useStore(
        (state) =>
            (state.data["Effects.Bloom.effectsBloomEnabled"] as DataInput)
                .value as boolean
    );
    const effectsBloomIntensity = styleStore?.useStore(
        (state) =>
            (state.data["Effects.Bloom.effectsBloomIntensity"] as DataInput)
                .value as number
    );
    const effectsBloomLuminanceThreshold = styleStore?.useStore(
        (state) =>
            (
                state.data[
                    "Effects.Bloom.effectsBloomLuminanceThreshold"
                ] as DataInput
            ).value as number
    );
    const effectsBloomLuminanceSmoothing = styleStore?.useStore(
        (state) =>
            (
                state.data[
                    "Effects.Bloom.effectsBloomLuminanceSmoothing"
                ] as DataInput
            ).value as number
    );
    const effectsBloomMipmapBlur = styleStore?.useStore(
        (state) =>
            (state.data["Effects.Bloom.effectsBloomMipmapBlur"] as DataInput)
                .value as boolean
    );
    const effectsChromaticAbberationEnabled = styleStore?.useStore(
        (state) =>
            (
                state.data[
                    "Effects.Chromatic Abberation.effectsChromaticAbberationEnabled"
                ] as DataInput
            ).value as boolean
    );
    const effectsChromaticAbberationOffset = styleStore?.useStore(
        (state) =>
            (
                state.data[
                    "Effects.Chromatic Abberation.effectsChromaticAbberationOffset"
                ] as DataInput
            ).value as [number, number]
    );
    return (
        <EffectComposer>
            <>
                {effectsBloomEnabled && (
                    <Bloom
                        intensity={effectsBloomIntensity}
                        luminanceThreshold={effectsBloomLuminanceThreshold}
                        luminanceSmoothing={effectsBloomLuminanceSmoothing}
                        mipmapBlur={effectsBloomMipmapBlur}
                    />
                )}
            </>
            <>
                {effectsChromaticAbberationEnabled && (
                    <ChromaticAberration
                        // @ts-expect-error offset parameter is fine
                        offset={effectsChromaticAbberationOffset?.map(
                            (x) => x / 100
                        )}
                    />
                )}
            </>
        </EffectComposer>
    );
};

export default Effects;
