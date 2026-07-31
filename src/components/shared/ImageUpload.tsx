"use client";

import { ChangeEvent, useRef, useState } from "react";
import Image from "next/image";
import {
  Camera,
  ImagePlus,
  Loader2,
  Trash2,
} from "lucide-react";

import { uploadImageToCloudinary } from "@/lib/cloudinary";

interface ImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
  onRemove?: () => void;
  disabled?: boolean;
}

export default function ImageUpload({
  value,
  onChange,
  onRemove,
  disabled = false,
}: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const [uploading, setUploading] =
    useState(false);

  const [error, setError] = useState("");

  const handleFileChange = async (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setError("");

    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Image size must be less than 5MB.");
      return;
    }

    try {
      setUploading(true);

      const imageUrl =
        await uploadImageToCloudinary(file);

      onChange(imageUrl);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Image upload failed.",
      );
    } finally {
      setUploading(false);

      if (inputRef.current) {
        inputRef.current.value = "";
      }
    }
  };

  const handleRemove = () => {
    onRemove?.();

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-3">
      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        onChange={handleFileChange}
        disabled={disabled || uploading}
        className="hidden"
      />

      {value ? (
        <div className="relative overflow-hidden rounded-3xl border border-border/70 bg-muted">
          <div className="relative aspect-[16/10] w-full">
            <Image
              src={value}
              alt="Selected profile image"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 500px"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() =>
                  inputRef.current?.click()
                }
                disabled={disabled || uploading}
                className="inline-flex h-10 items-center gap-2 rounded-xl border border-white/20 bg-black/50 px-4 text-sm font-medium text-white backdrop-blur-md transition hover:bg-black/70 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Camera className="size-4" />
                Change
              </button>

              <button
                type="button"
                onClick={handleRemove}
                disabled={disabled || uploading}
                className="flex size-10 items-center justify-center rounded-xl border border-white/20 bg-black/50 text-white backdrop-blur-md transition hover:bg-red-500/80 disabled:cursor-not-allowed disabled:opacity-50"
                aria-label="Remove image"
              >
                <Trash2 className="size-4" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() =>
            inputRef.current?.click()
          }
          disabled={disabled || uploading}
          className="group relative flex w-full flex-col items-center justify-center overflow-hidden rounded-3xl border border-dashed border-border/80 bg-muted/30 px-6 py-10 text-center transition-all duration-300 hover:border-primary/40 hover:bg-primary/5 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <div className="flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-transform duration-300 group-hover:scale-110">
            {uploading ? (
              <Loader2 className="size-6 animate-spin" />
            ) : (
              <ImagePlus className="size-6" />
            )}
          </div>

          <p className="mt-4 text-sm font-semibold">
            {uploading
              ? "Uploading image..."
              : "Add profile image"}
          </p>

          <p className="mt-1 text-xs text-muted-foreground">
            PNG, JPG or WEBP · Maximum 5MB
          </p>
        </button>
      )}

      {error && (
        <p className="text-xs font-medium text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}