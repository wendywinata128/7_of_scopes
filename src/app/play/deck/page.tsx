import Image from "next/image";
import { FaHeart } from "react-icons/fa";
import { ImClubs, ImDiamonds, ImHeart, ImSpades } from "react-icons/im";
import CardClubs02 from '@/assets/card_clubs_02.png';

type typeCard = 'spade' | 'diamond' | 'club' | 'heart';

export default function PageDeck() {
    const numberData = ['2', '3', '4', '5', '6', '7', '8', '9', 'J', 'Q', 'K', 'A'];
    const typeData: typeCard[] = ['spade', 'club', 'diamond', 'heart']

    function getTypeIcon(val: typeCard){
        let iconData = {
            'spade': <ImSpades/>,
            'diamond': <ImDiamonds/>,
            'club': <ImClubs/>,
            'heart': <ImHeart/>
        }

        return iconData[val];
    }

    function cardResults(){
        var result: JSX.Element[] = [];

        typeData.forEach((type) => {
            numberData.forEach(number => {
                result.push(<div className="h-40 w-28 bg-white rounded text-black p-1 px-2 text-sm flex flex-col justify-between">
                    <div className={`flex flex-col items-center w-fit ${(type === 'diamond' || type === 'heart') && 'text-red-700'}`}>
                        <p>{number}</p>
                        <p>{getTypeIcon(type)}</p>
                    </div>

                    <div className={`flex flex-col items-center w-fit rotate-180 ml-auto ${(type === 'diamond' || type === 'heart') && 'text-red-700'}`}>

                        <p>{number}</p>
                        <p>{getTypeIcon(type)}</p>
                    </div>
                </div>)
            })
        })

        return result;
    }

    return <div className="bg-zinc-800 text-white flex items-center justify-center gap-4 flex-wrap p-16">
        {/* <div className="border rounded p-8 box-content flex items-center gap-8 relative">
            <p className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-full py-2 px-4 bg-white text-zinc-800 rounded-t text-xs font-bold">Board Games</p>
            <div className="h-44 w-28 border rounded border-dashed border-black flex items-center justify-center text-xl text-black">
                <ImSpades />
            </div>
            <div className="h-44 w-28 border rounded border-dashed border-red-400 flex items-center justify-center text-xl text-red-400">
                <ImDiamonds />
            </div>
            <div className="h-44 w-28 border rounded border-dashed border-black flex items-center justify-center text-xl text-black">
                <ImClubs />
            </div>
            <div className="h-44 w-28 border rounded border-dashed border-red-400 flex items-center justify-center text-xl text-red-400">
                <ImHeart />
            </div>
        </div> */}

        {/* <Image src={CardClubs02} alt="test" width={176} height={112}/> */}

        {cardResults()}

    </div>
}