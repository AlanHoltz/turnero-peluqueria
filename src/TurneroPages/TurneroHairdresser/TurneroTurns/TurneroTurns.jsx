import React, { useState, useEffect } from "react";
import "./TurneroTurns.css";
import { useRouteMatch, Switch, useHistory } from "react-router-dom";
import ProtectedRoute from "../../../components/ProtectedRoute";
import TurneroTurnsList from "./TurneroTurnsList/TurneroTurnsList";
import useAuth from "../../../hooks/useAuth";
import styles from "../../../styles/_export.module.scss";
import TurneroTurnDetails from "./TurneroTurnDetails/TurneroTurnDetails";

const TurneroTurns = () => {
    const { path } = useRouteMatch();
    const history = useHistory();
    const [auth] = useAuth();
    const [selectedTurn, setSelectedTurn] = useState(null);
    const [refreshTurns,setRefreshTurns] = useState(false);

    useEffect(() => {
        setSelectedTurn(null);
    }, [history.location.pathname]);

    return (
        <section className="turnero_turns">
            <div className="turnero_turns_list">
                <Switch>
                    <ProtectedRoute
                        path={`${path}/accepted`}
                        auth={{ ...auth }}
                        component={
                            <TurneroTurnsList
                                selectedTurn={selectedTurn}
                                setSelectedTurn={setSelectedTurn}
                                setRefreshTurns={setRefreshTurns}
                                themeColor={styles.acceptedColor}
                                refreshTurns={refreshTurns}
                                title="ACEPTADOS"
                            />
                        }
                    />
                    <ProtectedRoute
                        path={`${path}/pending`}
                        auth={{ ...auth }}
                        component={
                            <TurneroTurnsList
                                selectedTurn={selectedTurn}
                                setRefreshTurns={setRefreshTurns}
                                setSelectedTurn={setSelectedTurn}
                                refreshTurns={refreshTurns}
                                themeColor={styles.pendingColor}
                                title="PENDIENTES"
                            />
                        }
                    />
                    <ProtectedRoute
                        path={`${path}/rejected`}
                        auth={{ ...auth }}
                        component={
                            <TurneroTurnsList
                                selectedTurn={selectedTurn}
                                setRefreshTurns={setRefreshTurns}
                                setSelectedTurn={setSelectedTurn}
                                refreshTurns={refreshTurns}
                                themeColor={styles.rejectedColor}
                                title="RECHAZADOS"
                            />
                        }
                    />
                </Switch>
            </div>
            <TurneroTurnDetails setRefreshTurns={setRefreshTurns} setSelectedTurn={setSelectedTurn} selectedTurn={selectedTurn} />
        </section>
    );
};

export default TurneroTurns;
