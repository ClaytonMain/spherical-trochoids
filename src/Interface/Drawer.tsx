import { animated, useSpring } from "@react-spring/web";
import { useKeyboardControls } from "@react-three/drei";
import { useEffect, useState } from "react";
import { ShortcutEnum } from "../ShortcutWrapper/types";
import LevaPanels from "./LevaPanels/LevaPanels";

/**
 * TODO:
 *  - Less of a "todo" and more of a note: Might be able to handle
 *      the displayed field changes between "Fixed Interval" and
 *      "Endless" by just showing and hiding separate LevaPanel
 *      components. Not sure if that's a bad idea or not, but don't
 *      want to forget the idea.
 */

export default function Drawer() {
    const [active, setActive] = useState(true);
    const [subscribeKeys] = useKeyboardControls<ShortcutEnum>();
    const props = useSpring({
        right: active ? 0 : -350,
        opacity: active ? 1 : 0,
    });

    useEffect(() => {
        console.log("Drawer useEffect called");
        const unsubscribeEscape = subscribeKeys(
            (state) => state.escape,
            (pressed) => {
                if (pressed) setActive(false);
            }
        );
        const unsubscribeToggleDrawer = subscribeKeys(
            (state) => {
                // console.log(state);
                return state.toggleDrawer;
            },
            (pressed) => {
                // console.log(pressed);
                if (pressed) setActive(!active);
            }
        );

        return () => {
            unsubscribeEscape();
            unsubscribeToggleDrawer();
        };
    }, [active, subscribeKeys]);

    return (
        <>
            <animated.div
                style={{
                    opacity: props.opacity,
                    pointerEvents: active ? "all" : "none",
                }}
                className="fill"
                onClick={() => setActive(false)}
            ></animated.div>
            <animated.div
                style={{ right: props.right }}
                className="control-panel-container"
            >
                <div
                    className="control-panel-display-toggle"
                    onClick={() => setActive(!active)}
                ></div>
                <div className="leva-controls-container">
                    <LevaPanels />
                </div>
            </animated.div>
        </>
    );
}
