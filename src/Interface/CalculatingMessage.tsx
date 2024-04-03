import { animated, useSpring } from "@react-spring/web";
import invert from "invert-color";
import { useEffect, useRef, useState } from "react";
import { useTemporary } from "../stores/useTemporary";

const CalculatingMessage = () => {
    const [calculating, setCalculating] = useState(true);
    const [invertedBgColor, setInvertedBgColor] = useState("#ffffff");
    const divRef = useRef(null!);
    const bgColor = useTemporary((state) =>
        state.levaStores.style?.get("backgroundColor")
    );

    useEffect(() => {
        if (!bgColor) return;
        setInvertedBgColor(invert(bgColor, true));
    }, [bgColor]);

    const animatedStyle = useSpring({
        from: {
            color: invertedBgColor,
        },
        to: {
            color: invertedBgColor,
            opacity: calculating ? 1.0 : 0.0,
        },
    });

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
    return (
        <animated.div
            style={animatedStyle}
            className="calculating-message-container"
        >
            <animated.div
                ref={divRef}
                style={animatedStyle}
                className="calculating-message-spinner"
            ></animated.div>
            <animated.div
                ref={divRef}
                style={animatedStyle}
                className="calculating-message"
            >
                Calculating...
            </animated.div>
        </animated.div>
    );
};

export default CalculatingMessage;
