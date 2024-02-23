import { Loader, OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import { Object3D } from "three";
import Interface from "./Interface/Interface";
import Lights from "./Lights";
import PerfMonitor from "./PerfMonitor";
import Plotter from "./Plotter";
import ShortcutWrapper from "./ShortcutWrapper";

function App() {
    Object3D.DEFAULT_UP.set(0, 0, 1);
    return (
        <ShortcutWrapper>
            <Canvas
                shadows
                camera={{ position: [8, -11, 5] }}
            >
                {/* <PerfMonitor /> */}
                <Suspense fallback={null}>
                    <OrbitControls makeDefault />
                    <Lights />
                    <Plotter />
                </Suspense>
            </Canvas>
            <Loader />
            <Interface />
        </ShortcutWrapper>
    );
}

export default App;
