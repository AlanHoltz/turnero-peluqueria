import {
    useEffect,
    useState
} from "react";

const useScreenWidth = () => {

    const [width, setWidth] = useState(window.innerWidth);


    const resize = () => {
        setWidth(window.innerWidth);
    };

    useEffect(() => {

        window.addEventListener("resize", resize);

        return () => {
            window.removeEventListener("resize", resize);
        }

    }, []);

    return width;

};

export default useScreenWidth;