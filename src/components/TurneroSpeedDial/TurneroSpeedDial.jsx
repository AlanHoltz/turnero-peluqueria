import React,{useState} from "react";
import SpeedDialIcon from "@material-ui/lab/SpeedDialIcon";
import Backdrop from "@material-ui/core/Backdrop";
import SpeedDial from "@material-ui/lab/SpeedDial";
import SpeedDialAction from "@material-ui/lab/SpeedDialAction";
import { useHistory } from "react-router";
import "./TurneroSpeedDial.css";
import PropTypes from 'prop-types';

const TurneroSpeedDial = ({ elements }) => {
    const history = useHistory();

    const [open, setOpen] = useState(false);
    const [hidden] = useState(false);

 
    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <>
            <Backdrop style={{ zIndex: "1000" }} open={open} />
            <SpeedDial
                ariaLabel="Turnero SpeedDial"
                className="turnero_speed_dial"
                hidden={hidden}
                icon={<SpeedDialIcon />}
                onClose={handleClose}
                onOpen={handleOpen}
                open={open}
            >
                {elements.map((action) => (
                    <SpeedDialAction
                        key={action.name}
                        icon={action.icon}
                        tooltipTitle={action.name}
                        tooltipOpen
                        onClick={() => {
                            history.push(action.path);
                            handleClose();
                        }}
                    />
                ))}
            </SpeedDial>
        </>
    );
};

TurneroSpeedDial.propTypes = {
    elements: PropTypes.array
}

export default TurneroSpeedDial;
