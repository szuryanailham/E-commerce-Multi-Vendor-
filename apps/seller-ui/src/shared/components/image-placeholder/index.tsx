import { Pencil, WandSparkles, X } from 'lucide-react';
import Image from 'next/image';
import React, { useState } from 'react';

const ImagePlaceHolder = ({
  size,
  small,
  onImageChange,
  onRemove,
  pictureUploadingLoader,
  defaultImage = null,
  index = null,
  setSelectedImage,
  setOpenImageModal,
  images,
}: {
  size: string;
  small?: boolean;
  pictureUploadingLoader: boolean;
  onImageChange: (file: File | null, index: number) => void;
  onRemove?: (index: number) => void;
  defaultImage?: string | null;
  setSelectedImage: (e: string) => void;
  setOpenImageModal: (openImageModal: boolean) => void;
  index?: any;
  images: any;
}) => {
  const [imagePreview, setImagePreview] = useState<string | null>(defaultImage);
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
      onImageChange(file, index!);
    }
  };

  return (
    <div
      className={`relative w-full ${
        small ? 'h-[180px]' : 'h-[450px]'
      } cursor-pointer bg-[#1e1e1e] border border-gray-600 rounded-lg flex flex-col justify-center items-center`}
    >
      <input
        type="file"
        accept="image/*"
        className="hidden"
        id={`image-upload-${index}`}
        onChange={handleFileChange}
      />

      {/* Tampilkan image jika ada */}
      <div
        className={`relative w-full ${
          small ? 'h-[180px]' : 'h-[450px]'
        } cursor-pointer bg-[#1e1e1e] border border-gray-600 rounded-lg flex flex-col justify-center items-center`}
      >
        {/* LOADING OVERLAY */}
        {pictureUploadingLoader && (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/50 rounded-lg">
            <div className="flex flex-col items-center gap-2">
              <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span className="text-xs text-white">Uploading...</span>
            </div>
          </div>
        )}

        {/* IMAGE / PLACEHOLDER */}
        {imagePreview ? (
          <Image
            width={400}
            height={300}
            src={imagePreview}
            alt="uploaded"
            className="absolute inset-0 w-full h-full object-cover rounded-lg"
          />
        ) : (
          <>
            <p
              className={`text-gray-400 ${
                small ? 'text-xl' : 'text-4xl'
              } font-semibold`}
            >
              {size}
            </p>
            <p
              className={`text-gray-500 ${
                small ? 'text-sm' : 'text-lg'
              } pt-2 text-center`}
            >
              Please choose an image <br />
              according to the expected ratio
            </p>
          </>
        )}
      </div>

      {/* Tombol action */}
      {imagePreview ? (
        <>
          <button
            disabled={pictureUploadingLoader}
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onRemove?.(index!);
            }}
            className="absolute top-3 right-3 p-2 !rounded bg-red-600 shadow-lg"
          >
            <X size={16} />
          </button>

          <button
            disabled={pictureUploadingLoader}
            type="button"
            className="absolute top-3 right-[70px] p-2 !rounded bg-blue-500 shadow-lg cursor-pointer"
            onClick={() => {
              setOpenImageModal(true);
              setSelectedImage(images[index].file_url);
            }}
          >
            <WandSparkles size={16} />
          </button>
        </>
      ) : (
        <label
          htmlFor={`image-upload-${index}`}
          className="absolute top-3 right-3 p-2 !rounded bg-slate-700 shadow-lg cursor-pointer"
        >
          <Pencil />
        </label>
      )}
    </div>
  );
};

export default ImagePlaceHolder;
