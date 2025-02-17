import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function CardWithForm({ playerName }: { playerName: string }) {
 
  return (
    <Card className="text-sm md:text-base border-[1px] border-gray-400 rounded-lg p-2 bg-black">
      <div className="flex justify-between items-center">
        <h1>{playerName}</h1>
        <div>
          <Avatar>
            <AvatarImage src="" />
            <AvatarFallback>
              <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/User-avatar.svg/2048px-User-avatar.svg.png" alt="User avatar" />
            </AvatarFallback>
          </Avatar>          
        </div>
      </div>
    </Card>
  );
}
