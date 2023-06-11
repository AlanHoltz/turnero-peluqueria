import React, { useState, useEffect, useContext } from 'react';
import './TurneroConfigurationFreeDays.css';
import TurneroLayout from '../../../../components/TurneroLayout/TurneroLayout';
import { MdFreeBreakfast } from "react-icons/md";
import TurneroDataGrid from '../../../../components/TurneroDataGrid/TurneroDataGrid';
import { AiFillDelete } from 'react-icons/ai';
import { MdEdit } from 'react-icons/md';
import TurneroIconButton from '../../../../components/TurneroButton/TurneroIconButton/TurneroIconButton';
import styles from '../../../../styles/_export.module.scss';
import useScreenWidth from '../../../../hooks/useScreenWidth';
import axios from 'axios';
import { getRootPath } from '../../../../functions/getRootPath';
import { getFormattedDate, getParsedDate } from '../../../../functions/dateHandler';
import moment from 'moment';
import TurneroDialog, { TurneroDialogButtons } from '../../../../components/TurneroDialog/TurneroDialog';
import TurneroInputDateTimePicker from '../../../../components/TurneroInput/TurneroInputDateTimePicker/TurneroInputDateTimePicker';
import TurneroInput from '../../../../components/TurneroInput/TurneroInput';
import TurneroCheckBox from '../../../../components/TurneroCheckBox/TurneroCheckBox';
import TurneroSnackbar from '../../../../components/TurneroSnackBar/TurneroSnackBar';
import { errorContext } from '../../../../contexts/errorContext';

const TurneroConfigurationFreeDays = () => {


    const width = useScreenWidth();
    const [freeDays, setFreeDays] = useState([]);
    const [createOrEditModal, setCreateOrEditModal] = useState(false);
    const [selectedFreeDay, setSelectedFreeDay] = useState(null);
    const [snackbar, setSnackbar] = useState(false);
    const [deleteModal, setDeleteModal] = useState(false);
    const [loading, setLoading] = useState(false);

    const { setException } = useContext(errorContext);

    const columns = [
        {
            field: 'description',
            headerName: 'Descripción',
            width: width < 798 ? 200 : null,
            flex: width < 798 ? null : 1,
            sortable: true,
            renderCell: (params) => <span style={{ fontWeight: 600, fontSize: "16px" }}>{params.value}</span>
        },
        {
            field: 'datetime',
            headerName: 'Fecha y Hora',
            width: 300,
            sortable: true,
            renderCell: (params) => {

                const beginingTime = moment(params.value[0]).format(`HH:mm`);
                if (beginingTime === "00:00") {
                    const endingTime = moment(params.value[0]).add(24 * 60 - 1, "minutes").format(`DD/MM/YYYY - HH:mm`);
                    if (endingTime === moment(params.value[1]).format(`DD/MM/YYYY - HH:mm`)) {
                        return (
                            <p>
                                {moment(params.value[0]).format(`DD/MM/YYYY`)}
                            </p>
                        )
                    };
                };

                return (
                    <p>
                        {getFormattedDate(params.value[0])} <span style={{ margin: "0 5px", color: styles.deleteButtonColor, fontWeight: "bold", fontSize: "13px" }}>/</span> {getFormattedDate(params.value[1])}

                    </p>
                )
            }
        },
        {
            field: 'type',
            headerName: 'Frecuencia',
            width: width < 798 ? 200 : null,
            flex: width < 798 ? null : 1,
            sortable: true,
            renderCell: (params) => <p>{params.value === "anual" ? "Anual" : "Una Vez"}</p>
        },
        {
            field: 'actions',
            headerName: 'Acciones',
            width: width < 798 ? 200 : null,
            flex: width < 798 ? null : 1,
            sortable: true,
            renderCell: (params) => {
                return (
                    <div>
                        <TurneroIconButton onClick={() => {
                            setSnackbar(false);
                            setSelectedFreeDay(params.value);
                            setCreateOrEditModal(true);
                        }} color={styles.editButtonColor} icon={<MdEdit size={20} />} />
                        <TurneroIconButton onClick={() => {
                            setSnackbar(false);
                            setSelectedFreeDay(params.value);
                            setDeleteModal(true);
                        }} style={{ marginLeft: "10px" }} color={styles.deleteButtonColor} icon={<AiFillDelete size={20} />} />
                    </div>
                )
            }
        },


    ];



    const getFreeDays = async () => {
        setLoading(true);
        const freeDaysRequest = await axios.get(`${getRootPath()}/free-days`, { withCredentials: true });
        setLoading(false);
        setFreeDays([...freeDaysRequest.data]);
    };

    useEffect(getFreeDays, []);

    const getFormattedRows = () => {
        return freeDays.map(freeDay => ({
            id: freeDay.free_day_id,
            description: freeDay.free_day_description,
            type: freeDay.free_day_frequency,
            datetime: [freeDay.free_day_starting_timestamp, freeDay.free_day_ending_timestamp],
            actions: freeDay
        }));
    };

    const onDeleteAcceptClick = async () => {
        const req = await axios.delete(`${getRootPath()}/free-days/${selectedFreeDay.free_day_id}`, { withCredentials: true })
        if (req.data.deleted) {
            setSnackbar(true);
            setDeleteModal(false);
            getFreeDays();
        };
    };


    return (
        <TurneroLayout loading={loading} allowGoBack icon={<MdFreeBreakfast size={25} />} title="DÍAS LIBRES">

            <TurneroDataGrid onNewClick={() => { setSnackbar(false); setSelectedFreeDay(null); setCreateOrEditModal(true) }} breakToolbar={width < 720} editionMode={false} columns={columns} rows={getFormattedRows()} finderLabel='Buscar en Días Libres' />

            <TurneroDialog noBodyText
                style={{ padding: 0 }}
                onClose={() => {
                    setCreateOrEditModal(false);
                    setSelectedFreeDay(null)

                }}
                title={selectedFreeDay ? "EDITAR DÍA LIBRE" : "NUEVO DÍA LIBRE"}
                noButtons open={createOrEditModal} body={
                    <TurneroConfigurationFreeDaysCreateOrEditModal setException={setException} getFreeDays={getFreeDays} setSnackbar={setSnackbar} snackbar={snackbar} selectedFreeDay={selectedFreeDay} setCreateOrEditModal={setCreateOrEditModal} />
                } />

            <TurneroDialog
                onClose={() => {
                    setDeleteModal(false);
                    setSelectedFreeDay(null)
                }}
                title={"ELIMINAR DÍA LIBRE"}
                onDeclineClick={() => {
                    setDeleteModal(false);
                    setSelectedFreeDay(null);

                }}
                onAcceptClick={onDeleteAcceptClick}
                open={deleteModal} bodyText={`¿Está seguro que deseas eliminar el día libre ${selectedFreeDay?.free_day_description}?`} />


            <TurneroSnackbar
                onClose={() => {
                    setSnackbar(false);
                }}
                hideOn={4000}
                type={"success"}
                message={"Los cambios han sido guardados"}
                open={snackbar}
            />

        </TurneroLayout>
    );
};



const TurneroConfigurationFreeDaysCreateOrEditModal = ({ getFreeDays, setCreateOrEditModal, selectedFreeDay, setSnackbar, snackbar, setException }) => {

    const [inputs, setInputs] = useState({
        free_day_description: "",
        free_day_starting_timestamp: null,
        free_day_ending_timestamp: null,
        free_day_frequency: "once",
    });

    const [errors, setErrors] = useState({
        free_day_description: null,
        free_day_starting_timestamp: null,
        free_day_ending_timestamp: null,
    })

    useEffect(() => {
        if (selectedFreeDay) setInputs({ ...selectedFreeDay });
    }, [selectedFreeDay]);

    const onAcceptClick = async () => {

        try {
            let req;

            if (selectedFreeDay) {
                req = await axios.put(`${getRootPath()}/free-days/${selectedFreeDay.free_day_id}`, inputs, { withCredentials: true });
            } else {
                req = await axios.post(`${getRootPath()}/free-days`, inputs, { withCredentials: true })
            };

            if (!req.data.created && !req.data.updated) return setErrors({ ...req.data });


            setCreateOrEditModal(false);
            setSnackbar(true);
            getFreeDays();
        }

        catch (e) {
            setException("Se ha producido un error al crear/modificar el día libre");
        };




    };

    return (
        <div className="turnero_configuration_free_days_create_or_edit">
            <div className="turnero_configuration_free_days_create_or_edit_wrapper" style={{ padding: "0 34px 34px 34px" }}>

                <TurneroInput errorLabel={errors.free_day_description}
                    onChange={(e) => {
                        setInputs({ ...inputs, free_day_description: e.target.value });
                        if (errors.free_day_description) setErrors({ ...errors, free_day_description: null })
                    }}
                    value={inputs.free_day_description} style={{ marginBottom: "20px" }}
                    fullWidth label="Descripción" />

                <TurneroInputDateTimePicker error={errors.free_day_starting_timestamp}
                    onChange={(date, value) => {
                        setInputs({ ...inputs, free_day_starting_timestamp: date?._d });
                        if (errors.free_day_starting_timestamp) setErrors({ ...errors, free_day_starting_timestamp: null })
                    }}
                    value={inputs.free_day_starting_timestamp} style={{ marginBottom: "20px" }} label="Inicio" />

                <TurneroInputDateTimePicker error={errors.free_day_ending_timestamp}
                    onChange={(date, value) => {
                        setInputs({ ...inputs, free_day_ending_timestamp: date?._d });
                        if (errors.free_day_ending_timestamp) setErrors({ ...errors, free_day_ending_timestamp: null })
                    }}
                    value={inputs.free_day_ending_timestamp} style={{ marginBottom: "20px" }} label="Fin" />

                <TurneroCheckBox onChange={() => { setInputs({ ...inputs, free_day_frequency: inputs.free_day_frequency === "anual" ? "once" : "anual" }) }} checked={inputs.free_day_frequency === "anual"} labelPlacement="end" label="Repetir Anualmente" />
            </div>
            <TurneroDialogButtons onAcceptClick={onAcceptClick} onCancelClick={() => { setCreateOrEditModal(false) }} style={{ display: "flex", justifyContent: "flex-end", padding: "9px 4px", width: "100%" }} />
        </div>
    );
};

export default TurneroConfigurationFreeDays;