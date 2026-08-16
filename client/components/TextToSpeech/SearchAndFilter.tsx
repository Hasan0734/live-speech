import { Search, SlidersHorizontal } from "lucide-react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
interface SearchAndFilterProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const SearchAndFilter = ({
  searchQuery,
  setSearchQuery,
}: SearchAndFilterProps) => {
  return (
    <div className="p-4 border-b space-y-3">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search history..."
            className="pl-9 bg-background/50 h-9 text-xs rounded-lg focus-visible:ring-0!"
          />
        </div>
        <Button
          variant="outline"
          size="icon"
          className="h-9 w-9 shrink-0 rounded-lg"
        >
          <SlidersHorizontal className="w-4 h-4 text-muted-foreground" />
        </Button>
      </div>

      {/* Filter Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
        <button className="px-2.5 py-1 rounded-full border bg-background hover:bg-accent text-muted-foreground flex items-center gap-1 shrink-0">
          <span>+</span> Voice
        </button>
        <button className="px-2.5 py-1 rounded-full border bg-background hover:bg-accent text-muted-foreground flex items-center gap-1 shrink-0">
          <span>+</span> Model
        </button>
        <button className="px-2.5 py-1 rounded-full border bg-background hover:bg-accent text-muted-foreground flex items-center gap-1 shrink-0">
          <span>+</span> Date
        </button>
        <button className="px-2.5 py-1 rounded-full border bg-background hover:bg-accent text-muted-foreground flex items-center gap-1 shrink-0">
          <span>+</span> Source
        </button>
      </div>
    </div>
  );
};

export default SearchAndFilter;
