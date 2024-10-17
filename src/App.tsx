import { type ChangeEventHandler, useEffect } from "react";
import "./App.css";
import { useParseTableFile } from "./hooks/useParseTableFile";
import { useParseUsers } from "./hooks/useParseUsers";
import { UserTable } from "./components/UserTable";

// 1. Разместить на странице кнопку для загрузки файла.
// 2. Прочитать данные из файла
// 3. Рассчитать по каждому человеку размер отпускных за год
// 4. Вывести на странице ФИО, общий заработок и размер отпускных в виде таблицы

function App() {
  const { tableRows, error: parseError, parseFile } = useParseTableFile();
  const {
    users,
    error: parseUsersError,
    convertTableToUsers,
  } = useParseUsers();

  const error = parseError || parseUsersError;

  const onFileUpload: ChangeEventHandler<HTMLInputElement> = (event) => {
    console.debug("Change event:", event);
    const file = event.target.files?.[0];
    if (!file) return;
    parseFile(file);
  };

  useEffect(() => {
    if (!tableRows) return;
    convertTableToUsers(tableRows);
  }, [tableRows, convertTableToUsers]);

  useEffect(() => {
    console.log(users);
  }, [users]);

  return (
    <div className="wrapper">
      <input type="file" onChange={onFileUpload} />
      {error && <p style={{ color: "red" }}>{error}</p>}
      {users && <UserTable users={users} />}
    </div>
  );
}

export default App;
