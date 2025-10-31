import useGithub from "@/hooks/use-github";

export const EmploymentStatus = () => {
  const { queryBaseUserInformation } = useGithub();
  const { data, isLoading, error } = queryBaseUserInformation();

  if (isLoading || error) return <></>;

  return (
    <>
      <div className="text-background dark:text-foreground flex items-center gap-4 font-mono text-xs lg:text-[10px]">
        {data?.hireable ? (
          <>
            <div className="relative">
              <div className="flex-inset-0 border-success absolute h-full w-full animate-ping rounded-full border"></div>
              <div className="bg-success size-3 rounded-full" />
            </div>
            <p>Seeking opportunities</p>
          </>
        ) : (
          <>
            <div className="relative">
              <div className="flex-inset-0 border-custom-secondary dark:bg-primary absolute h-full w-full rounded-full border"></div>
              <div className="bg-custom-secondary dark:bg-primary size-3 rounded-full" />
            </div>
            <p>Committed fulltime</p>
          </>
        )}
      </div>
    </>
  );
};
