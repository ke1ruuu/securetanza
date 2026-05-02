"use client";

import React, { useState, useRef, useCallback } from "react";
import { Upload, FileSpreadsheet, CheckCircle2, AlertCircle, Loader2, X, ChevronDown } from "lucide-react";
import * as XLSX from "xlsx";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { VisuallyHidden } from "@/components/ui/visually-hidden";

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
  "is_crime",
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
  "suspect_arrested",
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

    const validTypes = [
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ];
    
    if (!validTypes.includes(selectedFile.type) && !selectedFile.name.match(/\.(xlsx|xls)$/i)) {
      setError("Please upload a valid Excel file (.xlsx or .xls)");
      setFile(null);
      return;
    }

    if (selectedFile.size > 10 * 1024 * 1024) {
      setError("File size must be less than 10MB");
      setFile(null);
      return;
    }

    try {
      const data = await selectedFile.arrayBuffer();
      const workbook = XLSX.read(data, { type: "array" });
      const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(firstSheet, { header: 1 }) as any[][];

      if (jsonData.length === 0) {
        setError("Excel file is empty");
        setFile(null);
        return;
      }

      const headers = jsonData[0].map((h: any) => 
        String(h).toLowerCase().trim().replace(/\s+/g, "_")
      );

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

      // Check for extra columns that don't exist in database
      headers.forEach((header: string) => {
        if (!EXPECTED_COLUMNS.includes(header) && header !== "") {
          extra.push(header);
        }
      });

      // Required columns that must be present
      const requiredColumns = ["barangay", "date_reported", "time_reported", "date_committed", "time_committed", "incident_type"];
      const missingRequired = requiredColumns.filter(col => !headers.includes(col));

      // File is only valid if:
      // 1. All required columns are present
      // 2. No extra columns that don't exist in database
      const isValid = missingRequired.length === 0 && extra.length === 0;

      if (missingRequired.length > 0) {
        setError(`Missing required columns: ${missingRequired.join(", ")}`);
      } else if (extra.length > 0) {
        setError(`File contains invalid columns that don't exist in the database. Please remove: ${extra.slice(0, 5).join(", ")}${extra.length > 5 ? ` and ${extra.length - 5} more` : ""}`);
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

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFile = e.target.files?.[0];
      if (selectedFile) {
        validateFile(selectedFile);
      }
    },
    [validateFile]
  );

  const handleUpload = async () => {
    if (!file || !validation?.isValid) return;

    setUploading(true);
    setError(null);
    setUploadProgress(0);

    try {
      const formData = new FormData();
      formData.append("file", file);

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

      // Save upload log to database
      await fetch('/api/upload-logs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fileName: file.name,
          fileSize: file.size,
          recordsImported: result.recordsImported || 0,
          status: 'success',
        }),
      });

      setUploadSuccess(true);
      setTimeout(() => {
        handleOpenChange(false);
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
      <DialogContent className="!w-[1000px] !h-[800px] !max-w-[1000px] !max-h-[800px] bg-white dark:bg-[#0F172A] border-0 p-0 gap-0 overflow-hidden shadow-2xl flex flex-col">
        <VisuallyHidden>
          <DialogTitle>{file ? "Review Upload" : "Upload Crime Data"}</DialogTitle>
        </VisuallyHidden>
        
        {!file ? (
          // UPLOAD STATE - Centered, Simple
          <div className="flex flex-col items-center justify-center w-full h-full p-16 overflow-y-auto">
            <div
              onDrop={handleDrop}
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onClick={() => fileInputRef.current?.click()}
              className={`w-full max-w-xl border-2 border-dashed rounded-3xl p-20 transition-all duration-300 cursor-pointer ${
                isDragging
                  ? "border-blue-500 bg-blue-50/50 dark:bg-blue-500/5 scale-[1.02]"
                  : "border-slate-200 dark:border-slate-700 hover:border-blue-400 dark:hover:border-blue-600 hover:bg-slate-50/50 dark:hover:bg-slate-800/30"
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx,.xls"
                onChange={handleFileSelect}
                className="hidden"
              />

              <div className="flex flex-col items-center text-center space-y-6">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg">
                  <Upload className="h-10 w-10 text-white" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                    Upload Crime Data
                  </h3>
                  <p className="text-slate-500 dark:text-slate-400">
                    Drop your Excel file here or click to browse
                  </p>
                  <p className="text-sm text-slate-400 dark:text-slate-500">
                    Supports .xlsx and .xls • Maximum 10MB
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          // VALIDATION STATE - Full Layout
          <>
            {/* Header - Fixed */}
            <div className="flex-shrink-0 px-12 py-8 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
                    Review Upload
                  </h2>
                  <p className="text-slate-500 dark:text-slate-400">
                    Verify your data before importing
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setFile(null);
                    setValidation(null);
                    setError(null);
                    if (fileInputRef.current) fileInputRef.current.value = "";
                  }}
                  className="h-10 w-10 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
            </div>

            {/* Content - Scrollable */}
            <div className="flex-1 overflow-y-auto px-12 py-8 space-y-8 min-h-0">
              {/* File Info */}
              <div className="flex items-center gap-4 p-6 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800">
                <div className="w-14 h-14 rounded-xl bg-blue-500 flex items-center justify-center">
                  <FileSpreadsheet className="h-7 w-7 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-slate-900 dark:text-white truncate">
                    {file.name}
                  </p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {(file.size / 1024).toFixed(2)} KB
                  </p>
                </div>
              </div>

              {/* Validation Status */}
              {validation && (
                <>
                  {/* Status Card */}
                  <div className={`p-6 rounded-2xl border-2 ${
                    validation.isValid
                      ? "bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/20"
                      : "bg-red-50 dark:bg-red-500/10 border-red-200 dark:border-red-500/20"
                  }`}>
                    <div className="flex items-start gap-4">
                      {validation.isValid ? (
                        <CheckCircle2 className="h-6 w-6 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
                      ) : (
                        <AlertCircle className="h-6 w-6 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                      )}
                      <div>
                        <h3 className={`font-bold text-lg mb-1 ${
                          validation.isValid
                            ? "text-emerald-900 dark:text-emerald-400"
                            : "text-red-900 dark:text-red-400"
                        }`}>
                          {validation.isValid ? "Ready to Upload" : "Validation Failed"}
                        </h3>
                        <p className={`text-sm ${
                          validation.isValid
                            ? "text-emerald-700 dark:text-emerald-300"
                            : "text-red-700 dark:text-red-300"
                        }`}>
                          {validation.isValid
                            ? "All columns match the database schema"
                            : validation.extra.length > 0
                              ? "Remove invalid columns before uploading"
                              : "Add missing required columns"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-4">
                    <div className="p-6 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20">
                      <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400 mb-1">
                        {validation.found.length}
                      </div>
                      <div className="text-sm font-medium text-emerald-700 dark:text-emerald-300">
                        Valid Columns
                      </div>
                    </div>

                    <div className="p-6 rounded-xl bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20">
                      <div className="text-3xl font-bold text-amber-600 dark:text-amber-400 mb-1">
                        {validation.missing.length}
                      </div>
                      <div className="text-sm font-medium text-amber-700 dark:text-amber-300">
                        Optional
                      </div>
                    </div>

                    <div className="p-6 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20">
                      <div className="text-3xl font-bold text-red-600 dark:text-red-400 mb-1">
                        {validation.extra.length}
                      </div>
                      <div className="text-sm font-medium text-red-700 dark:text-red-300">
                        Invalid
                      </div>
                    </div>
                  </div>

                  {/* Column Details */}
                  <Accordion type="multiple" className="space-y-3">
                    {/* Valid Columns */}
                    <AccordionItem value="found" className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden bg-white dark:bg-slate-900/50">
                      <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-slate-50 dark:hover:bg-slate-800/50">
                        <div className="flex items-center gap-3 w-full">
                          <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                          <span className="font-semibold text-slate-900 dark:text-white">Valid Columns</span>
                          <span className="ml-auto text-sm text-slate-500 dark:text-slate-400 mr-2">
                            {validation.found.length}
                          </span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="px-6 pb-4">
                        <div className="flex flex-wrap gap-2 pt-2">
                          {validation.found.map((col) => (
                            <span
                              key={col}
                              className="text-xs px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-500/20 font-medium"
                            >
                              {col}
                            </span>
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>

                    {/* Optional Columns */}
                    {validation.missing.length > 0 && (
                      <AccordionItem value="missing" className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden bg-white dark:bg-slate-900/50">
                        <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-slate-50 dark:hover:bg-slate-800/50">
                          <div className="flex items-center gap-3 w-full">
                            <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                            <span className="font-semibold text-slate-900 dark:text-white">Optional Columns</span>
                            <span className="ml-auto text-sm text-slate-500 dark:text-slate-400 mr-2">
                              {validation.missing.length}
                            </span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="px-6 pb-4 space-y-3">
                          <p className="text-sm text-amber-700 dark:text-amber-300">
                            These columns are not required. Data will be imported without them.
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {validation.missing.map((col) => (
                              <span
                                key={col}
                                className="text-xs px-3 py-1.5 rounded-lg bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-500/20 font-medium"
                              >
                                {col}
                              </span>
                            ))}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    )}

                    {/* Invalid Columns */}
                    {validation.extra.length > 0 && (
                      <AccordionItem value="extra" className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden bg-white dark:bg-slate-900/50">
                        <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-slate-50 dark:hover:bg-slate-800/50">
                          <div className="flex items-center gap-3 w-full">
                            <X className="h-5 w-5 text-red-600 dark:text-red-400" />
                            <span className="font-semibold text-slate-900 dark:text-white">Invalid Columns</span>
                            <span className="ml-auto text-sm text-slate-500 dark:text-slate-400 mr-2">
                              {validation.extra.length}
                            </span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="px-6 pb-4 space-y-3">
                          <p className="text-sm text-red-700 dark:text-red-300 font-medium">
                            ⚠️ These columns don't exist in the database. Remove them from your file.
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {validation.extra.map((col) => (
                              <span
                                key={col}
                                className="text-xs px-3 py-1.5 rounded-lg bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-500/20 font-medium"
                              >
                                {col}
                              </span>
                            ))}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    )}
                  </Accordion>
                </>
              )}

              {/* Error Message */}
              {error && (
                <div className="flex items-start gap-3 p-4 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20">
                  <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-700 dark:text-red-300 font-medium">
                    {error}
                  </p>
                </div>
              )}

              {/* Upload Progress */}
              {uploading && (
                <div className="space-y-3 p-6 rounded-xl bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Loader2 className="h-5 w-5 text-blue-600 dark:text-blue-400 animate-spin" />
                      <span className="font-semibold text-blue-900 dark:text-blue-400">
                        Uploading...
                      </span>
                    </div>
                    <span className="text-sm font-bold text-blue-600 dark:text-blue-400">
                      {uploadProgress}%
                    </span>
                  </div>
                  <div className="h-2 bg-blue-100 dark:bg-blue-900/30 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500 transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Success Message */}
              {uploadSuccess && (
                <div className="flex items-center gap-3 p-4 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                  <p className="text-sm font-semibold text-emerald-900 dark:text-emerald-400">
                    Upload successful! Refreshing data...
                  </p>
                </div>
              )}
            </div>

            {/* Footer - Fixed */}
            <div className="flex-shrink-0 px-12 py-6 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
              <div className="flex items-center justify-end gap-3">
                <Button
                  variant="ghost"
                  onClick={() => handleOpenChange(false)}
                  disabled={uploading}
                  className="px-6"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleUpload}
                  disabled={!file || !validation?.isValid || uploading || uploadSuccess}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 disabled:opacity-50"
                >
                  {uploading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Uploading
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
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
