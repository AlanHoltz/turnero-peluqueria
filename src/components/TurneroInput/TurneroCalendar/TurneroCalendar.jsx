import React from 'react';
import './TurneroCalendar.css';
import PropTypes from 'prop-types';
import { DatePicker } from '@material-ui/pickers';
import moment from 'moment';

const TurneroCalendar = ({value,onChange,initial, disableDate,minDate, maxDate, onMonthChange}) => {
    return (
        <div className='turnero_date_picker'>
            <DatePicker
                autoOk
                orientation="landscape"
                variant="static"
                openTo="date"
                value={value}
                onMonthChange={onMonthChange}
                disablePast
                minDate={minDate}
                shouldDisableDate={disableDate}
                maxDate={maxDate}
                initialFocusedDate={initial}
                disableToolbar
                onChange={onChange}
            />

        </div >
    );
};

TurneroCalendar.propTypes = {
    value: PropTypes.any,
    onChange: PropTypes.func,
    initial: PropTypes.object,
    disableDate: PropTypes.func,
    maxDate: PropTypes.object,
    onMonthChange: PropTypes.func,
    minDate: PropTypes.object,
}

TurneroCalendar.defaultProps = {
    onChange: () => {},
    onMonthChange: () => {},
}

export default TurneroCalendar;