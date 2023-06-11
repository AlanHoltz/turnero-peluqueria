import React, { useState, useEffect, cloneElement, useRef, useContext } from 'react';
import './TurneroClientTurn.css';
import TurneroLayout from '../../../components/TurneroLayout/TurneroLayout';
import { BsPlusCircle } from 'react-icons/bs';
import TurneroButton from '../../../components/TurneroButton/TurneroButton';
import TurneroIconButton from '../../../components/TurneroButton/TurneroIconButton/TurneroIconButton';
import { BsExclamationCircle } from 'react-icons/bs';
import SwipeableViews from 'react-swipeable-views';
import styles from '../../../styles/_export.module.scss';
import TurneroStepper from '../../../components/TurneroStepper/TurneroStepper';
import { BiUserPlus, BiTime, BiCheck } from "react-icons/bi";
import { GiHairStrands } from 'react-icons/gi';
import TurneroSpinner from '../../../components/TurneroSpinner/TurneroSpinner';
import TurneroAvatar from '../../../components/TurneroAvatar/TurneroAvatar';
import { BsArrowRight, BsArrowLeft } from 'react-icons/bs';
import { MdDateRange, MdAddAPhoto } from 'react-icons/md';
import axios from 'axios';
import { getRootPath } from '../../../functions/getRootPath';
import { getUserProfilePhoto, getServicePhoto, getTurnPhoto } from '../../../functions/getPhoto';
import Tweenful, { elastic } from "react-tweenful";
import TurneroCalendar from '../../../components/TurneroInput/TurneroCalendar/TurneroCalendar';
import { getFormattedDate } from '../../../functions/dateHandler';
import TurneroButtonSelection from '../../../components/TurneroButtonSelection/TurneroButtonSelection';
import moment from 'moment';
import _ from 'lodash';
import { BiCommentDetail } from "react-icons/bi";
import { ButtonBase } from '@material-ui/core';
import { AiOutlineClose } from 'react-icons/ai';
import TurneroInputTextArea from '../../../components/TurneroInput/TurneroInputTextArea/TurneroInputTextArea';
import useScreenWidth from '../../../hooks/useScreenWidth';
import TurneroSnackbar from '../../../components/TurneroSnackBar/TurneroSnackBar';
import { socketContext } from '../../../contexts/socketContext';
import { errorContext } from '../../../contexts/errorContext';
import useAuth from '../../../hooks/useAuth';
import TurneroDialog from '../../../components/TurneroDialog/TurneroDialog';
import { useHistory } from 'react-router-dom';
import { ENABLE_PHONE_VERIFICATION } from '../../../constants';

const TurneroClientTurn = () => {

    const [screen, setScreen] = useState("noTurn"); //1-noTurn 2-turn 3-newTurn 4-loading
    const [animate, setAnimate] = useState({ bottom: ["-5%", "0"], opacity: [0, 1] });
    const [currentTurn, setCurrentTurn] = useState({ turn: null, services: null, hairdresser: null });
    const [snackbar, setSnackbar] = useState(false);
    const [verifyPhoneModal, setVerifyPhoneModal] = useState(false);
    const { setException } = useContext(errorContext);
    const socket = useContext(socketContext);
    const [auth] = useAuth();
    const history = useHistory();

    const checkForTurns = async () => {
        setScreen("loading");
        const possibleTurn = await axios.get(`${getRootPath()}/turns/mine`, { withCredentials: true });


        if (possibleTurn.data.turn) {
            setCurrentTurn(possibleTurn.data);
            setScreen("turn");
        } else {
            setScreen("noTurn");
        };

    };

    const getScreen = () => {
        switch (screen) {
            case "noTurn":
                return <NoTurnYet />

            case "turn":
                return <TurneroCurrentTurn currentTurn={currentTurn} />

            case "newTurn":
                return <TurneroNewTurnWizard setException={setException} setSnackbar={setSnackbar} checkForTurns={checkForTurns} setAnimate={setAnimate} animate={animate} />

            case "loading":
                return <TurneroSpinner />
            default:
                break;
        }
    };


    const onNewTurnClick = () => {

        if (auth.user.user_phone || !ENABLE_PHONE_VERIFICATION) {
            setAnimate({ ...animate }); setScreen("newTurn")
        }
        else {
            setVerifyPhoneModal(true);
        };
    };



    useEffect(checkForTurns, []);

    useEffect(() => {
        socket.on("UPDATE_TURNS", (type) => {

            if (type === "MODIFIED") checkForTurns();

        });

        return () => socket.disconnect();
    }, []);

    return (
        <TurneroLayout icon={<BsPlusCircle size={20} />} title="Mis Turnos">
            {(screen === "noTurn" || (screen === "turn" && currentTurn?.turn?.turn_state === 3)) ? <TurneroButton onClick={onNewTurnClick} label="Nuevo Turno" icon={<BsPlusCircle />} style={{ marginLeft: "auto", marginBottom: screen !== "noTurn" ? "10px" : null }} /> : null}
            <Tweenful.div
                className="turnero_client_turn"
                duration={400}
                easing={elastic(0, 1)}
                style={{ position: "relative" }}
                animate={animate}
            >
                {getScreen()}
                <TurneroSnackbar
                    onClose={() => {
                        setSnackbar(false);
                    }}
                    hideOn={4000}
                    type={"success"}
                    message={"Has sacado un turno correctamente"}
                    open={snackbar}
                />
            </Tweenful.div>
            <TurneroDialog
                acceptButtonText={"Ir a Verificar"}
                open={verifyPhoneModal}
                title="¡Ya casi está listo!"
                bodyText={`Para comenzar a sacar turnos, por favor, verifica tu número de teléfono`}
                onDeclineClick={() => {
                    setVerifyPhoneModal(false);
                }}
                onAcceptClick={() => {
                    history.push("/client/profile/phone")
                }}
            />
        </TurneroLayout >
    );
};

const TurneroCurrentTurn = ({ currentTurn }) => {


    const width = useScreenWidth();


    const getTurnStateColor = (state) => {
        const colors = {
            1: styles.acceptedColor,
            2: styles.pendingColor,
            3: styles.rejectedColor,
        };

        return colors[state];
    };

    const getTurnStateString = (state) => {
        const texts = {
            1: "ACEPTADO",
            2: "PENDIENTE DE RESPUESTA",
            3: "RECHAZADO",
        };

        return texts[state];
    };


    return (
        <div className="turnero_current_turn">
            <div className="turnero_current_turn_state_and_hairdresser_observations">
                <p>ESTADO DEL TURNO: <span style={{ color: getTurnStateColor(currentTurn.turn.turn_state) }}>{getTurnStateString(currentTurn.turn.turn_state)}</span></p>

                {currentTurn.turn.turn_hairdresser_observation && currentTurn.turn.turn_state !== 1 && <TurneroInputTextArea readOnly icon={<BiCommentDetail />} title="Observaciones del Peluquero" width={width > 840 ? '400px' : "100%"} style={{ background: styles.lightGray, padding: "5px" }}>
                    {currentTurn.turn.turn_hairdresser_observation}
                </TurneroInputTextArea>}

            </div>

            <TurneroClientTurnTemplate style={{ margin: "20px 0" }} width={width} date={moment(currentTurn.turn.turn_datetime).format("YYYY-MM-DD")} time={moment(currentTurn.turn.turn_datetime).format("HH:mm")} hairdresser={{ user_full_name: currentTurn.turn.hairdresser_name, user_id: currentTurn.turn.hairdresser_id, user_profile_photo: currentTurn.turn.hairdresser_profile_photo }} services={currentTurn.services} />

            {(currentTurn.turn.turn_photo || currentTurn.turn.turn_client_observation) && <div className='turnero_current_turn_client_observations'>
                {currentTurn.turn.turn_photo && <img style={{ marginRight: "15px" }} src={getTurnPhoto(currentTurn.turn.turn_id, currentTurn.turn.turn_photo)} className="turnero_current_turn_observations_image" alt="client_photo" />}
                {currentTurn.turn.turn_client_observation && <TurneroInputTextArea readOnly icon={<BiCommentDetail />} title="Observaciones" width={"100%"} style={{ background: styles.lightGray, padding: "5px" }}>
                    {currentTurn.turn.turn_client_observation}
                </TurneroInputTextArea>}
            </div>}

        </div>

    );
};




const TurneroNewTurnWizard = ({ animate, setAnimate, checkForTurns, setSnackbar, setException }) => {

    const [step, setStep] = useState(0);
    const [inputs, setInputs] = useState({ hairdresser: undefined, date: undefined, time: null, services: [], observation: "", photo: null });
    const [params, setParams] = useState(null);
    const [hairdressers, setHairdressers] = useState([]);
    const [withoutPreference, setWithoutPreference] = useState(false);

    const steps = ["Elige tu Peluquero", "Elige Fecha", "Elige Hora", "Elige los Servicios", "Finalizar"];


    const onConfirmClick = async (setLoading) => {

        if (inputs.observation && !(inputs.observation.length >= 4 && inputs.observation.length < 100)) return setLoading(false);

        try {

            const newTurnReq = await axios.post(`${getRootPath()}/turns`, {
                ...inputs, services: inputs.services.map(se => se.service_id),
                hairdresser: inputs.hairdresser.user_id, time: inputs.time.label
            }, { withCredentials: true });

            if (newTurnReq.data.created) {
                //SE SUBE LA FOTO DEL USUARIO SI ES QUE HAY UNA
                if (inputs.photo) {
                    const formData = new FormData();
                    formData.append("myImage", inputs.photo);
                    const photoReq = await axios.put(`${getRootPath()}/turns/${newTurnReq.data.created}/photo`, formData, { withCredentials: true });
                    if (photoReq.data.error) setException("No se ha podido cargar la foto del turno");
                };

                setAnimate({ ...animate });
                setSnackbar(true);
                checkForTurns();

            };
        } catch (e) {
            setException("Se ha producido un error al cargar el turno");
        }

    };

    useEffect(async () => {
        const pReq = await axios.get(`${getRootPath()}/params`, { withCredentials: true });
        setParams([...pReq.data]);
    }, []);

    return (
        <div className='turnero_new_turn'>
            <TurneroStepper style={{ marginBottom: "15px" }} icons={{
                0: <BiUserPlus size={25} />,
                1: <MdDateRange size={25} />,
                2: <BiTime size={25} />,
                3: <GiHairStrands size={25} />,
                4: <BiCheck size={25} />
            }} step={step} >
                {steps}
            </TurneroStepper>

            <SwipeableViews containerStyle={{ height: "100%" }} style={{ height: "100%", width: "100%", position: "absolute" }} index={step}>
                <TurneroStep showPrevButton={false} setStep={setStep}>
                    <TurneroHairdresserStep setWithoutPreference={setWithoutPreference} withoutPreference={withoutPreference} hairdressers={hairdressers} setHairdressers={setHairdressers} step={step} inputs={inputs} setInputs={setInputs} />
                </TurneroStep>
                <TurneroStep setStep={setStep}>
                    <TurneroDateStep params={params} step={step} inputs={inputs} setInputs={setInputs} />
                </TurneroStep>
                <TurneroStep setStep={setStep}>
                    <TurneroTimeStep setWithoutPreference={setWithoutPreference} withoutPreference={withoutPreference} hairdressers={hairdressers} step={step} inputs={inputs} setInputs={setInputs} />
                </TurneroStep>
                <TurneroStep setStep={setStep}>
                    <TurneroServicesStep params={params} step={step} inputs={inputs} setInputs={setInputs} />
                </TurneroStep>
                <TurneroStep loadingOnNext onNextClick={onConfirmClick} nextButtonTitle="Confirmar" nextButtonStyles={{ background: styles.mainColor, color: styles.darkGray }} setStep={setStep}>
                    <TurneroFinishingStep step={step} inputs={inputs} setInputs={setInputs} />
                </TurneroStep>
            </SwipeableViews>


        </div>
    );
};

const NoTurnYet = () => {
    return (
        <div className="turnero_no_turn_yet">
            <BsExclamationCircle size={35} />
            <h2>Aún no has sacado ningún turno</h2>
            <p>Para sacar un turno presionar 'Nuevo Turno'</p>
        </div>
    );
};


const TurneroStep = ({ loadingOnNext = false, setStep, children, showPrevButton = true, showNextButton = true, onNextClick, nextButtonStyles, nextButtonTitle }) => {

    const [loading, setLoading] = useState(false);
    const [disableNext, setDisableNext] = useState(false);

    const onButtonNextClick = async () => {

        setLoading(true);

        if (onNextClick) {
            await onNextClick(setLoading);
        }
        else {
            setStep(step => step + 1);
            setLoading(false);
        };




    };

    return (
        <div className="turnero_new_turn_step">

            <div className="turnero_new_turn_step_body">
                {cloneElement(children, { loading, setLoading, setDisableNext })}
            </div>
            <div style={{ justifyContent: showPrevButton ? null : "flex-end" }} className="turnero_new_turn_step_buttons">
                {showPrevButton ? <TurneroButton disabled={loading} icon={<BsArrowLeft />} label="Ir Atrás" onClick={() => setStep(step => step - 1)} /> : null}
                {showNextButton ? <TurneroButton style={nextButtonStyles} disabled={loading || disableNext} icon={<BsArrowRight />} label={nextButtonTitle ?? "Continuar"} onClick={onButtonNextClick} /> : null}
            </div>

        </div>
    );
};


const TurneroHairdresserStep = ({ step, setInputs, setWithoutPreference, withoutPreference, inputs, setLoading, loading, setDisableNext, hairdressers, setHairdressers }) => {


    useEffect(async () => {
        if (step === 0) {
            if (withoutPreference && inputs.hairdresser !== null) setInputs({ ...inputs, hairdresser: null });
            setLoading(true);
            const hReq = await axios.get(`${getRootPath()}/users/hairdressers?onlyEnabledOnes=true`, { withCredentials: true });
            setLoading(false);
            setHairdressers([...hReq.data]);
        };

    }, [step]);

    useEffect(() => {
        if (inputs.hairdresser === undefined) return setDisableNext(true);
        setDisableNext(false);

    }, [inputs.hairdresser]);


    return (
        <>
            {loading ? <div className="turnero_new_turn_step_body_loading">
                <TurneroSpinner size='30px' />
            </div> :
                <div className="turnero_new_turn_hairdresser">
                    <div className="turnero_new_turn_hairdresser_grid">
                        <div
                            onClick={() => {
                                setWithoutPreference(true);
                                setInputs({ ...inputs, hairdresser: null });
                            }}
                            style={inputs.hairdresser === null ? { transform: "scale(1.05)", borderTop: "5px solid #4AF517" } : null} className="turnero_new_hairdresser_grid_element">
                            <span>Sin Preferencia</span>
                        </div>

                        {hairdressers.map(hairdresser => (
                            <div style={inputs.hairdresser?.user_id === hairdresser.user_id ? { transform: "scale(1.05)", borderTop: "5px solid #4AF517" } : null}
                                onClick={() => {
                                    setWithoutPreference(false);
                                    setInputs({ ...inputs, hairdresser: hairdresser });
                                }} key={hairdresser.user_id} className="turnero_new_hairdresser_grid_element">
                                <TurneroAvatar src={getUserProfilePhoto(hairdresser.user_id, hairdresser.user_profile_photo)} name={hairdresser.user_full_name} size={65} />
                                <span>{hairdresser.user_full_name}</span>
                            </div>
                        ))}

                    </div>
                </div>}
        </>
    );
};

const TurneroDateStep = ({ step, setDisableNext, inputs, setInputs, loading, setLoading, params }) => {

    const [unavailableDates, setUnavailableDates] = useState({});
    const [selectedDate, setSelectedDate] = useState({ month: moment().month() + 1, year: moment().year() });
    const [minDate, setMinDate] = useState(null);
    const [maxDate, setMaxDate] = useState(undefined);
    //const [loading, setLoading] = useState(false);

    const getFirstAvailableDate = (unavailables) => {
        let currentDate = moment();

        while (unavailables.hairdresserNotWorking.length !== 7) {
            const dayString = currentDate.format("YYYY-MM-DD");
            if (!unavailables.hairdresserNotWorking.includes(currentDate.day())
                && !unavailables.unavailableDaysByTurns.includes(dayString)
                && !unavailables.unavailableDaysByFreeDays.includes(dayString)
            ) {
                return currentDate;
            }
            else {
                currentDate = currentDate.add("days", 1);
            }
        };

    };



    useEffect(async () => {
        if (step === 1) {
            const uReq = await axios.get(`${getRootPath()}/turns/unavailable-dates?hairdresser=${inputs.hairdresser ? inputs.hairdresser.user_id : "null"}&month=${selectedDate.month}&year=${selectedDate.year}`, { withCredentials: true });
            const firstAvailableDay = getFirstAvailableDate({ ...uReq.data });
            const MAX_DIFFERENCE_ALLOWED = parseInt(params[2].param_value);
            setMinDate(firstAvailableDay);
            setMaxDate(moment(Date.now()).add(MAX_DIFFERENCE_ALLOWED, "days"));
            setUnavailableDates({ ...uReq.data });
        } else {
            setMinDate(null);
        };


    }, [step, selectedDate]);

    useEffect(() => {
        if (inputs.date === undefined) return setDisableNext(true);
        setDisableNext(false);

    }, [inputs.date]);

    const disableDate = (date) => {
        return unavailableDates?.hairdresserNotWorking?.includes(date.day())
            || unavailableDates?.unavailableDayByTurns?.includes(date.format("YYYY-MM-DD"))
            || unavailableDates?.unavailableDaysByFreeDays?.includes(date.format("YYYY-MM-DD"))
    };


    return (
        <>
            {loading ? <div className="turnero_new_turn_step_body_loading">
                <TurneroSpinner size='30px' />
            </div> :
                <div className="turnero_new_turn_date">
                    {inputs.date ? <h2>Has seleccionado: <span>{getFormattedDate(inputs.date, "DD/MM/YYYY")}</span></h2> : <h2>No has seleccionado una fecha aún</h2>}
                    {minDate && <TurneroCalendar
                        disableDate={disableDate}
                        maxDate={maxDate}
                        onChange={(d) => { setInputs({ ...inputs, date: d._d }) }}
                        value={inputs.date}
                        minDate={minDate}
                        onMonthChange={(date) => setSelectedDate({ ...selectedDate, month: date.month() + 1, year: date.year() })}
                    />}

                </div>}
        </>
    )
};



const TurneroTimeStep = ({ loading, setLoading, setDisableNext, withoutPreference, inputs, setInputs, step, hairdressers }) => {

    const [times, setTimes] = useState([]);
    const [reFetch, setReFetch] = useState(true);
    //const [hairdressersSchedule, setHairdressersSchedule] = useState(null);

    useEffect(() => {
        if (inputs.time === null) return setDisableNext(true);
        setDisableNext(false);

    }, [inputs.time]);


    useEffect(async () => {

        if (step === 2) {
            setLoading(true);
            const uReq = await axios.get(`${getRootPath()}/turns/availables/?hairdresser=${!withoutPreference ? inputs.hairdresser.user_id : "null"}&date=${inputs.date}`, { withCredentials: true });
            setLoading(false);
            setTimes(withoutPreference ? uReq.data : [...uReq.data]);
            setReFetch(false);
        } else {
            setReFetch(true);
        };



    }, [step]);

    const getTimes = () => {

        if (step !== 2 || reFetch) return [];

        if (!withoutPreference) return times;

        const differentTimes = Object.values(times);
        let finalTimesArray = [];

        differentTimes.forEach(times => {

            times.forEach(time => {
                if (!finalTimesArray.includes(time)) finalTimesArray.push(time);
            });

        });


        return finalTimesArray;
    };

    const calculateHairdresser = (time) => {


        let timesEntries = Object.entries(times);
        const startFromEnd = Math.random() < 0.5;
        timesEntries = startFromEnd ? timesEntries.slice().reverse() : timesEntries;
        let i = 0;
        let foundHairdresser = null;

        while (i < timesEntries.length && !foundHairdresser) {

            if (timesEntries[i][1].includes(time.label)) {
                foundHairdresser = hairdressers.filter(hairdresser => hairdresser.user_id === parseInt(timesEntries[i][0]));
                return setInputs({ ...inputs, hairdresser: foundHairdresser[0], time: time });
            }

            i++;
        };



    };

    const onSelectedChange = (sel) => {

        if (withoutPreference) return calculateHairdresser(sel);

        setInputs({ ...inputs, time: sel });
    };


    return (
        <>
            {loading ? <div className="turnero_new_turn_step_body_loading">
                <TurneroSpinner size='30px' />
            </div> :
                <div className="turnero_new_turn_time">
                    <TurneroButtonSelection onSelectedChange={onSelectedChange} usingChips={false} selected={inputs.time?.id} buttons={getTimes().map((time, id) => ({ id: id, label: time }))} />
                </div>}

        </>
    )
};

const TurneroServicesStep = ({ loading, setLoading, setDisableNext, inputs, setInputs, step, params }) => {

    const [services, setServices] = useState([]);

    useEffect(() => {
        if (inputs.services.length > 0) return setDisableNext(false);
        setDisableNext(true);

    }, [inputs.services]);

    useEffect(async () => {
        if (step === 3) {
            setLoading(true);
            const uReq = await axios.get(`${getRootPath()}/services`, { withCredentials: true });
            setLoading(false);
            setServices(uReq.data);
        };


    }, [step]);



    const onServiceClick = (service) => {

        const MAX_SERVICES_ALLOWED = parseInt(params[3].param_value);

        const IDs = inputs.services.map(ser => ser.service_id);
        const id = service.service_id;

        if (IDs.includes(id)) {
            const index = IDs.indexOf(id);
            const copy = [...inputs.services];
            copy.splice(index, 1);
            setInputs({ ...inputs, services: copy });
        } else {

            if ((inputs.services.length + 1) <= MAX_SERVICES_ALLOWED) {
                setInputs({ ...inputs, services: [...inputs.services, service] });
            };

        };

    };


    return (
        <>
            {loading ? <div className="turnero_new_turn_step_body_loading">
                <TurneroSpinner size='30px' />
            </div> :
                <div className="turnero_new_turn_services">
                    <p style={inputs.services.length > 0 ? null : { opacity: 0 }}>
                        Has seleccionado {inputs.services.length} {inputs.services.length === 1 ? "servicio" : "servicios"}
                    </p>
                    <div className="turnero_new_turn_services_wrapper">
                        {services.map(service => {
                            return (
                                <div key={service.service_id} style={inputs.services.some(ser => ser.service_id === service.service_id) ? { transform: "scale(1.05)", borderTop: "5px solid #4AF517" } : null} onClick={() => onServiceClick(service)}>
                                    <TurneroAvatar src={getServicePhoto(service.service_id, service.service_photo)} name={service.service_name} size={65} />
                                    <span style={{ fontWeight: "bold" }}>{service.service_name}</span>
                                    <span>${service.service_cost}</span>
                                </div>
                            )
                        })}
                    </div>

                </div>}

        </>
    )
};

const TurneroFinishingStep = ({ loading, setLoading, setDisableNext, inputs, setInputs, step }) => {

    const photoRef = useRef(null);
    const width = useScreenWidth();
    const [observationError, setObservationError] = useState(false);


    useEffect(async () => {

        setDisableNext(false);


    }, []);

    const onPhotoUpload = (e) => {
        const [file] = e.target.files;
        if (file) setInputs({ ...inputs, photo: file });
    };

    return (
        <>
            {loading ? <div className="turnero_new_turn_step_body_loading">
                <TurneroSpinner size='30px' />
            </div> :
                <div className="turnero_new_turn_finishing">

                    <TurneroClientTurnTemplate width={width} date={inputs.date} time={inputs.time?.label} hairdresser={inputs.hairdresser} services={inputs.services} />

                    <div className="turnero_new_turn_finishing_observations">
                        {!inputs.photo ? <ButtonBase className="turnero_new_turn_finishing_observations_upload" onClick={() => photoRef.current.click()} style={{ color: styles.mainColor, padding: "5px" }}>
                            <div className="turnero_new_turn_finishing_observations_upload_button">
                                <MdAddAPhoto size={25} />
                                <span>¿Cómo te gustaría que te quede?</span>
                            </div>
                        </ButtonBase> :
                            <div className="turnero_new_turn_finishing_observations_photo">
                                <div className="turnero_new_turn_finishing_observations_photo_delete">
                                    <TurneroIconButton color={styles.deleteButtonColor} onClick={() => setInputs({ ...inputs, photo: null })} icon={<AiOutlineClose color={styles.deleteButtonColor} size={15} />} />
                                </div>

                                <img className="turnero_new_turn_finishing_observations_photo_element" src={URL.createObjectURL(inputs.photo)} alt="client_photo" />
                            </div>
                        }
                        <TurneroInputTextArea error={observationError ? "Entre 4 y 100 carácteres" : null} onChange={(e) => {
                            setInputs({ ...inputs, observation: e.target.value });
                            setObservationError(!(e.target.value.length >= 4 && e.target.value.length < 100) && e.target.value.length !== 0);
                        }} icon={<BiCommentDetail />} title="¿Te gustaría aclarar algo más?" width={"100%"} parentStyle={{ marginLeft: width > 840 ? "20px" : null }} style={{ background: styles.darkGray, padding: "5px" }}>
                            {inputs.observation}
                        </TurneroInputTextArea>
                        {!inputs.photo && <input
                            ref={photoRef}
                            style={{ display: "none" }}
                            type="file"
                            onChange={onPhotoUpload}
                            accept=".png, .jpg, .jpeg, .gif, .svg"
                            name="photo"
                        />}

                    </div>



                </div>}

        </>

    )
};



const TurneroClientTurnTemplate = ({ width, date, time, hairdresser, services, style }) => {

    return (

        <div style={style} className="turnero_client_turn_template_grid">
            <div className="turnero_client_turn_template_grid_first_column">

                <TurneroNewTurnContentWithIcon horizontal={width > 840} style={width > 840 ? { marginBottom: "40px" } : { marginBottom: "20px" }} title="Fecha y Hora" icon={<MdDateRange color={styles.mainColor} size={20} />} >
                    <p className="turnero_client_turn_template_grid_first_column_datetime">{getFormattedDate(`${moment(date).format("YYYY-MM-DD")} ${time}`)}</p>
                </TurneroNewTurnContentWithIcon>
                <TurneroNewTurnContentWithIcon horizontal={width > 840} style={width > 840 ? null : { marginBottom: "20px" }} title="Atendido por" icon={<BiUserPlus color={styles.mainColor} size={20} />} >
                    <div className="turnero_client_turn_template_grid_first_column_hairdresser">
                        <TurneroAvatar src={getUserProfilePhoto(hairdresser?.user_id, hairdresser?.user_profile_photo, true)} name={hairdresser?.user_full_name} size={35} />
                        <p>{hairdresser?.user_full_name}</p>
                    </div>

                </TurneroNewTurnContentWithIcon>


            </div>

            <div className="turnero_client_turn_template_grid_second_column">
                <TurneroNewTurnContentWithIcon horizontal={false} title="Servicios adquiridos" style={width > 840 ? null : { marginBottom: "20px" }} icon={<GiHairStrands color={styles.mainColor} size={20} />} >

                    <div className="turnero_client_turn_template_grid_second_column_services">
                        {services.map(service => (
                            <React.Fragment key={service.service_id}>
                                <div className="turnero_client_turn_template_grid_second_column_services_image_name">
                                    <TurneroAvatar src={getServicePhoto(service.service_id, service.service_photo)} name={service.service_name} size={35} />
                                    <p>{service.service_name}</p>
                                </div>
                                <div style={{ color: styles.mainColor }}>..........................</div>
                                <div className="turnero_client_turn_template_grid_second_column_services_price"><p>${service.service_cost}</p></div>
                            </React.Fragment>
                        ))}
                        <>
                            <div className="turnero_client_turn_template_grid_second_column_services_total_title">
                                TOTAL
                            </div>
                            <div style={{ color: styles.mainColor }}>..........................</div>
                            <div className="turnero_client_turn_template_grid_second_column_services_price_total"><p>${
                                _.sum(services.map(service => service.service_cost))
                            }</p></div>
                        </>
                    </div>

                </TurneroNewTurnContentWithIcon>
            </div>
        </div>

    );
};

const TurneroNewTurnContentWithIcon = ({ icon, title, children, margin, style, horizontal }) => {

    return (
        <div style={{
            display: "flex", flexDirection: horizontal ? "row" : "column", justifyContent: "center",
            alignItems: horizontal ? "center" : "flex-start", ...style
        }}>


            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", marginBottom: horizontal ? null : margin, marginRight: horizontal ? margin : null }}>
                {icon}
                <p style={{ marginLeft: "10px", color: styles.mainColor, fontWeight: 700 }}>{title}:</p>
            </div>
            <div>
                {children}
            </div>
        </div>
    );


};

TurneroNewTurnContentWithIcon.defaultProps = {
    margin: "10px",
    horizontal: false,
}

export default TurneroClientTurn;