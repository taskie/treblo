CREATE TABLE IF NOT EXISTS `attrs` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `entity_type` INTEGER NOT NULL,
    `entity_id` INTEGER NOT NULL,           -- FK
    `group_id` VARCHAR(128),                -- cached from stat or history
    `path` VARCHAR(512),                    -- cached from stat or history
    `version` INTEGER,                      -- cached from history
    `digest` CHAR(64),                      -- cached from footprint
    `key` VARCHAR(128) NOT NULL,
    `value_footprint_id` INTEGER NOT NULL,  -- FK
    `value_digest` CHAR(64) NOT NULL,       -- cached from footprint
    `value_content_type` INTEGER NOT NULL,
    `status` INTEGER NOT NULL,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    UNIQUE (`entity_type`, `entity_id`, `key`, `value_footprint_id`)
) DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

CREATE INDEX `attrs_updated_at` ON `attrs` (`updated_at`, `id`);
CREATE INDEX `attrs_value_footprint_id_entity_type_entity_id_key` ON `attrs` (`value_footprint_id`, `entity_type`, `entity_id`, `key`);