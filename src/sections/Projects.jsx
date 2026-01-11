import { ArrowUpRight, Github } from "lucide-react";
import { AnimatedBorderButton } from "../components/AnimatedBorderButton";

const projects = [
    {
        title: "FLIQUEY Social",
        description: "Description for project one.",
        image: "/assets/projects/fliquey.avif",
        tags: ["PHP", "MySQL", "JavaScript", "Bootstrap", "Smarty Template Engine", "Docker"],
        link: "https://social.fliquey.com/",
        github: "#"
    },
    {
        title: "Applemax Stream",
        description: "Description for project two.",
        image: "/assets/projects/applemax-stream.avif",
        tags: ["Laravel", "PHP", "MySQL", "Bootstrap", "Docker", "JavaScript"],
        link: "#",
        github: "#"
    },
    {
        title: "FLIQUEY Landing Page",
        description: "Description for project three.",
        image: "/assets/projects/fliquey-landing.avif",
        tags: ["Bootstrap", "PHP", "JavaScript"],
        link: "#",
        github: "#"
    },
    {
        title: "Professional Portfolio",
        description: "Description for project four.",
        image: "/assets/projects/professional-portfolio.avif",
        tags: ["React.js", "TailwindCSS", "JavaScript", "Cloudflare Pages", "EmailJS"],
        link: "https://rgmazon.pages.dev/",
        github: "#"
    },
    {
        title: "Consbeez Call Center Services Website",
        description: "Designed, developed, deployed, and maintained the official website of Consbeez, delivering a fast, responsive, and user-focused web experience.",
        image: "/assets/projects/consbeez.png",
        tags: ["Bootstrap", "JavaScript", "PHP", "PHPMailer"],
        link: "https://consbeez.com/",
        github: "#"
    }
]


export const Projects = () => {
    return (
        <section className="py-32 relative overflow-hidden" id="projects">

            {/* Green Dots */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">


                {[...Array(30)].map((_, i) => (
                    <div 
                        className="absolute w-0.5 h-0.5 rounded-full opacity-60 animate-pulse"
                        style={{
                            backgroundColor: "#5966cc",
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            animation: `slow-drift ${15 + Math.random() * 20}s ease-in-out infinite`,
                            animationDelay: `${Math.random() * 5}s`,
                        }}
                    /> 
                ))}

            </div>

            {/* Bg glows */}
            <div className="absolute top-1/4 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
            <div className="absolute bottom-1/4 left-0 w-64 h-64 bg-highlight/5 rounded-full blur-3xl" />
            <div className="container mx-auto px-6 relative z-10">
                
                {/* Section Header */}
                <div className="text-center mx-auto max-w-3xl mb-16">
                    <span className="text-secondary-foreground text-sm font-medium tracking-wider uppercase animate-fade-in">
                        Featured Work
                    </span>
                    <h2 className="text-4xl md:text-5xl font-bold mt-4 mb-6 animate-fade-in animation-delay-100 text-secondary-foreground">
                        Projects that 
                        <span className="font-serif italic font-normal text-white">
                            {" "}
                            make an impact.
                        </span>
                    </h2>
                    <p className="text-muted-foreground text-lg animate-fade-in animation-delay-200">
                        A selection of projects showcasing my skills in web development, design, and problem-solving.
                    </p>
                </div>

                {/* Projects Grid */}
                <div className="grid md:grid-cols-2 gap-8">
                    {projects.map((project, idx) => (
                        <div key={idx} 
                            className="group glass rounded-2xl overflow-hidden animate-fade-in md:row-span-1"
                            style={{ animationDelay: `${(idx + 1) * 100}ms` }}
                        >
                            {/* Image */}
                            <div className="relative overflow-hidden aspect-video">
                                <img 
                                    src={project.image} 
                                    alt={project.title} 
                                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-card via-card/50 to-transparent opacity-60" />
                                {/* Overlay Links */}
                                <div className="absolute inset-0 flex items-center justify-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <a 
                                        href={project.link} 
                                        className="p-3 rounded-full glass hover:bg-primary hover:text-primary-foreground transition-all"
                                    >
                                        <ArrowUpRight className="w-5 h-5" />
                                    </a>
                                    <a 
                                        href={project.github} 
                                        className="p-3 rounded-full glass hover:bg-primary hover:text-primary-foreground transition-all"
                                    >
                                        <Github className="w-5 h-5" />
                                    </a>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-6 space-y-4">
                                <div className="flex items-start justify-between">
                                    <h3 className="text-xl font-semibold group:hover:text-primary transition-colors">
                                        {project.title}
                                    </h3>
                                    <ArrowUpRight 
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
                                                    font-medium border border-border/50 text-muted-foreground 
                                                    hover:border-primary/50 hover:text-primary transition-all 
                                                    duration-300 hover:cursor-pointer" 
                                            key={tagIdx}>{tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* View All CTA */}
                <div className="text-center mt-12 animate-fade-in animation-delay-500">
                    <AnimatedBorderButton>  
                        View All Projects
                        <ArrowUpRight className="w-5 h-5" />
                    </AnimatedBorderButton>  
                </div>

            </div>
        </section>
    );
}