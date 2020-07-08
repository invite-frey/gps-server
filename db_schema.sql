-- MySQL dump 10.16  Distrib 10.1.38-MariaDB, for debian-linux-gnu (x86_64)
--
-- Host: localhost    Database: gps
-- ------------------------------------------------------
-- Server version	10.1.38-MariaDB-0+deb9u1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `data`
--

DROP TABLE IF EXISTS `data`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `data` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `ts` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `utc` datetime DEFAULT NULL,
  `ip` char(15) DEFAULT NULL,
  `unit_id` char(22) DEFAULT NULL,
  `serial` datetime DEFAULT NULL,
  `authorized_number` char(17) DEFAULT NULL,
  `gps_signal` char(1) DEFAULT NULL,
  `message` char(15) DEFAULT NULL,
  `gprmc_time` char(9) DEFAULT NULL,
  `gprmc_status` char(1) DEFAULT NULL,
  `gprmc_lat` char(9) DEFAULT NULL,
  `gprmc_lat_loc` char(1) DEFAULT NULL,
  `gprmc_long` char(10) DEFAULT NULL,
  `gprmc_long_loc` char(1) DEFAULT NULL,
  `gprmc_gs` char(6) DEFAULT NULL,
  `gprmc_track` char(6) DEFAULT NULL,
  `gprmc_date` char(6) DEFAULT NULL,
  `gprmc_var` char(4) DEFAULT NULL,
  `gprmc_var_sense` char(1) DEFAULT NULL,
  `gprmc_mode` char(6) DEFAULT NULL,
  `satellites` char(2) DEFAULT NULL,
  `altitude` char(7) DEFAULT NULL,
  `charge` char(8) DEFAULT NULL,
  `charging` char(1) DEFAULT NULL,
  `crc16` char(6) DEFAULT NULL,
  `mcc` char(3) DEFAULT NULL,
  `mnc` char(3) DEFAULT NULL,
  `lac` char(5) DEFAULT NULL,
  `cellid` char(4) DEFAULT NULL,
  `logged` tinyint(1) DEFAULT '0',
  `wp_post_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=1106169 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

