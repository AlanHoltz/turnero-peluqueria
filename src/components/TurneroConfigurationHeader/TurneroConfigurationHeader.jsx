import React from "react";
import "./TurneroConfigurationHeader.css";
import TurneroButton from "../TurneroButton/TurneroButton";
import { MdEdit } from "react-icons/md";
import styles from "../../styles/_export.module.scss";
import { AiFillDelete, AiOutlineSave } from "react-icons/ai";
import { TiCancel } from "react-icons/ti";
import PropTypes from 'prop-types';

const TurneroConfigurationHeader = ({
    onDeleteClick,
    onSaveClick,
    onEditClick,
    onCancelClick,
    editMode,
    allowEdit = true,
    allowDelete = true,
    allowCancel = true,
    name,
    style
}) => {
    return (
        <div style={style} className="turnero_configuration_header">
            <h2>{name}</h2>
            <div className="turnero_configuration_header_buttons">
                {!editMode ? (
                    <>
                        {allowEdit ? <TurneroButton onClick={onEditClick} label="Editar" icon={<MdEdit />} color={styles.editButtonColor} /> : null}
                        {allowDelete ? (
                            <TurneroButton
                                label="Eliminar"
                                style={{ marginLeft: "15px" }}
                                icon={<AiFillDelete />}
                                onClick={onDeleteClick}
                                color={styles.deleteButtonColor}
                            />
                        ) : null}
                    </>
                ) : (
                    <>
                        <TurneroButton onClick={onSaveClick} color={styles.acceptButtonColor} icon={<AiOutlineSave />} label="Guardar" />
                        {allowCancel ? <TurneroButton
                            color={styles.deleteButtonColor}
                            onClick={onCancelClick}
                            icon={<TiCancel />}
                            style={{ marginLeft: "15px" }}
                            label="Cancelar"
                        /> : null}
                    </>
                )}
            </div>
        </div>
    );
};

TurneroConfigurationHeader.propTypes = {
    onDeleteClick: PropTypes.func,
    onEditClick: PropTypes.func,
    onSaveClick: PropTypes.func,
    onCancelClick: PropTypes.func,
    editMode: PropTypes.bool,
    allowEdit: PropTypes.bool,
    allowCancel:PropTypes.bool,
    allowDelete:PropTypes.bool,
    name: PropTypes.string,
    style: PropTypes.object,
}

export default TurneroConfigurationHeader;
