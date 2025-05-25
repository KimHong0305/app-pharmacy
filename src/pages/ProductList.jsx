import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { getProductByCategory } from "../store/Reducers/productReducer";
import Footer from "../components/Footer";
import Header from "../components/Header";
import { getChildCategory } from "../store/Reducers/categoryReducer";

const ProductList = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    const categoryName = location.state?.categoryName;
    const { categoryId } = useParams();
    const products = useSelector((state) => state.product.products);
    const { childCategories } = useSelector((state) => state.category);

    const [sortOrder, setSortOrder] = useState("asc");
    const [minPrice, setMinPrice] = useState("");
    const [maxPrice, setMaxPrice] = useState("");
    const [minPriceDisplay, setMinPriceDisplay] = useState("");
    const [maxPriceDisplay, setMaxPriceDisplay] = useState("");
    const [filteredProducts, setFilteredProducts] = useState([]);

    useEffect(() => {
        dispatch(getProductByCategory({ page: 0, size: 50, categoryId, sortOrder }));
        dispatch(getChildCategory(categoryId));
    }, [dispatch, categoryId, sortOrder]);

    useEffect(() => {
        setFilteredProducts(products);
    }, [products]);

    const formatCurrency = (value) => {
        return value
        ? new Intl.NumberFormat("vi-VN").format(parseInt(value, 10))
        : "";
    };

    const handleMinPriceChange = (e) => {
        const numericValue = e.target.value.replace(/[^0-9]/g, "");
        setMinPrice(numericValue);
        setMinPriceDisplay(formatCurrency(numericValue));
    };

    const handleMaxPriceChange = (e) => {
        const numericValue = e.target.value.replace(/[^0-9]/g, "");
        setMaxPrice(numericValue);
        setMaxPriceDisplay(formatCurrency(numericValue));
    };

    const handleProductClick = (productId) => {
        navigate(`/products/${productId}`);
    };

    const handleCategoryClick = (categoryId, categoryName) => {
        navigate(`/categories/${categoryId}/products`, { state: { categoryName } });
    };

    const handleSortOrderChange = (order) => {
        setSortOrder(order);
    };

    const handleApplyFilter = () => {
        if (!products || products.length === 0) {
        setFilteredProducts([]);
        return;
        }

        const filtered = products.filter((product) => {
        const price = product.prices?.[0]?.price || 0;
        const isValidMin = minPrice ? price >= parseFloat(minPrice) : true;
        const isValidMax = maxPrice ? price <= parseFloat(maxPrice) : true;
        return isValidMin && isValidMax;
        });

        setFilteredProducts(filtered);
    };

    return (
        <div>
        <Header />
        <div className="container mx-auto px-4 md:px-8 lg:px-16 max-w-screen-xl my-10">
            <p className="text-2xl font-semibold">{categoryName}</p>
            <div className="grid grid-cols-4 gap-6 md:grid-cols-[repeat(auto-fill,136px)] md:pb-4">
            {childCategories.map((child) => (
                <a
                key={child.id}
                className="cursor-pointer grid w-fit content-start justify-center justify-items-center gap-2"
                onClick={() => handleCategoryClick(child.id, child.name)}
                >
                <span className="relative h-[calc(76rem/16)] w-[calc(76rem/16)] overflow-hidden rounded-full md:h-[calc(136rem/16)] md:w-[calc(136rem/16)]">
                    <img
                    className="h-full w-full object-cover p-4"
                    src={child.image || "https://via.placeholder.com/130"}
                    alt={child.name}
                    />
                </span>
                <p className="text-center text-sm font-medium">{child.name}</p>
                </a>
            ))}
            </div>

            <div className="container relative grid grid-cols-1 items-start gap-3 md:grid-cols-[193px,1fr]">
            {/* Bộ lọc */}
            <div className="px-1">
                <div className="flex justify-between py-5">
                <p className="font-semibold">Bộ lọc</p>
                <button
                    className="text-blue-600 font-semibold"
                    onClick={() => {
                    setMinPrice("");
                    setMaxPrice("");
                    setMinPriceDisplay("");
                    setMaxPriceDisplay("");
                    setFilteredProducts(products);
                    }}
                >
                    Thiết lập lại
                </button>
                </div>
                <div className="grid gap-4">
                    <p className="text-sm font-semibold">Khoảng giá</p>
                    <div className="flex items-center border border-gray-300 rounded-md px-3 py-1 w-full">
                        <input
                        type="text"
                        placeholder="Tối thiểu"
                        value={minPriceDisplay}
                        onChange={handleMinPriceChange}
                        className="flex-1 bg-transparent focus:outline-none text-gray-900 placeholder-gray-500 w-0"
                        />
                        <span className="text-gray-500 ml-1">đ</span>
                    </div>
                    <div className="flex items-center border border-gray-300 rounded-md px-3 py-1 w-full">
                        <input
                        type="text"
                        placeholder="Tối đa"
                        value={maxPriceDisplay}
                        onChange={handleMaxPriceChange}
                        className="flex-1 bg-transparent focus:outline-none text-gray-900 placeholder-gray-500 w-0"
                        />
                        <span className="text-gray-500 ml-1">đ</span>
                    </div>
                    <button
                        className="w-full h-8 px-3 rounded-md bg-sky-500 hover:bg-sky-700 text-white text-sm font-semibold"
                        onClick={handleApplyFilter}
                    >
                        Áp dụng
                    </button>
                </div>
            </div>

            {/* Danh sách sản phẩm */}
            <div className="px-1">
                <div className="flex py-3">
                <div className="flex gap-4 items-center justify-start">
                    <p className="text-sm font-semibold">Sắp xếp theo: </p>
                    <button
                    className={`px-4 py-2 border rounded-md text-sm font-semibold ${
                        sortOrder === "desc"
                        ? "border-blue-600 text-blue-600"
                        : "text-gray-600 border-gray-300 hover:bg-gray-100"
                    }`}
                    onClick={() => handleSortOrderChange("desc")}
                    >
                    Giá giảm dần
                    </button>
                    <button
                    className={`px-4 py-2 border rounded-md text-sm font-semibold ${
                        sortOrder === "asc"
                        ? "border-blue-600 text-blue-600"
                        : "text-gray-600 border-gray-300 hover:bg-gray-100"
                    }`}
                    onClick={() => handleSortOrderChange("asc")}
                    >
                    Giá tăng dần
                    </button>
                </div>
                </div>

                {/* Hiển thị sản phẩm */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                    {filteredProducts.length > 0 ? (
                        filteredProducts.map((item) => (
                        <div
                            key={item.id}
                            className="flex flex-col items-center justify-between border border-gray-200 hover:shadow-xl bg-white rounded-lg p-3 cursor-pointer transition-all duration-300 min-w-[160px] max-w-[230px] w-full mx-auto"
                            onClick={() => handleProductClick(item.id)}
                        >
                            <img
                                className="w-full aspect-[4/3] object-cover rounded-md"
                                src={item.image}
                                alt={item.name}
                            />
                            <span className="mt-2 font-medium text-center line-clamp-2 text-sm text-gray-800">
                                {item.name}
                            </span>
                            <span className="mt-1 font-semibold text-sky-600 text-base">
                                {item.prices?.[0]?.price?.toLocaleString("vi-VN")} đ /{" "}
                                {item.prices?.[0]?.unit?.name}
                            </span>
                            <button className="mt-2 h-8 w-full rounded-md bg-sky-500 hover:bg-sky-700 text-white text-sm font-semibold">
                                Chọn sản phẩm
                            </button>
                        </div>
                        ))
                    ) : (
                        <p className="text-center col-span-full">Không có sản phẩm nào!</p>
                    )}
                </div>
            </div>
            </div>
        </div>
        <Footer />
        </div>
    );
};

export default ProductList;
