import { useCallback, useState } from "react";
import { parseTableFile } from "../utils/parseTableFile";
import type { Row } from "read-excel-file";

export const useParseTableFile = () => {
  const [tableRows, setTableRows] = useState<Row[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const parseFile = useCallback(async (file: File) => {
    const rows = await parseTableFile(file);

    switch (rows) {
      case parseTableFile.errors.fileNotUploaded:
        return setError("File not uploaded");
      case parseTableFile.errors.incorrectFileFormat:
        return setError("Incorrect file format");
      case parseTableFile.errors.parseError:
        return setError("Parse error");
    }

    setTableRows(rows);
    setError(null);
  }, []);

  return {
    tableRows,
    error,
    parseFile,
  };
};
