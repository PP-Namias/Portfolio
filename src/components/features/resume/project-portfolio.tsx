import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Button, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from '@heroui/react';
import { Grid, List, Filter, X } from 'lucide-react';
import { Resume } from './resume-container';
import { ProjectCard } from './project-card';

interface Project {
  title: string;
  image: string;
  description: string;
  repositoryURL: string | null;
  liveURL: string | null;
  processURL: string | null;
  tags: string[];
  year: number;
}

interface ProjectPortfolioProps {
  projects: Project[];
}

export const ProjectPortfolio = ({ projects }: ProjectPortfolioProps) => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedTechnology, setSelectedTechnology] = useState<string>('all');
  const [selectedYear, setSelectedYear] = useState<string>('all');

  // Get unique technologies
  const allTechnologies = useMemo(() => {
    const techSet = new Set<string>();
    projects.forEach(project => {
      project.tags.forEach(tag => techSet.add(tag));
    });
    return Array.from(techSet).sort();
  }, [projects]);

  // Get unique years
  const allYears = useMemo(() => {
    const yearSet = new Set<number>();
    projects.forEach(project => {
      if (project.year > 0) {
        yearSet.add(project.year);
      }
    });
    return Array.from(yearSet).sort((a, b) => b - a);
  }, [projects]);

  // Filter and sort projects
  const filteredProjects = useMemo(() => {
    let filtered = [...projects];

    // Filter by technology
    if (selectedTechnology !== 'all') {
      filtered = filtered.filter(project =>
        project.tags.includes(selectedTechnology)
      );
    }

    // Filter by year
    if (selectedYear !== 'all') {
      filtered = filtered.filter(project =>
        project.year.toString() === selectedYear
      );
    }

    // Sort by year descending
    filtered.sort((a, b) => b.year - a.year);

    return filtered;
  }, [projects, selectedTechnology, selectedYear]);

  const hasActiveFilters = selectedTechnology !== 'all' || selectedYear !== 'all';

  const clearFilters = () => {
    setSelectedTechnology('all');
    setSelectedYear('all');
  };

  return (
    <Resume.Section id="projects" className="page-break-inside-avoid">
      <Resume.Header>Projects</Resume.Header>

      {/* Controls: Filters and View Toggle */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 no-print">
        {/* Filters */}
        <div className="flex flex-wrap items-center gap-4">
          {/* Technology Filter */}
          <Dropdown>
            <DropdownTrigger>
              <Button
                size="sm"
                variant="flat"
                startContent={<Filter size={14} />}
                aria-label="Filter by technology"
                className="text-xs"
              >
                Filter by Technology
                {selectedTechnology !== 'all' && `: ${selectedTechnology}`}
              </Button>
            </DropdownTrigger>
            <DropdownMenu
              aria-label="Technology filter options"
              selectionMode="single"
              selectedKeys={[selectedTechnology]}
              onSelectionChange={(keys) => {
                const key = Array.from(keys)[0] as string;
                setSelectedTechnology(key || 'all');
              }}
            >
              {[{ key: 'all', label: 'All Technologies' }, ...Array.from(allTechnologies).map(tech => ({ key: tech, label: tech }))].map(item => (
                <DropdownItem key={item.key}>{item.label}</DropdownItem>
              ))}
            </DropdownMenu>
          </Dropdown>

          {/* Year Filter */}
          <Dropdown>
            <DropdownTrigger>
              <Button
                size="sm"
                variant="flat"
                startContent={<Filter size={14} />}
                aria-label="Filter by year"
                className="text-xs"
              >
                Filter by Year
                {selectedYear !== 'all' && `: ${selectedYear}`}
              </Button>
            </DropdownTrigger>
            <DropdownMenu
              aria-label="Year filter options"
              selectionMode="single"
              selectedKeys={[selectedYear]}
              onSelectionChange={(keys) => {
                const key = Array.from(keys)[0] as string;
                setSelectedYear(key || 'all');
              }}
            >
              {[{ key: 'all', label: 'All Years' }, ...allYears.map(year => ({ key: year.toString(), label: year.toString() }))].map(item => (
                <DropdownItem key={item.key}>{item.label}</DropdownItem>
              ))}
            </DropdownMenu>
          </Dropdown>

          {/* Clear Filters Button */}
          {hasActiveFilters && (
            <Button
              size="sm"
              variant="light"
              color="danger"
              startContent={<X size={14} />}
              onClick={clearFilters}
              className="text-xs"
            >
              Clear Filters
            </Button>
          )}

          {/* Project Count */}
          <span className="text-sm text-resume-secondary">
            {filteredProjects.length} {filteredProjects.length === 1 ? 'project' : 'projects'}
          </span>
        </div>

        {/* View Toggle */}
        <div className="flex items-center gap-2">
          <Button
            isIconOnly
            size="sm"
            variant={viewMode === 'grid' ? 'flat' : 'light'}
            color={viewMode === 'grid' ? 'primary' : 'default'}
            onClick={() => setViewMode('grid')}
            aria-label="Grid view"
            className={viewMode === 'grid' ? 'text-resume-accent' : ''}
          >
            <Grid size={16} />
          </Button>
          <Button
            isIconOnly
            size="sm"
            variant={viewMode === 'list' ? 'flat' : 'light'}
            color={viewMode === 'list' ? 'primary' : 'default'}
            onClick={() => setViewMode('list')}
            aria-label="List view"
            className={viewMode === 'list' ? 'text-resume-accent' : ''}
          >
            <List size={16} />
          </Button>
        </div>
      </div>

      {/* Projects Grid/List */}
      {projects.length === 0 ? (
        <div className="text-center py-12 text-resume-secondary">
          <p>No projects to display</p>
        </div>
      ) : filteredProjects.length === 0 ? (
        <div className="text-center py-12 text-resume-secondary">
          <p className="mb-4">No projects found matching the selected filters.</p>
          <Button
            size="sm"
            variant="flat"
            color="primary"
            onClick={clearFilters}
            startContent={<X size={14} />}
          >
            Clear Filters
          </Button>
        </div>
      ) : (
        <motion.div
          className={
            viewMode === 'grid'
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 grid-view'
              : 'space-y-4 list-view'
          }
          layout
        >
          {filteredProjects.map((project, index) => (
            <motion.div
              key={`${project.title}-${index}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              layout
            >
              <ProjectCard project={project} variant={viewMode} />
            </motion.div>
          ))}
        </motion.div>
      )}
    </Resume.Section>
  );
};
