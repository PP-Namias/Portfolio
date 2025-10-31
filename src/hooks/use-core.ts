/* eslint-disable react-hooks/rules-of-hooks */
import { CoreService } from "@/services/core";
import { useMutation, useQuery } from "@tanstack/react-query";

export const useCore = () => {
  const coreService = new CoreService();
  const resumeUrl = coreService.getResumeUrl();

  const querySocials = () =>
    useQuery({
      queryFn: coreService.getSocials,
      queryKey: ["socials"],
    });

  const queryTechnologies = () =>
    useQuery({
      queryFn: coreService.getTechnologies,
      queryKey: ["technologies"],
    });

  const queryProjects = () =>
    useQuery({
      queryFn: coreService.getProjects,
      queryKey: ["projects"],
    });

  const queryExperiences = () =>
    useQuery({
      queryFn: coreService.getExperiences,
      queryKey: ["experiences"],
    });

  const queryCertifications = () =>
    useQuery({
      queryFn: coreService.getCertifications,
      queryKey: ["certifications"],
    });

  const downloadResumeMutation = useMutation({
    mutationFn: coreService.downloadResume,
  });

  return {
    resumeUrl,
    queryProjects,
    queryTechnologies,
    queryExperiences,
    querySocials,
    queryCertifications,
    downloadResumeMutation,
  };
};
