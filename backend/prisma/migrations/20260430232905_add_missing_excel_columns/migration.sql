-- CreateTable
CREATE TABLE "crime_incidents" (
    "id" TEXT NOT NULL,
    "blotter_no" TEXT,
    "date_encoded" TIMESTAMP(3),
    "police_regional_office" TEXT,
    "police_provincial_office" TEXT,
    "station" TEXT,
    "police_community_precinct" TEXT,
    "region" TEXT,
    "province" TEXT,
    "municipality" TEXT,
    "barangay" TEXT NOT NULL,
    "street" TEXT,
    "type_of_place" TEXT,
    "date_reported" TIMESTAMP(3) NOT NULL,
    "time_reported" TEXT NOT NULL,
    "date_committed" TIMESTAMP(3) NOT NULL,
    "time_committed" TEXT NOT NULL,
    "incident_type" TEXT NOT NULL,
    "is_crime" BOOLEAN NOT NULL DEFAULT true,
    "mode_reporting" TEXT,
    "stage_of_felony" TEXT,
    "offense" TEXT,
    "offense_type" TEXT,
    "section" TEXT,
    "modus" TEXT,
    "suspect_motive" TEXT,
    "suspect_sub_motive" TEXT,
    "heinous" BOOLEAN NOT NULL DEFAULT false,
    "sensational" BOOLEAN NOT NULL DEFAULT false,
    "threat_grp" BOOLEAN NOT NULL DEFAULT false,
    "grp_affiliation" TEXT,
    "incident_type_threat_grp" TEXT,
    "mrs" TEXT,
    "suspect_is_ego" BOOLEAN NOT NULL DEFAULT false,
    "suspect_ego_position" TEXT,
    "suspect_ego_class" TEXT,
    "suspect_count" INTEGER,
    "victim_is_ego" BOOLEAN NOT NULL DEFAULT false,
    "victim_ego_position" TEXT,
    "victim_ego_class" TEXT,
    "victim_count" INTEGER,
    "case_status" TEXT,
    "investigator" TEXT,
    "head_investigator" TEXT,
    "lat" DOUBLE PRECISION,
    "lng" DOUBLE PRECISION,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "crime_incidents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "barangays" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "coordinates" JSONB,
    "population" INTEGER,
    "area" DOUBLE PRECISION,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "barangays_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "crime_incidents_barangay_idx" ON "crime_incidents"("barangay");

-- CreateIndex
CREATE INDEX "crime_incidents_date_committed_idx" ON "crime_incidents"("date_committed");

-- CreateIndex
CREATE INDEX "crime_incidents_incident_type_idx" ON "crime_incidents"("incident_type");

-- CreateIndex
CREATE INDEX "crime_incidents_region_province_municipality_idx" ON "crime_incidents"("region", "province", "municipality");

-- CreateIndex
CREATE INDEX "crime_incidents_lat_lng_idx" ON "crime_incidents"("lat", "lng");

-- CreateIndex
CREATE INDEX "crime_incidents_blotter_no_idx" ON "crime_incidents"("blotter_no");

-- CreateIndex
CREATE INDEX "crime_incidents_case_status_idx" ON "crime_incidents"("case_status");

-- CreateIndex
CREATE INDEX "crime_incidents_heinous_idx" ON "crime_incidents"("heinous");

-- CreateIndex
CREATE INDEX "crime_incidents_sensational_idx" ON "crime_incidents"("sensational");

-- CreateIndex
CREATE UNIQUE INDEX "barangays_name_key" ON "barangays"("name");
