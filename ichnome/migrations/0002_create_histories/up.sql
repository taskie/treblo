CREATE TABLE IF NOT EXISTS `histories` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `namespace_id` VARCHAR(128) NOT NULL,  -- FK
    `path` VARCHAR(512) NOT NULL,
    `version` INTEGER NOT NULL,
    `status` INTEGER NOT NULL,
    `mtime` DATETIME,
    `object_id` INTEGER,                   -- FK
    `digest` CHAR(64),                     -- cached from object
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    UNIQUE (`namespace_id`, `path`, `version`)
) DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

CREATE INDEX `histories_mtime_path_version` ON `histories` (`mtime`, `path`, `version`);
CREATE INDEX `histories_object_id_path_version` ON `histories` (`object_id`, `path`, `version`);
CREATE INDEX `histories_object_id_mtime` ON `histories` (`object_id`, `mtime`);