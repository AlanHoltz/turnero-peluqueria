import React from "react";
import "./TurneroChip.css";
import { Chip } from "@material-ui/core";
import PropTypes from 'prop-types';

const TurneroChip = ({label, style, size}) => {
    return <Chip size={size} style={style} className="turnero_chip" label={label} variant="outlined" />;
};

TurneroChip.propTypes = {
    label: PropTypes.string,
    style:PropTypes.object,
    size: PropTypes.string,
}

export default TurneroChip;
