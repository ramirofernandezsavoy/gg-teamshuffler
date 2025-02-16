import {
  Card  
} from "@/components/ui/card"


 
export default function CardWithForm({playerName}: {playerName: string}) {
  return (
    <Card className="text-sm md:text-base border-[1px] border-gray-400 rounded-lg p-2 bg-black">
        <div className="flex justify-between items-center">
            <h1>{playerName}</h1>
            <div>
                <img className="w-14 h-14 rounded-full object-cover" src='https://i0.wp.com/elintransigente.com/wp-content/uploads/2020/08/3101561.jpg?w=2000&ssl=1' alt={playerName} />
            </div>            
        </div>
    </Card>
  )
}