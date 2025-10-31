import { forwardRef } from "react";
import { usePhilippineTime } from "../../hooks/use-philippine-time";

export const PhilippineTime = forwardRef(
  (props, ref: React.Ref<HTMLParagraphElement>) => {
    const formattedPhTime = usePhilippineTime();

    return (
      <p ref={ref} {...props}>
        {formattedPhTime}
      </p>
    );
  },
);
