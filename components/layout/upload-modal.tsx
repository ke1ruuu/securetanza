"use client";

import React, { useState, useRef, useCallback } from "react";
import { Upload, FileSpreadsheet, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import * as XLSX from "xlsx";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface UploadModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Expected database columns (from Prisma schema)
const EXPECTED_COLUMNS = [
  "blotter_no",
  "date_encoded",
  "police_regional_office",
  "police_provincial_office",
  "station",
  "police_community_precinct",
  "region",
  "province",
  "municipality",
  "barangay",
  "street",
  "type_of_place",
  "date_reported",
  "time_reported",
  "date_committed",
  "time_committed",
  "incident_type",
  "iscime", // Note: This maps to isCrime boolean
  "mode_reporting",
  "stage_of_felony",
  "offense",
  "offense_type",
  "section",
  "modus",
  "suspect_motive",
  "suspect_sub_motive",
  "heinous",
  "sensational",
  "threat_grp",
  "grp_affiliation",
  "incident_type_threat_grp",
  "mrs",
  "suspect_is_ego",
  "suspect_ego_position",
  "suspect_ego_class",
  "suspect_count",
  "victim_is_ego",
  "victim_ego_position",
  "victim_ego_class",
  "victim_count",
  "case_status",
  "investigator",
  "head_investigator",
  "lat",
  "lng",
];

interface ColumnValidation {
  found: string[];
  missing: string[];
  extra: string[];
  isValid: boolean;
}

export default function UploadModal({ open, onOpenChange }: UploadModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [validation, setValidation] = useState<ColumnValidation | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Reset state when dialog closes
  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen && !uploading) {
      // Reset all state when closing
      setFile(null);
      setValidation(null);
      setError(null);
      setUploadSuccess(false);
      setUploadProgress(0);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
    onOpenChange(newOpen);
  };

  // Validate Excel file and check columns
  const validateFile = useCallback(async (selectedFile: File) => {
    setError(null);
    setValidation(null);

    // Check file type
    const validTypes = [
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ];
    
    if (!validTypes.includes(selectedFile.type) && !selectedFile.name.match(/\.(xlsx|xls)$/i)) {
      setError("Please upload a valid Excel file (.xlsx or .xls)");
      setFile(null);
      return;
    }

    // Check file size (max 10MB)
    if (selectedFile.size > 10 * 1024 * 1024) {
      setError("File size must be less than 10MB");
      setFile(null);
      return;
    }

    try {
      // Read Excel file
      const data = await selectedFile.arrayBuffer();
      const workbook = XLSX.read(data, { type: "array" });
      const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(firstSheet, { header: 1 }) as any[][];

      if (jsonData.length === 0) {
        setError("Excel file is empty");
        setFile(null);
        return;
      }

      // Get column headers (first row)
      const headers = jsonData[0].map((h: any) => 
        String(h).toLowerCase().trim().replace(/\s+/g, "_")
      );

      // Validate columns
      const found: string[] = [];
      const missing: string[] = [];
      const extra: string[] = [];

      // Check which expected columns are found
      EXPECTED_COLUMNS.forEach((col) => {
        if (headers.includes(col)) {
          found.push(col);
        } else {
          missing.push(col);
        }
      });

      // Check for extra columns
      headers.forEach((header: string) => {
        if (!EXPECTED_COLUMNS.includes(header) && header !== "") {
          extra.push(header);
        }
      });

      // Required columns that must be present
      const requiredColumns = ["barangay", "date_reported", "time_reported", "date_committed", "time_committed", "incident_type"];
      const missingRequired = requiredColumns.filter(col => !headers.includes(col));

      const isValid = missingRequired.length === 0;

      if (!isValid) {
        setError(`Missing required columns: ${missingRequired.join(", ")}`);
      }

      setValidation({
        found,
        missing,
        extra,
        isValid,
      });

      setFile(selectedFile);
    } catch (err) {
      console.error("Error reading Excel file:", err);
      setError("Failed to read Excel file. Please ensure it's a valid Excel file.");
      setFile(null);
    }
  }, []);

  // Handle file drop
  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(false);

      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile) {
        validateFile(droppedFile);
      }
    },
    [validateFile]
  );

  // Handle file selection
  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFile = e.target.files?.[0];
      if (selectedFile) {
        validateFile(selectedFile);
      }
    },
    [validateFile]
  );

  // Handle upload
  const handleUpload = async () => {
    if (!file || !validation?.isValid) return;

    setUploading(true);
    setError(null);
    setUploadProgress(0);

    try {
      const formData = new FormData();
      formData.append("file", file);

      // Simulate progress (since we can't track actual upload progress easily)
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      const response = await fetch("/api/crimes/upload", {
        method: "POST",
        body: formData,
      });

      clearInterval(progressInterval);
      setUploadProgress(100);

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || "Upload failed");
      }

      setUploadSuccess(true);
      setTimeout(() => {
        handleOpenChange(false);
        // Optionally reload the page to show new data
        window.location.reload();
      }, 2000);
    } catch (err) {
      console.error("Upload error:", err);
      setError(err instanceof Error ? err.message : "Failed to upload file");
      setUploadProgress(0);
    } finally {
      setUploading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-2xl bg-[#0F172A] border-white/[0.08] text-white max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Upload Crime Data</DialogTitle>
          <DialogDescription className="text-slate-400">
            Upload an Excel file with crime incident data
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Upload Zone */}
          <div
            onDrop={handleDrop}
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            className={`relative border-2 border-dashed rounded-xl p-8 transition-all duration-200 ${
              isDragging
                ? "border-[#0EA5E9] bg-[#0EA5E9]/5"
                : file
                ? "border-emerald-500/30 bg-emerald-500/5"
                : "border-white/[0.1] hover:border-white/[0.2] bg-white/[0.02]"
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".xlsx,.xls"
              onChange={handleFileSelect}
              className="hidden"
            />

            <div className="flex flex-col items-center text-center">
              {file ? (
                <>
                  <FileSpreadsheet className="h-12 w-12 text-emerald-500 mb-3" />
                  <p className="text-white font-semibold">{file.name}</p>
                  <p className="text-sm text-slate-400 mt-1">
                    {(file.size / 1024).toFixed(2)} KB
                  </p>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setFile(null);
                      setValidation(null);
                      setError(null);
                      if (fileInputRef.current) fileInputRef.current.value = "";
                    }}
                    className="mt-3 text-slate-400 hover:text-white"
                  >
                    Remove file
                  </Button>
                </>
              ) : (
                <>
                  <Upload className="h-12 w-12 text-slate-400 mb-3" />
                  <p className="text-white font-semibold mb-1">
                    Drop your Excel file here
                  </p>
                  <p className="text-sm text-slate-400 mb-4">
                    or click to browse
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    className="bg-[#0EA5E9]/10 border-[#0EA5E9]/20 text-[#0EA5E9] hover:bg-[#0EA5E9]/20 hover:text-[#0EA5E9]"
                  >
                    Select File
                  </Button>
                  <p className="text-xs text-slate-500 mt-3">
                    Supports .xlsx and .xls files (max 10MB)
                  </p>
                </>
              )}
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="flex items-start gap-3 p-4 rounded-lg bg-red-500/10 border border-red-500/20">
              <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-semibold text-red-400">Error</p>
                <p className="text-sm text-red-300 mt-1">{error}</p>
              </div>
            </div>
          )}

          {/* Column Validation */}
          {validation && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                {validation.isValid ? (
                  <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-amber-500" />
                )}
                <h3 className="text-sm font-bold text-white">
                  Column Validation
                </h3>
              </div>

              <div className="grid grid-cols-1 gap-3">
                {/* Found Columns */}
                <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                  <p className="text-xs font-bold text-emerald-400 mb-2">
                    ✓ Found Columns ({validation.found.length})
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {validation.found.slice(0, 10).map((col) => (
                      <span
                        key={col}
                        className="text-xs px-2 py-1 rounded bg-emerald-500/20 text-emerald-300"
                      >
                        {col}
                      </span>
                    ))}
                    {validation.found.length > 10 && (
                      <span className="text-xs px-2 py-1 text-emerald-400">
                        +{validation.found.length - 10} more
                      </span>
                    )}
                  </div>
                </div>

                {/* Missing Columns */}
                {validation.missing.length > 0 && (
                  <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
                    <p className="text-xs font-bold text-amber-400 mb-2">
                      ⚠ Missing Columns ({validation.missing.length})
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {validation.missing.slice(0, 10).map((col) => (
                        <span
                          key={col}
                          className="text-xs px-2 py-1 rounded bg-amber-500/20 text-amber-300"
                        >
                          {col}
                        </span>
                      ))}
                      {validation.missing.length > 10 && (
                        <span className="text-xs px-2 py-1 text-amber-400">
                          +{validation.missing.length - 10} more
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-amber-300 mt-2">
                      Optional columns - data will be imported without these fields
                    </p>
                  </div>
                )}

                {/* Extra Columns */}
                {validation.extra.length > 0 && (
                  <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
                    <p className="text-xs font-bold text-blue-400 mb-2">
                      ℹ Extra Columns ({validation.extra.length})
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {validation.extra.slice(0, 10).map((col) => (
                        <span
                          key={col}
                          className="text-xs px-2 py-1 rounded bg-blue-500/20 text-blue-300"
                        >
                          {col}
                        </span>
                      ))}
                      {validation.extra.length > 10 && (
                        <span className="text-xs px-2 py-1 text-blue-400">
                          +{validation.extra.length - 10} more
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-blue-300 mt-2">
                      These columns will be ignored during import
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Upload Progress */}
          {uploading && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-400">Uploading...</span>
                <span className="text-white font-semibold">{uploadProgress}%</span>
              </div>
              <div className="h-2 bg-white/[0.05] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#0EA5E9] transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* Success Message */}
          {uploadSuccess && (
            <div className="flex items-center gap-3 p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
              <CheckCircle2 className="h-5 w-5 text-emerald-500" />
              <p className="text-sm font-semibold text-emerald-400">
                Upload successful! Refreshing data...
              </p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="ghost"
            onClick={() => handleOpenChange(false)}
            disabled={uploading}
            className="text-slate-400 hover:text-white"
          >
            Cancel
          </Button>
          <Button
            onClick={handleUpload}
            disabled={!file || !validation?.isValid || uploading || uploadSuccess}
            className="bg-[#0EA5E9] text-white hover:bg-[#0EA5E9]/90"
          >
            {uploading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Uploading...
              </>
            ) : uploadSuccess ? (
              <>
                <CheckCircle2 className="h-4 w-4 mr-2" />
                Uploaded
              </>
            ) : (
              <>
                <Upload className="h-4 w-4 mr-2" />
                Upload Data
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
