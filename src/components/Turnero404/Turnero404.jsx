import React from "react";
import "./Turnero404.css";
import { ImSad } from "react-icons/im";
import TurneroButton from '../TurneroButton/TurneroButton';
import { BsArrowLeft } from "react-icons/bs";
import styles from '../../styles/_export.module.scss';
import { useHistory } from "react-router";

const Turnero404 = () => {

    const history = useHistory();

    return (
        <div className="turnero_404_wrapper">
            <TurneroButton onClick={()=>{history.goBack()}} style={{position:"absolute", top:15,left:15}} icon={<BsArrowLeft/>} color={styles.errorColor} label="Ir Atrás" />
            <div className="turnero_404">
                <div className="turnero_404_error">
                    <ImSad size={150}/>
                    <h2>Ups! 404</h2>
                </div>
                <div className="turnero_404_description">Lo sentimos, el recurso que estás buscando no está disponible.</div>
            </div>
        </div>
    );
};

export default Turnero404;
