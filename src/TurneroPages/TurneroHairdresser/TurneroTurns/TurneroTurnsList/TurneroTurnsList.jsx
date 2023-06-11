import React, { useEffect, useState, useRef, useContext } from "react";
import "./TurneroTurnsList.css";
import { useHistory } from "react-router-dom";
import TurneroTurnsListItem from "./TurneroTurnsListItem/TurneroTurnsListItem";
import TurneroSpinner from "../../../../components/TurneroSpinner/TurneroSpinner";
import Tweenful, { elastic } from "react-tweenful";
import axios from "axios";
import { getRootPath } from "../../../../functions/getRootPath";
import { socketContext } from "../../../../contexts/socketContext";
import TurneroInputSelect from "../../../../components/TurneroInput/TurneroInputSelect/TurneroInputSelect";
import { getCalendarDate, isSameDay } from "../../../../functions/dateHandler";
import TurneroChip from "../../../../components/TurneroChip/TurneroChip";


const TurneroTurnsList = ({ selectedTurn, setSelectedTurn, themeColor, title, setRefreshTurns, refreshTurns }) => {
    const handleItemClick = (id) => {
        setSelectedTurn(id);
    };

    const [animate, setAnimate] = useState({ bottom: ["-5%", "0"], opacity: [0, 1] });
    const [loading, setLoading] = useState(false);
    const listRef = useRef(null);
    const socket = useContext(socketContext);
    const [turns, setTurns] = useState([]);
    const [hairdressers, setHairdressers] = useState([]);
    const [selectedHairdresser, setSelecterHairdresser] = useState(-1);
    const history = useHistory();

    useEffect(() => {
        setAnimate({ ...animate });
    }, [title]);

    const getTurnsType = () => {
        if (history.location.pathname.includes("accepted")) return "accepted";
        if (history.location.pathname.includes("pending")) return "pending";
        if (history.location.pathname.includes("rejected")) return "rejected";
    };

    const getTurns = async () => {
        setLoading(true);
        let turnsAux = axios.get(`${getRootPath()}/turns?type=${getTurnsType()}&size=reduced`, { withCredentials: true });
        turnsAux = await turnsAux;
        setLoading(false);
        setTurns(turnsAux.data);
    };

    const getHairdressers = async () => {
        let hairdressersAux = axios.get(`${getRootPath()}/users/hairdressers`, { withCredentials: true });
        hairdressersAux = await hairdressersAux;
        setHairdressers([...hairdressersAux.data]);
    };

    useEffect(() => {
        getTurns();
        getHairdressers();
    }, [history.location.pathname]);

    useEffect(() => {
        socket.on("UPDATE_TURNS", (type) => {

            if ((type === "CREATED" && history.location.pathname.includes("pending"))
                || (type === "DELETED" && !history.location.pathname.includes("pending"))
                || type === "AUTO_MODIFIED") {
                getTurns();
            };

        });

        /*EL SOCKET SE DESCONECTA EN EL SIDEBAR CUANDO SE ACTUALIZA LA BADGE*/
    }, []);

    useEffect(() => {
        if (refreshTurns) getTurns();
        setRefreshTurns(false);
    }, [refreshTurns]);

    const putDateTimeSeparator = (turns, currentIndex) => {
        const previousIndex = currentIndex - 1;

        if (previousIndex === -1) return true;

        const currentTurnDateTime = turns[currentIndex].turn_datetime;
        const previousTurnDateTime = turns[previousIndex].turn_datetime;

        return !isSameDay(currentTurnDateTime, previousTurnDateTime);
    };

    const getTurnsListItems = () => {
        let turnsCopy = [...turns];

        if (selectedHairdresser !== -1) turnsCopy = turnsCopy.filter((turn) => turn.hairdresser_id === selectedHairdresser);

        return turnsCopy.map((turn, index) => {
            return (
                <React.Fragment key={turn.turn_id}>
                    {putDateTimeSeparator(turnsCopy, index) ? <TurneroChip label={getCalendarDate(turn.turn_datetime)} /> : null}
                    <TurneroTurnsListItem onClick={handleItemClick} selected={turn.turn_id === selectedTurn} themeColor={themeColor} data={turn} />
                </React.Fragment>
            );
        });
    };

    useEffect(() => {
        setSelectedTurn(null);
    }, [selectedHairdresser]);

    const getChildren = () => {
        if (loading) return <TurneroSpinner size="50px" />;
        const turnsListItems = getTurnsListItems();
        if (turnsListItems.length === 0) return <h2>NO HAY TURNOS DISPONIBLES PARA MOSTRAR</h2>;
        else return turnsListItems;
    };

    return (
        <>
            <Tweenful.div
                duration={400}
                easing={elastic(0, 1)}
                style={{ position: "relative" }}
                animate={animate}>
                <div className="turnero_turns_list_header">
                    <h2 style={{ color: themeColor }}>{title}</h2>
                    <div className="turnero_turns_list_header_filter">
                        <TurneroInputSelect
                            color={themeColor}
                            onChange={(e) => {
                                setSelecterHairdresser(e.target.value);
                            }}
                            value={selectedHairdresser}
                            items={hairdressers.map((hairdresser) => ({ value: hairdresser.user_id, name: hairdresser.user_full_name }))}
                            title="Peluqueros"
                        />
                    </div>
                </div>

                <div ref={listRef} style={loading ? { justifyContent: "center" } : null} className="turnero_turns_list_container">
                    {getChildren()}
                </div>
            </Tweenful.div>
        </>
    );
};

export default TurneroTurnsList;
