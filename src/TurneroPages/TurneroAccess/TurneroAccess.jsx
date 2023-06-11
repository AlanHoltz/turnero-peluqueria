import React, { useState } from "react";
import "./TurneroAccess.css";
import logo from "../../assets/logo.svg";
import SwipeableViews from "react-swipeable-views";
import TurneroLogin from "./TurneroLogin/TurneroLogin";
import TurneroRegister from "./TurneroRegister/TurneroRegister";

const TurneroAccess = () => {
    const rootStyles = { height: "100%", width: "100%" };
    const containerStyle = { height: "100%" };
    const [showLogin, setShowLogin] = useState(true);


    const getIndex = () => {
        if (showLogin) return 0;
        return 1;
    };

    return (
        <section className="turnero_access">
            <div className="turnero_access_container">
                <div className="turnero_access_data">
                    <SwipeableViews containerStyle={containerStyle} style={rootStyles} index={getIndex()}>
                        <TurneroLogin setShowLogin={setShowLogin} />
                        <TurneroRegister setShowLogin={setShowLogin} />
                    </SwipeableViews>
                </div>
                <div className="turnero_access_brand">
                    <img  src={logo} alt="turnero_brand_logo" />
                </div>
            </div>
        </section>
    );
};

export default TurneroAccess;
