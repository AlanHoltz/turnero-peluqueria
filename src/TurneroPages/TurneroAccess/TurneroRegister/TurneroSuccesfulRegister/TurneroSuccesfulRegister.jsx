import React from "react";
import "./TurneroSuccesfulRegister.css";
import TurneroButton from "../../../../components/TurneroButton/TurneroButton";
import { ENABLE_EMAIL_VERIFICATION } from "../../../../constants";

const TurneroSuccesfulRegister = ({ mail, setShowLogin }) => {
    
    const paragraph = ENABLE_EMAIL_VERIFICATION ? <>Hemos enviado un correo a <span>{mail}</span> para que puedas verificar tu cuenta!</> : "Ya puedes solicitar turnos accediendo con tu cuenta!";

    return (
        <div className="turnero_succesful_register">
            <h2 className="turnero_succesful_register_h2">¡Bienvenido!</h2>
            <p className="turnero_succesful_register_paragraph">{paragraph}</p>
            <TurneroButton
                fullWidth={true}
                onClick={() => {
                    setShowLogin(true);
                }}
                label="ACCEDER"
            />
        </div>
    );
};

export default TurneroSuccesfulRegister;
