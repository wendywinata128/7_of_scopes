"use client";
import { CardI, GameDataI, PlayerI } from "@/other/constant/constant";
import { useContext, useEffect, useReducer, useState } from "react";
import PlayerDeck from "@/components/player-deck";
import BoardGames from "@/components/board-games";
import isIterable, { delayTime } from "@/other/constant/global_function";
import PlayersInfo from "@/components/players-info";
import BoardActivity from "@/components/board-activity";
import { UIContext } from "@/other/context/ui-context";
import { resetGame } from "@/other/storage/api";
import BoardGamesCapsa from "@/components/board-games-capsa";
import PlayerDeckCapsa from "@/components/player-deck-capsa";
import { ComboCard } from "@/other/capsa";
import { FaThumbsDown } from "react-icons/fa";
import PlayersInfoCapsa from "@/components/players-info-capsa";

export default function PlayingGameCapsa({
  players,
  updateBoard,
  currPlayer,
  gameInfo: gameInfoParams,
}: {
  players: PlayerI[];
  updateBoard: (cardData?: ComboCard) => void;
  currPlayer: PlayerI;
  gameInfo: GameDataI;
}) {
  const uiContext = useContext(UIContext);
  const [gameInfo, setGameInfo] = useState({...gameInfoParams});

  useEffect(() => {

    let isAnimation = false;
    let isCleanup = false;
    
    const animateIfBoardClosed = async () => {
      if (gameInfoParams.status === "playing" && !gameInfoParams.boardCapsa && gameInfo.boardCapsa) {
        if(gameInfoParams.closedActivityCapsa){
          setGameInfo(old => {
            old.lastActivityCapsa = {...gameInfoParams.closedActivityCapsa!};
            return old;
          })
        }
        isAnimation = true;
        const boardData = document.querySelector(`#board-games-capsa`);
        let cards = boardData?.querySelectorAll(".container");

        if (cards) {
          // await delayTime(100);
          for (let i = 0; i < cards.length; i++) {
            let card = cards[i] as HTMLDivElement;

            card.style.transform = "rotateY(180deg)";
          }
        }

        await delayTime(1000);

        const bgBoardCard = (boardData?.querySelector('.board-card') as HTMLDivElement);
        const clonedNode = bgBoardCard.cloneNode(true) as HTMLDivElement;
        clonedNode.innerHTML = clonedNode.innerHTML.replace('playerTurn', gameInfoParams.currentTurn?.name)
        if(bgBoardCard){
          bgBoardCard.parentElement?.appendChild(clonedNode);
          await delayTime(10);
          clonedNode.style.transform = 'translateX(0)'
          await delayTime(2000);
          clonedNode.remove();
        }
      }
      if(!isCleanup){
        setGameInfo({...gameInfoParams});
        if(gameInfo.status === 'playing' && currPlayer.id === gameInfoParams.currentTurn.id && gameInfoParams.lastActivityCapsa != null && uiContext.isAutoSkip){
          updateBoard();
        }
        isAnimation = false;
      }
    };

    animateIfBoardClosed();
    

    return () => {
      if(isAnimation){
        isCleanup = true;
        setGameInfo({...gameInfoParams});
        if(gameInfo.status === 'playing' && currPlayer.id === gameInfoParams.currentTurn.id && gameInfoParams.lastActivityCapsa != null && uiContext.isAutoSkip){
          updateBoard();
        }
      }
    }
  }, [gameInfoParams.updateddt]);

  return (
    <div className="h-screen bg-zinc-800 text-white flex items-center justify-end flex-col overflow-hidden py-4 px-6 gap-4">
      <div className="h-[20%] w-full shrink relative">
        <div className="flex-1 flex justify-between w-full absolute">
          <BoardActivity gameInfo={gameInfo} />
          <div className="absolute left-0 right-0">
            <div
              className={`w-fit mx-auto z-[100] text-sm flex transition py-3 px-7 rounded font-bold ${
                gameInfo.currentTurn.id === currPlayer.id ||
                gameInfo.status === "ended"
                  ? "bg-red-500 scale-125"
                  : "bg-cyan-600"
              }`}
            >
              {gameInfo.status !== "ended" ? (
                <>
                  <p className="mr-1 max-w-28 whitespace-nowrap overflow-hidden text-ellipsis">
                    {gameInfo.currentTurn.id === currPlayer.id
                      ? "Your"
                      : gameInfo.currentTurn.name}{" "}
                  </p>
                  <p>Turn</p>
                </>
              ) : (
                <p>Game Ended</p>
              )}
            </div>
          </div>
          <PlayersInfoCapsa
            playersData={players}
            currPlayer={currPlayer}
            lastActivity={gameInfo.lastActivityCapsa}
            currTurn={gameInfo.currentTurn}
            skippedPlayer={gameInfo.skippedCapsa ?? []}
          />
        </div>
      </div>
      <div className="h-[50%]  shrink-0 flex items-center justify-center">
        <BoardGamesCapsa
          boardData={gameInfo.boardCapsa}
          lastActivity={gameInfo.lastActivityCapsa ?? undefined}
          currPlayer={currPlayer}
        />
      </div>

      <div className="min-h-[30%] w-full flex items-end shrink-0">
        <div className="w-full relative">
          <PlayerDeckCapsa
            playerInfo={currPlayer}
            onClick={updateBoard}
            isPlayerTurn={
              gameInfo.currentTurn.id === currPlayer.id &&
              gameInfo.status !== "ended"
            }
            gameInfo={gameInfo}
          />
        </div>
      </div>

      <div
        className={`fixed z-[200] left-0 top-0 bottom-0 right-0 bg-black/25 backdrop-blur-[1px] flex flex-col gap-8 items-center justify-center transition duration-1000 ${
          gameInfo.status !== "ended" && "-translate-x-full"
        }`}
      >
        <div className="flex items-center text-white shadow bg-red-500 py-2 px-4 rounded text-2xl gap-4 ">
          <FaThumbsDown />
          <p className="uppercase font-semibold">
            {
              Object.values(gameInfo.players).find((p) => p.cards?.length > 0)
                ?.name
            }{" "}
            IS THE LOSER
          </p>
          <FaThumbsDown />
        </div>
        {currPlayer && currPlayer.id === gameInfo.roomMaster.id && (
          <button
            className="bg-blue-500 w-fit mx-auto py-2 px-8 active:scale-95 rounded shadow-md transition relative z-50"
            onClick={async () => {
              uiContext.toggleDialog();
              await resetGame(gameInfo);
              uiContext.toggleDialog();
            }}
          >
            Play Again
          </button>
        )}
      </div>
    </div>
  );
}
