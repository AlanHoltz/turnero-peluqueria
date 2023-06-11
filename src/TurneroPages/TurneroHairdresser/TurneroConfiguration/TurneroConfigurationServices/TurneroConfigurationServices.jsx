import React, { useState, useEffect, useContext } from 'react';
import './TurneroConfigurationServices.css';
import TurneroLayout from '../../../../components/TurneroLayout/TurneroLayout';
import { GiHairStrands } from 'react-icons/gi';
import { getRootPath } from '../../../../functions/getRootPath';
import axios from 'axios';
import TurneroButton from '../../../../components/TurneroButton/TurneroButton';
import TurneroList from '../../../../components/TurneroList/TurneroList';
import styles from '../../../../styles/_export.module.scss';
import useAuth from '../../../../hooks/useAuth';
import TurneroDialog, { TurneroDialogButtons } from '../../../../components/TurneroDialog/TurneroDialog';
import TurneroAvatar from '../../../../components/TurneroAvatar/TurneroAvatar';
import TurneroInputTextSwitch from '../../../../components/TurneroInputTextSwitch/TurneroInputTextSwitch';
import { AiOutlineClockCircle, AiFillDelete } from 'react-icons/ai';
import { MdEdit } from 'react-icons/md';
import { BiDollar } from 'react-icons/bi';
import { getServicePhoto } from '../../../../functions/getPhoto';
import { getParsedTime } from '../../../../functions/dateHandler';
import TurneroIconButton from '../../../../components/TurneroButton/TurneroIconButton/TurneroIconButton';
import TurneroSnackbar from '../../../../components/TurneroSnackBar/TurneroSnackBar';
import { errorContext } from '../../../../contexts/errorContext';

const TurneroConfigurationServices = () => {

    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(false);
    const [auth] = useAuth();
    const [selectedService, setSelectedService] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [snackbar, setSnackbar] = useState(false);


    const { setException } = useContext(errorContext);

    const getServices = async () => {
        setLoading(true);
        const servicesRequest = await axios.get(`${getRootPath()}/services`, { withCredentials: true });
        setServices([...servicesRequest.data]);
        setLoading(false);
    };


    useEffect(getServices, []);

    const getFormattedServices = () => {
        return services.map(service => ({
            id: service.service_id,
            name: service.service_name,
            avatar: getServicePhoto(service.service_id, service.service_photo),
            secondary: <p style={{ fontSize: "17px", fontWeight: "700" }}>{`$${service.service_cost}`}</p>

        }));
    };


    const getServiceFromList = (item) => services.filter(service => service.service_id === item.id)[0];

    const onNewClick = () => {
        setSnackbar(false);
        setSelectedService({ service_name: "", service_estimated_time: "", service_cost: "" });
        setEditMode(true);
    };


    return (
        <>
            <TurneroLayout title="SERVICIOS" allowGoBack loading={loading} icon={<GiHairStrands size={30} />}>
                <div className="turnero_configuration_services">
                    {auth.user.hairdresser_privilege_id <= 2 ? <div className="turnero_configuration_services_new">
                        <TurneroButton onClick={onNewClick} label="NUEVO" />
                    </div> : null}
                    <TurneroList
                        itemsStyle={{ borderBottom: `1px solid ${styles.lightGray}` }}
                        items={getFormattedServices()}
                        onItemClick={(item) => {
                            setSnackbar(false);
                            setSelectedService(getServiceFromList(item));
                        }}
                    />
                </div>
            </TurneroLayout>
            <TurneroDialog style={{ padding: 0 }} noBodyText
                onClose={() => {
                    setSelectedService(null);
                    setEditMode(false);
                }}
                noButtons noTitle open={selectedService ? true : false} body={
                    <TurneroConfigurationServicesDialog setException={setException} setSelectedService={setSelectedService} getServices={getServices} snackbar={snackbar} setSnackbar={setSnackbar}
                        setEditMode={setEditMode} auth={auth} editMode={editMode} selectedService={selectedService} />
                } />

            <TurneroSnackbar
                onClose={() => {
                    setSnackbar(false);
                }}
                hideOn={4000}
                type={"success"}
                message={"Los cambios han sido guardados"}
                open={snackbar}
            />

        </>
    );
};

const TurneroConfigurationServicesDialog = ({ setException, getServices, setSelectedService, auth, editMode, selectedService, setEditMode, snackbar, setSnackbar }) => {


    const [inputs, setInputs] = useState({ name: "", time: "", cost: "", photo: null })
    const [errors, setErrors] = useState({ name: null, time: null, cost: null })

    useEffect(() => {

        setInputs({
            ...inputs, name: selectedService.service_name,
            time: selectedService.service_estimated_time, cost: selectedService.service_cost
        });

    }, [selectedService]);

    const updatePhoto = async (id) => {

        const editedPhoto = inputs.photo;

        if (!editedPhoto) return;

        try {
            const formData = new FormData();
            formData.append("myImage", editedPhoto);

            const updatePhotoRequest = await axios.put(`${getRootPath()}/services/${selectedService.service_id ?? id}/photo`, formData, { withCredentials: true });

        }

        catch (e) {
            setException("El archivo no debe superar los 2MB y debe ser .png,.jpeg,.jpg,.gif,.svg");
        };


    };

    const onAcceptClick = async (e) => {

        try {
            const payload = {
                serviceName: inputs.name,
                serviceEstimatedTime: +inputs.time,
                serviceCost: inputs.cost

            };


            let serviceHandlingRequest;

            if (selectedService.service_id) {
                serviceHandlingRequest = await axios.put(`${getRootPath()}/services/${selectedService.service_id}`, payload, { withCredentials: true });
            } else {
                serviceHandlingRequest = await axios.post(`${getRootPath()}/services`, payload, { withCredentials: true });
            };


            if (serviceHandlingRequest.data.updated || serviceHandlingRequest.data.created) {

                await updatePhoto(serviceHandlingRequest.data.created);

                setSnackbar(true);
                setEditMode(false);
                setSelectedService(null);
                getServices();

            } else {
                setErrors({
                    ...errors,
                    name: serviceHandlingRequest.data.serviceName,
                    time: serviceHandlingRequest.data.serviceEstimatedTime,
                    cost: serviceHandlingRequest.data.serviceCost
                });
            };
        }

        catch (e) {
            setException("Se ha producido un error al crear/modificar el servicio");
        };




    };

    const handleDeleteClick = async () => {


        const deleteRequest = await axios.delete(`${getRootPath()}/services/${selectedService.service_id}`, { withCredentials: true });

        if (deleteRequest.data.deleted) {
            setSnackbar(true);
            setSelectedService(null);
            getServices();
        };
    };

    const onCancelClick = () => {
        setEditMode(false);
        if (!selectedService.service_id) setSelectedService(null);
    };


    return (
        <div style={{ padding: 0 }} className="turnero_configuration_services_info_modal">
            <div style={{ padding: "8px 34px" }}>
                {auth.user.hairdresser_privilege_id < 3 && !editMode ? <div style={{ display: "flex", flexDirection: "column", position: "absolute", top: "0", right: "0" }}>
                    <TurneroIconButton onClick={() => setEditMode(true)} style={{ margin: "4px" }} color={styles.editButtonColor} icon={<MdEdit />} />
                    <TurneroIconButton onClick={handleDeleteClick} style={{ margin: "4px" }} color={styles.deleteButtonColor} icon={<AiFillDelete />} />
                </div> : null}
                <div style={{ display: "flex", justifyContent: "center" }}>
                    <TurneroAvatar onImageUpload={(e) => setInputs({ ...inputs, photo: e.target.files[0] })} editMode={editMode} src={getServicePhoto(selectedService?.service_id, selectedService?.service_photo)} size={120} />
                </div>
                <TurneroInputTextSwitch errorLabel={errors.name} onInputChange={(e) => setInputs({ ...inputs, name: e.target.value })} editMode={editMode} icon={<GiHairStrands size={20} />} title='Nombre' >{inputs.name}</TurneroInputTextSwitch>
                <TurneroInputTextSwitch errorLabel={errors.time ? "Debe ser un número y superar o ser 1 minuto" : null} onInputChange={(e) => setInputs({ ...inputs, time: e.target.value * 60000 })} editMode={editMode} icon={<AiOutlineClockCircle size={20} />} title='Tiempo Estimado(m)'>{editMode ? (inputs.time === "" ? "" : inputs.time / 60000) : getParsedTime(inputs.time, true)}</TurneroInputTextSwitch>
                < TurneroInputTextSwitch errorLabel={errors.cost} onInputChange={(e) => setInputs({ ...inputs, cost: e.target.value })} editMode={editMode} noMargin icon={<BiDollar size={20} />} title='Costo' >{editMode ? inputs.cost : `$${inputs.cost}`}</TurneroInputTextSwitch>
            </div>
            {editMode ? <TurneroDialogButtons style={{ display: "flex", justifyContent: "flex-end", padding: "9px 4px" }} onAcceptClick={onAcceptClick} onCancelClick={onCancelClick} /> : null}

        </div>
    );
};


export default TurneroConfigurationServices;