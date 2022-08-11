import React from "react";
import { animated, useSpring, easings } from "react-spring";
import "./InfoModal.css";

// eslint-disable-next-line react/prop-types
function InfoModal({ style, closeModal }) {
  const upArrowProps = useSpring({
    from: { opacity: 0, y: 0 },
    to: [
      { opacity: 1, y: 0 },
      { opacity: 0, y: -30 },
      { opacity: 0, y: 0 },
    ],
    loop: true,
    config: { duration: 800, easing: easings.easeInOutQuart },
  });
  const downArrowProps = useSpring({
    from: { opacity: 0, y: 30 },
    to: [
      { opacity: 0, y: 0 },
      { opacity: 1, y: 0 },
      { opacity: 0, y: 30 },
    ],
    loop: true,
    config: { duration: 800, easing: easings.easeInOutQuart },
  });
  const scrollWheelProps = useSpring({
    from: { background: "#3c93ff" },
    to: [
      { background: "#fefefd" },
      { background: "#fefefe" },
      { background: "#3c93ff" },
    ],
    loop: true,
    config: { duration: 800, easing: easings.easeInOutExpo },
  });
  const leftMbProps = useSpring({
    from: { background: "#3c93ff" },
    to: [
      { background: "#fefefd" },
      { background: "#fefefe" },
      { background: "#3c93ff" },
    ],
    loop: true,
    config: { duration: 800, easing: easings.easeInOutExpo },
  });
  const mouseGraphicProps = useSpring({
    from: { x: -29.9 },
    to: [
      { x: -30 },
      { x: 29.8 },
      { x: 29.9 },
      { x: 30 },
      { x: -29.8 },
      { x: -29.9 },
    ],
    loop: true,
    config: { duration: 800, easing: easings.easeInOutBack },
  });
  /* eslint-enable no-await-in-loop */
  return (
    <animated.div
      // eslint-disable-next-line react/prop-types
      style={{ opacity: style.opacity }}
      onClick={closeModal}
      className="modal-backdrop"
    >
      <animated.div style={style} className="modal">
        <div className="modal-content-container">
          <div className="mobile-note">
            *Please note: This project is still in development and isn&#39;t
            exactly mobile-friendly just yet.
          </div>
          <div>
            <span className="modal-section-header">Controls</span>
          </div>
          <div className="controls-container">
            <div className="mouse-control-container">
              <div className="mouse-graphic-container">
                <span className="left-mb" />
                <span className="right-mb" />
                <span className="mouse-body" />
                <animated.span
                  className="scroll-wheel"
                  style={scrollWheelProps}
                />
                <animated.span className="up-arrow" style={upArrowProps} />
                <animated.span className="down-arrow" style={downArrowProps} />
              </div>
              <div className="control-footer">
                Use the scroll wheel to zoom in and out.
              </div>
            </div>
            <div className="mouse-control-container">
              <animated.div
                className="mouse-graphic-container"
                style={mouseGraphicProps}
              >
                <animated.span className="left-mb" style={leftMbProps} />
                <span className="right-mb" />
                <span className="mouse-body" />
                <span className="scroll-wheel" />
              </animated.div>
              <div className="control-footer">
                Left-click and drag to pan the camera around.
              </div>
            </div>
            <div className="panel-control-container">
              <div className="panel-graphic-container">
                <div className="panel-header">
                  <svg width="12" height="8" viewBox="0 0 9 5">
                    <path
                      fill="#535790"
                      d="M3.8 4.4c.4.3 1 .3 1.4 0L8 1.7A1 1 0 007.4 0H1.6a1 1 0 00-.7 1.7l3 2.7z"
                    />
                  </svg>
                </div>
                <div className="panel-body">
                  <div className="panel-body-row">
                    <span className="panel-text" style={{ width: "30%" }} />
                    <span className="panel-input-box" />
                  </div>
                  <div className="panel-body-row">
                    <span className="panel-text" style={{ width: "20%" }} />
                    <div className="panel-slider">
                      <span className="panel-slider-left" />
                      <span className="panel-slider-rect" />
                      <span className="panel-slider-right" />
                    </div>
                    <span className="panel-input-box" />
                  </div>
                  <div className="panel-body-row">
                    <span className="panel-text" style={{ width: "25%" }} />
                    <span className="panel-input-box" />
                  </div>
                </div>
              </div>
              <div className="control-footer">
                Use the control panel to modify the canvas elements. Hover your
                mouse over the labels in the control panel to see additional
                info.
              </div>
            </div>
          </div>
        </div>
      </animated.div>
    </animated.div>
  );
}

export default InfoModal;
