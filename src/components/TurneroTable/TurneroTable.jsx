import React from "react";
import DataTable, { createTheme } from "react-data-table-component";
import styles from "../../styles/_export.module.scss";
import PropTypes from "prop-types";

const TurneroTable = ({ columns, rows, conditional }) => {
    createTheme("turneroTheme", {
        background: {
            default: "none",
        },
        text: {
            primary: styles.mainColor,
        },
        divider: {
            default: styles.mainColorTransparent,
        },
    });

    const customStyles = {
        headRow: {
            style: {
                fontSize: "18px",
            },
        },
        cells: {
            style: {
                fontSize: "15px",
            },
        },
    };

    return <DataTable customStyles={customStyles} theme={"turneroTheme"} columns={columns} conditionalRowStyles={conditional} data={rows} />;
};

TurneroTable.propTypes = {
    columns: PropTypes.array,
    rows: PropTypes.array,
    conditional: PropTypes.array,
};

export default TurneroTable;
