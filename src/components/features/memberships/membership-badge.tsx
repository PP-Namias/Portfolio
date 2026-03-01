import { Chip } from "@heroui/react";
import { ExternalLink } from "lucide-react";
import { motion } from "framer-motion";
import type { Membership } from "@/services/core/types";

type MembershipBadgeProps = {
  membership: Membership;
  index: number;
};

export const MembershipBadge = ({
  membership,
  index,
}: MembershipBadgeProps) => {
  const content = (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2, delay: index * 0.08 }}
    >
      <Chip
        variant="flat"
        size="sm"
        startContent={
          membership.url ? (
            <ExternalLink className="h-3 w-3 shrink-0" />
          ) : null
        }
        classNames={{
          base: "bg-custom-secondary hover:bg-primary/10 transition-colors cursor-pointer max-w-full h-auto py-1",
          content:
            "text-foreground/80 text-xs font-medium whitespace-normal text-left",
        }}
      >
        {membership.name}
      </Chip>
    </motion.div>
  );

  if (membership.url) {
    return (
      <a
        href={membership.url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block"
      >
        {content}
      </a>
    );
  }

  return content;
};
