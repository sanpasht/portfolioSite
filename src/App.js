import React, { useState, useEffect } from 'react';
import { ChevronRight, ChevronDown, FileText, FileCode, Github, Linkedin, X } from 'lucide-react';
import './App.css';

const App = () => {
  const [openTabs, setOpenTabs] = useState(['about.ts']);
  const [activeTab, setActiveTab] = useState('about.ts');
  const [expandedFolders, setExpandedFolders] = useState({ 'src': true });
  const [cursorBlink, setCursorBlink] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => setCursorBlink(prev => !prev), 530);
    return () => clearInterval(interval);
  }, []);

  const fileStructure = {
    'src': {
      type: 'folder',
      children: {
        'about.ts': { type: 'file', icon: 'ts' },
        'navigation.ts': { type: 'file', icon: 'ts' },
        'skills.ts': { type: 'file', icon: 'ts' },
        'projects.ts': { type: 'file', icon: 'ts' },
        'philosophy.md': { type: 'file', icon: 'md' }
      }
    },
    'resume.pdf': { type: 'file', icon: 'pdf', downloadable: true, path: '/resume.pdf' },
    'github': { type: 'link', icon: 'github', url: 'https://github.com/sanpasht' },
    'linkedin': { type: 'link', icon: 'linkedin', url: 'https://linkedin.com/in/sanpasht' },
    'contact.md': { type: 'file', icon: 'md' }
  };

  const fileContents = {
    'about.ts': {
      lang: 'typescript',
      content: `
// SOFTWARE ENGINEER

interface Engineer {
  name: string;
  role: string;
  location: string;
  background: string[];
  passions: string[];
}

const me: Engineer = {
  name: "San Pashtoon",
  role: "Full-Stack Software Engineer",
  location: "Irvine, CA",
  background: [
    "Computer Science & Mathematics"
  ],
  passions: [
    "Coding",
    "Reading",
    "Boxing/Wrestling",
    "Chess"
  ]
};

// I believe great software is invisible.
// It just works, and it feels right.

export default me;`
    },
    'navigation.ts': {
      lang: 'typescript',
      content: `/**
 * NAVIGATION GUIDE
 * 
 * Welcome to my portfolio workspace.
 * This site gives you a sense of how I think about systems and interfaces.
 */

interface NavigationGuide {
  explore: string;
  interact: string;
  mobile: string;
}

const guide: NavigationGuide = {
  explore: "Click files in the sidebar to view content",
  interact: "Use arrow keys to navigate, Enter to open",
  mobile: "Tap the menu icon to toggle the sidebar"
};

// Each file represents a different aspect of my work
// - about.ts: Who I am
// - skills.ts: What I know
// - projects.ts: What I've built
// - philosophy.md: How I think
// - resume.pdf: Traditional format
// - github/linkedin: External profiles
// - contact.md: Get in touch

export { guide };`
    },
    'skills.ts': {
      lang: 'typescript',
      content: `type SkillCategory = {
  [key: string]: string[];
};

const skills: SkillCategory = {
  languages: [
    
    "Python",
    "C/C++", 
    "TypeScript",
    "JavaScript",
    "SQL (Postgres, mySQL)",
    "HTML/CSS", 
    "R", 
    "Matlab"
  ],
  
  frontend: [
    "React",
    "Next.js",
    "TailwindCSS",
  ],
  
  backend: [
    "Node.js",
    "Express",
    "Redis",
    "GraphQL",
    "REST APIs"
  ],
  
  tools: [
    "Git",
    "Docker",
    "AWS",
    "CI/CD",
    "Linux",
    "VS Code (obviously)"
  ],

};

// Constantly learning, always curious
export default skills;`
    },
    'projects.ts': {
      lang: 'typescript',
      content: `interface Project {
  name: string;
  description: string;
  tech: string[];
  highlights: string[];
  link?: string;
}


const projects: Project[] = [
  {
    name: "Machine Service API",
    description: "Fault-tolerant machine management system with authentication and caching",
    tech: ["TypeScript", "Node.js", "Jest", "Redis"],
    highlights: [
      "Authentication, caching, and fault-tolerant hardware control",
      "Simulation-driven test framework modeling database and cache performance",
      "Achieved consistent 60%+ cache hit rates under load"
    ]
  },
  
  {
    name: "Algorithmic Trading System",
    description: "Portfolio optimization algorithm with risk management",
    tech: ["Python", "NumPy", "Pandas", "scikit-learn", "Alpaca API"],
    highlights: [
      "Rebalanced $500K simulated portfolio achieving 10% annual return",
      "5% lower volatility compared to S&P 500 baseline",
      "Improved net returns by 0.5% through limit order optimization"
    ]
  },
  
  {
    name: "Facial Emotion Detection System",
    description: "Real-time CNN-based emotion classifier with webcam integration",
    tech: ["Python", "TensorFlow", "Keras", "OpenCV", "NumPy"],
    highlights: [
      "92% validation accuracy classifying 7 emotions on 30,000+ images",
      "Advanced preprocessing improved robustness by 15%",
      "Real-time detection at 30 FPS with sub-200ms latency"
    ]
  },

  {
    name: "Userspace Dynamic Thread Scheduler",
    description: "Custom thread scheduler with pthread-style API in userland",
    tech: ["C", "Assembly", "Context Switching", "Synchronization"],
    highlights: [
      "Thread creation, joining, and synchronization primitives",
      "All scheduling and context switching in userspace",
      "Thread-local storage implementation"
    ]
  },

  {
    name: "Just-in-Time Compiler",
    description: "JIT expression compiler with dynamic code generation",
    tech: ["C", "Lexer/Parser", "Dynamic Linking", "fork/exec"],
    highlights: [
      "Lexical analysis and parsing of mathematical expressions",
      "Dynamic C code generation and compilation to shared objects",
      "Runtime execution via dlopen/dlsym with safe memory management"
    ]
  },

  {
    name: "Brownian Motion Simulation",
    description: "Interactive particle collision simulator with real-time visualization",
    tech: ["Python", "OpenGL", "NumPy", "Physics Modeling"],
    highlights: [
      "Elastic collision modeling with momentum conservation",
      "Real-time OpenGL rendering and trajectory visualization",
      "Data logging for collision analysis and pattern detection"
    ]
  },

  {
    name: "License Plate Recognition System",
    description: "OCR-based system for automated license plate detection",
    tech: ["Python", "OpenCV", "Tesseract OCR", "Image Processing"],
    highlights: [
      "Grayscale conversion, contour detection, and thresholding",
      "Optimized for varying lighting and angle conditions",
      "Preprocessing pipelines improved detection accuracy"
    ]
  }
];

export { projects };`
    },
    'philosophy.md': {
      lang: 'markdown',
      content: `# Engineering Philosophy

## First-principles 

I approach engineering from first principles. I don't trust surface explanations, tradition, or vibes. I want to know what's actually happening underneath the system.

## Adversarial systems thinking

I assume systems are adversarial. They get stressed, exploited, and pushed to breaking points. I look for traps, bait, and tradeoffs rather than idealized behavior.

## Optimization under constraints

I optimize under constraints instead of chasing perfection. I'm fine with solutions that are suboptimal on paper if they're robust in reality.

## Empirical over dogmatic

I'm empirical before I'm dogmatic. I trust feedback loops more than authority. If something works in practice, it earns legitimacy

`
    },
    'contact.md': {
      lang: 'markdown',
      content: `# Get In Touch

I'm always interested in hearing about new opportunities, interesting problems, or just connecting with fellow engineers.

## Reach Me

- **Email**: sspashto@uci.edu
- **GitHub**: github.com/sanpasht
- **LinkedIn**: linkedin.com/in/sanpasht
- **Location**: Irvine, CA

## What I'm Looking For

- Challenging technical problems
- Strong engineering culture
- Collaborative teams
- Opportunities to learn and grow

## Response Time

I typically respond within 24-48 hours. If you don't hear back, feel free to follow up—I'm human and sometimes miss messages.
`
    },
    'resume.pdf': {
      lang: 'pdf',
      content: `PDF Viewer Simulation

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

SAN PASHTOON
Software Engineer

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

EXPERIENCE

AI Researcher | Keyword Studios
January 2025 - September 2025

-Engineered AI training pipelines and produced 10,000+ labeled samples using Python automation scripts, strengthening dataset diversity and improving model generalization
-Delivered 5,000+ high-quality annotations weekly through optimized JSON/XML pipelines, maintaining >98% accuracy across NLP domains
-Conducted research across 100+ assignments leveraging academic databases and NLP libraries, adapting outputs dynamically to match varying tone and style requirements

Software Engineering Intern | Secure Guard Security Services
June 2024 - December 2024

-Developed Python automation scripts for data extraction, cleaning, and reporting workflows that reduced manual processing time by 40%
-Built interactive SQL dashboards visualizing service KPIs, parts inventory trends, and workflow efficiency metrics, identifying $50K+ in annual cost savings
-Analyzed vehicle service history datasets containing 10,000+ records to improve inventory forecasting accuracy by 25%

Data Science Intern | Medtronic
January 2024 - June 2024

-Developed and deployed full-stack web application using React, JavaScript, HTML/CSS, and SQL databases, supporting labeling workflows for 20+ users
-Conducted comprehensive testing with Chrome DevTools, Jest, and Postman, identifying and resolving 50+ defects to ensure 99%+ application reliability
-Collaborated with compliance teams to validate regulatory claims against FDA guidelines, reducing approval cycle time by 30%

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

EDUCATION

Master's in Computer Science
University of California, Irvine | December 2026

B.S. Mathematics, Data Science Concentration
University of California, Irvine | June 2024

GPA: 3.7 | Dean's List: Winter 2023 - Spring 2024
Relevant Coursework: Data Science, Numerical Analysis, Optimization, Algorithms and Data Structures, Machine Learning, Statistics

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

SKILLS

Languages: Python, JavaScript, TypeScript, SQL, C++, C, R, HTML/CSS, Swift, MATLAB
Frontend: React, Next.js, TailwindCSS
Backend: Node.js, PostgreSQL, Redis
Tools: Git, Docker, AWS, Linux

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[Download PDF]`
    }
  };

  const openFile = (filename) => {
    const file = filename.includes('/') ? filename.split('/')[1] : filename;
    
    // Handle PDF files - open in new tab
    if (file === 'resume.pdf') {
      window.open('/resume.pdf', '_blank', 'noopener,noreferrer');
      return;
    }
    
    // Handle external links
    if (fileStructure[file]?.type === 'link' || fileStructure.src?.children[file]?.type === 'link') {
      const linkFile = fileStructure[file] || fileStructure.src.children[file];
      window.open(linkFile.url, '_blank', 'noopener,noreferrer');
      return;
    }
    if (fileStructure[file]?.type === 'link' || fileStructure.src?.children[file]?.type === 'link') {
      const linkFile = fileStructure[file] || fileStructure.src.children[file];
      window.open(linkFile.url, '_blank');
      return;
    }
    
    if (!openTabs.includes(file)) {
      setOpenTabs([...openTabs, file]);
    }
    setActiveTab(file);
  };

  const closeTab = (filename, e) => {
    e.stopPropagation();
    const newTabs = openTabs.filter(t => t !== filename);
    setOpenTabs(newTabs);
    if (activeTab === filename && newTabs.length > 0) {
      setActiveTab(newTabs[newTabs.length - 1]);
    }
  };

  const toggleFolder = (folder) => {
    setExpandedFolders(prev => ({ ...prev, [folder]: !prev[folder] }));
  };

  const getFileIcon = (icon) => {
    if (icon === 'ts') return <span className="text-blue-400">TS</span>;
    if (icon === 'md') return <span className="text-yellow-400">MD</span>;
    if (icon === 'pdf') return <span className="text-red-400">PDF</span>;
    if (icon === 'github') return <Github size={14} />;
    if (icon === 'linkedin') return <Linkedin size={14} />;
    return <FileText size={14} />;
  };

  const renderFileTree = () => {
    return (
      <div className="text-sm">
        <div className="px-4 py-2 text-xs text-gray-400 font-semibold tracking-wide">EXPLORER</div>
        <div className="px-2">
          <div className="text-xs text-gray-400 mb-1 px-2">PORTFOLIO</div>
          
          <div>
            <div 
              className="flex items-center gap-1 px-2 py-1 hover:bg-gray-700 cursor-pointer rounded"
              onClick={() => toggleFolder('src')}
            >
              {expandedFolders.src ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
              <span className="text-blue-300">src/</span>
            </div>
            {expandedFolders.src && (
              <div className="ml-4">
                {Object.entries(fileStructure.src.children).map(([name, file]) => (
                  <div
                    key={name}
                    className="flex items-center gap-2 px-2 py-1 hover:bg-gray-700 cursor-pointer rounded"
                    onClick={() => openFile(`src/${name}`)}
                  >
                    {getFileIcon(file.icon)}
                    <span className={activeTab === name ? 'text-white' : 'text-gray-300'}>{name}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {['resume.pdf', 'github', 'linkedin', 'contact.md'].map(name => {
            const file = fileStructure[name];
            return (
              <div
                key={name}
                className="flex items-center gap-2 px-2 py-1 hover:bg-gray-700 cursor-pointer rounded"
                onClick={() => openFile(name)}
              >
                {getFileIcon(file.icon)}
                <span className={activeTab === name ? 'text-white' : 'text-gray-300'}>{name}</span>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderContent = () => {
    const content = fileContents[activeTab];
    if (!content) return null;

    if (content.lang === 'pdf') {
      return (
        <div className="p-8 bg-gray-800 h-full overflow-auto">
          <pre className="font-mono text-sm text-gray-300 whitespace-pre-wrap">{content.content}</pre>
        </div>
      );
    }

    const lines = content.content.split('\n');
    
    return (
      <div className="font-mono text-sm overflow-auto h-full">
        {lines.map((line, i) => (
          <div key={i} className="flex hover:bg-gray-800">
            <div className="text-gray-600 text-right pr-4 pl-4 select-none w-12 flex-shrink-0">
              {i + 1}
            </div>
            <div className="flex-1 pr-4">
              <SyntaxHighlight line={line} lang={content.lang} />
            </div>
          </div>
        ))}
        <div className="flex">
          <div className="w-12"></div>
          <div className={`w-2 h-5 bg-gray-300 ${cursorBlink ? 'opacity-100' : 'opacity-0'} transition-opacity`}></div>
        </div>
      </div>
    );
  };

  return (
    <div className="h-screen bg-gray-900 text-gray-300 flex flex-col font-sans overflow-hidden">
      <div className="bg-gray-800 border-b border-gray-700 px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button 
            className="lg:hidden text-gray-400 hover:text-white"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            ☰
          </button>
          <FileCode size={16} className="text-blue-400" />
          <span className="text-sm">Portfolio - VS Code</span>
        </div>
        <div className="text-xs text-gray-500">Developer Workspace</div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <div className={`${sidebarOpen ? 'w-64' : 'w-0'} lg:w-64 bg-gray-850 border-r border-gray-700 overflow-y-auto transition-all duration-300`}>
          {sidebarOpen && renderFileTree()}
        </div>

        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="bg-gray-800 border-b border-gray-700 flex overflow-x-auto">
            {openTabs.map(tab => (
              <div
                key={tab}
                className={`flex items-center gap-2 px-4 py-2 border-r border-gray-700 cursor-pointer group ${
                  activeTab === tab ? 'bg-gray-900 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-750'
                }`}
                onClick={() => setActiveTab(tab)}
              >
                <span className="text-sm whitespace-nowrap">{tab}</span>
                <X 
                  size={14} 
                  className="opacity-0 group-hover:opacity-100 hover:text-white transition-opacity"
                  onClick={(e) => closeTab(tab, e)}
                />
              </div>
            ))}
          </div>

          <div className="flex-1 bg-gray-900 overflow-hidden">
            {renderContent()}
          </div>

          <div className="bg-blue-600 px-4 py-1 flex items-center justify-between text-xs">
            <div className="flex items-center gap-4">
              <span>UTF-8</span>
              <span>{fileContents[activeTab]?.lang === 'typescript' ? 'TypeScript' : 'Markdown'}</span>
            </div>
            <div>Ln {1}, Col {1}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

const SyntaxHighlight = ({ line, lang }) => {
  if (lang === 'markdown') {
    if (line.startsWith('# ')) return <span className="text-blue-400 font-bold">{line}</span>;
    if (line.startsWith('## ')) return <span className="text-blue-300 font-bold">{line}</span>;
    if (line.startsWith('- ') || line.startsWith('* ')) return <span className="text-green-400">{line}</span>;
    if (line.startsWith('*') && line.endsWith('*')) return <span className="text-gray-400 italic">{line}</span>;
    if (line.startsWith('---')) return <span className="text-gray-600">{line}</span>;
    return <span className="text-gray-300">{line}</span>;
  }

  if (line.trim().startsWith('//')) {
    return <span className="text-gray-500">{line}</span>;
  }
  if (line.trim().startsWith('*') || line.trim().startsWith('/**')) {
    return <span className="text-gray-500">{line}</span>;
  }
  
  if (line.includes('"') || line.includes("'")) {
    const parts = line.split(/("[^"]*"|'[^']*')/);
    return (
      <span>
        {parts.map((part, i) => 
          (part.startsWith('"') || part.startsWith("'")) ? 
            <span key={i} className="text-orange-400">{part}</span> : 
            <span key={i}>{part}</span>
        )}
      </span>
    );
  }
  
  return <span className="text-gray-300">{line}</span>;
};

export default App;