"use client";
import CardItem from "@/components/card-item";
import { PlayerI } from "@/other/constant/constant";
import { isServerSide } from "@/other/constant/global_function";
import { createGameInfo } from "@/other/storage/api";
import { redirect, useRouter } from "next/navigation";
import {
  MouseEvent,
  useEffect,
  useLayoutEffect,
  useState,
  useTransition,
} from "react";
import { ImSpades } from "react-icons/im";

export default function Home() {
  const [isPending, startTransition] = useTransition();
  const [name, setName] = useState("");
  const router = useRouter();
  let [savedUserData, setSavedUserData] = useState<PlayerI>();
  let [dialog, setDialog] = useState<{
    isOpen: boolean;
    type: "create" | "join";
  }>({
    isOpen: false,
    type: "create",
  });

  useEffect(() => {
    setSavedUserData(
      localStorage.getItem("user-info") === "undefined"
        ? null
        : JSON.parse(localStorage.getItem("user-info") ?? "null")
    );
  }, []);

  async function onCreateGameClicked() {
    if (!savedUserData) {
      setDialog({
        isOpen: true,
        type: "create",
      });
    } else {
      var result = await createGameInfo(name, savedUserData!);
      localStorage.setItem("user-info", JSON.stringify(result?.playerData));
      router.push(`/play?id=${result?.gameData.id}`);
    }
  }

  function onJoinGameCode() {
    setDialog({
      isOpen: true,
      type: "join",
    });
  }

  function closeDialog(e: MouseEvent<HTMLDivElement>) {
    if ((e.target as HTMLDivElement).classList.contains("dialog")) {
      setDialog({ isOpen: false, type: "create" });
    }
  }

  async function onSubmitDialog() {
    if (name.length === 0) {
      return;
    }

    if (dialog.type === "create") {
      var result = await createGameInfo(name, savedUserData!);
      localStorage.setItem("user-info", JSON.stringify(result?.playerData));
      router.push(`/play?id=${result?.gameData.id}`);
    } else {
      router.push(`/play?id=${name}`);
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-zinc-900">
      <div>
        <CardItem
          character="7"
          type="spade"
          containerClassName="animate-flip"
          className="absolute top-3 left-3"
          width={60}
          height={90}
        />
        <CardItem
          character="7"
          type="diamond"
          containerClassName="animate-flip"
          className="absolute top-3 right-3"
          width={60}
          height={90}
        />
        <CardItem
          character="7"
          type="club"
          containerClassName="animate-flip"
          className="absolute bottom-3 left-3"
          width={60}
          height={90}
        />
        <CardItem
          character="7"
          type="heart"
          containerClassName="animate-flip"
          className="absolute bottom-3 right-3"
          width={60}
          height={90}
        />
      </div>

      <div className="flex flex-col justify-center items-center text-center gap-8">
        <div className="flex flex-col items-center text-center gap-4 z-50 relative border-b border-b-white pb-8">
          <h1 className="text-6xl flex gap-2 font-black">
            7 <ImSpades />
          </h1>

          <p className="text-4xl font-black">Seven of Spades</p>

          <p className="italic cursor-pointer text-white/70 hover:text-white text-sm">
            How to Play (Documentation)
          </p>
        </div>

        <button
          className="bg-green-500 py-2 px-8 hover:bg-green-600 active:scale-95 rounded shadow-md transition relative z-50"
          onClick={() => {
            onCreateGameClicked();
          }}
        >
          Create New Game
        </button>
        <p>OR</p>
        <button
          className="bg-blue-500 py-2 px-8 hover:bg-blue-600 active:scale-95 rounded shadow-md transition relative z-50"
          onClick={onJoinGameCode}
        >
          Join Game Code
        </button>
      </div>

      <div
        className={`dialog ${
          !dialog.isOpen && "-translate-x-full"
        } transition left-0 top-0 bottom-0 right-0 bg-black/60 backdrop-blur-md z-50 absolute flex flex-col gap-8 items-center justify-center`}
        onClick={closeDialog}
      >
        <h1 className="text-6xl flex gap-2 font-black">
          7 <ImSpades />
        </h1>

        <input
          className="h-11 border border-white/70 outline-none bg-transparent text-center rounded w-96"
          placeholder={
            dialog.type === "create"
              ? "Enter your name to create a room"
              : "Enter room code"
          }
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <button
          className="bg-white text-black hover:text-white py-2 px-8 hover:bg-blue-500 active:scale-95 rounded shadow-md transition relative z-50"
          onClick={onSubmitDialog}
        >
          {dialog.type === "create" ? "Create" : "Join"}
        </button>
      </div>
    </main>
  );
}
