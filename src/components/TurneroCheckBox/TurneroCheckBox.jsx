import React, { forwardRef } from "react";
import "./TurneroCheckBox.css";
import styles from "../../styles/_export.module.scss";
import { FormControlLabel } from "@material-ui/core";
import { Checkbox } from "@material-ui/core";
import PropTypes from 'prop-types';


const TurneroCheckBox = forwardRef(({ label, checked, onChange, style, disabled, indeterminate, labelPlacement }, ref) => {
    return label ? (
        <FormControlLabel
            style={{ color: styles.mainColor, margin:"0" }}
            control={
                <Checkbox style={style} onChange={onChange} className="turnero_checkbox" checked={checked} disableRipple inputProps={{ "aria-label": "primary checkbox" }} />
            }
            label={label}
            labelPlacement={labelPlacement ? labelPlacement : "top"}
        />
    ) : (
        <Checkbox indeterminate={indeterminate} disabled={disabled} style={style} checked={checked} onChange={onChange} className="turnero_checkbox" disableRipple inputProps={{ "aria-label": "primary checkbox" }} />
    );
});


TurneroCheckBox.propTypes = {
    checked: PropTypes.bool,
    label: PropTypes.string,
    onChange: PropTypes.func,
    indeterminate: PropTypes.bool,
    labelPlacement:PropTypes.string,
    disabled: PropTypes.bool
}

export default TurneroCheckBox;
