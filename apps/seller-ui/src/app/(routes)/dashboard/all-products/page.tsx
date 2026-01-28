'use client';
import React, { useMemo, useState } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  flexRender,
} from '@tanstack/react-table';
import axiosInstance from '@/utils/axiosInstance';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import Image from 'next/image';
import Link from 'next/link';
import {
  BarChart,
  ChevronRight,
  Eye,
  Plus,
  RotateCcw,
  Search,
  Star,
  Trash,
} from 'lucide-react';
import DeleteConfirmationModal from '@/shared/components/modal/delete-confirmation-modal';

const fetchProducts = async () => {
  const res = await axiosInstance.get('/product/api/get-shop-products');
  return res?.data?.products;
};

const deleteProduct = async (productId: string) => {
  await axiosInstance.delete(`/product/api/delete-product/${productId}`);
};

const restoreProduct = async (productId: string) => {
  await axiosInstance.put(`/product/api/restore-product/${productId}`);
};

const ProductsList = () => {
  const [globalFilter, setglobalFilter] = useState('');
  const [analyticsData, setanalyticsData] = useState(null);
  const [showAnalytics, setshowAnalytics] = useState(false);
  const [showDeleteModal, setshowDeleteModal] = useState(false);
  const [selectedProduct, setselectedProduct] = useState<any>();
  const queryClient = useQueryClient();

  // dummy function
  const openAnalytics = (product: any) => {
    console.log('Open analytics:', product);
  };

  // dummy function
  const openDeleteModal = (product: any) => {
    setselectedProduct(product);
    setshowDeleteModal(true);
  };

  const { data: products = [], isLoading } = useQuery({
    queryKey: ['shop-products'],
    queryFn: fetchProducts,
    staleTime: 1000 * 60 * 5,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shop-products'] });
      setshowDeleteModal(false);
    },
  });

  const restoreMutation = useMutation({
    mutationFn: restoreProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shop-products'] });
      setshowDeleteModal(false);
    },
  });

  const columns = useMemo(
    () => [
      {
        accessorKey: 'image',
        header: 'Image',
        cell: ({ row }: any) => {
          return (
            <div className="relative">
              <Image
                src={row.original.images[0]?.url}
                alt={row.original.images[0]?.url}
                width={200}
                height={200}
                className={`w-12 h-12 rounded-md object-cover ${
                  row.original.isDeleted ? 'opacity-50 grayscale' : ''
                }`}
              />
              {row.original.isDeleted && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Trash size={16} className="text-red-500" />
                </div>
              )}
            </div>
          );
        },
      },
      {
        accessorKey: 'name',
        header: 'Product Name',
        cell: ({ row }: any) => {
          const truncatedTitle =
            row.original.title.length > 25
              ? `${row.original.title.substring(0, 25)}...`
              : row.original.title;

          return (
            <div className="flex items-center gap-2">
              <Link
                href={`${process.env.NEXT_PUBLIC_USER_UI_LINK}/product/${row.original.slug}`}
                className={`text-blue-400 hover:underline ${
                  row.original.isDeleted ? 'line-through opacity-50' : ''
                }`}
                title={row.original.title}
              >
                {truncatedTitle}
              </Link>
              {row.original.isDeleted && (
                <span className="text-xs bg-red-600 text-white px-2 py-0.5 rounded">
                  Deleted
                </span>
              )}
            </div>
          );
        },
      },
      {
        accessorKey: 'price',
        header: 'Price',
        cell: ({ row }: any) => (
          <span className={row.original.isDeleted ? 'opacity-50' : ''}>
            ${row.original.sale_price}
          </span>
        ),
      },
      {
        accessorKey: 'stock',
        header: 'Stock',
        cell: ({ row }: any) => (
          <span
            className={`${
              row.original.stock < 10 ? 'text-red-500' : 'text-white'
            } ${row.original.isDeleted ? 'opacity-50' : ''}`}
          >
            {row.original.stock}
          </span>
        ),
      },
      {
        accessorKey: 'rating',
        header: 'Rating',
        cell: ({ row }: any) => (
          <div
            className={`flex items-center gap-1 text-yellow-400 ${
              row.original.isDeleted ? 'opacity-50' : ''
            }`}
          >
            <Star fill="#fde047" size={18} />
            <span className="text-white">{row.original.ratings || 5}</span>
          </div>
        ),
      },
      {
        header: 'Actions',
        cell: ({ row }: any) => (
          <div className="flex gap-3">
            <Link
              href={`/product/${row.original.id}`}
              className="text-blue-400 hover:text-blue-300 transition"
            >
              <Eye size={18} />
            </Link>

            <button
              className="text-green-400 hover:text-green-300 transition"
              onClick={() => openAnalytics(row.original)}
            >
              <BarChart size={18} />
            </button>

            <button
              className={`transition ${
                row.original.isDeleted
                  ? 'text-green-400 hover:text-green-300'
                  : 'text-red-400 hover:text-red-300'
              }`}
              onClick={() => openDeleteModal(row.original)}
              title={
                row.original.isDeleted ? 'Restore Product' : 'Delete Product'
              }
            >
              {row.original.isDeleted ? (
                <RotateCcw size={18} />
              ) : (
                <Trash size={18} />
              )}
            </button>
          </div>
        ),
      },
    ],
    [],
  );

  const table = useReactTable({
    data: products,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    globalFilterFn: 'includesString',
    state: { globalFilter },
    onGlobalFilterChange: setglobalFilter,
  });

  return (
    <div className="w-full min-h-screen p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl text-white font-semibold">All Products</h2>

        <Link
          href="/dashboard/create-product"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center gap-2"
        >
          <Plus size={18} />
          Add Product
        </Link>
      </div>

      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-300">
        <span>Dashboard</span>
        <ChevronRight size={16} />
        <span className="text-white">All Products</span>
      </div>

      {/* Search Bar */}
      <div className="mt-3 mb-3 flex items-center bg-gray-900 p-2 rounded-md flex-1">
        <Search size={18} className="text-gray-400 mr-2" />
        <input
          type="text"
          placeholder="Search products"
          className="w-full bg-transparent text-white outline-none"
          value={globalFilter}
          onChange={(e) => setglobalFilter(e.target.value)}
        />
      </div>

      {/* body tabble */}
      <div className="bg-gray-900 rounded-lg overflow-hidden">
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <p className="text-lg">No products found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-800 border-b border-gray-700">
                <tr>
                  {table.getFlatHeaders().map((header) => (
                    <th
                      key={header.id}
                      className="px-6 py-4 text-left text-sm font-semibold text-gray-300"
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {table.getRowModel().rows.length === 0 ? (
                  <tr>
                    <td
                      colSpan={columns.length}
                      className="px-6 py-10 text-center text-gray-400"
                    >
                      No results found for "{globalFilter}"
                    </td>
                  </tr>
                ) : (
                  table.getRowModel().rows.map((row) => (
                    <tr
                      key={row.id}
                      className={`transition-colors ${
                        row.original.isDeleted
                          ? 'bg-red-900/10 hover:bg-red-900/20'
                          : 'hover:bg-gray-800'
                      }`}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <td
                          key={cell.id}
                          className="px-6 py-4 text-sm text-gray-300"
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext(),
                          )}
                        </td>
                      ))}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Footer - Showing results count */}
        {!isLoading && products.length > 0 && (
          <div className="px-6 py-4 bg-gray-800 border-t border-gray-700">
            <p className="text-sm text-gray-400">
              Showing {table.getRowModel().rows.length} of {products.length}{' '}
              products
            </p>
          </div>
        )}

        {showDeleteModal && (
          <DeleteConfirmationModal
            product={selectedProduct}
            onClose={() => setshowDeleteModal(false)}
            onConfirm={() => deleteMutation.mutate(selectedProduct?.id)}
            onRestore={() => restoreMutation.mutate(selectedProduct?.id)}
          />
        )}
      </div>
    </div>
  );
};

export default ProductsList;
