import React, { useState, useEffect } from "react";
import "./TurneroConfigurationHairdresser.css";
import TurneroLayout from "../../../../../components/TurneroLayout/TurneroLayout";
import { AiOutlineUser } from "react-icons/ai";
import TurneroTabs from "../../../../../components/TurneroTabs/TurneroTabs";
import { useHistory, useParams, Switch, useRouteMatch } from "react-router-dom";
import ProtectedRoute from "../../../../../components/ProtectedRoute";
import useAuth from "../../../../../hooks/useAuth";
import TurneroConfigurationHairdresserProfile from "./TurneroConfigurationHairdresserProfile/TurneroConfigurationHairdresserProfile";
import axios from "axios";
import { getRootPath } from "../../../../../functions/getRootPath";
import validator from "validator";
import Turnero404 from "../../../../../components/Turnero404/Turnero404";
import TurneroConfigurationHairdresserSchedule from "./TurneroConfigurationHairdresserSchedule/TurneroConfigurationHairdresserSchedule";
import TurneroSnackBar from "../../../../../components/TurneroSnackBar/TurneroSnackBar";

const TurneroConfigurationHairdresser = ({ deleted, setDeleted, profileEditMode, setProfileEditMode }) => {
    const history = useHistory();
    const params = useParams();
    const { path } = useRouteMatch();
    const [auth] = useAuth();
    const [edited, setEdited] = useState(false);
    const [user, setUser] = useState({});
    const [loading, setLoading] = useState(false);
    const [notFound, setNotFound] = useState(false);

    const [tab, setTab] = useState(history.location.pathname.includes("schedule") ? 1 : 0);

    useEffect(() => {
        const base = `/hairdresser/configuration/hairdressers/${params.id}`;

        if (tab === 0) history.replace(base);
        else history.replace(base + "/schedule");

        if(tab === 0) getHairdresser();
    }, [tab]);

    useEffect(() => {
        setEdited(false); /*EVITA QUE SE QUEDE EL MENSAJE DE EDICION EXITOSA*/
        /*AL CAMBIAR DE PERFIL*/
    }, [params.id]);

    const getHairdresser = async () => {
        if (!validator.isNumeric(params.id)) return setNotFound(true);
        setLoading(true);
        const hairdresserRequest = await axios.get(`${getRootPath()}/users/hairdressers/${params.id}`, { withCredentials: true });
        setLoading(false);
        if (!hairdresserRequest.data) return setNotFound(true);
        setUser({ ...hairdresserRequest.data });
    };

    useEffect(getHairdresser, [params.id]);

    return (
        <TurneroLayout notFound={notFound} loading={loading} allowGoBack title={`Configuración de ${user.user_full_name}`} icon={<AiOutlineUser size={30} />}>
            <TurneroTabs
                value={tab}
                onChange={(event, value) => {
                    setTab(value);
                }} 
                tabs = {["PERFIL", "HORARIOS"]}
                />

            <div className="turnero_configuration_hairdresser">
                <Switch>
                    <ProtectedRoute
                        auth={auth}
                        exact
                        path={path}
                        component={
                            <TurneroConfigurationHairdresserProfile
                                deleted={deleted}
                                setDeleted={setDeleted}
                                edited={edited}
                                setEdited={setEdited}
                                setProfileEditMode={setProfileEditMode}
                                profileEditMode={profileEditMode}
                                getUser={getHairdresser}
                                user={user}
                                setUser={setUser}
                            />
                        }
                    />
                    <ProtectedRoute path={`${path}/schedule`} component={<TurneroConfigurationHairdresserSchedule edited={edited} setEdited={setEdited} user={user} setLoading={setLoading} />} auth={auth} />
                    <Turnero404 />
                </Switch>
            </div>
            <TurneroSnackBar onClose={() => { setEdited(false) }} hideOn={4000} type="success" message="Cambios guardados con éxito" open={edited} />
        </TurneroLayout>
    );
};

export default TurneroConfigurationHairdresser;
