import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function CardWithForm({ playerName }: { playerName: string }) {
 
  return (
    <div className="text-sm md:text-base border border-white/20 rounded-lg p-3 bg-slate-900/50 hover:bg-slate-900/70 transition-colors">
      <div className="flex justify-between items-center">
        <h1 className="font-medium">{playerName}</h1>
        <div>
          <Avatar className="w-8 h-8">
            <AvatarImage src="" />
            <AvatarFallback>
              <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/User-avatar.svg/2048px-User-avatar.svg.png" alt="User avatar" />
            </AvatarFallback>
          </Avatar>          
        </div>
      </div>
    </div>
  );
}
