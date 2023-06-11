import React from "react";
import "./TurneroLayout.css";
import { BsArrowLeft } from "react-icons/bs";
import styles from "../../styles/_export.module.scss";
import TurneroIconButton from "../TurneroButton/TurneroIconButton/TurneroIconButton";
import { useHistory } from "react-router";
import TurneroSpinner from "../TurneroSpinner/TurneroSpinner";
import Turnero404 from "../Turnero404/Turnero404";
import PropTypes from "prop-types";

const TurneroLayout = ({ title, icon, children, allowGoBack, loading, notFound }) => {
    const history = useHistory();

    const handleGoBack = () => {
        history.goBack();
    };

    const getLayoutScreen = () => {
        if (notFound) return <TurneroLayout404 />;
        /*SI NO ESTÁ CARGANDO NI HAY UN 404 SE RENDERIZA EL COMPONENTE DADO*/
        return (
            <>
                <div className="turnero_layout_header">
                    {allowGoBack ? (
                        <TurneroIconButton
                            onClick={handleGoBack}
                            color={styles.mainColor}
                            style={{ marginRight: "10px", padding: 0 }}
                            icon={<BsArrowLeft size={30} />}
                        />
                    ) : null}
                    <div className="turnero_layout_header_title">
                        {icon}
                        <h2>{title}</h2>
                    </div>
                </div>
                <div className="turnero_layout_body">
                    {children}
                    {loading ? (
                        <div className="turnero_layout_body_backdrop">
                            <TurneroSpinner size={"50px"} />
                        </div>
                    ) : null}
                </div>
            </>
        );
    };

    return <section className="turnero_layout">{getLayoutScreen()}</section>;
};

const TurneroLayout404 = () => {
    return <Turnero404 />;
};

TurneroLayout.propTypes = {
    title: PropTypes.string,
    icon: PropTypes.node,
    children: PropTypes.node,
    allowGoBack: PropTypes.bool,
    loading: PropTypes.bool,
    notFound: PropTypes.bool,
};

export default TurneroLayout;
