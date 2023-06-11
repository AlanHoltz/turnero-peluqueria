import React from 'react';
import './TurneroTabs.css';
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import PropTypes from 'prop-types';

const TurneroTabs = ({ value, onChange, tabs, style }) => {
    return (
        <Tabs
            className="turnero_tabs"
            value={value}
            onChange={onChange}
            indicatorColor="primary"
            style={style}
            textColor="primary"
            centered
        >
            {tabs.map((tab, id) => <Tab key={id} label={tab} />)}
        </Tabs>
    );
};

TurneroTabs.defaultProps = {
    onChange: () => { },
    tabs: [],
}

TurneroTabs.propTypes = {
    value: PropTypes.number,
    onChange: PropTypes.func,
    tabs: PropTypes.array,
    style: PropTypes.object,
};

export default TurneroTabs;