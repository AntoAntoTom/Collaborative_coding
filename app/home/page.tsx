"use client";
import Navbar from "@/components/nav/nav";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

export default function HomePage() {
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status !== "loading") {
      if (!session) {
        router.push("/login");
      }
    }
  }, [session, status, router]);

  if (status === "loading") return <p>Loading...</p>;

  if (!session) return null;

  return (
    <div>
      <Navbar/>
      <h1>Welcome, {session.user.email}</h1>
      <p>Your Role: {session.user.role}</p>
      <button
        className="border border-solid border-black rounded"
        onClick={() => {
          signOut({ redirect: false }).then(() => {
            router.push("/");
          });
        }}
      >
        Sign Out
      </button>
    </div>
  );
}

