import React, { useState } from "react";
import "./TurneroTimeRangePicker.css";
import TimeRangePicker from '@wojtekmaj/react-timerange-picker';
import PropTypes from 'prop-types';
import { TimePicker } from "@material-ui/pickers";
import TurneroToolTip from '../../TurneroToolTip/TurneroToolTip';

const TurneroTimeRangePicker = ({ onChange, value, disabled, error, style, errorPlacement }) => {

    const [modalOpen, setModalOpen] = useState(null); //1- PRIMER PICKER 2- SEGUNDO PICKER NULL- SIN MODAL


    const onTimeChange = (date, modify) => {
        const time = date.format("HH:mm");


        onChange(modify === 1 ? [time, value ? value[1] : null] : [value ? value[0] : null, time]);

    };

    return (

        <TurneroToolTip disabled={error ? false : true} title={error ?? ""} enterDelay={0} placement={errorPlacement}>
            <div style={disabled ? { opacity: 0.1, pointerEvents: "none" } : null} className={`turnero_time_range_picker${error ? " turnero_time_range_picker_error" : ""}`}>

                <TimePicker
                    style={{ display: "none" }}
                    ampm={false}
                    DialogProps={{className:"turnero_time_range_picker_dialog"}}
                    open={modalOpen === 1}
                    onClose={() => setModalOpen(null)}
                    label="24 hours"
                    minutesStep={5}
                    TextFieldComponent={() => {
                        return (
                            <div className="turnero_time_range_picker_input" onClick={() => setModalOpen(1)}>
                                {value && value.length > 0 && value[0] ? value[0] : "----"}
                            </div>
                        )
                    }}
                    onChange={(date) => onTimeChange(date, 1)}
                />
                <span>/</span>
                <TimePicker
                    style={{ display: "none" }}
                    ampm={false}
                    open={modalOpen === 2}
                    onClose={() => setModalOpen(null)}
                    label="24 hours"
                    minutesStep={5}
                    DialogProps={{className:"turnero_time_range_picker_dialog"}}
                    TextFieldComponent={() => {
                        return (
                            <div className="turnero_time_range_picker_input" onClick={() => setModalOpen(2)}>
                                {value && value.length && value[1] ? value[1] : "----"}
                            </div>
                        )
                    }}
                    onChange={(date) => onTimeChange(date, 2)}
                />
            </div>
        </TurneroToolTip>
    )

};


TurneroTimeRangePicker.propTypes = {
    onChange: PropTypes.func,
    value: PropTypes.array,
    disabled: PropTypes.bool,
    error: PropTypes.string,
    style: PropTypes.object,
    errorPlacement: PropTypes.string,
}

export default TurneroTimeRangePicker;
