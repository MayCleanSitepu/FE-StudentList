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
  });

  const handleDelete = async (studentId) => {
    await axios.delete(`https://localhost:7191/api/Students/${studentId}`);
    const filterData = students.filter(student => student.studentId !== id)
    setStudents(filterData);
  }

  return (
    <>
      <div className="px-48 py-20">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Students</h1>
          <Link
            className="px-4 py-1.5 bg-green-400 hover:bg-green-500 rounded text-white"
            href="/students/create"
          >
            Add Student
          </Link>
        </div>
        <div className="mt-6">
          <table className="divide-y divide-gray-200 w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-start font-medium text-gray-500 uppercase">
                  Nim
                </th>
                <th className="px-6 py-3 text-start font-medium text-gray-500 uppercase">
                  First Name
                </th>
                <th className="px-6 py-3 text-start font-medium text-gray-500 uppercase">
                  Last Name
                </th>
                <th className="px-6 py-3 text-start font-medium text-gray-500 uppercase">
                  Age
                </th>
                <th className="px-6 py-3 text-start font-medium text-gray-500 uppercase">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {students.length > 0 ? (
                students.map((student) => (
                  <tr key={student.studentId}>
                    <td className="px-6 py-3 text-gray-800">{student.studentId}</td>
                    <td className="px-6 py-3 text-gray-800">{student.name}</td>
                    <td className="px-6 py-3 text-gray-800">{student.lastName}</td>
                    <td className="px-6 py-3 text-gray-800">{student.age} years</td>
                    <td className="space-x-4 px-6 py-3">
                      <Link href={`/students/${student.studentId}?mode=read`}> 
                        <button className="text-blue-600 hover:underline">Read</button> 
                      </Link>
                      <Link href={`/students/${student.studentId}?mode=edit`}>
                        <button className="text-yellow-600 hover:underline">Edit</button>
                      </Link>
                      <button onClick={() => handleDelete(student.studentId)} className="text-red-600 hover:underline">Delete</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center py-3 text-gray-500">
                    No students found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default Students;
