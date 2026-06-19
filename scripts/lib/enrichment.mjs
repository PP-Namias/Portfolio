/**
 * Enrichment
 *
 * Provides challenge/solution/result content for showcase projects.
 * Templates for projects without manual content.
 */

/**
 * Manual enrichment content for showcase projects
 * Each entry provides narrative content for the detail page.
 */
export const ENRICHMENT_DATA = {
  'Klaro': {
    challenge: 'Filipino patients frequently struggle to understand medical documents and find affordable healthcare providers, especially when information is only available in English or Tagalog. Regional dialect speakers in Visayas and Northern Luzon face even greater barriers to accessing health information.',
    solution: 'Built a full-stack monorepo using Turborepo with Expo (React Native) for mobile and Next.js for web. Integrated AI-powered medical document analysis that translates clinical language into patient-friendly explanations, a multilingual chatbot supporting Filipino, Bisaya, and Ilocano, and a geolocation-based provider network with PhilHealth insurance filtering.',
    result: 'Delivered a production-ready health companion app supporting 3 Filipino dialects with integrated free consultation booking, provider discovery, and AI-assisted document understanding. The system handles real-time chat, document uploads, and location-based care facility recommendations.',
  },
  'Portfolio': {
    challenge: 'Needed a performant, secure, and content-managed portfolio that could showcase projects with rich detail pages while maintaining a 100/100 react-doctor score and comprehensive security scanning.',
    solution: 'Built with Next.js 14, Sanity CMS, and Gemini AI chat. Implemented multi-layer caching (Redis + ISR), HMAC-secured media gateway, and 278 tests across 19 CI/CD workflows. Added PentestAgent for automated security scanning and accessibility auditing.',
    result: 'Production portfolio at namias.tech with automated security scanning, AI chat assistant, and zero critical accessibility issues. Achieved 85/100 on react-doctor with comprehensive test coverage.',
  },
  'CaseMaster': {
    challenge: 'Legal professionals needed a unified case management system that could integrate with Microsoft Office tools, handle email communications, and maintain detailed case histories with audit trails.',
    solution: 'Developed a desktop application using Java with JavaFX for the UI layer, integrating Microsoft Office APIs for document handling. Implemented an email management system, Notion-style case tracker with rich text editing, and a comprehensive audit logging system with archive capabilities.',
    result: 'Delivered a full-featured case management solution with seamless Office integration, automated email tracking, and complete audit history. The system supports multi-user access with role-based permissions.',
  },
  'Whisper_AI_Real_Time': {
    challenge: 'Real-time speech-to-text transcription requires low latency, high accuracy, and efficient GPU utilization while supporting multiple languages and audio qualities.',
    solution: 'Implemented OpenAI Whisper model with real-time audio streaming, supporting multiple model sizes (tiny, base, small, medium, large) for different accuracy/speed tradeoffs. Added GPU acceleration with CUDA support and automatic model selection based on available hardware.',
    result: 'Achieved near real-time transcription with state-of-the-art accuracy across multiple languages. The system adapts to available GPU resources and provides configurable quality settings.',
  },
  'Whisper_AI_Generate_Subtitles_Transcriptions': {
    challenge: 'Content creators need efficient subtitle generation from audio and video files, supporting multiple output formats and batch processing for large media libraries.',
    solution: 'Built a Python application using OpenAI Whisper for transcription with FFmpeg for media processing. Implemented support for SRT, VTT, and ASS subtitle formats, with batch processing capabilities for handling multiple files simultaneously.',
    result: 'Delivered a production-ready subtitle generation tool that processes audio/video files with high accuracy, supporting multiple output formats and efficient batch processing.',
  },
  'Student-Attendance-Management-System': {
    challenge: 'Educational institutions need efficient attendance tracking that eliminates manual paper-based processes, provides real-time analytics, and supports role-based access for teachers and administrators.',
    solution: 'Developed a barcode-based attendance system with a mobile app for teachers and an admin dashboard. Implemented real-time attendance logging, analytics with visual charts, and role-based access control separating teacher, student, and administrator permissions.',
    result: 'Deployed a complete attendance management solution with mobile and web interfaces, real-time sync, and comprehensive analytics. Reduced attendance tracking time by 80% compared to manual methods.',
  },
  'Pre_enrollment_Management_System': {
    challenge: 'Young Achievers School of Caloocan needed a digital pre-enrollment system to streamline student registration, reduce paperwork, and improve administrative efficiency.',
    solution: 'Built a web application with student data management, enrollment workflow automation, and optimized database design. Implemented form validation, document upload capabilities, and status tracking for enrollment applications.',
    result: 'Successfully deployed a web-based enrollment system that reduced processing time and improved data accuracy for the school administration.',
  },
  'Billing_Management_System': {
    challenge: 'Retail shops need efficient billing management with product CRUD operations, transaction logging, and export capabilities for accounting and inventory purposes.',
    solution: 'Developed a JavaFX 21 desktop application with MySQL database integration. Implemented modern UI with product management, billing logs, Excel export functionality using Apache POI, and multi-contributor collaboration support.',
    result: 'Delivered a complete billing management solution with intuitive UI, reliable data storage, and comprehensive export capabilities for business reporting.',
  },
  'Car_Dealership_Management_Program': {
    challenge: 'Car dealerships need inventory management, sales tracking, and customer relationship management in a unified desktop application built with efficient file I/O operations.',
    solution: 'Implemented a comprehensive C++ application with vehicle inventory management, sales tracking, and customer records. Used file I/O operations for persistent data storage with efficient search and filtering capabilities.',
    result: 'Built a fully functional dealership management system demonstrating advanced C++ programming with file handling and data management.',
  },
  'Java_Rice': {
    challenge: 'Food ordering systems need intuitive interfaces that allow customers to browse menus, place orders, and track order status efficiently.',
    solution: 'Created an interactive Java Swing application with menu browsing, order management, and real-time order tracking. Implemented database integration for persistent order history and menu management.',
    result: 'Developed a complete food ordering solution with intuitive UI, order processing, and persistent data storage.',
  },
  'Sage_AI': {
    challenge: 'Building an AI assistant requires intelligent conversation capabilities, context awareness, and natural language understanding for meaningful interactions.',
    solution: 'Implemented an AI-powered assistant using Python with OpenAI integration and LangChain for conversation management. Added context-aware responses and natural language processing capabilities.',
    result: 'Delivered an intelligent assistant system with natural conversation abilities and context-aware interactions.',
  },
  'Biometric_Attendance_System_Using_IOT': {
    challenge: 'Traditional attendance systems are prone to proxy attendance and require manual verification. Biometric authentication using IoT devices can provide secure, automated attendance tracking.',
    solution: 'Integrated fingerprint scanner hardware with Arduino microcontroller for biometric verification. Implemented real-time attendance logging with IoT communication protocols and embedded systems programming for reliable operation.',
    result: 'Successfully deployed a biometric attendance system with fingerprint verification, eliminating proxy attendance and automating the entire attendance process.',
  },
  'EVOLVE_OR_PERISH': {
    challenge: 'Simulating evolution and natural selection requires implementing genetic algorithms, fitness evaluation, and real-time visualization of creature behavior and adaptation.',
    solution: 'Built a Python simulation using Pygame for visualization, implementing genetic algorithms for creature evolution, natural selection mechanics, and real-time adaptation tracking.',
    result: 'Created an engaging evolution simulation demonstrating genetic algorithms, natural selection, and AI creature adaptation with real-time visualization.',
  },
};

/**
 * Get enrichment data for a project
 * @param {string} repoName - GitHub repository name
 * @returns {Object|null} Enrichment data or null
 */
export function getEnrichment(repoName) {
  return ENRICHMENT_DATA[repoName] || null;
}

/**
 * Generate fallback enrichment for projects without manual content
 * @param {Object} repo - GitHub repository object
 * @param {Object} curated - Curated project override
 * @returns {Object} Generated enrichment content
 */
export function generateFallbackEnrichment(repo, curated) {
  const category = curated.category || 'software project';
  const tech = curated.technologies?.join(', ') || repo.language || 'multiple technologies';
  const role = curated.role?.toLowerCase() || 'full-stack development';

  return {
    challenge: `Developing a ${category.toLowerCase()} required solving complex technical challenges while ensuring reliability, performance, and user experience.`,
    solution: `Built using ${tech} with a focus on ${role}. Implemented core features with emphasis on code quality, testing, and maintainability.`,
    result: `Successfully delivered a functional ${category.toLowerCase()} demonstrating ${role} skills and technical proficiency.`,
  };
}
