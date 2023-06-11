import React, { useState } from 'react';
import './TurneroInputArrows.css';
import { BiLeftArrow, BiRightArrow } from 'react-icons/bi';
import TurneroInput from '../TurneroInput';
import TurneroIconButton from '../../TurneroButton/TurneroIconButton/TurneroIconButton';
import styles from '../../../styles/_export.module.scss';
import PropTypes from 'prop-types';

const TurneroInputArrows = ({ type, onChange, defaultValue }) => {


    const [value, setValue] = useState(defaultValue);

    return (
        <div className="turnero_input_arrows">
            <TurneroIconButton onClick={() => { setValue(value - 1); onChange(value - 1) }} color={styles.mainColor} icon={<BiLeftArrow size={17} />} />
            <TurneroInput onBlur={() => { onChange(value) }} onChange={(e) => { setValue(type === "number" ? parseInt(e.target.value) : e.target.value) }} value={value} type={type} style={{ margin: "0 10px" }} label="Año" />
            <TurneroIconButton onClick={() => { setValue(value + 1); onChange(value + 1) }} color={styles.mainColor} icon={<BiRightArrow size={17} />} />
        </div>
    );
};

TurneroInputArrows.propTypes = {
    type: PropTypes.string,
    onChange: PropTypes.func,
    defaultValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),

}

TurneroInputArrows.defaultProps = {
    onChange: () => { },
}

export default TurneroInputArrows;