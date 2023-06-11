import React, { useState, useContext } from "react";
import "./TurneroLogin.css";
import TurneroInput from "../../../components/TurneroInput/TurneroInput";
import TurneroButton from "../../../components/TurneroButton/TurneroButton";
import { FaUser } from "react-icons/fa";
import { BsFillLockFill } from "react-icons/bs";
import axios from "axios";
import { getRootPath } from "../../../functions/getRootPath";
import { ENABLE_EMAIL_VERIFICATION } from "../../../constants";
import { errorContext } from "../../../contexts/errorContext";

const TurneroLogin = ({ setShowLogin }) => {
    const [mail, setMail] = useState("");
    const [password, setPassword] = useState("");
    const [loginError, setLoginError] = useState(null);

    const { setException } = useContext(errorContext);



    const handleLoginClick = async () => {
        try {
            const login = await axios.post(`${getRootPath()}/users/login`, { mail, password }, { withCredentials: true });
            handleLoginResponse(login);
        }

        catch (e) {
            setException("Se ha producido un error mientras tratabas de ingresar");
        }

    };

    const handleLoginResponse = (res) => {
        const { isLogged, error } = res.data;

        if (isLogged === false) return setLoginError("E-Mail y/o Constraseña incorrectos");

        if (ENABLE_EMAIL_VERIFICATION) {
            if (error) return setLoginError("Su cuenta de E-Mail no ha sido verificada");
        }

        window.location.href = "/";
    };

    const handleMailChange = (e) => {
        setMail(e.target.value);
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };

    return (
        <div className="turnero_login">
            <h2>INICIO DE SESIÓN</h2>
            <div className="turnero_access_form">
                <TurneroInput
                    style={{ margin: "10px 0" }}
                    label="E-Mail"
                    icon={<FaUser />}
                    fullWidth={true}
                    errorLabel={loginError ? loginError : null}
                    onChange={(e) => {
                        setLoginError(null);
                        handleMailChange(e);
                    }}
                    value={mail}
                />

                <TurneroInput
                    style={{ margin: "10px 0" }}
                    type="password"
                    label="Contraseña"
                    icon={<BsFillLockFill />}
                    fullWidth={true}
                    value={password}
                    onChange={(e) => {
                        setLoginError(null);
                        handlePasswordChange(e);
                    }}
                />
            </div>
            <TurneroButton onClick={handleLoginClick} label="Acceder" fullWidth={true} />
            <p
                onClick={() => {
                    setShowLogin(false);
                }}
                className="turnero_access_paragraph"
            >
                ¿No tenés una cuenta todavía? <span>Registrate</span>{" "}
            </p>
        </div>
    );
};

export default TurneroLogin;
