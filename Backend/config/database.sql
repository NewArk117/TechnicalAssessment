CREATE DATABASE IF NOT EXISTS `searchbox` DEFAULT CHARACTER SET utf8 COLLATE
utf8_general_ci;

USE `searchbox`;

CREATE TABLE IF NOT EXISTS data (
        id int NOT NULL PRIMARY KEY,
        postId int NOT NULL,
        name varchar(255) NOT NULL,
        email varchar(255) NULL,
        body varchar(500) NULL
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8;