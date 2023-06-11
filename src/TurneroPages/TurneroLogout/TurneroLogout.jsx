import { useEffect } from "react";
import axios from "axios";
import { getRootPath } from "../../functions/getRootPath";

const TurneroLogout = () => {


    useEffect(async ()=>{
        await axios.get(`${getRootPath()}/users/logout`,{withCredentials:true});
        window.location.href = "/";
    },[]);


    return <></>;
};

export default TurneroLogout;
