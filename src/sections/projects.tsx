import { ProjectCard } from "@/components/features/projects/project-card";
import { ErrorTile } from "@/components/ui/error-tile";
import { LoadingTile } from "@/components/ui/loading-tile";
import { useCore } from "@/hooks/use-core";
import { Button } from "@heroui/react";
import { useMemo } from "react";

const optimizedImages: Record<string, string> = import.meta.glob(
  "../assets/portfolio-resources/assets/images/projects/*.png",
  { eager: true, import: "default", query: "?format=webp&meta" },
);

export const Projects = () => {
  const { queryProjects } = useCore();
  const { data: _data, isLoading, error } = queryProjects();
  const data = useMemo(() => _data, [_data]);

  if (isLoading)
    return (
      <>
        <div className="space-y-4">
          {Array(10)
            .fill(0)
            .map((_, index) => (
              <LoadingTile
                key={`ProjectCardLoadingComponent-${index}`}
                className="h-[280px] rounded-xl"
              />
            ))}
        </div>
      </>
    );

  if (error)
    return (
      <>
        <div className="space-y-4">
          {Array(10)
            .fill(0)
            .map((_, index) => (
              <ErrorTile
                key={`ProjectCardErrorComponent-${index}`}
                className="h-[280px] rounded-xl"
              />
            ))}
        </div>
      </>
    );

  return (
    <>
      <div className="sticky top-0 z-20 flex w-full justify-end p-2">
        <Button
          isDisabled
          size="sm"
          className="group border-default bg-background w-max rounded-lg border px-3 py-1 font-mono text-sm uppercase opacity-80 transition-all duration-300 ease-in-out hover:scale-105"
        >
          <p className="">
            {"Project count: "} {data?.length}
          </p>
        </Button>
      </div>
      <div className="space-y-4">
        {data?.map((project) => {
          const imageKey = Object.keys(optimizedImages).find((key) =>
            key.includes(project.image),
          )!;

          const image = optimizedImages[imageKey];

          return (
            <ProjectCard key={`'ProjectCard-${project.title}`}>
              <ProjectCard.Body>
                <ProjectCard.Image imageUrl={image} />
                <ProjectCard.Content>
                  <ProjectCard.ContentBody>
                    <ProjectCard.Title
                      title={project.title}
                      year={project.year}
                    />
                    <div className="mb-4 flex flex-col gap-2">
                      <ProjectCard.Description
                        classNames={{ container: "flex-grow" }}
                      >
                        {project.description}
                      </ProjectCard.Description>
                      <ProjectCard.ContentTags tags={project.tags} />
                    </div>
                  </ProjectCard.ContentBody>
                  <ProjectCard.ContentFooter>
                    <ProjectCard.RepositoryButton url={project.repositoryURL} />
                    <ProjectCard.ProcessButton url={project.processURL} />
                    <ProjectCard.LiveButton url={project.liveURL} />
                  </ProjectCard.ContentFooter>
                </ProjectCard.Content>
              </ProjectCard.Body>
            </ProjectCard>
          );
        })}
      </div>
    </>
  );
};
