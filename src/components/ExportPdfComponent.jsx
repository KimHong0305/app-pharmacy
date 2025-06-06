import React, { useEffect, useRef } from 'react';
import jsPDF from 'jspdf';

const ExportPdfComponent = ({ order, addressDetail, onFinish }) => {
    const printRef = useRef();
    const hasExported = useRef(false);

    useEffect(() => {
        if (order && addressDetail && !hasExported.current) {
        exportPDF();
        hasExported.current = true;
        }
    }, [order, addressDetail]);

    const exportPDF = async () => {
        const element = printRef.current;
        if (!element) return;

        try {
            const html2canvasModule = await import('html2canvas/dist/html2canvas.esm.js');
            const html2canvas = html2canvasModule.default || html2canvasModule;

            const canvas = await html2canvas(element, {
                scale: 2,
                useCORS: true,
            });

            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a5');

            const pageWidth = pdf.internal.pageSize.getWidth();
            const pageHeight = pdf.internal.pageSize.getHeight();

            const imgWidth = pageWidth;
            const imgHeight = (canvas.height * imgWidth) / canvas.width;

            let position = 0;
            let heightLeft = imgHeight;

            pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;

            while (heightLeft > 0) {
                position -= pageHeight;
                pdf.addPage();
                pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
                heightLeft -= pageHeight;
            }

            pdf.save(`order-${order.id}.pdf`);
            if (onFinish) onFinish();
        } catch (error) {
            console.error('Export PDF failed:', error);
        }
    };

    if (!order || !addressDetail) return null;

    const { id, orderDate, orderItemResponses, address, paymentMethod, status, newTotalPrice, isConfirm } = order;

    return (
        <div style={{ position: 'absolute', left: '-9999px' }}>
            <div ref={printRef} style={{ width: '800px', padding: '20px', fontFamily: 'Arial' }}>
                <div style={{
                    borderBottom: '1px solid #ccc',
                    paddingBottom: '10px',
                    marginBottom: '20px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                }}>
                    <img
                        src="http://localhost:3000/images/logo.png"
                        alt="Logo cửa hàng"
                        style={{ height: '100px', objectFit: 'contain' }}
                    />

                    <div style={{ textAlign: 'right' }}>
                        <p style={{ fontSize: '14px', margin: 0, fontWeight: 'bold' }}>Mã đơn hàng:</p>
                        <p style={{ fontSize: '14px', margin: 0 }}>{id}</p>
                    </div>
                </div>

                <div style={{
                    borderBottom: '1px solid #ccc',
                    paddingBottom: '10px',
                    marginBottom: '20px',
                }}>
                    <p style={{ fontSize: '16px', margin: 0, fontWeight: 'bold' }}>Người nhận</p>
                    <p style={{ margin: '4px 0' }}>{address?.fullname}</p>
                    <p style={{ margin: '4px 0' }}>(+84) {address?.phone}</p>
                    <p style={{ margin: '4px 0' }}>
                        {address?.address}, {addressDetail?.ward?.WardName}, {addressDetail?.district?.DistrictName}, {addressDetail?.province?.ProvinceName}
                    </p>
                </div>

                <div style={{
                    borderBottom: '1px solid #ccc',
                    paddingBottom: '10px',
                    marginBottom: '20px',
                }}>
                    <p style={{ fontSize: '16px', margin: '0 0 10px 0', fontWeight: 'bold' }}>Nội dung hàng</p>

                    <div style={{ display: 'flex', fontWeight: 'bold', marginBottom: '8px' }}>
                        <div style={{ width: '60px' }}>STT</div>
                        <div style={{ flex: 1 }}>Tên sản phẩm</div>
                        <div style={{ width: '100px', textAlign: 'right' }}>Số lượng</div>
                    </div>

                    {orderItemResponses.map((item, index) => (
                        <div 
                            key={index} 
                            style={{ 
                                display: 'flex', 
                                marginBottom: '8px', 
                                paddingBottom: '4px' 
                            }}
                        >
                            <div style={{ width: '60px' }}>{index + 1}</div>
                            <div style={{ flex: 1 }}>{item.productName}</div>
                            <div style={{ width: '100px', textAlign: 'right' }}>
                                {item.quantity} {item.unitName}
                            </div>
                        </div>
                    ))}
                </div>


                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-end',
                    alignItems: 'flex-end',
                }}>
                    <p>Tiền thu người nhận:</p>
                    <p style={{ fontSize: '30px', fontWeight: 'bold' }}>
                        {paymentMethod === 'CASH' ? `${newTotalPrice.toLocaleString()} VND` : '0 VND'}
                    </p>
                </div>

            </div>
        </div>
    );
};

export default ExportPdfComponent;
