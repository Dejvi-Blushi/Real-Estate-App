"use client";

import {X} from "lucide-react";
import {Button} from "@/components/ui/button";

function ImagePreviewItem({
  file,
  onRemove
}: {
  file: File;
  onRemove: () => void;
}) {
  const url = URL.createObjectURL(file);

  return (
    <div className="relative group w-24 h-24 rounded-lg overflow-hidden border border-border">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={url}
        alt={file.name}
        className="w-full h-full object-cover"
        onLoad={() => URL.revokeObjectURL(url)}
      />
      <Button
        type="button"
        size="icon"
        onClick={onRemove}
        className="absolute top-1 right-1 h-6 w-6 bg-background/30"
      >
        <X className="w-4 h-4" />
      </Button>
    </div>
  );
}

export default function ImagePreviewGrid({
  files,
  onRemove
}: {
  files: File[];
  onRemove: (index: number) => void;
}) {
  if (files.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-3">
      {files.map((file, index) => (
        <ImagePreviewItem
          key={index}
          file={file}
          onRemove={() => onRemove(index)}
        />
      ))}
    </div>
  );
}
