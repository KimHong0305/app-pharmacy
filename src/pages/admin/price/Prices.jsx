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

const Prices = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { prices, loading, totalPages, currentPage } = useSelector((state) => state.price);

    const ITEMS_PER_PAGE_OPTIONS = [5, 10, 20];
    const [size, setSize] = useState(ITEMS_PER_PAGE_OPTIONS[0]);

    const [priceToDelete, setPriceToDelete] = useState(null);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

    useEffect(() => {
        dispatch(getAllPrices({ page: currentPage, size }));
    }, [dispatch, size, currentPage]);

    const handlePageChange = (page) => {
        dispatch(getAllPrices({ page, size }));
    };

    const handleItemsPerPageChange = (e) => {
        setSize(Number(e.target.value));
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

    return (
        <div className="px-2 md:px-4">
        <div className="flex flex-col p-4 rounded bg-white shadow-lg">
            <div className="text-black">
            <h2 className="text-2xl font-bold mb-2">Quản lý giá</h2>
            <p>Đây là danh sách tất cả giá sản phẩm!</p>
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
                    // value={searchQuery}
                    // onChange={handleSearch}
                    className="border border-gray-400 hover:border-blue-500 rounded-md pl-10 pr-4 py-1 h-10"
                    placeholder="Search"
                    />
                </div>
                </div>
                <div className="mt-4 md:mt-0 mr-10">
                    <button className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600" 
                    onClick= {handleAddPrice}
                    >
                        <div className="flex items-center justify-center">
                            <MdAdd className="mr-2"/>
                            <p>Thêm giá</p>
                        </div>
                    </button>
                </div>
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
                    <TableHead>Action</TableHead>
                </TableRow>
                </TableHeader>
                <TableBody>
                {loading ? (
                    <TableRow>
                    <TableCell colSpan="5">Loading...</TableCell>
                    </TableRow>
                ) : (
                    prices.map((price) => (
                    <TableRow key={price.id}>
                        <TableCell>
                            <img className="size-[50px]" alt="" src={price.image}/>
                        </TableCell>
                        <TableCell>{price.product.name}</TableCell>
                        <TableCell>{new Intl.NumberFormat('vi-VN').format(price.price)} đ</TableCell>
                        <TableCell>{price.unit.name}</TableCell>
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

export default Prices;
