import React from "react";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import TurneroButton from "../TurneroButton/TurneroButton";
import { withStyles } from "@material-ui/styles";
import styles from "../../styles/_export.module.scss";
import PropTypes from 'prop-types';

const TurneroDialog = ({ style, open, title, body, onAcceptClick, onDeclineClick, bodyText, noButtons, noTitle, onClose, noBodyText, acceptButtonText, declineButtonText }) => {


    const ModifiedDialog = withStyles((theme) => ({
        paper: {
            background: styles.secondColor,
            color: styles.mainColor,
            margin: 0,
        },
    }))(Dialog);

    const ModifiedDialogContextText = withStyles((theme) => ({
        root: {
            color: styles.mainColor,
        },
    }))(DialogContentText);



    return (
        <ModifiedDialog onClose={onClose} open={open} aria-labelledby="form-dialog-title">
            {!noTitle ? <DialogTitle>{title}</DialogTitle> : null}
            <DialogContent style={{ ...style }}>

                {noBodyText ? null : <ModifiedDialogContextText>{bodyText}</ModifiedDialogContextText>}
                {body}

            </DialogContent>
            {!noButtons ? <DialogActions>
                <TurneroDialogButtons acceptButtonText={acceptButtonText} declineButtonText={declineButtonText} onCancelClick={onDeclineClick} onAcceptClick={onAcceptClick} />
            </DialogActions> : null}
        </ModifiedDialog>
    );
};


const TurneroDialogButtons = ({ onAcceptClick, onCancelClick, style, acceptButtonText, declineButtonText }) => {
    return (
        <div style={style}>
            <TurneroButton onClick={onCancelClick} style={{ marginRight: "4px", border: "0", color: styles.mainColor }} color={styles.deleteButtonColor} label={declineButtonText} />
            <TurneroButton onClick={onAcceptClick} style={{ marginLeft: "4px", background: styles.mainColor, border: "0", color: styles.secondColor }} color={styles.acceptButtonColor} label={acceptButtonText} />
        </div>
    )
};



TurneroDialog.propTypes = {
    open: PropTypes.bool,
    title: PropTypes.string,
    body: PropTypes.node,
    onAcceptClick: PropTypes.func,
    onDeclineClick: PropTypes.func,
    bodyText: PropTypes.string,
    noButtons: PropTypes.bool,
    noTitle: PropTypes.bool,
    onClose: PropTypes.func,
    noBodyText: PropTypes.bool,
    acceptButtonText: PropTypes.string,
    declineButtonText: PropTypes.string,
};

TurneroDialog.defaultProps = {
    acceptButtonText: "Aceptar",
    declineButtonText: "Cancelar"
}

export default TurneroDialog;
export { TurneroDialogButtons };
