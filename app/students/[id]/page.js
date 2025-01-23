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

  return (
    <div className="py-20 flex justify-center">
      <div className="w-full max-w-md my-10">
        <h1 className="text-3xl text-center my-5">
          {edit ? "Edit Student" : "Data Student"}
        </h1>
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
                  type="datetime-local" // Ganti jadi datetime-local
                  value={bithday.split(".")[0]} // Agar kompatibel dengan input datetime-local
                  onChange={(e) => setBithday(e.target.value)}
                />
                <button className="w-full bg-green-300">Save</button>
              </form>
            ) : (
              // Tampilkan data student jika tidak dalam mode edit
              <div>
                <h3 className="text-lg font-semibold">
                  ID/NIM: {student.studentId}
                </h3>
                <h3 className="text-lg font-semibold">
                  Name: {student.name}
                </h3>
                <h3 className="text-lg font-semibold">
                  Last Name: {student.lastName}
                </h3>
              </div>
            )}
          </div>
        ) : (
          <p>Loading student details...</p>
        )}

        <div className="flex space-x-16 mt-5">
          <button 
          onClick={()=> router.push('/')}
          className="w-full bg-blue-400 px-3 py-1.5">Home</button>
          <button
            className="w-full bg-green-400 px-3 py-1.5"
            onClick={() => setEdit(!edit)}
          >
            Edit
          </button>
          <button className="w-full bg-red-400 px-3 py-1.5">Delete</button>
        </div>
      </div>
    </div>
  );
}
