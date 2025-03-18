import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { LucideIcon } from "lucide-react";

export interface AgentProps {
  id: string;
  name: string;
  description: string;
  icon: LucideIcon;
  isPremium: boolean;
  isActive?: boolean;
  isSelected?: boolean;
  specialties?: string[];
  onClick?: (id: string) => void;
  onSelect?: (id: string, selected: boolean) => void;
}

export default function AgentCard({
  id,
  name,
  description,
  icon: Icon,
  isPremium,
  isActive = false,
  isSelected = false,
  specialties = [],
  onClick = () => {},
  onSelect = () => {},
}: AgentProps) {
  return (
    <div
      className={`relative bg-white rounded-xl border ${isActive ? "border-primary ring-2 ring-primary/20" : "border-gray-200"} shadow-sm p-4 transition-all hover:shadow-md`}
    >
      <div className="flex justify-between items-start mb-2">
        <div
          className={`p-2 rounded-full ${isActive ? "bg-secondary" : "bg-gray-100"}`}
          onClick={() => onClick(id)}
        >
          <Icon
            className={`h-5 w-5 ${isActive ? "text-primary" : "text-gray-600"}`}
          />
        </div>

        <div className="flex items-center gap-2">
          <Badge
            className={`${isPremium ? "bg-secondary text-primary hover:bg-secondary" : "bg-secondary text-primary hover:bg-secondary"}`}
          >
            {isPremium ? "Premium" : "Free"}
          </Badge>

          <Checkbox
            id={`select-${id}`}
            checked={isSelected}
            onCheckedChange={(checked) => onSelect(id, checked as boolean)}
            className="h-4 w-4"
          />
        </div>
      </div>

      <div className="cursor-pointer" onClick={() => onClick(id)}>
        <h3 className="font-semibold text-base mb-1">{name}</h3>
        <p className="text-gray-600 text-xs mb-2 line-clamp-2">{description}</p>

        {specialties.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-2">
            {specialties.slice(0, 2).map((specialty, index) => (
              <Badge
                key={index}
                variant="outline"
                className="text-xs bg-gray-50"
              >
                {specialty}
              </Badge>
            ))}
            {specialties.length > 2 && (
              <Badge variant="outline" className="text-xs bg-gray-50">
                +{specialties.length - 2}
              </Badge>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
