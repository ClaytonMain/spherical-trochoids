import { createPlugin } from "leva/plugin";
import { JustText } from "./JustText";
import { normalize } from "./justTextPlugin";

export const justText = createPlugin({
    normalize,
    component: JustText,
});
