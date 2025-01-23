"use client";
import React, { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

const Create = () => {
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [bithday, setBirthday] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Convert `bithday` to ISO format
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
        <h1 className="text-3xl"> Create New Student</h1>
        <form onSubmit={handleSubmit} className="flex flex-col space-y-4 mt-6 border p-6">
          <input
            type="text"
            value={name}
            placeholder="First Name"
            className="p-2 border border-slate-500"
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="text"
            value={lastName}
            placeholder="Last Name"
            className="p-2 border border-slate-500"
            onChange={(e) => setLastName(e.target.value)}
          />
          <input
            type="date"
            value={bithday}
            className="p-2 border border-slate-500"
            onChange={(e) => setBirthday(e.target.value)}
          />
          <button className="w-full bg-green-300 py-1.5">Submit</button>
        </form>
      </div>
    </>
  );
};

export default Create;
