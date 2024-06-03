"use client";
import {
  CardI,
  GameDataI,
  PlayerI,
  generateDefaultCard,
} from "@/other/constant/constant";
import { Suspense, useEffect, useReducer, useRef, useState } from "react";
import PageDeck from "./deck-info";
import WaitingRoom from "./waiting-room";
import PlayingGame from "./playing-game";
import { onValue, ref } from "firebase/database";
import {
  getGamesRef,
  playingCards,
  shufflingCards,
  updateBoards,
} from "@/other/storage/api";
import { redirect, useRouter, useSearchParams } from "next/navigation";
import UnregisteredJoinGame from "./unregistered-join-game";
import GameEnded from "./game-ended";
import { ImQuestion } from "react-icons/im";
import { FaQuestion } from "react-icons/fa6";
import PlayingGameCapsa from "./capsa/playing-game-capsa";
import { updateBoardsCapsa } from "@/other/storage/api-capsa";
import { ComboCard } from "@/other/capsa";

export default function PagePlayContainer() {
  const [gameInfo, setGameInfo] = useState<GameDataI | null>(null);
  const [animationCard, setAnimationCard] = useState(
    generateDefaultCard(false)
  );
  const [currPlayer, setCurrPlayer] = useState<PlayerI | null>();
  const [players, setPlayers] = useState<PlayerI[]>([]);
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isNotFound, setIsNotFound] = useState(false);

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
                if (oldGameInfo!.status === "decking") {
                  oldGameInfo!.status = "giving";
                }
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
        }, 100);
      }, 1000);
    }
  }, [gameInfo?.status]);

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
        } else {
          // router.push("/");
          setIsNotFound(true);
        }
      });
    } else {
      redirect("/");
    }
  }, []);

  const onDeckingStarted = (
    animationOption?: boolean,
    ruleDrawCardAvailable?: boolean,
    isCapsa?: boolean
  ) => {
    // animation
    shufflingCards(
      gameInfo!,
      players,
      searchParams.get("id")!,
      animationOption,
      ruleDrawCardAvailable,
      isCapsa
    );
  };

  const afterGivingEnds = async () => {
    if (currPlayer?.id === gameInfo?.roomMaster.id) {
      // await delayTime(60 * 120);
      playingCards(gameInfo!);
    }
  };
  function updateBoard(cardData: CardI, closeType?: "upper" | "lower") {
    updateBoards(gameInfo!, cardData, currPlayer!, closeType);
  }

  function updateBoardCapsa(cardData?: ComboCard) {
    updateBoardsCapsa(gameInfo!, currPlayer!, cardData);
  }

  if (isNotFound) {
    return (
      <div className="h-screen bg-zinc-800 flex-col text-center gap-8 flex items-center justify-center">
        <FaQuestion className="text-5xl" />
        <p className="text-3xl font-bold uppercase">Game not found</p>
        <button
          className="bg-red-500 py-2 px-8 hover:bg-red-600 active:scale-95 rounded shadow-md transition relative z-50"
          onClick={() => {
            router.push("/");
          }}
        >
          Go Back
        </button>
      </div>
    );
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

  if (gameInfo.status === "ended" && gameInfo.gameType !== 'capsa') {
    return (
      <div className="h-screen bg-zinc-800">
        <GameEnded gameInfo={gameInfo} currPlayer={currPlayer} />
      </div>
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

        {gameInfo.status === "playing" && gameInfo.gameType !== "capsa" && (
          <PlayingGame
            players={players}
            updateBoard={updateBoard}
            currPlayer={currPlayer}
            gameInfo={gameInfo}
          />
        )}

        {gameInfo.gameType === "capsa" && (gameInfo.status === "playing" || gameInfo.status === "ended") && (
          <PlayingGameCapsa
            players={players}
            updateBoard={updateBoardCapsa}
            currPlayer={currPlayer}
            gameInfo={gameInfo}
          />
        )}
      </div>
    </Suspense>
  );
}
