import React from 'react';
import './TurneroConfigurationRoot.css';
import ButtonBase from "@material-ui/core/ButtonBase";
import { AiOutlineUser } from "react-icons/ai";
import { GiHairStrands } from "react-icons/gi";
import { MdFreeBreakfast } from "react-icons/md";
import { BsCheckBox, BsGear } from "react-icons/bs";
import TurneroLayout from "../../../../components/TurneroLayout/TurneroLayout";
import { useHistory } from 'react-router';

const TurneroConfigurationRoot = () => {

    const history = useHistory();


    const configurationItems = [
        {
            id: 1,
            name: "Configuración de Peluqueros",
            icon: <AiOutlineUser size={30} />,
            onClick: () => history.push("/hairdresser/configuration/hairdressers")
        },
        {
            id: 2,
            name: "Configuración de Servicios",
            icon: <GiHairStrands size={30} />,
            onClick: () => history.push("/hairdresser/configuration/services")
        },
        {
            id: 3,
            name: "Configuración de Días Libres",
            icon: <MdFreeBreakfast size={30} />,
            onClick: () => history.push("/hairdresser/configuration/free-days")
        },
       /* {
            id: 4,
            name: "Configuración de Turnos",
            icon: <BsCheckBox size={30} />,
            onClick: () => history.push("/hairdresser/configuration/turns")
        },*/
    ];

    return (
        <TurneroLayout title="AJUSTES" icon={<BsGear size={30} />}>
            <div className="turnero_configuration_root">
                <div className="turnero_configuration_root_grid">
                    {configurationItems.map((item) => (
                        <TurneroConfigurationItem onClick={item.onClick} key={item.id} icon={item.icon}>
                            {item.name}
                        </TurneroConfigurationItem>
                    ))}
                </div>
            </div>
        </TurneroLayout>
    );
};

const TurneroConfigurationItem = ({ icon, children, onClick }) => {
    return (
        <ButtonBase onClick={onClick} className="turnero_configuration_item_root">
            {icon}
            <p>{children}</p>
        </ButtonBase>
    );
};

export default TurneroConfigurationRoot;