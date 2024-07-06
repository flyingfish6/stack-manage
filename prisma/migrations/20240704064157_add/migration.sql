-- AlterTable
ALTER TABLE `stock` ADD COLUMN `wareHouse` ENUM('qianfang', 'si71', 'ziluotong', 'laduan', 'lamaohuanian', 'dianqi', 'wu83', 'zhoucheng', 'maoling', 'sanjiaodai', 'shumaoji', 'dache', 'gaobing') NOT NULL DEFAULT 'qianfang';
