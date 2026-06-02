import {definePlugin, type Tool} from 'sanity'
import {BookIcon} from '@sanity/icons'
import {SkillsView} from './SkillsView'

const skillsTool: Tool = {
  name: 'skills',
  title: 'Skills',
  icon: BookIcon,
  component: SkillsView,
}

export const skillsToolPlugin = definePlugin(() => ({
  name: 'skills-tool',
  tools: [skillsTool],
}))
