import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    Table,
    TableHeader,
    TableBody,
    TableRow,
    TableCell,
    TableHead,
} from "../../../components/ui/table";
import {
    Pagination,
    PaginationItem,
    PaginationLink,
    PaginationPrevious,
    PaginationNext,
} from "../../../components/ui/pagination";  
import { FaSearch } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { confirmOrder, getOrderCOD } from '../../../store/Reducers/order/orderAdminReducer';
import { IoPrintOutline } from "react-icons/io5";
import { FaRegSquareCheck } from "react-icons/fa6";

const OrderCOD = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const ITEMS_PER_PAGE_OPTIONS = [5, 10, 20];
    const [size, setSize] = useState(ITEMS_PER_PAGE_OPTIONS[0]);
    const [currentPage, setCurrentPage] = useState(0);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

    const { orderCOD, totalCODPages } = useSelector((state) => state.orderAdmin);
    const { role } = useSelector((state) => state.auth); 

    useEffect(() => {
        dispatch(getOrderCOD({ page: currentPage, size }));
    }, [dispatch, currentPage, size]);

    const handleItemsPerPageChange = (e) => {
        setSize(Number(e.target.value)); 
        dispatch(getOrderCOD({ page: 0, size: Number(e.target.value) }));
    };

    const handlePageChange = (page) => {
        if (page >= 0 && page < totalCODPages) {
            setCurrentPage(page);
        }
    };

    const handleOrderDetail= (order) => {
        navigate(`/admin/orders/${order.id}`, { state: order });
    };

    const handleConfirm = async (orderId) => {
        try {
            const res = await dispatch(confirmOrder(orderId)).unwrap();
            toast.success(res.message);
            dispatch(getOrderCOD({ page: currentPage, size }));
        } catch (error) {
            toast.error(error.message || "Xác nhận đơn hàng thất bại");

            if (error.result && Array.isArray(error.result) && error.result.length > 0) {
                console.log("Các sản phẩm thiếu:", error.result);
                toast.warning(`Thiếu hàng: ${error.result.map(p => p.product?.name || 'Sản phẩm').join(', ')}`);
            }
        }
    };


    const handlePrint = () =>{

    }

    return (
        <div className="px-2 md:px-4">
            <div className="flex flex-col p-4 rounded bg-white shadow-lg">
                <div className="text-black">
                    <h2 className="text-2xl font-bold mb-2">Quản lý đơn hàng</h2>
                    <p>Đây là danh sách tất cả đơn hàng đã thanh toán!</p>
                    <div className="flex flex-col md:flex-row items-center w-full h-[85px] justify-between">
                        <div className="flex flex-col md:flex-row items-center w-[566px]">
                            <label htmlFor="itemsPerPage" className="mb-2 md:mb-0 md:ml-2">
                                Show
                            </label>
                            <select
                                value={size}
                                onChange={handleItemsPerPageChange}
                                className="border rounded-md ml-2 w-11 h-8 justify-center justify-items-center"
                            >
                                {ITEMS_PER_PAGE_OPTIONS.map((option) => (
                                    <option key={option} value={option}>
                                        {option}
                                    </option>
                                ))}
                            </select>
                            <label htmlFor="itemsPerPage" className="mb-2 md:mb-0 md:ml-2">
                                entries
                            </label>
                            <div className="relative ml-4 w-1/5">
                                <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    id="search"
                                    className="border border-gray-400 hover:border-blue-500 rounded-md pl-10 pr-4 py-1 h-10"
                                    placeholder="Search"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="min-h-96">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Mã đơn</TableHead>
                                <TableHead>Ngày đặt hành</TableHead>
                                <TableHead>Số sản phẩm</TableHead>
                                <TableHead>Đơn giá</TableHead>
                                <TableHead>Phương thức thanh toán</TableHead>
                                <TableHead>Trạng thái</TableHead>
                                <TableHead>Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {orderCOD.map((order) => (
                                <TableRow key={order} >
                                    <TableCell className="cursor-pointer" onClick={() => handleOrderDetail(order)}>{order.id}</TableCell>
                                    <TableCell>{order.orderDate}</TableCell>
                                    <TableCell>
                                        {order.orderItemResponses?.reduce((sum, item) => sum + item.quantity, 0)}
                                    </TableCell>
                                    <TableCell>{new Intl.NumberFormat('vi-VN').format(order.newTotalPrice)} đ</TableCell>
                                    <TableCell>{order.paymentMethod}</TableCell>
                                    <TableCell>
                                        <span
                                        className={`px-3 py-1 text-sm rounded-lg ${
                                            order?.isReceived === true
                                            ? 'bg-green-200 text-green-800'
                                            : order.isConfirm === false
                                            ? 'bg-yellow-200 text-yellow-800'
                                            : 'bg-blue-200 text-blue-800'
                                        }`}
                                        >
                                        {order?.isReceived === true
                                            ? 'Đã nhận hàng'
                                            : order.isConfirm === false
                                            ? 'Đang xử lý'
                                            : 'Đang giao hàng'
                                        }
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        <div className='flex'>
                                            {!order.isConfirm && role === 'ROLE_EMPLOYEE' ? (
                                                <button
                                                    className="flex items-center justify-center p-2 rounded-lg bg-green-200"
                                                    onClick={() => handleConfirm(order.id)}
                                                >
                                                    <FaRegSquareCheck className="text-green-400" />
                                                </button>
                                            ) : null}
                                            <button 
                                                className="flex items-center justify-center p-2 rounded-lg bg-gray-200 ml-2"
                                                onClick={handlePrint}
                                            >
                                                <IoPrintOutline className="text-gray-500" />
                                            </button>
                                        </div>
                                    </TableCell>

                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>

                    {/* Pagination */}
                    <Pagination>
                        <PaginationPrevious
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 0}
                        />
                        {Array.from({ length: totalCODPages }).map((_, idx) => (
                            <PaginationItem className="list-none" key={idx}>
                                <PaginationLink
                                    isActive={currentPage === idx}
                                    onClick={() => handlePageChange(idx)}
                                >
                                    {idx + 1}
                                </PaginationLink>
                            </PaginationItem>                  
                        ))}
                        <PaginationNext
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalCODPages - 1}
                        />
                    </Pagination>
                </div>
            </div>

            {isDeleteDialogOpen && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                <div className="bg-white p-6 rounded-md shadow-lg">
                    <h3 className="text-lg font-bold mb-4">Xác nhận xóa</h3>
                    <p className="mb-6">Bạn có chắc chắn muốn xóa danh mục này không?</p>
                    <div className="flex justify-end space-x-4">
                        <button
                            className="bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300"
                            // onClick={handleCancelDelete}
                        >
                            Hủy
                        </button>
                        <button
                            className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600"
                            // onClick={handleConfirmDelete}
                        >
                            Xác nhận
                        </button>
                    </div>
                </div>
            </div>
            )}

        </div>
    );
};

export default OrderCOD;
