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
import { Suspense, useEffect, useReducer, useRef, useState } from "react";
import isIterable, { delayTime } from "@/other/constant/global_function";
import PageDeck from "./deck/deck-info";
import WaitingRoom from "./waiting-room";
import PlayingGame from "./playing-game";
import { onValue, ref } from "firebase/database";
import {
  getGamesRef,
  playingCards,
  shufflingCards,
  updateBoards,
} from "@/other/storage/api";
import { redirect, useSearchParams } from "next/navigation";
import UnregisteredJoinGame from "./unregistered-join-game";

export default function PagePlayContainer() {
  const [gameInfo, setGameInfo] = useState<GameDataI | null>(null);
  const [animationCard, setAnimationCard] = useState(
    generateDefaultCard(false)
  );
  const [currPlayer, setCurrPlayer] = useState<PlayerI | null>();
  const [players, setPlayers] = useState<PlayerI[]>([]);
  const searchParams = useSearchParams();

  useEffect(() => {
    // update animation.
    if (gameInfo?.status === "decking") {
      setTimeout(() => {
        let i = 0;

        let interval = setInterval(() => {
          setAnimationCard((oldCards) => {
            if (i === oldCards.length) {
              clearInterval(interval);
              setGameInfo((oldGameInfo) => {
                oldGameInfo!.status = "giving";
                return { ...oldGameInfo! };
              });

              return gameInfo.cards.map((c) => {
                c.isCentered = true;
                c.isFlipped = true;
                return c;
              });
            }

            oldCards[i].isFlipped = true;
            oldCards[i].isCentered = true;
            i++;
            return [...oldCards];
          });
        }, 300);
      }, 1000);
    }
  }, [gameInfo?.status]);

  // useEffect(() => {
  //   setCurrPlayer(JSON.parse(localStorage.getItem("user-info") ?? "null"));
  // }, []);

  useEffect(() => {
    // update data
    const id = searchParams.get("id");
    if (id != null) {
      onValue(getGamesRef(id), (snapshot) => {
        if (snapshot.val()) {
          let data: GameDataI = snapshot.val();
          let players = Object.values(data.players);
          var playerLocalStorage = JSON.parse(
            localStorage.getItem("user-info") ?? "null"
          );
          setPlayers(players);
          if (playerLocalStorage) {
            let currPlayerOnline = players.find(
              (player) => player.id === playerLocalStorage?.id
            );
            if (currPlayerOnline) {
              setCurrPlayer(currPlayerOnline);
            }
          }
          setGameInfo(data);
        }
      });
    } else {
      redirect("/");
    }
  }, []);

  const onDeckingStarted = () => {
    // animation
    shufflingCards(gameInfo!, players, searchParams.get("id")!);
  };

  const afterGivingEnds = async () => {
    if (currPlayer?.id === gameInfo?.roomMaster.id) {
      await delayTime(60 * 120);
      playingCards(gameInfo!);
    }
  };
  function updateBoard(cardData: CardI) {
    updateBoards(gameInfo!, cardData, currPlayer!);
  }

  if (!gameInfo) {
    return (
      <Suspense>
        <div className="h-screen bg-zinc-800 flex items-center justify-center">
          Please wait, getting game data...
        </div>
      </Suspense>
    );
  }

  if (!currPlayer || !players.some((player) => player.id === currPlayer.id)) {
    return (
      <Suspense>
        <UnregisteredJoinGame gameInfo={gameInfo} />
      </Suspense>
    );
  }

  return (
    <Suspense>
      <div className="h-screen bg-zinc-800">
        {(gameInfo.status === "decking" ||
          gameInfo.status === "waiting" ||
          gameInfo.status === "giving") && (
          <div
            className={`absolute transition duration-1000 ${
              gameInfo.status === "waiting"
                ? "opacity-40 blur-sm"
                : "opacity-80 blur-0"
            }`}
          >
            <PageDeck
              cards={animationCard}
              status={gameInfo.status}
              players={players}
              afterGivingEnds={afterGivingEnds}
              roomMasterIndex={players.findIndex(
                (p) => p.id === gameInfo.roomMaster.id
              )}
              currPlayerIndex={players.findIndex((p) => p.id === currPlayer.id)}
            />
          </div>
        )}

        {gameInfo.status === "waiting" && (
          <WaitingRoom
            players={players}
            onStartClicked={onDeckingStarted}
            currPlayer={currPlayer}
            gameInfo={gameInfo}
          />
        )}

        {gameInfo.status === "playing" && (
          <PlayingGame
            players={players}
            updateBoard={updateBoard}
            currPlayer={currPlayer}
            gameInfo={gameInfo}
          />
        )}
      </div>
    </Suspense>
  );
}
