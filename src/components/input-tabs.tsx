"use client";

import Image from "next/image";
import type * as React from "react";
import { FileText, ImageIcon, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { cn, formatFileSize } from "@/lib/utils";

export type InputMode = "text" | "pdf" | "image";

interface InputTabsProps {
  mode: InputMode;
  text: string;
  file: File | null;
  imagePreview: string | null;
  onModeChange: (mode: InputMode) => void;
  onTextChange: (value: string) => void;
  onFilePick: (file: File) => void;
  onRemoveFile: () => void;
}

export function InputTabs({
  mode,
  text,
  file,
  imagePreview,
  onModeChange,
  onTextChange,
  onFilePick,
  onRemoveFile,
}: InputTabsProps) {
  return (
    <Tabs value={mode} onValueChange={(value) => onModeChange(value as InputMode)}>
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="text">
          <FileText className="size-4" />
          <span className="hidden sm:inline">Paste text</span>
          <span className="sm:hidden">Text</span>
        </TabsTrigger>
        <TabsTrigger value="pdf">
          <Upload className="size-4" />
          PDF
        </TabsTrigger>
        <TabsTrigger value="image">
          <ImageIcon className="size-4" />
          Image
        </TabsTrigger>
      </TabsList>

      <TabsContent value="text">
        <label htmlFor="report-text" className="sr-only">
          Paste report text
        </label>
        <Textarea
          id="report-text"
          value={text}
          onChange={(event) => onTextChange(event.target.value)}
          className="min-h-72 resize-y"
          placeholder="Paste your medical report here. Example: Complete Blood Count, Hemoglobin: 14.2 g/dL (Ref: 13.0-17.0)..."
        />
        <div className="mt-2 text-right text-xs text-muted-foreground">
          {text.trim().length} characters
        </div>
      </TabsContent>

      <TabsContent value="pdf">
        <FileDropzone
          accept="application/pdf"
          file={file}
          title="Upload a PDF report"
          description="Drag and drop a PDF here, or browse your files. Maximum 25 MB."
          onFilePick={onFilePick}
          onRemoveFile={onRemoveFile}
        />
      </TabsContent>

      <TabsContent value="image">
        <FileDropzone
          accept="image/jpeg,image/png,image/webp"
          file={file}
          imagePreview={imagePreview}
          title="Upload a report photo"
          description="Use JPG, PNG, or WebP. Maximum 5 MB."
          onFilePick={onFilePick}
          onRemoveFile={onRemoveFile}
        />
      </TabsContent>
    </Tabs>
  );
}

interface FileDropzoneProps {
  accept: string;
  file: File | null;
  imagePreview?: string | null;
  title: string;
  description: string;
  onFilePick: (file: File) => void;
  onRemoveFile: () => void;
}

function FileDropzone({
  accept,
  file,
  imagePreview,
  title,
  description,
  onFilePick,
  onRemoveFile,
}: FileDropzoneProps) {
  const inputId = `file-${accept.replace(/[^a-z]/gi, "-")}`;

  function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    const selected = event.target.files?.[0];
    if (selected) onFilePick(selected);
    event.target.value = "";
  }

  function handleDrop(event: React.DragEvent<HTMLLabelElement>) {
    event.preventDefault();
    const selected = event.dataTransfer.files?.[0];
    if (selected) onFilePick(selected);
  }

  return (
    <div className="space-y-4">
      <label
        htmlFor={inputId}
        onDragOver={(event) => event.preventDefault()}
        onDrop={handleDrop}
        className={cn(
          "flex min-h-72 cursor-pointer flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-border bg-secondary/70 p-8 text-center transition-colors hover:bg-secondary",
          file && "border-[var(--color-accent-teal)] bg-[var(--color-accent-teal-soft)]/60",
        )}
      >
        <input
          id={inputId}
          type="file"
          accept={accept}
          className="sr-only"
          onChange={handleInputChange}
        />
        <span className="medical-icon-surface flex size-14 items-center justify-center rounded-full text-white">
          <Upload className="size-6" />
        </span>
        <div>
          <p className="font-semibold">{title}</p>
          <p className="mt-1 max-w-md text-sm leading-relaxed text-muted-foreground">
            {description}
          </p>
        </div>
        <Button type="button" variant="secondary" size="sm">
          Browse files
        </Button>
      </label>

      {file ? (
        <div className="flex items-center justify-between gap-4 rounded-2xl border border-border bg-card p-4">
          <div className="flex min-w-0 items-center gap-3">
            {imagePreview ? (
              <Image
                src={imagePreview}
                alt="Selected report preview"
                width={64}
                height={64}
                className="size-16 rounded-xl object-cover"
                unoptimized
              />
            ) : (
              <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-secondary">
                <FileText className="size-5 text-[var(--color-accent-teal)]" />
              </span>
            )}
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">{file.name}</p>
              <p className="text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
            </div>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label="Remove selected file"
            onClick={onRemoveFile}
          >
            <X className="size-4" />
          </Button>
        </div>
      ) : null}
    </div>
  );
}
