import { CardI } from "@/other/constant/constant";
import CardItem from "./card-item";

export default function PrintCard({ cards }: { cards: CardI[] }) {
  let lower: CardI[] = [];
  let middle: CardI[] = [];
  let upper: CardI[] = [];

  let isUpper = false;
  let closedInUpper = false;
  cards.forEach((c) => {
    if (c.character === "7") {
      middle.push(c);
      isUpper = true;
    } else {
      if (isUpper) {
        if(c.character === 'A') closedInUpper = true;
        upper.push(c);
      } else {
        lower.push(c);
      }
    }
  });

  lower.reverse()
  let isClosed: boolean = cards.some(card => card.character === 'A');

  return (
    <div className="relative">
      <div className={`absolute transition  ${isClosed ? `top-0 ${closedInUpper ? 'z-[99]' : 'z-50'}` : '-top-24  z-50'}`}>
        {upper.map((card, idx) => (
          <CardItem
            key={card.value}
            character={card.character}
            type={card.type}
            height={176}
            width={112}
            className="absolute shadow-[rgba(0,0,15,0.15)_0px_1px_10px_0px]"
            style={{
              // transform: `translate(0px, ${-8 * idx}px)`
            }}
          />
        ))}
      </div>
      <div>
        {middle.map((card) => (
          <CardItem
            key={card.value}
            character={card.character}
            type={card.type}
            height={176}
            width={112}
            isGrayBg={true}
          />
        ))}
      </div>
      <div className={`absolute z-50 transition  ${isClosed ? 'top-0' : 'top-24'}`}>
        {lower.map((card) => (
          <CardItem
            key={card.value}
            character={card.character}
            type={card.type}
            height={176}
            width={112}
            className="absolute z-50 shadow-[rgba(0,0,15,0.15)_0px_-2px_10px_0px]"
          />
        ))}
      </div>
    </div>
  );
}
