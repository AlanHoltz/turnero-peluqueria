import React, { useEffect, useState, useRef, useContext } from "react";
import "./TurneroTurnDetails.css";
import axios from "axios";
import { getRootPath } from "../../../../functions/getRootPath";
import useScreenWidth from "../../../../hooks/useScreenWidth";
import TurneroAvatar from "../../../../components/TurneroAvatar/TurneroAvatar";
import TurneroButton from "../../../../components/TurneroButton/TurneroButton";
import styles from "../../../../styles/_export.module.scss";
import { BsCheckBox, BsTrash } from "react-icons/bs";
import { MdAccessTime } from "react-icons/md";
import { getFormattedDate } from "../../../../functions/dateHandler";
import { FiPhone } from "react-icons/fi";
import TurneroTable from "../../../../components/TurneroTable/TurneroTable";
import Tweenful, { elastic } from "react-tweenful";
import { IoMdClose } from "react-icons/io";
import TurneroIconButton from "../../../../components/TurneroButton/TurneroIconButton/TurneroIconButton";
import TurneroDialog from "../../../../components/TurneroDialog/TurneroDialog";
import TurneroInput from "../../../../components/TurneroInput/TurneroInput";
import { HiOutlineCursorClick } from "react-icons/hi";
import { BiCommentDetail } from "react-icons/bi";
import { getTurnPhoto, getUserProfilePhoto } from "../../../../functions/getPhoto";
import { Backdrop } from "@material-ui/core";
import { errorContext } from "../../../../contexts/errorContext";

const TurneroTurnDetails = ({ selectedTurn, setSelectedTurn, setRefreshTurns }) => {
    const [turn, setTurn] = useState({});
    const [animate, setAnimate] = useState({ bottom: ["-5%", "0"], opacity: [0, 1] });
    const [loading, setLoading] = useState(false);
    const [acceptDialog, setAcceptDialog] = useState(false);
    const [rejectDialog, setRejectDialog] = useState(false);
    const [endDialog, setEndDialog] = useState(false);
    const [seeImage, setSeeImage] = useState(false);
    const rejectDialogInputRef = useRef(null);

    const { setException } = useContext(errorContext);

    useEffect(async () => {
        if (selectedTurn !== null) {
            setLoading(true);
            let turnRequest = axios.get(`${getRootPath()}/turns/${selectedTurn}?size=detailed`, { withCredentials: true });
            turnRequest = await turnRequest;
            let turnServices = axios.get(`${getRootPath()}/turns/${selectedTurn}/services`, { withCredentials: true });
            turnServices = await turnServices;
            let turnData = turnRequest.data.length > 0 ? turnRequest.data[0] : {};
            turnData = { ...turnData, services: turnServices.data };
            setLoading(false);
            setTurn(turnData);
        }
    }, [selectedTurn]);

    const columns = [
        {
            name: "Nombre",
            selector: (row) => row.service_name,
        },

        {
            name: "Costo",
            selector: (row) => row.service_cost,
        },
    ];

    const conditional = [
        {
            when: (row) => row.service_name === "TOTAL",
            style: {
                fontWeight: "700",
                fontSize: "35px"
            },
        },
    ];

    const getRows = () => {
        if (!turn.services) return;
        let totalCost = 0; /*CONTADORES PARA EL PRECIO Y LA CANTIDAD DE SERVICIOS*/
        let totalServicesAmount = 0;
        let rows = turn.services.map((turnService) => {
            totalCost += turnService.service_cost;
            totalServicesAmount += turnService.turns_services_amount;
            return { ...turnService, id: turnService.id_turn, service_cost: "$" + turnService.service_cost };
        });

        rows.push({
            id: "TOTAL",
            service_name: "TOTAL",
            service_cost: "$" + totalCost,
        });

        return rows;
    };

    useEffect(() => {
        if (!loading) setAnimate({ ...animate });
    }, [selectedTurn]);

    const updateTurn = async (state) => {
        let observation = null;

        if (state === "rejected") {
            /*SI EL ESTADO ES RECHAZADO OBTENGO LA OBSERVACION ESCRITA*/
            observation = rejectDialogInputRef.current.querySelector("input").value;
        }
        const payload = { state: state, observation: observation };
        try {
            return await axios.put(`${getRootPath()}/turns/${selectedTurn}`, payload, { withCredentials: true });
        }
        catch (e) {
            setException("No se ha podido aceptar/rechazar el turno");
        };

    };

    const deleteTurn = async () => {
        return await axios.delete(`${getRootPath()}/turns/${selectedTurn}`, { withCredentials: true });
    };

    /*----------------------COMPONENTE PRINCIPAL DE LOS DETALLES DE UN TURNO----------------------*/

    const handleTurnStateChange = async (state) => {
        if (state === "ended") await deleteTurn();
        else await updateTurn(state);
        if (state === "accepted") setAcceptDialog(false);
        if (state === "rejected") setRejectDialog(false);
        if (state === "ended") setEndDialog(false);
        setRefreshTurns(true);
        setSelectedTurn(null);
    };


    return (
        <TurneroTurnDetailsWrapper animate={animate} selectedTurn={selectedTurn}>

            {selectedTurn === null || loading ? (
                <TurneroNoTurnDetails />
            ) : (
                <React.Fragment>

                    <div className="turnero_turn_details_close_button">
                        <TurneroIconButton
                            onClick={() => {
                                setSelectedTurn(null);
                            }}
                            color={styles.mainColor}
                            icon={<IoMdClose />}
                        />
                    </div>

                    <header className="turnero_turn_details_header">
                        <TurneroAvatar src={getUserProfilePhoto(turn.client_id, turn.client_profile_photo)} size={70} name={turn.client_name} />
                        <h2>Turno de {turn.client_name}</h2>
                    </header>
                    <TurneroTurnDetailsState turn={turn} setAcceptDialog={setAcceptDialog} setRejectDialog={setRejectDialog} setEndDialog={setEndDialog} />
                    <div className="turnero_turn_details_basics">
                        <h3>Detalles:</h3>
                        <div className="turnero_turn_details_basics_container">
                            <div className="turnero_turn_details_basics_container_first_column">
                                <div>
                                    <MdAccessTime size="25px" />
                                    <p>{getFormattedDate(turn.turn_datetime)}</p>
                                </div>
                                <div>
                                    <FiPhone size="20px" />
                                    <p>{turn.client_phone}</p>
                                </div>
                            </div>
                            <div className="turnero_turn_details_basics_container_second_column">
                                <TurneroAvatar
                                    src={getUserProfilePhoto(turn.hairdresser_id, turn.hairdresser_profile_photo)}
                                    size={50}
                                    name={turn.hairdresser_name ? turn.hairdresser_name : "Sin preferencia"}
                                />
                                <p>{turn.hairdresser_name ? turn.hairdresser_name : "Sin preferencia"}</p>
                            </div>
                        </div>
                    </div>

                    <div className="turnero_turn_details_observations">
                        <h3>Observaciones:</h3>
                        <p>{turn.turn_client_observation ? turn.turn_client_observation : "Sin observaciones"}</p>
                        {turn.turn_photo && <span className="turnero_turn_details_observations_photo" onClick={() => setSeeImage(true)}>Ver Foto Adjunta</span>}
                    </div>

                    <div className="turnero_turn_details_services">
                        <h3>Servicios:</h3>
                        <TurneroTable conditional={conditional} columns={columns} rows={getRows()} />
                    </div>
                </React.Fragment>
            )}
            <TurneroDialog
                open={acceptDialog}
                title="Aceptar Turno"
                bodyText={`¿Estás seguro que deseas aceptar el turno de ${turn.client_name} para el ${getFormattedDate(turn.turn_datetime)}?`}
                onDeclineClick={() => {
                    setAcceptDialog(false);
                }}
                onAcceptClick={() => {
                    handleTurnStateChange("accepted");
                }}
            />
            <TurneroDialog
                open={rejectDialog}
                title="Rechazar Turno"
                bodyText={`¿Estás seguro que deseas rechazar el turno de ${turn.client_name} para el ${getFormattedDate(turn.turn_datetime)}?`}
                body={<TurneroInput ref={rejectDialogInputRef} icon={<BiCommentDetail />} label="Observaciones" fullWidth />}
                onDeclineClick={() => {
                    setRejectDialog(false);
                }}
                onAcceptClick={() => {
                    handleTurnStateChange("rejected");
                }}
            />
            <TurneroDialog
                open={endDialog}
                title="Dar por Realizado"
                bodyText={`¿Estás seguro que el turno de ${turn.client_name} ha sido efectuado?`}
                onDeclineClick={() => {
                    setEndDialog(false);
                }}
                onAcceptClick={() => {
                    handleTurnStateChange("ended");
                }}
            />
            {turn.turn_photo && <Backdrop style={{ zIndex: 999999 }} onClick={() => setSeeImage(false)} open={seeImage}>
                <img onClick={(e) => e.stopPropagation()} className="turnero_turn_details_image" src={getTurnPhoto(turn.turn_id, turn.turn_photo)}>
                </img>
            </Backdrop>}
        </TurneroTurnDetailsWrapper>
    );
};

/*------------------------------------------------------------------------------------------*/

/*-------------------------SUB COMPONENTES QUE COMPLEMENTAN A LOS DETALLES DE UN TURNO-------*/

const TurneroTurnDetailsWrapper = ({ children, animate, selectedTurn }) => {
    const width = useScreenWidth();
    const breakpoint = parseInt(styles.turneroTurnsBreakpoint.replace("px", ""));

    if (width <= breakpoint) return <div className={`turnero_turn_details ${selectedTurn ? "show_details" : ""}`}>{children}</div>;
    else
        return (
            <Tweenful.div
                className={`turnero_turn_details`}
                duration={400}
                easing={elastic(0, 1)}
                style={{ position: "relative" }}
                animate={animate}>
                {children}
            </Tweenful.div>
        );
};

const TurneroNoTurnDetails = () => {
    return (
        <div className="turnero_no_turn_details">
            <HiOutlineCursorClick size="50px" color={styles.mainColor} />
            <p>Selecciona un turno para verlo</p>
        </div>
    );
};

const TurneroTurnDetailsState = ({ turn, setAcceptDialog, setRejectDialog, setEndDialog }) => {
    const getTurnState = () => {
        switch (turn.turn_state) {
            case 1:
                return { name: "Aceptado", color: styles.acceptedColor };
            case 2:
                return { name: "Pendiente", color: styles.pendingColor };
            case 3:
                return { name: "Rechazado", color: styles.rejectedColor };

            default:
                return {};
        }
    };

    const getButtons = () => {
        switch (turn.turn_state) {
            case 1:
                return (
                    <React.Fragment>
                        <TurneroButton
                            onClick={() => {
                                setEndDialog(true);
                            }}
                            icon={<BsCheckBox />}
                            color={styles.pendingColor}
                            label="REALIZADO"
                        />
                        <TurneroButton
                            onClick={() => {
                                setRejectDialog(true);
                            }}
                            style={{ marginLeft: "15px" }}
                            icon={<BsTrash />}
                            color={styles.rejectedColor}
                            label="RECHAZAR"
                        />
                    </React.Fragment>
                );

            case 2:
                return (
                    <React.Fragment>
                        <TurneroButton
                            onClick={() => {
                                setAcceptDialog(true);
                            }}
                            icon={<BsCheckBox />}
                            color={styles.acceptedColor}
                            label="ACEPTAR"
                        />
                        <TurneroButton
                            onClick={() => {
                                setRejectDialog(true);
                            }}
                            style={{ marginLeft: "15px" }}
                            icon={<BsTrash />}
                            color={styles.rejectedColor}
                            label="RECHAZAR"
                        />
                    </React.Fragment>
                );

            case 3:
                return null;

            default:
                break;
        }
    };

    return (
        <div className="turnero_turn_details_state">
            <div className="turnero_turn_details_state_value">
                <div style={{ background: getTurnState().color }} className="turnero_turn_details_state_value_circle"></div>
                <p style={{ color: getTurnState().color }}>{getTurnState().name}</p>
            </div>
            <div className="turnero_turn_details_state_buttons">{getButtons()}</div>
        </div>
    );
};
/*---------------------------------------------------------------------------------------------------*/

export default TurneroTurnDetails;
