'use client'
import { IKUpload } from "imagekitio-next"
import { IKUploadResponse } from "imagekitio-next/dist/types/components/IKUpload/props"
import { set } from "mongoose"
import { useState } from "react"
const FileUpload = ({ onSuccess }: {onSuccess:(response:IKUploadResponse)=>void}) => {
    const [uploading, setUploading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const onError = (error:{message: string}) => {
        setError(error.message);
        setUploading(false);
    }

    const handleSuccess = (response: IKUploadResponse) => {
        setUploading(false);
        setError(null);
        onSuccess(response);
    }
    const handleStartUpload = () => {
        setUploading(true);
        setError(null);
    }
  return (
    <div className="w-full">
      <IKUpload
        fileName="product_image.png"
        className="w-full"
        onError={onError}
        onSuccess={handleSuccess}
        onUploadStart={handleStartUpload}
        validateFile={(file:File) => {
            const validTypes = ["image/jpeg", "image/png", "image/jpg","imae/webp"];
            if(!validTypes.includes(file.type)){
                setError("Invalid file type. Please upload a valid image file");
                return false;
            }
            if(file.size > 1024 * 1024 * 5){
                setError("File size exceeds 5MB. Please upload a smaller file");
                return false
            }
            return true;
        }}
        />
        {uploading && <p className="text-sm">Uploading...</p>}

        {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  )
}

export default FileUpload
