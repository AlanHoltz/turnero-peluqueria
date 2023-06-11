import React, { useState, useEffect } from "react";
import "./TurneroConfigurationHairdressersList.css";
import TurneroLayout from "../../../../../components/TurneroLayout/TurneroLayout";
import { FiUsers } from "react-icons/fi";
import TurneroList from "../../../../../components/TurneroList/TurneroList";
import axios from "axios";
import { getRootPath } from "../../../../../functions/getRootPath";
import { getUserProfilePhoto } from "../../../../../functions/getPhoto";
import TurneroButton from "../../../../../components/TurneroButton/TurneroButton";
import { BiUserPlus } from "react-icons/bi";
import TurneroDialog from "../../../../../components/TurneroDialog/TurneroDialog";
import useAuth from "../../../../../hooks/useAuth";
import { useHistory } from "react-router";
import styles from "../../../../../styles/_export.module.scss";
import { hairdressersAllowOperations } from "../../../../../functions/hairdressersAllowOperations";
import TurneroSnackbar from "../../../../../components/TurneroSnackBar/TurneroSnackBar";

const TurneroConfigurationHairdressersList = ({ created, setCreated, deleted, setDeleted, setProfileEditMode, profileEditMode }) => {

    const [hairdressers, setHairdressers] = useState([]);
    const [selectedUser, setSelectedUser] = useState({});
    const [deleteDialog, setDeleteDialog] = useState(false);
    const [loading, setLoading] = useState(false);

    const [auth] = useAuth();
    const history = useHistory();

    const getHairdressers = async () => {
        setLoading(true);
        const hairdressersRequest = await axios.get(`${getRootPath()}/users/hairdressers`, { withCredentials: true });
        setHairdressers([...hairdressersRequest.data]);
        setLoading(false);
    };

    useEffect(() => {
        getHairdressers();
        return () => {
            setCreated({ ...created, state: false });
            setDeleted({ ...deleted, state: false });
        };
    }, []);

    const getFormattedHairdressers = () => {
        return hairdressers.map((hairdresser) => ({
            id: hairdresser.user_id,
            state: hairdresser.hairdresser_enabled == 1 ? { text: "Habilitado", color: styles.acceptButtonColor } : { text: "Deshabilitado", color: styles.deleteButtonColor },
            name: hairdresser.user_full_name,
            avatar: getUserProfilePhoto(hairdresser.user_id, hairdresser.user_profile_photo),
            allowEdit: hairdressersAllowOperations(
                { id: auth.user.user_id, privilege: auth.user.hairdresser_privilege_id },
                { id: hairdresser.user_id, privilege: hairdresser.hairdresser_privilege_id }
            ).edit,
            allowDelete: hairdressersAllowOperations(
                { id: auth.user.user_id, privilege: auth.user.hairdresser_privilege_id },
                { id: hairdresser.user_id, privilege: hairdresser.hairdresser_privilege_id }
            ).delete,
        }));
    };

    const handleDeleteAccept = async () => {
        await axios.delete(`${getRootPath()}/users/hairdressers/${selectedUser.id}`, { withCredentials: true });
        setDeleteDialog(false);
        getHairdressers();
        setDeleted({ ...deleted, state: true });
    };

    return (
        <>
            <TurneroLayout loading={loading} icon={<FiUsers size={30} />} title="PELUQUEROS" allowGoBack>
                <div className="turnero_configuration_hairdressers_list">
                    {auth.user.hairdresser_privilege_id === 1 ? <div className="turnero_configuration_hairdressers_list_new">
                        <TurneroButton
                            icon={<BiUserPlus />}
                            onClick={() => {
                                history.push("hairdressers/new");
                            }}
                            label="nuevo"
                        />
                    </div> : null}
                    <TurneroList
                        itemsStyle={{ borderBottom: `1px solid ${styles.lightGray}` }}
                        onItemClick={(item) => {
                            history.push(`hairdressers/${item.id}`);
                        }}
                        onItemEdit={(item) => {
                            setProfileEditMode(true);
                            history.push(`hairdressers/${item.id}`);
                        }}
                        onItemDelete={(user) => {
                            setSelectedUser(user);
                            setDeleteDialog(true);
                        }}
                        items={getFormattedHairdressers()}
                    />
                </div>
            </TurneroLayout>
            <TurneroDialog
                open={deleteDialog}
                title="Eliminar Peluquero"
                bodyText={`¿Estás seguro que deseas eliminar al peluquero ${selectedUser.name}?`}
                onAcceptClick={handleDeleteAccept}
                onDeclineClick={() => {
                    setDeleteDialog(false);
                }}
            />
            <TurneroSnackbar
                onClose={() => {
                    setDeleted({ ...deleted, setDeleted: false });
                }}
                hideOn={4000}
                type={"success"}
                message={"El peluquero ha sido eliminado"}
                open={deleted.state}
            />
            <TurneroSnackbar
                onClose={() => {
                    setCreated({ ...created, state: false });
                }}
                hideOn={4000}
                type={"success"}
                message={"El peluquero ha sido creado"}
                open={created.state}
            />
        </>
    );
};

export default TurneroConfigurationHairdressersList;
