import { Code2, Layout, ServerCog, ShieldCheck } from "lucide-react";

const highlights = [
    {
        icon: Code2,
        title: "Full-Stack Development",
        description: "Proficient in building end-to-end web applications using modern technologies."
    },
    {
        icon: Layout,
        title: "Responsive Design",
        description: "Skilled in creating mobile-first, responsive designs that adapt to various screen sizes."     
    },
    {
        icon: ServerCog,
        title: "Backend Integration",
        description: "Experience in integrating front-end applications with robust backend services and APIs."  
    },
    {
        icon: ShieldCheck,
        title: "Web Security",
        description: "Knowledgeable in implementing security best practices to protect web applications from vulnerabilities."
    }
]


export const About = () => {
    return <section className="py-32 relative overflow-hidden" id="about">
        <div className="container mx-auto px-6 relative z-10">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
                {/* Left Column - Text Content */}
                <div className="space-y-8">
                    <div className="animate-fade-in">
                        <span className="text-secondary-foreground text-sm font-medium tracking-wider uppercase">About Me</span>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-bold leading-tight animate-fade-in animation-delay-100 text-secondary-foreground">
                        Building the future,
                        <span className="font-serif italic font-normal text-white"> one component at a time.</span>
                    </h2>
                    <div className="space-y-4 text-muted-foreground animate-fade-in animation-delay-200">
                        <p>
                            I'm a passionate software engineer with over 5 years of
                            experience crafting digital products that make a difference. My
                            journey started with a curiosity for how things work on the web,
                            and it has evolved into a deep expertise in modern frontend
                            technologies.
                        </p>
                        <p>
                            I specialize in React, Next.js, and TypeScript, building
                            everything from sleek landing pages to complex enterprise
                            applications. My approach combines technical excellence with a
                            keen eye for design and user experience.
                        </p>
                        <p>
                            When I'm not coding, you'll find me exploring new technologies,
                            contributing to open-source projects, or sharing knowledge with
                            the developer community.
                        </p>
            
                    </div>
                </div>
            </div>
        </div>
    </section>
}