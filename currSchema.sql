/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Engagement` (
  `UserID` int NOT NULL,
  `PostID` varchar(36) NOT NULL,
  `Type` enum('LIKE','DISLIKE','BOOKMARK') NOT NULL,
  PRIMARY KEY (`UserID`,`PostID`,`Type`),
  KEY `PostID` (`PostID`),
  CONSTRAINT `Engagement_ibfk_1` FOREIGN KEY (`UserID`) REFERENCES `User` (`ID`) ON DELETE CASCADE,
  CONSTRAINT `Engagement_ibfk_2` FOREIGN KEY (`PostID`) REFERENCES `Post` (`PostID`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Post` (
  `PostID` varchar(36) NOT NULL,
  `MasterID` varchar(36) NOT NULL,
  `ParentID` varchar(36) DEFAULT NULL,
  `UserID` int NOT NULL,
  `Content` varchar(500) NOT NULL,
  `TimePosted` datetime DEFAULT NULL,
  `LastEdited` datetime DEFAULT NULL,
  `Likes` int NOT NULL DEFAULT '0',
  `Dislikes` int NOT NULL DEFAULT '0',
  `Bookmarks` int NOT NULL DEFAULT '0',
  `Comments` int NOT NULL DEFAULT '0',
  PRIMARY KEY (`PostID`),
  KEY `MasterID` (`MasterID`),
  KEY `ParentID` (`ParentID`),
  KEY `UserID` (`UserID`),
  CONSTRAINT `Post_ibfk_1` FOREIGN KEY (`MasterID`) REFERENCES `Post` (`PostID`) ON DELETE CASCADE,
  CONSTRAINT `Post_ibfk_2` FOREIGN KEY (`ParentID`) REFERENCES `Post` (`PostID`) ON DELETE CASCADE,
  CONSTRAINT `Post_ibfk_3` FOREIGN KEY (`UserID`) REFERENCES `User` (`ID`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `User` (
  `ID` int NOT NULL,
  `Password` char(60) NOT NULL,
  `Name` varchar(255) NOT NULL,
  `Bio` varchar(255) DEFAULT NULL,
  `Type` enum('STUDENT','COUNCIL','SOCIETY','ADMIN') NOT NULL,
  `AuthPin` varchar(6) NOT NULL,
  `PinExpiry` datetime NOT NULL,
  `Verified` tinyint(1) NOT NULL DEFAULT '0',
  `IconUrl` varchar(256) DEFAULT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
