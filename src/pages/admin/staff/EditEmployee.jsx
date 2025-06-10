import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { IoReturnDownBackSharp } from "react-icons/io5";
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { updateEmployee } from '../../../store/Reducers/userReducer';

const EditEmployee = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const location = useLocation();
    const employee = location.state;

    const [username] = useState(employee?.username || '');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [firstname, setFirstname] = useState(employee?.firstname || '');
    const [lastname, setLastname] = useState(employee?.lastname || '');
    const [dob, setDob] = useState(employee?.dob?.split('/').reverse().join('-') || '');
    const [phoneNumber, setPhoneNumber] = useState(employee?.phoneNumber || '');
    const [sex, setSex] = useState(employee?.sex || '');
    const [specilization, setSpecilization] = useState(employee?.specilization || '');
    const [description, setDescription] = useState(employee?.description || '');
    const [workExperience, setWorkExperience] = useState(employee?.workExperience || '');
    const [education, setEducation] = useState(employee?.education || '');
    const [workTime, setWorkTime] = useState(employee?.workTime || '');
    const [salary, setSalary] = useState(employee?.salary?.toLocaleString('vi-VN') || '');
    const [role, setRole] = useState(employee?.role.name || '');
    const [avatar, setAvatar] = useState(null);

    const handleGoBack = () => navigate(-1);

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) setAvatar(file);
    };

    const formatDate = (isoDate) => {
        const [year, month, day] = isoDate.split('-');
        return `${day}/${month}/${year}`;
    };

    const formatCurrency = (value) => {
        const number = value.replace(/\D/g, '');
        return Number(number).toLocaleString('vi-VN');
    };

    const handleSalaryChange = (e) => {
        const raw = e.target.value;
        const formatted = formatCurrency(raw);
        setSalary(formatted);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password && password !== confirmPassword) {
            toast.error('Mật khẩu không khớp');
            return;
        }

        const employeeData = {
            id: employee.id,
            firstname,
            lastname,
            dob: formatDate(dob),
            phoneNumber,
            sex,
            specilization,
            description,
            workExperience,
            education,
            workTime,
            salary: Number(salary.replace(/\./g, '')),
            role,
        };

        if (password) {
            employeeData.password = password;
            employeeData.confirmPassword = confirmPassword;
        }

        const formData = new FormData();
        formData.append("updateEmployee", new Blob([JSON.stringify(employeeData)], { type: "application/json" }));

        if (avatar) {
            formData.append("file", avatar);
        }

        try {
            await dispatch(updateEmployee(formData)).unwrap();
            toast.success('Cập nhật nhân viên thành công!');
            navigate('/admin/employees');
        } catch (err) {
            toast.error(err.message || 'Cập nhật thất bại!');
        }
    };

    return (
        <div className="px-2 md:px-4">
            <div className="p-4 rounded bg-white shadow-lg">
                <div className="min-h-96">
                    <span onClick={handleGoBack} className="inline-block cursor-pointer">
                        <IoReturnDownBackSharp className="inline-block" />
                        <button className="inline-block ml-5">Quay lại</button>
                    </span>
                    <div className='py-5'>
                        <h2 className="text-center text-2xl font-bold mb-2">Cập nhật tài khoản</h2>
                        <form onSubmit={handleSubmit} className="px-16 md:px-32 lg:px-48 space-y-4">

                            <div>
                                <label className="block font-medium">Ảnh đại diện</label>
                                <input type="file" accept="image/*" onChange={handleAvatarChange}
                                       className="w-full border border-gray-300 rounded px-3 py-2 mt-1" />
                                {(avatar || employee.image) && (
                                    <img
                                        src={avatar ? URL.createObjectURL(avatar) : employee.image}
                                        alt="Avatar preview"
                                        className="mt-2 w-24 h-24 object-cover rounded-full border"
                                    />
                                )}
                            </div>

                            <div>
                                <label className="block font-medium">Tên đăng nhập</label>
                                <input type="text" value={username} disabled
                                       className="w-full border bg-gray-100 border-gray-300 rounded px-3 py-2 mt-1" />
                            </div>

                            {/* <div>
                                <label className="block font-medium">Mật khẩu mới (bỏ trống nếu không đổi)</label>
                                <input type="password" value={password} onChange={e => setPassword(e.target.value)}
                                       className="w-full border border-gray-300 rounded px-3 py-2 mt-1" />
                            </div>

                            <div>
                                <label className="block font-medium">Xác nhận mật khẩu</label>
                                <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)}
                                       className="w-full border border-gray-300 rounded px-3 py-2 mt-1" />
                            </div> */}

                            {/* Họ & Tên trên cùng một dòng */}
                            <div className="flex gap-4">
                                <div className="w-1/2">
                                    <label className="block font-medium">Họ</label>
                                    <input type="text" value={lastname} onChange={e => setLastname(e.target.value)}
                                           className="w-full border border-gray-300 rounded px-3 py-2 mt-1" required />
                                </div>
                                <div className="w-1/2">
                                    <label className="block font-medium">Tên</label>
                                    <input type="text" value={firstname} onChange={e => setFirstname(e.target.value)}
                                           className="w-full border border-gray-300 rounded px-3 py-2 mt-1" required />
                                </div>
                            </div>

                            {/* Các trường khác */}
                            <div>
                                <label className="block font-medium">Ngày sinh</label>
                                <input type="date" value={dob} onChange={e => setDob(e.target.value)}
                                       className="w-full border border-gray-300 rounded px-3 py-2 mt-1" required />
                            </div>

                            <div>
                                <label className="block font-medium">Số điện thoại</label>
                                <input type="text" value={phoneNumber} onChange={e => setPhoneNumber(e.target.value)}
                                       className="w-full border border-gray-300 rounded px-3 py-2 mt-1" required />
                            </div>

                            <div>
                                <label className="block font-medium">Giới tính</label>
                                <select
                                    value={sex}
                                    onChange={e => setSex(e.target.value)}
                                    className="w-full border border-gray-300 rounded px-3 py-2 mt-1"
                                    required
                                >
                                    <option value="">-- Chọn giới tính --</option>
                                    <option value="Nam">Nam</option>
                                    <option value="Nữ">Nữ</option>
                                </select>
                            </div>

                            <div>
                                <label className="block font-medium">Chuyên môn</label>
                                <input type="text" value={specilization} onChange={e => setSpecilization(e.target.value)}
                                       className="w-full border border-gray-300 rounded px-3 py-2 mt-1" required />
                            </div>

                            <div>
                                <label className="block font-medium">Mô tả công việc</label>
                                <textarea value={description} onChange={e => setDescription(e.target.value)}
                                          className="w-full border border-gray-300 rounded px-3 py-2 mt-1" rows={3} />
                            </div>

                            <div>
                                <label className="block font-medium">Kinh nghiệm làm việc</label>
                                <textarea type="text" value={workExperience} onChange={e => setWorkExperience(e.target.value)}
                                       className="w-full border border-gray-300 rounded px-3 py-2 mt-1" rows={3}/>
                            </div>

                            <div>
                                <label className="block font-medium">Học vấn</label>
                                <textarea type="text" value={education} onChange={e => setEducation(e.target.value)}
                                       className="w-full border border-gray-300 rounded px-3 py-2 mt-1" rows={3}/>
                            </div>

                            <div>
                                <label className="block font-medium">Thời gian làm việc (năm)</label>
                                <input type="number" value={workTime} onChange={e => setWorkTime(Number(e.target.value))}
                                       className="w-full border border-gray-300 rounded px-3 py-2 mt-1" />
                            </div>

                            <div>
                                <label className="block font-medium">Mức lương</label>
                                <input
                                    type="text"
                                    value={salary}
                                    onChange={handleSalaryChange}
                                    className="w-full border border-gray-300 rounded px-3 py-2 mt-1"
                                />
                            </div>

                            <div>
                                <label className="block font-medium">Chức vụ</label>
                                <select
                                    value={role}
                                    onChange={e => setRole(e.target.value)}
                                    className="w-full border border-gray-300 rounded px-3 py-2 mt-1"
                                    required
                                >
                                    <option value="">-- Chọn chức vụ --</option>
                                    <option value="EMPLOYEE">Nhân viên</option>
                                    <option value="NURSE">Dược sĩ</option>
                                    <option value="DOCTOR">Bác sĩ</option>
                                </select>
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded"
                            >
                                Cập nhật nhân viên
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditEmployee;
