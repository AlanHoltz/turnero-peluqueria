import React, { useRef, useState, forwardRef, useEffect } from "react";
import Avatar from "@material-ui/core/Avatar";
import styles from "../../styles/_export.module.scss";
import PropTypes from 'prop-types';
import './TurneroAvatar.css';
import { MdEdit } from "react-icons/md";

const TurneroAvatar = forwardRef(({ src, name, size, editMode, onImageUpload }, ref) => {

    const inputRef = useRef(null);
    const [preview, setPreview] = useState(null);


    const getName = () => {
        const initials = name.split(" ");
        if (initials.length > 1) return `${initials[0][0]} ${initials[1][0]}`.toUpperCase();
        return `${initials[0][0]}`.toUpperCase();
    };

    const onUpload = (e) => {
        const [file] = inputRef.current.files;
        if (file) setPreview(URL.createObjectURL(file));
        onImageUpload(e);
    };

    useEffect(() => {
        if (inputRef && ref) ref.current = inputRef.current;
    }, [inputRef]);

    return (
        <>
            <div style={{ position: "relative" }}>
                <Avatar src={preview ? preview : src} style={{ border: `1px solid ${styles.mainColor}`, color: styles.mainColor, background: styles.secondColor, width: size, height: size }}>
                    {getName()}
                </Avatar>
                {editMode ? <div className="turnero_avatar_edit" onClick={() => inputRef.current.click()}>
                    <span><MdEdit color={styles.mainColor} size={35} /></span>
                </div> : null}
            </div>

            {editMode ? <input
                ref={inputRef}
                style={{ display: "none" }}
                onChange={onUpload}
                type="file"
                accept=".png, .jpg, .jpeg, .gif, .svg"
                name="photo"
            /> : null}
        </>

    );
});

TurneroAvatar.defaultProps = {
    name: "",
    onImageUpload: () => { }
};

TurneroAvatar.propTypes = {
    name: PropTypes.string,
    src: PropTypes.string,
    size: PropTypes.number,
    editMode: PropTypes.bool,
    onImageUpload: PropTypes.func,
}

export default TurneroAvatar;
