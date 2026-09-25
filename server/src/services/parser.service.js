const mammoth = require("mammoth");
const { cleanText, extractSections } = require("../utils/textCleaner");

/**
 * Extracts plain text from a PDF buffer
 */
async function parsePdf(buffer) {
  try {
    const pdfModule = require("pdf-parse");

    let text = "";
    if (pdfModule.PDFParse) {
      // v2 API
      const parser = new pdfModule.PDFParse({ data: buffer });
      const result = await parser.getText();
      text = result.text || "";
      if (typeof parser.destroy === "function") {
        await parser.destroy();
      }
    } else if (typeof pdfModule === "function") {
      // v1 API
      const result = await pdfModule(buffer);
      text = result.text || "";
    } else {
      throw new Error("Unsupported pdf-parse version");
    }

    return text;
  } catch (error) {
    throw new Error(`Failed to parse PDF document: ${error.message}`);
  }
}

/**
 * Extracts plain text from a DOCX buffer
 */
async function parseDocx(buffer) {
  try {
    const result = await mammoth.extractRawText({ buffer });
    return result.value || "";
  } catch (error) {
    throw new Error(`Failed to parse DOCX document: ${error.message}`);
  }
}

/**
 * Main parser entry point: extracts and cleans text, extracts sections, and validates content
 */
async function parseResumeFile(file) {
  if (!file || !file.buffer) {
    throw new Error("No file buffer provided for parsing");
  }

  const isPdf =
    file.mimetype === "application/pdf" ||
    file.originalname.toLowerCase().endsWith(".pdf");

  const isDocx =
    file.mimetype ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
    file.mimetype === "application/msword" ||
    file.originalname.toLowerCase().endsWith(".docx") ||
    file.originalname.toLowerCase().endsWith(".doc");

  let rawText = "";

  if (isPdf) {
    rawText = await parsePdf(file.buffer);
  } else if (isDocx) {
    rawText = await parseDocx(file.buffer);
  } else {
    throw new Error("Unsupported file format. Please upload a PDF or DOCX file.");
  }

  const cleaned = cleanText(rawText);

  // Check for scanned / empty text
  if (!cleaned || cleaned.length < 50) {
    throw new Error(
      "The uploaded document contains little or no readable text. If this is a scanned PDF, please upload a text-based PDF or DOCX file instead."
    );
  }

  const parsedSections = extractSections(cleaned);

  return {
    rawText,
    extractedText: cleaned,
    parsedSections,
  };
}

module.exports = {
  parseResumeFile,
  parsePdf,
  parseDocx,
};
