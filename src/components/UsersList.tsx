import { useState } from "react";

type User = {
  id: string;
  name: string;
};

const UsersList = () => {
  const [users, setUsers] = useState<User[]>([]);

  return (
    <div>
      <ul className=" flex flex-col grow">
        {users.map((user) => (
          <button className="">
            <li key={user.id}>{user.name}</li>
          </button>
        ))}
      </ul>
    </div>
  );
};

export default UsersList;
