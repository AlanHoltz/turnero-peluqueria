import { getRootPath } from "./getRootPath";

const getUserProfilePhoto = (id, photo, defaultIfNull) => {
    return (photo && id) || defaultIfNull ? `${getRootPath().replace("/api", "")}/media/profile_photos/${photo ? `${id}/${photo}` : `default/default.svg`}` : null;
};


const getServicePhoto = (id, photo) => {
    return `${getRootPath().replace("/api", "")}/media/services_photos/${photo ? `${id}/${photo}` : `default/default.svg`}`;
};

const getTurnPhoto = (id, photo) => {
    return `${getRootPath().replace("/api", "")}/media/turns/${photo ? `${id}/${photo}` : `default/default.svg`}`;
};

export { getUserProfilePhoto, getServicePhoto, getTurnPhoto };