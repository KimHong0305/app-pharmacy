import React, { useEffect, useState } from 'react';
import { deleteCategory, getAllCategory } from '../../../store/Reducers/categoryReducer';
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
import { FaSearch, FaRegEdit } from "react-icons/fa";
import { FaRegTrashCan } from "react-icons/fa6";
import { MdAdd } from "react-icons/md";
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const Categories = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const ITEMS_PER_PAGE_OPTIONS = [5, 10, 20];
    const [size, setSize] = useState(ITEMS_PER_PAGE_OPTIONS[0]);
    const [currentPage, setCurrentPage] = useState(0);

    const { allCategory } = useSelector((state) => state.category);

    const totalItems = allCategory.length;
    const totalPages = Math.ceil(totalItems / size);

    const [categoryToDelete, setCategoryToDelete] = useState(null);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

    useEffect(() => {
        dispatch(getAllCategory({ page: currentPage, size }));
    }, [dispatch, currentPage, size]);

    const handlePageChange = (page) => {
        if (page >= 0 && page < totalPages) {
            setCurrentPage(page);
        }
    };

    const handleItemsPerPageChange = (e) => {
        setSize(Number(e.target.value));
        setCurrentPage(0);
    };

    const handleAddCategory= () => {
        navigate('/admin/addCategory');
    };

    const handleEditCategory= (category) => {
        navigate('/admin/editCategory', { state: category });
    };

    const handleDeleteClick = (categoryId) => {
        setCategoryToDelete(categoryId);
        setIsDeleteDialogOpen(true);
    };
    
    const handleConfirmDelete = async () => {
        if (categoryToDelete) {
            try {
                await dispatch(deleteCategory(categoryToDelete));
                dispatch(getAllCategory({ page: currentPage, size }));
                toast.success('Xóa danh mục thành công');
                setCategoryToDelete(null);
                setIsDeleteDialogOpen(false);
              } catch (error) {
                toast.error(error.message);
            }
        }
    };
    
    const handleCancelDelete = () => {
        setCategoryToDelete(null);
        setIsDeleteDialogOpen(false);
    };

    const paginatedCategories = allCategory.slice(currentPage * size, (currentPage + 1) * size);

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
                                    className="border border-gray-400 hover:border-blue-500 rounded-md pl-10 pr-4 py-1 h-10"
                                    placeholder="Search"
                                />
                            </div>
                        </div>
                        <div className="mt-4 md:mt-0 mr-10">
                            <button className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600" 
                            onClick= {handleAddCategory}
                            >
                                <div className="flex items-center justify-center">
                                    <MdAdd className="mr-2"/>
                                    <p>Thêm danh mục</p>
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
                                <TableHead>Tên danh mục</TableHead>
                                <TableHead>Danh mục cha</TableHead>
                                <TableHead>Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {paginatedCategories.map((category) => (
                                <TableRow key={category.id}>
                                    <TableCell>
                                        <img className="size-[50px]" src={category.image} />
                                    </TableCell>
                                    <TableCell>{category.name}</TableCell>
                                    <TableCell>{category.parent ? category.parent.name : 'Không có'}</TableCell>
                                    <TableCell>
                                        <div className='flex'>
                                            <button className="flex items-center justify-center p-2 rounded-lg bg-sky-200"
                                            onClick={() => handleEditCategory(category)}>
                                                <FaRegEdit className="text-sky-400" /> 
                                            </button>
                                            <button className="flex items-center justify-center p-2 rounded-lg bg-red-200 ml-2"
                                            onClick={() => handleDeleteClick(category.id)}>
                                                <FaRegTrashCan className="text-red-500" /> 
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
                    <p className="mb-6">Bạn có chắc chắn muốn xóa danh mục này không?</p>
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

export default Categories;
