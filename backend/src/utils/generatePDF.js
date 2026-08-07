const pdf = require("pdfkit");
const fs = require("fs");
const path = require("path");

const generateReceiptPDF = (donation, donorName, donorEmail) => {
    return new Promise((resolve, reject) => {
        try {
            const receiptsDir = path.join(__dirname, "..", "..", "receipts");
            if (!fs.existsSync(receiptsDir)) {
                fs.mkdirSync(receiptsDir, { recursive: true });
            }

            const pdfPath = path.join(receiptsDir, `${donation.receiptNumber}.pdf`);
            const doc = new pdf({ margin: 50 });
            const writeStream = fs.createWriteStream(pdfPath);
            
            doc.pipe(writeStream);
            
            // Header
            doc.fontSize(22).font('Helvetica-Bold').text("Real Human Education & Charitable Trust", { align: "center" });
            doc.fontSize(10).font('Helvetica').text("1st Floor, DK Plaza Complex, New Naherunagar Nagar Main Road, Rajkot, Gujarat. 360002", { align: "center" });
            doc.text("Email: realhumantrust@gmail.com | Phone: +918735899909", { align: "center" });
            doc.moveDown(2);
            
            // Title
            doc.fontSize(16).font('Helvetica-Bold').text("DONATION RECEIPT", { align: "center", underline: true });
            doc.moveDown(2);
            
            // Details Left/Right
            doc.fontSize(12).font('Helvetica-Bold').text(`Receipt No: `, { continued: true }).font('Helvetica').text(`${donation.receiptNumber}`);
            doc.font('Helvetica-Bold').text(`Date: `, { continued: true }).font('Helvetica').text(`${new Date(donation.createdAt).toLocaleDateString()}`);
            doc.moveDown(1);
            
            // Donor Details
            doc.font('Helvetica-Bold').text("Received with thanks from:");
            doc.font('Helvetica').text(`Name: ${donorName}`);
            doc.text(`Email: ${donorEmail}`);
            if (donation.phone) doc.text(`Phone: ${donation.phone}`);
            doc.moveDown(1);
            
            // Amount
            doc.font('Helvetica-Bold').text(`Amount Received: `, { continued: true }).font('Helvetica').text(`INR ${donation.amount}/-`);
            if (donation.transactionId) {
                doc.font('Helvetica-Bold').text(`Transaction ID / UTR: `, { continued: true }).font('Helvetica').text(`${donation.transactionId}`);
            } else if (donation.paymentId) {
                doc.font('Helvetica-Bold').text(`Payment ID: `, { continued: true }).font('Helvetica').text(`${donation.paymentId}`);
            }
            doc.moveDown(2);
            
            // Tax Exemption Note
            doc.rect(50, doc.y, 500, 60).stroke();
            doc.moveDown(1);
            doc.fontSize(10).font('Helvetica-Bold').text("80G Tax Exemption Details:", { align: 'center' });
            doc.font('Helvetica').text("Donations are eligible for tax exemption under section 80G of the Income Tax Act, 1961.", { align: 'center' });
            doc.text("PAN: AAAAA0000A | 80G Registration No: RHT-80G-2023-XXXX", { align: 'center' });
            
            doc.moveDown(4);
            doc.fontSize(12).font('Helvetica-Bold').text("Authorized Signatory", { align: "right" });
            doc.fontSize(10).font('Helvetica').text("Real Human Education & Charitable Trust", { align: "right" });
            
            doc.end();

            writeStream.on("finish", () => {
                resolve(pdfPath);
            });

            writeStream.on("error", (err) => {
                reject(err);
            });
        } catch (error) {
            reject(error);
        }
    });
};

module.exports = { generateReceiptPDF };
