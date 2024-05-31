"use client";

import Image from "next/image";
import { FaHeart } from "react-icons/fa";
import { ImClubs, ImDiamonds, ImHeart, ImSpades } from "react-icons/im";
import CardItem from "@/components/card-item";
import { CardI, GameStatusType, PlayerI } from "@/other/constant/constant";
import { useEffect, useRef, useState } from "react";
import { delayTime } from "@/other/constant/global_function";
import test from "@/other/constant/test";

type typeCard = "spade" | "diamond" | "club" | "heart";

export default function PageDeck({
  cards,
  status,
  players,
  afterGivingEnds,
  roomMasterIndex,
  currPlayerIndex
}: {
  cards: CardI[];
  status: GameStatusType;
  players: PlayerI[];
  afterGivingEnds: () => void;
  roomMasterIndex: number,
  currPlayerIndex: number,
}) {
  const refs = useRef<HTMLDivElement[]>([]);
  const [isStart, setStart] = useState(false);

  useEffect(() => {
    if (status === "giving") {
      setTimeout(async () => {
        let i = refs.current.length;

        // let subs = currPlayerIndex - roomMasterIndex;
        // if(subs < 0){
        //   subs = players.length - subs;
        // }
        let subs = 0;
        let c = roomMasterIndex;

        while (c !== currPlayerIndex) {
          subs++;
          c++;
          if (c === players.length) c = 0;
        }
        subs =subs != 0 ? players.length - subs : subs;
        
        let playersIndex = subs;
        let curr = ((players[currPlayerIndex].cardsLength - 1) / 2) * 50 * -1;

        while (i) {
          let el = refs.current[--i];
          let positionTransform = el.style.transform
            .replaceAll("translateX", "")
            .replaceAll("translateY", "")
            .replaceAll("(", "")
            .replaceAll(")", "")
            .replaceAll("px", "")
            .split(" ");

          if (playersIndex === 0) {
            positionTransform[1] = `${+positionTransform[1] + 250}`;
            positionTransform[0] = `${+positionTransform[0] + curr}`;
            curr += 50;
            el.classList.toggle("shadow-white/20");
            el.classList.add("shadow-black/40");
            (el.querySelector(".container") as HTMLDivElement).style.transform =
              "rotateY(0deg)";
          } else if (playersIndex === 1) {
            positionTransform[0] = `${+positionTransform[0] + 250}`;
          } else if (playersIndex === 2) {
            positionTransform[1] = `${+positionTransform[1] - 250}`;
          } else {
            positionTransform[0] = `${+positionTransform[0] - 250}`;
          }

          el.style.transform = `translateX(${
            positionTransform[0] + "px"
          }) translateY(${positionTransform[1] + "px"})`;

          await delayTime(200);

          playersIndex++;

          if (playersIndex === players.length) playersIndex = 0;
        }

        setStart(true);

        setTimeout(async () => {
          setStart(false);
          afterGivingEnds();
          // i = refs.current.length;
          // playersIndex = subs;
          // curr = -300;

          // while (i) {
          //   let el = refs.current[--i];
          //   let positionTransform = el.style.transform
          //     .replaceAll("translateX", "")
          //     .replaceAll("translateY", "")
          //     .replaceAll("(", "")
          //     .replaceAll(")", "")
          //     .replaceAll("px", "")
          //     .split(" ");

          //   if (playersIndex === 0) {
          //     positionTransform[1] = `${+positionTransform[1] - 250}`;
          //     positionTransform[0] = `${+positionTransform[0] - curr}`;
          //     curr += 50;

          //     (
          //       el.querySelector(".container") as HTMLDivElement
          //     ).style.transform = "rotateY(180deg)";
          //   } else if (playersIndex === 1) {
          //     positionTransform[0] = `${+positionTransform[0] - 250}`;
          //   } else if (playersIndex === 2) {
          //     positionTransform[1] = `${+positionTransform[1] + 250}`;
          //   } else {
          //     positionTransform[0] = `${+positionTransform[0] + 250}`;
          //   }

          //   el.style.transform = `translateX(${
          //     positionTransform[0] + "px"
          //   }) translateY(${positionTransform[1] + "px"})`;

          //   await delayTime(100);

          //   playersIndex++;

          //   if (playersIndex === players.length) playersIndex = 0;
          // }
        }, 4000);
      }, 2000);
    }
  }, [status]);

  return (
    <div className="bg-zinc-800 text-white flex items-center justify-center gap-4 flex-wrap p-16 h-screen overflow-hidden">
      {cards?.map((card, idx) => {
        var ref = refs.current[idx];
        var component = (
          <CardItem
            refs={(el) => {
              if (el) {
                refs.current[idx] = el;
              }
            }}
            key={`${idx}`}
            character={card.character}
            type={card.type}
            isFlipped={card.isFlipped}
            isCentered={card.isCentered}
          />
        );

        return component;
      })}

      {isStart && <div className="absolute">Game will start in 5 seconds</div>}

      test
    </div>
  );
}
