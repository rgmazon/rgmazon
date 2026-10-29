import { useState } from "react";
import { ArrowUpRight, Github } from "lucide-react";
import { AnimatedBorderButton } from "../components/AnimatedBorderButton";
import ProjectModal from "../components/ProjectModal";
import { withViewTransition, HERO_NAME } from "../lib/viewTransition";


const projects = [
  {
    title: "FLIQUEY Social",
    description:
      "Built a social platform that gives users a place to create profiles, interact with content, and engage through a responsive experience. The work focused on clear product structure, maintainable architecture, and smooth deployment for a growing community product.",
    image: "/assets/projects/fliqueySocial/fliquey.avif",
    // video: "/assets/projects/fliqueySocial/fliquey-video.webm",
    tags: [
      "PHP",
      "MySQL",
      "JavaScript",
      "Bootstrap",
      "Smarty Template Engine",
      "Docker",
      "Mustache",
    ],
    link: "https://social.fliquey.com/",
    github: "#",
    moreImages: [
      "/assets/projects/fliqueySocial/fliquey-1.avif",
      "/assets/projects/fliqueySocial/fliquey-2.avif",
      "/assets/projects/fliqueySocial/fliquey-3.avif",
    ],
  },
  {
    title: "Applemax Stream",
    description:
      "Developed a streaming experience designed for scalable media consumption with a polished UI and reliable backend structure. The project emphasized performance, maintainability, and deployment readiness for a digital entertainment product.",
    image: "/assets/projects/applemaxStream/applemax-stream.avif",
    // video: "/assets/projects/applemaxStream/applemax-stream-video.webm",
    tags: ["Laravel", "PHP", "MySQL", "Bootstrap", "Docker", "JavaScript"],
    link: "#",
    github: "#",
    moreImages: [
      "/assets/projects/applemaxStream/applemax-stream-1.avif",
      "/assets/projects/applemaxStream/applemax-stream-2.avif",
      "/assets/projects/applemaxStream/applemax-stream-3.avif",
    ],
  },
  {
    title: "FLIQUEY Landing Page",
    description:
      "Created a conversion-focused landing experience to introduce FLIQUEY with clear messaging, responsive interactions, and fast-loading pages that strengthen first impressions and product awareness.",
    image: "/assets/projects/fliqueyLanding/fliqueyLanding.avif",
    // video: "/assets/projects/fliqueyLanding/fliqueyLanding-video.webm",
    tags: ["Bootstrap", "PHP", "JavaScript"],
    link: "#",
    github: "#",
    moreImages: [
      "/assets/projects/fliqueyLanding/fliqueyLanding-1.avif",
      "/assets/projects/fliqueyLanding/fliqueyLanding-2.avif",
      "/assets/projects/fliqueyLanding/fliqueyLanding-3.avif",
    ],
  },
  {
    title: "Professional Portfolio",
    description:
      "Built a personal portfolio that presents work clearly, improves contact conversion, and showcases technical expertise through a fast React-based experience optimized for usability and discoverability.",
    image: "/assets/projects/professionalPortfolio/professionalPortfolio.avif",
    video:
      "/assets/projects/professionalPortfolio/professionalPortfolio-video.webm",
    tags: [
      "React.js",
      "TailwindCSS",
      "JavaScript",
      "Cloudflare Pages",
      "EmailJS",
      "SEO",
      "Vite",
    ],
    link: "https://rgmazon.pages.dev/",
    github: "#",
    moreImages: [
      "/assets/projects/professionalPortfolio/professionalPortfolio-1.avif",
      "/assets/projects/professionalPortfolio/professionalPortfolio-2.avif",
      "/assets/projects/professionalPortfolio/professionalPortfolio-3.avif",
      "/assets/projects/professionalPortfolio/professionalPortfolio-4.avif",
      "/assets/projects/professionalPortfolio/professionalPortfolio-5.avif",
    ],
  },
  {
    title: "Consbeez Call Center Services Website",
    description:
      "Delivered a polished company website for Consbeez that improved online presence, made services easier to understand, and supported client inquiries through reliable contact handling and a responsive experience.",
    image: "/assets/projects/consbeez/consbeez.avif",
    video: "/assets/projects/consbeez/consbeez-video.webm",
    tags: ["Bootstrap", "JavaScript", "PHP", "PHPMailer", "SEO"],
    link: "https://consbeez.com/",
    github: "#",
    moreImages: [
      "/assets/projects/consbeez/consbeez-1.avif",
      "/assets/projects/consbeez/consbeez-2.avif",
      "/assets/projects/consbeez/consbeez-3.avif",
    ],
  },
  //   {
  //     title: "Blaseek Landing Page",
  //     description: "A sleek and modern landing page for Blaseek, crafted with TailwindCSS and JavaScript to ensure a responsive design and engaging user experience. Focused on clear calls-to-action and optimized for conversions.",
  //     image: "/assets/projects/blaseek/blaseek.avif",
  //     video: "/assets/projects/blaseek/blaseek-video.webm",
  //     tags: ["TailwindCSS", "JavaScript", "React.js", "EmailJS", "Vite", "SEO"],
  //     link: "https://blaseek.com/",
  //     github: "#",
  //     moreImages: [
  //       "/assets/projects/blaseek/blaseek-1.avif",
  //       "/assets/projects/blaseek/blaseek-2.avif",
  //       "/assets/projects/blaseek/blaseek-3.avif"
  //     ]
  //   },
  {
    title: "Image Converter",
    description:
      "Built a practical image conversion tool that helps users quickly transform files between common formats while keeping the experience simple, responsive, and efficient.",
    image: "/assets/projects/imageConverter/imageConverter.avif",
    video: "/assets/projects/imageConverter/imageConverter-video.webm",
    tags: [
      "React.js",
      "TailwindCSS",
      "Node.js",
      "Express",
      "Sharp",
      "REST API",
      "Vite",
      "pnpm",
      "Cloudflare Pages",
      "Render.com",
    ],
    link: "#",
    github: "https://github.com/rgmazon/Image-Converter/",
    moreImages: [
      "/assets/projects/imageConverter/imageConverter-1.avif",
      "/assets/projects/imageConverter/imageConverter-2.avif",
      "/assets/projects/imageConverter/imageConverter-3.avif",
    ],
  },
  {
    title: "Follo - Job Application Tracker",
    description: `Created a job application tracker that helps users organize opportunities, monitor progress, and stay on top of follow-ups through a clear and structured workflow. The product is designed to reduce the stress of managing applications while keeping every interaction easy to review.`,
    image: "/assets/projects/follo/follo-1.webp",
    video: "/assets/projects/follo/follo-video.webm",
    tags: [
      "Next.js 15 (App Router)",
      "TypeScript",
      "TailwindCSS",
      "Supabase + Supabase Auth + Supabase JS client",
      "pnpm",
      "Vercel",
    ],
    link: "https://follo-phi.vercel.app/",
    github: "https://github.com/rgmazon/follo",
    moreImages: [
      "/assets/projects/follo/follo-1.webp",
      "/assets/projects/follo/follo-2.webp",
      "/assets/projects/follo/follo-3.webp",
      "/assets/projects/follo/follo-4.webp",
    ],
  },
  {
    title: "Grave Locator",
    description: "Developed a geospatial application that helps users search and contribute location data through a map-driven experience. The project combined modern frontend tooling, secure data handling, and AI-assisted development to deliver a practical community-focused solution.",
    image: "/assets/projects/graveLocator/graveLocator.webp",
    video: "/assets/projects/graveLocator/graveLocator-video.webm",
    tags: [
      "React.js",
      "TailwindCSS",
      "Mapbox GL JS",
      "Supabase",
      "Google Gemini",
      "Cloudflare Pages",
    ],
    link: "https://grave-locator.pages.dev/",
    github: "https://github.com/rgmazon/grave-locator",
    moreImages: [
      "/assets/projects/graveLocator/graveLocator-1.webp",
      "/assets/projects/graveLocator/graveLocator-2.webp",
      "/assets/projects/graveLocator/graveLocator-3.webp",
      "/assets/projects/graveLocator/graveLocator-4.webp",
      "/assets/projects/graveLocator/graveLocator-5.webp",
    ],
  },
  {
    title: "HeroDex",
    description: "Built a superhero encyclopedia that makes it easier to discover, compare, and save characters through interactive visuals and a polished experience. The project combined a modern frontend with API-backed features to create a more engaging discovery flow.",
    image: "/assets/projects/heroDex/HeroDex-Home.png",
    video: "",
    tags: [
      "React",
      "TypeScript",
      "TailwindCSS",
      "Laravel",
      "Supabase",
      "Docker",
      "Chart JS",
    ],
    link: "https://herodex-vert.vercel.app/",
    github: "https://github.com/rgmazon/herodex",
    moreImages: [
      "/assets/projects/heroDex/HeroDex-Login.png",
      "/assets/projects/heroDex/HeroDex-Signup.png",
      "/assets/projects/heroDex/HeroDex-Compare.png",
      "/assets/projects/heroDex/HeroDex-Home-Mobile.webp",
    ],
  }
];



export const Projects = () => {
    const [selectedProject, setSelectedProject] = useState(null);

    // The card image morphs into the modal gallery (and back) where view transitions are supported.
    const openProject = (project, img) => {
        img.style.viewTransitionName = HERO_NAME;
        withViewTransition(() => {
            img.style.viewTransitionName = "";
            setSelectedProject(project);
        });
    };

    const closeProject = () => {
        if (!selectedProject) return;
        const img = document.querySelector(`[data-project-image="${CSS.escape(selectedProject.title)}"]`);
        const transition = withViewTransition(() => {
            setSelectedProject(null);
            if (img) img.style.viewTransitionName = HERO_NAME;
        });
        const release = () => { if (img) img.style.viewTransitionName = ""; };
        if (transition) transition.finished.finally(release); else release();
    };

    return (
        <section className="py-32 relative overflow-hidden" id="projects">




            <div className="container mx-auto px-6 relative z-10">
                
                {/* Section Header */}
                <div className="text-center mx-auto max-w-3xl mb-16">
                    <span className="text-secondary-foreground text-sm font-medium tracking-wider uppercase animate-fade-in">
                        Featured Work
                    </span>
                    <h2 className="text-4xl md:text-5xl font-bold mt-4 mb-6 animate-fade-in animation-delay-100 text-secondary-foreground">
                        Projects built to
                        <span className="font-serif italic font-normal text-foreground">
                            {" "}
                            solve real problems.
                        </span>
                    </h2>
                    <p className="text-muted-foreground text-lg animate-fade-in animation-delay-200">
                        A selection of projects focused on solving real problems with thoughtful design, modern tooling, and measurable impact.
                    </p>
                </div>

                {/* Projects Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {projects.map((project, idx) => (
                        <article
                            key={project.title}
                            className="group relative surface overflow-hidden animate-fade-in md:row-span-1 cursor-pointer has-[button:focus-visible]:outline-2 has-[button:focus-visible]:outline-primary has-[button:focus-visible]:outline-offset-2"
                            style={{ animationDelay: `${(idx + 1) * 100}ms` }}
                        >
                            {/* Image */}
                            <div className="relative overflow-hidden aspect-video">
                                <img 
                                    src={project.image} 
                                    alt={project.title}
                                    data-project-image={project.title}
                                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                />
                                {/* Overlay links: clear glass over the image. They sit above the card's stretched button
                                    (z-10) and stay visible for keyboard users via focus-within. */}
                                <div className="absolute inset-0 z-10 flex items-center justify-center gap-4 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity duration-300 pointer-events-none">
                                    {project.link && project.link !== "#" && (
                                        <a
                                            href={project.link}
                                            target="_blank"
                                            rel="noreferrer"
                                            aria-label={`Visit ${project.title} (opens in a new tab)`}
                                            data-tone="dark"
                                            className="pointer-events-auto size-11 grid place-items-center rounded-full glass-clear hover:bg-primary hover:text-primary-foreground transition"
                                        >
                                            <ArrowUpRight className="w-5 h-5" aria-hidden="true" />
                                        </a>
                                    )}
                                    {project.github && project.github !== "#" && (
                                        <a
                                            href={project.github}
                                            target="_blank"
                                            rel="noreferrer"
                                            aria-label={`${project.title} source code (opens in a new tab)`}
                                            data-tone="dark"
                                            className="pointer-events-auto size-11 grid place-items-center rounded-full glass-clear hover:bg-primary hover:text-primary-foreground transition"
                                        >
                                            <Github className="w-5 h-5" aria-hidden="true" />
                                        </a>
                                    )}
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-6 space-y-4">
                                <div className="flex items-start justify-between">
                                    <h3 className="text-xl font-semibold group-hover:text-primary transition-colors">
                                        {/* The card's one real control. The pseudo-element stretches it over the whole card,
                                            so clicking anywhere opens the project without nesting buttons and links. */}
                                        <button
                                            type="button"
                                            onClick={(e) => openProject(project, e.currentTarget.closest("article").querySelector("img"))}
                                            aria-haspopup="dialog"
                                            className="text-left cursor-pointer focus-visible:outline-none after:absolute after:inset-0 after:content-['']"
                                        >
                                            {project.title}
                                        </button>
                                    </h3>
                                    <ArrowUpRight
                                        aria-hidden="true"
                                        className="w-5 h-5
                                        text-muted-foreground group-hover:text-primary 
                                        group-hover:translate-x-1 
                                        group-hover:translate-y-1 
                                        transition-all" 
                                    />
                                </div>
                                <p className="text-muted-foreground text-sm">
                                    {project.description}
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    {project.tags.map((tag, tagIdx) => (
                                        <span 
                                            className="px-4 py-1.5 rounded-full bg-surface text-xs
                                                    font-medium border border-border/50 text-muted-foreground"
                                            key={`${project.title}-${tag}-${tagIdx}`}>{tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </article>
                    ))}
                </div>

                {selectedProject && (
                    <ProjectModal project={selectedProject} onClose={closeProject} />
                )}

                {/* View All CTA */}
                {/* <div className="text-center mt-12 animate-fade-in animation-delay-500">
                    <AnimatedBorderButton>  
                        View All Projects
                        <ArrowUpRight className="w-5 h-5" />
                    </AnimatedBorderButton>  
                </div> */}

            </div>
        </section>
    );
}