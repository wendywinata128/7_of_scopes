"use client";
import {
  BoardI,
  CardI,
  GameDataI,
  PlayerI,
  TYPE_CARD_DATA,
  defaultActiveCard,
  defaultBoardData,
  generateDefaultCard,
} from "@/other/constant/constant";
import { useContext, useEffect, useReducer, useState } from "react";
import PlayerDeck from "@/components/player-deck";
import BoardGames from "@/components/board-games";
import isIterable, { delayTime } from "@/other/constant/global_function";
import PlayersInfo from "@/components/players-info";
import BoardActivity from "@/components/board-activity";
import { UIContext } from "@/other/context/ui-context";

export default function PlayingGame({
  players,
  updateBoard,
  currPlayer,
  gameInfo,
}: {
  players: PlayerI[];
  updateBoard: (cardData: CardI) => void;
  currPlayer: PlayerI;
  gameInfo: GameDataI;
}) {
  const uiContext = useContext(UIContext);

  useEffect(() => {
    if (gameInfo.status === 'playing' && gameInfo.currentTurn?.id === currPlayer.id) {
      uiContext.toggleDialog();
      setTimeout(() => {
        uiContext.toggleDialog();
      }, 1500);
    }
  }, [gameInfo, currPlayer]);

  return (
    <div className="h-screen bg-zinc-800 text-white flex items-center justify-end flex-col overflow-hidden py-4 px-6 gap-4">
      <div className="h-[20%] w-full shrink relative">
        <div className="flex-1 flex justify-between w-full absolute">
          <BoardActivity gameInfo={gameInfo} />
          <div className="absolute left-0 right-0">
            <div
              className={`w-fit mx-auto z-[100] text-sm transition py-3 px-7 rounded font-bold ${
                gameInfo.currentTurn.id === currPlayer.id
                  ? "bg-red-500 scale-125"
                  : "bg-cyan-600"
              }`}
            >
              {gameInfo.currentTurn.id === currPlayer.id
                ? "Your"
                : gameInfo.currentTurn.name}{" "}
              Turn
            </div>
          </div>
          <PlayersInfo
            playersData={players}
            currPlayer={currPlayer}
            lastActivity={gameInfo.lastActivity}
            currTurn={gameInfo.currentTurn}
          />
        </div>
      </div>
      <div className="h-[50%]  shrink-0 flex items-center justify-center">
        <BoardGames
          boardData={gameInfo.board}
          lastActivity={gameInfo.lastActivity ?? undefined}
          currPlayer={currPlayer}
        />
      </div>

      <div className="min-h-[30%] w-full flex items-end shrink-0">
        <div className="w-full">
          <PlayerDeck
            playerInfo={currPlayer}
            onClick={updateBoard}
            isPlayerTurn={gameInfo.currentTurn.id === currPlayer.id}
            gameInfo={gameInfo}
          />
        </div>
      </div>
    </div>
  );
}
