import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { banUsers, getUsers, unBanUsers } from '../../store/Reducers/userReducer';
import { Table, TableHeader, TableBody, TableRow, TableCell, TableHead, } from "../../components/ui/table"
import {
    Pagination,
    PaginationItem,
    PaginationLink,
    PaginationPrevious,
    PaginationNext,
    } from "../../components/ui/pagination";  
import { FaSearch } from "react-icons/fa";
import { FiUserCheck, FiUserX } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const Users = () => {

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { allUsers, loading, totalPages, currentPage } = useSelector((state) => state.user);

  const [UserToBan, setUserToBan] = useState(null);
  const [isBanDialogOpen, setIsBanDialogOpen] = useState(false);
  const [UserToUnban, setUserToUnban] = useState(null);
  const [isUnbanDialogOpen, setIsUnbanDialogOpen] = useState(false);

  const ITEMS_PER_PAGE_OPTIONS = [5, 10, 20];

  const [size, setSize] = useState(ITEMS_PER_PAGE_OPTIONS[0]);

  useEffect(() => {
    dispatch(getUsers({ page: currentPage, size }));
  }, [dispatch, size, currentPage]);

  const handlePageChange = (page) => {
    dispatch(getUsers({ page, size }));
  }

  const handleItemsPerPageChange = (e) => {
    setSize(Number(e.target.value));
  };

  const handleBanClick = (UserId) => {
    setUserToBan(UserId);
    setIsBanDialogOpen(true);
  };

  const handleConfirmBan = async () => {
      if (UserToBan) {
          try {
              await dispatch(banUsers(UserToBan));
              dispatch(getUsers({ page: currentPage, size }));
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
              await dispatch(unBanUsers(UserToUnban));
              dispatch(getUsers({ page: currentPage, size }));
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
          <h2 className="text-2xl font-bold mb-2">Quản lý người dùng</h2>
          <p>Đây là danh sách tất cả tài khoản người dùng!!</p>
          <div className="flex flex-col md:flex-row items-center w-full h-[85px] ">
            <div className="flex flex-col md:flex-row items-center w-[566px]">
              <label
                htmlFor="itemsPerPage"
                className="mb-2 md:mb-0 md:ml-2"
              >
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
              <label
                htmlFor="itemsPerPage"
                className="mb-2 md:mb-0 md:ml-2"
              >
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
          </div>
        </div>

        <div className="min-h-96">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Date of birth</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                  <TableCell colSpan="4">Loading...</TableCell>
              </TableRow>
            ) : (
              allUsers
              .filter(user => user.role.name.toLowerCase() !== 'admin')
              .map((user) => (
                  <TableRow key={user.id}>
                      <TableCell>{user.username}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.dob}</TableCell>
                      <TableCell>{user.role.name}</TableCell>
                      <TableCell>{user.phoneNumber}</TableCell>
                      <TableCell className={user.status ? "font-semibold text-green-500" : "font-semibold text-red-500"}>
                        {user.status ? "Active" : "Inactive"}
                      </TableCell>
                      <TableCell>
                        {user.status ? 
                          <button className="flex items-center justify-center p-2 rounded-lg bg-red-200 ml-2"
                          onClick={() => handleBanClick(user.id)}>
                            <FiUserX className="text-red-500" /> 
                          </button>
                          : 
                          <button className="flex items-center justify-center p-2 rounded-lg bg-green-200 ml-2"
                          onClick={() => handleUnbanClick(user.id)}>
                            <FiUserCheck className="text-green-500" />
                          </button>}
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
              <p className="mb-6">Bạn có chắc chắn muốn cấm người dùng này không?</p>
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
              <p className="mb-6">Bạn có chắc chắn muốn bỏ cấm người dùng này không?</p>
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

export default Users;