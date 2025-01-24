"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

const Create = () => {
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [bithday, setBirthday] = useState("");
  const [isFormValid, setIsFormValid] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Check form input
    setIsFormValid(name !== "" && lastName !== "" && bithday !== "");
  }, [name, lastName, bithday]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Convert ISO format
    const formattedBirthday = new Date(bithday).toISOString();

    try {
      await axios.post("https://localhost:7191/api/Students", {
        name,
        lastName,
        bithday: formattedBirthday,
      });
      router.push("/");
    } catch (error) {
      console.error("Error submitting student:", error);
      alert(error.response?.data?.message || "An error occurred");
    }
  };

  return (
    <>
      <div className="flex flex-col items-center py-20">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800"> Create New Student</h1>
        <form onSubmit={handleSubmit} className="flex flex-col space-y-4 mt-6 border rounded-md p-6">
          <input
            type="text"
            value={name}
            placeholder="First Name"
            className="p-2 border rounded-md border-slate-200"
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="text"
            value={lastName}
            placeholder="Last Name"
            className="p-2 border rounded-md border-slate-200"
            onChange={(e) => setLastName(e.target.value)}
          />
          <input
            type="date"
            value={bithday}
            className="p-2 border rounded-md border-slate-200"
            onChange={(e) => setBirthday(e.target.value)}
          />
          <button
            type="submit"
            className={`px-4 py-2 rounded text-white font-medium ${isFormValid ? "bg-green-500 hover:bg-green-600" : "bg-gray-400 cursor-not-allowed"}`}
            disabled={!isFormValid}
          >
            Submit
          </button>
        </form>
      </div>
    </>
  );
};

export default Create;
