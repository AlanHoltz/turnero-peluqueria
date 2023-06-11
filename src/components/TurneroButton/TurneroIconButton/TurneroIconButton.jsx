import React from "react";
import IconButton from "@material-ui/core/IconButton";
import PropTypes from "prop-types";
import './TurneroIconButton.css';

const TurneroIconButton = ({ icon, color, onClick, style, disabled }) => {
    return (
        <IconButton disabled={disabled} className="turnero_icon_button" onClick={onClick} style={{ ...style, color: color, opacity: disabled ? ".3" : 1 }}>
            {icon}
        </IconButton>
    );
};

TurneroIconButton.propTypes = {
    icon: PropTypes.node,
    color: PropTypes.string,
    onClick: PropTypes.func,
    style: PropTypes.object,
    disabled: PropTypes.bool
};

export default TurneroIconButton;
