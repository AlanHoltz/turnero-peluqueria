import React from "react";
import "./TurneroList.css";
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import styles from '../../styles/_export.module.scss';
import { MdEdit } from 'react-icons/md';
import { AiFillDelete } from 'react-icons/ai';
import TurneroIconButton from "../TurneroButton/TurneroIconButton/TurneroIconButton";
import TurneroAvatar from '../TurneroAvatar/TurneroAvatar';
import PropTypes from 'prop-types';
import TurneroChip from '../TurneroChip/TurneroChip'

const TurneroList = ({ items, onItemDelete, onItemEdit, itemsStyle, onItemClick }) => {
    return (
        <List style={{ color: styles.mainColor }}>
            {items.map((item) => {
                const labelId = `turnero-list-${item}`;
                return (
                    <ListItem key={item.id} button onClick={() => { onItemClick(item) }} style={itemsStyle}>
                        <ListItemAvatar>
                            <TurneroAvatar name={item.name} src={item.avatar} />
                        </ListItemAvatar>
                        <ListItemText id={labelId} primary={<div>
                            <span style={item.state ? {marginRight:"10px"} : null}>
                                {item.name}
                            </span>

                            {item.state ? <TurneroChip size="small" style={{borderColor: item.state.color, color: item.state.color}} label={item.state.text} /> : null}

                        </div>} />
                        <ListItemSecondaryAction>
                            {item.secondary ? null : <div className="turnero_list_buttons">
                                {item.allowEdit ? <TurneroIconButton style={{margin:"4px"}} onClick={() => { onItemEdit(item) }} color={styles.editButtonColor} icon={<MdEdit />} /> : null}
                                {item.allowDelete ? <TurneroIconButton style={{margin:"4px"}} onClick={() => { onItemDelete(item) }} color={styles.deleteButtonColor} icon={<AiFillDelete />} /> : null}
                            </div>}
                            {item.secondary}
                        </ListItemSecondaryAction>
                    </ListItem>
                );
            })}
        </List>
    );
};

TurneroList.defaultProps = {
    onItemDelete: () => { },
    onItemEdit: () => { },
    onItemClick: () => { },
    showDelete: true,
    showEdit: true,
    items: []
}


TurneroList.propTypes = {
    items: PropTypes.array,
    onItemDelete: PropTypes.func,
    onItemEdit: PropTypes.func,
    itemsStyle: PropTypes.object,
    onItemClick: PropTypes.func,
}

export default TurneroList;
