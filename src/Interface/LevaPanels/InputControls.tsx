import {
    LevaInputs,
    LevaPanel,
    button,
    folder,
    useControls,
    useCreateStore,
} from "leva";
import { useEffect, useState } from "react";
import { useTemporary } from "../../stores/useTemporary";
import { justText } from "../LevaPlugins/JustText";

export default function InputControls() {
    const [store] = useState(useCreateStore());

    useEffect(() => {
        useTemporary.setState((state) => {
            state.levaStores.input = store;
        });
    }, [store]);

    const [controls] = useControls(
        () => ({
            calculationType: {
                label: "Calculation Type",
                value: "Fixed Interval",
                options: ["Fixed Interval", "Endless"],
            },
            stepSize: {
                label: "Step Size",
                value: 0.01,
                min: 0.01,
                max: 0.1,
                step: 0.01,
            },
            otherTestThing: justText({
                text: "Hooray for such a convoluted system :D",
            }),
            testThing: justText({
                text: "asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf",
            }),
            otherThing: {
                label: "After asdf",
                value: 9999,
            },
            "Inner Geometry": folder({
                innerGeometryShape: {
                    label: "Shape",
                    value: "Sphere",
                    options: ["Sphere", "Torus"],
                },
                innerGeometryRadius1: {
                    label: "Radius 1",
                    value: 4,
                },
                innerGeometryRadius2: {
                    label: "Radius 2",
                    value: 1,
                },
                // innerGeometryNote: {
                //     label: "Note",
                //     value: 'I\'d love for "Radius 1" to just display "Radius" and for "Radius 2" to be hidden when "Sphere" is selected, but we\'ll see how feasible that is.',
                //     editable: false,
                //     rows: true,
                // },
            }),
            "Outer Geometry": folder({
                outerGeometryShape: {
                    label: "Shape",
                    value: "Circle",
                    options: ["Circle", "Sphere"],
                },
                outerGeometryRadius: {
                    label: "Radius",
                    value: 1,
                },
            }),
            "d Line": folder({
                dLineSetRadius: {
                    label: "Set Radius",
                    value: true,
                },
                dLineRadius: {
                    label: "Radius",
                    value: 1,
                },
                // dLineNote: {
                //     label: "Note",
                //     value: 'I want "Radius" to be hidden when "Set Radius" is false. Also, if I can come up with a better label than "Set Radius", that would be great.',
                //     editable: false,
                //     rows: true,
                // },
            }),
            Curve: folder({
                curveTheta: {
                    label: "Theta",
                    value: "2t",
                    type: LevaInputs.STRING,
                },
                curvePhi: {
                    label: "Phi",
                    value: "t",
                    type: LevaInputs.STRING,
                },
                // curveNote1: {
                //     label: "Note",
                //     value: 'It would be really cool if I could use the "plot" plugin with "t" as the variable instead of "x". Will see if it\'s possible to modify/extend this, and if not, will look into custom plugin. Might just have to use regular text field though. :(',
                //     editable: false,
                //     rows: true,
                // },
                curveTRange: {
                    label: "t Range",
                    value: [-10, 40],
                    min: -200,
                    max: 200,
                },
                curveTStart: {
                    label: "t Start",
                    value: "-10",
                },
                // curveNote2: {
                //     label: "Note",
                //     value: 'Would be great to display "t Range" when "Fixed Interval" and "t Start" when "Endless". Or maybe show "t Start" for both, but have something like "t Interval Length" (bad name, but you get the gist) when set to "Fixed Interval".',
                //     editable: false,
                //     rows: true,
                // },
            }),
            "Update Plot": button(() =>
                useTemporary.setState({
                    calculationStatus: "needs calculating",
                })
            ),
        }),
        { store }
    );
    console.log("Input controls:", controls);

    return (
        <LevaPanel
            store={store}
            fill
            flat
            titleBar={{
                title: "Input",
                drag: false,
                filter: false,
            }}
            collapsed={false}
        />
    );
}
