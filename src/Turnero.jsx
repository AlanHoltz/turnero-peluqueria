import React, { useState, useEffect } from "react";
import "./styles/Turnero.css";
import TurneroAccess from "./TurneroPages/TurneroAccess/TurneroAccess";
import { authContext } from "./contexts/authContext";
import ProtectedRoute from "./components/ProtectedRoute";
import { BrowserRouter as Router, Switch } from "react-router-dom";
import TurneroPagesRoot from "./TurneroPages/TurneroPagesRoot";
import axios from "axios";
import { getRootPath } from "./functions/getRootPath";
import TurneroLogout from './TurneroPages/TurneroLogout/TurneroLogout';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import MomentUtils from '@date-io/moment';
import 'moment/locale/es';
import { socket, socketContext } from './contexts/socketContext';
import TurneroError from "./TurneroPages/TurneroError/TurneroError";
import { ERROR_CODES } from "./error_codes";
import { errorContext } from './contexts/errorContext';
import TurneroSnackbar from "./components/TurneroSnackBar/TurneroSnackBar";
import Turnero404 from "./components/Turnero404/Turnero404";
import styles from './styles/_export.module.scss';

const Turnero = () => {
    const [auth, setAuth] = useState({
        user: null,
        isLogged: null,
        error: null
    });

    const [exception, setException] = useState(null);

    const checkIfUserIsLogged = async () => {
        try {
            const check = await axios.get(`${getRootPath()}/users/check`, { withCredentials: true });
            if (check.data.isLogged) setAuth({ ...auth, isLogged: true, user: { ...check.data.user } });
            else setAuth({ ...auth, isLogged: false });
        } catch (e) {
            setAuth({ ...auth, error: ERROR_CODES["SESSION_RETRIEVING"] });
        };


    };

    useEffect(checkIfUserIsLogged, [auth.isLogged]);

    return (
        <MuiPickersUtilsProvider locale={"es"} utils={MomentUtils}>
            <socketContext.Provider value={socket}>
                <authContext.Provider value={{ auth, setAuth }}>
                    <errorContext.Provider value={{ exception, setException }}>
                        {auth.error === null ? <Router>
                            <Switch>
                                <ProtectedRoute exact={true} isLogin={true} path="/" auth={{ ...auth }} component={<TurneroAccess />} />
                                <ProtectedRoute path="/hairdresser" auth={{ ...auth }} component={<TurneroPagesRoot />} />
                                <ProtectedRoute type="client" path="/client" auth={{ ...auth }} component={<TurneroPagesRoot />} />
                                <ProtectedRoute type="client" path="/logout" auth={{ ...auth }} component={<TurneroLogout />} />
                                <div style={{ background: styles.secondColor, height: "100%" }}>
                                    <Turnero404 />
                                </div>
                            </Switch>
                        </Router> : <TurneroError code={auth.error} />}
                        <TurneroSnackbar
                            onClose={() => {
                                setException(null);
                            }}
                            hideOn={4000}
                            type={"error"}
                            message={exception}
                            open={exception !== null}
                        />
                    </errorContext.Provider>
                </authContext.Provider>
            </socketContext.Provider>
        </MuiPickersUtilsProvider>
    );
};



export default Turnero;
