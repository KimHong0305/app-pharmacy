import { BiSolidStar } from "react-icons/bi";

const MembershipCard = ({ point }) => {
    const getRankDetails = (point) => {
        if (point > 8000) {
            return { rank: "KIM CƯƠNG", nextRank: null, remaining: 0, bgColor: "bg-blue-500" };
        } else if (point > 6000) {
            return { rank: "BẠCH KIM", nextRank: 8000, remaining: (8000 - point)*1000, bgColor: "bg-gray-500" };
        } else if (point > 4000) {
            return { rank: "VÀNG", nextRank: 6000, remaining: (6000 - point)*1000, bgColor: "bg-yellow-500" };
        } else if (point > 2000) {
            return { rank: "BẠC", nextRank: 4000, remaining: (4000 - point)*1000, bgColor: "bg-gray-300" };
        } else {
            return { rank: "ĐỒNG", nextRank: 2000, remaining: (2000 - point)*1000, bgColor: "bg-[#9e7c5b]" };
        }
    };

    const { rank, nextRank, remaining, bgColor } = getRankDetails(point);

    // Tính phần trăm tiến trình
    const progressPercent = nextRank ? ((point / nextRank) * 100).toFixed(1) : 100;

    return (
        <div className={`p-4 rounded-lg shadow-lg text-white ${bgColor} relative w-[300px]`}>
            <div className="flex items-center justify-between">
                <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-white text-yellow-500 flex items-center justify-center">
                        <span className="text-2xl"><BiSolidStar /></span>
                    </div>
                    <h2 className="ml-3 text-lg font-bold">{rank}</h2>
                </div>
                <div className="w-6 h-6 rounded-full bg-white text-blue-500 flex items-center justify-center">
                    💎
                </div>
            </div>

            {/* Thanh tiến trình */}
            <div className="mt-4">
                <div className="w-full h-2 bg-white rounded-full overflow-hidden">
                    <div
                        className={`h-full ${
                            rank === 'VÀNG' ? 'bg-[#90cef4]' : 'bg-yellow-500'
                        }`}
                        style={{ width: `${progressPercent}%` }}
                    ></div>
                </div>

                {nextRank && (
                    <p className="text-sm mt-2">
                        Chi tiêu thêm <strong>{remaining.toLocaleString()} ₫</strong> để thăng hạng
                    </p>
                )}
            </div>
        </div>
    );
};

export default MembershipCard;
