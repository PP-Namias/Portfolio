import { ScrollShadow, Tab, Tabs } from "@heroui/react";
import { ChevronRight } from "lucide-react";
import { Contact } from "./contact";
import { Projects } from "./projects";
import { Experiences } from "./experiences";
import Certifications from "./certifications";

export const TabPanel = () => {
  return (
    <>
      <div className="flex h-[85vh] flex-col space-y-2 overflow-y-scroll lg:h-full">
        <Tabs
          aria-label="Options"
          classNames={{
            tabList: " w-max m-[3px] p-0 dark:bg-background",
            base: "w-full bg-custom-secondary dark:bg-background border-0 rounded-xl m-0 p-0 mb-2",
            tab: "bg-background rounded-lg opacity-100 px-3 h-8 dark:bg-custom-secondary",
            tabContent:
              "group-data-[selected=true]:text-primary-foreground dark:group-data-[selected=true]:text-primary-foreground  text-sm 2xl:text-base text-foreground font-bold",
            cursor: "bg-primary dark:bg-primary",
            panel: "m-0 p-0 h-full overflow-y-hidden",
          }}
        >
          <Tab key="experiences" title={<TabTitle title="Career Snapshot" />}>
            <TabContent>
              <Experiences />
            </TabContent>
          </Tab>
          <Tab key="projects" title={<TabTitle title="Projects" />}>
            <TabContent>
              <Projects />
            </TabContent>
          </Tab>
          <Tab key="certifications" title={<TabTitle title="Certifications" />}>
            <TabContent>
              <Certifications />
            </TabContent>
          </Tab>
          <Tab key="contact" title={<TabTitle title="Contact" />}>
            <TabContent>
              <Contact />
            </TabContent>
          </Tab>
        </Tabs>
      </div>
    </>
  );
};

function TabTitle({ title }: { title: string }) {
  return (
    <div className="flex items-center gap-2">
      <p>{title}</p>
      <ChevronRight
        strokeWidth={4}
        className="rounded-full border p-[2px] font-bold"
      />
    </div>
  );
}

function TabContent({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-custom-secondary h-full rounded-xl">
      <ScrollShadow size={100} className="h-full overflow-y-scroll p-2">
        <div className="bg-background overflow-x-hidden overflow-y-clip rounded-lg p-2">
          {children}
        </div>
      </ScrollShadow>
    </div>
  );
}
