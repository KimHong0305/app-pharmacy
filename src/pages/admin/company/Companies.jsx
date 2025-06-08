import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { createCompany, deleteCompany, getCompanies } from '../../../store/Reducers/companyReducer';
import { Table, TableHeader, TableBody, TableRow, TableCell, TableHead } from "../../../components/ui/table";
import {
    Pagination,
    PaginationItem,
    PaginationLink,
    PaginationPrevious,
    PaginationNext,
} from "../../../components/ui/pagination";  
import { FaSearch, FaRegEdit } from "react-icons/fa";
import { FaRegTrashCan } from "react-icons/fa6";
import { IoIosAddCircleOutline } from "react-icons/io";
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const Companies = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { companies, loading, totalPages, currentPage } = useSelector((state) => state.company);
  const [companyName, setCompanyName] = useState('');
  const [origin, setOrigin] = useState('');
  const [logo, setLogo] = useState(null)
  const ITEMS_PER_PAGE_OPTIONS = [5, 10, 20];
  const [logoPreview, setLogoPreview] = useState(null);

  const [companyToDelete, setCompanyToDelete] = useState(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const [size, setSize] = useState(ITEMS_PER_PAGE_OPTIONS[0]);

  useEffect(() => {
    dispatch(getCompanies({ page: currentPage, size }));
  }, [dispatch, size, currentPage]);

  const handlePageChange = (page) => {
      dispatch(getCompanies({ page, size }));
  }

  const handleItemsPerPageChange = (e) => {
      setSize(Number(e.target.value));
  };

  const handleLogoChange = (event) => {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
            setLogoPreview(reader.result);
        };
        reader.readAsDataURL(file);
        setLogo(file);
    } else {
        setLogo(null);
    }
  };     

  const handleSubmit = async (e) => {
    e.preventDefault();
    const companyData = {
      name: companyName,
      origin: origin,
    };
    const formData = new FormData();
    formData.append("createCompany", new Blob([JSON.stringify(companyData)], { type: "application/json" }));
    formData.append('files', logo);

    for (let [key, value] of formData.entries()) {
      console.log(`${key}:`, value);
    }

    try {
      await dispatch(createCompany(formData)).unwrap();
      setCompanyName('');
      setOrigin('');
      setLogo(null);
      setLogoPreview(null);
      dispatch(getCompanies({ page: currentPage, size }));
      toast.success('Thêm công ty thành công')
    } catch (error) {
      console.error('Error creating company:', error);
    }
  };

  const handleDeleteClick = (productId) => {
    setCompanyToDelete(productId);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (companyToDelete) {
        try {
            await dispatch(deleteCompany(companyToDelete));
            dispatch(getCompanies({ page: currentPage, size }));
            toast.success('Xóa công ty thành công');
            setCompanyToDelete(null);
            setIsDeleteDialogOpen(false);
          } catch (error) {
            toast.error(error.message);
        }
    }
  };

  const handleCancelDelete = () => {
    setCompanyToDelete(null);
    setIsDeleteDialogOpen(false);
  };

  const handleEditCompany = (company) => {
    navigate(`/admin/companies/edit/${company.id}`, { state: company });
  };

  return (
    <div className="px-2 md:px-4">
    <div className="w-full grid grid-cols-1 md:grid-cols-5 gap-4">
    <div className="md:col-span-3">
      <div className="flex flex-col p-4 rounded bg-white shadow-lg">
        <div className="text-black">
          <h2 className="text-2xl font-bold mb-2">Quản lý công ty</h2>
          <p>Đây là danh sách tất cả các công ty!</p>
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
                    <TableHead>Logo</TableHead>
                    <TableHead>Tên công ty</TableHead>
                    <TableHead>Nguồn gốc</TableHead>
                    <TableHead>Action</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {loading ? (
                <TableRow>
                    <TableCell colSpan="4">Loading...</TableCell>
                </TableRow>
                ) : (
                companies.map((company) => (
                    <TableRow key={company.id}>
                        <TableCell>
                            <img className="size-[50px]" alt="" src={company.image}/>
                        </TableCell>
                        <TableCell>{company.name}</TableCell>
                        <TableCell>{company.origin}</TableCell> 
                        <TableCell>
                            <div className='flex'>
                                <button className="flex items-center justify-center p-2 rounded-lg bg-sky-200"
                                onClick={() => handleEditCompany(company)}>
                                    <FaRegEdit className="text-sky-400" /> 
                                </button>
                                <button className="flex items-center justify-center p-2 rounded-lg bg-red-200 ml-2"
                                onClick={() => handleDeleteClick(company.id)}>
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
        <div className="md:col-span-2">
            <div className="flex flex-col p-4 rounded bg-white shadow-lg">
                <h2 className="text-2xl font-bold mb-4">Tạo Công Ty Mới</h2>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                {/* Tên công ty */}
                <div>
                    <label htmlFor="companyName" className="block font-medium text-gray-700">Tên công ty</label>
                    <input
                    type="text"
                    id="companyName"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-md"
                    placeholder="Nhập tên công ty"
                    required
                    />
                </div>

                {/* Nguồn gốc */}
                <div>
                    <label htmlFor="origin" className="block font-medium text-gray-700">Nguồn gốc</label>
                    <input
                    type="text"
                    id="origin"
                    value={origin}
                    onChange={(e) => setOrigin(e.target.value)}
                    className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-md"
                    placeholder="Nhập nguồn gốc"
                    required
                    />
                </div>

                {/* Tải logo */}
                <div>
                    <label className="block font-medium text-gray-700">Tải logo</label>
                    <div className="mt-2">
                    <div className="file-input-container">
                      <input
                          type="file"
                          id="logo"
                          accept="image/*"
                          onChange={handleLogoChange}
                          className="hidden"
                      />
                      <label
                          htmlFor="logo"
                          className="flex items-center justify-center w-[150px] h-[100px] border-dashed border-2 border-gray-300 cursor-pointer"
                      >
                        {logoPreview ? (
                          <img
                            src={logoPreview}
                            alt="Logo Preview"
                            className="object-cover w-[150px] h-[90px]"
                          />
                        ) : (
                          <IoIosAddCircleOutline className="text-gray-300 text-4xl" />
                        )}
                      </label>
                  </div>
                  </div>
                </div>

                {/* Nút gửi */}
                <div className="flex justify-end">
                    <button
                    type="submit"
                    className="bg-green-500 text-white px-6 py-2 rounded-md hover:bg-green-600"
                    >
                    Tạo Công Ty
                    </button>
                </div>
                </form>
            </div>
        </div>
        {isDeleteDialogOpen && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                <div className="bg-white p-6 rounded-md shadow-lg">
                    <h3 className="text-lg font-bold mb-4">Xác nhận xóa</h3>
                    <p className="mb-6">Bạn có chắc chắn muốn xóa công ty này không?</p>
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
  </div>
  );
};

export default Companies;
