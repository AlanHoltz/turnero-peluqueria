import React from "react";
import "./TurneroButton.css";
import Button from "@material-ui/core/Button";
import PropTypes from "prop-types";
import TurneroSpinner from "../TurneroSpinner/TurneroSpinner";
import styles from '../../styles/_export.module.scss';

const TurneroButton = ({ fullWidth, onClick, label, icon, disabled, loading, color, style }) => {


    return (
        <Button
            style={{ color: `${color}`, border: `1px solid ${color}`, ...style, opacity: disabled ? ".5" : "1", pointerEvents: disabled ? "none" : null }}
            disabled={disabled || loading} startIcon={icon} onClick={onClick} fullWidth={fullWidth} variant="outlined">
            {loading ? <TurneroSpinner size="24px" /> : label}
        </Button>
    );
};

TurneroButton.defaultProps = {
    color: styles.mainColor
}

TurneroButton.propTypes = {
    fullWidth: PropTypes.bool,
    onClick: PropTypes.func,
    label: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
    icon: PropTypes.node,
    disabled: PropTypes.bool,
    loading: PropTypes.bool
}

export default TurneroButton;
