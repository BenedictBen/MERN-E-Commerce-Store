import React from "react";
import UserList from "@/components/UsersList";

const UsersPage = () => {
  return (
    <div className="flex flex-col items-center justify-center  !py-6">
      <div>
        <h3 className="!text-lg lg:!text-2xl !font-bold">Users</h3>
      </div>

      <div>
        <UserList />
      </div>
    </div>
  );
};

export default UsersPage;
