import React, { useEffect} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getEmployeeInfo } from '../../store/Reducers/userReducer';

const ProfileNurse = () => {

    const dispatch = useDispatch();

    const { bio } = useSelector((state) => state.user); 

    useEffect(() => {
        dispatch(getEmployeeInfo());
      }, [dispatch]);

    return (
        <div>
            <div className="px-2 md:px-4">
                <div className="flex flex-col p-4 rounded bg-white shadow-lg">
                    <div className="text-black mb-4">
                        <h2 className="text-2xl font-bold mb-2">Thông tin cá nhân</h2>

                        <div className="flex flex-col md:flex-row gap-6 items-start relative">
                            {/* Ảnh đại diện */}
                            <div className="flex-shrink-0">
                                <img
                                src={bio.image}
                                alt="Avatar"
                                className="w-64 h-64 rounded-full object-cover border shadow-md"
                                />
                            </div>

                            {/* Thông tin + Trạng thái */}
                            <div className="flex-1 space-y-2 text-base text-gray-800 w-full">
                                {/* Dòng đầu gồm Họ tên và Trạng thái */}
                                <div className="flex items-center justify-between">
                                <div><strong>Họ và tên:</strong> {bio.lastname} {bio.firstname}</div>
                                <div>
                                    <span
                                    className={`inline-block px-2 py-1 text-sm rounded ${
                                        bio.status ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                    }`}
                                    >
                                    {bio.status ? 'Đang làm việc' : 'Ngưng hoạt động'}
                                    </span>
                                </div>
                                </div>

                                {/* Các thông tin khác */}
                                <div><strong>Tên đăng nhập:</strong> {bio.username}</div>
                                <div><strong>Ngày sinh:</strong> {bio.dob}</div>
                                <div><strong>Giới tính:</strong> {bio.sex}</div>
                                <div><strong>Số điện thoại:</strong> {bio.phoneNumber}</div>
                                <div><strong>Chuyên môn:</strong> {bio.specilization}</div>
                                <div><strong>Thời gian làm việc:</strong> {bio.workTime} năm</div>
                                <div>
                                <strong>Mức lương:</strong>{' '}
                                <span className="text-blue-700 font-semibold">
                                    {bio.salary?.toLocaleString()} VND
                                </span>
                                </div>
                            </div>
                        </div>

                        <div className="mt-6">
                            <h3 className="text-lg font-semibold mb-1">Giới thiệu</h3>
                            <p className="text-gray-700 whitespace-pre-line">{bio.description}</p>
                        </div>

                        <div className="mt-4">
                            <h3 className="text-lg font-semibold mb-1">Kinh nghiệm làm việc</h3>
                            <p className="text-gray-700 whitespace-pre-line">{bio.workExperience}</p>
                        </div>

                        <div className="mt-4">
                            <h3 className="text-lg font-semibold mb-1">Trình độ học vấn</h3>
                            <p className="text-gray-700 whitespace-pre-line">{bio.education}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileNurse;