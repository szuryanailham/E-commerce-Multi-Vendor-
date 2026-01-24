'use client';
import ImagePlaceHolder from '@/shared/components/image-placeholder';
import { ChevronsRight, Wand, X } from 'lucide-react';
import CostumSpecifications from '@/shared/components/components-ui/costum-specifications';
import CostumProperties from '@/shared/components/components-ui/costum-properties';
import React, { useEffect, useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import Input from '@/shared/components/components-ui/Input';
import ColorSelector from '@/shared/components/components-ui/color-selector';
import RichTextEditor from '@/shared/components/components-ui/rich-text-editor';
import { useQuery } from '@tanstack/react-query';
import axiosInstance from '@/utils/axiosInstance';
import SizeSelector from '@/shared/components/components-ui/size-selector';
import Image from 'next/image';
import { enhancements } from '@/utils/AI.enhancement';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

interface UploadedImage {
  fileId: string;
  file_url: string;
}

const Page = () => {
  const {
    register,
    control,
    setValue,
    watch,
    getValues,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [openImageModal, setOpenImageModal] = useState(false);
  const [isChanged, setIsChanged] = useState(true);
  const [pictureUploudingLoader, setPictureUploudingLoader] = useState(false);
  const [images, setImages] = useState<(UploadedImage | null)[]>([null]);
  const [selectedImage, setselectedImage] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeEffect, setactiveEffect] = useState<string | null>(null);
  const [processing, setprocessing] = useState(false);
  const router = useRouter();
  const { data, isLoading, isError } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      try {
        const res = await axiosInstance.get('/product/api/get-categories');
        return res.data;
      } catch (error) {
        console.log(error);
      }
    },
    staleTime: 1000 * 60 * 5,
    retry: 2,
  });

  const { data: discountCodes = [], isLoading: discountLoading } = useQuery({
    queryKey: ['shop-discounts'],
    queryFn: async () => {
      const res = await axiosInstance.get('/product/api/get-discount-codes');
      return res?.data?.discount_codes || [];
    },
  });

  const categories = data?.categories || [];
  const subCategoriesData = data?.subCategories || {};

  const selectedCategory = watch('category');
  const regularPrice = watch('regular_price');

  const subcategories = useMemo(() => {
    return selectedCategory ? subCategoriesData[selectedCategory] || [] : [];
  }, [selectedCategory, subCategoriesData]);

  const onSubmit = async (data: any) => {
    console.log(data);
    try {
      setLoading(true);
      await axiosInstance.post('/product/api/create-product', data);
      router.push('/dashboard/all-products');
    } catch (error: any) {
      toast.error(error?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  const convertFiletoBase64 = (file: File) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleImageChange = async (file: File | null, index: number) => {
    if (!file) return;
    setPictureUploudingLoader(true);
    try {
      const fileName = await convertFiletoBase64(file);
      const response = await axiosInstance.post(
        '/product/api/uploud-product-image',
        { fileName },
      );

      const uploadedImage: UploadedImage = {
        fileId: response.data.fileId,
        file_url: response.data.file_url,
      };

      const updateImages = [...images];
      updateImages[index] = uploadedImage;

      if (index === images.length - 1 && updateImages.length < 8) {
        updateImages.push(null);
      }

      setImages(updateImages);
      setValue('images', updateImages);
    } catch (error) {
      console.log(error);
    } finally {
      setPictureUploudingLoader(false);
    }
  };

  const handleRemoveImage = async (index: number) => {
    try {
      const updatedImages = [...images];
      const imageToDelete = updatedImages[index];
      if (imageToDelete && typeof imageToDelete === 'object') {
        await axiosInstance.delete('/product/api/delete-product-image', {
          data: {
            fileId: imageToDelete.fileId!,
          },
        });
      }
      updatedImages.splice(index, 1);
      if (!updatedImages.includes(null) && updatedImages.length < 8) {
        updatedImages.push(null);
      }
      setImages(updatedImages);
      setValue('images', updatedImages);
    } catch (error) {
      console.log(error);
    }
  };

  const applyTransformation = (transformation: string) => {
    if (!selectedImage || processing) return;

    setprocessing(true);
    setactiveEffect(transformation);

    const transformedUrl = `${selectedImage}?tr=${transformation}&t=${Date.now()}`;
    setselectedImage(transformedUrl);
  };

  const handleSaveDraft = () => {
    console.log('Save draft clicked');
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
              images={images}
              pictureUploadingLoader={pictureUploudingLoader}
              index={0}
              onImageChange={handleImageChange}
              setSelectedImage={setselectedImage}
              onRemove={handleRemoveImage}
            />
          )}
          <div className="grid grid-cols-2 gap-3 mt-4">
            {images.slice(1).map((_, index) => (
              <ImagePlaceHolder
                setOpenImageModal={setOpenImageModal}
                size="765 * 850"
                images={images}
                key={index}
                pictureUploadingLoader={pictureUploudingLoader}
                small
                setSelectedImage={setselectedImage}
                index={index + 1}
                onImageChange={handleImageChange}
                onRemove={handleRemoveImage}
              />
            ))}
          </div>
        </div>

        <div className="md:w-[65%]">
          <div className="w-full flex gap-6">
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

              <div className="mt-2">
                <Input
                  type="textarea"
                  rows={7}
                  cols={10}
                  label="Short Description * (Max 150 words)"
                  placeholder="Enter Product description for quick view"
                  {...register('short_description', {
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

              <div className="mt-2">
                <Input
                  label="Brand"
                  placeholder="Apple"
                  {...register('brand', {
                    required: 'warranty is required',
                  })}
                />

                {errors.brand && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.brand.message as string}
                  </p>
                )}
              </div>

              <div className="mt-2">
                <ColorSelector control={control} errors={errors} />
              </div>

              <div className="mt-2">
                <CostumSpecifications control={control} errors={errors} />
              </div>

              <div className="mt-2">
                <CostumProperties control={control} errors={errors} />
              </div>

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

            <div className="w-2/4">
              <label className="block font-semibold text-gray-300 mb-1">
                Category *
              </label>

              {isLoading ? (
                <p className="text-gray-400">Loading Categories....</p>
              ) : isError ? (
                <p className="text-red-500">Failed to load categories</p>
              ) : (
                <Controller
                  name="category"
                  control={control}
                  rules={{ required: 'Category is required' }}
                  render={({ field }) => (
                    <select
                      {...field}
                      className="
                        w-full
                        px-3 py-2
                        rounded-md
                        border border-gray-700
                        bg-gray-900
                        text-gray-200
                        outline-none
                        transition-all
                        focus:border-blue-500
                        focus:ring-1
                        focus:ring-blue-500
                        hover:border-blue-400"
                    >
                      <option value="" className="bg-black hover:bg-blue-600">
                        Select Category
                      </option>

                      {categories.map((category: string) => (
                        <option
                          key={category}
                          value={category}
                          className="bg-black hover:bg-blue-600"
                        >
                          {category}
                        </option>
                      ))}
                    </select>
                  )}
                />
              )}

              {errors.category && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.category.message as string}
                </p>
              )}

              <div className="mt-2">
                <label className="block font-semibold text-gray-300 mb-1">
                  Subcategory *
                </label>

                {isLoading ? (
                  <p className="text-gray-400">Loading Subcategories....</p>
                ) : isError ? (
                  <p className="text-red-500">Failed to load subcategories</p>
                ) : (
                  <Controller
                    name="subcategory"
                    control={control}
                    rules={{ required: 'Subcategory is required' }}
                    render={({ field }) => (
                      <select
                        {...field}
                        className="
                                w-full
                                px-3 py-2
                                rounded-md
                                border border-gray-700
                                bg-gray-900
                                text-gray-200
                                outline-none
                                transition-all
                                focus:border-blue-500
                                focus:ring-1
                                focus:ring-blue-500
                                hover:border-blue-400
                                "
                      >
                        <option value="" className="bg-black hover:bg-blue-600">
                          Select Subcategory
                        </option>

                        {subcategories.map((subcategory: string) => (
                          <option
                            key={subcategory}
                            value={subcategory}
                            className="bg-black hover:bg-blue-600"
                          >
                            {subcategory}
                          </option>
                        ))}
                      </select>
                    )}
                  />
                )}

                {errors.subcategory && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.subcategory.message as string}
                  </p>
                )}
              </div>

              <div className="mt-2 mb-6">
                <Controller
                  name="detail_description"
                  control={control}
                  rules={{
                    validate: (value = '') => {
                      // Hilangkan tag HTML
                      const plainText = value
                        .replace(/<[^>]+>/g, '')
                        .replace(/&nbsp;/g, ' ')
                        .trim();

                      if (!plainText) {
                        return 'Detailed description is required';
                      }

                      return true;
                    },
                  }}
                  render={({ field }) => (
                    <RichTextEditor
                      content={field.value}
                      onContentChange={field.onChange}
                    />
                  )}
                />

                {errors.detail_description && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.detail_description.message as string}
                  </p>
                )}
              </div>

              <div className="mt-2">
                <Input
                  type="text"
                  label="Embed URL"
                  placeholder="Enter YouTube embed URL"
                  {...register('embed_url', {
                    validate: (value) => {
                      if (!value) return true;
                      const youtubeRegex =
                        /^(https?:\/\/)?(www\.)?(youtube\.com\/(watch\?v=|embed\/)|youtu\.be\/)[\w-]{11}(\S*)?$/;

                      return (
                        youtubeRegex.test(value) ||
                        'URL harus berasal dari YouTube (embed / watch / youtu.be)'
                      );
                    },
                  })}
                />
                {errors.embed_url && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.embed_url.message as string}
                  </p>
                )}
              </div>

              <div className="mt-2">
                <Input
                  type="number"
                  label="Regular Price *"
                  placeholder="Enter regular price"
                  min={0}
                  step="0.01"
                  {...register('regular_price', {
                    required: 'Regular price is required',
                    valueAsNumber: true,
                    min: {
                      value: 0,
                      message:
                        'Regular price must be greater than or equal to 0',
                    },
                  })}
                />

                {errors.regular_price && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.regular_price.message as string}
                  </p>
                )}
              </div>

              <div className="mt-2">
                <Input
                  type="number"
                  label="Sale Price"
                  placeholder="Enter sale price"
                  min={0}
                  step="0.01"
                  {...register('sale_price', {
                    valueAsNumber: true,
                    validate: (value) => {
                      if (value === undefined || value === null || value === '')
                        return true;

                      const regularPrice = Number(getValues('regular_price'));

                      if (!regularPrice) {
                        return 'Set regular price first';
                      }

                      return (
                        value < regularPrice ||
                        'Sale price must be less than regular price'
                      );
                    },
                  })}
                />

                {errors.sale_price && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.sale_price.message as string}
                  </p>
                )}
              </div>

              <div className="mt-2">
                <Input
                  type="number"
                  label="Stock Product *"
                  placeholder="Enter stock quantity"
                  min={0}
                  max={1000}
                  step={1}
                  {...register('stock', {
                    required: 'Stock is required',
                    valueAsNumber: true,
                    min: {
                      value: 0,
                      message: 'Stock must be at least 0',
                    },
                    max: {
                      value: 1000,
                      message: 'Stock must be less than or equal to 1000',
                    },
                    validate: (value) =>
                      Number.isInteger(value) || 'Stock must be a whole number',
                  })}
                />

                {errors.stock && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.stock.message as string}
                  </p>
                )}
              </div>

              <div className="mt-2">
                <SizeSelector control={control} errors={errors} />
              </div>

              <div className="mt-3">
                <label className="block font-semibold text-gray-300 mb-1">
                  Selected Discount Code (Optional)
                </label>
                {discountLoading ? (
                  <p className="text-gray-400">Loading discount codes...</p>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {discountCodes?.map((code: any) => (
                      <button
                        key={code.id}
                        type="button"
                        className={`px-3 py-2 rounded-md text-sm font-semibold border ${
                          watch('discountCodes')?.includes(code.id)
                            ? 'bg-blue-600 text-white border-blue-600'
                            : 'bg-gray-800 text-gray-300 border-gray-600 hover:bg-gray-700'
                        }`}
                        onClick={() => {
                          const currentSelection = watch('discountCodes') || [];
                          const updatedSelected = currentSelection.includes(
                            code.id,
                          )
                            ? currentSelection.filter(
                                (id: string) => id !== code.id,
                              )
                            : [...currentSelection, code.id];
                          setValue('discountCodes', updatedSelected);
                        }}
                      >
                        {code?.public_name} ({code.discountValue}
                        {code.discountType === 'percentage' ? '%' : '$'})
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {openImageModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
              <div className="bg-gray-800 p-6 rounded-lg w-[450px] text-white">
                {/* Header */}
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold">
                    Enhance Product Image
                  </h2>
                  <X
                    size={20}
                    className="cursor-pointer hover:text-red-400"
                    onClick={() => setOpenImageModal(false)}
                  />
                </div>

                {/* Image Container */}
                <div className="relative w-full h-[250px] rounded-md overflow-hidden border-gray-600">
                  <Image
                    src={selectedImage}
                    alt="product-image"
                    fill
                    className="object-contain"
                    sizes="(max-width: 768px) 100vw, 450px"
                    onLoad={() => setprocessing(false)}
                    onError={() => setprocessing(false)}
                  />

                  {processing && (
                    <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/60 transition-opacity duration-200">
                      <div className="flex flex-col items-center gap-2">
                        <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span className="text-xs text-white tracking-wide">
                          Enhancing image...
                        </span>
                      </div>
                    </div>
                  )}
                </div>
                {selectedImage && (
                  <div className="mt-4 space-y-2 ">
                    <h3 className="text-white text-sm font-semibold">
                      AI Enhancements
                    </h3>
                    <div className="grid grid-cols-2 gap-3 max-h-[250px] overflow-y-auto">
                      {enhancements?.map(({ label, effect }) => (
                        <button
                          type="button"
                          key={effect}
                          className={`p-2 rounded-md flex items-center gap-2 ${
                            activeEffect === effect
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-700 hover:bg-gray-600'
                          }`}
                          onClick={() => applyTransformation(effect)}
                          disabled={processing}
                        >
                          <Wand size={18} />
                          {label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="mt-6 flex justify-end gap-3">
            {isChanged && (
              <button
                type="button"
                onClick={handleSaveDraft}
                className="px-6 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600 transition"
              >
                Save Draft
              </button>
            )}
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md"
            >
              {loading ? 'Creating...' : 'Create Product'}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default Page;
