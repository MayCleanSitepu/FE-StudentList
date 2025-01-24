"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import axios from "axios";

const Students = () => {
  const [students, setStudents] = useState([]);

  const calculateAge = (birthDate) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  const fetchStudents = async () => {
    try {
      const response = await axios.get("https://localhost:7191/api/Students");
      const formattedStudents = response.data.data.map((student) => ({
        ...student,
        age: calculateAge(student.bithday),
      }));
      setStudents(formattedStudents);
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleDelete = async (studentId) => {
    try {
      await axios.delete(`https://localhost:7191/api/Students/${studentId}`);
      setStudents(students.filter((student) => student.studentId !== studentId));
    } catch (error) {
      console.error("Error deleting student:", error);
    }
  };

  return (
    <>
      <div className="flex justify-center">
        <div className="px-4 py-8 md:px-8 lg:px-16 ">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Student List</h1>
            <Link
              className="px-4 py-2 bg-green-500 hover:bg-green-600 rounded text-white font-medium"
              href="/students/create"
            >
              Add Student
            </Link>
          </div>
          <div className="mt-8 overflow-x-auto shadow-lg rounded-lg">
            <table className="min-w-full table-auto border-collapse">
              <thead className="bg-gray-100 border-b-2 border-gray-200">
                <tr>
                  <th className="px-2 md:px-6 py-4 text-left text-xs md:text-sm font-semibold text-gray-700">NIM</th>
                  <th className="px-2 md:px-6 py-4 text-left text-xs md:text-sm font-semibold text-gray-700">First Name</th>
                  <th className="px-2 md:px-6 py-4 text-left text-xs md:text-sm font-semibold text-gray-700">Last Name</th>
                  <th className="px-2 md:px-6 py-4 text-left text-xs md:text-sm font-semibold text-gray-700">Age</th>
                  <th className="px-2 md:px-6 py-4 text-left text-xs md:text-sm font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {students.length > 0 ? (
                  students.map((student) => (
                    <tr key={student.studentId} className="hover:bg-gray-50">
                      <td className="px-2 md:px-6 py-4 text-xs md:text-sm text-gray-800">{student.studentId}</td>
                      <td className="px-2 md:px-6 py-4 text-xs md:text-sm text-gray-800">{student.name}</td>
                      <td className="px-2 md:px-6 py-4 text-xs md:text-sm text-gray-800">{student.lastName}</td>
                      <td className="px-2 md:px-6 py-4 text-xs md:text-sm text-gray-800">{student.age} years</td>
                      <td className="px-2 md:px-6 py-4 space-x-1 md:space-x-3">
                        <Link href={`/students/${student.studentId}?mode=read`}>
                          <button className="text-blue-600 hover:underline text-xs md:text-sm">Read</button>
                        </Link>
                        <Link href={`/students/${student.studentId}?mode=edit`}>
                          <button className="text-yellow-600 hover:underline text-xs md:text-sm">Edit</button>
                        </Link>
                        <button
                          onClick={() => handleDelete(student.studentId)}
                          className="text-red-600 hover:underline text-xs md:text-sm"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                      No students found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default Students;
