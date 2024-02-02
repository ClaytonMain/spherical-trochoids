import { KeyboardControls } from "@react-three/drei";
import { ReactNode } from "react";

export enum ShortcutEnum {
    escape = "escape",
    toggleDrawer = "toggleDrawer",
}

interface ShortcutWrapperProps {
    children?: ReactNode;
}

export const ShortcutWrapper = ({ children }: ShortcutWrapperProps) => {
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
