import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface PropsType {
  content: string;
  children: React.ReactNode;
  disabled?: boolean
}

const TooltipWrapper = ({ content, children, disabled }: PropsType) => {
  return (
    <Tooltip >
      <TooltipTrigger disabled={disabled} asChild>{children}</TooltipTrigger>
      <TooltipContent
        sideOffset={-3}
        className="bg-background text-foreground [&_svg]:bg-background [&_svg]:fill-background"
      >
        <p>{content}</p>
      </TooltipContent>
    </Tooltip>
  );
};

export default TooltipWrapper;
