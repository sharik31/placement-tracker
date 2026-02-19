-- CreateTable
CREATE TABLE "spc_admins" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "email" VARCHAR(150) NOT NULL,
    "password_hash" VARCHAR(255) NOT NULL,
    "phone" VARCHAR(20),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "is_active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "spc_admins_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "student_sessions" (
    "id" SERIAL NOT NULL,
    "google_email" VARCHAR(150) NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "branch" VARCHAR(100) NOT NULL,
    "logged_in_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "student_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "upcoming_companies" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(200) NOT NULL,
    "tentative_date" DATE NOT NULL,
    "info" TEXT,
    "attachment_name" VARCHAR(200),
    "attachment_url" TEXT,
    "created_by" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "upcoming_companies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ongoing_drives" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(200) NOT NULL,
    "jd" TEXT NOT NULL,
    "status" VARCHAR(20) NOT NULL,
    "current_round" VARCHAR(200),
    "round_number" INTEGER NOT NULL DEFAULT 0,
    "total_rounds" INTEGER NOT NULL DEFAULT 0,
    "gform_link" TEXT,
    "gform_deadline" TIMESTAMP(3),
    "created_by" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ongoing_drives_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "completed_drives" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(200) NOT NULL,
    "jd" TEXT NOT NULL,
    "final_list_name" VARCHAR(200),
    "final_list_url" TEXT,
    "selected_list_name" VARCHAR(200),
    "selected_list_url" TEXT,
    "selected_count" INTEGER NOT NULL DEFAULT 0,
    "spc_member_name" VARCHAR(100) NOT NULL,
    "spc_member_phone" VARCHAR(20),
    "spc_member_email" VARCHAR(150),
    "created_by" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "completed_drives_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_log" (
    "id" SERIAL NOT NULL,
    "admin_id" INTEGER,
    "action" VARCHAR(50) NOT NULL,
    "table_name" VARCHAR(50) NOT NULL,
    "record_id" INTEGER NOT NULL,
    "old_data" JSONB,
    "new_data" JSONB,
    "performed_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_log_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "spc_admins_email_key" ON "spc_admins"("email");

-- CreateIndex
CREATE INDEX "student_sessions_google_email_idx" ON "student_sessions"("google_email");

-- CreateIndex
CREATE INDEX "upcoming_companies_tentative_date_idx" ON "upcoming_companies"("tentative_date");

-- CreateIndex
CREATE INDEX "ongoing_drives_status_idx" ON "ongoing_drives"("status");

-- CreateIndex
CREATE INDEX "completed_drives_name_idx" ON "completed_drives"("name");

-- CreateIndex
CREATE INDEX "audit_log_admin_id_idx" ON "audit_log"("admin_id");

-- CreateIndex
CREATE INDEX "audit_log_table_name_idx" ON "audit_log"("table_name");

-- AddForeignKey
ALTER TABLE "upcoming_companies" ADD CONSTRAINT "upcoming_companies_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "spc_admins"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ongoing_drives" ADD CONSTRAINT "ongoing_drives_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "spc_admins"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "completed_drives" ADD CONSTRAINT "completed_drives_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "spc_admins"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_log" ADD CONSTRAINT "audit_log_admin_id_fkey" FOREIGN KEY ("admin_id") REFERENCES "spc_admins"("id") ON DELETE SET NULL ON UPDATE CASCADE;
