import { Card, CardBody, Avatar } from "@heroui/react";
import { Quote } from "lucide-react";
import { motion } from "framer-motion";
import type { Recommendation } from "@/services/core/types";

type RecommendationCardProps = {
  recommendation: Recommendation;
  index: number;
};

export const RecommendationCard = ({
  recommendation,
  index,
}: RecommendationCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
    >
      <Card className="bg-custom-secondary border-divider border">
        <CardBody className="gap-4 p-5">
          <Quote className="text-primary h-6 w-6 opacity-60" />
          <p className="text-foreground/80 text-sm leading-relaxed italic">
            &ldquo;{recommendation.quote}&rdquo;
          </p>
          <div className="flex items-center gap-3 pt-2">
            <Avatar
              name={recommendation.name}
              size="sm"
              classNames={{
                base: "bg-primary/10",
                name: "text-primary font-semibold text-xs",
              }}
            />
            <div className="flex flex-col">
              <span className="text-foreground text-sm font-semibold">
                {recommendation.name}
              </span>
              <span className="text-foreground/50 text-xs">
                {recommendation.title} at {recommendation.company}
              </span>
            </div>
          </div>
        </CardBody>
      </Card>
    </motion.div>
  );
};
