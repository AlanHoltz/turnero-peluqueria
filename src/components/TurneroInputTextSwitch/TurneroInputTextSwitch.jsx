import React, { forwardRef } from 'react';
import TurneroInput from '../TurneroInput/TurneroInput';
import './TurneroInputTextSwitch.css';
import PropTypes from 'prop-types';


const TurneroInputTextSwitch = forwardRef(({ inputDefaultValue, errorLabel, inputType, title, icon, children, editMode, onInputChange, noMargin, beside, skipInputAltoughEditMode }, ref) => {
    return (
        <div className="turnero_input_text_switch">
            {<span>
                {icon}
                <p className="turnero_input_text_switch_title" style={!icon || noMargin ? { marginLeft: 0 } : null}>{beside ? `${title}:` : title}</p>
                {beside ? <p className="turnero_input_text_switch_beside">{children}</p> : null}
            </span>}
            {editMode && !skipInputAltoughEditMode ? (
                <TurneroInput
                    errorLabel={errorLabel}
                    type={inputType}
                    defaultValue={inputDefaultValue}
                    onChange={(e) => {
                        onInputChange(e);
                    }}
                    ref={ref}
                    value={inputDefaultValue ? "" : children}
                />
            ) : (
                !beside ? children : null
            )}
        </div>
    );
});



TurneroInputTextSwitch.propTypes = {
    errorLabel: PropTypes.string,
    inputTypes: PropTypes.string,
    title: PropTypes.string,
    icon: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
    children: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.node]),
    editMode: PropTypes.bool,
    onInputChange: PropTypes.func,
    noMargin: PropTypes.bool,
    beside: PropTypes.bool,
    skipInputAltoughEditMode: PropTypes.bool,

}

TurneroInputTextSwitch.defaultProps = {
    onInputChange: () => { },
};

export default TurneroInputTextSwitch;