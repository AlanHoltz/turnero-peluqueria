import React from 'react';
import './TurneroRadioButtons.css';
import { Radio } from '@material-ui/core';
import { RadioGroup } from '@material-ui/core';
import { FormControl } from '@material-ui/core';
import { FormControlLabel } from '@material-ui/core';
import { FormLabel } from '@material-ui/core';
import styles from '../../styles/_export.module.scss';
import PropTypes from 'prop-types';


const TurneroRadioButtons = ({ options, value, defaultValue, onChange }) => {

    return (
        <FormControl>
            <RadioGroup
                style={{ color: styles.mainColor }}
                aria-labelledby="demo-radio-buttons-group-label"
                defaultValue={defaultValue}
                value={value}
                onChange={onChange}

            >

                {options.map((option, id) => (
                    <FormControlLabel key={id} value={option} control={<Radio size='small' style={{ color: styles.mainColor }} />} label={option} />
                ))}
            </RadioGroup>
        </FormControl>
    );
};

TurneroRadioButtons.propTypes = {
    options: PropTypes.array,
    value: PropTypes.string,
    defaultValue: PropTypes.string,
    onChange: PropTypes.func
}

TurneroRadioButtons.defaultProps = {
    options: [],
    onChange: () => { }
}


export default TurneroRadioButtons;