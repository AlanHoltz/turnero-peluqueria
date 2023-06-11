import React from "react";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import "./TurneroInputSelect.css";
import styles from "../../../styles/_export.module.scss";
import { withStyles } from "@material-ui/core";
import PropTypes from 'prop-types';

const TurneroInputSelect = ({ title, fullWidth, style, items, value, onChange, color, includeNone }) => {
    const getStyles = () => {
        return {
            width: fullWidth ? "100%" : null,
            ...style,
        };
    };

    const ModifiedSelect = withStyles(theme => ({
        select: {
            color: color
        },
        icon: {
            color: color
        }
    }))(Select);

    return (

        <FormControl style={getStyles()}>
            <ModifiedSelect className="turnero_input_select" value={value} onChange={onChange} displayEmpty inputProps={{ "aria-label": "Without label" }}>
                <MenuItem value="" disabled>
                    {title}
                </MenuItem>
                {includeNone ? <MenuItem value={-1}>
                    <em>Ninguno</em>
                </MenuItem> : null}
                {items.map((item) => (
                    <MenuItem key={item.value} value={item.value}>{item.name}</MenuItem>
                ))}
            </ModifiedSelect>

        </FormControl>


    );
};

TurneroInputSelect.defaultProps = {
    color: styles.mainColor,
    includeNone: true,
}


TurneroInputSelect.propTypes = {
    title: PropTypes.string,
    fullWidth: PropTypes.bool,
    style: PropTypes.object,
    items: PropTypes.array,
    value: PropTypes.any,
    onChange: PropTypes.func,
    color: PropTypes.string,
    includeNone: PropTypes.bool,
}

export default TurneroInputSelect;
