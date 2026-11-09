import { WhatsAppIcon } from "@/components/icons/whatsapp-icon";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { whatsappUrl } from "@/lib/whatsapp";

type WhatsAppButtonProps = {
  message: string;
  children?: React.ReactNode;
  variant?: React.ComponentProps<typeof Button>["variant"];
  size?: React.ComponentProps<typeof Button>["size"];
  className?: string;
  showIcon?: boolean;
};

export function WhatsAppButton({
  message,
  children = "Cotizar por WhatsApp",
  variant = "default",
  size = "default",
  className,
  showIcon = true,
}: WhatsAppButtonProps) {
  return (
    <Button asChild variant={variant} size={size} className={cn("group", className)}>
      <a
        href={whatsappUrl(message)}
        target="_blank"
        rel="noopener noreferrer"
      >
        {showIcon ? <WhatsAppIcon className="size-4" /> : null}
        {children}
      </a>
    </Button>
  );
}
