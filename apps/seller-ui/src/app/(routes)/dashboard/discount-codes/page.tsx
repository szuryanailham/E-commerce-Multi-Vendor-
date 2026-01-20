'use client';
import Input from '@/shared/components/components-ui/Input';
import axiosInstance from '@/utils/axiosInstance';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ChevronRight, Plus, Trash, X } from 'lucide-react';
import Link from 'next/link';
import React, { use } from 'react';
import { Controller, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

const page = () => {
  const [showModal, setShowModal] = React.useState(false);
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      public_name: '',
      discountType: 'percentage',
      discountValue: '',
      discountCode: '',
    },
  });
  const createDiscountCodeMutation = useMutation({
    mutationFn: async (data) => {
      await axiosInstance.post('/product/api/create-discount-code', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shop-discounts'] });
      reset();
      setShowModal(false);
      toast.success('Discount code created successfully!');
    },
  });
  const { data: discountCodes = [], isLoading } = useQuery({
    queryKey: ['shop-discounts'],
    queryFn: async () => {
      const res = await axiosInstance.get('/product/api/get-discount-codes');
      return res?.data?.discount_codes || [];
    },
  });

  const handleDeleteClick = async (discount: any) => {
    console.log('Delete discount code:', discount);
  };

  const onSubmit = (data: any) => {
    if (discountCodes.length > 8) {
      toast.error('You can only create up to 8 discount codes.');
      return;
    }
  };
  return (
    <div className="w-full min-h-screen p-8">
      <div className="flex justify-between items-center mb-1">
        <h2 className="text-2xl text-white font-semibold">Discount Codes</h2>
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
          onClick={() => setShowModal(true)}
        >
          <Plus size={18} />
          Create Discount
        </button>
      </div>
      {/*Breadcrumbs*/}
      <div className="flex items-center gap-2 text-white">
        <Link href="/dashboard" className="text-[#80DEEA] cursor-pointer">
          Dashboard
        </Link>

        <ChevronRight size={20} className="opacity-80" />

        <span>Discount codes</span>
      </div>
      {/* main content */}
      <div className="mt-8 bg-gray-900 p-6 rounded-lg shadow-lg">
        <h3 className="text-lg font-semibold text-white mb-4">
          Your Discount Codes
        </h3>
        {isLoading ? (
          <p className="text-gray-400 text-ceneter">Loading discounts...</p>
        ) : (
          <table className="w-full text-white">
            <thead>
              <tr className="border-b border-gray-800">
                <th className="p-3 text-left">Title</th>
                <th className="p-3 text-left">Type</th>
                <th className="p-3 text-left">Value</th>
                <th className="p-3 text-left">Code</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>

            <tbody>
              {discountCodes?.map((discount: any) => (
                <tr
                  key={discount?.id}
                  className="border-b border-gray-800 hover:bg-gray-800 transition"
                >
                  <td className="p-3">{discount?.public_name}</td>

                  <td className="p-3 capitalize">{discount.discountType}</td>

                  <td className="p-3">
                    {discount.discountType === 'percentage'
                      ? `${discount.discountValue}%`
                      : `$${discount.discountValue}`}
                  </td>

                  <td className="p-3">{discount.discountCode}</td>

                  <td className="p-3">
                    <button
                      onClick={() => handleDeleteClick(discount)}
                      className="text-red-400 hover:text-red-300 transition"
                    >
                      <Trash size={18} />
                    </button>
                  </td>
                </tr>
              ))}

              {!isLoading && discountCodes.length === 0 && (
                <tr>
                  <td colSpan={5} className="pt-4 text-gray-400 text-center">
                    No Discount Codes Available!.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Create Discount Model */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded-lg w-[450px] shadow-lg">
            <div className="flex items-center justify-between border-b border-gray-700 pb-3 mb-4">
              <h3 className="text-xl text-white">Create Discount Code</h3>
              <button onClick={() => setShowModal(false)}>
                <X className="text-white" size={22} />
              </button>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="mt-4">
              {/* Title */}
              <Input
                label="Title (Public Name)"
                {...register('public_name', { required: true })}
              />
              {errors.public_name && (
                <p className="text-red-500 text-sm mt-1">
                  This field is required
                </p>
              )}

              {/* Discount Type */}
              <div className="mt-2">
                <label className="block font-semibold text-gray-400 mb-1">
                  Discount Type
                </label>

                <Controller
                  control={control}
                  name="discountType"
                  rules={{ required: true }}
                  render={({ field }) => (
                    <select
                      {...field}
                      className="
                                  w-full rounded-md
                                  bg-gray-900 text-gray-100
                                  border border-gray-700
                                  px-3 py-2
                                  outline-none
                                  focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500
                                  transition
                                "
                    >
                      <option value="" className="bg-gray-900 text-gray-400">
                        Select discount type
                      </option>
                      <option
                        value="percentage"
                        className="bg-gray-900 text-gray-100"
                      >
                        Percentage (%)
                      </option>
                      <option
                        value="flat"
                        className="bg-gray-900 text-gray-100"
                      >
                        Flat Amount ($)
                      </option>
                    </select>
                  )}
                />

                {errors.discountType && (
                  <p className="text-red-500 text-sm mt-1">
                    Discount type is required
                  </p>
                )}
              </div>

              {/* Discount Value */}
              <div className="mt-2">
                <Input
                  label="Discount Value"
                  type="number"
                  min={1}
                  {...register('discountValue', {
                    required: 'Value is required',
                  })}
                />
              </div>
              {/* Discount Code */}
              <div className="mt-2">
                <Input
                  label="Discount Code"
                  {...register('discountCode', {
                    required: 'Discount Code is reuqired',
                  })}
                />
              </div>

              <button
                type="submit"
                className="
    mt-4 w-full
    bg-blue-600 hover:bg-blue-700
    text-white px-4 py-2
    rounded-md font-semibold
    flex items-center justify-center gap-2
    transition
  "
              >
                <Plus size={18} />
                Create
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default page;
