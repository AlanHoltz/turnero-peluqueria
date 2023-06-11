import React from "react";
import "./TurneroButtonSelection.css";
import { Chip } from "@material-ui/core";
import styles from "../../styles/_export.module.scss";
import PropTypes from 'prop-types';
//import { ButtonBase } from "@material-ui/core";
import TurneroButton from "../TurneroButton/TurneroButton";

const TurneroButtonSelection = ({ style, selected, buttons, onSelectedChange, usingChips, vertical }) => {



    return (
        <div style={style} className={`turnero_button_selection${vertical ? " turnero_button_selection_vertical" : ""}`}>
            {buttons.map((button, index) => {
                const props = {
                    key: button.id,
                    style: {
                        background: selected === button.id ? styles.mainColor : null,
                        color: selected === button.id ? styles.secondColor : styles.mainColor,
                        margin: "5px",
                        /*marginLeft: (index > 0 && !vertical) ? "10px" : null,
                        marginBottom: (index < (buttons.length - 1) && vertical )? "10px" : null, */
                    },
                    clickable: true,
                    onClick: () => {
                        onSelectedChange(button);
                    },
                    label: button.label,
                };

                if (usingChips) return <Chip {...{...props,className: "turnero_button_selection_button"}} />
                return <TurneroButton {...props} />
            })}
        </div>
    );
};

TurneroButtonSelection.defaultProps = {
    onSelectedChange: () => { },
    usingChips: true,
}

TurneroButtonSelection.propTypes = {
    selected: PropTypes.any,
    buttons: PropTypes.array,
    onSelectedChange: PropTypes.func,
    style: PropTypes.object,
    usingChips: PropTypes.bool,
    vertical: PropTypes.bool,
}


export default TurneroButtonSelection;
