import React, { useState, useContext } from "react";
import "./TurneroConfigurationNewHairdresser.css";
import "../TurneroConfigurationHairdressers.css";
import TurneroLayout from "../../../../../components/TurneroLayout/TurneroLayout";
import { BiUserPlus } from "react-icons/bi";
import TurneroConfigurationHeader from "../../../../../components/TurneroConfigurationHeader/TurneroConfigurationHeader";
import TurneroButtonSelection from "../../../../../components/TurneroButtonSelection/TurneroButtonSelection";
import axios from "axios";
import { getRootPath } from "../../../../../functions/getRootPath";
import { useHistory } from "react-router";
import TurneroAvatar from "../../../../../components/TurneroAvatar/TurneroAvatar";
import TurneroInputTextSwitch from "../../../../../components/TurneroInputTextSwitch/TurneroInputTextSwitch";
import { FiUser, FiPhone } from "react-icons/fi";
import { AiOutlineMail } from "react-icons/ai";
import { BsFillLockFill } from "react-icons/bs";
import { HiUserGroup } from "react-icons/hi";
import { getUserProfilePhoto } from "../../../../../functions/getPhoto";
import useAuth from '../../../../../hooks/useAuth';
import { errorContext } from "../../../../../contexts/errorContext";

const TurneroConfigurationNewHairdresser = ({ setCreated, created }) => {

    const [auth] = useAuth();
    const [inputs, setInputs] = useState({
        username: "",
        mail: "",
        phone: "",
        password: "",
        hairdresser_privilege_id: 3,
        profile_photo: null
    });

    const [loading, setLoading] = useState(false);

    const [errors, setErrors] = useState({
        username: null,
        mail: null,
        phone: null,
        password: null,
    });

    const { setException } = useContext(errorContext);

    const history = useHistory();

    const updateProfilePhoto = async (id) => {

        try {
            const formData = new FormData();
            formData.append("myImage", inputs.profile_photo);
            const photoReq = await axios.post(`${getRootPath()}/users/hairdressers/${id}/profile_photo`, formData, { withCredentials: true });
            return true;
        }
        catch (e) {
            setException("El archivo no debe superar los 2MB y debe ser .png,.jpeg,.jpg,.gif,.svg");
            return false;
        };


    };


    const handleSaveClick = async () => {

        try {


            setLoading(true);
            const newHairdresserRequest = await axios.post(`${getRootPath()}/users/hairdressers`, { ...inputs, confirmPassword: inputs.password }, { withCredentials: true });
            setLoading(false);
            if (!newHairdresserRequest.data.created) {
                const currentErrors = newHairdresserRequest.data;
                return setErrors({
                    username: currentErrors.username.reason,
                    mail: currentErrors.mail.reason,
                    phone: currentErrors.phone.reason,
                    password: currentErrors.password.reason,
                });
            };

            if (inputs.profile_photo) {
                const updated = await updateProfilePhoto(newHairdresserRequest.data.created)
                if (!updated) return;
            };


            setCreated({ ...created, state: true });
            history.replace("/hairdresser/configuration/hairdressers");
        }

        catch (e) {
            setException("Se ha producido un error al registrar al peluquero");
        };

    };

    return (
        <TurneroLayout loading={loading} allowGoBack title="Nuevo Peluquero" icon={<BiUserPlus size={32} />}>
            <div className="turnero_configuration_new_hairdresser turnero_profile">
                <TurneroConfigurationHeader onSaveClick={handleSaveClick} name="Datos del peluquero" editMode={true} allowCancel={false} />

                <div className="turnero_profile_body_wrapper">
                    <div
                        className="turnero_profile_body"
                    >
                        <div className="turnero_profile_body_first_column">
                            <div className="turnero_profile_image_name">
                                <div className="turnero_profile_image_name_avatar">
                                    <TurneroAvatar onImageUpload={(e) => setInputs({ ...inputs, profile_photo: e.target.files[0] })} editMode={true} src={getUserProfilePhoto(null, null, true)} size={250} />
                                </div>
                                <TurneroInputTextSwitch
                                    onInputChange={(e) => {
                                        if (errors.username) setErrors({ ...errors, username: null });
                                        setInputs({ ...inputs, username: e.target.value })
                                    }}
                                    errorLabel={errors.username}
                                    editMode={true}
                                    title="Nombre y Apellido"
                                    icon={<FiUser size={18} />}
                                >
                                    {inputs.name}
                                </TurneroInputTextSwitch>
                            </div>
                        </div>
                        <div className="turnero_profile_body_second_column">
                            <div className="turnero_profile_data">
                                <TurneroInputTextSwitch
                                    onInputChange={(e) => {
                                        if (errors.mail) setErrors({ ...errors, mail: null });
                                        setInputs({ ...inputs, mail: e.target.value })
                                    }}
                                    errorLabel={errors.mail}
                                    editMode={true}
                                    title="Mail"
                                    icon={<AiOutlineMail size={18} />}
                                >
                                    {inputs.mail}
                                </TurneroInputTextSwitch>

                                <TurneroInputTextSwitch
                                    inputType="password"
                                    onInputChange={(e) => {
                                        if (errors.password) setErrors({ ...errors, password: null });
                                        setInputs({ ...inputs, password: e.target.value })
                                    }}
                                    errorLabel={errors.password}
                                    editMode={true}
                                    title="Contraseña"
                                    icon={<BsFillLockFill size={18} />}
                                >{inputs.password}</TurneroInputTextSwitch>

                                <TurneroInputTextSwitch
                                    onInputChange={(e) => {
                                        if (errors.phone) setErrors({ ...errors, phone: null });
                                        setInputs({ ...inputs, phone: e.target.value })
                                    }}
                                    errorLabel={errors.phone}
                                    editMode={true}
                                    title="Teléfono"
                                    icon={<FiPhone size={18} />}
                                >
                                    {inputs.phone}
                                </TurneroInputTextSwitch>
                                {auth.user.hairdresser_privilege_id <= 2 ? <TurneroInputTextSwitch editMode={false} title="Tipo de usuario" icon={<HiUserGroup size={18} />}>

                                    <TurneroButtonSelection
                                        buttons={[
                                            { id: 2, label: "Peluquero Administrador" },
                                            { id: 3, label: "Peluquero" },
                                        ]}
                                        selected={inputs.hairdresser_privilege_id}
                                        onSelectedChange={(item) => {
                                            setInputs({ ...inputs, hairdresser_privilege_id: item.id });

                                        }}
                                    />

                                </TurneroInputTextSwitch> : null}

                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </TurneroLayout>
    );
};

export default TurneroConfigurationNewHairdresser;
