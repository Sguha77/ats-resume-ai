import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";
import { Document, Packer, Paragraph, TextRun } from "docx";

export const generateResumePDF = (resumeText, filePath) => {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 50 });
    const stream = fs.createWriteStream(filePath);
    doc.pipe(stream);
    doc.font("Times-Roman").fontSize(11).text(resumeText, { align: "left" });
    doc.end();
    stream.on("finish", resolve);
    stream.on("error", reject);
  });
};

export const generateResumeDocx = async (resumeText, filePath) => {
  const lines = resumeText.split(/\\r?\\n/).filter(Boolean);
  const doc = new Document({
    sections: [{ children: lines.map(line => new Paragraph({ children: [ new TextRun(line) ] })) }]
  });
  const buffer = await Packer.toBuffer(doc);
  await fs.promises.writeFile(filePath, buffer);
};
