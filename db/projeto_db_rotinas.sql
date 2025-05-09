CREATE DATABASE  IF NOT EXISTS `projeto_db` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `projeto_db`;
-- MySQL dump 10.13  Distrib 8.0.41, for Win64 (x86_64)
--
-- Host: localhost    Database: projeto_db
-- ------------------------------------------------------
-- Server version	8.0.41

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `rotinas`
--

DROP TABLE IF EXISTS `rotinas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `rotinas` (
  `id` int NOT NULL AUTO_INCREMENT,
  `usuario_id` int NOT NULL,
  `nome` varchar(255) NOT NULL,
  `tempo` int NOT NULL,
  `progresso` int DEFAULT '0',
  `tipo` enum('estudo','trabalho','exercicio','lazer') NOT NULL,
  `descricao` text,
  `pausa` int NOT NULL,
  `repeticoes` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `usuario_id` (`usuario_id`),
  CONSTRAINT `rotinas_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=40 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `rotinas`
--

LOCK TABLES `rotinas` WRITE;
/*!40000 ALTER TABLE `rotinas` DISABLE KEYS */;
INSERT INTO `rotinas` VALUES (1,1,'Estudar JavaScript',25,0,'estudo',NULL,0,0),(2,1,'teste',1,0,'estudo',NULL,0,0),(3,1,'testeteste',1,0,'estudo',NULL,0,0),(4,1,'1',1,0,'estudo',NULL,0,0),(5,1,'2',2,0,'estudo',NULL,0,0),(6,1,'a',1,0,'estudo',NULL,0,0),(7,1,'a',1,0,'estudo',NULL,0,0),(8,19,'a',1,2,'estudo',NULL,0,0),(9,19,'a',2,0,'estudo',NULL,0,0),(10,19,'b',1,0,'estudo',NULL,0,0),(11,19,'a',1,0,'estudo',NULL,0,0),(12,19,'a',1,0,'estudo',NULL,0,0),(13,19,'aada',1,0,'estudo',NULL,0,0),(14,19,'a',1,0,'estudo',NULL,0,0),(15,19,'a',1,0,'estudo',NULL,0,0),(16,19,'ff',1,0,'estudo',NULL,0,0),(17,19,'dada',1,0,'estudo',NULL,0,0),(18,19,'a',1,0,'estudo',NULL,0,0),(19,19,'F',1,0,'estudo',NULL,0,0),(20,18,'a',1,1,'estudo',NULL,0,0),(21,19,'a',2,0,'estudo',NULL,0,0),(22,19,'dd',2,1,'estudo',NULL,0,0),(23,18,'f',1,1,'estudo',NULL,0,0),(24,19,'ddd',1,0,'estudo',NULL,0,0),(25,19,'ddd',1,0,'estudo',NULL,0,0),(26,19,'2',1,0,'estudo',NULL,0,0),(27,19,'f',1,1,'estudo',NULL,0,0),(28,19,'ddd',2,0,'estudo',NULL,0,0),(29,19,'dafa',1,1,'estudo',NULL,0,0),(30,18,'zmem',12,0,'estudo',NULL,0,0),(31,22,'ame',1,0,'estudo',NULL,0,0),(32,22,'da',2,0,'estudo',NULL,0,0),(33,23,'oi',1,1,'estudo',NULL,0,0),(34,23,'a',1,0,'estudo','aa',1,1),(35,23,'b',1,0,'trabalho','bb',1,1),(36,19,'1',1,0,'exercicio','aa',1,1),(37,19,'aada',1,0,'estudo','a',1,1),(38,24,'dad',1,0,'estudo','a',1,1),(39,19,'Rotina de Teste',25,0,'trabalho','Descrição de teste',5,4);
/*!40000 ALTER TABLE `rotinas` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-05-09 19:54:58
