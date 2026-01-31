import { Button } from "@/components/Button";
import { AnimatedBorderButton } from "@/components/AnimatedBorderButton";
import {
  ArrowRight,
  ChevronDown,
  Github,
  Linkedin,
  Download,
} from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

const skills = [
    "JavaScript",
    "React.js",
    "Node.js",
    "CSS",
    "HTML",
    "Tailwind CSS",
    "Github",
    "Figma",
    "WordPress",
    "PHP",
    "MySQL",
    "Laravel",
    "Vite"
];  

const skillIcons = [
    { name: "JavaScript", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg" },
    { name: "React.js", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" },
    { name: "Node.js", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg" },
    { name: "CSS", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg" },
    { name: "HTML", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg" },
    { name: "Tailwind CSS", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/tailwindcss/tailwindcss-original.svg" },
    // { name: "Next.js", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg" },
    //{ name: "TypeScript", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg" },
    { name: "Github", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg" },
    { name: "Figma", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg" },
    { name: "WordPress", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/wordpress/wordpress-plain.svg" },
    { name: "PHP", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/php/php-original.svg" },
    { name: "MySQL", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg" },
    { name: "Laravel", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/laravel/laravel-original.svg" },
    { name: "Vite", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vite/vite-original.svg" }
];  

export const Hero = () => {
    const { isDarkMode } = useTheme();

    return <section className="relative min-h-screen flex items-center overflow-hidden" id="hero">

        {/* Background Elements */}
        <div className="absolute inset-0 z-0">
            <img 
                src="/assets/hero-image.jpg" 
                alt="Hero Background" 
                className="w-full h-full object-cover opacity-40" 
            />
            <div className="absolute inset-0 bg-gradient-to-b from-background/20 via-background/80 to-background" />
        </div>

        {/* Green Dots */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">


            {[...Array(50)].map((_, i) => (
                <div 
                    key={i}
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

        {/* Content */ }
        <div className="container mx-auto px-6 pt-32 pb-20 relative z-10">
            <div className="grid lg:grid-cols-2 gap-12 items-center">

                {/* Left Column - Text Content */}
                <div className="space-y-8">
                    <div className="animate-dfade-in">
                        <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-sm text-primary">
                            <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                                RG Mazon · Front-End Developer Portfolio
                        </span>
                    </div>

                    {/* Headline */}
                    <div className="space-y-4">
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight animate-fade-in animation-delay-100">
                            Turning <span className="text-primary glow-text">ideas</span> 
                            <br />
                            into high-impact
                            <br /> 
                            <span className="font-serif italic font-normal text-white">
                                web experiences
                            </span>
                        </h1>

                        <p className="text-lg text-muted-foreground max-w-lg animate-fade-in animation-delay-200">
                            Hi, I'm RG Mazon — Turning ideas into interactive, high-performing web solutions is what I do best. 
                            I design, develop, and deploy digital products that feel great to use and are built to scale.
                        </p>


                    </div>

                    {/* Call to Action Buttons */}
                    <div className="flex flex-wrap gap-4 animate-fade-in animation-delay-300">

                        <a href="#contact">
                            <Button size="lg">
                                Contact Me <ArrowRight className="w-5 h-5" />
                            </Button>
                        </a>

                        <a href="/assets/MazonRudolfh.pdf" download>
                            <AnimatedBorderButton>
                                <Download className="w-5 h-5" />
                                Download CV
                            </AnimatedBorderButton>
                        </a>

                    </div>

                    {/* Social Links */}
                    <div className="flex items-center gap-4 animate-fade-in animation-delay-400">
                        <span className="text-sm text-muted-foreground">Follow: </span>
                        {[
                            { icon: Github, href: "https://github.com/rgmazon" },
                            { icon: Linkedin, href: "https://www.linkedin.com/in/rgmazon/" },
                        ].map((social) => (
                            <a key={social.href} href={social.href} className="p-2 rounded-full glass hover:bg-primary/10 hover:text-primary transition-all duration-300">
                                {<social.icon className="w-5 h-5" />}
                            </a>
                        ))}
                    </div>

                </div>
                {/* Right Column - Image Content */}
                <div className="relative animate-fade-in animation-delay-300">
                    {/* Profile Image */}
                    <div className="relative max-w-md mx-auto">
                        <div 
                            className="absolute inset-0 
                            rounded-3xl bg-gradient-to-br 
                            from-primary/30 via-transparent 
                            to-primary/10 blur-2xl animate-pulse" 
                        />
                        <div className="relative glass rounded-3xl p-2 glow-border">
                            <img 
                                src={isDarkMode ? "/assets/profile-image-dark.avif" : "/assets/profile-image-light.avif"}
                                alt="RG Mazon" 
                                className="w-full aspect-[4/5] object-cover rounded-2xl" 
                            />

                            {/* Floating Badge */}
                            <div className="absolute -bottom-4 -right-4 glass rounded-xl px-4 py-3 animate-float">
                                <div className="flex items-center gap-3">
                                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                                    <span className="text-sm font-medium">Available for work.</span>
                                </div>
                            </div>

                            {/* Stats Badge */}
                            <div className="absolute -top-4 -left-4 glass rounded-xl px-4 py-3 animate-float animation-delay-500">
                                <div className="text-2xl font-bold text-primary">2+</div>
                                <div className="text-xs text-muted-foreground">Years Exp.</div>
                            </div>


                        </div>
                    </div>
                </div>

            </div>

            {/* Skills Section */  }
            <div className="mt-20 animate-fade-in animation-delay-600">
                <p className="text-sm text-muted-foreground mb-6 text-center">
                    Technologies I work with
                </p>
                <div className="relative overflow-hidden">
                    <div className="flex animate-marquee">
                        {[...skills, ...skills].map((skill, idx) => (
                            <div key={`skill-${idx}`} className="flex-shrink-0 px-8 py-4">
                                <span className="text-xl font-semibold text-muted-foreground/50 hover:text-muted-foreground transition-colors">{skill}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Skill Icons - Reverse Direction */}
                <div className="relative overflow-hidden mb-10">
                    <div className="flex animate-marquee-reverse">
                        {[...skillIcons, ...skillIcons, ...skillIcons].map((skill, idx) => (
                            <div key={`skill-icon-${idx}`} className="flex-shrink-0 px-6 py-4">
                                <img 
                                    src={skill.icon} 
                                    alt={skill.name} 
                                    title={skill.name}
                                    className="w-5 h-5 opacity-50 hover:opacity-100 transition-opacity duration-300 grayscale hover:grayscale-0" 
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </div>


        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 
                animate-fade-in animation-delay-800" >
            <a 
                href="#about"
                className="flex flex-col items-center gap-2 text-muted-foreground hover:text-primary transition-colors group" >
                <span className="text-xs uppercase tracking-wider">Scroll</span>
                <ChevronDown className="w-6 h-6 animate-bounce" />
            </a>
      </div>

    </section>
}