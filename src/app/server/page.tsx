"use client";

import { GameDataI } from "@/other/constant/constant";
import { getAllGamesRef } from "@/other/storage/api";
import { onValue, ref } from "firebase/database";
import { useEffect, useState } from "react";

export default function Server() {
  const [listOfRooms, setListOfRooms] = useState<GameDataI[]>([]);

  useEffect(() => {
    onValue(getAllGamesRef(), (snapshot) => {
      setListOfRooms(Object.values(snapshot.val() ?? {}));
    });
  }, []);

  return (
    <div className="text-white grid grid-cols-4 gap-8 gap-x-8 flex-wrap p-3">
      {listOfRooms.map((r, idx) => {
        let date = new Date(r.updateddt!);
        let players = Object.values(r.players);
        return (
          <div
            className="p-4 border flex flex-col justify-center text-sm rounded"
            key={r.id + idx}
          >
            <div className="flex justify-between border-b pb-2 mb-4 text-sm">
              <p>{r.id}</p>
              <p className="font-bold">
                {date.getHours()}:{date.getMinutes()}
              </p>
            </div>
            <div className="border-b pb-2 mb-4 text-xs">
                {r.gameType ?? '7 Of Spades'}
            </div>
            <div>{players.map((p) => p.name).join(", ")}</div>
          </div>
        );
      })}
    </div>
  );
}
