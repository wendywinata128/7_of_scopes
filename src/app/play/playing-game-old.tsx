"use client";
import Image from "next/image";
import { FaHeart } from "react-icons/fa";
import {
  BoardI,
  CardI,
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

export default function PlayingGame() {
  const [players, setPlayers] = useState<PlayerI[]>([
    { name: "wendy", cards: [], cardsLength: 0 },
    { name: "buly", cards: [], cardsLength: 0 },
    { name: "surip", cards: [], cardsLength: 0 },
    { name: "turip", cards: [], cardsLength: 0 },
  ]);
  const [boardCard, setBoardCard] = useState<BoardI>(defaultBoardData);
  const [activeCard, setActiveCard] = useReducer(
    (state: CardI[], action: CardI) => {
      let type = action.type;

      if (action.value === 7) {
        state.push({
          character: "8",
          type: type,
          value: 8,
        });
        state.unshift({
          character: "6",
          type: type,
          value: 6,
        });
      } else if (action.value < 7) {
        if(action.value === 2){
          state.push({
            character: "A",
            type: type,
            value: 1,
          });
        }else{
          state.unshift({
            character: `${action.value - 1}`,
            type: type,
            value: action.value - 1,
          });
        }
      } else {
        state.push({
          character: ["8", "9", "10", "J", "Q", "K", "A"][action.value + 1 - 8],
          type: type,
          value: action.value + 1,
        });
      }

      return [...state];
    },
    defaultActiveCard
  );

  useEffect(() => {
    const cards = generateDefaultCard();

    setPlayers((old) => {
      if (!old || !isIterable(old)) return old;

      let n = cards.length;
      let playersIndex = 0;

      while (n) {
        old[playersIndex]?.cards.push(cards[n - 1]);
        playersIndex++;

        if (playersIndex === players.length) playersIndex = 0;

        n--;
      }

      [...old].forEach((oldIteration) => {
        oldIteration.cards.sort((a, b) =>
          a.type === b.type
            ? a.value > b.value
              ? 1
              : -1
            : a.type > b.type
            ? 1
            : -1
        );
        oldIteration.cardsLength = oldIteration.cards.length;
      });

      return [ ...old ];
    });
  }, []);

  function updateBoard(cardData: CardI) {
    if (cardData.value < 7) {
      boardCard[cardData.type].unshift(cardData);
    } else {
      boardCard[cardData.type].push(cardData);
    }
    players[0].cards = players[0].cards.filter((c) => c != cardData);
    setPlayers(players);
    setBoardCard({ ...boardCard });
    setActiveCard(cardData);
  }

  return (
    <div className="h-screen bg-zinc-800 text-white flex items-center justify-center flex-col overflow-hidden py-4">
      <div className="mb-auto">
        <PlayersInfo playersData={players}/>
        <BoardActivity/>
      </div>

      <BoardGames boardData={boardCard} />

      <div className="mt-auto w-full">
        <PlayerDeck
          playerInfo={players[0]}
          onClick={updateBoard}
          activeCard={activeCard}
        />
      </div>
    </div>
  );
}
