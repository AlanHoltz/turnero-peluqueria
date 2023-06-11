import React, { useState, useContext, useEffect } from 'react';
import './TurneroClientProfile.css';
import TurneroLayout from '../../../components/TurneroLayout/TurneroLayout';
import TurneroConfigurationHeader from '../../../components/TurneroConfigurationHeader/TurneroConfigurationHeader';
import TurneroInputTextSwitch from '../../../components/TurneroInputTextSwitch/TurneroInputTextSwitch';
import TurneroAvatar from '../../../components/TurneroAvatar/TurneroAvatar';
import { BiUserPlus } from 'react-icons/bi';
import { FiUser, FiPhone } from 'react-icons/fi';
import { AiOutlineMail } from 'react-icons/ai';
import { BsFillLockFill } from 'react-icons/bs';
import Tweenful, { elastic } from "react-tweenful";
import useAuth from '../../../hooks/useAuth';
import { getUserProfilePhoto } from '../../../functions/getPhoto';
import TurneroDialog from '../../../components/TurneroDialog/TurneroDialog';
import axios from 'axios';
import { getRootPath } from '../../../functions/getRootPath';
import TurneroSnackbar from '../../../components/TurneroSnackBar/TurneroSnackBar';
import { errorContext } from '../../../contexts/errorContext';
import TurneroButton from '../../../components/TurneroButton/TurneroButton';
import styles from "../../../styles/_export.module.scss";
import { Switch, useRouteMatch } from 'react-router-dom'
import ProtectedRoute from '../../../components/ProtectedRoute';
import TurneroClientProfilePhone from './TurneroClientProfilePhone/TurneroClientProfilePhone';
import { useHistory } from 'react-router-dom';
import { ENABLE_PHONE_VERIFICATION } from '../../../constants';

const TurneroClientProfile = () => {

    const [loading, setLoading] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [animate, setAnimate] = useState({ bottom: ["-5%", "0"], opacity: [0, 1] });
    const [auth] = useAuth();
    const [profile, setProfile] = useState({ ...auth.user });
    const [updatedUser, setUpdatedUser] = useState({ password: "" });
    const [updatedUserErrors, setUpdatedUserErrors] = useState({});
    const [editedProfilePhoto, setEditedProfilePhoto] = useState(null);
    const [updateDialog, setUpdateDialog] = useState(false);
    const [snackbar, setSnackbar] = useState(false);
    const { path } = useRouteMatch();
    const { setException } = useContext(errorContext);
    const history = useHistory();

    useEffect(() => {
        setUpdatedUser({});
        setUpdatedUserErrors({});
        if (!editMode) setProfile({ ...auth.user });
    }, [editMode]);

    const changeModeToEdit = (mode) => {
        setEditMode(mode);
        setAnimate({ ...animate });
    };

    const updateProfilePhoto = async () => {

        try {
            const formData = new FormData();
            formData.append("myImage", editedProfilePhoto);
            await axios.post(`${getRootPath()}/users/myself/profile_photo`, formData, { withCredentials: true });
            return true;
        }

        catch (e) {
            setException("El archivo no debe superar los 2MB y debe ser .png,.jpeg,.jpg,.gif,.svg");
            return false;
        };



    };

    const updateUser = async () => {


        if (updateDialog) setUpdateDialog(false);

        try {
            setLoading(true);

            let updatedUserCpy = { ...updatedUser };
            if (!updatedUserCpy.password) delete updatedUserCpy.password;

            const updateRequest = await axios.put(`${getRootPath()}/users/myself`, updatedUserCpy, { withCredentials: true });

            setLoading(false);

            if (!updateRequest.data.updated) {
                setUpdatedUserErrors({ ...updateRequest.data })
                if (!updateRequest.data.error) return;
            };


            if (editedProfilePhoto) {
                const updated = await updateProfilePhoto();
                if (!updated) return;
            };

            changeModeToEdit(false);
            setSnackbar(true);
            setTimeout(() => {

                window.location.reload(true);

            }, 4000);
        }

        catch (e) {
            setException("Se ha producido un error modificando tu perfil");
        };




    };

    const handleSaveClick = () => {

        if (updatedUser.mail && auth.user?.user_mail !== updatedUser.mail) return setUpdateDialog(true);
        updateUser();
    };

    const getPhoneField = () => {
        
        if(editMode && !ENABLE_PHONE_VERIFICATION) return "Verificación de teléfono deshabilitada";

        if (editMode) return (
            <div style={{ display: "flex", alignItems: "center" }}>
                {profile.user_phone && <p style={{ marginRight: "5px" }}>3416708022</p>}
                <TurneroButton onClick={() => history.push("profile/phone")} color={styles.secondColor} style={
                    { borderRadius: "180px", background: styles.mainColor, fontSize: "12px" }} label={profile.user_phone ? "CAMBIAR" : "NUEVO"}/>
            </div>

        )

        return profile.user_phone ?? "No tiene un teléfono asociado"
    };

    return (
        <Switch>
            <ProtectedRoute exact type="client" path={`${path}`} auth={{...auth}} component={
                <TurneroLayout loading={loading} allowGoBack title="Perfil" icon={<BiUserPlus size={32} />}>
                    <div className="turnero_client_profile turnero_profile">
                        <TurneroConfigurationHeader onCancelClick={() => changeModeToEdit(false)} onEditClick={() => changeModeToEdit(true)} onSaveClick={handleSaveClick} name="Datos del Cliente" editMode={editMode} allowDelete={false} />
                        <div className="turnero_profile_body_wrapper">
                            <Tweenful.div
                                className="turnero_profile_body"
                                duration={400}
                                easing={elastic(0, 1)}
                                style={{ position: "relative" }}
                                animate={animate}
                            >
                                <div className="turnero_profile_body_first_column">
                                    <div className="turnero_configuration_hairdresser_profile_image_name">
                                        <div className="turnero_profile_image_name_avatar">
                                            <TurneroAvatar onImageUpload={(e) => { setEditedProfilePhoto(e.target.files[0]) }} editMode={editMode} src={getUserProfilePhoto(profile.user_id, profile.user_profile_photo)} size={250} name={profile.user_full_name} />
                                        </div>
                                        <TurneroInputTextSwitch
                                            onInputChange={(e) => {
                                                setProfile({ ...profile, user_full_name: e.target.value });
                                                setUpdatedUser({ ...updatedUser, username: e.target.value });
                                            }}
                                            errorLabel={updatedUserErrors.username?.reason}
                                            editMode={editMode}
                                            title="Nombre y Apellido"
                                            icon={<FiUser size={18} />}
                                        >
                                            {profile.user_full_name}
                                        </TurneroInputTextSwitch>
                                    </div>
                                </div>
                                <div className="turnero_profile_body_second_column">
                                    <div className="turnero_profile_data">
                                        <TurneroInputTextSwitch
                                            onInputChange={(e) => {
                                                setProfile({ ...profile, user_mail: e.target.value });
                                                setUpdatedUser({ ...updatedUser, mail: e.target.value });
                                            }}
                                            errorLabel={updatedUserErrors.mail?.reason}
                                            editMode={editMode}
                                            title="Mail"
                                            icon={<AiOutlineMail size={18} />}
                                        >
                                            {profile.user_mail}
                                        </TurneroInputTextSwitch>

                                        {editMode && <TurneroInputTextSwitch
                                            inputType="password"
                                            onInputChange={(e) => {
                                                setUpdatedUser({ ...updatedUser, password: e.target.value });
                                            }}
                                            errorLabel={updatedUserErrors.password?.reason}
                                            editMode={editMode}
                                            title="Contraseña"
                                            icon={<BsFillLockFill size={18} />}
                                        >{updatedUser.password}</TurneroInputTextSwitch>}

                                        <TurneroInputTextSwitch
                                            skipInputAltoughEditMode={true}
                                            onInputChange={(e) => {
                                                setProfile({ ...profile, user_phone: e.target.value });
                                                setUpdatedUser({ ...updatedUser, phone: e.target.value });
                                            }}
                                            errorLabel={updatedUserErrors.phone?.reason}
                                            editMode={editMode}
                                            title="Teléfono"
                                            icon={<FiPhone size={18} />}
                                        >
                                            {getPhoneField()}
                                        </TurneroInputTextSwitch>

                                    </div>
                                </div>
                            </Tweenful.div>
                        </div>


                    </div>

                    <TurneroDialog
                        open={updateDialog}
                        title="Confirmar Cambios"
                        bodyText={`¿Estás seguro que además de los demás datos deseas modificar tu dirección de email? Se te pedirá que lo valides nuevamente`}
                        onAcceptClick={() => { updateUser() }}
                        onDeclineClick={() => {
                            setUpdateDialog(false);
                        }}
                    />

                    <TurneroSnackbar
                        onClose={() => {
                            setSnackbar(false);
                        }}
                        hideOn={4000}
                        type={"success"}
                        message={"Sus datos han sido guardados"}
                        open={snackbar}
                    />

                </TurneroLayout >
            }/>
            <ProtectedRoute type="client" path={`${path}/phone`} auth={{...auth}} component={<TurneroClientProfilePhone/>}/>
        </Switch>
    );
};

export default TurneroClientProfile;