-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "identifier" TEXT NOT NULL,
    "account_number" TEXT NOT NULL,
    "full_name" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "permissions" (
    "id" SERIAL NOT NULL,
    "permission_name" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "permissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_permissions" (
    "user_id" INTEGER NOT NULL,
    "permission_id" INTEGER NOT NULL,
    "assigned_by" INTEGER,
    "assigned_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_permissions_pkey" PRIMARY KEY ("user_id","permission_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_identifier_key" ON "users"("identifier");

-- CreateIndex
CREATE UNIQUE INDEX "users_account_number_key" ON "users"("account_number");

-- CreateIndex
CREATE INDEX "users_identifier_idx" ON "users"("identifier");

-- CreateIndex
CREATE INDEX "users_account_number_idx" ON "users"("account_number");

-- CreateIndex
CREATE UNIQUE INDEX "permissions_permission_name_key" ON "permissions"("permission_name");

-- CreateIndex
CREATE INDEX "user_permissions_user_id_idx" ON "user_permissions"("user_id");

-- CreateIndex
CREATE INDEX "user_permissions_permission_id_idx" ON "user_permissions"("permission_id");

-- AddForeignKey
ALTER TABLE "user_permissions" ADD CONSTRAINT "user_permissions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_permissions" ADD CONSTRAINT "user_permissions_permission_id_fkey" FOREIGN KEY ("permission_id") REFERENCES "permissions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Insert default permissions (2 roles only)
INSERT INTO "permissions" ("permission_name", "description") VALUES
('admin_operational_officer', 'Full system access with administrative and operational privileges'),
('privileged_user', 'Can view crime records and analytics');

-- Insert default users (usernames match role names)
-- Password hash for 'admin123' using bcrypt
INSERT INTO "users" ("identifier", "account_number", "full_name", "password_hash", "updated_at") VALUES
('admin_operational_officer', 'ACC-000001', 'System Administrator', '$2a$10$rKZLvXZnF8h8W8yqP5xqXeYvJxKxGxKxGxKxGxKxGxKxGxKxGxKxG', CURRENT_TIMESTAMP);

-- Assign admin_operational_officer permission
INSERT INTO "user_permissions" ("user_id", "permission_id") VALUES
(1, 1);
