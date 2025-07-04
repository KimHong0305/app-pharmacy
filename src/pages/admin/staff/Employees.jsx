import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { banEmployee, getEmployees, unBanEmployee } from '../../../store/Reducers/userReducer';
import { Table, TableHeader, TableBody, TableRow, TableCell, TableHead } from "../../../components/ui/table";
import {
    Pagination,
    PaginationItem,
    PaginationLink,
    PaginationPrevious,
    PaginationNext,
} from "../../../components/ui/pagination";
import { MdAdd } from "react-icons/md";
import { useNavigate } from 'react-router-dom';
import { FaSearch, FaRegEdit } from "react-icons/fa";
import { FiUserCheck, FiUserX } from 'react-icons/fi';
import { toast } from 'react-toastify';

const Employees = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { allEmployees, loading, totalPages, currentPage } = useSelector((state) => state.user);

    const [roleName, setRoleName] = useState("NURSE");
    const ITEMS_PER_PAGE_OPTIONS = [5, 10, 20];
    const [size, setSize] = useState(ITEMS_PER_PAGE_OPTIONS[0]);

    const [UserToBan, setUserToBan] = useState(null);
    const [isBanDialogOpen, setIsBanDialogOpen] = useState(false);
    const [UserToUnban, setUserToUnban] = useState(null);
    const [isUnbanDialogOpen, setIsUnbanDialogOpen] = useState(false);

    useEffect(() => {
        dispatch(getEmployees({ role: roleName, size, page: currentPage }));
    }, [dispatch, size, currentPage, roleName]);

    const handlePageChange = (page) => {
        dispatch(getEmployees({ role: roleName, size, page }));
    }

    const handleItemsPerPageChange = (e) => {
        setSize(Number(e.target.value));
    };

    const handleAddEmployee = () => {
        navigate('/admin/employees/add');
    };

    const handleEditEmployee= (employee) => {
        console.log(employee)
        navigate(`/admin/employees/edit/${employee.id}`, { state: employee });
    };

    // Hàm xử lý chọn role
    const handleRoleChange = (role) => {
        setRoleName(role);
    }

    const handleBanClick = (UserId) => {
        setUserToBan(UserId);
        setIsBanDialogOpen(true);
    };
    
    const handleConfirmBan = async () => {
        if (UserToBan) {
            try {
                await dispatch(banEmployee(UserToBan));
                dispatch(getEmployees({ page: currentPage, size }));
                toast.success('Cấm người dùng thành công');
                setUserToBan(null);
                setIsBanDialogOpen(false);
            } catch (error) {
                toast.error(error.message);
            }
        }
    };
    
    const handleCancelBan = () => {
        setUserToBan(null);
        setIsBanDialogOpen(false);
    };
      
    const handleUnbanClick = (UserId) => {
        setUserToUnban(UserId);
        setIsUnbanDialogOpen(true);
    };
    
    const handleConfirmUnban = async () => {
        if (UserToUnban) {
            try {
                await dispatch(unBanEmployee(UserToUnban));
                dispatch(getEmployees({ page: currentPage, size }));
                toast.success('Bỏ cấm người dùng thành công');
                setUserToUnban(null);
                setIsUnbanDialogOpen(false);
            } catch (error) {
                toast.error(error.message);
            }
        }
    };
    
    const handleCancelUnban = () => {
        setUserToUnban(null);
        setIsUnbanDialogOpen(false);
    };

    return (
        <div className="px-2 md:px-4">
            <div className="flex flex-col p-4 rounded bg-white shadow-lg">
                <div className="text-black">
                    <div className='flex items-center justify-between'>
                        <div>
                            <h2 className="text-2xl font-bold mb-2">Quản lý nhân sự</h2>
                            <p>Đây là danh sách tất cả tài khoản nhân sự!!</p>
                        </div>
                        <div className="mr-10 flex">
                            <button
                                className={`cursor-pointer p-2 border-2 border-r-0 rounded-l-lg border-[#20397e]
                                    ${roleName === 'NURSE' ? 'bg-[#20397e] font-medium  text-white' : 'bg-[#daf3f9] text-[#20397e] hover:bg-blue-100'}`}
                                onClick={() => handleRoleChange('NURSE')}
                            >
                                Dược sĩ
                            </button>
                            <button
                                className={`cursor-pointer p-2 border-2 border-r-0 border-[#20397e]
                                    ${roleName === 'DOCTOR' ? 'bg-[#20397e] font-medium  text-white' : 'bg-[#daf3f9] text-[#20397e] hover:bg-blue-100'}`}
                                onClick={() => handleRoleChange('DOCTOR')}
                            >
                                Bác sĩ
                            </button>
                            <button
                                className={`cursor-pointer p-2 border-2 rounded-r-lg border-[#20397e]
                                    ${roleName === 'EMPLOYEE' ? 'bg-[#20397e] font-medium  text-white' : 'bg-[#daf3f9] text-[#20397e] hover:bg-blue-100'}`}
                                onClick={() => handleRoleChange('EMPLOYEE')}
                            >
                                Nhân viên
                            </button>
                        </div>
                    </div>
                    <div className="flex flex-col md:flex-row items-center w-full h-[85px] justify-between">
                        <div className="flex flex-col md:flex-row items-center w-[566px]">
                            <label htmlFor="itemsPerPage" className="mb-2 md:mb-0 md:ml-2">Show</label>
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
                            <label htmlFor="itemsPerPage" className="mb-2 md:mb-0 md:ml-2">entries</label>
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
                                onClick={handleAddEmployee}
                            >
                                <div className="flex items-center justify-center">
                                    <MdAdd className="mr-2" />
                                    <p>Thêm tài khoản</p>
                                </div>
                            </button>
                        </div>
                    </div>
                </div>

                <div className="min-h-96">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Image</TableHead>
                                <TableHead>Full Name</TableHead>
                                <TableHead>User Name</TableHead>
                                <TableHead>Phone</TableHead>
                                <TableHead>Date of birth</TableHead>
                                <TableHead>Specilization</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan="7">Loading...</TableCell>
                                </TableRow>
                            ) : (
                                allEmployees.map((user) => (
                                    <TableRow key={user.id}>
                                        <TableCell>
                                            <img className="size-[50px]" alt="" src={user.image}/>
                                        </TableCell>
                                        <TableCell>{`${user.lastname} ${user.firstname}`}</TableCell>
                                        <TableCell>{user.username}</TableCell>
                                        <TableCell>{user.phoneNumber}</TableCell>
                                        <TableCell>{user.dob}</TableCell>
                                        <TableCell>{user.specilization}</TableCell>
                                        <TableCell className={user.status ? "font-semibold text-green-500" : "font-semibold text-red-500"}>
                                            {user.status ? "Active" : "Inactive"}
                                        </TableCell>
                                        <TableCell>
                                            <div className='flex'>
                                                <button className="flex items-center justify-center p-2 rounded-lg bg-sky-200"
                                                onClick={() => handleEditEmployee(user)}
                                                >
                                                    <FaRegEdit className="text-sky-400" /> 
                                                </button>
                                                {user.status ? 
                                                    <button className="flex items-center justify-center p-2 rounded-lg bg-red-200 ml-2"
                                                    onClick={() => handleBanClick(user.id)}
                                                    >
                                                        <FiUserX className="text-red-500" /> 
                                                    </button>
                                                    : 
                                                    <button className="flex items-center justify-center p-2 rounded-lg bg-green-200 ml-2"
                                                    onClick={() => handleUnbanClick(user.id)}
                                                    >
                                                        <FiUserCheck className="text-green-500" />
                                                    </button>
                                                }
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
            {isBanDialogOpen && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                <div className="bg-white p-6 rounded-md shadow-lg">
                    <h3 className="text-lg font-bold mb-4">Xác nhận cấm</h3>
                    <p className="mb-6">Bạn có chắc chắn muốn cấm tài khoản này không?</p>
                    <div className="flex justify-end space-x-4">
                        <button
                            className="bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300"
                            onClick={handleCancelBan}
                        >
                            Hủy
                        </button>
                        <button
                            className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600"
                            onClick={handleConfirmBan}
                        >
                            Xác nhận
                        </button>
                    </div>
                </div>
            </div>
            )}

            {isUnbanDialogOpen && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                <div className="bg-white p-6 rounded-md shadow-lg">
                    <h3 className="text-lg font-bold mb-4">Xác nhận bỏ cấm</h3>
                    <p className="mb-6">Bạn có chắc chắn muốn bỏ cấm tài khoản này không?</p>
                    <div className="flex justify-end space-x-4">
                        <button
                            className="bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300"
                            onClick={handleCancelUnban}
                        >
                            Hủy
                        </button>
                        <button
                            className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600"
                            onClick={handleConfirmUnban}
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

export default Employees;