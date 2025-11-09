import { Image } from "@heroui/react";
import { Heart } from "lucide-react";
import { PhilippineTime } from "../components/common/philippine-time";
import { EmploymentStatus } from "@/components/common/employment-status";
import { DiscordPresenceCard } from "@/components/features/discord/discord-presence-card";

const optimizedImages: Record<string, string> = import.meta.glob(
  "../assets/portfolio-resources/assets/images/*.jpg",
  { eager: true, import: "default", query: "?format=webp&meta" },
);

const personalImageKey = Object.keys(optimizedImages).find((key) =>
  key.includes("profile.jpg"),
)!;

export const Main = () => {
  const personalImage = optimizedImages[personalImageKey];

  return (
    <div className="bg-background flex flex-col gap-6 rounded-xl p-6 lg:gap-4 lg:p-4 2xl:gap-6 2xl:p-6">
      <div className="grid grid-cols-12 gap-6 lg:gap-4 2xl:gap-6">
        <div className="order-last col-span-full sm:order-first sm:col-span-5 lg:col-span-6 xl:col-span-5">
          <div className="relative h-full w-full">
            <Heart
              fill="#f472b6"
              className="peer absolute right-[30%] bottom-[2rem] z-[100] size-6 text-pink-400 opacity-0 hover:animate-pulse hover:opacity-100"
            />
            <div className="absolute top-0 z-[100] flex w-full justify-end p-3 text-sm text-pink-400 opacity-0 peer-hover:animate-pulse peer-hover:opacity-100">
              <p>{"Hey there, jiya :)"}</p>
            </div>
            <div className="absolute inset-0 z-[11] flex items-end p-6 lg:flex lg:p-5 xl:flex">
              <EmploymentStatus />
            </div>
            <div className="relative z-[0]">
              <Image
                src={personalImage}
                className="h-[50%] w-full object-cover"
                removeWrapper
              />
            </div>
          </div>
        </div>
        <div className="order-first col-span-full flex flex-col sm:order-last sm:col-span-7 lg:col-span-6 xl:col-span-7">
          <div className="rows-span-2 flex w-full items-center justify-between text-sm sm:text-base lg:text-sm 2xl:text-base">
            <PhilippineTime />
            <Image
              radius="none"
              src="https://img.shields.io/badge/dynamic/json?&label=Total%20Stars&color=000000&style=flat&style=for-the-badge&query=%24.stars&url=https://api.github-star-counter.workers.dev/user/PP-Namias"
            />
            <Image
              radius="none"
              src="https://komarev.com/ghpvc/?username=PP-Namias&label=Profile%20Views&color=000000&style=flat&label=Visitors"
            />
          </div>
          <div className="mt-4 hidden h-[68%] sm:block lg:hidden lg:h-[68%] xl:block">
            <DiscordPresenceCard />
          </div>
        </div>
      </div>
      <div className="text-xs sm:text-base lg:text-sm 2xl:text-base">
        <p className="">
          Philippines-based software engineer specializing in
          <span className="text-primary font-bold">
            {
              " Full-Stack Development, DevOps Engineering, Quality Assurance, and Data Science."
            }{" "}
          </span>
          I architect and deliver production-ready solutions that solve real-world problems — 
          from building high-performance web applications and implementing CI/CD pipelines, 
          to engineering data-driven systems and ensuring code quality at scale. 
          With expertise spanning modern frameworks, cloud infrastructure, automated testing, 
          and machine learning, I transform complex technical challenges into elegant, 
          scalable solutions that drive measurable business impact.
        </p>
      </div>
    </div>
  );
};
