import React from "react";
import "./TurneroPagesRoot.css";
import TurneroSidebar from "../components/TurneroSidebar/TurneroSidebar";
import { Switch, useRouteMatch, Redirect } from "react-router-dom";
import ProtectedRoute from "../components/ProtectedRoute";
import useAuth from "../hooks/useAuth";
import TurneroConfiguration from "./TurneroHairdresser/TurneroConfiguration/TurneroConfiguration";
import TurneroTurns from "./TurneroHairdresser/TurneroTurns/TurneroTurns";
import TurneroClientTurn from './TurneroClient/TurneroClientTurn/TurneroClientTurn';
import TurneroClientProfile from "./TurneroClient/TurneroClientProfile/TurneroClientProfile";
import Turnero404 from "../components/Turnero404/Turnero404";
import TurneroDashboard from './TurneroHairdresser/TurneroDashboard/TurneroDashboard';


const TurneroPagesRoot = () => {
    const { path } = useRouteMatch();
    const [auth] = useAuth();

    return (

        <section className="turnero_pages_root">
            <TurneroSidebar type={auth.user.hairdresser_privilege_id !== null ? "hairdresser" : "client"} />
            <main>
                {auth.user.hairdresser_privilege_id !== null ? <Switch>
                    <ProtectedRoute exact auth={{ ...auth }} path={`${path}`} component={<Redirect to={`${path}/dashboard`} />} />
                    <ProtectedRoute auth={{ ...auth }} path={`${path}/dashboard`} component={<TurneroDashboard />} />
                    <ProtectedRoute auth={{ ...auth }} path={`${path}/turns`} component={<TurneroTurns />} />
                    <ProtectedRoute auth={{ ...auth }} path={`${path}/configuration`} component={<TurneroConfiguration />} />
                    <Turnero404 />
                </Switch> :
                    <Switch>
                        <ProtectedRoute exact type="client" auth={{ ...auth }} path={`${path}`} component={<Redirect to={`${path}/turn`} />} />
                        <ProtectedRoute exact type="client" auth={{ ...auth }} path={`${path}/turn`} component={<TurneroClientTurn />} />
                        <ProtectedRoute type="client" auth={{ ...auth }} path={`${path}/profile`} component={<TurneroClientProfile />} />
                        <Turnero404 />
                    </Switch>
                }
            </main>
        </section>

    );
};

export default TurneroPagesRoot;
