-- AlterTable
ALTER TABLE `stockin` ADD COLUMN `wareHose` ENUM('qianfang', 'si71', 'ziluotong', 'laduan', 'lamaohuanian', 'dianqi', 'wu83', 'zhoucheng', 'maoling', 'sanjiaodai', 'shumaoji', 'dache', 'gaobing') NOT NULL DEFAULT 'qianfang';

-- AlterTable
ALTER TABLE `stockout` ADD COLUMN `woreHouse` ENUM('qianfang', 'si71', 'ziluotong', 'laduan', 'lamaohuanian', 'dianqi', 'wu83', 'zhoucheng', 'maoling', 'sanjiaodai', 'shumaoji', 'dache', 'gaobing') NOT NULL DEFAULT 'qianfang';
