-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 07-09-2022 a las 02:24:31
-- Versión del servidor: 10.4.22-MariaDB
-- Versión de PHP: 8.1.1

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `turnero`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `free_days`
--

CREATE TABLE `free_days` (
  `free_day_id` int(10) UNSIGNED NOT NULL,
  `free_day_description` varchar(30) NOT NULL,
  `free_day_starting_timestamp` timestamp NOT NULL DEFAULT current_timestamp(),
  `free_day_ending_timestamp` timestamp NULL DEFAULT current_timestamp(),
  `free_day_frequency` varchar(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `free_days`
--

INSERT INTO `free_days` (`free_day_id`, `free_day_description`, `free_day_starting_timestamp`, `free_day_ending_timestamp`, `free_day_frequency`) VALUES
(16, 'Navidad', '2024-04-01 03:00:00', '2024-04-06 11:59:00', 'once'),
(26, 'Año Nuevo', '2022-12-31 19:05:00', '2023-06-02 13:15:00', 'anual'),
(33, 'Día del Trabajador', '2022-05-01 03:00:00', '2022-05-02 02:59:00', 'anual');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `hairdressers`
--

CREATE TABLE `hairdressers` (
  `hairdresser_id` int(10) UNSIGNED NOT NULL,
  `hairdresser_privilege_id` int(10) UNSIGNED NOT NULL,
  `hairdresser_enabled` tinyint(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `hairdressers`
--

INSERT INTO `hairdressers` (`hairdresser_id`, `hairdresser_privilege_id`, `hairdresser_enabled`) VALUES
(1, 1, 1),
(93, 3, 1),
(94, 2, 1),
(137, 3, 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `hairdresser_privileges`
--

CREATE TABLE `hairdresser_privileges` (
  `hairdresser_privilege_id` int(10) UNSIGNED NOT NULL,
  `hairdresser_privilege_name` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `hairdresser_privileges`
--

INSERT INTO `hairdresser_privileges` (`hairdresser_privilege_id`, `hairdresser_privilege_name`) VALUES
(1, 'Dueño'),
(2, 'Administrador'),
(3, 'Peluquero');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `hairdresser_work_days`
--

CREATE TABLE `hairdresser_work_days` (
  `hairdresser_id` int(10) UNSIGNED NOT NULL,
  `work_day_id` int(10) UNSIGNED NOT NULL,
  `hairdresser_work_day_ft_starting_time` time DEFAULT NULL,
  `hairdresser_work_day_ft_ending_time` time DEFAULT NULL,
  `hairdresser_work_day_st_starting_time` time DEFAULT current_timestamp(),
  `hairdresser_work_day_st_ending_time` time DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `hairdresser_work_days`
--

INSERT INTO `hairdresser_work_days` (`hairdresser_id`, `work_day_id`, `hairdresser_work_day_ft_starting_time`, `hairdresser_work_day_ft_ending_time`, `hairdresser_work_day_st_starting_time`, `hairdresser_work_day_st_ending_time`) VALUES
(1, 1, '08:00:00', '12:30:00', NULL, NULL),
(1, 2, '08:00:00', '12:30:00', '14:00:00', '19:00:00'),
(1, 3, '08:00:00', '12:30:00', '14:00:00', '19:00:00'),
(1, 4, '08:00:00', '12:30:00', '14:00:00', '19:00:00'),
(1, 5, '08:00:00', '12:30:00', '14:00:00', '19:00:00'),
(1, 6, '08:00:00', '12:30:00', '14:00:00', '19:00:00'),
(1, 7, '08:00:00', '12:30:00', '14:00:00', '19:00:00'),
(93, 1, '07:00:00', '20:00:00', NULL, NULL),
(93, 2, '07:00:00', '20:00:00', NULL, NULL),
(93, 3, '07:00:00', '20:00:00', NULL, NULL),
(93, 4, '07:00:00', '20:00:00', NULL, NULL),
(93, 5, '07:00:00', '20:00:00', NULL, NULL),
(93, 6, '07:00:00', '20:00:00', NULL, NULL),
(93, 7, '07:00:00', '20:00:00', NULL, NULL),
(94, 1, '12:00:00', '13:00:00', NULL, NULL),
(94, 2, NULL, NULL, NULL, NULL),
(94, 3, NULL, NULL, NULL, NULL),
(94, 4, NULL, NULL, NULL, NULL),
(94, 5, NULL, NULL, NULL, NULL),
(94, 6, NULL, NULL, NULL, NULL),
(94, 7, NULL, NULL, NULL, NULL),
(137, 1, NULL, NULL, NULL, NULL),
(137, 2, NULL, NULL, NULL, NULL),
(137, 3, NULL, NULL, NULL, NULL),
(137, 4, NULL, NULL, NULL, NULL),
(137, 5, NULL, NULL, NULL, NULL),
(137, 6, NULL, NULL, NULL, NULL),
(137, 7, NULL, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `params`
--

CREATE TABLE `params` (
  `param_name` varchar(35) NOT NULL,
  `param_value` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `params`
--

INSERT INTO `params` (`param_name`, `param_value`) VALUES
('same_turns_at_the_moment', 'auto'),
('turns_interval', '30'),
('turns_max_days_difference_to_take', '60'),
('turns_max_services', '4');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `services`
--

CREATE TABLE `services` (
  `service_id` int(10) UNSIGNED NOT NULL,
  `service_name` varchar(35) NOT NULL,
  `service_cost` decimal(10,2) NOT NULL,
  `service_estimated_time` int(16) NOT NULL,
  `service_photo` varchar(40) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `services`
--

INSERT INTO `services` (`service_id`, `service_name`, `service_cost`, `service_estimated_time`, `service_photo`) VALUES
(32, 'CORTE DE PELO  1', '500.00', 1380000, NULL),
(39, 'MANICURÍA BARATA', '134.00', 300000, 'e09a76e0c4f52fe61558bf6d69352e97.jpg');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `statistics`
--

CREATE TABLE `statistics` (
  `month` int(11) NOT NULL,
  `year` int(11) NOT NULL,
  `accepted_turns` int(11) NOT NULL,
  `rejected_turns` int(11) NOT NULL,
  `earnings` decimal(10,2) NOT NULL,
  `hairdresser_id` int(10) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `statistics`
--

INSERT INTO `statistics` (`month`, `year`, `accepted_turns`, `rejected_turns`, `earnings`, `hairdresser_id`) VALUES
(1, 2022, 100, 56, '49000.00', 1),
(2, 2022, 100, 56, '49000.00', 1),
(3, 2022, 100, 56, '56000.00', 1),
(4, 2022, 100, 56, '49000.00', 1),
(5, 2022, 100, 56, '66000.00', 1),
(6, 2022, 100, 56, '70000.00', 1),
(6, 2022, 102, 57, '77662.00', 93),
(7, 2021, 100, 32, '70000.00', 1),
(7, 2022, 100, 56, '65000.00', 1),
(7, 2022, 2, 5, '5120.50', 93),
(7, 2022, 1, 1, '233.00', 94),
(8, 2022, 103, 58, '0.00', 1),
(8, 2022, 2, 6, '867.00', 94),
(9, 2022, 101, 56, '0.00', 1),
(10, 2022, 100, 56, '59000.00', 1),
(11, 2022, 100, 56, '63000.00', 1),
(12, 2022, 100, 56, '49000.00', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `turns`
--

CREATE TABLE `turns` (
  `turn_id` int(10) UNSIGNED NOT NULL,
  `turn_client_id` int(10) UNSIGNED DEFAULT NULL,
  `turn_hairdresser_id` int(10) UNSIGNED DEFAULT NULL,
  `turn_datetime` timestamp NOT NULL DEFAULT current_timestamp(),
  `turn_creation_datetime` timestamp NOT NULL DEFAULT current_timestamp(),
  `turn_state` int(10) UNSIGNED NOT NULL,
  `turn_client_observation` varchar(100) DEFAULT NULL,
  `turn_hairdresser_observation` varchar(100) DEFAULT NULL,
  `turn_photo` varchar(40) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `turns_services`
--

CREATE TABLE `turns_services` (
  `turn_id` int(10) UNSIGNED NOT NULL,
  `service_id` int(10) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `turn_states`
--

CREATE TABLE `turn_states` (
  `turn_state_id` int(10) UNSIGNED NOT NULL,
  `turn_state_name` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `turn_states`
--

INSERT INTO `turn_states` (`turn_state_id`, `turn_state_name`) VALUES
(1, 'Aceptado'),
(2, 'Pendiente'),
(3, 'Rechazado');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `users`
--

CREATE TABLE `users` (
  `user_id` int(10) UNSIGNED NOT NULL,
  `user_mail` varchar(50) NOT NULL,
  `user_password` varchar(45) NOT NULL,
  `user_full_name` varchar(25) NOT NULL,
  `user_phone` varchar(20) DEFAULT NULL,
  `user_phone_verification_code` varchar(50) DEFAULT NULL,
  `user_phone_verification_code_expiration` timestamp NULL DEFAULT NULL,
  `user_profile_photo` varchar(40) DEFAULT NULL,
  `user_mail_token` varchar(32) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `users`
--

INSERT INTO `users` (`user_id`, `user_mail`, `user_password`, `user_full_name`, `user_phone`, `user_phone_verification_code`, `user_phone_verification_code_expiration`, `user_profile_photo`, `user_mail_token`) VALUES
(1, 'darthvader@gmail.com', 'k0iQZuBxBqXiyc+wwkK1CgYX1iqH167GY1aLWZ77', 'hola', '156708022', '0', '2022-09-04 22:04:45', '1f7db191b8d6178f724c7b95f1b0f604.jpg', NULL),
(32, 'client1@gmail.com', '*A47D1CAA35E725938BAAFC97AB9127A95093F48C', 'hairdresser_name', '11111111', '0', '2022-09-04 22:04:45', NULL, NULL),
(33, 'client2@gmail.com', '*A47D1CAA35E725938BAAFC97AB9127A95093F48C', 'hairdresser_name', '22222222', '0', '2022-09-04 22:04:45', '33.jpg', NULL),
(34, 'client3@gmail.com', 'nxsWvII9hLBEuCagm0SJWswoY19CsTu5/nzNrkV5', 'Cliente', '31241232357', '0', '2022-09-04 22:04:45', 'c7824bf0a2f8661daba8819c2e895a38.jpg', NULL),
(93, 'ahsokatano@gmail.com', 'QJSGYcYwlbG7r3nbBud4Np5zrNP5RTxs+DhYnrv+', 'Ahsoka Tano', '3416708022', '0', '2022-09-04 22:04:45', '55ccf27d26d7b23839986b6ae2e447ab.jpg', NULL),
(94, 'obiwankenobi@gmail.com', '*A47D1CAA35E725938BAAFC97AB9127A95093F48C', 'Obi Wan Kenobi', '3415601233', '0', '2022-09-04 22:04:45', '7fdc1a630c238af0815181f9faa190f5.jpg', NULL),
(137, 'unpeluquero@gmail.com', 'v9dv8rjpDKz+rf+AvJXtr/40OS2QvJENIVEyGE3k', 'Un Peluquero', '3416761233', '0', '2022-09-04 22:04:45', NULL, NULL),
(139, 'alanholtz1999@gmail.com', 'mfleEnDNDust/ymXXzTmEkxwz+RWNVu1cQwEAWvq', 'Alan Holtz', '543416708022', NULL, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Estructura Stand-in para la vista `view_hairdresserminandmaxworkingtimeperday`
-- (Véase abajo para la vista actual)
--
CREATE TABLE `view_hairdresserminandmaxworkingtimeperday` (
`work_day_id` int(10) unsigned
,`starting_time` time
,`ending_time` time
);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `work_days`
--

CREATE TABLE `work_days` (
  `work_day_id` int(10) UNSIGNED NOT NULL,
  `work_day_name` varchar(9) NOT NULL,
  `work_day_opening_time` time DEFAULT current_timestamp(),
  `work_day_closing_time` time DEFAULT current_timestamp(),
  `work_day_is_open` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `work_days`
--

INSERT INTO `work_days` (`work_day_id`, `work_day_name`, `work_day_opening_time`, `work_day_closing_time`, `work_day_is_open`) VALUES
(1, 'Lunes', '07:00:00', '20:00:00', 1),
(2, 'Martes', '07:00:00', '20:00:00', 1),
(3, 'Miércoles', '07:00:00', '20:00:00', 1),
(4, 'Jueves', '07:00:00', '20:00:00', 1),
(5, 'Viernes', '07:00:00', '20:00:00', 1),
(6, 'Sábado', '07:00:00', '20:00:00', 1),
(7, 'Domingo', '07:00:00', '20:00:00', 1);

-- --------------------------------------------------------

--
-- Estructura para la vista `view_hairdresserminandmaxworkingtimeperday`
--
DROP TABLE IF EXISTS `view_hairdresserminandmaxworkingtimeperday`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `view_hairdresserminandmaxworkingtimeperday`  AS SELECT `hwd`.`work_day_id` AS `work_day_id`, min(`hwd`.`hairdresser_work_day_ft_starting_time`) AS `starting_time`, max(coalesce(`hwd`.`hairdresser_work_day_st_ending_time`,`hwd`.`hairdresser_work_day_ft_ending_time`)) AS `ending_time` FROM `hairdresser_work_days` AS `hwd` GROUP BY `hwd`.`work_day_id` ;

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `free_days`
--
ALTER TABLE `free_days`
  ADD PRIMARY KEY (`free_day_id`);

--
-- Indices de la tabla `hairdressers`
--
ALTER TABLE `hairdressers`
  ADD PRIMARY KEY (`hairdresser_id`),
  ADD KEY `hairdresser_privilege_id` (`hairdresser_privilege_id`);

--
-- Indices de la tabla `hairdresser_privileges`
--
ALTER TABLE `hairdresser_privileges`
  ADD PRIMARY KEY (`hairdresser_privilege_id`);

--
-- Indices de la tabla `hairdresser_work_days`
--
ALTER TABLE `hairdresser_work_days`
  ADD PRIMARY KEY (`hairdresser_id`,`work_day_id`),
  ADD KEY `hairdresser_work_days_ibfk_2` (`work_day_id`);

--
-- Indices de la tabla `params`
--
ALTER TABLE `params`
  ADD PRIMARY KEY (`param_name`);

--
-- Indices de la tabla `services`
--
ALTER TABLE `services`
  ADD PRIMARY KEY (`service_id`);

--
-- Indices de la tabla `statistics`
--
ALTER TABLE `statistics`
  ADD PRIMARY KEY (`month`,`year`,`hairdresser_id`),
  ADD KEY `statistics_ibfk_1` (`hairdresser_id`);

--
-- Indices de la tabla `turns`
--
ALTER TABLE `turns`
  ADD PRIMARY KEY (`turn_id`),
  ADD KEY `turn_state` (`turn_state`),
  ADD KEY `turns_ibfk_1` (`turn_client_id`),
  ADD KEY `turns_ibfk_2` (`turn_hairdresser_id`);

--
-- Indices de la tabla `turns_services`
--
ALTER TABLE `turns_services`
  ADD PRIMARY KEY (`turn_id`,`service_id`),
  ADD KEY `service_id` (`service_id`);

--
-- Indices de la tabla `turn_states`
--
ALTER TABLE `turn_states`
  ADD PRIMARY KEY (`turn_state_id`);

--
-- Indices de la tabla `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`);

--
-- Indices de la tabla `work_days`
--
ALTER TABLE `work_days`
  ADD PRIMARY KEY (`work_day_id`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `free_days`
--
ALTER TABLE `free_days`
  MODIFY `free_day_id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=38;

--
-- AUTO_INCREMENT de la tabla `hairdressers`
--
ALTER TABLE `hairdressers`
  MODIFY `hairdresser_id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=141;

--
-- AUTO_INCREMENT de la tabla `hairdresser_privileges`
--
ALTER TABLE `hairdresser_privileges`
  MODIFY `hairdresser_privilege_id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `services`
--
ALTER TABLE `services`
  MODIFY `service_id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=41;

--
-- AUTO_INCREMENT de la tabla `turns`
--
ALTER TABLE `turns`
  MODIFY `turn_id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=174;

--
-- AUTO_INCREMENT de la tabla `turn_states`
--
ALTER TABLE `turn_states`
  MODIFY `turn_state_id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `users`
--
ALTER TABLE `users`
  MODIFY `user_id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=141;

--
-- AUTO_INCREMENT de la tabla `work_days`
--
ALTER TABLE `work_days`
  MODIFY `work_day_id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `hairdressers`
--
ALTER TABLE `hairdressers`
  ADD CONSTRAINT `hairdressers_ibfk_1` FOREIGN KEY (`hairdresser_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `hairdressers_ibfk_2` FOREIGN KEY (`hairdresser_privilege_id`) REFERENCES `hairdresser_privileges` (`hairdresser_privilege_id`);

--
-- Filtros para la tabla `hairdresser_work_days`
--
ALTER TABLE `hairdresser_work_days`
  ADD CONSTRAINT `hairdresser_work_days_ibfk_1` FOREIGN KEY (`hairdresser_id`) REFERENCES `hairdressers` (`hairdresser_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `hairdresser_work_days_ibfk_2` FOREIGN KEY (`work_day_id`) REFERENCES `work_days` (`work_day_id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `statistics`
--
ALTER TABLE `statistics`
  ADD CONSTRAINT `statistics_ibfk_1` FOREIGN KEY (`hairdresser_id`) REFERENCES `hairdressers` (`hairdresser_id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `turns`
--
ALTER TABLE `turns`
  ADD CONSTRAINT `turns_ibfk_1` FOREIGN KEY (`turn_client_id`) REFERENCES `users` (`user_id`) ON DELETE SET NULL,
  ADD CONSTRAINT `turns_ibfk_2` FOREIGN KEY (`turn_hairdresser_id`) REFERENCES `hairdressers` (`hairdresser_id`) ON DELETE SET NULL,
  ADD CONSTRAINT `turns_ibfk_3` FOREIGN KEY (`turn_state`) REFERENCES `turn_states` (`turn_state_id`);

--
-- Filtros para la tabla `turns_services`
--
ALTER TABLE `turns_services`
  ADD CONSTRAINT `turns_services_ibfk_1` FOREIGN KEY (`turn_id`) REFERENCES `turns` (`turn_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `turns_services_ibfk_2` FOREIGN KEY (`service_id`) REFERENCES `services` (`service_id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
