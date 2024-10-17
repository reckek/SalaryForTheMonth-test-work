import readXlsxFile from "read-excel-file";

enum parseTableFileErrors {
  fileNotUploaded = 0,
  incorrectFileFormat = 1,
  parseError = 2,
}

async function parseTableFile(file: File) {
  if (!file) return parseTableFileErrors.fileNotUploaded;

  if (file.type !== "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
    return parseTableFileErrors.incorrectFileFormat;
  }

  try {
    return await readXlsxFile(file, { trim: true });
  } catch (error) {
    return parseTableFileErrors.parseError;
  }
}

parseTableFile.errors = parseTableFileErrors;

export { parseTableFile, parseTableFileErrors };
