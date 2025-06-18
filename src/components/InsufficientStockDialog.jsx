import React from 'react';
import { FaTimes } from 'react-icons/fa';

const InsufficientStockDialog = ({ open, onClose, productList, onCheckStock, onContactCustomer }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative bg-white rounded-2xl shadow-lg p-6 w-full max-w-xl">

        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-red-500 text-lg"
          aria-label="Đóng"
        >
          <FaTimes />
        </button>

        <h2 className="text-xl font-semibold mb-4 text-red-600">
          Sản phẩm vượt quá số lượng trong kho
        </h2>

        <div className="max-h-64 overflow-y-auto rounded">
            <table className="w-full text-sm border-separate border-spacing-y-2">
                <thead>
                <tr className="text-left text-gray-700">
                    <th className="px-3 py-2 whitespace-nowrap">STT</th>
                    <th className="px-3 py-2 whitespace-nowrap">Tên sản phẩm</th>
                    <th className="px-3 py-2 whitespace-nowrap">Đơn vị</th>
                    <th className="px-3 py-2 whitespace-nowrap text-center">Thiếu</th>
                </tr>
                </thead>
                <tbody>
                {productList.map((item, index) => (
                    <tr
                    key={index}
                    className="bg-gray-50 hover:bg-gray-100 rounded-xl shadow-sm"
                    >
                    <td className="px-3 py-2 text-center">{index + 1}</td>
                    <td className="px-3 py-2">{item.product.name}</td>
                    <td className="px-3 py-2">{item.unit.name}</td>
                    <td className="px-3 py-2 text-center text-red-600 font-semibold">
                        {item.quantity}
                    </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>

        <div className="flex justify-end mt-6 space-x-3">
          <button
            onClick={onCheckStock}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Kiểm tra kho
          </button>
          <button
            onClick={onContactCustomer}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Liên hệ khách
          </button>
        </div>
      </div>
    </div>
  );
};

export default InsufficientStockDialog;
