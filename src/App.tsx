import { Loader, OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import { Object3D } from "three";
import Interface from "./Interface/Interface";
import Lights from "./Lights";
// import PerfMonitor from "./PerfMonitor";
import ShortcutWrapper from "./ShortcutWrapper/ShortcutWrapper";
import SphericalTrochoid from "./SphericalTrochoid/SphericalTrochoid";

function App() {
    Object3D.DEFAULT_UP.set(0, 0, 1);
    return (
        /**
         * TODO: Should probably use two separate keyboardcontrols
         * components: one for when not interacting with the leva controls,
         * and another for when doing so. Look into the "domElement" prop
         * in KeyboardControlsProps.
         */
        <ShortcutWrapper>
            <Canvas
                shadows
                camera={{ position: [8, -11, 5] }}
            >
                {/* <PerfMonitor /> */}
                <Suspense fallback={null}>
                    <OrbitControls makeDefault />
                    <Lights />
                    <SphericalTrochoid />
                </Suspense>
            </Canvas>
            <Loader />
            <Interface />
        </ShortcutWrapper>
    );
}

export default App;
