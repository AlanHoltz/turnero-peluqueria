import React, { useEffect, useState, useContext } from "react";
import "./TurneroSidebar.css";
import styles from "../../styles/_export.module.scss";
import useAuth from "../../hooks/useAuth";
import { getRootPath } from "../../functions/getRootPath";
import { useHistory } from "react-router-dom";
import TurneroAvatar from "../TurneroAvatar/TurneroAvatar";
import { BsCheckBox, BsPlusCircle, BsTrash, BsGear } from "react-icons/bs";
import { IoLogOutOutline } from "react-icons/io5";
import { HAIRDRESSING_NAME } from "../../constants";
import { socketContext } from "../../contexts/socketContext";
import Badge from "@material-ui/core/Badge";
import TurneroToolTip from "../TurneroToolTip/TurneroToolTip";
import axios from "axios";
import TurneroSpeedDial from "../TurneroSpeedDial/TurneroSpeedDial";
import useScreenWidth from "../../hooks/useScreenWidth";
import { getUserProfilePhoto } from "../../functions/getPhoto";
import { RiDashboard3Line } from 'react-icons/ri';

const TurneroSidebar = ({ type }) => {
    const [auth] = useAuth();
    const history = useHistory();
    const [newTurns, setNewTurns] = useState(0);
    const socket = useContext(socketContext);
    const width = useScreenWidth();

    const getNewTurnsCounter = async () => {
        let turnsAux = axios.get(`${getRootPath()}/turns?type=pending&size=reduced`, { withCredentials: true });
        turnsAux = await turnsAux;

        setNewTurnsAux(history.location.pathname.includes("pending") ? 0 : turnsAux.data.length);
    };

    useEffect(() => {
        if (type === "hairdresser") getNewTurnsCounter();
    }, []);

    const profilePhotoUrl = getUserProfilePhoto(auth.user.user_id, auth.user.user_profile_photo);

    const Elements = {
        nav: type === "hairdresser" ? [
            {
                id: 0,
                name: "Dashboard",
                icon: <RiDashboard3Line size="20px" />,
                iconColor: styles.mainColor,
                path: "/hairdresser/dashboard",
            },

            {
                id: 1,
                name: "Aceptados",
                icon: <BsCheckBox size="20px" />,
                iconColor: styles.acceptedColor,
                path: "/hairdresser/turns/accepted",
            },
            {
                id: 2,
                name: "Pendientes",
                icon: (
                    <Badge badgeContent={newTurns} color="secondary">
                        <BsPlusCircle size="20px" />
                    </Badge>
                ),
                iconColor: styles.pendingColor,
                path: "/hairdresser/turns/pending",
            },
            {
                id: 3,
                name: "Rechazados",
                icon: <BsTrash size="20px" />,
                iconColor: styles.rejectedColor,
                path: "/hairdresser/turns/rejected",
            },
        ] : [{
            id: 1,
            name: "Mis Turnos",
            icon: (

                <BsPlusCircle size="20px" />

            ),
            iconColor: styles.pendingColor,
            path: "/client/turn",
        },],
        footer: type === "hairdresser" ? [
            {
                id: 4,
                name: "Ajustes",
                icon: <BsGear size="20px" />,
                iconColor: "yellow",
                path: "/hairdresser/configuration",
                noSelectAltoughtOptionHasChosen: history.location.pathname === `/hairdresser/configuration/hairdressers/${auth.user.user_id}`,
            },
            {
                id: 5,
                name: "Perfil",
                icon: <TurneroAvatar src={profilePhotoUrl} name={auth.user.user_full_name} />,
                path: `/hairdresser/configuration/hairdressers/${auth.user.user_id}`,
                exactly: true,
            },
            {
                id: 6,
                name: "Logout",
                icon: <IoLogOutOutline size="25" />,
                path: "/logout" /*NO FUNCIONA COMO TAL, EN REALIDAD SE NECESITA REDIRIGIR AL ROOT*/,
                iconColor: styles.mainColor,
            },
        ] : [
            {
                id: 2,
                name: "Perfil",
                icon: <TurneroAvatar src={profilePhotoUrl} name={auth.user.user_full_name} />,
                path: `/client/profile`,
            },
            {
                id: 3,
                name: "Logout",
                icon: <IoLogOutOutline size="25" />,
                path: "/logout" /*NO FUNCIONA COMO TAL, EN REALIDAD SE NECESITA REDIRIGIR AL ROOT*/,
                iconColor: styles.mainColor,
            },],
    };

    const setNewTurnsAux = (value) => {
        localStorage.setItem("new_turns", value);
        setNewTurns(value);
    };

    const checkIfUserIsInPendingLocation = () => {
        if (history.location.pathname.includes("pending")) {
            setNewTurnsAux(0);
        }
    };

    useEffect(() => {
        if (type === "client") return;
        socket.on("UPDATE_TURNS", (type) => {
            if (type === "CREATED") {
                let currentNewTurns = parseInt(localStorage.getItem("new_turns"));
                currentNewTurns = currentNewTurns ? currentNewTurns + 1 : 1;
                setNewTurnsAux(currentNewTurns);
                checkIfUserIsInPendingLocation();
            };

        });

        return () => socket.disconnect();
    }, []);

    useEffect(() => {
        if (type === "hairdresser") checkIfUserIsInPendingLocation();
    }, [history.location.pathname]);

    const getElements = (elements) => {
        return elements.map((element) => {
            return (
                <TurneroToolTip key={element.id} placement="right-start" title={element.name}>
                    <li
                        onClick={() => {
                            onChange(element);
                        }}
                        style={selectedUrl(element.path, element.noSelectAltoughtOptionHasChosen, element.exactly) ? { background: styles.secondColor } : null}
                    >

                        <div style={selectedUrl(element.path, element.noSelectAltoughtOptionHasChosen, element.exactly) ? { color: element.iconColor } : null}>{element.icon}</div>

                    </li>
                </TurneroToolTip>
            );
        });
    };

    const onChange = (element) => {
        history.push(element.path);
    };

    const selectedUrl = (path, noSelectAltoughtOptionHasChosen, exactly) => {


        const isCorrectUrl = exactly ? history.location.pathname === path : history.location.pathname.startsWith(path);

        if (isCorrectUrl) {
            if (noSelectAltoughtOptionHasChosen) return false;

            return true;
        }
    };

    const getSpeedDialElements = () => {
        const pendingTurnElementCopy = type === "hairdresser" ? { ...Elements.nav[2] } : { ...Elements.nav[0] };
        pendingTurnElementCopy.name = "Turnos";
        const dashboard = type === "hairdresser" ? Elements.nav[0] : null;
        let elements = [...Elements.footer.reverse(), pendingTurnElementCopy];
        if (dashboard) elements.push(dashboard);
        return elements;
    };

    const isResponsive = () => width <= parseInt(styles.turneroSidebarBreakpoint);

    const renderFooter = () => {
        return width > parseInt(styles.turneroSidebarBreakpoint);
    };

    const showSpeedDial = () => {
        return isResponsive();
    };

    const showSidebar = () => {
        if (isResponsive()) {
            return history.location.pathname.includes("/hairdresser/turns");
        }

        return true;
    };

    return (
        <>
            {showSidebar() ? (
                <>
                    <section className="turnero_sidebar">
                        <div className="turnero_sidebar_nav">
                            <div className="turnero_sidebar_nav_header">{HAIRDRESSING_NAME}</div>
                            <ul className="turnero_sidebar_nav_body">{isResponsive() ? getElements(Elements.nav.slice(1)) : getElements(Elements.nav)}</ul>
                        </div>
                        {renderFooter() ? (
                            <footer className="turnero_sidebar_footer">
                                <ul>{getElements(Elements.footer)}</ul>
                            </footer>
                        ) : null}
                    </section>
                </>
            ) : null}
            {showSpeedDial() ? <TurneroSpeedDial elements={getSpeedDialElements()} /> : null}
        </>
    );
};

export default TurneroSidebar;
