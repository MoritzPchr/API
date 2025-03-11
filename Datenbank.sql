-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Erstellungszeit: 18. Dez 2024 um 10:11
-- Server-Version: 10.4.27-MariaDB
-- PHP-Version: 8.2.0

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Datenbank: `diplomarbeit`
--

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `client`
--

CREATE TABLE `client` (
  `ClientID` int(11) NOT NULL,
  `UserID` int(11) NOT NULL,
  `Ort` varchar(30) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Daten für Tabelle `client`
--

INSERT INTO `client` (`ClientID`, `UserID`, `Ort`) VALUES
(1, 1, 'I'),
(2, 2, 'IL'),
(3, 1, 'SZ');

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `feinstaubwert`
--

CREATE TABLE `feinstaubwert` (
  `WertID` int(11) NOT NULL,
  `PM1.0` float NOT NULL,
  `PM2.5` float NOT NULL,
  `PM10` float NOT NULL,
  `Zeitstempel` timestamp NOT NULL DEFAULT current_timestamp(),
  `ClientID` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Daten für Tabelle `feinstaubwert`
--

INSERT INTO `feinstaubwert` (`WertID`, `PM1.0`, `PM2.5`, `PM10`, `Zeitstempel`, `ClientID`) VALUES
(1, 0, 0, 0, '2024-08-10 16:06:32', 1),
(2, 0, 0, 0, '2024-08-10 16:06:32', 2),
(4, 0, 0, 34, '2024-09-15 18:38:55', 1),
(5, 0, 0, 34, '2024-09-15 18:57:06', 1),
(6, 0, 0, 34, '2024-09-16 18:33:54', 1),
(7, 0, 0, 34, '2024-09-19 14:01:08', 1),
(8, 99999, 99999, 99999, '2024-09-21 09:59:04', 1),
(9, 99999, 99999, 99999, '2024-09-21 09:59:05', 1),
(10, 99999, 99999, 99999, '2024-09-21 09:59:06', 1),
(11, 99999, 99999, 99999, '2024-09-21 09:59:07', 1),
(12, 99999, 99999, 99999, '2024-09-21 09:59:09', 1),
(13, 99999, 99999, 99999, '2024-09-21 09:59:10', 1),
(14, 99999, 99999, 99999, '2024-09-21 09:59:11', 1),
(15, 99999, 99999, 99999, '2024-09-21 09:59:12', 1),
(16, 99999, 99999, 99999, '2024-09-21 09:59:13', 1),
(17, 99999, 99999, 99999, '2024-09-21 09:59:14', 1),
(18, 99999, 99999, 99999, '2024-09-21 09:59:15', 1),
(19, 99999, 99999, 99999, '2024-09-21 09:59:17', 1),
(20, 99999, 99999, 99999, '2024-09-21 09:59:18', 1),
(21, 99999, 99999, 99999, '2024-09-21 09:59:20', 1),
(22, 99999, 99999, 99999, '2024-09-21 09:59:21', 1),
(23, 99999, 99999, 99999, '2024-09-21 09:59:22', 1),
(24, 99999, 99999, 99999, '2024-09-21 09:59:23', 1),
(25, 99999, 99999, 99999, '2024-09-21 09:59:24', 1),
(26, 99999, 99999, 99999, '2024-09-21 09:59:25', 1),
(27, 99999, 99999, 99999, '2024-09-21 09:59:26', 1),
(28, 99999, 99999, 99999, '2024-09-21 09:59:27', 1),
(29, 99999, 99999, 99999, '2024-09-21 09:59:28', 1),
(30, 99999, 99999, 99999, '2024-09-21 09:59:29', 1),
(31, 99999, 99999, 99999, '2024-09-21 09:59:30', 1),
(32, 99999, 99999, 99999, '2024-09-21 09:59:32', 1),
(33, 99999, 99999, 99999, '2024-09-21 09:59:33', 1),
(34, 99999, 99999, 99999, '2024-09-21 09:59:34', 1),
(35, 99999, 99999, 99999, '2024-09-21 09:59:35', 1),
(36, 99999, 99999, 99999, '2024-09-21 09:59:36', 1),
(37, 99999, 99999, 99999, '2024-09-21 09:59:37', 1),
(38, 99999, 99999, 99999, '2024-09-21 10:02:14', 1),
(39, 99999, 99999, 99999, '2024-09-21 10:02:24', 1),
(40, 99999, 99999, 99999, '2024-09-21 10:02:34', 1),
(41, 99999, 99999, 99999, '2024-09-21 10:02:44', 1),
(42, 99999, 99999, 99999, '2024-09-21 10:02:55', 1),
(43, 99999, 99999, 99999, '2024-09-21 10:03:05', 1),
(44, 99999, 99999, 99999, '2024-09-21 10:07:59', 2),
(45, 99999, 99999, 99999, '2024-09-21 10:08:09', 2),
(46, 99999, 99999, 99999, '2024-09-21 10:08:19', 2),
(47, 99999, 99999, 99999, '2024-09-21 10:08:29', 2),
(48, 99999, 99999, 99999, '2024-09-21 10:08:39', 2),
(49, 99999, 99999, 99999, '2024-09-21 10:08:49', 2);

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `user`
--

CREATE TABLE `user` (
  `UserID` int(11) NOT NULL,
  `Vorname` varchar(50) NOT NULL,
  `Nachname` varchar(55) NOT NULL,
  `Email` varchar(50) NOT NULL,
  `Passwort` varchar(50) NOT NULL,
  `Brokername` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Daten für Tabelle `user`
--

INSERT INTO `user` (`UserID`, `Vorname`, `Nachname`, `Email`, `Passwort`, `Brokername`) VALUES
(1, 'Test1', '', 'test1@test.at', 'Test1', 'Broker1'),
(2, 'Test2', '', 'test2@test.at', 'Test2', 'Broker2'),
(3, 'test', 'user', 'useremail', 'passwort', 'brokertest');

--
-- Indizes der exportierten Tabellen
--

--
-- Indizes für die Tabelle `client`
--
ALTER TABLE `client`
  ADD PRIMARY KEY (`ClientID`),
  ADD KEY `UserID` (`UserID`);

--
-- Indizes für die Tabelle `feinstaubwert`
--
ALTER TABLE `feinstaubwert`
  ADD PRIMARY KEY (`WertID`),
  ADD KEY `ClientID` (`ClientID`);

--
-- Indizes für die Tabelle `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`UserID`),
  ADD UNIQUE KEY `Email` (`Email`);

--
-- AUTO_INCREMENT für exportierte Tabellen
--

--
-- AUTO_INCREMENT für Tabelle `client`
--
ALTER TABLE `client`
  MODIFY `ClientID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT für Tabelle `feinstaubwert`
--
ALTER TABLE `feinstaubwert`
  MODIFY `WertID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=50;

--
-- AUTO_INCREMENT für Tabelle `user`
--
ALTER TABLE `user`
  MODIFY `UserID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- Constraints der exportierten Tabellen
--

--
-- Constraints der Tabelle `client`
--
ALTER TABLE `client`
  ADD CONSTRAINT `client_ibfk_1` FOREIGN KEY (`UserID`) REFERENCES `user` (`UserID`);

--
-- Constraints der Tabelle `feinstaubwert`
--
ALTER TABLE `feinstaubwert`
  ADD CONSTRAINT `feinstaubwert_ibfk_1` FOREIGN KEY (`ClientID`) REFERENCES `client` (`ClientID`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
