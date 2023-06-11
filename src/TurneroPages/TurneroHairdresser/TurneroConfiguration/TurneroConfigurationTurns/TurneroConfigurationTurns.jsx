import React, { useEffect, useState, useContext } from 'react';
import './TurneroConfigurationTurns.css';
import TurneroLayout from '../../../../components/TurneroLayout/TurneroLayout';
import { BsCheckBox } from 'react-icons/bs';
import './TurneroConfigurationTurns.css';
import TurneroInput from '../../../../components/TurneroInput/TurneroInput';
import TurneroRadioButtons from '../../../../components/TurneroRadioButtons/TurneroRadioButtons';
import axios from 'axios';
import { getRootPath } from '../../../../functions/getRootPath';
import TurneroConfigurationHeader from '../../../../components/TurneroConfigurationHeader/TurneroConfigurationHeader';
import styles from '../../../../styles/_export.module.scss';
import { alpha } from '@material-ui/core';
import TurneroSnackbar from '../../../../components/TurneroSnackBar/TurneroSnackBar';
import useAuth from '../../../../hooks/useAuth';
import { getParsedTime } from '../../../../functions/dateHandler';
import { errorContext } from '../../../../contexts/errorContext';

const TurneroConfigurationTurns = () => {

    const [params, setParams] = useState({
        interval: "",
        mode: ""
    });
    const [loading, setLoading] = useState(false);
    const [snackbar, setSnackbar] = useState(false);
    const [intervalError, setIntervalError] = useState(false);
    const [auth] = useAuth();

    const { setException } = useContext(errorContext);

    useEffect(async () => {
        setLoading(true)
        const resp = await axios.get(`${getRootPath()}/params?turns_interval=true&same_turns_at_the_moment=true`, { withCredentials: true })
        setLoading(false);
        setParams({
            ...params, interval: resp.data[1].param_value, mode:
                resp.data[0].param_value === "auto" ? "Automático" : "Manual"
        })

    }, []);

    const onSaveClick = async () => {
        try{
            const req = await axios.put(`${getRootPath()}/params?turns_interval=${params.interval}&same_turns_at_the_moment=${params.mode === "Manual" ? "manual" : "auto"}`, {}, { withCredentials: true });
            if (req.data.updated) return setSnackbar(true);
            setIntervalError(true);
        }

        catch(e){
            setException("No se ha podido modificar los parámetros");
        };

    };

    return (
        <TurneroLayout allowGoBack loading={loading} icon={<BsCheckBox size={25} />} title='Configuración de Turnos'>
            {auth.user.hairdresser_privilege_id <= 2 ? <TurneroConfigurationHeader onSaveClick={onSaveClick} style={{ marginBottom: "15px" }} editMode={true} allowCancel={false} /> : null}
            <div style={{ borderTop: `1px solid ${alpha(styles.mainColor, .5)}` }} className="turnero_configuration_turns_param">
                <div className="turnero_configuration_turns_param_description">
                    <h2>Tiempo entre turnos</h2>
                    <p>Define la cantidad de tiempo entre turno y turno que el cliente puede sacar.</p>
                </div>
                {auth.user.hairdresser_privilege_id <= 2 ?
                    <TurneroInput errorLabel={intervalError ? "Ingresa un numero entero" : null}
                        label="Intervalo(minutos)" value={params.interval} onChange={(e) => {
                            setIntervalError(false);
                            setParams({ ...params, interval: e.target.value })
                        }} /> :
                    <div className="turnero_configuration_turns_param_value" >
                        <p>{getParsedTime(parseInt(params.interval) * 60 * 1000, true)}</p>
                    </div>
                }
            </div>
            <div className="turnero_configuration_turns_param">
                <div className="turnero_configuration_turns_param_description">
                    <h2>Cantidad de Turnos</h2>
                    <p>Define la cantidad de turnos que puede haber en un mismo momento.</p>
                </div>
                <div className="turnero_configuration_turns_param_value" >
                    {auth.user.hairdresser_privilege_id <= 2 ? <TurneroRadioButtons onChange={(e) =>
                        setParams({ ...params, mode: e.target.value })} value={params.mode} options={["Automático", "Manual"]} />
                        : <p>{params.mode}</p>}
                </div>

            </div>

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

export default TurneroConfigurationTurns;