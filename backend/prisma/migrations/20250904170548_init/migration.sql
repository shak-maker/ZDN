-- CreateTable
CREATE TABLE "reports" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "contract_no" TEXT,
    "customer" TEXT,
    "discharge_commenced" DATETIME,
    "discharge_completed" DATETIME,
    "full_completed" DATETIME,
    "handled_by" TEXT,
    "inspector" TEXT,
    "location" TEXT,
    "object" TEXT,
    "product" TEXT,
    "report_date" DATETIME,
    "report_no" TEXT NOT NULL,
    "json_data" JSONB NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "report_details" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "report_id" INTEGER NOT NULL,
    "actual_density" REAL,
    "zdnmt" REAL,
    "density_at_20c" REAL,
    "difference_amber_rwbmt" REAL,
    "difference_amber_rwbmt_percent" REAL,
    "dip_cm" REAL,
    "gov_liters" INTEGER,
    "rtc_no" TEXT,
    "rwbmt_gross" REAL,
    "rwb_no" TEXT,
    "seal_no" TEXT,
    "tov_liters" INTEGER,
    "temperature_c" REAL,
    "type" TEXT,
    "water_liters" INTEGER,
    "water_cm" REAL,
    CONSTRAINT "report_details_report_id_fkey" FOREIGN KEY ("report_id") REFERENCES "reports" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "users" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'USER',
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "api_keys" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "key" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "audit_logs" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "user_id" INTEGER,
    "report_id" INTEGER,
    "action" TEXT NOT NULL,
    "details" JSONB,
    "ip_address" TEXT,
    "user_agent" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "audit_logs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "audit_logs_report_id_fkey" FOREIGN KEY ("report_id") REFERENCES "reports" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "reports_report_no_key" ON "reports"("report_no");

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "api_keys_key_key" ON "api_keys"("key");
