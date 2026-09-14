-- CreateTable
CREATE TABLE "backups" (
    "id" TEXT NOT NULL,
    "kind" TEXT NOT NULL,
    "file_name" TEXT NOT NULL,
    "mime_type" TEXT NOT NULL,
    "size_bytes" INTEGER NOT NULL,
    "content" BYTEA NOT NULL,
    "label" TEXT,
    "barangay" TEXT,
    "period_label" TEXT,
    "row_count" INTEGER,
    "created_by" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "backups_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "backups_kind_idx" ON "backups"("kind");

-- CreateIndex
CREATE INDEX "backups_created_at_idx" ON "backups"("created_at");

