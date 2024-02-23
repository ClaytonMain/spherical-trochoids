import * as math from "mathjs";
import { useEffect } from "react";
import { useTemporary } from "../../stores/useTemporary.tsx";

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
        `((${R1})+(${r}))cos(${theta})cos(${phi})`,
        `((${R1})+(${r}))sin(${theta})cos(${phi})`,
        `((${R1})+(${r}))sin(${phi})`,
    ],
    contactPoint: [
        `(${R1})cos(${theta})cos(${phi})`,
        `(${R1})sin(${theta})cos(${phi})`,
        `(${R1})sin(${phi})`,
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
        `((${R1} + ${R2})+(${r}))cos(${theta})cos(${phi})`,
        `((${R1})+(${r}))sin(${theta})cos(${phi})`,
        `((${R1})+(${r}))sin(${phi})`,
    ],
    contactPoint: [
        `(${R1})cos(${theta})cos(${phi})`,
        `(${R1})sin(${theta})cos(${phi})`,
        `(${R1})sin(${phi})`,
    ],
});

type StringOrNumber = string | number;

interface SpherePtzationParams {
    shape: "Sphere";
    theta: StringOrNumber;
    phi: StringOrNumber;
    R1: StringOrNumber;
    r: StringOrNumber;
}

interface TorusPtzationParams {
    shape: "Torus";
    theta: StringOrNumber;
    phi: StringOrNumber;
    R1: StringOrNumber;
    R2: StringOrNumber;
    r: StringOrNumber;
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
    const { outerCenter, contactPoint } = ptzations;
    const outerCenterDt = outerCenter.map((x) => math.derivative(x, "t"));
    const contactPointDt = contactPoint.map((x) => math.derivative(x, "t"));
    return { outerCenter, outerCenterDt, contactPoint, contactPointDt };
};

const calculateFixedIntervalPoints = (plotId: number) => {
    const plotSettings =
        useTemporary.getState().plots[plotId].sphericalTrochoid;
    const { innerGeometry, outerGeometry, dLine, curve, fixedInterval } =
        plotSettings;

    const parser = math.parser();

    try {
        parser.evaluate(
            `theta = typed({'number': theta(t) = ${curve.thetaFunction}})`
        );
        parser.evaluate(
            `phi = typed({'number': phi(t) = ${curve.phiFunction}})`
        );
        parser.evaluate(`R1 = ${innerGeometry.radius1}`);
        parser.evaluate(`R2 = ${innerGeometry.radius2}`);
        parser.evaluate(`r = ${outerGeometry.radius}`);
        parser.evaluate(`d = ${dLine.radius}`);
        parser.evaluate(`stepSize = ${fixedInterval.stepSize}`);
    } catch (error) {
        // TODO: display evaluation error or something.
        console.log(error);
        return null;
    }

    const ptzations = getPtzations({
        shape: innerGeometry.shape,
        theta: curve.thetaFunction,
        phi: curve.phiFunction,
        R1: innerGeometry.radius1,
        R2: innerGeometry.radius2,
        r: outerGeometry.radius,
    });
    if (!ptzations) {
        // TODO: Raise some sort of error.
        return null;
    }

    const { outerCenter, outerCenterDt, contactPoint, contactPointDt } =
        ptzations;

    parser.evaluate(`outerCenter(t) = [${String(outerCenter)}]`);
    parser.evaluate(`outerCenterDt(t) = [${String(outerCenterDt)}]`);
    parser.evaluate(`contactPoint(t) = [${String(contactPoint)}]`);
    parser.evaluate(`contactPointDt(t) = [${String(contactPointDt)}]`);

    parser.evaluate("basisX(t) = outerCenter(t) ./ norm(outerCenter(t))");
    parser.evaluate("basisY(t) = outerCenterDt(t) ./ norm(outerCenterDt(t))");
    parser.evaluate("basisZ(t) = cross(basisX(t), basisY(t))");
    parser.evaluate(
        "basis(t) = matrixFromColumns(basisX(t), basisY(t), basisZ(t))"
    );

    if (outerGeometry.shape === "Circle") {
        parser.evaluate("L = 0");
        parser.evaluate("alpha = L * r");
        parser.evaluate(
            "dVec(t) = basis(t) * ([cos(alpha), sin(alpha), 0] .* -d)"
        );
        parser.evaluate("curveVec(t) = outerCenter(t) + dVec(t)");
    }

    const numberOfPoints = Math.ceil(
        (fixedInterval.tMax - fixedInterval.tMin) / fixedInterval.stepSize
    );
    const curvePoints = new Float32Array(numberOfPoints * 3);
    const outerCenterPoints = new Float32Array(numberOfPoints * 3);

    let i = 0;
    let curveVec = null;
    let outerCenterVec = null;

    for (
        let t = fixedInterval.tMin;
        t < fixedInterval.tMax;
        t += fixedInterval.stepSize
    ) {
        parser.set("t", t);

        if (outerGeometry.shape === "Circle") {
            parser.evaluate("alpha = L * r");
            curveVec = parser.evaluate("curveVec(t)").toArray();
            outerCenterVec = parser.evaluate("outerCenter(t)").toArray();
        } else if (outerGeometry.shape === "Sphere") {
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

        outerCenterPoints[i + 0] = outerCenterVec[0];
        outerCenterPoints[i + 1] = outerCenterVec[1];
        outerCenterPoints[i + 2] = outerCenterVec[2];

        i += 3;

        if (outerGeometry.shape === "Circle") {
            parser.evaluate("L = L + norm(contactPointDt(t)) * stepSize");
        }
    }

    return { curvePoints, outerCenterPoints };
};

interface CalculationsProps {
    plotId: number;
}

const Calculations = ({ plotId }: CalculationsProps) => {
    const updateFixedIntervalValueArrays =
        useTemporary.getState().plots[plotId].sphericalTrochoid
            .updateFixedIntervalValueArrays;
    const updateFixedIntervalCalcStatus =
        useTemporary.getState().plots[plotId].sphericalTrochoid
            .updateFixedIntervalCalcStatus;

    useEffect(() => {
        const unsubscribeFixedIntervalStatus = useTemporary.subscribe(
            (state) =>
                state.plots[plotId].sphericalTrochoid.fixedInterval.status,
            (value) => {
                if (value === "needs calculating") {
                    updateFixedIntervalCalcStatus(plotId, "calculating");
                    const fixedIntervalPoints =
                        calculateFixedIntervalPoints(plotId);
                    if (fixedIntervalPoints) {
                        updateFixedIntervalValueArrays(
                            plotId,
                            fixedIntervalPoints.outerCenterPoints,
                            fixedIntervalPoints.curvePoints
                        );
                    }
                    updateFixedIntervalCalcStatus(plotId, "ready");
                }
            }
        );
        return () => {
            unsubscribeFixedIntervalStatus();
        };
    });

    return <></>;
};

export default Calculations;
