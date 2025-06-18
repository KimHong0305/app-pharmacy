import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { deletePrice, getAllPrices } from '../../../store/Reducers/priceReducer';
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
import { FaSearch, FaRegEdit } from "react-icons/fa";
import { FaRegTrashCan } from "react-icons/fa6";
import { MdAdd } from "react-icons/md";
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { CiFilter } from "react-icons/ci";
import { FaExclamationTriangle, FaClock, FaCheckCircle } from "react-icons/fa";

const Inventory = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { prices, loading} = useSelector((state) => state.price);

    const ITEMS_PER_PAGE_OPTIONS = [5, 10, 20];
    const [size, setSize] = useState(ITEMS_PER_PAGE_OPTIONS[0]);

    const [priceToDelete, setPriceToDelete] = useState(null);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

    const [showFilter, setShowFilter] = useState(false);
    const [filterExpiring, setFilterExpiring] = useState(false);
    const [filterLowStock, setFilterLowStock] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const [currentPage, setCurrentPage] = useState(0);
    const startIndex = currentPage * size;
    const endIndex = startIndex + size;

    useEffect(() => {
        dispatch(getAllPrices({ page: 0, size: 1000 }));
    }, [dispatch, size, currentPage]);

    const handleSearch = (e) => {
        setSearchQuery(e.target.value.toLowerCase());
        setCurrentPage(0);
    };

    const truncateText = (text, maxLength) => 
        text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;    

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleItemsPerPageChange = (e) => {
        setSize(Number(e.target.value));
        setCurrentPage(0);
    };

    const handleEditPrice= (price) => {
        navigate(`/admin/prices/edit/${price.id}`, { state: price });
    };

    const handleAddPrice= () => {
        navigate('/admin/prices/add');
    };

    const handleDeleteClick = (priceId) => {
        setPriceToDelete(priceId);
        setIsDeleteDialogOpen(true);
    };
    
    const handleConfirmDelete = async () => {
        if (priceToDelete) {
            try {
                await dispatch(deletePrice(priceToDelete));
                dispatch(getAllPrices({ page: currentPage, size }));
                toast.success('Xóa giá sản phẩm thành công');
                setPriceToDelete(null);
                setIsDeleteDialogOpen(false);
              } catch (error) {
                toast.error(error.message);
            }
        }
    };
    
    const handleCancelDelete = () => {
        setPriceToDelete(null);
        setIsDeleteDialogOpen(false);
    };

    const isExpiringSoon = (expirationDate) => {
        const now = new Date();
        const expiry = new Date(expirationDate);
        const timeDiff = expiry - now;
        const daysDiff = timeDiff / (1000 * 60 * 60 * 24);
        return daysDiff <= 120;
    };

    const isLowStock = (quantity) => {
        return quantity <= 10;
    };

    const filteredPrices = prices.filter((price) => {
        const meetsExpiring = !filterExpiring || isExpiringSoon(price.dateExpiration);
        const meetsLowStock = !filterLowStock || isLowStock(price.quantity);
        const matchesSearch = price.product.name.toLowerCase().includes(searchQuery);
        return meetsExpiring && meetsLowStock && matchesSearch;
    });
    
    const paginatedPrices = filteredPrices.slice(startIndex, endIndex);

    return (
        <div className="px-2 md:px-4">
        <div className="flex flex-col p-4 rounded bg-white shadow-lg">
            <div className="text-black">
            <h2 className="text-2xl font-bold mb-2">Quản lý kho</h2>
            {/* <p>Đây là danh sách tất cả giá sản phẩm!</p> */}
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
                    value={searchQuery}
                    onChange={handleSearch}
                    className="border border-gray-400 hover:border-blue-500 rounded-md pl-10 pr-4 py-1 h-10"
                    placeholder="Search"
                    />
                </div>
                </div>
                <div className="flex items-center gap-2 mr-5 relative">
                    {filterExpiring && (
                        <span className="bg-sky-100 text-sky-700 text-sm px-2 py-2 rounded-lg flex items-center space-x-1">
                            <span>Sắp hết hạn</span>
                            <button
                                className="hover:text-red-500"
                                onClick={() => setFilterExpiring(false)}
                            >
                                ✕
                            </button>
                        </span>
                    )}
                    {filterLowStock && (
                        <span className="bg-orange-100 text-orange-700 text-sm px-2 py-2 rounded-lg flex items-center space-x-1">
                            <span>Sắp hết hàng</span>
                            <button
                                className="hover:text-red-500"
                                onClick={() => setFilterLowStock(false)}
                            >
                                ✕
                            </button>
                        </span>
                    )}

                    <div className="relative">
                        <button
                            onClick={() => setShowFilter(!showFilter)}
                            className="p-2 rounded-md bg-gray-100 hover:bg-gray-200"
                        >
                            <CiFilter className="text-xl" />
                        </button>

                        {showFilter && (
                        <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-xl shadow-xl z-50 p-4 space-y-3">
                            <h4 className="text-sm font-semibold text-gray-700 mb-2">Lọc sản phẩm</h4>
                            
                            <div className="flex items-center justify-between hover:bg-gray-50 px-2 py-1 rounded-md transition">
                            <label className="flex items-center space-x-2 cursor-pointer">
                                <input
                                type="checkbox"
                                checked={filterExpiring}
                                onChange={() => setFilterExpiring(!filterExpiring)}
                                className="accent-sky-500 w-4 h-4"
                                />
                                <span className="text-sm text-gray-800">Sắp hết hạn</span>
                            </label>
                            </div>

                            <div className="flex items-center justify-between hover:bg-gray-50 px-2 py-1 rounded-md transition">
                            <label className="flex items-center space-x-2 cursor-pointer">
                                <input
                                type="checkbox"
                                checked={filterLowStock}
                                onChange={() => setFilterLowStock(!filterLowStock)}
                                className="accent-sky-500 w-4 h-4"
                                />
                                <span className="text-sm text-gray-800">Sắp hết hàng</span>
                            </label>
                            </div>
                            
                            <div className="flex justify-end pt-2 border-t border-gray-100">
                            <button
                                onClick={() => {
                                setFilterExpiring(false);
                                setFilterLowStock(false);
                                }}
                                className="text-xs text-gray-500 hover:text-red-500 transition"
                            >
                                Đặt lại
                            </button>
                            </div>
                        </div>
                        )}
                    </div>
                </div>

                {/* <div className="mt-4 md:mt-0 mr-10">
                    <button className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600" 
                    onClick= {handleAddPrice}
                    >
                        <div className="flex items-center justify-center">
                            <MdAdd className="mr-2"/>
                            <p>Thêm giá</p>
                        </div>
                    </button>
                </div> */}
            </div>
            </div>

            <div className="min-h-96">
            <Table>
                <TableHeader>
                <TableRow>
                    <TableHead>Hình ảnh</TableHead>
                    <TableHead>Tên sản phẩm</TableHead>
                    <TableHead>Giá</TableHead>
                    <TableHead>Đơn vị</TableHead>
                    <TableHead>Số lượng</TableHead>
                    <TableHead>HSD</TableHead>
                    <TableHead>Trạng thái</TableHead>
                    <TableHead>Action</TableHead>
                </TableRow>
                </TableHeader>
                <TableBody>
                {loading ? (
                    <TableRow>
                    <TableCell colSpan="5">Loading...</TableCell>
                    </TableRow>
                ) : (
                    paginatedPrices.map((price) => (
                    <TableRow key={price.id}>
                        <TableCell>
                            <img className="size-[50px]" alt="" src={price.image}/>
                        </TableCell>
                        <TableCell>{truncateText(price.product.name, 40)}</TableCell>
                        <TableCell>{new Intl.NumberFormat('vi-VN').format(price.price)} đ</TableCell>
                        <TableCell>{price.unit.name}</TableCell>
                        <TableCell>{price.quantity}</TableCell>
                        <TableCell>
                            {new Date(price.dateExpiration).toLocaleDateString('vi-VN')}
                        </TableCell>
                        <TableCell>
                            <div className="flex flex-col gap-1">
                                {isLowStock(price.quantity) && (
                                <span className="inline-flex items-center gap-1 px-1 py-1 text-xs font-semibold text-orange-700 bg-orange-100 rounded-lg">
                                    <FaExclamationTriangle className="text-orange-500" />
                                    Sắp hết hàng
                                </span>
                                )}

                                {isExpiringSoon(price.dateExpiration) && (
                                <span className="inline-flex items-center gap-1 px-1 py-1 text-xs font-semibold text-red-700 bg-red-100 rounded-lg">
                                    <FaClock className="text-red-500" />
                                    Sắp hết hạn
                                </span>
                                )}

                                {!isLowStock(price.quantity) && !isExpiringSoon(price.dateExpiration) && (
                                <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold text-green-700 bg-green-100 rounded-full">
                                    <FaCheckCircle className="text-green-500" />
                                    Còn hàng
                                </span>
                                )}
                            </div>
                        </TableCell>
                        <TableCell>
                            <div className='flex'>
                                <button className="flex items-center justify-center p-2 rounded-lg bg-sky-200"
                                onClick={() => handleEditPrice(price)}>
                                    <FaRegEdit className="text-sky-400" /> 
                                </button>
                                <button className="flex items-center justify-center p-2 rounded-lg bg-red-200 ml-2"
                                onClick={() => handleDeleteClick(price.id)}>
                                    <FaRegTrashCan className="text-red-500" /> 
                                </button>
                            </div>
                        </TableCell>
                    </TableRow>
                    ))
                )}
                </TableBody>
            </Table>

            {/* Pagination */}
            <Pagination>
            <PaginationPrevious
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 0}
            />

            {Array.from({ length: Math.ceil(filteredPrices.length / size) }).map((_, idx) => (
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
                disabled={currentPage === Math.ceil(filteredPrices.length / size) - 1}
            />
        </Pagination>

            </div>
        </div>
        {isDeleteDialogOpen && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                <div className="bg-white p-6 rounded-md shadow-lg">
                    <h3 className="text-lg font-bold mb-4">Xác nhận xóa</h3>
                    <p className="mb-6">Bạn có chắc chắn muốn xóa giá sản phẩm này không?</p>
                    <div className="flex justify-end space-x-4">
                        <button
                            className="bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300"
                            onClick={handleCancelDelete}
                        >
                            Hủy
                        </button>
                        <button
                            className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600"
                            onClick={handleConfirmDelete}
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

export default Inventory;
