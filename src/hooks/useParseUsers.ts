import { useCallback, useState } from "react";
import type { Row } from "read-excel-file";

type SalaryInMouth = number;

interface User {
  fio: string;
  years: Map<number, SalaryInMouth[]>;
}

class SerializeUsersErrors extends Error {}

const serializeUsers = (row: Row, rowIndex: string) => {
  const [fio, year, month, salary] = row;

  if (typeof fio !== "string" && fio !== null) {
    throw new SerializeUsersErrors(
      `Fio не является строкой или пустым значением на строке ${rowIndex}, его значение: ${fio}`
    );
  }

  if (typeof year !== "number") {
    throw new SerializeUsersErrors(
      `Год не является числом на строке ${rowIndex}, его значение: ${year}`
    );
  }

  if (typeof month !== "number" || month <= 0 || month > 12) {
    throw new SerializeUsersErrors(
      `Текущий месяц не является числом или является недопустимым месяцем в строке ${rowIndex}, его значение: ${month}`
    );
  }

  if (typeof salary !== "number") {
    throw new SerializeUsersErrors(
      `Зарплата не является числом в строке ${rowIndex}, его значение: ${salary}`
    );
  }

  return { fio, year, month, salary };
};

const useParseUsers = () => {
  const [users, setUsers] = useState<User[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const convertTableToUsers = useCallback((tableRows: Row[]) => {
    const slicedRows = tableRows.slice(1);

    const users: User[] = [];
    let targetUserIndex = -1;

    for (const rowIndex in slicedRows) {
      const row = slicedRows[rowIndex];

      let serializedData: ReturnType<typeof serializeUsers> | null = null;

      try {
        serializedData = serializeUsers(row, rowIndex);
      } catch (error) {
        if (error instanceof SerializeUsersErrors) {
          return setError(error.message);
        }
        return setError("Unknown error");
      }

      const { fio, year, month, salary } = serializedData;

      const user = !fio
        ? users[targetUserIndex]
        : ({ fio, years: new Map() } as User);

      if (fio) {
        targetUserIndex++;
        users.push(user);
      }

      if (!user.years.has(year)) {
        user.years.set(year, []);
      }

      const currentYear = user.years.get(year);

      if (!currentYear) {
        return;
      }

      currentYear[month - 1] = salary;
    }

    setUsers(users);
    setError(null);
  }, []);

  return {
    convertTableToUsers,
    users,
    error,
  };
};

export { useParseUsers };
export type { User as ParsedUser };
