-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Oct 20, 2021 at 08:05 AM
-- Server version: 10.4.21-MariaDB
-- PHP Version: 7.4.24

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `urna`
--

-- --------------------------------------------------------

--
-- Table structure for table `prefeito`
--

CREATE TABLE `prefeito` (
  `NUMERO_URNA` int(11) NOT NULL,
  `NOME` text DEFAULT NULL,
  `PARTIDO` text DEFAULT NULL,
  `VOTOS_ACUMULADOS` int(11) DEFAULT NULL,
  `NOME_VICE` text DEFAULT NULL,
  `PARTIDO_VICE` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `prefeito`
--

INSERT INTO `prefeito` (`NUMERO_URNA`, `NOME`, `PARTIDO`, `VOTOS_ACUMULADOS`, `NOME_VICE`, `PARTIDO_VICE`) VALUES
(0, 'Voto Nulo', NULL, 0, NULL, NULL),
(12, 'Chiquinho do Adbon', 'PDT', 0, 'Arão', 'PRP'),
(15, 'Malrinete Gralhada', 'MDB', 0, 'Biga', 'MDB'),
(45, 'Dr. Francisco', 'PSC', 0, 'João Rodrigues', 'PV'),
(54, 'Zé Lopes', 'PPL', 0, 'Francisca Ferreira Ramos', 'PPL'),
(65, 'Lindomar Pescador', 'PC do B', 0, 'Malú', 'PC do B'),
(999, 'Voto Branco', NULL, 0, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `vereador`
--

CREATE TABLE `vereador` (
  `NUMERO_URNA` int(11) NOT NULL,
  `NOME` text DEFAULT NULL,
  `PARTIDO` text DEFAULT NULL,
  `VOTOS_ACUMULADOS` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `vereador`
--

INSERT INTO `vereador` (`NUMERO_URNA`, `NOME`, `PARTIDO`, `VOTOS_ACUMULADOS`) VALUES
(0, 'Voto Nulo', NULL, 0),
(999, 'Voto Branco', NULL, 0),
(15123, 'Filho', 'MDB', 0),
(27222, 'Joel Varão', 'PSDC', 0),
(43333, 'Dandor', 'PV', 0),
(45000, 'Professor Clebson Almeida', 'PSDB', 0),
(51222, 'Christianne Varão', 'PEN', 0),
(55555, 'Homero do Zé Filho', 'PSL', 0);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `prefeito`
--
ALTER TABLE `prefeito`
  ADD PRIMARY KEY (`NUMERO_URNA`);

--
-- Indexes for table `vereador`
--
ALTER TABLE `vereador`
  ADD PRIMARY KEY (`NUMERO_URNA`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
