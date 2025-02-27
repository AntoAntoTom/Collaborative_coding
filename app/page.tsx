"use client";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const { status } = useSession();
  const router = useRouter();
  useEffect(() => {
    if (status === "authenticated") {
      router.push("/home");
    }else if(status=="loading"){
      <span className="text-[#888] text-sm mt-7">Loading...</span>;
    }else{
      router.push("/login");
    }
  }, [status, router]);
  // const showSession = () => {
    // if (status === "authenticated") {
      // return (
        // <button
        //   className="border border-solid border-black rounded"
        //   onClick={() => {  
        //     signOut({ redirect: false }).then(() => {
        //       router.push("/");
        //     });
        //   }}
        // >
        //   Sign Out
        // </button>

    //     router.push("/home");
    //   );
    // } else 
  //   if (status === "loading") {
  //     return <span className="text-[#888] text-sm mt-7">Loading...</span>;
  //   } else {
  //     return (
  //       <Link
  //         href="/login"
  //         className="border border-solid border-black rounded"
  //       >
  //         Sign In
  //       </Link>
  //     );
  //   }
  // };
  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <h1 className="text-xl">Home is loading</h1>
      {/* {showSession()} */}
    </main>
  );
}
