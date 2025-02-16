mysqldump: [Warning] Using a password on the command line interface can be insecure.
-- MySQL dump 10.13  Distrib 5.7.44, for Linux (x86_64)
--
-- Host: localhost    Database: the_kitchen
-- ------------------------------------------------------
-- Server version	5.7.44

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `ContactMessages`
--

DROP TABLE IF EXISTS `ContactMessages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `ContactMessages` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `subject` varchar(255) DEFAULT NULL,
  `message` text,
  `status` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ContactMessages`
--

LOCK TABLES `ContactMessages` WRITE;
/*!40000 ALTER TABLE `ContactMessages` DISABLE KEYS */;
INSERT INTO `ContactMessages` VALUES (1,'James Anderson','jemes.anderson@gmail.com','Inquiry about services','Hello, I would like to know more about your catering services.','new','2025-02-15 21:01:43','2025-02-15 21:01:43'),(2,'Oliver Smith','osmith@nis.rs','Issue with order','My order arrived late. Can you assist me?','pending','2025-02-15 21:01:43','2025-02-15 21:01:43'),(3,'William Johnson','johnsonW@yahoo.com','Issue with order','I got a meal that I didn\'t order!','pending','2025-02-15 21:01:43','2025-02-15 21:01:43');
/*!40000 ALTER TABLE `ContactMessages` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `DailyMenuDishes`
--

DROP TABLE IF EXISTS `DailyMenuDishes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `DailyMenuDishes` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `dailyMenuId` int(11) NOT NULL,
  `dishId` int(11) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `dailyMenuId` (`dailyMenuId`),
  KEY `dishId` (`dishId`),
  CONSTRAINT `DailyMenuDishes_ibfk_1` FOREIGN KEY (`dailyMenuId`) REFERENCES `DailyMenus` (`id`) ON DELETE CASCADE,
  CONSTRAINT `DailyMenuDishes_ibfk_2` FOREIGN KEY (`dishId`) REFERENCES `Dishes` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `DailyMenuDishes`
--

LOCK TABLES `DailyMenuDishes` WRITE;
/*!40000 ALTER TABLE `DailyMenuDishes` DISABLE KEYS */;
INSERT INTO `DailyMenuDishes` VALUES (1,1,1,'2025-02-15 21:01:43','2025-02-15 21:01:43'),(2,1,2,'2025-02-15 21:01:43','2025-02-15 21:01:43');
/*!40000 ALTER TABLE `DailyMenuDishes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `DailyMenus`
--

DROP TABLE IF EXISTS `DailyMenus`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `DailyMenus` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `date` datetime DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `DailyMenus`
--

LOCK TABLES `DailyMenus` WRITE;
/*!40000 ALTER TABLE `DailyMenus` DISABLE KEYS */;
INSERT INTO `DailyMenus` VALUES (1,'2025-02-02 00:00:00','2025-02-15 21:01:43','2025-02-15 21:01:43');
/*!40000 ALTER TABLE `DailyMenus` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Dishes`
--

DROP TABLE IF EXISTS `Dishes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Dishes` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `price` float DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Dishes`
--

LOCK TABLES `Dishes` WRITE;
/*!40000 ALTER TABLE `Dishes` DISABLE KEYS */;
INSERT INTO `Dishes` VALUES (1,'Podvarak in sac','Is a traditionally prepared dish that is cooked slowly in an earthen pot, with the addition of aromatic spices and natural ingredients.',570,'uploads/Podvarak in suc.png','2025-02-15 21:01:43','2025-02-15 21:01:43'),(2,'Beans in sac','Beans are cooked with dried meat, bacon or sausages, with the addition of onions, garlic, bay leaves and paprika, which achieves a perfect balance of aromas.',640,'uploads/Beans in suc.png','2025-02-15 21:01:43','2025-02-15 21:01:43'),(3,'Fresh cabbage in sac','Fresh cabbage is stewed with meat such as pork, beef or chicken, with the addition of onions, carrots, peppers and spices such as pepper, bay leaves and allspice.',700,'uploads/Fresh cabbage in sac.png','2025-02-15 21:01:43','2025-02-15 21:01:43');
/*!40000 ALTER TABLE `Dishes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Feedbacks`
--

DROP TABLE IF EXISTS `Feedbacks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Feedbacks` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `userId` int(11) DEFAULT NULL,
  `dishId` int(11) DEFAULT NULL,
  `rating` int(11) DEFAULT NULL,
  `comment` text,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `userId` (`userId`),
  KEY `dishId` (`dishId`),
  CONSTRAINT `Feedbacks_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `Users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `Feedbacks_ibfk_2` FOREIGN KEY (`dishId`) REFERENCES `Dishes` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Feedbacks`
--

LOCK TABLES `Feedbacks` WRITE;
/*!40000 ALTER TABLE `Feedbacks` DISABLE KEYS */;
INSERT INTO `Feedbacks` VALUES (1,1,1,5,'Amazing taste! Highly recommended.','2025-02-15 21:01:43','2025-02-15 21:01:43'),(2,2,2,4,'Very good, but a bit salty for my taste.','2025-02-15 21:01:43','2025-02-15 21:01:43'),(3,3,3,3,'Decent meal, but I expected more flavor.','2025-02-15 21:01:43','2025-02-15 21:01:43');
/*!40000 ALTER TABLE `Feedbacks` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `OrderItems`
--

DROP TABLE IF EXISTS `OrderItems`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `OrderItems` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `orderId` int(11) NOT NULL,
  `dishId` int(11) NOT NULL,
  `quantity` int(11) DEFAULT NULL,
  `price` float DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `orderId` (`orderId`),
  KEY `dishId` (`dishId`),
  CONSTRAINT `OrderItems_ibfk_1` FOREIGN KEY (`orderId`) REFERENCES `Orders` (`id`) ON DELETE CASCADE,
  CONSTRAINT `OrderItems_ibfk_2` FOREIGN KEY (`dishId`) REFERENCES `Dishes` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `OrderItems`
--

LOCK TABLES `OrderItems` WRITE;
/*!40000 ALTER TABLE `OrderItems` DISABLE KEYS */;
INSERT INTO `OrderItems` VALUES (1,1,1,3,79.04,'2025-02-15 21:01:43','2025-02-15 21:01:43'),(2,2,3,3,197.68,'2025-02-15 21:01:43','2025-02-15 21:01:43'),(3,3,2,3,65.8,'2025-02-15 21:01:43','2025-02-15 21:01:43');
/*!40000 ALTER TABLE `OrderItems` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Orders`
--

DROP TABLE IF EXISTS `Orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Orders` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `userId` int(11) NOT NULL,
  `date` datetime DEFAULT NULL,
  `status` varchar(255) DEFAULT NULL,
  `totalPrice` float DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `userId` (`userId`),
  CONSTRAINT `Orders_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `Users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Orders`
--

LOCK TABLES `Orders` WRITE;
/*!40000 ALTER TABLE `Orders` DISABLE KEYS */;
INSERT INTO `Orders` VALUES (1,1,'2025-02-04 08:05:28','pending',20.99,'2025-02-15 21:01:43','2025-02-15 21:01:43'),(2,2,'2025-02-04 08:06:30','completed',15.5,'2025-02-15 21:01:43','2025-02-15 21:01:43'),(3,3,'2025-02-04 08:06:30','completed',670.9,'2025-02-15 21:01:43','2025-02-15 21:01:43');
/*!40000 ALTER TABLE `Orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Payments`
--

DROP TABLE IF EXISTS `Payments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Payments` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `orderId` int(11) NOT NULL,
  `method` varchar(255) DEFAULT NULL,
  `status` varchar(255) DEFAULT NULL,
  `paymentDate` datetime DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `orderId` (`orderId`),
  CONSTRAINT `Payments_ibfk_1` FOREIGN KEY (`orderId`) REFERENCES `Orders` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Payments`
--

LOCK TABLES `Payments` WRITE;
/*!40000 ALTER TABLE `Payments` DISABLE KEYS */;
INSERT INTO `Payments` VALUES (1,1,'Credit Card','Completed','2025-02-02 10:30:00','2025-02-15 21:01:43','2025-02-15 21:01:43'),(2,2,'PayPal','Pending','2025-02-02 12:15:00','2025-02-15 21:01:43','2025-02-15 21:01:43'),(3,3,'Cash','Completed','2025-02-03 15:45:00','2025-02-15 21:01:43','2025-02-15 21:01:43');
/*!40000 ALTER TABLE `Payments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `SequelizeMeta`
--

DROP TABLE IF EXISTS `SequelizeMeta`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `SequelizeMeta` (
  `name` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  PRIMARY KEY (`name`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `SequelizeMeta`
--

LOCK TABLES `SequelizeMeta` WRITE;
/*!40000 ALTER TABLE `SequelizeMeta` DISABLE KEYS */;
INSERT INTO `SequelizeMeta` VALUES ('20250131171252-create-user.js'),('20250131171259-create-daily-menu.js'),('20250131171307-create-dish.js'),('20250131171314-create-order.js'),('20250131171321-create-order-item.js'),('20250131171328-create-payment.js'),('20250131171336-create-contact-message.js'),('20250131171343-create-feedback.js'),('20250201062800-create-dailyMenuDishes.js');
/*!40000 ALTER TABLE `SequelizeMeta` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Users`
--

DROP TABLE IF EXISTS `Users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `role` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Users`
--

LOCK TABLES `Users` WRITE;
/*!40000 ALTER TABLE `Users` DISABLE KEYS */;
INSERT INTO `Users` VALUES (1,'admin','admin@gmail.com','$2a$10$l3Ev1YNEwUtVsR5Hkj6a/ex8vbelSedlcU6rOS0sMu5YKHl6vwfR6','admin','2025-02-15 21:01:43','2025-02-15 21:01:43'),(2,'user1','user1@yahoo.com','$2a$10$SVYPoAawCqXyOoNCJ6K/XesxTSQrKHYmTgZvXHDTEJLKdY5ZkTlla','user','2025-02-15 21:01:43','2025-02-15 21:01:43'),(3,'user2','user2@gmail.com','$2a$10$7l1XDGvLgxiDbSysTz2An.MyZyMndy5iy7F6yLOhFlpwKRKn.xBO.','user','2025-02-15 21:01:43','2025-02-15 21:01:43');
/*!40000 ALTER TABLE `Users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-02-15 21:10:52
