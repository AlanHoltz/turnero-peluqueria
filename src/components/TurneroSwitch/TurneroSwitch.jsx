import React from "react";
import "./TurneroSwitch.css";
import { withStyles } from "@material-ui/styles";
import { Switch } from "@material-ui/core";
import styles from '../../styles/_export.module.scss';
import PropTypes from 'prop-types';

const TurneroSwitch = ({checked,onChange,defaultChecked}) => {
    
    return(
        <Switch defaultChecked={defaultChecked} className="turnero_switch" checked={checked} onChange={onChange}/>
    );
};


TurneroSwitch.propTypes = {
    checked: PropTypes.bool,
    onChange: PropTypes.func,
    defaultChecked: PropTypes.bool,
}

export default TurneroSwitch;
