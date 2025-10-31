import { ExperienceCard } from "@/components/features/experiences/experience-card";
import { ErrorTile } from "@/components/ui/error-tile";
import { LoadingTile } from "@/components/ui/loading-tile";
import { useCore } from "@/hooks/use-core";
import { TimeUtilities } from "@/utilities/time";
import dayjs from "dayjs";
import { useCallback, useMemo } from "react";

export const Experiences = () => {
  const { queryExperiences } = useCore();
  const { data: _data, isLoading, error } = queryExperiences();

  const data = useMemo(() => _data, [_data]);

  const experienceDuration = useMemo(() => {
    if (!data) return 0;
    const now = dayjs();

    const totalMonths = data.reduce((acc, exp) => {
      const start = dayjs(exp.startedAt);
      const end = exp.endedAt ? dayjs(exp.endedAt) : now;

      const months = Math.max(end.diff(start, "month"), 0);

      return acc + months;
    }, 0);

    const years = (totalMonths / 12).toFixed(1);
    return years;
  }, [data]);

  const toOrdinal = useCallback((number: number) => {
    const s = ["th", "st", "nd", "rd"];
    const v = number % 100;
    const ordinal = number + (s[(v - 20) % 10] || s[v] || s[0]);

    return ordinal;
  }, []);

  if (isLoading)
    return (
      <>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
          {Array(10)
            .fill(0)
            .map((_, index) => (
              <LoadingTile
                key={`ExperienceCardLoadingComponent-${index}`}
                className="h-[400px] rounded-xl lg:h-[300px] xl:h-[380px]"
              />
            ))}
        </div>
      </>
    );

  if (error)
    return (
      <>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
          {Array(10)
            .fill(0)
            .map((_, index) => (
              <ErrorTile
                key={`ExperienceCardErrorComponent-${index}`}
                className="h-[400px] rounded-xl lg:h-[300px] xl:h-[380px]"
              />
            ))}
        </div>
      </>
    );

  return (
    <>
      <div className="" id="ContactSection">
        <div className="grid gap-2 sm:gap-4">
          <div className="bg-background space-y-2 rounded-xl sm:space-y-4">
            <div className="p-[3px] sm:p-0">
              <div className="space-y-1 rounded-xl p-4 px-6 md:p-6 md:px-8 lg:p-5 lg:px-7 2xl:p-6 2xl:px-8">
                <p className="text-3xl font-bold sm:text-4xl 2xl:text-[2.8rem]">
                  {isLoading
                    ? "Calculating years of experience..."
                    : `${toOrdinal(data!.length)} role—${experienceDuration} years of experience.`}
                </p>
                <p className="text-xs sm:text-base xl:text-sm 2xl:text-lg">
                  A journey shaped by continuous learning, adapting to
                  challenges, and building expertise with every role.
                </p>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-1 2xl:grid-cols-2">
            {data?.map((experience, index) => {
              const isMostRecent = experience === data?.[0];

              const experienceIndex = data?.length - index;

              const parsedStartDate = TimeUtilities.parseMonthYearDate(
                experience.startedAt,
              );

              const parsedEndDate = experience.endedAt
                ? TimeUtilities.parseMonthYearDate(experience.endedAt)
                : "Present";

              return (
                <ExperienceCard
                  className={`${isMostRecent ? "bg-primary/5" : "hover:opacity-80 2xl:opacity-60"}`}
                  key={`${index}-${experience.position}`}
                >
                  <ExperienceCard.OverflowIndex
                    classNames={{
                      overlay: `${isMostRecent && "animate-ping border-primary dark:border-foreground"}`,
                      text: `${isMostRecent && "bg-primary text-primary-foreground dark:text-primary"}`,
                    }}
                  >
                    {toOrdinal(experienceIndex)}
                  </ExperienceCard.OverflowIndex>
                  <ExperienceCard.Body>
                    <ExperienceCard.Content>
                      <ExperienceCard.ContentHeader>
                        <ExperienceCard.Position>
                          {experience.position}
                        </ExperienceCard.Position>
                        <ExperienceCard.ContentSubHeader>
                          <ExperienceCard.Date>
                            {parsedStartDate} - {parsedEndDate}
                          </ExperienceCard.Date>
                          <ExperienceCard.CompanyModality>
                            {experience.company} {"•"} {experience.modality}
                          </ExperienceCard.CompanyModality>
                        </ExperienceCard.ContentSubHeader>
                      </ExperienceCard.ContentHeader>
                      <ExperienceCard.ContentBody>
                        <ExperienceCard.Summary>
                          {experience.summary}
                        </ExperienceCard.Summary>
                        <ExperienceCard.Highlights
                          highlights={experience.highlights}
                        />
                        <ExperienceCard.Technologies
                          technologies={experience.technologies}
                        />
                      </ExperienceCard.ContentBody>
                    </ExperienceCard.Content>
                  </ExperienceCard.Body>
                </ExperienceCard>
              );
            })}{" "}
          </div>
        </div>
      </div>
    </>
  );
};
