import React, { useState, useEffect } from 'react';
import { DataGrid as MUIDataGrid } from '@mui/x-data-grid';
import TurneroCheckBox from '../TurneroCheckBox/TurneroCheckBox';
import './TurneroDataGrid.css';
import TurneroInput from '../TurneroInput/TurneroInput';
import { AiOutlineSearch, AiOutlinePlus } from 'react-icons/ai';
import PropTypes from 'prop-types';
import TurneroButton from '../TurneroButton/TurneroButton';
import styles from '../../styles/_export.module.scss';
import TurneroIconButton from '../TurneroButton/TurneroIconButton/TurneroIconButton';
import { AiFillDelete } from 'react-icons/ai';
import { HiOutlineEmojiSad } from 'react-icons/hi';

const TurneroDataGrid = ({ getRowClassName, columns, rows, finderLabel, disableToolbar, editionMode, onNewClick, selectionModel, onSelectionModelChange, breakToolbar }) => {



  const [rowsCopy, setRowsCopy] = useState(rows ?? []);



  useEffect(() => {
    if (rows) setRowsCopy([...rows]);
  }, [rows]);

  const escapeRegExp = (value) => {
    return value.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
  }

  const requestSearch = (searchValue) => {

    const searchRegex = new RegExp(escapeRegExp(searchValue), "i");
    const originalRowsCopy = [...rows];
    const filteredRows = originalRowsCopy.filter((row) => {
      try {
        return Object.keys(row).some((field) => {
          return searchRegex.test(row[field].toString());
        });
      } catch { }
    });
    setRowsCopy([...filteredRows]);
  };

  return (

    <MUIDataGrid
      className="turnero_datagrid"
      rows={rowsCopy}
      hideFooter
      style={{ width: "100%" }}
      columns={columns}
      getRowClassName={getRowClassName}
      components={{
        Checkbox: TurneroCheckBox, Toolbar: function () {
          if (!disableToolbar) return TurneroDatagridToolbar;
          return null;
        }(),
        NoRowsOverlay: TurneroDataGridNoResultsOverlay
      }}
      componentsProps={{
        toolbar: disableToolbar ? null :
          {
            onChange: (e) => requestSearch(e.target.value),
            finderLabel: finderLabel,
            selectionModel,
            editionMode,
            breakToolbar,
            onNewClick

          }
      }}
      checkboxSelection={editionMode}
      disableColumnFilter
      disableColumnMenu
      onSelectionModelChange={onSelectionModelChange}
      selectionModel={selectionModel}
      disableSelectionOnClick



    />

  );
}

export default TurneroDataGrid;

const TurneroDatagridToolbar = ({ onChange, finderLabel, selectionModel, editionMode, breakToolbar, onNewClick }) => {

  return (
    <div style={breakToolbar ? { flexDirection: "column", alignItems: "flex-start" } : null} className="turnero_datagrid_toolbar">
      <div style={breakToolbar ? { paddingBottom: "10px" } : null} className="turnero_datagrid_toolbar_first_column">
        <TurneroButton color={styles.secondColor} icon={<AiOutlinePlus color={styles.secondColor} size={20} />} style={
          { borderRadius: "180px", background: styles.mainColor }} label="NUEVO" onClick={onNewClick} />
        {editionMode ? <TurneroIconButton disabled={selectionModel.length < 1} style={{ marginLeft: "10px" }} icon={<AiFillDelete color={styles.deleteButtonColor} />} /> : null}
        {selectionModel.length > 0 ? <p style={{ marginLeft: "10px" }}>{selectionModel.length} filas seleccionadas</p> : null}
      </div>

      <TurneroInput style={breakToolbar ? { width: "100%" } : { width: "300px" }} onChange={onChange} icon={<AiOutlineSearch size={25} />} label={finderLabel} />

    </div>
  );
};


const TurneroDataGridNoResultsOverlay = () => {
  return (
    <div className="turnero_datagrid_no_rows">
      <h2>No hay resultados disponibles para mostrar</h2>
    </div>
  );
};


TurneroDataGrid.defaultProps = {
  columns: [],
  rows: [],
  selectionModel: []
}

TurneroDataGrid.propTypes = {
  columns: PropTypes.array,
  rows: PropTypes.array,
  finderLabel: PropTypes.string,
  disableToolbar: PropTypes.bool,
  editionMode: PropTypes.bool,
  selectionModel: PropTypes.array,
  onSelectionModelChange: PropTypes.func,
  breakToolbar: PropTypes.bool,
  getRowClassName: PropTypes.func,
  onNewClick: PropTypes.func
}