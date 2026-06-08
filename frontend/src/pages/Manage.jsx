import { Pencil, Trash } from "lucide-react";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";

import TextBox from "../components/TextBox";
import TopBar3 from "../components/TopBar3";
import api from "../api/axios";

const Manage = () => {
  const [departments, setDepartments] = useState([]);
  const [newCode, setNewCode] = useState("");
  const [newName, setNewName] = useState("");
  const [director, setDirector] = useState("");
  const [directorId, setDirectorId] = useState("");

  useEffect(() => {
    fetchDepartments();
    fetchDirector();
  }, []);

  const fetchDepartments = async () => {
    try {
      const res = await api.get("/departments");
      setDepartments(res.data);
    } catch (err) {
      console.error("Error fetching departments:", err);
    }
  };

  const fetchDirector = async () => {
    try {
      const res = await api.get("/signatory");
      if (res.data.length > 0) {
        setDirectorId(res.data[0]._id);
        setDirector(res.data[0].name);
      }
    } catch (err) {
      console.error("Error fetching director:", err);
    }
  };

  const addDepartment = async () => {
    if (!newCode.trim() || !newName.trim()) {
      toast.error("Enter complete details");
      return;
    }

    try {
      await api.post("/departments", {
        code: newCode,
        name: newName,
      });

      setNewCode("");
      setNewName("");
      fetchDepartments();
      toast.success("Department added successfully!");
    } catch (err) {
      console.error("Error adding department:", err);
      toast.error("Failed to add department");
    }
  };

  const deleteDepartment = async (id) => {
    try {
      await api.delete(`/departments/${id}`);
      fetchDepartments();
      toast.success("Department deleted successfully!");
    } catch (err) {
      console.error("Error deleting department:", err);
      toast.error("Failed to delete department");
    }
  };

  const updateDirector = async () => {
    if (!directorId || !director.trim()) {
      toast.error("Director name cannot be empty");
      return;
    }

    try {
      await api.put(`/signatory/${directorId}`, { name: director });
      toast.success("Director updated successfully!");
    } catch (err) {
      console.error("Error updating director:", err.response?.data);
      toast.error("Failed to update director");
    }
  };

  return (
    <>
      <TopBar3 />

      <div className="min-h-screen bg-gray-100 p-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="order-1 md:order-2 md:col-span-1 bg-white p-6 rounded-2xl shadow-md self-start">
            <h2 className="text-xl font-semibold mb-4">Campus Director</h2>

            <div className="flex items-center gap-2">
              <TextBox
                name="Director"
                value={director}
                onChange={(e) => setDirector(e.target.value)}
                className="flex-1"
              />
              <button
                onClick={updateDirector}
                className="btn btn-circle btn-sm bg-[#9B1805] hover:bg-[#E83838] text-white border-none"
              >
                <Pencil size={20} />
              </button>
            </div>
          </div>
          <div className="order-2 md:order-1 md:col-span-2 bg-white p-6 rounded-2xl shadow-md">
            <h2 className="text-xl font-semibold mb-4">Manage Departments</h2>

            <div className="flex gap-2 mb-4">
              <div className="flex-[1]">
                <TextBox
                  name="Code"
                  placeholder="Code"
                  value={newCode}
                  onChange={(e) => setNewCode(e.target.value)}
                  className="w-full"
                />
              </div>

              <div className="flex-[3]">
                <TextBox
                  name="Department"
                  placeholder="Department Name"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full"
                />
              </div>

              <button
                onClick={addDepartment}
                className="btn bg-[#9B1805] hover:bg-[#E83838] text-white px-4"
              >
                Add
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="table w-full">
                <tbody>
                  {departments.map((dept) => (
                    <tr key={dept._id}>
                      <td>{dept.code}</td>
                      <td>{dept.name}</td>
                      <td>
                        <button
                          onClick={() => deleteDepartment(dept._id)}
                          className="btn btn-circle btn-sm bg-[#9B1805] hover:bg-[#E83838] text-white border-none"
                        >
                          <Trash size={20} />
                        </button>
                      </td>
                    </tr>
                  ))}

                  {departments.length === 0 && (
                    <tr>
                      <td colSpan="3" className="text-center text-gray-400">
                        No departments found. Try reloading the page.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Manage;
