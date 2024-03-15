import { useFrame } from "@react-three/fiber";
import { DataInput } from "leva/dist/declarations/src/types";
import { useSaved } from "../stores/useSaved";
import { useTemporary } from "../stores/useTemporary";

const TController = () => {
    const points = useTemporary((state) => state.fixedIntervalCurvePoints);
    const animationStore = useTemporary((state) => state.levaStores.animation);
    const scrubbing = useTemporary((state) => state.scrubbing);
    const tRange = useSaved((state) => state.plotHistory[0].curveTRange);
    const tRangeRange = tRange[1] - tRange[0];
    const t = useTemporary((state) => state.t);

    const kachow =
        animationStore?.useStore(
            (state) => (state.data["speed"] as DataInput).value as number
        ) || 1;

    const animate = animationStore?.useStore(
        (state) => (state.data["animate"] as DataInput).value as boolean
    );

    const mod = (n: number, m: number) => {
        return ((n % m) + m) % m;
    };

    useFrame((_, delta) => {
        if (animate && !scrubbing) {
            useTemporary.setState({
                t: mod(t + delta * kachow - tRange[0], tRangeRange) + tRange[0],
            });
        }
        useTemporary.setState({
            ind:
                ((t - tRange[0]) / (tRange[1] - tRange[0])) *
                (points.length / 3),
        });
    });
    return null;
};

export default TController;
