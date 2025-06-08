import * as pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from "pdfmake/build/vfs_fonts";
import certificateImg from "../assets/certificate-template.png";

pdfMake.vfs = pdfFonts.vfs;

export function exportCertificatePDF(data) {
  const imgToBase64 = src =>
    new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = src;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);
        const dataURL = canvas.toDataURL("image/png");
        resolve(dataURL);
      };
      img.onerror = reject;
    });

  imgToBase64(certificateImg).then(base64Image => {
    const docDefinition = {
      pageSize: "A4",
      background: [
        {
          image: base64Image,
          width: 595.28,
          absolutePosition: { x: 0, y: 0 },
        },
      ],
       content: [
  // Tên người nhận – giữa trang
  {
    text: data.title || "Người nhận",
    absolutePosition: { x: 0, y: 295 },
    alignment: "center",
    fontSize: 20,
    bold: true,
    width: 595.28,
  },

  // Góc trái – Loại chứng chỉ & Nội dung (cao hơn)
  {
    text: `Loại chứng chỉ: ${data.certificateType?.certificateTitle || "..."}`,
    absolutePosition: { x: 80, y: 430 },
    fontSize: 12,
    color: "#000000"
  },
  {
    text: `Nội dung: ${data.contentCert || "..."}`,
    absolutePosition: { x: 80, y: 450 },
    fontSize: 12,
    color: "#000000"
  },

  // Góc phải – Người ký & Ngày cấp (cao và căn phải)
  {
    text: `Người ký: ${data.signCert || "..."}`,
    absolutePosition: { x: 345, y: 430 },
    fontSize: 12,
    alignment: "right",
    width: 170,
    color: "#000000"
  },
  {
    text: `Ngày cấp: ${data.dateCert ? new Date(data.dateCert).toLocaleDateString("vi-VN") : "..."}`,
    absolutePosition: { x: 345, y: 450 },
    fontSize: 12,
    alignment: "right",
    width: 170,
    color: "#000000"
  },
],


      defaultStyle: {
        font: "Roboto",
      },
    };

    pdfMake.createPdf(docDefinition).download("certificate.pdf");
  });
}
