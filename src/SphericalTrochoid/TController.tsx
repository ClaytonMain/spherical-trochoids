import { useFrame } from "@react-three/fiber";
import { DataInput } from "leva/dist/declarations/src/types";
import { useEffect, useRef } from "react";
import { useSaved } from "../stores/useSaved";
import { useTemporary } from "../stores/useTemporary";

const TController = () => {
    const points = useTemporary((state) => state.fixedIntervalCurvePoints);
    const animationStore = useTemporary((state) => state.levaStores.animation);
    const randomizationStore = useTemporary(
        (state) => state.levaStores.randomization
    );
    const scrubbing = useTemporary((state) => state.scrubbing);
    const tRange = useSaved((state) => state.currentPlot.curveTRange);
    const tRangeRange = tRange[1] - tRange[0];
    const t = useTemporary((state) => state.t);
    const randomizeIn = useTemporary((state) => state.randomizeIn);
    const calculationState = useTemporary((state) => state.calculationState);
    const calculationType = useSaved(
        (state) => state.currentPlot.calculationType
    );
    const tStart = useSaved((state) => state.currentPlot.curveTStart);
    const autoRandomize = randomizationStore?.useStore(
        (state) => (state.data["autoRandomize"] as DataInput).value as boolean
    );
    const autoRandomizeType = randomizationStore?.useStore(
        (state) =>
            (state.data["autoRandomizeType"] as DataInput).value as string
    );
    const randomizeAtTValue = randomizationStore?.useStore(
        (state) =>
            (state.data["randomizeAtTValue"] as DataInput).value as number
    );
    const randomizeEveryNSeconds = randomizationStore?.useStore(
        (state) =>
            (state.data["randomizeEveryNSeconds"] as DataInput).value as string
    );

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

    useEffect(() => {
        const unsubscribeCalculationState = useTemporary.subscribe(
            (state) => state.calculationState,
            (value) => {
                if (value === "ready") {
                    if (calculationType === "Endless") {
                        useTemporary.setState({ t: tStart });
                    } else if (calculationType === "Fixed Interval") {
                        useTemporary.setState({ t: tRange[0] });
                    }
                }
            }
        );
        return () => {
            unsubscribeCalculationState();
        };
    });

    // Why does useRef work for this value, but it wasn't working for
    // the values in SphericalTrochoid?
    const newT = useRef(0);

    useFrame((_, delta) => {
        newT.current = t + delta * kachow * 0.5;
        if (animate && !scrubbing && calculationState === "ready") {
            if (calculationType === "Fixed Interval") {
                useTemporary.setState({
                    t: mod(newT.current - tRange[0], tRangeRange) + tRange[0],
                });
                if (
                    autoRandomize &&
                    autoRandomizeType === "At t Max" &&
                    newT.current >= tRange[1]
                ) {
                    useTemporary.setState({
                        calculationState: "calculate random",
                    });
                }
            } else if (calculationType === "Endless") {
                useTemporary.setState({
                    t: newT.current,
                });
                if (
                    autoRandomize &&
                    autoRandomizeType === "At t Value" &&
                    newT.current >= randomizeAtTValue!
                ) {
                    useTemporary.setState({
                        calculationState: "calculate random",
                    });
                }
            }
            if (autoRandomize && autoRandomizeType === "Every n Seconds") {
                if (randomizeIn > 0) {
                    useTemporary.setState({
                        randomizeIn: Math.max(randomizeIn - delta, 0),
                    });
                } else {
                    console.log(randomizeIn);
                    useTemporary.setState({
                        calculationState: "calculate random",
                        randomizeIn: parseFloat(
                            randomizeEveryNSeconds?.replace("s", "") || "30"
                        ),
                    });
                }
            }
        }
        if (calculationType === "Fixed Interval") {
            useTemporary.setState({
                ind:
                    ((t - tRange[0]) / (tRange[1] - tRange[0])) *
                    (points.length / 3),
            });
        }
    });
    return null;
};

export default TController;
