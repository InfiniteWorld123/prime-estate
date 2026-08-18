ALTER TABLE "user"
ADD COLUMN "role" text NOT NULL DEFAULT 'USER',
ADD CONSTRAINT user_role_check CHECK ("role" IN ('USER', 'ADMIN'));

CREATE UNIQUE INDEX user_single_admin_idx ON "user" ("role")
WHERE
    "role" = 'ADMIN';
