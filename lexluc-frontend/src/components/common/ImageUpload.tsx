'use client';

import { useState, useRef } from 'react';
import { uploadToCloudinary, getThumbnailUrl } from '@/lib/cloudinary';
import { useToast } from '@/lib/hooks';
import { Button } from './UI';

export function ImageUpload({
  onUpload,
  onError,
  type = 'image',
  preview,
  label = 'Upload Image',
}: {
  onUpload: (url: string) => void;
  onError?: (error: string) => void;
  type?: 'service' | 'tour' | 'blog' | 'image';
  preview?: string;
  label?: string;
}) {
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string>(preview || '');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { error: showError } = useToast();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      const err = 'Please select an image file';
      showError(err);
      onError?.(err);
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      const err = 'Image must be less than 5MB';
      showError(err);
      onError?.(err);
      return;
    }

    try {
      setUploading(true);
      const url = await uploadToCloudinary(file, type);
      setPreviewUrl(url);
      onUpload(url);
    } catch (error: any) {
      const err = error.message || 'Failed to upload image';
      showError(err);
      onError?.(err);
    } finally {
      setUploading(false);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="mb-4">
      <label className="block text-sm font-semibold text-gray-700 mb-2">
        {label}
      </label>
      
      {previewUrl && (
        <div className="mb-4 relative inline-block">
          <img
            src={getThumbnailUrl(previewUrl, 200)}
            alt="Preview"
            className="h-32 w-32 object-cover rounded-lg border-2 border-gray-300"
          />
        </div>
      )}

      <div className="flex gap-2">
        <Button
          type="button"
          onClick={handleClick}
          loading={uploading}
          disabled={uploading}
        >
          {previewUrl ? 'Change Image' : 'Choose Image'}
        </Button>
        {previewUrl && (
          <Button
            type="button"
            variant="ghost"
            onClick={() => {
              setPreviewUrl('');
              if (fileInputRef.current) {
                fileInputRef.current.value = '';
              }
            }}
          >
            Clear
          </Button>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
}

/**
 * Image preview component
 */
export function ImagePreview({
  src,
  alt = 'Preview',
  width = 300,
  height = 300,
}: {
  src: string;
  alt?: string;
  width?: number;
  height?: number;
}) {
  if (!src) {
    return (
      <div
        className="bg-gray-200 rounded-lg flex items-center justify-center"
        style={{ width, height }}
      >
        <span className="text-gray-500">No image</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      className="rounded-lg object-cover"
    />
  );
}
