import React from 'react';
import { CircularProgress } from "@material-ui/core";
import './TurneroSpinner.css';
import PropTypes from 'prop-types';

const TurneroSpinner = ({size}) => {
    return ( 
        <CircularProgress size={size}/>
     );
}

TurneroSpinner.defaultProps = {
    size: "30px"
}

TurneroSpinner.propTypes = {
    size: PropTypes.string
}
 
export default TurneroSpinner;