import React from 'react';
import { KeyboardDateTimePicker } from '@material-ui/pickers';
import PropTypes from 'prop-types';
import { AiTwotoneCalendar } from 'react-icons/ai';
import styles from '../../../styles/_export.module.scss';
import './TurneroInputDateTimePicker.css';

const TurneroInputDateTimePicker = ({ label, onError, onChange, value, style, defaultValue, error }) => {
    return (
        <div style={style} className="turnero_datetime_picker_wrapper">
            <KeyboardDateTimePicker
                variant="dialog"
                ampm={false}
                label={label}
                className="turnero_datetime_picker"
                value={value}
                inputValue={defaultValue}
                onChange={onChange}
                invalidDateMessage={null}
                minDateMessage={null}
                maxDateMessage={null}
                keyboardIcon={<AiTwotoneCalendar color={styles.mainColor} />}
                onError={onError}
                error={error}
                minutesStep={5}
                cancelLabel="Cancelar"
                okLabel="Aceptar"
                disablePast
                DialogProps={{ className: "turnero_datetime_picker_dialog" }}
                format="DD/MM/YYYY HH:mm"
            />
            {error ? <p className="turnero_datetime_picker_error">{error}</p> : null}
        </div>

    );
};

TurneroInputDateTimePicker.propTypes = {
    label: PropTypes.string,
    onError: PropTypes.func,
    onChange: PropTypes.func,
    value: PropTypes.any,
    style: PropTypes.object,
    defaultValue: PropTypes.string,
    error:PropTypes.string
}

export default TurneroInputDateTimePicker;