import * as math from "mathjs";
import { useEffect } from "react";
import { useSaved } from "../stores/useSaved.tsx";
import { useTemporary } from "../stores/useTemporary.tsx";
import { getCurrentInputs } from "./shared.tsx";

/**
 * TODO:
 *   - Come up with better names for the "ptzation" stuff.
 *   - Add correct Torus ptzations.
 */
const spherePtzationFormatter = (
    theta: StringOrNumber,
    phi: StringOrNumber,
    R1: StringOrNumber,
    r: StringOrNumber
) => ({
    outerCenter: [
        `( ( ${R1} ) + ( ${r} ) ) * cos( ${theta} ) * cos( ${phi} )`,
        `( ( ${R1} ) + ( ${r} ) ) * sin( ${theta} ) * cos( ${phi} )`,
        `( ( ${R1} ) + ( ${r} ) ) * sin( ${phi} )`,
    ],
    contactPoint: [
        `( ${R1} ) * cos( ${theta} ) * cos( ${phi} )`,
        `( ${R1} ) * sin( ${theta} ) * cos( ${phi} )`,
        `( ${R1} ) * sin( ${phi} )`,
    ],
    basisX: [
        `cos( ${theta} ) * cos( ${phi} )`,
        `sin( ${theta} ) * cos( ${phi} )`,
        `sin( ${phi} )`,
    ],
});
const torusPtzationFormatter = (
    theta: StringOrNumber,
    phi: StringOrNumber,
    R1: StringOrNumber,
    R2: StringOrNumber,
    r: StringOrNumber
) => ({
    outerCenter: [
        `( ${R1} + ( ${R2} + ${r} ) * cos( ${phi} ) ) * cos( ${theta} )`,
        `( ${R1} + ( ${R2} + ${r} ) * cos( ${phi} ) ) * sin( ${theta} )`,
        `( ${R2} + ${r} ) * sin(${phi})`,
    ],
    contactPoint: [
        `( ${R1} + ${R2} * cos( ${phi} ) ) * cos( ${theta} )`,
        `( ${R1} + ${R2} * cos( ${phi} ) ) * sin( ${theta} )`,
        `${R2} * sin(${phi})`,
    ],
    basisX: [
        `cos( ${theta} ) * cos( ${phi} )`,
        `sin( ${theta} ) * cos( ${phi} )`,
        `sin( ${phi} )`,
    ],
});

type StringOrNumber = string | number;

interface SpherePtzationParams {
    shape: "Sphere";
    theta: string;
    phi: string;
    R1: number;
    r: number;
}

interface TorusPtzationParams {
    shape: "Torus";
    theta: string;
    phi: string;
    R1: number;
    R2: number;
    r: number;
}

const getPtzations = (params: SpherePtzationParams | TorusPtzationParams) => {
    let ptzations = null;
    if (params.shape === "Sphere") {
        ptzations = spherePtzationFormatter(
            params.theta,
            params.phi,
            params.R1,
            params.r
        );
    } else if (params.shape === "Torus") {
        ptzations = torusPtzationFormatter(
            params.theta,
            params.phi,
            params.R1,
            params.R2,
            params.r
        );
    } else {
        return;
    }
    const { outerCenter, contactPoint, basisX } = ptzations;
    const outerCenterDt = outerCenter.map((x) => math.derivative(x, "t"));
    const contactPointDt = contactPoint.map((x) => math.derivative(x, "t"));
    const basisXDt = basisX.map((x) => math.derivative(x, "t"));
    return {
        outerCenter,
        outerCenterDt,
        contactPoint,
        contactPointDt,
        basisX,
        basisXDt,
    };
};

const getCalculationStuff = () => {
    const inputs = getCurrentInputs();

    if (!inputs) {
        return;
    }

    const calculationType = inputs.calculationType;
    const stepSize = inputs.stepSize;
    const innerGeometryShape = inputs.innerGeometryShape;
    const innerGeometryRadius1 = inputs.innerGeometryRadius1;
    const innerGeometryRadius2 = inputs.innerGeometryRadius2;
    const outerGeometryShape = inputs.outerGeometryShape;
    const outerGeometryRadius = inputs.outerGeometryRadius;
    const dLineRadius = inputs.dLineRadius;
    const curveTheta = inputs.curveTheta;
    const curvePhi = inputs.curvePhi;
    const curveTRange = inputs.curveTRange;

    const parser = math.parser();

    try {
        parser.evaluate(`theta = typed({'number': theta(t) = ${curveTheta}})`);
        parser.evaluate(`phi = typed({'number': phi(t) = ${curvePhi}})`);
        parser.evaluate(`R1 = ${innerGeometryRadius1}`);
        parser.evaluate(`R2 = ${innerGeometryRadius2}`);
        parser.evaluate(`r = ${outerGeometryRadius}`);
        parser.evaluate(`d = ${dLineRadius}`);
        parser.evaluate(`stepSize = ${stepSize}`);
        // TODO: Ensure
    } catch (error) {
        /**
         * TODO: display evaluation error or something.
         * Also, find a way to call out invalid inputs for theta and phi.
         */
        console.log(error);
        return null;
    }

    const ptzations = getPtzations({
        shape: innerGeometryShape,
        theta: curveTheta,
        phi: curvePhi,
        R1: innerGeometryRadius1,
        R2: innerGeometryRadius2,
        r: outerGeometryRadius,
    });
    if (!ptzations) {
        // TODO: Raise some sort of error.
        return null;
    }

    const {
        outerCenter,
        outerCenterDt,
        contactPoint,
        contactPointDt,
        basisX,
        basisXDt,
    } = ptzations;

    parser.evaluate(`outerCenter(t) = [${String(outerCenter)}]`);
    parser.evaluate(`outerCenterDt(t) = [${String(outerCenterDt)}]`);
    parser.evaluate(`contactPoint(t) = [${String(contactPoint)}]`);
    parser.evaluate(`contactPointDt(t) = [${String(contactPointDt)}]`);
    parser.evaluate(`basisX(t) = [${String(basisX)}]`);
    parser.evaluate(`basisXDt(t) = [${String(basisXDt)}]`);

    // parser.evaluate(
    //     "outerCenterBasisX(t) = outerCenter(t) ./ norm(outerCenter(t))"
    // );
    // parser.evaluate(
    //     "outerCenterBasisY(t) = outerCenterDt(t) ./ norm(outerCenterDt(t))"
    // );
    parser.evaluate("outerCenterBasisX(t) = basisX(t)");
    parser.evaluate(
        "outerCenterBasisY(t) = contactPointDt(t) ./ norm(contactPointDt(t))"
    );
    parser.evaluate(
        "outerCenterBasisZ(t) = cross(outerCenterBasisX(t), outerCenterBasisY(t))"
    );
    parser.evaluate(
        "outerCenterBasis(t) = matrixFromColumns(outerCenterBasisX(t), outerCenterBasisY(t), outerCenterBasisZ(t))"
    );

    if (outerGeometryShape === "Circle") {
        parser.evaluate("L = 0");
        parser.evaluate("alpha = L / r");
        parser.evaluate(
            "outerRotationMatrix(t) = resize(\
                matrixFromColumns(\
                    rotate(outerCenterBasisX(t), alpha, outerCenterBasisZ(t)),\
                    rotate(outerCenterBasisY(t), alpha, outerCenterBasisZ(t)),\
                    outerCenterBasisZ(t)\
                ),\
                [4, 4]\
            ).subset(index(4, 4), 1)"
        );
        parser.evaluate(
            "transformMatrix(t) = outerRotationMatrix(t)\
                .subset(\
                    index([1, 2, 3], 4),\
                    outerCenter(t)\
                )"
        );
        parser.evaluate(
            "curveVec(t) = outerCenter(t)\
                + resize(column(outerRotationMatrix(t), 1), [3]) .* -d"
        );
    }

    let curvePoints = new Float32Array();
    let lValues = new Float32Array();

    if (calculationType == "Fixed Interval") {
        const numberOfPoints = Math.ceil(
            (curveTRange[1] - curveTRange[0]) / stepSize
        );
        curvePoints = new Float32Array(numberOfPoints * 3);
        lValues = new Float32Array(numberOfPoints);

        let i = 0;
        let curveVec = null;

        for (let t = curveTRange[0]; t < curveTRange[1]; t += stepSize) {
            parser.set("t", t);

            if (outerGeometryShape === "Circle") {
                parser.evaluate("alpha = L / r");
                curveVec = parser
                    .evaluate(`curveVec(t - ${stepSize})`)
                    .toArray();
                // curveVec = parser.evaluate("contactPoint(t)").toArray();
            } else if (outerGeometryShape === "Sphere") {
                /**
                 * TODO: Write sphere code. Should probably break this function
                 * apart into two functions tbh.
                 */
                return;
            } else {
                /**
                 * TODO: Raise an error or something idk.
                 * This should never happen.
                 */
                return;
            }

            curvePoints[i + 0] = curveVec[0];
            curvePoints[i + 1] = curveVec[1];
            curvePoints[i + 2] = curveVec[2];

            lValues[i / 3] = parser.evaluate("L");

            i += 3;

            if (outerGeometryShape === "Circle") {
                parser.evaluate("L = L + norm(contactPointDt(t)) * stepSize");
            }
        }
    } else if (calculationType == "Endless") {
        console.log("Endless calculation type.");
    } else {
        console.log("Unknown calculation type.");
    }

    useSaved.getState().addToPlotHistory(inputs);

    return { curvePoints, lValues, parser };
};

const Calculations = () => {
    useEffect(() => {
        const unsubscribeCalculationStatus = useTemporary.subscribe(
            (state) => state.calculationStatus,
            (value) => {
                if (value === "needs calculating") {
                    useTemporary.setState({ calculationStatus: "calculating" });
                    const calculationStuff = getCalculationStuff();
                    if (calculationStuff) {
                        useTemporary.setState({
                            fixedIntervalCurvePoints:
                                calculationStuff.curvePoints,
                            lValues: calculationStuff.lValues,
                            parser: calculationStuff.parser,
                        });
                    }
                    useTemporary.setState({ calculationStatus: "ready" });
                }
            }
        );
        return () => {
            unsubscribeCalculationStatus();
        };
    });

    useEffect(() => {
        useTemporary.setState({ calculationStatus: "needs calculating" });
    }, []);

    return <></>;
};

export default Calculations;
