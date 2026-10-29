import { ShieldCheck, Layout, Server, MonitorSmartphone } from "lucide-react";

const highlights = [
    {
        icon: Layout,
        title: "Front-End Development",
        description: "Designing and building intuitive, high-performance user interfaces with clean, maintainable code."
    },
    {
        icon: MonitorSmartphone,
        title: "Responsive & Mobile-First Design",
        description: "Creating mobile-first, responsive layouts that adapt seamlessly across devices and screen sizes."     
    },
    {
        icon: Server,
        title: "API & Backend Integration",
        description: "Integrating front-end applications with RESTful APIs to deliver dynamic, data-driven user experiences."  
    },
    {
        icon: ShieldCheck,
        title: "Front-End Performance & Security Awareness",
        description: "Applying best practices for performance optimization and front-end security to ensure fast, reliable, and secure applications."
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
                        Building modern
                        <span className="font-serif italic font-normal text-foreground"> websites and web apps that work beautifully.</span>
                    </h2>
                    <div className="space-y-4 text-muted-foreground animate-fade-in animation-delay-200">
                        <p>
                            I’m a web developer focused on creating fast, responsive websites and web applications for businesses, startups, and individuals who need reliable digital experiences.
                            My work blends clean front-end implementation, thoughtful user experience, and practical back-end logic to deliver products that are both polished and dependable.
                        </p>
                        <p>
                            I work with React, Laravel, PHP, Tailwind CSS, MySQL, and modern deployment tools to build everything from landing pages and company websites to larger web applications with real business value.
                            My approach emphasizes maintainable code, strong performance, and clear communication throughout the process.
                        </p>
                        <p>
                            I’m especially interested in projects that need a balance of design, functionality, and scalability, whether that means launching a new site, improving an existing product, or building a custom feature set from scratch.
                        </p>
            
                    </div>

                    <div className="surface p-6 animate-fade-in animation-delay-300">
                        <p className="text-sm uppercase tracking-[0.2em] text-secondary-foreground font-medium mb-3">
                            What I do
                        </p>
                        <h3 className="text-xl font-semibold mb-3 text-foreground">
                            I build modern websites and web apps with React, Laravel, PHP, and Tailwind.
                        </h3>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li>• Custom websites and landing pages for brands, startups, and teams</li>
                            <li>• Full-stack web applications with polished front ends and reliable back ends</li>
                            <li>• Performance-focused UI development with clean, maintainable code</li>
                        </ul>
                    </div>

                    <div className="surface p-6 animate-fade-in animation-delay-300">
                        <p className="text-lg font-medium italic text-foreground">
                            “I design and develop web experiences that don’t just work — they inspire confidence and drive results.”
                        </p>
                    </div>
                </div>

                {/* Right Column - Highlights */}
                <div className="grid sm:grid-cols-2 gap-6">
                    {highlights.map((item, idx) => (
                        <div key={item.title} 
                             className="surface p-6 animate-fade-in"
                             style={{ animationDelay: `${400 + idx * 100}ms` }}>
                            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 hover:bg-primary/20">
                                <item.icon className="w-6 h-6 text-primary" />
                            </div>
                            <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                            <p className="text-sm text-muted-foreground">{item.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    </section>
}