"use client";

import CardItem from "@/components/card-item";
import { GameDataI, PlayerI } from "@/other/constant/constant";
import { delayTime } from "@/other/constant/global_function";
import { UIContext } from "@/other/context/ui-context";
import { resetGame } from "@/other/storage/api";
import { useContext, useEffect, useRef, useState } from "react";
import { AiOutlineLoading } from "react-icons/ai";
import { FaThumbsDown } from "react-icons/fa";

type PlayerIPlusTotal = PlayerI & { total: number };

export default function GameEnded({ gameInfo, currPlayer }: { gameInfo: GameDataI, currPlayer?: PlayerI | null }) {
  let [players, setPlayers] = useState<PlayerIPlusTotal[]>(
    Object.values(gameInfo.players).map((p) => ({
      ...p,
      cards: (p.cards ?? []).map((p) => ({ ...p, isFlipped: true })),
      total: 0,
    }))
  );
  let [resultData, setResultData] = useState({
    sortedPlayers: [] as PlayerIPlusTotal[],
    isDone: false,
  });

  let refs = useRef<HTMLDivElement[]>([]);
  const uiContext = useContext(UIContext);

  useEffect(() => {
    const refsTop = refs.current.map((e) => e.getBoundingClientRect().top);
    const calculateDifferent = (players: PlayerIPlusTotal[]) => {
      const temp = [...players];
      temp.sort((a, b) => (a.total > b.total ? -1 : 1));

      refs.current.forEach((ref, idx) => {
        let indexFind = temp.findIndex((t) => t.id === players[idx].id);
        if (idx != indexFind) {
          var moved = refsTop[indexFind] - refsTop[idx];
          ref.style.transform = `translateY(${moved}px)`;
        } else {
          ref.style.transform = `translateY(${0}px)`;
        }
      });

      return temp;
    };

    const init = async () => {
      let i = 0;
      let check = true;
      while (check) {
        check = false;
        await delayTime(2000);
        players.forEach((player, idx) => {
          if (player.cards[i]) {
            players[idx].cards[i].isFlipped = false;
            players[idx].total +=
              player.cards[i].character === "A"
                ? gameInfo.aValue ?? 1
                : player.cards[i].value;
          }
          if (!check && player.cards[i]) {
            check = true;
          }
        });
        i++;

        setPlayers([...players]);
        const sorted = calculateDifferent(players);
        setResultData({
          sortedPlayers: sorted,
          isDone: false,
        });
      }

      setResultData((old) => ({
        ...old,
        isDone: true,
      }));
    };

    init();
  }, []);

  return (
    <div className="flex flex-col gap-6 items-center h-screen overflow-auto py-8">
      {resultData.isDone ? (
        <>
          {currPlayer && (currPlayer.id === gameInfo.roomMaster.id) && <button
            className="bg-blue-500 w-fit mx-auto py-2 px-8 active:scale-95 rounded shadow-md transition relative z-50"
            onClick={async () => {
              uiContext.toggleDialog();
              await resetGame(gameInfo);
              uiContext.toggleDialog();
            }}
          >
            Play Again
          </button>}
          <div className="text-center flex items-center gap-3 justify-center font-bold text-lg">
            {`${resultData.sortedPlayers[0].name} is the Loser of this game`}
          </div>
        </>
      ) : (
        <div className="text-center flex items-center gap-3 justify-center">
          <AiOutlineLoading className="animate-spin" />
          <p>Calculating</p>
          <AiOutlineLoading className="animate-spin" />
        </div>
      )}
      {players.map((player, idx) => (
        <div
          ref={(refData) => {
            if (refData) refs.current[idx] = refData;
          }}
          key={player.id}
          className={`border p-4 min-w-[700px] rounded flex flex-col gap-4 transition duration-700  border-gray-700 relative ${
            resultData.isDone && player.id === resultData.sortedPlayers[0].id
              ? "border-red-500 bg-red-500"
              : "bg-gray-700"
          }`}
        >
          <div className="overflow-hidden w-full h-full absolute left-0 top-0">
            <div
              className={`absolute left-0 w-full top-0 h-full transition-transform duration-[2s] backdrop-blur-[1px] bg-black/20 flex items-center justify-center z-[99] ${
                !(
                  resultData.isDone &&
                  player.id === resultData.sortedPlayers[0].id
                ) && "translate-x-full"
              }`}
            >
              <div className="flex items-center gap-2 bg-white shadow text-red-500 w-min py-2 px-4 rounded text-sm shrink-0">
                <FaThumbsDown />
                <p>LOSER</p>
                <FaThumbsDown />
              </div>
            </div>
          </div>

          <div className="flex justify-between">
            <div className="flex items-center gap-4">
              <p>{player.name}</p>
            </div>
            <p className="font-bold">{player.total}</p>
          </div>
          <div className="flex gap-3">
            {(player.cards ?? []).length === 0 && <CardItem character="7" type="spade" width={60} height={90} isFlipped={true} className="opacity-0"/>}
            {(player.cards ?? []).map((card) => (
              <div key={`${card.character} - ${card.type}`}>
                <CardItem
                  character={card.character}
                  type={card.type}
                  width={60}
                  height={90}
                  isFlipped={card.isFlipped}
                />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
