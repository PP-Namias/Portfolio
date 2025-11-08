import { ProjectCard } from "@/components/features/projects/project-card";
import { ErrorTile } from "@/components/ui/error-tile";
import { LoadingTile } from "@/components/ui/loading-tile";
import { useCore } from "@/hooks/use-core";

const optimizedImages: Record<string, string> = import.meta.glob(
  "../assets/portfolio-resources/assets/images/projects/*.png",
  { eager: true, import: "default", query: "?format=webp&meta" },
);

export const Projects = () => {
  const { queryProjects } = useCore();
  const { data, isLoading, error } = queryProjects();

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
      {data && (
        <div className="mb-4 rounded-xl bg-custom-background p-4">
          <p className="text-sm font-semibold text-foreground/80">
            Total Projects: <span className="text-primary">{data.length}</span>
          </p>
        </div>
      )}
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
                    {project.githubRepo && (
                      <ProjectCard.GithubMetrics
                        githubRepo={project.githubRepo}
                        className="mb-2"
                      />
                    )}
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
