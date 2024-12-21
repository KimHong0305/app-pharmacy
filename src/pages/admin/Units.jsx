import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getUnits, createUnit, deleteUnit, updateUnit } from "../../store/Reducers/unitReducer";
import { Table, TableHeader, TableBody, TableRow, TableCell, TableHead } from "../../components/ui/table";
import {
  Pagination,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
} from "../../components/ui/pagination";
import { FaSearch, FaRegEdit } from "react-icons/fa";
import { FaRegTrashCan } from "react-icons/fa6";
import { toast } from 'react-toastify';
import { IoCloseSharp } from "react-icons/io5";

const Units = () => {
    const dispatch = useDispatch();

    const { units, loading, currentPage, totalPages } = useSelector((state) => state.unit);

    const ITEMS_PER_PAGE_OPTIONS = [5, 10, 20];
    const [size, setSize] = useState(ITEMS_PER_PAGE_OPTIONS[0]);
    const [searchQuery, setSearchQuery] = useState("");
    const [unitName, setUnitName] = useState("");
    const [unitNameUpdate, setUnitUpdateName] = useState("");
    const [editUnit, setEditUnit] = useState(null);

    const [unitToDelete, setUnitToDelete] = useState(null);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);


    useEffect(() => {
        dispatch(getUnits({ page: currentPage, size }));
    }, [dispatch, currentPage, size]);

    const handleItemsPerPageChange = (e) => {
        setSize(Number(e.target.value)); 
        dispatch(getUnits({ page: 0, size: Number(e.target.value) }));
    };

    const handlePageChange = (page) => {
        if (page >= 0 && page < totalPages) {
        dispatch(getUnits({ page, size }));
        }
    };   

    const handleInputChange = (e) => {
        setUnitName(e.target.value);
    };

    const handleInputUpdateChange = (e) => {
        setUnitUpdateName(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (unitName.trim()) {
            try {
                await dispatch(createUnit({ name: unitName })).unwrap();
                dispatch(getUnits({ page: currentPage, size }));
                toast.success('Thêm đơn vị thành công');
                setUnitName("");
            } catch (error) {
                toast.error(error.message);
            }
        }
    };

    const handleDeleteClick = (unitId) => {
        setUnitToDelete(unitId);
        setIsDeleteDialogOpen(true);
    };
    
    const handleConfirmDelete = async () => {
        if (unitToDelete) {
            await dispatch(deleteUnit(unitToDelete));
            dispatch(getUnits({ page: currentPage, size }));
            toast.success('Xóa đơn vị thành công');
            setUnitToDelete(null);
            setIsDeleteDialogOpen(false);
        }
    };
    
    const handleCancelDelete = () => {
        setUnitToDelete(null);
        setIsDeleteDialogOpen(false);
    };
    
    
    const handleEditClick = (unit) => {
        setEditUnit(unit);
        setUnitUpdateName(unit.name);
    };

    const handleUpdateSubmit = async (e) => {
        e.preventDefault();
        if (editUnit && unitNameUpdate.trim()) {
            const unit = {
                id: editUnit.id,
                name: unitNameUpdate
            }
            try {
                await dispatch(updateUnit(unit)).unwrap();
                dispatch(getUnits({ page: currentPage, size }));
                toast.success('Cập nhật đơn vị thành công');
                setEditUnit(null);
                setUnitUpdateName("");
            } catch (error) {
                toast.error(error.message);
            }
        }
    };

    const handleSearch = (e) => setSearchQuery(e.target.value);

    return (
        <div className="px-2 md:px-4">
        <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2">
        <div className="flex flex-col p-4 rounded bg-white shadow-lg">
            <div className="text-black">
            <h2 className="text-2xl font-bold mb-2">Quản lý đơn vị sản phẩm</h2>
            <p>Đây là danh sách tất cả đơn vị sản phẩm!</p>
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
                {/* <div className="mt-4 md:mt-0 mr-10">
                    <button className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600">
                        <div className="flex items-center justify-center">
                            <MdAdd className="mr-2"/>
                            <p>Thêm đơn vị</p>
                        </div>
                    </button>
                </div> */}
            </div>
            </div>

            <div className="min-h-96 flex flex-col">
                    <Table>
                        <TableHeader>
                        <TableRow>
                            <TableHead>Tên đơn vị</TableHead>
                            <TableHead>Action</TableHead>
                        </TableRow>
                        </TableHeader>
                        <TableBody>
                        {loading ? (
                            <TableRow>
                            <TableCell colSpan="2">Loading...</TableCell>
                            </TableRow>
                        ) : (
                            units.map((unit) => (
                            <TableRow key={unit.id}>
                                <TableCell>
                                    {unit.name}
                                </TableCell>
                                <TableCell>
                                    <div className='flex'>
                                        <button className="flex items-center justify-center p-2 rounded-lg bg-sky-200"
                                         onClick={() => handleEditClick(unit)}>
                                            <FaRegEdit className="text-sky-400" /> 
                                        </button>
                                        <button className="flex items-center justify-center p-2 rounded-lg bg-red-200 ml-2"
                                        onClick={() => handleDeleteClick(unit.id)}
                                        >
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
                    </div>

                    <div className="md:col-span-1">
                    <div className="flex flex-col p-4 rounded bg-white shadow-lg">
                        <div className="flex flex-col items-center justify-center">
                        <p className="text-2xl font-bold mb-2">Thêm đơn vị</p>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="flex flex-col items-start justify-center">
                                <label htmlFor="unitName" className="font-semibold mb-2">Tên đơn vị</label>
                                <input
                                    type="text"
                                    id="unitName"
                                    value={unitName}
                                    onChange={handleInputChange}
                                    className="border border-gray-300 rounded-md p-2"
                                    placeholder="Nhập tên đơn vị"
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600"
                            >
                                Thêm
                            </button>
                        </form>
                        </div>
                    </div>

                    {editUnit && (
                        <div className="flex flex-col p-4 rounded bg-white shadow-lg mt-10">
                            <div className="flex flex-col items-center justify-center relative">
                                <button className='absolute top-1 right-1'
                                onClick={() => {
                                    setEditUnit(null);
                                    setUnitUpdateName("");
                                }}>
                                    <IoCloseSharp className='h-6 w-6'/>
                                </button>
                                <p className="text-2xl font-bold mb-2">Sửa đơn vị</p>
                                <form onSubmit={handleUpdateSubmit} className="space-y-4">
                                    <div className="flex flex-col items-start justify-center">
                                        <label htmlFor="unitName" className="font-semibold mb-2">Tên đơn vị</label>
                                        <input
                                            type="text"
                                            id="unitName"
                                            value={unitNameUpdate}
                                            onChange={handleInputUpdateChange}
                                            className="border border-gray-300 rounded-md p-2"
                                            placeholder="Nhập tên đơn vị"
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        className="w-full bg-sky-500 text-white py-2 px-4 rounded-md hover:bg-sky-500"
                                    >
                                        Cập nhật
                                    </button>
                                </form>
                            </div>
                        </div>
                    )}

                </div>
            </div>
            {isDeleteDialogOpen && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                <div className="bg-white p-6 rounded-md shadow-lg">
                    <h3 className="text-lg font-bold mb-4">Xác nhận xóa</h3>
                    <p className="mb-6">Bạn có chắc chắn muốn xóa đơn vị này không?</p>
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

export default Units;
