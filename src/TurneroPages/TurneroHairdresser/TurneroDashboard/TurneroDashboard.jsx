import React, { useState, useEffect } from 'react';
import './TurneroDashboard.css';
import TurneroLayout from '../../../components/TurneroLayout/TurneroLayout';
import { RiDashboard3Line } from 'react-icons/ri';
import TurneroTabs from '../../../components/TurneroTabs/TurneroTabs';
import styles from '../../../styles/_export.module.scss';
import { BsCheckBox, BsPlusCircle, BsTrash } from "react-icons/bs";
import { FaRegMoneyBillAlt } from 'react-icons/fa';
import {
    PieChart, Pie, Legend, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, LineChart, Line, Label
} from 'recharts';
import TurneroInputSelect from '../../../components/TurneroInput/TurneroInputSelect/TurneroInputSelect';
import useAuth from '../../../hooks/useAuth';
import axios from 'axios';
import { getRootPath } from '../../../functions/getRootPath';
import TurneroAvatar from '../../../components/TurneroAvatar/TurneroAvatar';
import { getUserProfilePhoto } from '../../../functions/getPhoto';
import TurneroChip from '../../../components/TurneroChip/TurneroChip';
import useScreenWidth from '../../../hooks/useScreenWidth';
import { MdAccessTime } from "react-icons/md";
import moment from 'moment';
import Tweenful, { elastic } from "react-tweenful";
import TurneroInputArrows from '../../../components/TurneroInput/TurneroInputArrows/TurneroInputArrows';

const TurneroDashboard = () => {

    const [loading, setLoading] = useState(false);
    const [isHistorical, setIsHistorical] = useState(false);
    const [auth] = useAuth();
    const [dashboardFilter, setDashboardFilter] = useState(auth.user.user_id);
    const [yearFilter, setYearFilter] = useState(new Date().getFullYear());
    const [allowedHairdressers, setAllowedHairdressers] = useState([]);
    const [statistics, setStatistics] = useState(null);
    const [nextTurn, setNextTurn] = useState(null);
    const [animate, setAnimate] = useState({ bottom: ["-5%", "0"], opacity: [0, 1] });
    const width = useScreenWidth;

    useEffect(async () => {

        let hairdressers = await axios.get(`${getRootPath()}/users/hairdressers`, { withCredentials: true });
        hairdressers = hairdressers.data;


        const allowedHairdressersTemp = [];

        hairdressers.forEach(hairdresser => {
            if (hairdresser.hairdresser_privilege_id > auth.user.hairdresser_privilege_id || hairdresser.user_id === auth.user.user_id) {

                allowedHairdressersTemp.push(hairdresser);
            };
        });


        setAllowedHairdressers([...allowedHairdressersTemp]);

    }, []);


    useEffect(async () => {

        setAnimate({ ...animate });

        setLoading(true);

        let statisticsTemp = await axios.get(`${getRootPath()}/statistics/${dashboardFilter === 0 ? "general" : dashboardFilter}/${isHistorical ? yearFilter : "monthly"}`, { withCredentials: true });
        statisticsTemp = statisticsTemp.data;
        setStatistics(statisticsTemp);

        let nextTurnTemp = await axios.get(`${getRootPath()}/turns/next/${dashboardFilter === 0 ? "general" : dashboardFilter}`, { withCredentials: true });
        setNextTurn(nextTurnTemp.data);

        setLoading(false);



    }, [dashboardFilter, isHistorical, yearFilter]);


    const getSelectItems = () => {
        let baseItems = allowedHairdressers.map(hairdresser => {
            return { value: hairdresser.user_id, name: hairdresser.user_id === auth.user.user_id ? "Mío" : hairdresser.user_full_name }
        });

        baseItems.push({ value: 0, name: "General" });

        return baseItems;
    };

    const currentUser = allowedHairdressers.filter(hairdresser => hairdresser.user_id === dashboardFilter)[0];


    return (
        <TurneroLayout loading={loading} icon={<RiDashboard3Line size={25} />} title="DASHBOARD">
            <TurneroTabs style={{ minHeight: "49px" }} tabs={["ESTE MES", "HISTÓRICO"]} onChange={(ev, val) => { setIsHistorical(val) }} value={isHistorical ? 1 : 0} />
            <section className="turnero_dashboard">
                <div className="turnero_dashboard_header">
                    <div className="turnero_dashboard_header_user">
                        {currentUser ? <TurneroAvatar src={getUserProfilePhoto(currentUser.user_id, currentUser.user_profile_photo)} size={40} name={currentUser.user_full_name} /> : null}
                        <p>{currentUser ? currentUser.user_full_name : "General"}</p>
                        {currentUser ? <TurneroChip size="small" style={{ borderColor: currentUser.hairdresser_enabled ? styles.acceptButtonColor : styles.deleteButtonColor, color: currentUser.hairdresser_enabled ? styles.acceptButtonColor : styles.deleteButtonColor }} label={currentUser.hairdresser_enabled ? "Habilitado" : "Inhabilitado"} /> : null}
                    </div>
                    <div className="turnero_dashboard_header_next_turn">
                        <div>
                            <MdAccessTime size={20} />
                            <h2>{`${nextTurn ? "Próximo Turno:" : "Sin Turnos a realizar"}`}</h2>
                        </div>
                        {nextTurn && <span>{moment(nextTurn.turn_datetime).format("DD/MM/YYYY - HH:mm")}</span>}</div>
                    <div className="turnero_dashboard_header_filter">
                        <p>Dashboard: </p>
                        <TurneroInputSelect
                            includeNone={false}
                            color={styles.mainColor}
                            onChange={(e) => {
                                setDashboardFilter(e.target.value);
                            }}
                            value={dashboardFilter}
                            items={getSelectItems()}
                            title="Peluqueros"
                        />
                    </div>
                </div>
                <Tweenful.div
                    duration={400}
                    easing={elastic(0, 1)}
                    style={{ position: "relative" }}
                    animate={animate}>
                    {!isHistorical ? <TurneroDashboardMonthly statistics={statistics} width={width} /> : <TurneroDashboardHistorical statistics={statistics} yearFilter={yearFilter} setYearFilter={setYearFilter} />}
                </Tweenful.div>
            </section>
        </TurneroLayout>
    )

};

const TurneroDashboardMonthly = ({ statistics, width }) => {


    const COLORS = [styles.acceptedColor, styles.rejectedColor];

    const RADIAN = Math.PI / 180;

    const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
        const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
        const x = cx + radius * Math.cos(-midAngle * RADIAN);
        const y = cy + radius * Math.sin(-midAngle * RADIAN);

        return (
            <text x={x} y={y} fill="black" fontWeight={700} textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
                {`${(percent * 100).toFixed(0)}%`}
            </text>
        );
    };

    const data = [{ name: 'Turnos Aceptados', value: statistics?.accepted_turns_total },
    { name: 'Turnos Rechazados', value: statistics?.rejected_turns_total },];

    return (
        <div className="turnero_dashboard_monthly">
            <div className="turnero_dashboard_monthly_turns_statistics">
                <div style={{ color: styles.pendingColor }} className="turnero_dashboard_monthly_statistic">
                    <div className="turnero_dashboard_monthly_statistic_turns">
                        <div>
                            <BsPlusCircle />
                            <p>Turnos Totales</p>
                        </div>
                        <span>
                            <p>{(statistics?.accepted_turns_total + statistics?.rejected_turns_total).toString()}</p>
                        </span>

                    </div>
                </div>
                <div style={{ color: styles.acceptedColor }} className="turnero_dashboard_monthly_statistic">
                    <div className="turnero_dashboard_monthly_statistic_turns">
                        <div>
                            <BsPlusCircle />
                            <p>Turnos Aceptados</p>
                        </div>
                        <span>
                            <p>{statistics?.accepted_turns_total}</p>
                        </span>
                    </div>
                </div>
                <div style={{ color: styles.rejectedColor }} className="turnero_dashboard_monthly_statistic">
                    <div className="turnero_dashboard_monthly_statistic_turns">
                        <div>
                            <BsPlusCircle />
                            <p>Turnos Rechazados</p>
                        </div>
                        <span>
                            <p>{statistics?.rejected_turns_total}</p>
                        </span>
                    </div>
                </div>
                <div className="turnero_dashboard_monthly_statistic turnero_dashboard_monthly_statistic_average">
                    <ResponsiveContainer width={width <= 545 || !width ? 200 : "100%"} height={250}>
                        <PieChart>
                            <Pie
                                data={data}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={renderCustomizedLabel}
                                isAnimationActive={false}
                                outerRadius={80}
                                stroke='none'
                                dataKey="value"
                            >
                                {data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Legend verticalAlign="bottom" height={36} />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>
            <div className="turnero_dashboard_monthly_earnings_statistics">
                <div style={{ color: styles.mainColor }} className="turnero_dashboard_monthly_statistic">
                    <div className="turnero_dashboard_monthly_statistic_earnings">
                        <div>
                            <FaRegMoneyBillAlt />
                            <p>Ganancias</p>
                        </div>
                        <span>
                            <p>${statistics?.total_earnings}</p>
                        </span>
                    </div>

                </div>
            </div>
        </div>
    );
};


const TurneroDashboardHistorical = ({ yearFilter, setYearFilter, statistics }) => {


    const timeData = [
        {
            name: "Ene 2022",
            Ganancias: 2000,
        },
        {
            name: "Feb 2022",

            Ganancias: 3000,
        },
        {
            name: "Mar 2022",

            Ganancias: 3500,
        },
        {
            name: "Abr 2022",

            Ganancias: 3200,
        },
        {
            name: "May 2022",
            Ganancias: 3600,
        },
        {
            name: "Jun 2022",
            Ganancias: 4000,
        },
        {
            name: "Jul 2022",
            Ganancias: 2500,
        },
        {
            name: "Ago 2022",
            Ganancias: 2400,
        },
        {
            name: "Sep 2022",
            Ganancias: 3000,
        },
        {
            name: "Oct 2022",
            Ganancias: 3120,
        },
        {
            name: "Nov 2022",
            Ganancias: 4000,
        },
        {
            name: "Dec 2022",
            Ganancias: 6000,
        },
    ];

    const getTurnsData = () => {


        if (!statistics || !Array.isArray(statistics)) return [];

        return statistics.map(statistic => ({
            name: `${statistic.month.toString().length === 1 ? "0" : ""}${statistic.month}/${statistic.year}`,
            "Turnos Aceptados": statistic.accepted_turns_total,
            "Turnos Rechazados": statistic.rejected_turns_total,
        }));
    };

    const getEarningsData = () => {


        if (!statistics || !Array.isArray(statistics)) return [];

        return statistics.map(statistic => ({
            name: `${statistic.month.toString().length === 1 ? "0" : ""}${statistic.month}/${statistic.year}`,
            "Ganancias": statistic.total_earnings
        }));
    };



    return (
        <div className="turnero_dashboard_historical">
            <div className="turnero_dashboard_historical_filter">
                <TurneroInputArrows onChange={(val) => { setYearFilter(val) }} defaultValue={new Date().getFullYear()} type={"number"} />
            </div>
            <ResponsiveContainer width={"100%"} height={200}>
                <BarChart

                    data={getTurnsData()}
                    margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5
                    }}
                >

                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip cursor={{ fill: styles.lightGray }} contentStyle={{ background: styles.darkGray, border: null, color: styles.mainColor }} />
                    <Legend align='right' />
                    <Bar dataKey="Turnos Aceptados" fill={styles.acceptedColor} />
                    <Bar dataKey="Turnos Rechazados" fill={styles.rejectedColor} />
                </BarChart>
            </ResponsiveContainer>
            <ResponsiveContainer width={"100%"} height={170}>
                <LineChart
                    data={getEarningsData()}
                    margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5
                    }}
                >

                    <XAxis dataKey="name">

                    </XAxis>
                    <YAxis />
                    <Tooltip contentStyle={{ background: styles.darkGray, border: null, color: styles.mainColor }} />
                    <Line
                        isAnimationActive={false}
                        type="monotone"
                        dataKey="Ganancias"
                        stroke={styles.mainColor}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    )
};

export default TurneroDashboard;