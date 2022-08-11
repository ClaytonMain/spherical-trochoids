import React, { useState } from "react";
import { useTransition } from "react-spring";
import Plotter from "./components/plotter/Plotter";
import InfoModal from "./components/infoModal/InfoModal";
import { api } from "./store";

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
        <div>
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
        <a href="https://ko-fi.com/Y8Y1EATSL" target="_blank" rel="noreferrer">
          <img
            height="36"
            style={{ border: "0px", height: "36px" }}
            src="https://cdn.ko-fi.com/cdn/kofi5.png?v=3"
            border="0"
            alt="Buy Me a Coffee at ko-fi.com"
          />
        </a>
      </div>

      <Plotter />
    </div>
  );
}

export default App;
