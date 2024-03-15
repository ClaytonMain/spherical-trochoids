import { Components, useInputContext } from "leva/plugin";

const { Row } = Components;

export const JustText = () => {
    const { value }: { value: { text: string } } = useInputContext();

    return (
        <Row style={{ flexWrap: "wrap", color: "white" }}>
            <div style={{ whiteSpace: "pre-line" }}>{value.text}</div>
        </Row>
    );
};
