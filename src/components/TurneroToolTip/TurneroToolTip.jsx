import React from "react";
import Tooltip from "@material-ui/core/Tooltip";
import { withStyles } from "@material-ui/core/styles";
import styles from '../../styles/_export.module.scss';
import PropTypes from 'prop-types';

const TurneroToolTip = ({ children, title, placement, enterDelay, disabled }) => {
    const ModifiedToolTip = withStyles((theme) => ({
        tooltip: {
            backgroundColor: "#181818",
            color: styles.mainColor,
            boxShadow: theme.shadows[1],
            fontSize: 11,
        },
    }))(Tooltip);

    return (
        <ModifiedToolTip disableHoverListener={disabled} title={title} enterNextDelay={enterDelay} enterDelay={enterDelay} placement={placement}>
            {children}
        </ModifiedToolTip>
    );
};

TurneroToolTip.defaultProps = {
    enterDelay: 300,
    disabled: false,
};

TurneroToolTip.propTypes = {
    children: PropTypes.object,
    title: PropTypes.string,
    placement: PropTypes.string,
    enterDelay: PropTypes.number,
    disabled: PropTypes.bool,


}

export default TurneroToolTip;
