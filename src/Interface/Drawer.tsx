import { animated, useSpring } from "@react-spring/web";
import { useKeyboardControls } from "@react-three/drei";
import { useEffect, useState } from "react";
import { ShortcutEnum } from "../ShortcutWrapper/types";
import LevaPanels from "./LevaPanels/LevaPanels";

function getWindowDimensions() {
    const { innerWidth: width, innerHeight: height } = window;
    return {
        width,
        height,
    };
}

function useWindowDimensions() {
    const [windowDimensions, setWindowDimensions] = useState(
        getWindowDimensions()
    );

    useEffect(() => {
        function handleResize() {
            setWindowDimensions(getWindowDimensions());
        }

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return windowDimensions;
}

export default function Drawer() {
    const [active, setActive] = useState(false);
    const [subscribeKeys] = useKeyboardControls<ShortcutEnum>();
    const { height, width } = useWindowDimensions();

    const props = useSpring({
        right: active ? 0 : width > 700 ? -350 : 0,
        top: width <= 700 ? (active ? height - 300 : height - 50) : 0,
        opacity: active ? 1 : 0,
        rotateX: active ? "180deg" : "0deg",
        rotate: width <= 700 ? "0deg" : "270deg",
    });

    useEffect(() => {
        const unsubscribeEscape = subscribeKeys(
            (state) => state.escape,
            (pressed) => {
                if (pressed) setActive(false);
            }
        );
        const unsubscribeToggleDrawer = subscribeKeys(
            (state) => {
                return state.toggleDrawer;
            },
            (pressed) => {
                if (pressed) setActive(!active);
            }
        );

        return () => {
            unsubscribeEscape();
            unsubscribeToggleDrawer();
        };
    }, [active, subscribeKeys]);

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            window.scrollTo(0, 0);
            return () => clearTimeout(timeoutId);
        }, 1000);
    }, []);

    return (
        <>
            <animated.div
                style={{ right: props.right, top: props.top }}
                className="control-panel-container"
            >
                <div
                    className="control-panel-button-holder"
                    onClick={() => setActive(!active)}
                >
                    <div className="control-panel-display-toggle">
                        <animated.svg
                            width={30}
                            height={30}
                            className="arrow"
                            style={{
                                rotate: props.rotate,
                                rotateX: props.rotateX,
                            }}
                        >
                            <polygon
                                points="0,30 15,0, 30,30 25,28 15,8 5,28"
                                style={{ fill: "white" }}
                            />
                        </animated.svg>
                    </div>
                </div>
                <div className="leva-controls-container">
                    {/* <div style={{ background: "limegreen" }}>HULLO THERE</div> */}
                    <LevaPanels />
                </div>
            </animated.div>
        </>
    );
}
