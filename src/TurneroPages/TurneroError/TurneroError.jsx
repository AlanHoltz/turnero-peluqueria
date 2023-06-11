import React from 'react';
import './TurneroError.css';
import { RiErrorWarningLine } from 'react-icons/ri';

const TurneroError = ({ code }) => {
    return (
        <section className="turnero_error">
            <div className="turnero_error_container">
                <RiErrorWarningLine size={70} />
                <h2>Lo sentimos, hemos detectado un error con código <span className="turnero_error_container_code">{code}</span></h2>
                <p>No hemos podido procesar la solicitud y estamos trabajando para reestablecer el servicio cuanto antes, intenta de nuevo más tarde.</p>
            </div>
        </section>
    );
};

export default TurneroError;