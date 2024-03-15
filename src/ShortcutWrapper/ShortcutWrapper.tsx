import { KeyboardControls } from "@react-three/drei";
import { ReactNode } from "react";
import { ShortcutEnum } from "./types";

interface ShortcutWrapperProps {
    children?: ReactNode;
}

const ShortcutWrapper = ({ children }: ShortcutWrapperProps) => {
    return (
        <KeyboardControls
            map={[
                { name: ShortcutEnum.escape, keys: ["Escape"] },
                { name: ShortcutEnum.toggleDrawer, keys: ["KeyD"] },
            ]}
        >
            {children}
        </KeyboardControls>
    );
};

export default ShortcutWrapper;
