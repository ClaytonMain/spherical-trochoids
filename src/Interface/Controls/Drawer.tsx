import { animated, useSpring } from "@react-spring/web";
import { useKeyboardControls } from "@react-three/drei";
import { Leva } from "leva";
import { useEffect, useState } from "react";
import { ShortcutEnum } from "../../ShortcutWrapper";

export default function Drawer() {
    const [active, setActive] = useState(true);
    const [subscribeKeys] = useKeyboardControls<ShortcutEnum>();
    const props = useSpring({
        right: active ? 0 : -350,
        opacity: active ? 1 : 0,
    });

    const toggleActive = () => {
        setActive(!active);
    };

    useEffect(() => {
        console.log("Drawer useEffect called");
        const unsubscribeEscape = subscribeKeys(
            (state) => state.escape,
            (pressed) => {
                if (pressed) setActive(false);
            }
        );
        const unsubscribeToggleDrawer = subscribeKeys(
            (state) => state.toggleDrawer,
            (pressed) => {
                if (pressed) toggleActive();
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
                    onClick={() => toggleActive()}
                ></div>
                <div className="leva-controls-container">
                    <Leva
                        fill
                        flat
                        titleBar={{
                            drag: false,
                        }}
                    />
                </div>
            </animated.div>
        </>
    );
}
