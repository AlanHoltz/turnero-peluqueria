import React, { forwardRef } from "react";
import "./TurneroInput.css";
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import PropTypes from "prop-types";
import styles from "../../styles/_export.module.scss";

const TurneroInput = forwardRef(({ fullWidth, icon, label, type, errorLabel, style, onChange, onBlur ,value, defaultValue }, ref) => {
    return (
        <TextField
            className={"turnero_input"}
            style={style}
            type={type}
            ref={ref}
            onBlur={onBlur}
            error={errorLabel ? true : false}
            helperText={errorLabel ? errorLabel : null}
            label={label}
            defaultValue={defaultValue}
            onChange={(e) => {
                onChange(e);
            }}
            value={value}
            fullWidth={fullWidth}
            InputProps={
                icon
                    ? {
                          startAdornment: (
                              <InputAdornment position="start">
                                  {<div style={{ color: errorLabel ? styles.errorColor : styles.mainColor }}>{icon}</div>}
                              </InputAdornment>
                          ),
                      }
                    : null
            }
        />
    );
});

TurneroInput.defaultProps = {
    onChange: () => {},
};

TurneroInput.propTypes = {
    fullWidth: PropTypes.bool,
    icon: PropTypes.node,
    label: PropTypes.string,
    type: PropTypes.string,
    errorLabel: PropTypes.string,
    style: PropTypes.object,
    onChange: PropTypes.func,
    value: PropTypes.oneOfType([PropTypes.string,PropTypes.number]),
};

export default TurneroInput;
