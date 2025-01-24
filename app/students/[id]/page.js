"use client";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import axios from "axios";

export default function StudentDetail({ params }) {
  const { id } = React.use(params); 

  const searchQuery = new useSearchParams();
  const mode = searchQuery.get("mode");

  const [student, setStudent] = useState(null);
  const [edit, setEdit] = useState(mode === "edit");
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [bithday, setBithday] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (id) {
      fetchStudent();
    }
  }, [id]);

  useEffect(() => {
    setEdit(mode === "edit");
  },[mode]);

  const fetchStudent = async () => {
    try {
      const response = await axios.get(`https://localhost:7191/api/Students/${id}`);
      const studentData = response.data.data;
      setStudent(studentData);
      setName(studentData.name || "");
      setLastName(studentData.lastName || "");

      // Pastikan bithday dalam format ISO 8601 lengkap
      const formattedBirthday = studentData.bithday
        ? new Date(studentData.bithday).toISOString()
        : "";
      setBithday(formattedBirthday);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Konversi bithday ke format ISO 8601 lengkap dengan waktu
    const formattedBirthday = bithday
      ? new Date(bithday).toISOString()
      : null;

    try {
      await axios.put(`https://localhost:7191/api/Students/${id}`, {
        name,
        lastName,
        bithday: formattedBirthday,
      });
      setEdit(false);
      fetchStudent(); // Refresh data setelah update
    } catch (error) {
      console.error("Error updating student:", error);
    }
  };

  const handleDelete = async () => {
    await axios.delete(`https://localhost:7191/api/Students/${studentId}`);
    router.push("/");
  }

  return (
    <div className="py-20 flex justify-center">
      <div className="w-full max-w-md my-10">
        <h3 className="text-2xl md:text-3xl font-bold text-gray-800">
          {edit ? "Edit Student" : "Student"}
        </h3>
        {student ? (
          <div className="flex flex-col items-center">
            {edit ? (
              <form
                onSubmit={handleSubmit}
                className="flex flex-col space-y-4 mt-6 border p-6"
                action=""
              >
                <input
                  className="p-2 border border-slate-500"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <input
                  className="p-2 border border-slate-500"
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
                <input
                  className="p-2 border border-slate-500"
                  type="datetime-local"
                  value={bithday.split(".")[0]}
                  onChange={(e) => setBithday(e.target.value)}
                />
                <button className="w-full bg-green-300">Save</button>
              </form>
            ) : (
              <table className="shadow-lg  min-w-full table-auto border-collapse my-10">
                <thead className="bg-gray-100 border-b-2 border-gray-200">
                  <tr>
                    <th className="px-2 md:px-6 py-4 text-left text-xs md:text-sm font-semibold text-gray-700">NIM</th>
                    <th className="px-2 md:px-6 py-4 text-left text-xs md:text-sm font-semibold text-gray-700">First Name</th>
                    <th className="px-2 md:px-6 py-4 text-left text-xs md:text-sm font-semibold text-gray-700">Last Name</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  <tr className="hover:bg-gray-50">
                    <td className="px-2 md:px-6 py-4 text-xs md:text-sm text-gray-800">{student.studentId}</td>
                    <td className="px-2 md:px-6 py-4 text-xs md:text-sm text-gray-800">{student.name}</td>
                    <td className="px-2 md:px-6 py-4 text-xs md:text-sm text-gray-800">{student.lastName}</td>
                  </tr>
                </tbody>
              </table>
            )}
          </div>
        ) : (
          <p>Loading student details...</p>
        )}

        <div className="flex justify-center space-x-16 mt-5">
          <button 
          onClick={()=> router.push('/')}
          className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded text-white font-medium">Home</button>
          <button
            className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 rounded text-white font-medium"
            onClick={() => setEdit(!edit)}
          >
            Edit
          </button>
          <button 
          onClick={handleDelete}
          className="px-4 py-2 bg-red-500 hover:bg-red-600 rounded text-white font-medium">Delete</button>
        </div>
      </div>
    </div>
  );
}
