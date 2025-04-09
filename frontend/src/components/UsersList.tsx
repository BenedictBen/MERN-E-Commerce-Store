// "use client";

// import { Table, IconButton, Box } from "@chakra-ui/react";
// import { useState, useEffect } from "react";
// import { FaUser, FaUserShield, FaEdit, FaTrash } from "react-icons/fa";

// // User type definition
// interface User {
//   _id: string;
//   username: string;
//   email: string;
//   isAdmin: boolean;
// }

// const UserList = () => {
//   const [users, setUsers] = useState<User[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchUsers = async () => {
//       try { 
//         const response = await fetch(`/api/auth/users`, {
//           method: "GET",
//           credentials: "include", // to include cookies
//         });

//         if (!response.ok) {
//           throw new Error("Failed to fetch users");
//         }

//         const data: User[] = await response.json();
//         console.log(data);
//         setUsers(data);
//       } catch (error) {
//         if (error instanceof Error) {
//           console.error("Error fetching users:", error.message);
//         } else {
//           console.error("Unexpected error:", error);
//         }
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchUsers();
//   }, []);

//   return (
//     <Box p={6}>
//       <Table.Root size="lg">
//         <Table.Header>
//           <Table.Row className="!px-6 ">
//             <Table.ColumnHeader>ID</Table.ColumnHeader>
//             <Table.ColumnHeader>Name</Table.ColumnHeader>
//             <Table.ColumnHeader>Email</Table.ColumnHeader>
//             <Table.ColumnHeader>Admin</Table.ColumnHeader>
//             <Table.ColumnHeader></Table.ColumnHeader>
//             <Table.ColumnHeader></Table.ColumnHeader>
//           </Table.Row>
//         </Table.Header>
//         <Table.Body>
//           {users.map((user) => (
//             <Table.Row key={user._id}>
//               <Table.Cell>{user._id}</Table.Cell>
//               <Table.Cell>
//                 <span>{user.username}</span>
//               </Table.Cell>
//               <Table.Cell>{user.email}</Table.Cell>
//               <Table.Cell>
//                 {user.isAdmin ? (
//                   <FaUserShield color="green" />
//                 ) : (
//                   <FaUser color="gray" />
//                 )}
//               </Table.Cell>
//               <Table.Cell>
//                 <IconButton aria-label="Call support">
//                   <FaEdit />
//                 </IconButton>
//               </Table.Cell>
//               <Table.Cell>
//                 <IconButton aria-label="Call support">
//                   <FaTrash color="red" />
//                 </IconButton>
//               </Table.Cell>
//             </Table.Row>
//           ))}
//         </Table.Body>
//       </Table.Root>
//     </Box>
//   );
// };

// export default UserList;

// "use client";
// import { Table, IconButton } from "@chakra-ui/react";
// import { useState, useEffect } from "react";
// import { FaUser, FaUserShield, FaEdit, FaTrash } from "react-icons/fa";
// import { toast } from "react-toastify";

// interface User {
//   _id: string;
//   username: string;
//   email: string;
//   isAdmin: boolean;
// }

// const UserList = () => {
//   const [users, setUsers] = useState<User[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [editingUser, setEditingUser] = useState<User | null>(null);
//   const [isEditOpen, setIsEditOpen] = useState(false);
//   const [isDeleteOpen, setIsDeleteOpen] = useState(false);
//   const [userToDelete, setUserToDelete] = useState<string | null>(null);
//   const [toastMessage, setToastMessage] = useState<{ type: string; message: string } | null>(null);

//   const fetchUsers = async () => {
//     try {
//       const response = await fetch(`/api/auth/users`, {
//         method: "GET",
//         credentials: "include",
//       });

//       if (!response.ok) throw new Error("Failed to fetch users");
//       const data: User[] = await response.json();
//       setUsers(data);
//     } catch (error) {
//       setToastMessage({
//         type: "error",
//         message: error instanceof Error ? error.message : "Failed to fetch users",
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDelete = async (userId: string) => {
//     try {
//       const response = await fetch(`/api/auth/users/${userId}`, {
//         method: "DELETE",
//         credentials: "include",
//       });

//       const result = await response.json();
//       if (result.success) {
//         setToastMessage({ type: "success", message: "User deleted successfully" });
//         fetchUsers();
//       } else {
//         throw new Error(result.error);
//       }
//     } catch (error) {
//       setToastMessage({
//         type: "error",
//         message: error instanceof Error ? error.message : "Failed to delete user",
//       });
//     } finally {
//       setIsDeleteOpen(false);
//     }
//   };

//   const handleUpdate = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!editingUser) return;

//     try {
//       const response = await fetch(`/api/auth/users/${editingUser._id}`, {
//         method: "PUT",
//         credentials: "include",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(editingUser),
//       });

//       const result = await response.json();
//       if (result.success) {
//         setToastMessage({ type: "success", message: "User updated successfully" });
//         fetchUsers();
//         setIsEditOpen(false);
//       } else {
//         throw new Error(result.error);
//       }
//     } catch (error) {
//       setToastMessage({
//         type: "error",
//         message: error instanceof Error ? error.message : "Failed to update user",
//       });
//     }
//   };

//   useEffect(() => {
//     fetchUsers();
//   }, []);

//   return (
//     <div className="p-6">
//       {/* Toast Messages */}
//       {toastMessage && (
//         <div
//           className={`p-3 mb-4 rounded ${
//             toastMessage.type === "error" ? "!bg-red-100 !text-red-600" : "!bg-green-100 text-green-700"
//           }`}
//         >
//           {toastMessage.message}
//         </div>
//       )}

//       {/* Edit Modal */}
//       {isEditOpen && editingUser && (
//         <div className="fixed inset-0 bg-white bg-opacity-40 flex items-center justify-center z-50">
//           <form
//             onSubmit={handleUpdate}
//             className="bg-white !p-6 rounded-lg shadow-lg w-full max-w-md !space-y-4"
//           >
//             <h2 className="!text-xl !font-semibold">Edit User</h2>

//             <div>
//               <label className="block font-medium mb-1">Username</label>
//               <input
//                 type="text"
//                 className="w-full !border !border-gray-300 rounded !px-3 !py-2"
//                 value={editingUser.username}
//                 onChange={(e) =>
//                   setEditingUser({ ...editingUser, username: e.target.value })
//                 }
//               />
//             </div>

//             <div>
//               <label className="block font-medium mb-1">Email</label>
//               <input
//                 type="email"
//                 className="w-full !border !border-gray-300 rounded !px-3 !py-2"
//                 value={editingUser.email}
//                 onChange={(e) =>
//                   setEditingUser({ ...editingUser, email: e.target.value })
//                 }
//               />
//             </div>

//             <div className="flex items-center">
//               <label className="!mr-3">Admin Privileges</label>
//               <input
//                 type="checkbox"
//                 checked={editingUser.isAdmin}
//                 onChange={(e) =>
//                   setEditingUser({ ...editingUser, isAdmin: e.target.checked })
//                 }
//               />
//             </div>

//             <div className="flex justify-end gap-3 !py-4">
//               <button
//                 type="button"
//                 className="!px-4 !py-2 rounded border !border-gray-400 cursor-pointer"
//                 onClick={() => setIsEditOpen(false)}
//               >
//                 Cancel
//               </button>
//               <button
//                 type="submit"
//                 className="!px-4 !py-2 rounded !bg-blue-600 !text-white cursor-pointer"
//               >
//                 Update
//               </button>
//             </div>
//           </form>
//         </div>
//       )}

//       {/* Delete Modal */}
//       {isDeleteOpen && (
//         <div className="fixed inset-0 bg-white bg-opacity-40 flex items-center justify-center z-50">
//           <div className="!bg-white !p-6 rounded-lg shadow-lg w-full max-w-md">
//             <h2 className="!text-lg !font-semibold !my-4">Confirm Delete</h2>
//             <p className="!my-6">
//               Are you sure you want to delete this user? This action cannot be
//               undone.
//             </p>
//             <div className="flex justify-end gap-3">
//               <button
//                 className="!px-4 !py-2 border !border-gray-400 rounded cursor-pointer"
//                 onClick={() => setIsDeleteOpen(false)}
//               >
//                 Cancel
//               </button>
//               <button
//                 className="!px-4 !py-2 !bg-red-600 !text-white rounded cursor-pointer"
//                 onClick={() => userToDelete && handleDelete(userToDelete)}
//               >
//                 Delete
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Chakra Table */}
//       <Table.Root size="lg">
//         <Table.Header>
//           <Table.Row className="!px-6">
//             <Table.ColumnHeader>Username</Table.ColumnHeader>
//             <Table.ColumnHeader>Email</Table.ColumnHeader>
//             <Table.ColumnHeader>ID</Table.ColumnHeader>
//             <Table.ColumnHeader>Admin</Table.ColumnHeader>
//             <Table.ColumnHeader>Actions</Table.ColumnHeader>
//           </Table.Row>
//         </Table.Header>
//         <Table.Body>
//           {users.map((user) => (
//             <Table.Row key={user._id}>
//               <Table.Cell>{user.username}</Table.Cell>
//               <Table.Cell>{user.email}</Table.Cell>
//               <Table.Cell>{user._id}</Table.Cell>
//               <Table.Cell>
//                 {user.isAdmin ? (
//                   <FaUserShield color="green" />
//                 ) : (
//                   <FaUser color="gray" />
//                 )}
//               </Table.Cell>
//               <Table.Cell>
//                <IconButton  aria-label="Edit user" onClick={() => {
//                     setEditingUser(user);
//                     setIsEditOpen(true);
//                   }}>
//                   <FaEdit />
//                  </IconButton>
//              </Table.Cell>
//              <Table.Cell>
//                  <IconButton  aria-label="Delete user" onClick={() => {
//                     setUserToDelete(user._id);
//                     setIsDeleteOpen(true);
//                   }}>
//                    <FaTrash color="red" />
//                  </IconButton>
//                </Table.Cell>
              
//             </Table.Row>
//           ))}
//         </Table.Body>
//       </Table.Root>
//     </div>
//   );
// };

// export default UserList;


"use client";
import { Table, IconButton, Spinner, Center } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { FaUser, FaUserShield, FaEdit, FaTrash } from "react-icons/fa";
import { toast } from "react-toastify";

interface User {
  _id: string;
  username: string;
  email: string;
  isAdmin: boolean;
}

const UserList = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/auth/users`, {
        method: "GET",
        credentials: "include",
      });

      if (!response.ok) throw new Error("Failed to fetch users");
      const data: User[] = await response.json();
      setUsers(data);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to fetch users"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (userId: string) => {
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/auth/users/${userId}/delete`, {
        method: "DELETE",
        credentials: "include",
      });

      const result = await response.json();
      if (result.success) {
        toast.success("User deleted successfully");
        fetchUsers();
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to delete user"
      );
    } finally {
      setIsDeleteOpen(false);
      setIsDeleting(false);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    setIsUpdating(true);
    try {
      const response = await fetch(`/api/auth/users/${editingUser._id}/update`, {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editingUser),
      });

      const result = await response.json();
      if (result.success) {
        toast.success("User updated successfully");
        fetchUsers();
        setIsEditOpen(false);
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to update user"
      );
    } finally {
      setIsUpdating(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="p-6">
      {/* Loading Spinner */}
      {loading ? (
        <Center h="60vh">
          <Spinner size="xl" />
        </Center>
      ) : (
        <>
          {/* Edit Modal */}
          {isEditOpen && editingUser && (
            <div className="fixed inset-0 bg-white bg-opacity-40 flex items-center justify-center z-50">
              <form
                onSubmit={handleUpdate}
                className="bg-white !p-6 rounded-lg shadow-lg w-full max-w-md !space-y-4"
              >
                <h2 className="!text-xl !font-semibold">Edit User</h2>

                <div>
                  <label className="block font-medium mb-1">Username</label>
                  <input
                    type="text"
                    className="w-full !border !border-gray-300 rounded !px-3 !py-2"
                    value={editingUser.username}
                    onChange={(e) =>
                      setEditingUser({ ...editingUser, username: e.target.value })
                    }
                  />
                </div>

                <div>
                  <label className="block font-medium mb-1">Email</label>
                  <input
                    type="email"
                    className="w-full !border !border-gray-300 rounded !px-3 !py-2"
                    value={editingUser.email}
                    onChange={(e) =>
                      setEditingUser({ ...editingUser, email: e.target.value })
                    }
                  />
                </div>

                <div className="flex items-center">
                  <label className="!mr-3">Admin Privileges</label>
                  <input
                    type="checkbox"
                    checked={editingUser.isAdmin}
                    onChange={(e) =>
                      setEditingUser({ ...editingUser, isAdmin: e.target.checked })
                    }
                  />
                </div>

                <div className="flex justify-end gap-3 !py-4">
                  <button
                    type="button"
                    className="!px-4 !py-2 rounded border !border-gray-400 cursor-pointer"
                    onClick={() => setIsEditOpen(false)}
                    disabled={isUpdating}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="!px-4 !py-2 rounded !bg-blue-600 !text-white cursor-pointer"
                    disabled={isUpdating}
                  >
                    {isUpdating ? "Updating..." : "Update"}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Delete Modal */}
          {isDeleteOpen && (
            <div className="fixed inset-0 bg-white bg-opacity-40 flex items-center justify-center z-50">
              <div className="!bg-white !p-6 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="!text-lg !font-semibold !my-4">Confirm Delete</h2>
                <p className="!my-6">
                  Are you sure you want to delete this user? This action cannot be undone.
                </p>
                <div className="flex justify-end gap-3">
                  <button
                    className="!px-4 !py-2 border !border-gray-400 rounded cursor-pointer"
                    onClick={() => setIsDeleteOpen(false)}
                    disabled={isDeleting}
                  >
                    Cancel
                  </button>
                  <button
                    className="!px-4 !py-2 !bg-red-600 !text-white rounded cursor-pointer"
                    onClick={() => userToDelete && handleDelete(userToDelete)}
                    disabled={isDeleting}
                  >
                    {isDeleting ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Chakra Table */}
          <Table.Root size="lg">
            <Table.Header>
              <Table.Row className="!px-6">
                <Table.ColumnHeader>Username</Table.ColumnHeader>
                <Table.ColumnHeader>Email</Table.ColumnHeader>
                <Table.ColumnHeader>ID</Table.ColumnHeader>
                <Table.ColumnHeader>Admin</Table.ColumnHeader>
                <Table.ColumnHeader>Actions</Table.ColumnHeader>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {users.map((user) => (
                <Table.Row key={user._id}>
                  <Table.Cell>{user.username}</Table.Cell>
                  <Table.Cell>{user.email}</Table.Cell>
                  <Table.Cell>{user._id}</Table.Cell>
                  <Table.Cell>
                    {user.isAdmin ? (
                      <FaUserShield color="green" />
                    ) : (
                      <FaUser color="gray" />
                    )}
                  </Table.Cell>
                  <Table.Cell>
                    <IconButton
                      aria-label="Edit user"
                      onClick={() => {
                        setEditingUser(user);
                        setIsEditOpen(true);
                      }}
                    >
                      <FaEdit />
                    </IconButton>
                  </Table.Cell>
                  <Table.Cell>
                    <IconButton
                      aria-label="Delete user"
                      onClick={() => {
                        setUserToDelete(user._id);
                        setIsDeleteOpen(true);
                      }}
                    >
                      <FaTrash color="red" />
                    </IconButton>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>
        </>
      )}
    </div>
  );
};

export default UserList;
