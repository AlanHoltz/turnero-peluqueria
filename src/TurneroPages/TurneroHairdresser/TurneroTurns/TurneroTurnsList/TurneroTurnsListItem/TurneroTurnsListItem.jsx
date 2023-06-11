import React from "react";
import "./TurneroTurnsListItem.css";
import { getFormattedDate } from "../../../../../functions/dateHandler";
import { MdAccessTime } from "react-icons/md";
import styles from '../../../../../styles/_export.module.scss';

const TurneroTurnsListElement = ({ onClick, selected, themeColor, data }) => {
    return (
        <div
            style={{ borderColor: themeColor }}
            onClick={() => {
                onClick(data.turn_id);
            }}
            className={`turnero_turn_element ${selected ? "turnero_turn_element_selected" : ""}`}
        >
            <div className="turnero_turn_element_first_column">
                <p>{data.client_name}</p>
                <p>{data.hairdresser_name ? data.hairdresser_name : "Sin preferencia"}</p>
            </div>
            <div className="turnero_turn_element_second_column">
                <div className="turnero_turn_element_paragraph_container">
                    <MdAccessTime color={styles.mainColor}/>
                    <p>{getFormattedDate(data.turn_datetime)}</p>
                </div>
            </div>
        </div>
    );
};

export default TurneroTurnsListElement;
