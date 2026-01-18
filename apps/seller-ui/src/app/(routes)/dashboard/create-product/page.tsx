'use client';
import ImagePlaceHolder from '@/shared/components/image-placeholder';
import { ChevronsRight } from 'lucide-react';
// import { CostumSpecifications } from '@e-commerce-multi-vendor/components';
// import CostumSpecifications from '@e-commerce-multi-vendor/components/costum-specifications';
// import CostumProperties from '@e-commerce-multi-vendor/components/costum-properties';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import Input from '@/shared/components/components-ui/Input';
// import ColorSelector from '@e-commerce-multi-vendor/';
const Page = () => {
  const {
    register,
    control,
    watch,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [openImageModal, setOpenImageModal] = useState(false);
  const [isChanged, setIsChanged] = useState(false);
  const [images, setImages] = useState<(File | null)[]>([null]);
  const [loading, setLoading] = useState(false);
  const onSubmit = (data: any) => {
    console.log(data);
  };

  const handleImageChange = (file: File | null, index: number) => {
    const updatedImages = [...images];

    updatedImages[index] = file;

    if (index === images.length - 1 && images.length < 8) {
      updatedImages.push(null);
    }

    setImages(updatedImages);

    setValue('images', updatedImages);
  };

  const handleRemoveImage = (index: number) => {
    setImages((prevImages) => {
      let updatedImages = [...prevImages];
      if (index === -1) {
        updatedImages[0] = null;
      } else {
        updatedImages.splice(index, 1);
      }
      if (!updatedImages.includes(null) && updatedImages.length < 8) {
        updatedImages.push(null);
      }
      setValue('images', updatedImages);
      return updatedImages;
    });
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full mx-auto p-8 shadow-md rounded-lg text-white"
    >
      {/* Heading & Breadcrumbs */}
      <h2 className="text-2xl py-2 font-semibold font-Poppins text-white">
        Create Product
      </h2>
      <div className="flex items-center">
        <span className="text-[#8oDeea] cursor-pointer">Dashboard</span>
        <ChevronsRight size={20} className="opacity-[.8]" />
        <span>Create Product</span>
      </div>

      {/* Content Layouts */}
      <div className="py-4 w-full flex gap-6">
        {/* Left side - Image upload section */}
        <div className="md:w-[35%]">
          {images?.length > 0 && (
            <ImagePlaceHolder
              setOpenImageModal={setOpenImageModal}
              size="765 * 850"
              small={false}
              index={0}
              onImageChange={handleImageChange}
              onRemove={handleRemoveImage}
            />
          )}
          <div className="grid grid-cols-2 gap-3 mt-4">
            {images.slice(1).map((_, index) => (
              <ImagePlaceHolder
                setOpenImageModal={setOpenImageModal}
                size="765 * 850"
                key={index}
                small
                index={index + 1}
                onImageChange={handleImageChange}
                onRemove={handleRemoveImage}
              />
            ))}
          </div>
        </div>

        <div className="md:w-[65%]">
          <div className="w-full flex gap-6">
            {/* product title Input */}
            <div className="w-2/4">
              <Input
                label="Product Title"
                placeholder="Enter Product title"
                {...register('title', { required: 'Title is required' })}
              />
              {errors.title && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.title.message as string}
                </p>
              )}

              {/* product description */}
              <div className="mt-2">
                <Input
                  type="textarea"
                  rows={7}
                  cols={10}
                  label="Short Description * (Max 150 words)"
                  placeholder="Enter Product description for quick view"
                  {...register('description', {
                    required: 'Description is required',
                    validate: (value) => {
                      const wordCount = value.trim().split(/\s+/).length;
                      return (
                        wordCount <= 150 ||
                        `Description cannot exceed 150 words (Current: ${wordCount})`
                      );
                    },
                  })}
                />
                {errors.description && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.description.message as string}
                  </p>
                )}
              </div>

              {/* product Tags */}
              <div className="mt-2">
                <Input
                  label="Tags *"
                  placeholder="apple flagship"
                  {...register('tags', {
                    required: 'Seperate related products tags with a coma',
                  })}
                />
                {errors.tags && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.tags.message as string}
                  </p>
                )}
              </div>

              {/* product Waranty */}
              <div className="mt-2">
                <Input
                  label="Waranty"
                  placeholder="1 Year / No Warranty"
                  {...register('warranty', {
                    required: 'warranty is required',
                  })}
                />

                {errors.warranty && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.warranty.message as string}
                  </p>
                )}
              </div>

              {/* product slug */}
              <div className="mt-2">
                <Input
                  type="text"
                  label="Slug *"
                  placeholder="e.g. iphone-15-pro"
                  {...register('slug', {
                    required: 'Slug is required',
                    minLength: {
                      value: 3,
                      message: 'Slug must be at least 3 characters',
                    },
                    maxLength: {
                      value: 50,
                      message: 'Slug cannot exceed 50 characters',
                    },
                    pattern: {
                      value: /^[a-z0-9-]+$/,
                      message:
                        'Slug can only contain lowercase letters, numbers, and hyphens',
                    },
                    validate: (value) => {
                      if (value.startsWith('-') || value.endsWith('-')) {
                        return 'Slug cannot start or end with a hyphen (-)';
                      }

                      if (value.includes('--')) {
                        return 'Slug cannot contain double hyphens (--)';
                      }

                      if (/^\d+$/.test(value)) {
                        return 'Slug cannot be numbers only';
                      }

                      if (/^[a-z]+$/.test(value)) {
                        return 'Slug must contain at least one number';
                      }

                      return true;
                    },
                  })}
                />

                {errors.slug && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.slug.message as string}
                  </p>
                )}
              </div>

              {/* product brand */}
              <div className="mt-2">
                <Input
                  label="Brand"
                  placeholder="Apple"
                  {...register('Brand', {
                    required: 'warranty is required',
                  })}
                />

                {errors.Brands && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.Brands.message as string}
                  </p>
                )}
              </div>

              {/* Color selector */}
              {/* <div className="mt-2">
                <ColorSelector control={control} errors={errors} />
              </div>

              <div className="mt-2">
                <CostumSpecifications control={control} errors={errors} />
              </div>

              <div className="mt-2">
                <CostumProperties control={control} errors={errors} />
              </div> */}

              <div className="mt-2">
                <label className="block font-semibold text-gray-300 mb-1">
                  Cash On Delivery *
                </label>
                <select
                  {...register('cash_on_delivery', {
                    required: 'Cash on Delivery is required',
                  })}
                  className="
                      w-full 
                      bg-black 
                      text-white 
                      border border-gray-700 
                      rounded-md 
                      p-2 
                      outline-none 
                      transition
                      hover:border-blue-500 
                      hover:ring-1 
                      hover:ring-blue-500
                      focus:border-blue-500 
                      focus:ring-2 
                      focus:ring-blue-500
                    "
                >
                  <option value="" disabled className="bg-black text-gray-500">
                    Select option
                  </option>
                  <option value="yes" className="bg-black text-white">
                    Yes
                  </option>
                  <option value="no" className="bg-black text-white">
                    No
                  </option>
                </select>
              </div>
            </div>
            {/*Product categories  */}
            <div className="w-2/4">
              <label className="block font-semibold text-gray-300 mb-1">
                Category*
              </label>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};

export default Page;
