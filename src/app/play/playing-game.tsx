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
import { useEffect, useReducer, useState } from "react";
import PlayerDeck from "@/components/player-deck";
import BoardGames from "@/components/board-games";
import isIterable from "@/other/constant/global_function";
import PlayersInfo from "@/components/players-info";
import BoardActivity from "@/components/board-activity";

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
  return (
    <div className="h-screen bg-zinc-800 text-white flex items-center justify-center flex-col overflow-hidden py-4 px-6">
      <div className="flex-1 flex justify-between w-full">
        <BoardActivity gameInfo={gameInfo} />
        <p className="absolute left-0 right-0 text-center font-bold text-2xl">
          {gameInfo.currentTurn.id === currPlayer.id
            ? "Your"
            : gameInfo.currentTurn.name}{" "}
          Turn
        </p>
        <PlayersInfo playersData={players} currPlayer={currPlayer} />
      </div>

      <BoardGames boardData={gameInfo.board} />
      
      <div className="flex-1 flex items-end w-full">
        <PlayerDeck
          playerInfo={currPlayer}
          onClick={updateBoard}
          isPlayerTurn={gameInfo.currentTurn.id === currPlayer.id}
          gameInfo={gameInfo}
        />
      </div>
    </div>
  );
}
