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
import { getOrders } from '../../../store/Reducers/order/orderAdminReducer';

const Orders = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const ITEMS_PER_PAGE_OPTIONS = [5, 10, 20];
    const [size, setSize] = useState(ITEMS_PER_PAGE_OPTIONS[0]);
    const [currentPage, setCurrentPage] = useState(0);

    const { orders, loading, error, totalPages } = useSelector((state) => state.orderAdmin);

    useEffect(() => {
        dispatch(getOrders({ page: currentPage, size }));
    }, [dispatch, currentPage, size]);

    const handleItemsPerPageChange = (e) => {
        setSize(Number(e.target.value)); 
        dispatch(getOrders({ page: 0, size: Number(e.target.value) }));
    };

    const handlePageChange = (page) => {
        if (page >= 0 && page < totalPages) {
            setCurrentPage(page);
        }
    };

    const handleOrderDetail= (order) => {
        navigate('/admin/orderDetail', { state: order });
    };

    return (
        <div className="px-2 md:px-4">
            <div className="flex flex-col p-4 rounded bg-white shadow-lg">
                <div className="text-black">
                    <h2 className="text-2xl font-bold mb-2">Quản lý dơn hàng</h2>
                    <p>Đây là danh sách tất cả đơn hàng!</p>
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
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {orders.map((order) => (
                                <TableRow key={order} 
                                onClick={() => handleOrderDetail(order)}>
                                    <TableCell>{order.id}</TableCell>
                                    <TableCell>{order.orderDate}</TableCell>
                                    <TableCell>{order.orderItemResponses.length}</TableCell>
                                    <TableCell>{new Intl.NumberFormat('vi-VN').format(order.totalPrice)} đ</TableCell>
                                    <TableCell>{order.paymentMethod}</TableCell>
                                    <TableCell>
                                        <span
                                            className={`px-3 py-1 font-semibold rounded ${
                                                order.status === 'PENDING' 
                                                    ? 'bg-yellow-200 text-yellow-600 '
                                                    : order.status === 'SUCCESS' 
                                                    ? 'bg-green-200 text-green-600'
                                                    : 'bg-gray-500' 
                                            }`}
                                        >
                                            {order.status}
                                        </span>
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
                        {Array.from({ length: totalPages }).map((_, idx) => (
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
                            disabled={currentPage === totalPages - 1}
                        />
                    </Pagination>
                </div>
            </div>
        </div>
    );
};

export default Orders;
