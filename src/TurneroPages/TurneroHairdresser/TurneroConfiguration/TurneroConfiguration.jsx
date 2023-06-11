import React from "react";
import "./TurneroConfiguration.css";
import { Switch, useRouteMatch } from "react-router-dom";
import ProtectedRoute from "../../../components/ProtectedRoute";
import useAuth from '../../../hooks/useAuth';
import TurneroConfigurationRoot from "./TurneroConfigurationRoot/TurneroConfigurationRoot";
import TurneroConfigurationHairdressers from "./TurneroConfigurationHairdressers/TurneroConfigurationHairdressers";
import TurneroConfigurationServices from "./TurneroConfigurationServices/TurneroConfigurationServices";
import TurneroConfigurationFreeDays from "./TurneroConfigurationFreeDays/TurneroConfigurationFreeDays";
import TurneroConfigurationTurns from "./TurneroConfigurationTurns/TurneroConfigurationTurns";

const TurneroConfiguration = () => {

    const { path } = useRouteMatch();
    const [auth] = useAuth();

    return (
        <Switch>
            <ProtectedRoute path={`${path}`} exact auth={{ ...auth }} component={<TurneroConfigurationRoot />} />
            <ProtectedRoute path={`${path}/hairdressers`} auth={{ ...auth }} component={<TurneroConfigurationHairdressers />} />
            <ProtectedRoute path={`${path}/services`} auth={{ ...auth }} component={<TurneroConfigurationServices />} />
            <ProtectedRoute path={`${path}/free-days`} auth={{ ...auth }} component={<TurneroConfigurationFreeDays />} />
            <ProtectedRoute path={`${path}/turns`} auth={{ ...auth }} component={<TurneroConfigurationTurns />} />

        </Switch>
    );
};



export default TurneroConfiguration;
