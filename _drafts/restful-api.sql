/*
Navicat MySQL Data Transfer

Source Server         : localhost
Source Server Version : 50505
Source Host           : localhost:3306
Source Database       : restful-api

Target Server Type    : MYSQL
Target Server Version : 50505
File Encoding         : 65001

Date: 2016-10-08 14:29:22
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for `permission`
-- ----------------------------
DROP TABLE IF EXISTS `permission`;
CREATE TABLE `permission` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '权限唯一标识符',
  `source_id` int(11) NOT NULL COMMENT '权限对应资源唯一标识符',
  `role_id` int(11) NOT NULL COMMENT '拥有该权限的角色',
  `name` linestring NOT NULL COMMENT '权限名称',
  `action` linestring NOT NULL COMMENT '权限对应的动作',
  `relation` tinyint(4) NOT NULL COMMENT '权限类型（1：私有权限 2：角色权限）',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of permission
-- ----------------------------

-- ----------------------------
-- Table structure for `role`
-- ----------------------------
DROP TABLE IF EXISTS `role`;
CREATE TABLE `role` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '角色唯一标识符',
  `name` linestring NOT NULL COMMENT '角色名称',
  `users` linestring NOT NULL COMMENT '角色所对应的用户群（array）',
  `permissions` linestring NOT NULL COMMENT '权限列表（array）',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of role
-- ----------------------------

-- ----------------------------
-- Table structure for `source`
-- ----------------------------
DROP TABLE IF EXISTS `source`;
CREATE TABLE `source` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '资源唯一标识符',
  `name` linestring NOT NULL COMMENT '资源名称（string）',
  `permissions` linestring NOT NULL COMMENT '权限列表（array）',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of source
-- ----------------------------

-- ----------------------------
-- Table structure for `user`
-- ----------------------------
DROP TABLE IF EXISTS `user`;
CREATE TABLE `user` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '用户唯一标识符',
  `username` linestring NOT NULL COMMENT '用户名称',
  `create-by` linestring NOT NULL COMMENT '该记录的所有者',
  `role_ids` linestring NOT NULL COMMENT '用户所拥有的角色',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of user
-- ----------------------------
