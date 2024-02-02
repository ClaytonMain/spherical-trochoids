import { Loader, OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import Interface from "./Interface";
import Lights from "./Lights";
import PerfMonitor from "./PerfMonitor";
import Plotter from "./Plotter";
import ShortcutWrapper from "./ShortcutWrapper";

function App() {
    return (
        <ShortcutWrapper>
            <Canvas shadows>
                <Suspense fallback={null}>
                    <PerfMonitor />
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
