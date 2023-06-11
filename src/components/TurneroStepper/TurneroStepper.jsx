import React, { useEffect } from 'react';
import './TurneroStepper.css';
import PropTypes from 'prop-types';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import StepConnector from '@material-ui/core/StepConnector';
import styles from '../../styles/_export.module.scss';
import useScreenWidth from '../../hooks/useScreenWidth';
import _ from 'lodash';

const TurneroStepper = ({ children, step, icons, style }) => {

    const width = useScreenWidth();
    const breakpoint = parseInt(styles.turneroSidebarBreakpoint.replace("px",""));

    const getResponsiveIcon = (icon) => {

        const responsiveIcons = [];
        let counter = 0;

        _.toPairs(icons).forEach((ic,index) => {
            if (index >= step - 1 && index <= step + 1) {
                responsiveIcons.push([counter, ic[1]]);
                counter++;
            };
        })

        return _.fromPairs(responsiveIcons)[icon];

    };

    const ColorlibConnector = withStyles({
        alternativeLabel: {
            top: 24,
        },
        active: {
            '& $line': {
                background: styles.mainColor,
            },
        },
        completed: {
            '& $line': {
                background: styles.acceptButtonColor,
            },
        },
        line: {
            height: 1,
            border: 0,
            backgroundColor: '#ffffff',
            borderRadius: 1,
        },
    })(StepConnector);


    const useColorlibStepIconStyles = makeStyles({
        root: {
            background: "transparent",
            zIndex: 1,
            color: '#fff',
            width: 50,
            height: 50,
            display: 'flex',
            borderRadius: '50%',
            justifyContent: 'center',
            alignItems: 'center',
        },
        active: {
            color: styles.mainColor

        },
        completed: {
            color: styles.acceptButtonColor
        },
    });

    function ColorlibStepIcon(props) {
        const classes = useColorlibStepIconStyles();
        const { active, completed } = props;

        const stepIcon = String(props.icon) - 1;



        return (
            <div
                className={clsx(classes.root, {
                    [classes.active]: active,
                    [classes.completed]: completed,
                })}
            >
                {width < breakpoint ? getResponsiveIcon(stepIcon) : icons[stepIcon]}
            </div>
        );
    };

    const getStepColor = (index) => {
        if (index === step) return styles.mainColor;
        if (index < step) return styles.acceptButtonColor;
        return "#ffffff";
    };



    return (
        <Stepper style={{ background: styles.secondColor, zIndex: 100, ...style }} alternativeLabel activeStep={width < breakpoint ? (step === 0 ? 0 : 1) : step} className="turnero_stepper" connector={<ColorlibConnector />}>
            {children.map((label, index) => {
                if (width >= breakpoint || index >= step - 1 && index <= step + 1) {
                    return (
                        <Step key={label}>
                            <StepLabel StepIconComponent={ColorlibStepIcon}><p style={{ color: getStepColor(index) }}>{label}</p></StepLabel>
                        </Step>
                    )
                };

            })}
        </Stepper>
    );
};

TurneroStepper.defaultProps = {
    steps: [],
    icons: {},
}

TurneroStepper.propTypes = {
    children: PropTypes.array,
    step: PropTypes.number,
    icons: PropTypes.object,
    style: PropTypes.object,
}

export default TurneroStepper;