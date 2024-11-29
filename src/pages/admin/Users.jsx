import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getUsers } from '../../store/Reducers/userReducer';
import { Table, TableHeader, TableBody, TableRow, TableCell, TableHead, } from "../../components/ui/table"
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationPrevious,
    PaginationNext,
    PaginationEllipsis,
    } from "../../components/ui/pagination";  
import { FaSearch } from "react-icons/fa";
import { FiUserCheck, FiUserX } from 'react-icons/fi';

const Users = () => {

  const dispatch = useDispatch();
  const { allUsers, loading, totalPages, currentPage } = useSelector((state) => state.user);

  const ITEMS_PER_PAGE_OPTIONS = [5, 10, 20];

  const [size, setSize] = useState(ITEMS_PER_PAGE_OPTIONS[1]);

  useEffect(() => {
    dispatch(getUsers({ page: currentPage, size }));
  }, [dispatch, size, currentPage]);

  const handlePageChange = (page) => {
    dispatch(getUsers({ page, size }));
  }

  const handleItemsPerPageChange = (e) => {
    setSize(Number(e.target.value));
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
              allUsers.map((user) => (
                  <TableRow key={user.id}>
                      <TableCell>{user.username}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.dob}</TableCell>
                      <TableCell>{user.roles.map((role) => role.name).join(", ")}</TableCell>
                      <TableCell className={user.status ? "font-semibold text-green-500" : "font-semibold text-red-500"}>
                        {user.status ? "Active" : "Inactive"}
                      </TableCell>
                      <TableCell>
                        {user.status ? 
                          <button className="flex items-center justify-center p-2 rounded-lg bg-red-200 ml-2">
                            <FiUserX className="text-red-500" /> 
                          </button>
                          : 
                          <button className="flex items-center justify-center p-2 rounded-lg bg-green-200 ml-2">
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

        <button
          className="px-4 py-2 bg-[#41c5e5] text-white font-semibold rounded hover:bg-sky-500"
        >
          Create accounts
        </button>
      </div>  
    </div>
  </div>
  );
};

export default Users;