import GitHubLogo from "../../images/GitHubLogo.png";
import KoFiLogo from "../../images/KoFiLogo.png";
import LinkedInLogo from "../../images/LinkedInLogo.png";
import CalculatingMessage from "./CalculatingMessage";
import Drawer from "./Drawer";
// import InfoModal from "./InfoModal";

export default function Interface() {
    return (
        <>
            <CalculatingMessage />
            <Drawer />
            <div className="top-menu-container">
                {/* <div className="top-menu-inner-container">
                    <InfoModal />
                </div> */}
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
                            alt="View the source on GitHub"
                        />
                    </div>
                </a>
                <a
                    href="https://ko-fi.com/Y8Y1EATSL"
                    target="_blank"
                    rel="noreferrer"
                >
                    <div className="top-menu-inner-container">
                        <img
                            // height="35"
                            style={{ border: "0px", height: "80%" }}
                            src={KoFiLogo}
                            alt="Buy Me a Coffee at ko-fi.com"
                        />
                    </div>
                </a>
                <a
                    href="https://www.linkedin.com/in/clayton-main/"
                    target="_blank"
                    rel="noreferrer"
                >
                    <div className="top-menu-inner-container">
                        <img
                            style={{
                                border: "0px",
                                height: "80%",
                            }}
                            src={LinkedInLogo}
                            alt="Check out my LinkedIn profile"
                        />
                    </div>
                </a>
            </div>
        </>
    );
}
