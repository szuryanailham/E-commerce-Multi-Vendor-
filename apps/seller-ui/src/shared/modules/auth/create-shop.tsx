import { Categories } from '@/utils/categories';
import { useMutation } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import React from 'react';
import { useForm } from 'react-hook-form';

const CreateShop = ({
  sellerId,
  setActiveStep,
}: {
  sellerId: string;
  setActiveStep: (step: number) => void;
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const shopCreatedMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/create-shop`,
        data,
      );

      return response.data;
    },
    onSuccess: () => {
      setActiveStep(3);
    },
  });

  const countWords = (text: string) => text.trim().split(/\s+/).length;

  const onSubmit = async (data: any) => {
    const shopData = { ...data, sellerId };
    shopCreatedMutation.mutate(shopData);
  };

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <h3 className="text 2xl font-semibold text-center mb-4">
          Setup new shop
        </h3>

        {/* Name shop */}
        <label className="block text-gray-700 mb-1">Name *</label>

        <input
          type="text"
          placeholder="shop name"
          className="w-full p-2 border border-gray-300 outline-0 rounded-[-4px] mb-1"
          {...register('name', {
            required: 'Name is required',
          })}
        />

        {errors.name && (
          <p className="text-red-500 text-sm">{String(errors.name.message)}</p>
        )}

        {/* Bio of shop */}
        <label className="block text-gray-700 mb-1">Bio (Max 100 words)</label>

        <input
          type="text"
          placeholder="shop bio"
          className="w-full p-2 border border-gray-300 outline-0 rounded-[-4px] mb-1"
          {...register('bio', {
            required: 'Bio is required',
            validate: (value) =>
              countWords(value) <= 100 || "Bio can't exceed 100 words",
          })}
        />

        {errors.bio && (
          <p className="text-red-500 text-sm">{String(errors.bio.message)}</p>
        )}

        {/* Shop address */}
        <label className="block text-gray-700 mb-1">Address *</label>

        <input
          type="text"
          placeholder="shop address"
          className="w-full p-2 border border-gray-300 outline-0 rounded-[-4px] mb-1"
          {...register('address', {
            required: 'Shop address is required',
          })}
        />

        {errors.address && (
          <p className="text-red-500 text-sm">
            {String(errors.address.message)}
          </p>
        )}

        {/* Opening hours */}
        <label className="block text-gray-700 mb-1">Opening Hours *</label>

        <input
          type="text"
          placeholder="e.g., Mon-Fri 9AM - 6PM"
          className="w-full p-2 border border-gray-300 outline-0 rounded-[-4px] mb-1"
          {...register('opening_hours', {
            required: 'Opening hours is required',
          })}
        />

        {errors.opening_hours && (
          <p className="text-red-500 text-sm">
            {String(errors.opening_hours.message)}
          </p>
        )}

        {/* Website */}
        <label className="block text-gray-700 mb-1">Website</label>

        <input
          type="text"
          placeholder="https://yourshop.com"
          className="w-full p-2 border border-gray-300 outline-0 rounded-[-4px] mb-1"
          {...register('website', {
            pattern: {
              value:
                /^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w-._~:/?#[\]@!$&'()*+,;=]*)?$/,
              message: 'Please enter a valid website URL',
            },
          })}
        />

        {errors.website && (
          <p className="text-red-500 text-sm">
            {String(errors.website.message)}
          </p>
        )}

        {/* Categories */}
        <label className="block text-gray-700 mb-1">Category</label>

        <select
          className="w-full p-2 border border-gray-300 outline-0 rounded-[4px] mb-1 bg-white"
          {...register('category', {
            required: 'Category is required',
          })}
        >
          <option value="">Select category</option>
          {Categories.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>

        {errors.category && (
          <p className="text-red-500 text-sm">
            {String(errors.category.message)}
          </p>
        )}

        {/* Submit */}
        <button
          type="submit"
          className="w-full text-lg bg-blue-600 text-white py-2 rounded-lg mt-4"
        >
          Create
        </button>

        {shopCreatedMutation.isError &&
          shopCreatedMutation.error instanceof AxiosError && (
            <p className="text-red-500 text-sm">
              {shopCreatedMutation.error.response?.data?.message ||
                shopCreatedMutation.error.message}
            </p>
          )}
      </form>
    </div>
  );
};

export default CreateShop;
