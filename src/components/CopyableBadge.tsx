import { Badge } from "@/components/ui/badge";
import { ClipboardCopy } from "lucide-react";
import { showSuccess } from "@/utils/toast";

interface CopyableBadgeProps {
  textToCopy: string;
  label?: string;
}

const CopyableBadge = ({ textToCopy, label = "SKU" }: CopyableBadgeProps) => {
  const handleCopy = () => {
    navigator.clipboard.writeText(textToCopy);
    showSuccess(`${label} copied to clipboard!`);
  };

  return (
    <Badge
      variant="secondary"
      className="cursor-pointer hover:bg-secondary/80 transition-colors"
      onClick={handleCopy}
    >
      <ClipboardCopy className="mr-1.5 h-3 w-3" />
      {label}: {textToCopy}
    </Badge>
  );
};

export default CopyableBadge;