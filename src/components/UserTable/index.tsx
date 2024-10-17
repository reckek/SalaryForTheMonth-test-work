import { type FC, useMemo } from "react";
import type { ParsedUser } from "../../hooks/useParseUsers";
import styles from "./UserTable.module.css";

interface UserTableProps {
  users: ParsedUser[];
}

const vacationPercent = 0.287;

const UserRow: FC<{ user: ParsedUser }> = ({ user }) => {
  const totalSalary = useMemo<number>(() => {
    const { years } = user;
    let totalSalary = 0;

    // Суммируем заработную плату за каждый месяц в году
    for (const months of years.values()) {
      totalSalary += months.reduce((acc, month) => acc + month, 0);
    }

    return totalSalary;
  }, [user]);

  const vacationPay = useMemo<number>(() => {
    const { years } = user;
    let totalVacationPay = 0;

    // Суммируем заработную плату за каждый месяц в году и умножаем на процент отпускных
    for (const allMonths of years.values()) {
      totalVacationPay += allMonths.reduce(
        (acc, salaryForMonth) => acc + salaryForMonth * vacationPercent,
        0
      );
    }

    return totalVacationPay;
  }, [user]);

  return (
    <tr key={user.fio}>
      <td>{user.fio}</td>
      <td>{totalSalary} руб.</td>
      <td>{vacationPay} руб.</td>
    </tr>
  );
};

export const UserTable: FC<UserTableProps> = ({ users }) => {
  return (
    <div>
      <h4>Общий список сотрудников с зарплатой и отпускными</h4>
      <p>Формула высчитывания размера отпускных: зарплата * процент отпускных = {vacationPercent}%</p>
      <table className={styles.table}>
        <thead>
          <tr>
            <td>ФИО</td>
            <td>Общий заработок</td>
            <td>Размер отпускных ({vacationPercent}%)</td>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <UserRow key={user.fio} user={user} />
          ))}
        </tbody>
      </table>
    </div>
  );
};
