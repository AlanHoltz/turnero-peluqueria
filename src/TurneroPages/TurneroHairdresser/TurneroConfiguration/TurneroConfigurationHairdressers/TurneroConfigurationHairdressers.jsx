import React, { useState} from "react";
import TurneroConfigurationHairdressersList from "./TurneroConfigurationHairdressersList/TurneroConfigurationHairdressersList";
import { Switch, useRouteMatch } from "react-router-dom";
import ProtectedRoute from "../../../../components/ProtectedRoute";
import useAuth from "../../../../hooks/useAuth";
import TurneroConfigurationHairdresser from "./TurneroConfigurationHairdresser/TurneroConfigurationHairdresser";
import TurneroConfigurationNewHairdresser from "./TurneroConfigurationNewHairdresser/TurneroConfigurationNewHairdresser";

const TurneroConfigurationHairdressers = () => {
    const [auth] = useAuth();
    const { path } = useRouteMatch();
    const [created, setCreated] = useState({ state: false });
    const [deleted, setDeleted] = useState({ state: false });
    const [profileEditMode, setProfileEditMode] = useState(false);

  
    return (
        <Switch>
            <ProtectedRoute
                exact
                path={`${path}`}
                auth={auth}
                component={<TurneroConfigurationHairdressersList profileEditMode={profileEditMode} setProfileEditMode={setProfileEditMode} deleted={deleted} setDeleted={setDeleted} created={created} setCreated={setCreated} />}
            />
            <ProtectedRoute path={`${path}/new`} auth={auth} minPrivileges={1} component={<TurneroConfigurationNewHairdresser created={created} setCreated={setCreated} />} />
            <ProtectedRoute path={`${path}/:id`} auth={auth} component={<TurneroConfigurationHairdresser profileEditMode={profileEditMode} setProfileEditMode={setProfileEditMode} deleted={deleted} setDeleted={setDeleted} />} />
        </Switch>

    );
};

export default TurneroConfigurationHairdressers;
