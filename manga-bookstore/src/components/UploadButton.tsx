import { useState, useRef } from "react";

import { useUploadThing } from "@/lib/uploadthing";
import { Button } from "@/components/ui/button";
import { ImageIcon, Loader2 } from "lucide-react";

interface ImageUploadProps {
  onUploadComplete: (url: string) => void;
  onUploadError: (error: Error) => void;
}

export function CustomUploadButton({ onUploadComplete, onUploadError }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const { startUpload } = useUploadThing("mangaImage", {
    onClientUploadComplete: (res) => {
      setIsUploading(false);
      if (res?.[0]?.url) {
        onUploadComplete(res[0].url);
      }
    },
    onUploadError: (error) => {
      setIsUploading(false);
      onUploadError(error);
    },
    onUploadProgress: () => {
      setIsUploading(true);
    },
  });

  const onClick = () => {
    inputRef.current?.click();
  };

  const onChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    await startUpload([file]);
    
    // Clear input value so the same file can be uploaded again if needed
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={onChange}
        className="hidden"
      />
      <Button 
        onClick={onClick}
        disabled={isUploading}
        className="w-full"
      >
        {isUploading ? (
          <div className="flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Uploading...</span>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <ImageIcon className="h-4 w-4" />
            <span>Upload Cover Image</span>
          </div>
        )}
      </Button>
    </div>
  );
}