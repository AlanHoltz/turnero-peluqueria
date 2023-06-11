import React from "react";
import { Route, Redirect } from "react-router-dom";
import PropTypes from 'prop-types';

const ProtectedRoute = ({ path, component, auth, exact, type, isLogin, minPrivileges }) => {
    
    const getRoute = () => {
        
        if (isLogin && !auth.isLogged) return component;
        if (isLogin && auth.isLogged) return <Redirect to={type === "hairdresser" ? "/hairdresser" : "/client"} />;
        if (!auth.isLogged) return <Redirect to={"/"} />;
        if (auth.isLogged) {
            if (type === "hairdresser") {
                if (auth.user.hairdresser_privilege_id !== null) {
                    if(auth.user.hairdresser_privilege_id <= minPrivileges) return component;
                    return <Redirect to="/hairdresser"/>;
                    
                } else {
                    return <Redirect to="/client" />;
                }
            }

            return component;
        }
    };

    return (
        <>
            {auth.isLogged !== null ? (
                <Route
                    exact={exact}
                    path={path}
                    render={() => {
                        return getRoute();
                    }}
                />
            ) : null}
        </>
    );
};

ProtectedRoute.defaultProps = {
    redirect: "/",
    type: "hairdresser",
    minPrivileges: 3
};


ProtectedRoute.propTypes = {
    path: PropTypes.string,
    component: PropTypes.node,
    auth: PropTypes.shape({
        isLogged: PropTypes.bool,
        user: PropTypes.object
    }),
    exact: PropTypes.bool,
    type: PropTypes.string,
    isLogin: PropTypes.bool
}

export default ProtectedRoute;
