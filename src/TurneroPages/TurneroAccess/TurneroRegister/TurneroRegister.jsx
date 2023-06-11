import React, { useState, useContext } from "react";
import TurneroInput from "../../../components/TurneroInput/TurneroInput";
import TurneroButton from "../../../components/TurneroButton/TurneroButton";
import axios from "axios";
import { getRootPath } from "../../../functions/getRootPath";
import TurneroSuccesfulRegister from "./TurneroSuccesfulRegister/TurneroSuccesfulRegister";
import { errorContext } from "../../../contexts/errorContext";

const TurneroRegister = ({ setShowLogin }) => {
    const [mail, setMail] = useState("");
    const [username, setUsername] = useState("");
    //const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [succesfulRegister, setSuccesfulRegister] = useState(false);
    const [loading, setLoading] = useState(false);

    const { setException } = useContext(errorContext);

    const [errors, setErrors] = useState({
        mail: { error: null, reason: null },
        username: { error: null, reason: null },
        //phone: { error: null, reason: null },
        password: { error: null, reason: null },
        confirmPassword: { error: null, reason: null },
    });

    const handleRegisterClick = async () => {

        try {
            setLoading(true);
            let register = await axios.post(`${getRootPath()}/users`, getRegisterPayload(), { withCredentials: true });
            register = register.data;
            if (!register.registered) return setErrors({ ...register });
            setSuccesfulRegister(true);
        }

        catch (e) {
            setException("Se ha producido un error mientras te registrabas");
        }

        finally {
            setLoading(false);
        };

    };

    const getRegisterPayload = () => {
        return {
            mail,
            username,
            //phone,
            password,
            confirmPassword,
        };
    };

    if (succesfulRegister) return <TurneroSuccesfulRegister setShowLogin={setShowLogin} mail={mail} />;

    return (
        <div className="turnero_register">
            <h2>CREAR UNA CUENTA</h2>
            <div className="turnero_access_form">
                <TurneroInput
                    onChange={(e) => {
                        setErrors({ ...errors, mail: { ...mail, error: null } });
                        setMail(e.target.value);
                    }}
                    value={mail}
                    style={{ margin: "10px 0" }}
                    errorLabel={errors.mail.error ? errors.mail.reason : null}
                    label="E-Mail"
                    fullWidth={true}
                />
                <TurneroInput
                    onChange={(e) => {
                        setErrors({ ...errors, username: { ...username, error: null } });
                        setUsername(e.target.value);
                    }}
                    value={username}
                    errorLabel={errors.username.error ? errors.username.reason : null}
                    style={{ margin: "10px 0" }}
                    label="Nombre y Apellido"
                    fullWidth={true}
                />
                {/*<TurneroInput
                    onChange={(e) => {
                        setErrors({ ...errors, phone: { ...phone, error: null } });
                        setPhone(e.target.value);
                    }}
                    value={phone}
                    errorLabel={errors.phone.error ? errors.phone.reason : null}
                    style={{ margin: "10px 0" }}
                    label="Teléfono"
                    fullWidth={true}
                />*/}
                <TurneroInput
                    onChange={(e) => {
                        setErrors({ ...errors, password: { ...password, error: null } });
                        setPassword(e.target.value);
                    }}
                    value={password}
                    style={{ margin: "10px 0" }}
                    type="password"
                    errorLabel={errors.password.error ? errors.password.reason : null}
                    label="Contraseña"
                    fullWidth={true}
                />
                <TurneroInput
                    onChange={(e) => {
                        setErrors({ ...errors, confirmPassword: { ...confirmPassword, error: null } });
                        setConfirmPassword(e.target.value);
                    }}
                    value={confirmPassword}
                    style={{ margin: "10px 0" }}
                    type="password"
                    errorLabel={errors.confirmPassword.error ? errors.confirmPassword.reason : null}
                    label="Confirmar Contraseña"
                    fullWidth={true}
                />
            </div>

            <TurneroButton loading={loading} onClick={handleRegisterClick} label={"REGISTRARSE"} fullWidth={true} />

            <p
                onClick={() => {
                    setShowLogin(true);
                }}
                className="turnero_access_paragraph"
            >
                ¿Ya estás registrado? <span>Ingresá</span>{" "}
            </p>
        </div>
    );
};

export default TurneroRegister;
