-- MySQL dump 10.13  Distrib 8.0.32, for Win64 (x86_64)
--
-- Host: localhost    Database: musicmanager
-- ------------------------------------------------------
-- Server version	8.0.32

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
-- Table structure for table `playlists`
--

DROP TABLE IF EXISTS `playlists`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `playlists` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `OWNER_ID` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FKow70yd6an74budwtqc5p3v7tr` (`OWNER_ID`),
  CONSTRAINT `FKow70yd6an74budwtqc5p3v7tr` FOREIGN KEY (`OWNER_ID`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=32 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `playlists`
--

LOCK TABLES `playlists` WRITE;
/*!40000 ALTER TABLE `playlists` DISABLE KEYS */;
INSERT INTO `playlists` VALUES (1,'Playlist 1',1),(2,'Playlist 2',1),(4,'Playlist 3',1),(11,'Playlist 5',1),(27,'Playlist 6',1),(28,'Playlist 123',4),(31,'Playlist 7',1);
/*!40000 ALTER TABLE `playlists` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `playlists_songs`
--

DROP TABLE IF EXISTS `playlists_songs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `playlists_songs` (
  `PLAYLIST_ID` bigint NOT NULL,
  `SONG_ID` bigint NOT NULL,
  KEY `FK1fk3ciip4gbtmd3bsuc2vqigw` (`SONG_ID`),
  KEY `FKeb84x83qwektns41v0chnasv2` (`PLAYLIST_ID`),
  CONSTRAINT `FK1fk3ciip4gbtmd3bsuc2vqigw` FOREIGN KEY (`SONG_ID`) REFERENCES `songs` (`id`),
  CONSTRAINT `FKeb84x83qwektns41v0chnasv2` FOREIGN KEY (`PLAYLIST_ID`) REFERENCES `playlists` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `playlists_songs`
--

LOCK TABLES `playlists_songs` WRITE;
/*!40000 ALTER TABLE `playlists_songs` DISABLE KEYS */;
INSERT INTO `playlists_songs` VALUES (2,11),(2,15),(1,11),(1,11),(1,11),(1,11),(1,13),(1,14),(1,15),(1,16),(1,16),(1,11),(28,11);
/*!40000 ALTER TABLE `playlists_songs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `roles`
--

DROP TABLE IF EXISTS `roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `roles` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK_ofx66keruapi6vyqpv6f2or37` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `roles`
--

LOCK TABLES `roles` WRITE;
/*!40000 ALTER TABLE `roles` DISABLE KEYS */;
INSERT INTO `roles` VALUES (1,'ADMIN'),(2,'USER');
/*!40000 ALTER TABLE `roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `songs`
--

DROP TABLE IF EXISTS `songs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `songs` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `genre` varchar(50) DEFAULT NULL,
  `lastUpdate` datetime(6) DEFAULT NULL,
  `publicId` varchar(255) NOT NULL,
  `title` varchar(100) NOT NULL,
  `url` varchar(255) NOT NULL,
  `musician` varchar(255) DEFAULT NULL,
  `OWNER_ID` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FKq8p5l5r4m47ewcsk0on9kl6rm` (`OWNER_ID`),
  CONSTRAINT `FKq8p5l5r4m47ewcsk0on9kl6rm` FOREIGN KEY (`OWNER_ID`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=49 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `songs`
--

LOCK TABLES `songs` WRITE;
/*!40000 ALTER TABLE `songs` DISABLE KEYS */;
INSERT INTO `songs` VALUES (11,'VPOP','2023-04-20 14:14:52.770035','','Lạ Lùng','https://res.cloudinary.com/dx2nrp7at/video/upload/v1678953974/MusicManager/4107ac7b-e201-4564-9a94-e9504bd5c54c.mp3','Vũ',1),(13,'RAP','2023-04-13 12:38:59.789839','','10 Ngàn Năm','https://res.cloudinary.com/dx2nrp7at/video/upload/v1679395268/MusicManager/b548f436-1bd5-4a1b-b823-7799af6b92e2.mp3','PC',1),(14,'RAP','2023-04-05 16:31:42.444873','','3107 4','https://res.cloudinary.com/dx2nrp7at/video/upload/v1679452660/MusicManager/433c4cb5-cccb-4452-b050-cd7971b57e15.mp3','Wn x Erik ft Nâu',1),(15,'VPOP','2023-03-23 16:35:13.244369','','1 Phút  Andiez','https://res.cloudinary.com/dx2nrp7at/video/upload/v1679564119/MusicManager/01e8d56c-b285-4cb2-82d1-98dac3cdf55a.mp3','Andiez',1),(16,'VPOP','2023-04-11 14:20:26.940284','','Suýt nữa thì','https://res.cloudinary.com/dx2nrp7at/video/upload/v1679564176/MusicManager/21c85721-0843-4c60-9d60-065ec33632fb.mp3','Andies',4),(17,'Vpop','2023-04-12 12:36:50.075920','','Ngôi sao cô đơn','https://res.cloudinary.com/dx2nrp7at/video/upload/v1681197927/MusicManager/7b8faf4e-db09-4d9f-8889-0c9097f091bd.mp3','Jack',4),(21,'','2023-04-20 12:36:46.914518','','Bình Thường','https://res.cloudinary.com/dx2nrp7at/video/upload/v1681969014/MusicManager/16a9f356-68cd-4fca-a5d6-8ce1c089cf47.mp3','Nha',1),(22,'','2023-04-20 12:37:41.217727','','Không thể yêu thì ta sẽ từng là bạn','https://res.cloudinary.com/dx2nrp7at/video/upload/v1681969069/MusicManager/aada9c47-1f51-492f-b31f-52b6ada90936.mp3','NHA',1),(23,'','2023-04-20 12:38:58.836849','','Luyến','https://res.cloudinary.com/dx2nrp7at/video/upload/v1681969143/MusicManager/2c1fe7a5-3760-4da7-96c5-7a6d3540cf67.mp3','NHA',1),(24,'','2023-04-20 12:39:42.536747','','Ký ức trốn đi','https://res.cloudinary.com/dx2nrp7at/video/upload/v1681969187/MusicManager/aa7e736f-7ba5-4102-b343-0a42866166da.mp3','NHA',1),(25,'','2023-04-20 12:40:20.266846','','Giản đơn','https://res.cloudinary.com/dx2nrp7at/video/upload/v1681969226/MusicManager/26c69b24-596e-469b-9f37-11990d5643aa.mp3','NHA',1),(26,'','2023-04-20 12:41:09.864303','','Nếu Em Không Về','https://res.cloudinary.com/dx2nrp7at/video/upload/v1681969275/MusicManager/cda41028-bffa-46d8-a696-2bb8aee6cb6b.mp3','Song Luân',1),(27,'','2023-04-20 12:41:50.135253','','Giá như phút chốc anh nắm lấy em! Big Rice Piano','https://res.cloudinary.com/dx2nrp7at/video/upload/v1681969316/MusicManager/6ce17509-e260-4dd8-b8a4-4d0036610771.mp3','NHA',1),(28,'','2023-04-20 12:42:39.006838','','Ngủ một mình','https://res.cloudinary.com/dx2nrp7at/video/upload/v1681969364/MusicManager/068153c8-d770-4402-b6d3-a3845b761987.mp3','HIEUTHUHAI',1),(29,'','2023-04-20 12:43:10.226265','','CUA','https://res.cloudinary.com/dx2nrp7at/video/upload/v1681969395/MusicManager/6ace8696-78bb-49f6-b8d8-783ada5509bd.mp3','HIEUTHUHAI',1),(30,'','2023-04-20 12:43:47.170425','','Nghe Như Tình Yêu','https://res.cloudinary.com/dx2nrp7at/video/upload/v1681969441/MusicManager/95849e1f-fce5-4d06-9e6f-0bf03aa8d8d9.mp3','HIEUTHUHAI',1),(31,'','2023-04-20 12:44:53.863353','','Vệ tinh','https://res.cloudinary.com/dx2nrp7at/video/upload/v1681969499/MusicManager/11feb012-be5b-4002-849b-e6811c946c25.mp3','HIEUTHUHAI',1),(32,'','2023-04-20 12:45:32.416890','','Không Thể Say','https://res.cloudinary.com/dx2nrp7at/video/upload/v1681969549/MusicManager/a81dcd85-80e1-4f04-8dc4-23c516a00cab.mp3','HIEUTHUHAI',1),(33,'','2023-04-20 12:48:51.417170','','Hẹn em yêu lại ở thế giới thứ hai','https://res.cloudinary.com/dx2nrp7at/video/upload/v1681969737/MusicManager/3b06459f-81a0-4a72-8646-7a4313e902ae.mp3','Nguyenn',1),(34,'','2023-04-20 13:03:04.981177','','3107','https://res.cloudinary.com/dx2nrp7at/video/upload/v1681970603/MusicManager/a50d42fe-336d-4173-9459-41378ddd5e12.mp3','W/n',24),(35,'','2023-04-20 13:04:04.317139','','3107 2','https://res.cloudinary.com/dx2nrp7at/video/upload/v1681970653/MusicManager/4bd2f425-9493-402d-8c21-5aadad68ee2f.mp3','W/n',24),(36,'','2023-04-20 13:05:07.124434','','3107 3','https://res.cloudinary.com/dx2nrp7at/video/upload/v1681970713/MusicManager/858e14af-31da-486e-b72a-675e17f02b63.mp3','W/n',24),(37,'','2023-04-20 13:06:18.882947','','3107 4','https://res.cloudinary.com/dx2nrp7at/video/upload/v1681970783/MusicManager/aa48fe65-38f3-4811-b3c0-c39bb7717657.mp3','W/n',24),(38,'','2023-04-20 13:07:18.952638','','Chạm đáy nổi đau','https://res.cloudinary.com/dx2nrp7at/video/upload/v1681970849/MusicManager/f94103c7-cf1a-4501-8ede-bea57658f033.mp3','Erik',1),(39,'','2023-04-20 13:08:10.058790','','Có tất nhưng thiếu anh','https://res.cloudinary.com/dx2nrp7at/video/upload/v1681970897/MusicManager/0f26f7c3-0e77-4f9f-9c62-e27922921596.mp3','Erik',1),(40,'','2023-04-20 13:09:08.359093','','Yêu đường khó quá, chạy về đây khóc với anh','https://res.cloudinary.com/dx2nrp7at/video/upload/v1681970954/MusicManager/dee2d96c-f8eb-44d4-99aa-591f3ebea3fa.mp3','Erik',1),(41,'','2023-04-20 13:09:49.581762','','Màu nước mắt','https://res.cloudinary.com/dx2nrp7at/video/upload/v1681970996/MusicManager/1581a8ab-166c-4b5d-a4ec-1cf056562580.mp3','Erik',1),(42,'','2023-04-20 13:10:14.578160','','Hơn cả yêu','https://res.cloudinary.com/dx2nrp7at/video/upload/v1681971020/MusicManager/c186e350-0fdf-460a-a93d-27f994c99f58.mp3','Đức phúc',1),(43,'','2023-04-20 13:11:21.543463','','Mình yêu nhau từ kiếp nào','https://res.cloudinary.com/dx2nrp7at/video/upload/v1681971087/MusicManager/0530f632-9bc8-450e-aa4e-fa7cc8db6a15.mp3','Quang Trung',1),(44,'','2023-04-20 13:11:58.392019','','168 (Giờ)','https://res.cloudinary.com/dx2nrp7at/video/upload/v1681971124/MusicManager/10f883d6-e4d2-4af5-8522-a1725d02e7c7.mp3','Khải',1),(45,'','2023-04-20 13:12:19.563925','','Phố không em','https://res.cloudinary.com/dx2nrp7at/video/upload/v1681971144/MusicManager/ac450681-919e-4a09-b2ae-a0df10b6bf35.mp3','Thái Đinh',1),(46,'','2023-04-20 13:12:42.320687','','Nàng thơ','https://res.cloudinary.com/dx2nrp7at/video/upload/v1681971168/MusicManager/08fdbc7c-ba55-4bdd-8f83-4b67f2f5c3d1.mp3','Hoàng Dũng',1),(47,'','2023-04-20 13:13:07.839849','','Cảm giác lúc ấy sẽ ra sao','https://res.cloudinary.com/dx2nrp7at/video/upload/v1681971193/MusicManager/794e3000-41a2-401b-ba0f-5784d1ff39e8.mp3','Lou Hoàng',1),(48,'','2023-04-20 13:13:42.525125','','Là bạn không thể yêu','https://res.cloudinary.com/dx2nrp7at/video/upload/v1681971228/MusicManager/a5c63f2a-0e78-41d7-95d8-6286d75a6137.mp3','Lou Hoàng',1);
/*!40000 ALTER TABLE `songs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tokens`
--

DROP TABLE IF EXISTS `tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tokens` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `revoked` bit(1) NOT NULL,
  `token` varchar(255) NOT NULL,
  `tokenType` varchar(255) DEFAULT NULL,
  `USER_ID` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK2vfkhsdyoh3nbk8gih8pf04ls` (`USER_ID`),
  CONSTRAINT `FK2vfkhsdyoh3nbk8gih8pf04ls` FOREIGN KEY (`USER_ID`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=90 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tokens`
--

LOCK TABLES `tokens` WRITE;
/*!40000 ALTER TABLE `tokens` DISABLE KEYS */;
INSERT INTO `tokens` VALUES (1,_binary '','eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbkBnbWFpbC5jb20iLCJpYXQiOjE2Nzg4NjE3MjAsImV4cCI6MTY4MDA3MTMyMH0.U9uJcpQsw9e1OIwDVCnOkvHS3gY81PUtCX8Np56wKP2E62q0rL1ptENGkFIvvDkvhvIr9nb87hUtirX1FbiTHw','BEARER',1),(2,_binary '','eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbkBnbWFpbC5jb20iLCJpYXQiOjE2NzkwNDE3OTQsImV4cCI6MTY4MDI1MTM5NH0.el7xtrIua7fv0FmgGwGaR_CUW-hB5yRrB3RoG_4upgWoQLt5u274m5ls0XXojpura-gkkCVf_dKmUV33kSRT8g','BEARER',1),(3,_binary '','eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbkBnbWFpbC5jb20iLCJpYXQiOjE2NzkwNDIxMDEsImV4cCI6MTY4MDI1MTcwMX0.5_sZH9gLRnc6o5FyrMlGRullyi1zOeNcSM47KUYN0ztE9xQA0e6FTz22rDLLJFKsU0zy4MrXJPVDbkehjsBmCQ','BEARER',1),(4,_binary '','eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbkBnbWFpbC5jb20iLCJpYXQiOjE2NzkwNDQxOTgsImV4cCI6MTY4MDI1Mzc5OH0.dkPYXOLaGVbhaXyMYB9vQofhcVUbv_alepqoVQ6-BIYcq7bKc-v9Pj1PYPAJ-2GJSkxBLcP4w9pRT9GIlb4XMQ','BEARER',1),(5,_binary '','eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbkBnbWFpbC5jb20iLCJpYXQiOjE2NzkwNDQyNTIsImV4cCI6MTY4MDI1Mzg1Mn0.BBbTiNC5lwUIdxXesRATtyuDq71NLcx02if_xyj0OgWySRQvce0IWfYJCsljb-uzDEHoi3mtEASXarPpQkZIdg','BEARER',1),(6,_binary '','eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbkBnbWFpbC5jb20iLCJpYXQiOjE2NzkwNDQyNjYsImV4cCI6MTY4MDI1Mzg2Nn0.3BPzZK431PareqYgVb9doBdzkeBuCeksE7PCnupUMimFKHA-bsUVFZzR-hUxM3YOzudwqV-iogt-JJb0JWfiHg','BEARER',1),(7,_binary '','eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbkBnbWFpbC5jb20iLCJpYXQiOjE2NzkwNDQzODYsImV4cCI6MTY4MDI1Mzk4Nn0.xP8ZyQZGRszgFe7Y9EeI2FWp-CV17jVxHfxFTzj_MJUgTsQfvgzwk_oHdKoXJaBW65L_Wjqh1BFH6I0Sv8kvKA','BEARER',1),(8,_binary '','eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbkBnbWFpbC5jb20iLCJpYXQiOjE2NzkwNDQ0MTUsImV4cCI6MTY4MDI1NDAxNX0.mFr1USP4jO7fDe5tcqc_HzsgE_JB5eLLSScWonmQ33NzBqrcAdeiupMyFSoXzGnR_3uUPHd7A15Pkc2el0HJ_w','BEARER',1),(9,_binary '','eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbkBnbWFpbC5jb20iLCJpYXQiOjE2NzkwNDQ0MTgsImV4cCI6MTY4MDI1NDAxOH0.dPH6fErXuE0biVGZ3Pm4zYy1adDQpLgyYhQO7n1cr8XG637jxXd-FGe6trW31upMFGPW_P-S4qDFaa3IPBbPFQ','BEARER',1),(10,_binary '','eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbkBnbWFpbC5jb20iLCJpYXQiOjE2NzkwNDQ0MjQsImV4cCI6MTY4MDI1NDAyNH0.CK1kdjqL-ZCZDUrXByyp_p3wypHfDnPd7uakqRdq44q_LUHqVb2-Yk0RXEVtUh8M7mkoGZe4ET4UlCIPwW1bpA','BEARER',1),(11,_binary '','eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbkBnbWFpbC5jb20iLCJpYXQiOjE2NzkwNDQ0OTcsImV4cCI6MTY4MDI1NDA5N30.U7nWJAwVcAJASsLNVSRzgia3JrNFeswlCRn9j9OHQQp9iun1lCT3YkIQBq9nVxLC-aHaFyHT03gn0qwfY8BYTA','BEARER',1),(12,_binary '','eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbkBnbWFpbC5jb20iLCJpYXQiOjE2NzkwNDQ1NjEsImV4cCI6MTY4MDI1NDE2MX0.AETkQ6TCO2SSkbQ-vkh6gtr2ZfEIwLjW_bPWOz8nRa5sOGldoJT-LhCpPtBY2KHlguMkgzOvyUYGoGvsn0claA','BEARER',1),(13,_binary '','eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbkBnbWFpbC5jb20iLCJpYXQiOjE2NzkwNDQ2NDIsImV4cCI6MTY4MDI1NDI0Mn0.3E1s8pP-VScHpUTgxukmgv9Iuqds2WMvBb05VGSnX0D-Qcc92Ec1VNMIrZsD05HYDu2yKQB79N9EYf-wist3bA','BEARER',1),(14,_binary '','eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbkBnbWFpbC5jb20iLCJpYXQiOjE2NzkwNDQ3MDgsImV4cCI6MTY4MDI1NDMwOH0.DpAP8pJ_bPjVoZoILBh_W14AnlrY69nNZTOi715wGkEdFoHqhwbJdPELmoHbQbCU4tvcMmKsQZpIvRKSHjl4fg','BEARER',1),(15,_binary '','eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbkBnbWFpbC5jb20iLCJpYXQiOjE2NzkwNDQ3NDcsImV4cCI6MTY4MDI1NDM0N30.IrAh6NRBG78d-WVOPB8doHkNhjwpfOw4o1c2YBsoP6v2aTHq1Q-wnh74LdCtO8Lr-otgPkO0p_kR7ZGVjzczUg','BEARER',1),(16,_binary '','eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbkBnbWFpbC5jb20iLCJpYXQiOjE2NzkwNDQ3NjIsImV4cCI6MTY4MDI1NDM2Mn0.WgsOqMLHxDh1sDqUfAmG0D5sAv6iq2Y1rE3t5lkNybybOK0jMXbbbdlZ9YuFw5-xj81z3WRPRjcOQgD_ijRhQQ','BEARER',1),(17,_binary '','eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbkBnbWFpbC5jb20iLCJpYXQiOjE2NzkwNDQ3OTQsImV4cCI6MTY4MDI1NDM5NH0.ZiQ_ikm7AHuRc9lwY8oOeaopNJAd323MmCVcRH1eKcmChzKuo_o8J4Ezqs3Bk8z8HhdFjpYZhkdgod6dTmm_2A','BEARER',1),(18,_binary '','eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbkBnbWFpbC5jb20iLCJpYXQiOjE2NzkwNDUwNTcsImV4cCI6MTY4MDI1NDY1N30.FaH7Tj8ERd59gVUfVp2peCMtym3z673uAq7cVt2mCCjuzmkkXM89XldTXmiEW9BObpmM_DOqWkb8qwpR8iHWDQ','BEARER',1),(19,_binary '','eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbkBnbWFpbC5jb20iLCJpYXQiOjE2NzkwNDUxMTAsImV4cCI6MTY4MDI1NDcxMH0.Vjw50vKnMVnlSm6gMD58pOQkbhnFH8828RNbRN8nAUJ2K7vItiS3e3azcND0v6BvNjU3pAAmmL3JdR9OGa_lVw','BEARER',1),(20,_binary '','eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbkBnbWFpbC5jb20iLCJpYXQiOjE2NzkwNDUxNDQsImV4cCI6MTY4MDI1NDc0NH0.hsfHkj6jA8gU7vH4F6DapUkgznSxkBpOVe0MzEaxmppQM3EMEm48pY2WGq7lsK28TT7o5tADJBiXAQvnLNhh_A','BEARER',1),(21,_binary '','eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbkBnbWFpbC5jb20iLCJpYXQiOjE2NzkwNDUyOTIsImV4cCI6MTY4MDI1NDg5Mn0.GVEqDJRs2zksEGSenhD_ErIg4bEaKXt3GH63Q56QTy5EbbxueMA8WrYiX1Fj53scfF2ApiDi5PPLuWY_jFzV9g','BEARER',1),(22,_binary '','eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbkBnbWFpbC5jb20iLCJpYXQiOjE2NzkwNDU0NDcsImV4cCI6MTY4MDI1NTA0N30.sM3VSZmi_NpV5gFVenXn5b_3txCrsNoUAWE47PbP5N1b1w692QW64Ie3tqp1ADgi2firGuBAVL1Ck-8IOB5lBg','BEARER',1),(23,_binary '','eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbkBnbWFpbC5jb20iLCJpYXQiOjE2NzkwNDk5MTQsImV4cCI6MTY4MDI1OTUxNH0.32rogoa_mCWhKx_Q2YyfH5yXvutXm-9JSoKa-Y357BXolEA1ouCzW5kLdQuuprIPSnk9ynsIiRonSqarVsXmtg','BEARER',1),(24,_binary '','eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbkBnbWFpbC5jb20iLCJpYXQiOjE2NzkwNTAwMjAsImV4cCI6MTY4MDI1OTYyMH0.B-ATsGKdqIl_0diZi-KmoGEISXtZ44VOdL0MJacwVqzwwg2ga-g3LZEnd5fv3P8V7eO2oOQnCg1MshWVHSFJgg','BEARER',1),(25,_binary '','eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbkBnbWFpbC5jb20iLCJpYXQiOjE2NzkzNjcyNzEsImV4cCI6MTY4MDU3Njg3MX0.Sgov5ZUV9a_1MlinZHuoxmq5zJtgGJFgbNiZ8hu19pc87aRhtSe4fvBJS7AgF4YeS4NXvDvoUAT-kloe6R-JQQ','BEARER',1),(26,_binary '','eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbkBnbWFpbC5jb20iLCJpYXQiOjE2NzkzODY5OTIsImV4cCI6MTY4MDU5NjU5Mn0.NMtrLZGN2jM5MHq7kCLZJ7uvOuBjfZ4b5hnImQ8sbAxuBNMdsxnti1kmW_LIPp4mRQUOdL1qor6gNwmYsJ3G-A','BEARER',1),(27,_binary '','eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbkBnbWFpbC5jb20iLCJpYXQiOjE2NzkzODcwNjMsImV4cCI6MTY4MDU5NjY2M30.VVDht6WNCFZ6ZRvpau0BCqiomykxOFhAvyQM7KW9Uc6WkZIDLWbGc2GaPnXMNd6iDj2OMFkb8BZ-PpLSeMkgAw','BEARER',1),(28,_binary '','eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbkBnbWFpbC5jb20iLCJpYXQiOjE2NzkzODcwNjQsImV4cCI6MTY4MDU5NjY2NH0.4nBLYQ2tUB0y5lubZfgv_YYTcHQBbA6SgrDmWguq0w5rztbSbUAE97hzYC3bs-mHTQUqvqyh6ZPAubMAwaGnWA','BEARER',1),(29,_binary '','eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbkBnbWFpbC5jb20iLCJpYXQiOjE2NzkzODcxMjQsImV4cCI6MTY4MDU5NjcyNH0.pIehk8sMqrzypjzwSzDmHJt25AYtFmDmELWSpT3CLIhimmDbkNtrQOG1qVAw0fBDmsg4OXxui1oKD5ZUNbil4Q','BEARER',1),(30,_binary '','eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbkBnbWFpbC5jb20iLCJpYXQiOjE2NzkzODcxMjYsImV4cCI6MTY4MDU5NjcyNn0.3Jh67lRLZD17-2SvTkNI8b3dyjkxMdmKuVq4mK_tuGTXuhWGDWBj2gUemxVeCM6n7AticGvpCeZt8hTnjUcBFg','BEARER',1),(31,_binary '','eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbkBnbWFpbC5jb20iLCJpYXQiOjE2NzkzODcxMjksImV4cCI6MTY4MDU5NjcyOX0.fnlK_pPYhkYdAcJWQtefyIViuVQUqqH8ZyVIrs99MLM2_Hy85HFDxcbaeDofCUeKbl6POW9i1syeAmL-0E_U2w','BEARER',1),(32,_binary '','eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbkBnbWFpbC5jb20iLCJpYXQiOjE2NzkzODcxMjksImV4cCI6MTY4MDU5NjcyOX0.fnlK_pPYhkYdAcJWQtefyIViuVQUqqH8ZyVIrs99MLM2_Hy85HFDxcbaeDofCUeKbl6POW9i1syeAmL-0E_U2w','BEARER',1),(33,_binary '','eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbkBnbWFpbC5jb20iLCJpYXQiOjE2NzkzODcxMzQsImV4cCI6MTY4MDU5NjczNH0.TKx3RudqTB-_5BD-UqglqkJmErsjXqQldvmn37EEJdh0-lnGmau14YIBfOIMt8SlvqAPWXbqbm0pc3n1oz09mg','BEARER',1),(34,_binary '','eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbkBnbWFpbC5jb20iLCJpYXQiOjE2NzkzODcxNDcsImV4cCI6MTY4MDU5Njc0N30.VsIvWVZfH2tr7nuEUm5g8DppPPqrlGfGEMK6c-P3EXfGaMiq1jxPoAyfdF6TVrLpekuNdYI_DFFK9y16_8RnSg','BEARER',1),(35,_binary '','eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbkBnbWFpbC5jb20iLCJpYXQiOjE2NzkzODcyMzksImV4cCI6MTY4MDU5NjgzOX0.gYXUssxHingFmcNhnUx12FWcpT6dGacLpB_aLEtNApWwvUPTUTQBXTZRv6qVQ2ttx22Hwryp2_UvpMe8gNXJJg','BEARER',1),(36,_binary '','eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbkBnbWFpbC5jb20iLCJpYXQiOjE2NzkzODc1NjMsImV4cCI6MTY4MDU5NzE2M30.Rq8UfL1bzJy4PHIqq5HYANeCUIinaSZ100MTJJCiNIj11M85GAfnswf-jjWT0QVIMOvA8vgkEIsGhr8VxwkJkg','BEARER',1),(37,_binary '','eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbkBnbWFpbC5jb20iLCJpYXQiOjE2NzkzODk4MDYsImV4cCI6MTY4MDU5OTQwNn0.Ce2M1O-5IO3CXUqRKEmLZyL95m3DjrP_jIq-7_vOwp61-cyTm9ryuGKqtfxxPWkJWxsjrl3kqQKURr6t0W3rXg','BEARER',1),(38,_binary '','eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbkBnbWFpbC5jb20iLCJpYXQiOjE2NzkzODk4NTUsImV4cCI6MTY4MDU5OTQ1NX0.fp4RLS8IB3Cze2d9FlYSlGqn1wMTn90LBhl6v899RuPgVW-bZmy-dflbIutKGO3Dl0kgmzTrWZnrWecvcnP_LQ','BEARER',1),(39,_binary '\0','eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhQGdtYWlsLmNvbSIsImlhdCI6MTY4MDI0Njc4NiwiZXhwIjoxNjgxNDU2Mzg2fQ.ES3Z326hAoV7tObGzNA6Cv64OnUewi8cwADmNVJgjVc6JQUBNi5RFY5r_NMdOI5X0xpRl_3N7OeMCVZieaTE6w','BEARER',7),(40,_binary '','eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbkBnbWFpbC5jb20iLCJpYXQiOjE2ODAyNTE5NTgsImV4cCI6MTY4MTQ2MTU1OH0.jBFOJExIXTtHaKPjS9FE4DCpAICd1Kjc7g0MTLuKXCAU3HDFyF1l9jSlryfrqHR49xWS9uUs5ClRcqse2KFGbQ','BEARER',1),(41,_binary '','eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbkBnbWFpbC5jb20iLCJpYXQiOjE2ODAyNTE5NjcsImV4cCI6MTY4MTQ2MTU2N30.SPXV4UnKQMne57z1NkJlBQuUOKNucYYNdqlDaRkRv7ANRpSv1XqjZU6HrDXeETPEc4cOnJ-za8G0R2vCpVWATg','BEARER',1),(42,_binary '','eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbkBnbWFpbC5jb20iLCJpYXQiOjE2ODAyNTMyNTQsImV4cCI6MTY4MTQ2Mjg1NH0.K0W9GhVNvVV4Y-_rFt8eU7nr9x8MvmYywmBUMsprTDGLM3x7txOcl9jr4IvzsPHyoxipACvSMSq8lCQv4sz6vg','BEARER',1),(43,_binary '','eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbkBnbWFpbC5jb20iLCJpYXQiOjE2ODAyNTMyNTQsImV4cCI6MTY4MTQ2Mjg1NH0.K0W9GhVNvVV4Y-_rFt8eU7nr9x8MvmYywmBUMsprTDGLM3x7txOcl9jr4IvzsPHyoxipACvSMSq8lCQv4sz6vg','BEARER',1),(44,_binary '','eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbkBnbWFpbC5jb20iLCJpYXQiOjE2ODAyNTMyNTQsImV4cCI6MTY4MTQ2Mjg1NH0.K0W9GhVNvVV4Y-_rFt8eU7nr9x8MvmYywmBUMsprTDGLM3x7txOcl9jr4IvzsPHyoxipACvSMSq8lCQv4sz6vg','BEARER',1),(45,_binary '','eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbkBnbWFpbC5jb20iLCJpYXQiOjE2ODAyNTMyNTQsImV4cCI6MTY4MTQ2Mjg1NH0.K0W9GhVNvVV4Y-_rFt8eU7nr9x8MvmYywmBUMsprTDGLM3x7txOcl9jr4IvzsPHyoxipACvSMSq8lCQv4sz6vg','BEARER',1),(46,_binary '','eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbkBnbWFpbC5jb20iLCJpYXQiOjE2ODAyNTMyNjMsImV4cCI6MTY4MTQ2Mjg2M30.F9ePpBWCmdDsaaigdEn3r6XShwx-zFLbIEIWYJssYB3HR5FB6gpeXvfBanRjXCiGNz9GHYDwpK8NlyGpSIEvtA','BEARER',1),(47,_binary '\0','eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZmFhYXdAZ21haWwuY29tIiwiaWF0IjoxNjgwNTk0NzkxLCJleHAiOjE2ODE4MDQzOTF9.mvh64MHjMLa5ks3rvo0-IcCuNoNdpzxP5MBZMy16wyv9XzheK7xv99kzJ0YU_XCNAsW_-eRAbllQPr53nC_0NA','BEARER',23),(48,_binary '','eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZmF3QGdtYWlsLmNvbSIsImlhdCI6MTY4MDU5ODM1MywiZXhwIjoxNjgxODA3OTUzfQ.KEknBn0nfjnqffEW1EnT2PpZyu5FbQ-W0BXJdM5Ss77Hggvqo5NAW2a2lmFMFtZGfolrwFMPy59bYNbV-kUfnw','BEARER',20),(49,_binary '','eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbkBnbWFpbC5jb20iLCJpYXQiOjE2ODA1OTg3MDMsImV4cCI6MTY4MTgwODMwM30.ZAigD9XG4lFLgaF0vpO1ElEgVtrg_ehz0IT4PZztNlIzVCdsARHnHqxE8apnTXrqOSIfa1udyVtJzYF6FsRrHg','BEARER',1),(50,_binary '','eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJraWVtQGdtYWlsLmNvbSIsImlhdCI6MTY4MDYwMDcxMywiZXhwIjoxNjgxODEwMzEzfQ.5irgvIR5FTFVq0k-XouazUgQoiFWm7QOn00DczkZBzXlxT9gLQUrbTxetsAQXondNSCYI17BFcXfljRm3wexLQ','BEARER',24),(51,_binary '\0','eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZmF3QGdtYWlsLmNvbSIsImlhdCI6MTY4MDYwMDc1OSwiZXhwIjoxNjgxODEwMzU5fQ.GLx7Pz9hk4ytrLe5va8DToTHeoqR84W8MoBwN-eTcXv68PvN0xi_vLTtoZMZreVpvhiz5RXaecQsR9pQVpT_KQ','BEARER',20),(52,_binary '','eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbkBnbWFpbC5jb20iLCJpYXQiOjE2ODA2Njc0OTMsImV4cCI6MTY4MTg3NzA5M30.3cy_xWac-_NRivHchPa3d1H4blxNblGL7C2TL1IQc6ANxFfFRaGk-47jyrTnUmkKYdTeVwDdx2ZSsrdq_oheUw','BEARER',1),(53,_binary '','eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbkBnbWFpbC5jb20iLCJpYXQiOjE2ODA2Nzc1NjAsImV4cCI6MTY4MTg4NzE2MH0._6Bvubp6zXoXpbpdByfxVhhJRwIAjl3OeR9_tBdvQGMvvy7Ki7VFpXOkWk9tZmYMq6h5UkSPx-ACqjjYF34n0A','BEARER',1),(54,_binary '','eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbkBnbWFpbC5jb20iLCJpYXQiOjE2ODA3NTA1MTEsImV4cCI6MTY4MTk2MDExMX0.bsuSC6S4zq6ZKuZ0EWRWlF4lcIMBli2vjBiqRBeo0Siwh0ZETOrP1HTifeQCtchO7P2avghefOAk3XHKKnNbWg','BEARER',1),(55,_binary '','eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbkBnbWFpbC5jb20iLCJpYXQiOjE2ODA3NTU5NDAsImV4cCI6MTY4MTk2NTU0MH0.l88CHavM_a4fTsmwnaZ7Dh1DUzIH31uVa39dlVWGCk7pMI6-eoqBw36xjybJG5Ok3-S2hQpi7w4LvI2b6SIRdQ','BEARER',1),(56,_binary '','eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbkBnbWFpbC5jb20iLCJpYXQiOjE2ODExODI1NjAsImV4cCI6MTY4MjM5MjE2MH0.29Jo1pvQissCKX6GGM4O28K2Mu53UNOsCRf5kAQzXs0RFuOKaPAJaHcQO4ZcmfAMdSk8eNdhtAagn1_XfCIg8Q','BEARER',1),(57,_binary '','eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJlQGdtYWlsLmNvbSIsImlhdCI6MTY4MTE4NzY0NiwiZXhwIjoxNjgyMzk3MjQ2fQ.PkzHxgby0YRRAd5_t8NRIS9MM-3w89k2T1YD4ZO3mMDA_CpIFTTjbMPb9gT9_5v3LmFsbTTy5JAuyQsL925pAA','BEARER',4),(58,_binary '','eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbkBnbWFpbC5jb20iLCJpYXQiOjE2ODEyMDA1MDksImV4cCI6MTY4MjQxMDEwOX0.elhPQtRfNlgtrVjU33VVGaMj-vvBlmV5tbHqeRV-RXauITHG5cfyefDhHrxHBfWkXW-dwpI4P9B3iDpT3GmNYg','BEARER',1),(59,_binary '','eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJwaGFuYmJAZ21haWwuY29tIiwiaWF0IjoxNjgxMjA0OTg0LCJleHAiOjE2ODI0MTQ1ODR9.CNKmtHVMHji-XTLeJbazBJi4mG8ZBfbjggT8o1bgZNz-6GzPqBxoJsa85zFsgTnRmQawyGFomejbdH_fRMKrsA','BEARER',33),(60,_binary '','eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbkBnbWFpbC5jb20iLCJpYXQiOjE2ODEyNzMwMDQsImV4cCI6MTY4MjQ4MjYwNH0.JlxiHq-FZiAhWe62tErF5lLXbTcpwSH15fdVn07t01i16_P63LHeb-aSY5W29sWUrgitSJT_Fr39dHZa0RDJtw','BEARER',1),(61,_binary '','eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbkBnbWFpbC5jb20iLCJpYXQiOjE2ODEyODA4NDcsImV4cCI6MTY4MjQ5MDQ0N30.hmm2o5fKG1gHj0uvxKFpMK7o9gKq9ARCEgnemBpr9aCQHFqBVEkalER_O9r_1WNtOY-Nz6tXp72URn0y_IQbjg','BEARER',1),(62,_binary '','eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbkBnbWFpbC5jb20iLCJpYXQiOjE2ODEyODEyMjcsImV4cCI6MTY4MjQ5MDgyN30.DNv8qjovG-ltHiOXjeY7SpBv8RavTUP019G7VKoJm_MiAmpUpMG1nI46nzB_ekDGC_1JzvDIbY_pvVNjSLYWIw','BEARER',1),(63,_binary '','eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbkBnbWFpbC5jb20iLCJpYXQiOjE2ODEyODE4ODEsImV4cCI6MTY4MjQ5MTQ4MX0.5YZWSuGLq6WD4I_NMnH5LA3-dDOlMH-KvxrwKUD727Tz12agbGemgp24Fgv71aNz9BmOVvBB9BoRWh-0F2K1lA','BEARER',1),(64,_binary '','eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJwaGFuYmJAZ21haWwuY29tIiwiaWF0IjoxNjgxMjgxODkyLCJleHAiOjE2ODI0OTE0OTJ9.QqGggj8JvjmaBCOmfkP1ked2vSlEemptR-Jtnj1VhvVPj9Kg48Nchz79o43CH0OaCcNbLdHVoySv_Zfw-JLecw','BEARER',33),(65,_binary '','eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJwaGFuYmJAZ21haWwuY29tIiwiaWF0IjoxNjgxMjgyMTU4LCJleHAiOjE2ODI0OTE3NTh9.m7871xIbD-CoWXEivu3fLL61hWMoGaTcuwW2TQJsSbKErQM9sPaxPvGcTE9QOsE72tMdhE4sHliNs6awvEzPNg','BEARER',33),(66,_binary '','eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJwaGFuYmJAZ21haWwuY29tIiwiaWF0IjoxNjgxMjgzMTg1LCJleHAiOjE2ODI0OTI3ODV9.idYM_1m5UpoM_yDn3Jx_g9r8K3QeDhprP18FR6RUInbQXL7lfxeOuonz86EqLVxVLR7JRH6I9vCU2RQG3giRLg','BEARER',33),(67,_binary '','eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbkBnbWFpbC5jb20iLCJpYXQiOjE2ODEyODMyNzIsImV4cCI6MTY4MjQ5Mjg3Mn0.XgfU-HGvFmJTKFC9A2NGHGSwcEb8JZIYtnh9EzyFgtp4pFiXV9Amyl00lmb6RNqvFXpMEASlf7AK-k0iQvIf-w','BEARER',1),(68,_binary '','eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbkBnbWFpbC5jb20iLCJpYXQiOjE2ODEyODM1NjYsImV4cCI6MTY4MjQ5MzE2Nn0.kfgD8QxkuBxFLMJgKPKkQcrV3mVkiteq_62o3Gizf84g-98YyPQKuc-5upW92aCcZ0LouAufzWoMwxQZyc7egA','BEARER',1),(69,_binary '','eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbkBnbWFpbC5jb20iLCJpYXQiOjE2ODEyODM1NzIsImV4cCI6MTY4MjQ5MzE3Mn0.lIq5JFC1MSq4T8Dya7JW83wc72rXuJZPCGye4FDVtn99F9sYFCxZUwlkOqWVr8rzWJvyXISbeR8u6_US6stpTw','BEARER',1),(70,_binary '','eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJwaGFuYmJAZ21haWwuY29tIiwiaWF0IjoxNjgxMjgzNjcxLCJleHAiOjE2ODI0OTMyNzF9.tUYLSsxeWfXApVPdokZAUdoGI-1eKd4a8ttrYeb3bLd0xRKPzxOTS7EcHMIgXMm1VcdptDBbXGYBOnNZ0FgAvg','BEARER',33),(71,_binary '','eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbkBnbWFpbC5jb20iLCJpYXQiOjE2ODEyODM5NTMsImV4cCI6MTY4MjQ5MzU1M30.N7ZtfGffB6kUU_sdSZ5aGxyJe6K_PJB3maJZ0OCyHhTUnk2_xltzUulfSVkN77vjP2TbTkDq7RxPsphJbwYcpw','BEARER',1),(72,_binary '','eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJlQGdtYWlsLmNvbSIsImlhdCI6MTY4MTI4NDE2NSwiZXhwIjoxNjgyNDkzNzY1fQ.BoIdlr3lxLsKXNFam6uhMQnnk-4DrGvYHB-rrQSnMPC_fhf7xrIzjHpC1UIwHDeeJcvWv-S8yP0clonqvzGc6g','BEARER',4),(73,_binary '','eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbkBnbWFpbC5jb20iLCJpYXQiOjE2ODEyODU3NzQsImV4cCI6MTY4MjQ5NTM3NH0.FctPmn3WzCUqj5G4FtrWtmweNkSBurE1ejkaPjrFVmJVlQbwLfR1CG8fpLye5LqSaWCj_wVCoZNTJR1ijkMDmA','BEARER',1),(74,_binary '','eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbkBnbWFpbC5jb20iLCJpYXQiOjE2ODEyOTQ4NDMsImV4cCI6MTY4MjUwNDQ0M30.tdVHHIR48dSPjU5rpdWK7meieavU2jgNhdhuXTpKOc0scKx2HuMXK1iji_nqtwy8sG-3LRr74tWId4HlbZOsUw','BEARER',1),(75,_binary '','eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbkBnbWFpbC5jb20iLCJpYXQiOjE2ODEzODE5MjIsImV4cCI6MTY4MjU5MTUyMn0.FXlEqSZa_rWqaWYx43sDV7n_ay1npr5kpOm3aI8WesSbOZaoUCClYvtOGERVx4CHU5VJH1BhWp9nLHJpGdTl1w','BEARER',1),(76,_binary '','eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbkBnbWFpbC5jb20iLCJpYXQiOjE2ODEzODE5NzIsImV4cCI6MTY4MjU5MTU3Mn0.ptzeJ4L7icEPQywJfMKyIZ6-0Yz7lf0A4gYpnP2_MEX7PzAVijLtBJTPwx-DK5DS6NmweSMDJ4XrPoyVSHJ_pQ','BEARER',1),(77,_binary '','eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbkBnbWFpbC5jb20iLCJpYXQiOjE2ODE4MTM5MTQsImV4cCI6MTY4MzAyMzUxNH0.T-qfhF_oq---BCSUy_9CAy9MB0clVSTYbv7saoiJZrc3HVUULX1EIo9_v8ujPqj_VqEgTZJ5jDmWU-x7rRIbMg','BEARER',1),(78,_binary '','eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJlQGdtYWlsLmNvbSIsImlhdCI6MTY4MTg5MTc0NCwiZXhwIjoxNjgzMTAxMzQ0fQ.gYD9reMSrJEncWEJ87xUv0MQJZLDj3TMeB_hSoNIaGN7rvh86fhWseWzF--5a6ZOwRvcabS_deH--OP6YFGYCA','BEARER',4),(79,_binary '','eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbkBnbWFpbC5jb20iLCJpYXQiOjE2ODE4OTM3MTEsImV4cCI6MTY4MzEwMzMxMX0.QJLUz_VaFvs2KccDV6OAyFqI2DjWXqJ_1SWzKxR1f3fcFJxBZb5EMmDHANfHdAnLAl0vZ6gBRs7FJ4xjYTvbyw','BEARER',1),(80,_binary '','eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJlQGdtYWlsLmNvbSIsImlhdCI6MTY4MTg5Mzk2OSwiZXhwIjoxNjgzMTAzNTY5fQ.c_B7SwgUW4FxGBnr709NhD5Ig_Gb26o63DpUwwApykGZmWpj9wk5Il1trx_MYLz1ExAE8TdQxoU_3mDYYmE1_A','BEARER',4),(81,_binary '','eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbkBnbWFpbC5jb20iLCJpYXQiOjE2ODE4OTQ2NjcsImV4cCI6MTY4MzEwNDI2N30.xc62CPVgmDx_-CYTe4UnZA47VHDAuwGzyFcXaQ50NnTPRXoVYs74x6KP71FV4Zj87-xw5UB5LRFRirml_TFt5A','BEARER',1),(82,_binary '','eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJlQGdtYWlsLmNvbSIsImlhdCI6MTY4MTg5NDcyNSwiZXhwIjoxNjgzMTA0MzI1fQ.lvobZ86JFsp2BnzLzT28rVisB06WNKRtm23tlpIfdZPEyDQh-bq7LXJ5lEu2lJH7dKspJJ4DtLGTV27gGpSEYA','BEARER',4),(83,_binary '','eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJlQGdtYWlsLmNvbSIsImlhdCI6MTY4MTg5ODE2NywiZXhwIjoxNjgzMTA3NzY3fQ.xrrtlaFGHuW18DaKTJPOZrQNGab6wCeZelHI3XvpO-xp0WZSvRz1yJF2Y7cnnCgfOZ7zZSrTLHG6B1MFZzXYqg','BEARER',4),(84,_binary '','eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbkBnbWFpbC5jb20iLCJpYXQiOjE2ODE4OTgzMTUsImV4cCI6MTY4MzEwNzkxNX0.Qe3gWOwc7OYRZoDhoTBxRQiBIjQkbqPIUdVmLI2kB4c5U4-Ot7_chWOMEU76EMe3uptrYLkk7v9vyx-p8vnNRA','BEARER',1),(85,_binary '','eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbkBnbWFpbC5jb20iLCJpYXQiOjE2ODE4OTg0MDgsImV4cCI6MTY4MzEwODAwOH0.AU-5sUBUDQfV5gO8oTFHGMs1a_B7ZgBL0GA6Pi19qFXXM4dusQ3_pMXeaLtmu4Fhuq5AzEghJQzbAPAi-pid6g','BEARER',1),(86,_binary '','eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJlQGdtYWlsLmNvbSIsImlhdCI6MTY4MTg5ODg0NiwiZXhwIjoxNjgzMTA4NDQ2fQ.HFF9hRB0GhiASSQW9qQtZ_Iy8J8EDG4v3PceaqXuYhOnZwIswHPtypm8A4yN1PqLxvo6c98-KbzQ9Kr4vP_kUw','BEARER',4),(87,_binary '','eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJraWVtQGdtYWlsLmNvbSIsImlhdCI6MTY4MTk3MDEzOCwiZXhwIjoxNjgzMTc5NzM4fQ.juiKKeXbg5D-zTBGMzMxWK9e-3hvAwmH7p2FfS5GhVnlEraXY7IKy9GPGodOsFuZ2K9d8h7odU05EjRm8AZsdQ','BEARER',24),(88,_binary '','eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbkBnbWFpbC5jb20iLCJpYXQiOjE2ODE5NzA3OTksImV4cCI6MTY4MzE4MDM5OX0.KDn-8J9vQNLhz-QCyUAayh4cwZDETwM-FvaDTFRXgt1mCxKmTWt_HCrNJl2mAx0DVCZKjCGNo-fHcEHLRhHtjg','BEARER',1),(89,_binary '\0','eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbkBnbWFpbC5jb20iLCJpYXQiOjE2ODE5NzIwNDIsImV4cCI6MTY4MzE4MTY0Mn0.R1cb1xtND5vRCtY8j1MH3oXpHi_66N5NfV8UABmwGOGFNxjbtvJzbRTk7waUqrG4LjzZoCfEditC08uE9_ABRg','BEARER',1);
/*!40000 ALTER TABLE `tokens` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `email` varchar(255) NOT NULL,
  `firstName` varchar(255) NOT NULL,
  `lastName` varchar(255) NOT NULL,
  `lastUpdate` datetime(6) DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `status` bit(1) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK_6dotkott2kjsp8vw4d0m25fb7` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=35 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'admin@gmail.com','admin','admin','2023-04-20 14:11:55.933423','$2a$10$pd3j.orlx.iUOlPoTNLwvObK8DdWFsS9YVjYxE.ibP5Pdk4wdpmWm',_binary ''),(4,'e@gmail.com','aa','aa','2023-04-19 16:46:32.051131','$2a$10$Sm.6IW5hsnr4WSDFlVK78OUuZUhq3nSrucOhYRu3hKDqk7e4beFW.',_binary ''),(6,'acbd@gmail.com','abc','d','2023-04-19 14:40:36.033600','$2a$10$NbfRhIg4BaCj3CJgcpgI7u65kZcWncfDaUYakCJf3JVYH5YTc.U9q',_binary ''),(7,'a@gmail.com','aaa','aaaa','2023-04-04 15:15:15.608487','$2a$10$NXUNYPbJO4t2Qdpq98hH.uPSle621ml6qhSChe646LRb6lrdiGjYy',_binary ''),(10,'abc@gmail.com','ab','c','2023-03-17 14:18:03.865114','$2a$10$/dF8e7ZI8xgNi47lUPdQXu6XSxz9fAttrrzX5ym8GX6Vu6A/qSAVe',_binary ''),(20,'afaw@gmail.com','aaaa','aaaaaaaa','2023-04-04 15:09:56.561714','$2a$10$tJ/6IqzA0i0ytqtz615gpeVdPCZ5mJCU/57I7Sn/2pnLpPqyYgL/e',_binary ''),(23,'afaaaw@gmail.com','aaaa','aaaaaaaa','2023-04-11 11:29:05.874749','$2a$10$Epj3rHEbyJGeuceXIlenCOOAc5wFuRVVj1RuxbAKDmqL9SttFiree',_binary ''),(24,'kiem@gmail.com','Kiem Doan','Pham','2023-04-11 11:29:00.347432','$2a$10$B.3Lm7t9hkhoCLsgj7k.5OUBbAzkilGYyj7hQ2FGZhy0WjFGRfzIy',_binary ''),(31,'phanaa@gmail.com','Phan','A',NULL,'$2a$10$y6r5HPwGDGVjlJD2X5C.JO89AOOtmlosiElX4pJX7wNCQHtpkMqaq',_binary ''),(33,'phanbb@gmail.com','Phan','B','2023-04-19 14:41:17.938649','$2a$10$HsYB3bp3HIO5ioVXepcv2uZFYzXCV1WI4RenUZuFvKtO95Mdej6zq',_binary ''),(34,'nguyenvanb@gmail.com','Nguyễn Văn','B','2023-04-20 14:14:21.022593','$2a$10$s6ISnsFTgUjSBdYxP.iswe5Ow7uGiHRTazmSyOPQy6qK7hAX5.8.S',_binary '');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users_roles`
--

DROP TABLE IF EXISTS `users_roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users_roles` (
  `USER_ID` bigint NOT NULL,
  `ROLE_ID` bigint NOT NULL,
  KEY `FKauyhopi3wp2cjd4d0x5fheoxr` (`ROLE_ID`),
  KEY `FKdc4la666yvun4fybybxto4n61` (`USER_ID`),
  CONSTRAINT `FKauyhopi3wp2cjd4d0x5fheoxr` FOREIGN KEY (`ROLE_ID`) REFERENCES `roles` (`id`),
  CONSTRAINT `FKdc4la666yvun4fybybxto4n61` FOREIGN KEY (`USER_ID`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users_roles`
--

LOCK TABLES `users_roles` WRITE;
/*!40000 ALTER TABLE `users_roles` DISABLE KEYS */;
INSERT INTO `users_roles` VALUES (6,2),(10,2),(20,2),(7,2),(24,2),(23,2),(4,2),(31,2),(33,2),(1,1),(34,2);
/*!40000 ALTER TABLE `users_roles` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-04-20 14:59:31
