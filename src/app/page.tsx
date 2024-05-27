'use client'
import { PlayerI } from "@/other/constant/constant";
import { isServerSide } from "@/other/constant/global_function";
import { createGameInfo } from "@/other/storage/api";
import { redirect, useRouter } from "next/navigation";
import { useEffect, useLayoutEffect, useState, useTransition } from "react";

export default function Home() {
  
  const [isPending, startTransition] = useTransition();
  const [name, setName] = useState('');
  const router = useRouter();
  let [savedUserData, setSavedUserData] = useState<PlayerI>();

  useEffect(() => {
    setSavedUserData(JSON.parse(localStorage.getItem('user-info') ?? 'null'));
  }, [])



  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="flex flex-col justify-center items-center text-center gap-8">
        {savedUserData ? <p>{savedUserData.name}</p> :<input
          className="h-10 border-b bg-transparent text-center pb-2"
          placeholder="Enter your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />}
        <button
          className="bg-green-500 py-2 px-8 hover:bg-green-600 active:scale-95 rounded shadow-md shadow-green-500 transition relative z-50"
          onClick={() => {
            startTransition(async () => {
              var result = await createGameInfo(name, savedUserData!)
              localStorage.setItem('user-info', JSON.stringify(result?.playerData));
              router.push(`/play?id=${result?.gameData.id}`);
            })
          }}
        >
          Create New Game
        </button>
      </div>
     
    </main>
  );
}
