-- CreateTable
CREATE TABLE "upload_logs" (
    "id" TEXT NOT NULL,
    "file_name" TEXT NOT NULL,
    "file_size" INTEGER NOT NULL,
    "records_imported" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'success',
    "error_message" TEXT,
    "uploaded_by" TEXT,
    "uploaded_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "upload_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "upload_logs_uploaded_at_idx" ON "upload_logs"("uploaded_at");

-- CreateIndex
CREATE INDEX "upload_logs_status_idx" ON "upload_logs"("status");
