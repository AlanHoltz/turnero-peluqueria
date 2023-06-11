import React, { useState, useEffect } from "react";
import Snackbar from "@material-ui/core/Snackbar";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import { Alert } from "@material-ui/lab";
import "./TurneroSnackBar.css";
import PropTypes from "prop-types";

const TurneroSnackBar = ({ open, type, message, hideOn, onClose, position }) => {
    const [opened, setOpened] = useState(open);

    const handleClose = (event, reason) => {

        if (reason === "clickaway") {
            return;
        };

        setOpened(false);

        onClose();
    };

    useEffect(() => {
        setOpened(open);
    }, [open]);

    return (
        <div className="blackbox_snackbar">
            <Snackbar
                anchorOrigin={position}
                open={opened}
                onClose={handleClose}
                message={message}
                autoHideDuration={hideOn}
                action={
                    <React.Fragment>
                        <IconButton size="small" aria-label="close" color="inherit" onClick={handleClose}>
                            <CloseIcon fontSize="small" />
                        </IconButton>
                    </React.Fragment>
                }
            >
                {type !== "normal" ? (
                    <Alert
                        action={
                            <React.Fragment>
                                <IconButton size="small" aria-label="close" color="inherit" onClick={handleClose}>
                                    <CloseIcon fontSize="small" />
                                </IconButton>
                            </React.Fragment>
                        }
                        severity={type}
                    >
                        {message}
                    </Alert>
                ) : null}
            </Snackbar>
        </div>
    );
};

TurneroSnackBar.defaultProps = {
    onClose: () => { },
    position: {
        vertical: "bottom",
        horizontal: "right",
    }
};

TurneroSnackBar.propTypes = {
    open: PropTypes.bool,
    type: PropTypes.oneOf(["normal", "success", "warning", "error"]),
    message: PropTypes.string,
    hideOn: PropTypes.number,
    onClose: PropTypes.func,
    position: PropTypes.object,
};

export default TurneroSnackBar;
