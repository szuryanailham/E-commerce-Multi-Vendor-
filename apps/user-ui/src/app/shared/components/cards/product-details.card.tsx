import Image from 'next/image';
import Link from 'next/link';
import React, { useState } from 'react';
import Ratings from '../ratings';
import {
  MapPin,
  MessageCircle,
  X,
  ShoppingCart,
  Heart,
  Truck,
} from 'lucide-react';
import { useRouter } from 'next/navigation';

const ProductDetailsCard = ({
  data,
  setOpen,
}: {
  data: any;
  setOpen: (open: boolean) => void;
}) => {
  const [activeImage, setActiveImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const router = useRouter();

  // Calculate estimated delivery (contoh: 3-7 hari dari sekarang)
  const getEstimatedDelivery = () => {
    const today = new Date();
    const minDays = 3;
    const maxDays = 7;

    const minDate = new Date(today);
    minDate.setDate(today.getDate() + minDays);

    const maxDate = new Date(today);
    maxDate.setDate(today.getDate() + maxDays);

    return {
      min: minDate.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
      }),
      max: maxDate.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
      }),
    };
  };

  const estimatedDelivery = getEstimatedDelivery();

  // Handle Add to Cart
  const handleAddToCart = async () => {
    setIsAddingToCart(true);

    // Validasi
    if (data?.colors?.length > 0 && !selectedColor) {
      alert('Silakan pilih warna terlebih dahulu');
      setIsAddingToCart(false);
      return;
    }

    if (data?.sizes?.length > 0 && !selectedSize) {
      alert('Silakan pilih ukuran terlebih dahulu');
      setIsAddingToCart(false);
      return;
    }

    try {
      // TODO: Implementasi API call untuk menambah ke cart
      // const response = await addToCart({
      //   productId: data.id,
      //   quantity,
      //   color: selectedColor,
      //   size: selectedSize
      // });

      // Simulasi delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      alert('Produk berhasil ditambahkan ke keranjang!');
      // Optional: redirect ke cart
      // router.push('/cart');
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Gagal menambahkan ke keranjang');
    } finally {
      setIsAddingToCart(false);
    }
  };

  // Handle Wishlist Toggle
  const handleWishlistToggle = async () => {
    try {
      // TODO: Implementasi API call untuk toggle wishlist
      // await toggleWishlist(data.id);

      setIsInWishlist(!isInWishlist);
    } catch (error) {
      console.error('Error toggling wishlist:', error);
      alert('Gagal menambahkan ke wishlist');
    }
  };

  return (
    <div
      className="fixed flex items-center justify-center top-0 left-0 h-screen w-full bg-[#0000001d] z-50"
      onClick={() => setOpen(false)}
    >
      <div
        className="w-[90%] md:w-[70%] lg:w-[80%] xl:w-[70%]
        mt-20 
        overflow-y-auto
        max-h-[calc(100vh-6rem)] 
        p-4 md:p-6 
        bg-white shadow-md rounded-lg"
        onClick={(e) => e.stopPropagation()}
      >
        {/* MAIN WRAPPER */}
        <div className="w-full flex flex-col md:flex-row gap-6">
          {/* LEFT - IMAGE */}
          <div className="w-full md:w-1/2">
            <div className="relative">
              <Image
                src={data?.images?.[activeImage]?.url}
                alt={data?.images?.[activeImage]?.url || 'Product Image'}
                width={350}
                height={350}
                className="w-full rounded-lg object-contain"
              />

              {/* Wishlist Button on Image */}
              <button
                onClick={handleWishlistToggle}
                className={`absolute top-3 right-3 p-2 rounded-full shadow-lg transition-all ${
                  isInWishlist
                    ? 'bg-red-500 text-white'
                    : 'bg-white text-gray-600 hover:text-red-500'
                }`}
                aria-label={
                  isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'
                }
              >
                <Heart
                  size={20}
                  fill={isInWishlist ? 'currentColor' : 'none'}
                />
              </button>
            </div>

            {/* Thumbnails */}
            <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
              {data?.images?.map((img: any, index: number) => (
                <div
                  key={index}
                  className={`cursor-pointer border rounded-md flex-shrink-0 ${
                    activeImage === index
                      ? 'border-gray-500 pt-1'
                      : 'border-transparent'
                  }`}
                  onClick={() => setActiveImage(index)}
                >
                  <Image
                    src={img?.url}
                    alt={`Thumbnail ${index}`}
                    width={80}
                    height={80}
                    className="rounded-md"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT - INFO */}
          <div className="w-full md:w-1/2 md:pl-6 relative">
            {/* Close button */}
            <button
              className="absolute top-0 right-0 cursor-pointer text-gray-500 hover:text-black z-10"
              onClick={() => setOpen(false)}
            >
              <X size={22} />
            </button>

            {/* Seller Info */}
            <div className="border-b pb-4 border-gray-200 pr-8">
              <div className="flex items-start gap-4">
                {/* Avatar */}
                <Image
                  src={
                    data?.shop?.avatar || 'https://github.com/evilrabbit.png'
                  }
                  alt="Shop Logo"
                  width={60}
                  height={60}
                  className="rounded-full w-[60px] h-[60px] object-cover flex-shrink-0"
                />

                {/* Info + Action */}
                <div className="flex-1 flex flex-col sm:flex-row items-start justify-between gap-4">
                  {/* Left info */}
                  <div className="flex flex-col">
                    <Link
                      href={`/shop/${data?.shop?.id}`}
                      className="text-lg font-medium leading-tight hover:underline"
                    >
                      {data?.shop?.name}
                    </Link>

                    <span className="mt-1">
                      <Ratings rating={data?.shop?.ratings} />
                    </span>

                    <p className="text-gray-600 mt-1 flex items-center gap-1 text-sm">
                      <MapPin size={16} />
                      <span>
                        {data?.shop?.address || 'Location Not Available'}
                      </span>
                    </p>
                  </div>

                  {/* Chat button */}
                  <button
                    className="flex items-center gap-2 px-4 py-2 rounded-md border border-gray-300 hover:bg-gray-100 transition whitespace-nowrap"
                    onClick={() => router.push(`/inbox?shop=${data?.shop?.id}`)}
                  >
                    <MessageCircle size={18} />
                    <span className="hidden sm:inline">Chat</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Product Information */}
            <h3 className="text-xl font-semibold mt-4">{data?.title}</h3>
            <p className="mt-2 text-gray-700 whitespace-pre-wrap w-full text-sm">
              {data?.short_description}
            </p>

            {data?.brand && (
              <p className="mt-2 text-sm">
                <strong>Brand:</strong> {data.brand}
              </p>
            )}

            {/* Price */}
            <div className="mt-4">
              {data?.sale_price ? (
                <div className="flex items-center gap-3">
                  <p className="text-2xl font-bold text-gray-900">
                    Rp {data.sale_price.toLocaleString('id-ID')}
                  </p>
                  <p className="text-sm text-gray-500 line-through">
                    Rp {data.regular_price.toLocaleString('id-ID')}
                  </p>
                  <span className="px-2 py-1 bg-red-100 text-red-600 text-xs font-semibold rounded">
                    {Math.round(
                      ((data.regular_price - data.sale_price) /
                        data.regular_price) *
                        100,
                    )}
                    % OFF
                  </span>
                </div>
              ) : (
                <p className="text-2xl font-bold text-gray-900">
                  Rp {data?.regular_price?.toLocaleString('id-ID')}
                </p>
              )}
            </div>

            {/* Color Selection */}
            {data?.colors?.length > 0 && (
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mt-4">
                <strong className="min-w-[60px] text-sm text-gray-700">
                  Warna:
                </strong>

                <div className="flex flex-wrap gap-2">
                  {data.colors.map((color: string, index: number) => (
                    <button
                      key={index}
                      onClick={() => setSelectedColor(color)}
                      className={`w-9 h-9 rounded-full border-2 transition transform
                        ${
                          selectedColor === color
                            ? 'border-gray-800 scale-110 shadow-lg ring-2 ring-gray-300'
                            : 'border-gray-300 hover:scale-105 hover:border-gray-500'
                        }
                      `}
                      style={{ backgroundColor: color }}
                      aria-label={`Select color ${color}`}
                      title={color}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Size Selection */}
            {data?.sizes?.length > 0 && (
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mt-4">
                <strong className="min-w-[60px] text-sm text-gray-700">
                  Ukuran:
                </strong>

                <div className="flex flex-wrap gap-2">
                  {data.sizes.map((size: string, index: number) => (
                    <button
                      key={index}
                      onClick={() => setSelectedSize(size)}
                      className={`min-w-[45px] px-3 py-2 text-sm font-medium rounded-md border transition
                        ${
                          selectedSize === size
                            ? 'border-gray-900 bg-gray-900 text-white shadow-md'
                            : 'border-gray-300 hover:border-gray-500 hover:bg-gray-50'
                        }
                      `}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="mt-5 flex items-center gap-5">
              <span className="font-medium text-sm">Jumlah:</span>

              <div className="flex items-center border border-gray-300 rounded-md overflow-hidden">
                <button
                  className="px-3 py-2 text-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                  disabled={quantity <= 1}
                >
                  −
                </button>

                <input
                  type="number"
                  min={1}
                  value={quantity}
                  onChange={(e) =>
                    setQuantity(Math.max(1, Number(e.target.value)))
                  }
                  className="w-16 text-center border-x border-gray-300 focus:outline-none py-2"
                />

                <button
                  className="px-3 py-2 text-lg hover:bg-gray-100"
                  onClick={() => setQuantity((prev) => prev + 1)}
                >
                  +
                </button>
              </div>
            </div>

            {/* Estimated Delivery Card */}
            <div className="mt-5 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-blue-100 rounded-full">
                  <Truck size={20} className="text-blue-600" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 text-sm">
                    Estimasi Pengiriman
                  </h4>
                  <p className="text-sm text-gray-600 mt-1">
                    Tiba antara{' '}
                    <span className="font-semibold">
                      {estimatedDelivery.min}
                    </span>{' '}
                    -{' '}
                    <span className="font-semibold">
                      {estimatedDelivery.max}
                    </span>
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {data?.shop?.address
                      ? `Dari ${data.shop.address}`
                      : 'Gratis ongkir untuk pembelian tertentu'}
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              {/* Add to Cart Button */}
              <button
                onClick={handleAddToCart}
                disabled={isAddingToCart}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                <ShoppingCart size={20} />
                <span>
                  {isAddingToCart ? 'Menambahkan...' : 'Tambah ke Keranjang'}
                </span>
              </button>

              {/* Wishlist Button */}
              <button
                onClick={handleWishlistToggle}
                className={`px-6 py-3 rounded-lg border-2 transition font-medium flex items-center justify-center gap-2 ${
                  isInWishlist
                    ? 'border-red-500 bg-red-50 text-red-600 hover:bg-red-100'
                    : 'border-gray-300 hover:border-red-500 hover:text-red-500'
                }`}
              >
                <Heart
                  size={20}
                  fill={isInWishlist ? 'currentColor' : 'none'}
                />
                <span className="hidden sm:inline">
                  {isInWishlist ? 'Tersimpan' : 'Simpan'}
                </span>
              </button>
            </div>

            {/* Stock Info (Optional) */}
            {data?.stock !== undefined && (
              <div className="mt-4 text-sm">
                {data.stock > 0 ? (
                  <p className="text-green-600">
                    ✓ Stok tersedia ({data.stock} pcs)
                  </p>
                ) : (
                  <p className="text-red-600">✗ Stok habis</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsCard;
