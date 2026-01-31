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

        {/* Green Dots */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">


            {[...Array(30)].map((_, i) => (
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

        <div className="container mx-auto px-6 relative z-10">
            <div className="grid lg:grid-cols-2 gap-16 items-center">

                {/* Left Column - Text Content */}
                <div className="space-y-8">
                    <div className="animate-fade-in">
                        <span className="text-secondary-foreground text-sm font-medium tracking-wider uppercase">About Me</span>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-bold leading-tight animate-fade-in animation-delay-100 text-secondary-foreground">
                        Turning ideas into
                        <span className="font-serif italic font-normal text-white"> real-world digital solutions.</span>
                    </h2>
                    <div className="space-y-4 text-muted-foreground animate-fade-in animation-delay-200">
                        <p>
                            I’m a Full-Stack Developer with a background in Information Systems 
                            and a passion for building web applications that are both functional and user-centered. 
                            My journey started with a curiosity about how systems work behind the scenes — 
                            and grew into a career focused on designing, developing, and deploying end-to-end digital experiences.
                        </p>
                        <p>
                            I specialize in PHP, MySQL, and modern front-end tools like Bootstrap, Tailwind, and JavaScript, 
                            creating everything from responsive company websites to custom web systems that streamline workflows and improve efficiency. 
                            My approach blends clean code, thoughtful UI, and practical automation to deliver solutions that actually make an impact.
                        </p>
                        <p>
                            When I’m not coding, I’m exploring new technologies, 
                            refining my design skills in Figma, and continuously learning better ways to build smarter, 
                            faster, and more scalable web products.
                        </p>
            
                    </div>

                    <div className="glass rounded-2xl p-6 glow-border animate-fade-in animation-delay-300">
                        <p className="text-lg font-medium italic text-foreground">
                            “I design and develop web experiences that don’t just work — they inspire confidence and drive results.”
                        </p>
                    </div>
                </div>

                {/* Right Column - Highlights */}
                <div className="grid sm:grid-cols-2 gap-6">
                    {highlights.map((item, idx) => (
                        <div key={item.title} 
                             className="glass p-6 rounded-2xl animate-fade-in" 
                             style={{ animationDelay: `${400 + idx * 100}ms` }}>
                            <div className="w-12 h-12 rounded-xl bg-0primary/10 flex items-center justify-center mb-4 hover:bg-primary/20">
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