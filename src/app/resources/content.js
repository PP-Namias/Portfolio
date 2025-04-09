import { InlineCode } from "@/once-ui/components";

const person = {
    firstName: 'Jhon Keneth',
    lastName: 'Namias',
    get name() {
        return `${this.firstName} ${this.lastName}`;
    },
    role: 'Full-Stack Developer & Game Creator',
    avatar: '/images/profile.jpeg',
    location: 'Asia/Manila',
    languages: ['English', 'Filipino'],
};

const newsletter = {
    display: true,
    title: <>Subscribe to {person.firstName}'s Tech Chronicles</>,
    description: <>Get monthly updates on web development insights, game creation tutorials, and cutting-edge tech solutions.</>,
};

const social = [
    {
        name: 'GitHub',
        icon: 'github',
        link: 'https://github.com/PP-Namias',
        badge: '5k+ Stars',
    },
    {
        name: 'LinkedIn',
        icon: 'linkedin',
        link: 'https://www.linkedin.com/in/PP-Namias',
        badge: '500+ Connections',
    },
    {
        name: 'Twitter',
        icon: 'x',
        link: 'https://twitter.com/PP_Namias',
        badge: '2k+ Followers',
    },
    {
        name: 'YouTube',
        icon: 'youtube',
        link: 'https://www.youtube.com/@PP_Namias',
        badge: '10k+ Views',
    },
    {
        name: 'Codepen',
        icon: 'codepen',
        link: 'https://codepen.io/PP-Namias',
        badge: '50+ Pens',
    },
];

const home = {
    label: 'Home',
    title: `${person.name}'s Innovation Hub`,
    description: `Showcasing cutting-edge web solutions and immersive game experiences`,
    headline: <>Full-Stack Architect & Interactive Experience Creator</>,
    subline: (
        <>
            Transforming ideas into <InlineCode>digital reality</InlineCode> through<br />
            code, design, and creative problem-solving
        </>
    ),
};

const about = {
    label: 'About',
    title: 'About me',
    description: `Meet ${person.name}, ${person.role} from ${person.location}`,
    tableOfContent: {
        display: true,
        subItems: true,
    },
    avatar: {
        display: true,
    },
    calendar: {
        display: true,
        link: 'https://cal.com',
    },
    intro: {
        display: true,
        title: 'Introduction',
        description: <>Jhon Keneth is a Manila-based developer with a passion for creating web applications and game development solutions. His work spans full-stack development, UI/UX design, and interactive experiences.</>,
    },
    work: {
        display: true,
        title: 'Work Experience',
        experiences: [
            {
                company: 'Freelancer',
                timeframe: '2023 - Present',
                role: 'Full-Stack Developer',
                achievements: [
                    <>Developed responsive web applications using modern frameworks and technologies</>,
                    <>Created interactive UI/UX designs that improved user engagement by 40%</>,
                ],
                images: [],
            },
            {
                company: 'Codsoft',
                timeframe: '2022 - 2023',
                role: 'Frontend Developer-Intern',
                achievements: [
                    <>Contributed to the development of enterprise-level web applications</>,
                    <>Implemented responsive designs that improved mobile user experience</>,
                ],
                images: [],
            },
        ],
    },
    studies: {
        display: true,
        title: 'Education',
        institutions: [
            {
                name: 'University of Caloocan City',
                description: <>Bachelor of Science in Computer Science (2022 - Present)</>,
            },
            {
                name: 'Young Achievers School',
                description: <>Information and Communications Technology (2020 - 2022)</>,
            },
        ],
    },
    technical: {
        display: true,
        title: 'Technical Skills',
        skills: [
            {
                title: 'Next.js',
                description: <>Building modern web applications with Next.js and Tailwind CSS</>,
                images: [
                    {
                        src: '/images/projects/nextjs.png',
                        alt: 'Next.js Project',
                        width: 16,
                        height: 9,
                    },
                ],
            },
            {
                title: 'Unity',
                description: <>Developing 2D/3D games and interactive experiences</>,
                images: [
                    {
                        src: '/images/projects/unity.png',
                        alt: 'Unity Project',
                        width: 16,
                        height: 9,
                    },
                ],
            },
            {
                title: 'Web Design',
                description: <>Creating responsive layouts with HTML5, CSS3, and JavaScript</>,
                images: [],
            },
        ],
    },
};

const blog = {
    label: 'Blog',
    title: 'Tech Insights & Tutorials',
    description: `Read ${person.name}'s latest articles on web development and game design`,
};

const work = {
    label: 'Projects',
    title: 'My Creations',
    description: `Development projects by ${person.name}`,
};

const gallery = {
    label: 'Gallery',
    title: 'My Development Journey',
    description: `A visual collection of ${person.name}'s work`,
    images: [
        {
            src: '/images/gallery/pre-enrollment-system.jpg',
            alt: 'Pre-enrollment System',
            orientation: 'vertical',
        },
        {
            src: '/images/gallery/car-dealership.jpg',
            alt: 'Car Dealership System',
            orientation: 'horizontal',
        },
        {
            src: '/images/gallery/unity-projects.jpg',
            alt: 'Unity Projects',
            orientation: 'vertical',
        },
    ],
};

export { person, social, newsletter, home, about, blog, work, gallery };