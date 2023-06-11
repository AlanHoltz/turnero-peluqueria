import React, { useState } from 'react';
import './TurneroClientProfilePhone.css';
import TurneroLayout from '../../../../components/TurneroLayout/TurneroLayout';
import { FiPhone } from 'react-icons/fi';
import sendCodeSvg from '../../../../assets/phone_verification_1.svg';
import verifyCodeSvg from '../../../../assets/phone_verification_2.svg';
import TurneroButton from '../../../../components/TurneroButton/TurneroButton';
import countriesJson from '../../../../assets/country_phone_codes.json';
import TurneroInputSelect from '../../../../components/TurneroInput/TurneroInputSelect/TurneroInputSelect';
import styles from '../../../../styles/_export.module.scss';
import TurneroInput from '../../../../components/TurneroInput/TurneroInput';
import PinInput from 'react-pin-input';
import Tweenful, { elastic } from "react-tweenful";
import axios from 'axios';
import { getRootPath } from '../../../../functions/getRootPath';
import TurneroSnackbar from '../../../../components/TurneroSnackBar/TurneroSnackBar';
import TurneroDialog from '../../../../components/TurneroDialog/TurneroDialog';
import useAuth from '../../../../hooks/useAuth';
import useScreenWidth from '../../../../hooks/useScreenWidth';

const TurneroClientProfilePhone = () => {


    const [screen, setScreen] = useState("send"); //send O verify
    const [animate, setAnimate] = useState({ bottom: ["-5%", "0"], opacity: [0, 1] });
    const [loading, setLoading] = useState(false);
    const [phone, setPhone] = useState("");
    const width = useScreenWidth();

    const changeScreen = (screen) => {
        setAnimate({ ...animate });
        setScreen(screen);
    };

    return (
        <TurneroLayout title="Teléfono" loading={loading} allowGoBack={true} icon={<FiPhone />}>
            <Tweenful.div
                className="turnero_client_profile_phone"
                duration={400}
                easing={elastic(0, 1)}
                style={{ position: "relative" }}
                animate={animate}
            >
                {screen === "send" && <TurneroClientProfilePhoneSendCode width={width} setLoading={setLoading} phone={phone} setPhone={setPhone} changeScreen={changeScreen} />}
                {screen === "verify" && <TurneroClientProfilePhoneVerifyCode phone={phone} setLoading={setLoading} changeScreen={changeScreen} />}
            </Tweenful.div>
        </TurneroLayout >
    )
};

const TurneroClientProfilePhoneSendCode = ({ width, setLoading, changeScreen, phone, setPhone }) => {


    const [selectedCountry, setSelectedCountry] = useState("AR");

    const [error, setError] = useState(false);
    const [dialog, setDialog] = useState(false);
    const [auth] = useAuth();

    const getCountriesToInputSelect = () => {

        return countriesJson.countries.map(country => ({ value: country.code, name: country.name_es }));
    };

    const onSendClick = async () => {


        if (dialog) {
            setDialog(false);
        }
        else {
            if (auth.user.user_phone) return setDialog(true);
        };



        setLoading(true);

        let countryPhoneCode = countriesJson.countries.filter(country => country.code === selectedCountry);
        countryPhoneCode = countryPhoneCode[0].dial_code;

        const send = await axios.get(`${getRootPath()}/users/myself/phone/verification_code/${countryPhoneCode}${phone}`, { withCredentials: true })

        setLoading(false);

        if (send.data.err) {
            setError(true);
        } else {
            changeScreen("verify");
        };
    };

    return (
        <div className="turnero_client_profile_phone_send_code">
            <img src={sendCodeSvg} />
            <div className="turnero_client_profile_phone_send_code_description">
                <h2>Verificá tu Teléfono</h2>
                <p>Por favor, ingresa el país y número con su correspondiente código de área</p>
            </div>
            <div className="turnero_client_profile_phone_send_code_input">
                <TurneroInputSelect
                    style={{ width: width <= 533 ? "100%" : "200px" }}
                    includeNone={false}
                    color={styles.mainColor}
                    onChange={(e) => {
                        setSelectedCountry(e.target.value)
                    }}
                    value={selectedCountry}
                    items={getCountriesToInputSelect()}
                    title="Países"
                />
                <TurneroInput errorLabel={error ? "Introduce un teléfono válido" : null} value={phone} onChange={(e) => { setError(false); setPhone(e.target.value) }} style={{ marginLeft: "10px", width: "100%" }} label="Número de Teléfono" />
            </div>
            <TurneroButton onClick={onSendClick} disabled={phone.length < 4} style={{ background: styles.mainColor, color: styles.secondColor }} label="Enviar" fullWidth />
            <TurneroDialog
                open={dialog}
                title="Cambiar teléfono"
                bodyText={`¿Estás seguro que deseas verificar tu teléfono nuevamente? Se eliminará el actual`}
                onAcceptClick={() => { onSendClick() }}
                onDeclineClick={() => {
                    setDialog(false)
                }}
            />
        </div>
    )
};

const TurneroClientProfilePhoneVerifyCode = ({ setLoading, changeScreen, phone }) => {

    const [code, setCode] = useState("");
    const [error, setError] = useState(false);
    const [verified, setVerified] = useState(false);

    const onVerifyClick = async () => {

        setLoading(true);

        const verify = await axios.put(`${getRootPath()}/users/myself/phone/verification_code/${code}`, {}, { withCredentials: true })

        setLoading(false);

        if (verify.data.err) {
            setError(true);
        } else {
            setVerified(true);
            setTimeout(() => {

                window.location.href = "/";

            }, 1500);
        };
    };


    return (
        <div className="turnero_client_profile_phone_verify_code">
            <img src={verifyCodeSvg} />
            <div className="turnero_client_profile_phone_verify_code_description">
                <h2>Código Enviado</h2>
                <p>Por favor, verificá tu casilla de WhatsApp, hemos enviado el código al teléfono: <span>{phone}</span></p>
            </div>
            <div className="turnero_client_profile_phone_verify_code_input">
                <PinInput
                    length={5}
                    initialValue=""
                    onChange={(value, index) => { setError(false); setCode("") }}
                    type="numeric"
                    focus
                    disabled={verified}
                    inputMode="number"
                    style={{ padding: '10px' }}
                    inputStyle={{ fontWeight: "bold", borderColor: error ? styles.errorColor : styles.mainColor, color: error ? styles.errorColor : styles.mainColor, fontSize: "15px", margin: "0 5px" }}
                    inputFocusStyle={{ borderColor: '#ffffff' }}
                    onComplete={(value, index) => { setCode(value) }}
                />
                {error && <span style={{ color: styles.errorColor }}>El código ingresado es incorrecto o ha expirado</span>}
            </div>
            <TurneroButton onClick={onVerifyClick} disabled={code === "" || verified} style={{ background: styles.mainColor, color: styles.secondColor }} label="Aceptar" fullWidth />
            <p className="turnero_client_profile_phone_verify_code_not_received">¿Ingresaste mal el teléfono? <span onClick={() => changeScreen("send")}>Volver a Ingreso de Teléfono</span></p>
            <TurneroSnackbar
                onClose={() => {
                    setVerified(false);
                }}
                hideOn={4000}
                type={"success"}
                message={"Su teléfono ha sido verificado con éxito"}
                open={verified}
            />
        </div>
    )
};

export default TurneroClientProfilePhone;