import {
  Card  
} from "@/components/ui/card"
import Image from "next/image"

 
export default function CardWithForm({playerName}: {playerName: string}) {
  return (
    <Card className="w-[200px] border-[1.5px] border-gray-200 rounded-lg p-1 bg-indigo-500/20">
        <div className="flex justify-between mx-auto w-full px-2 items-center">
            <h1>{playerName}</h1>
            <div>
                <img className="w-12 h-12 rounded-full object-cover" src='https://i0.wp.com/elintransigente.com/wp-content/uploads/2020/08/3101561.jpg?w=2000&ssl=1' alt={playerName} />
            </div>            
        </div>
    </Card>
  )
}