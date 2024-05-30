import { GameDataI, PlayerI } from "@/other/constant/constant";
import { delayTime } from "@/other/constant/global_function";
import { UIContext } from "@/other/context/ui-context";
import { joinGame } from "@/other/storage/api";
import { useSearchParams } from "next/navigation";
import { useContext, useState } from "react";

export default function UnregisteredJoinGame({
  gameInfo,
}: {
  gameInfo: GameDataI;
}) {
  const [name, setName] = useState("");
  const searchParams = useSearchParams();
  const savedUserData: PlayerI = JSON.parse(
    localStorage.getItem("user-info") ?? "null"
  );
  const context = useContext(UIContext);

  if (Object.values(gameInfo.players).length > 5) {
    return (
      <div className="h-screen bg-zinc-800 flex flex-col gap-4 items-center justify-center  text-center">
        <p className="text-2xl">
          <b>Sorry, room have maximum players</b>
        </p>
      </div>
    );
  }

  if (gameInfo.status != 'waiting') {
    return (
      <div className="h-screen bg-zinc-800 flex flex-col gap-4 items-center justify-center  text-center">
        <p className="text-2xl">
          <b>Sorry, this game already played</b>
        </p>
      </div>
    );
  }

  return (
    <div className="h-screen bg-zinc-800 flex flex-col gap-4 items-center justify-center text-center">
      <p className="text-2xl">
        <b>You are Unregistered to this Game</b>
      </p>
      {savedUserData != null ? (
        <p>{savedUserData.name}</p>
      ) : (
        <input
          className="h-10 border-b bg-transparent text-center pb-2"
          placeholder="Enter your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      )}
      <button
        className="bg-green-500 py-2 px-8 hover:bg-green-600 active:scale-95 rounded shadow-md shadow-green-500 transition relative z-50"
        onClick={async () => {
          context.toggleDialog();
          await delayTime(5000);
          var result = await joinGame(
            name,
            savedUserData,
            searchParams.get("id") ?? ""
          );
          context.toggleDialog();
        }}
      >
        Join The Game
      </button>
    </div>
  );
}
