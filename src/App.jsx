import React, { useState } from "react";
import { useTransition } from "react-spring";
import Plotter from "./components/plotter/Plotter";
import InfoModal from "./components/infoModal/InfoModal";
import { api } from "./store";
import GitHubLogo from "./images/GitHubLogo.png";
import KoFiLogo from "./images/kofi-logo.png";

function App() {
  const [modalVisible, setModalVisible] = useState(false);
  const transitions = useTransition(modalVisible, {
    from: { opacity: 0, transform: "translateY(-40px)" },
    enter: { opacity: 1, transform: "translateY(0px)" },
    leave: { opacity: 0, transform: "translateY(-40px)" },
  });
  function renderLoop() {
    api.getState().advance();
    requestAnimationFrame(renderLoop);
  }
  renderLoop();

  return (
    <div className="App">
      <div className="top-menu-container">
        <div className="top-menu-inner-container">
          <button
            className="show-modal-button"
            onClick={() => setModalVisible(true)}
            type="button"
          >
            ⓘ
          </button>
          {transitions(
            (style, item, key) =>
              item && (
                <InfoModal
                  style={style}
                  closeModal={() => setModalVisible(false)}
                  key={key}
                />
              )
          )}
        </div>
        <a
          href="https://github.com/ClaytonMain/spherical-trochoids"
          target="_blank"
          rel="noreferrer"
        >
          <div className="top-menu-inner-container">
            <img
              style={{
                border: "0px",
                height: "80%",
              }}
              src={GitHubLogo}
              border="0"
              alt="View the source on GitHub"
            />
          </div>
        </a>
        <a href="https://ko-fi.com/Y8Y1EATSL" target="_blank" rel="noreferrer">
          <div className="top-menu-inner-container">
            <img
              // height="35"
              style={{ border: "0px", height: "80%" }}
              src={KoFiLogo}
              border="0"
              alt="Buy Me a Coffee at ko-fi.com"
            />
          </div>
        </a>
      </div>

      <Plotter />
    </div>
  );
}

export default App;
