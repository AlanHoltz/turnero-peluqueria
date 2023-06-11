import React from "react";
import "./TurneroInputTextArea.css";
import PropTypes from 'prop-types';
import styles from '../../../styles/_export.module.scss';

const TurneroTextArea = ({ children, readOnly, style, width, icon, title, onChange, parentStyle, error }) => {
    return (
        <div style={{ ...parentStyle, width: width ?? null }} className="turnero_textarea">
            <div style={error ? { color: styles.errorColor } : null} className="turnero_textarea_top">
                {icon}
                <span style={icon ? { marginLeft: "5px" } : null}>{title}{error ? ` (${error})` : null}</span>
            </div>
            <textarea onChange={onChange} style={{ ...style, width: width ?? null }} className="turnero_textarea_input" value={children} readOnly={readOnly}></textarea>
        </div>
    );
};

TurneroTextArea.propTypes = {
    children: PropTypes.string,
    readOnly: PropTypes.bool,
    width: PropTypes.string,
    style: PropTypes.object,
    title: PropTypes.string,
    icon: PropTypes.node,
    onChange: PropTypes.func,
    error: PropTypes.string,
    parentStyle: PropTypes.object,
}

export default TurneroTextArea;
