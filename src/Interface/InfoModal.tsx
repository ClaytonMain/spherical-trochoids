import { animated, useTransition } from "@react-spring/web";
import { useState } from "react";

const Modal = ({ style, closeModal }) => {
    return (
        <animated.div
            style={{ opacity: style.opacity }}
            onClick={closeModal}
            className="modal-backdrop"
        >
            <animated.div className="modal">
                asdf asdf asdf asdf asdf asdf asdf sadf asdf asdf asdf sadf asdf
                asdf asdf asdf asdf asdf asdf asdf sadf asdf asdf asdf
                <br />
                asdf asdf asdf <br />
                asdf asdf asdf <br />
                asdf asdf asdf <br />
                asdf asdf asdf <br />
                asdf asdf asdf <br />
                asdf asdf asdf <br />
                asdf asdf asdf <br />
                asdf asdf asdf asdf asdf asdf asdf sadf asdf asdf asdf sadf asdf
                asdf asdf asdf asdf asdf asdf asdf sadf asdf asdf asdf
                <br />
                asdf asdf asdf <br />
                asdf asdf asdf <br />
                asdf asdf asdf <br />
                asdf asdf asdf <br />
                asdf asdf asdf <br />
                asdf asdf asdf <br />
                asdf asdf asdf <br />
                asdf asdf asdf asdf asdf asdf asdf sadf asdf asdf asdf sadf asdf
                asdf asdf asdf asdf asdf asdf asdf sadf asdf asdf asdf
                <br />
                asdf asdf asdf <br />
                asdf asdf asdf <br />
                asdf asdf asdf <br />
                asdf asdf asdf <br />
                asdf asdf asdf <br />
                asdf asdf asdf <br />
                asdf asdf asdf <br />
                asdf asdf asdf asdf asdf asdf asdf sadf asdf asdf asdf sadf asdf
                asdf asdf asdf asdf asdf asdf asdf sadf asdf asdf asdf
                <br />
                asdf asdf asdf <br />
                asdf asdf asdf <br />
                asdf asdf asdf <br />
                asdf asdf asdf <br />
                asdf asdf asdf <br />
                asdf asdf asdf <br />
                asdf asdf asdf <br />
                asdf asdf asdf asdf asdf asdf asdf sadf asdf asdf asdf sadf asdf
                asdf asdf asdf asdf asdf asdf asdf sadf asdf asdf asdf
                <br />
                asdf asdf asdf <br />
                asdf asdf asdf <br />
                asdf asdf asdf <br />
                asdf asdf asdf <br />
                asdf asdf asdf <br />
                asdf asdf asdf <br />
                asdf asdf asdf <br />
                asdf asdf asdf asdf asdf asdf asdf sadf asdf asdf asdf sadf asdf
                asdf asdf asdf asdf asdf asdf asdf sadf asdf asdf asdf
                <br />
                asdf asdf asdf <br />
                asdf asdf asdf <br />
                asdf asdf asdf <br />
                asdf asdf asdf <br />
                asdf asdf asdf <br />
                asdf asdf asdf <br />
                asdf asdf asdf <br />
            </animated.div>
        </animated.div>
    );
};

const InfoModal = () => {
    const [showModal, setShowModal] = useState(false);
    const transitions = useTransition(showModal, {
        from: { opacity: 0, transform: "translateY(-40px)" },
        enter: { opacity: 1, transform: "translateY(0px)" },
        leave: { opacity: 0, transform: "translateY(-40px)" },
    });

    return (
        <>
            <button
                className="show-modal-button"
                onClick={() => setShowModal(true)}
                type="button"
            >
                ⓘ
            </button>
            {transitions(
                (style, item) =>
                    item && (
                        <Modal
                            style={style}
                            closeModal={() => setShowModal(false)}
                        />
                    )
            )}
        </>
    );
};

export default InfoModal;
