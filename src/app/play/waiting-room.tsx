import { ImSpades, ImUser } from "react-icons/im";
import { GameDataI, PlayerI } from "@/other/constant/constant";
import { usePathname } from "next/navigation";

export default function WaitingRoom({players, onStartClicked, currPlayer, gameInfo}: {players: PlayerI[], onStartClicked: () => void, currPlayer: PlayerI, gameInfo: GameDataI}) {
  const onGetLinks = () => {
    const params = new URLSearchParams()
    params.set('id', gameInfo.id);
    navigator.clipboard.writeText(`${window.location.host}/play?${params}`)
  }

  const validateClickStart = () => {

    if(players.length < 2) {
      console.error('minimum 2 players')
      return;
    }

    onStartClicked();
  }
  return (
    <div className="h-screen text-white flex items-center justify-center flex-col overflow-hidden gap-8">
      
      <div className="flex flex-col text-center gap-2 z-50 relative">
        <h1 className="text-4xl flex gap-2 font-black">
          7 OF <ImSpades />
        </h1>
        <p className="text-xs">Room: {gameInfo.id}</p>
      </div>
      <div className="border p-12 flex gap-5 rounded z-50 relative bg-black/10 backdrop-blur-md">
        {players.map((p) => (
          <div key={p.name} className="flex flex-col items-center gap-1 border p-6 rounded w-32 text-center relative">
            <ImUser className="text-3xl" />
            <p className="capitalize text-sm">{p.name}</p>
            {p.id === currPlayer.id && (
              <p className="text-[10px] font-bold">(You)</p>
            )}
          </div>
        ))}
      </div>
      {currPlayer.id === gameInfo.roomMaster.id && <button className="bg-green-500 py-2 px-8 hover:bg-green-600 active:scale-95 rounded shadow shadow-green-500 transition relative z-50" onClick={validateClickStart}>
        Start Game
      </button>}
      <button className="bg-blue-500 py-2 px-8 hover:bg-blue-600 active:scale-95 rounded shadow shadow-blue-500 transition relative z-50" onClick={onGetLinks}>
      Get Links
    </button>
    </div>
  );
}
