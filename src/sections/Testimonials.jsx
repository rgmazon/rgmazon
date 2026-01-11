import { Quote, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

const testimonials = [
  {
    quote:
      "Even as a beginner, RG did a great job handling my project. They were very eager to learn, open to feedback, and made sure everything worked as expected. I really appreciated the effort and dedication.",
    author: "April L.",
    role: "Start-up Founder",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
  },
  {
    quote:
      "I liked how transparent RG was throughout the process. They explained what they could do, asked questions when unsure, and kept improving the project step by step. The final result turned out better than I expected.",
    author: "Anonymous",
    role: "Small Business Owner",
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop",
  },
  {
    quote:
      "For someone early in their development career, RG showed a lot of potential. They were patient, hardworking, and made sure to fix issues quickly. You can really see their passion for web development.",
    author: "Emily W.",
    role: "Project Coordinator",
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
  },
  {
    quote:
      "RG may be starting out, but the commitment to doing quality work is already there. They listened carefully to my needs and delivered a clean, functional website. I’d happily work with them again.",
    author: "Anonymous",
    role: "HR Personnel",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
  },
];


export const Testimonials = () => {

    const [activeIdx, setActiveIdx] = useState(0);
    const next = () => {
        setActiveIdx((prev) => (prev + 1) % testimonials.length);
    }

    const previous = () => {
        setActiveIdx((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    }

    return (
        <section className="py-32 relative overflow-hidden" id="testimonials">

            {/* Green Dots */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">


                {[...Array(30)].map((_, i) => (
                    <div 
                        className="absolute w-0.5 h-0.5 rounded-full opacity-60 animate-pulse"
                        style={{
                            backgroundColor: "#5966cc",
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            animation: `slow-drift ${25 + Math.random() * 40}s ease-in-out infinite`,
                            animationDelay: `${Math.random() * 5}s`,
                        }}
                    /> 
                ))}

            </div>
            {/* Blurred Circles */}
            <div className="absolute top-1/4 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
            <div className="absolute bottom-1/4 left-0 w-64 h-64 bg-highlight/5 rounded-full blur-3xl" />

            <div className="container mx-auto px-6 relative z-10">

                {/* Section Header */}
                <div className="text-center mx-auto max-w-3xl mb-16">
                    <span className="text-secondary-foreground text-sm font-medium tracking-wider uppercase animate-fade-in">
                        What people say
                    </span>
                    <h2 className="text-4xl md:text-5xl font-bold mt-4 mb-6 animate-fade-in animation-delay-100 text-secondary-foreground">
                        Kind words from{" "}
                        <span className="font-serif italic font-normal text-white">
                            amazing people.
                        </span>
                    </h2>
                </div>

                {/* Testimonials Carousel */}
                <div className="max-w-4xl mx-auto">
                    <div className="relative">
                        {/* Main Testimonial */}
                        <div className="glass p-8 rounded-3xl md:p-12 glow-border animate-fade-in animation-delay-200">
                            <div className="absolute -top-4 left-8 w-12 h-12 rounded-full bg-primary flex items-center justify-center" >
                                <Quote className="w-6 h-6 text-primary-foreground" />   
                            </div>
                            <blockquote className="text-xl md:text-2xl font-medium leading-relaxed mb-8 pt-4">
                                "{testimonials[activeIdx].quote}"
                            </blockquote>
                            <div className="flex items-center gap-4">
                                <img 
                                    src={testimonials[activeIdx].avatar} 
                                    alt={testimonials[activeIdx].author} 
                                    className="w-14 h-14 rounded-full object-cover ring-2 ring-primary/20"
                                />
                                <div className="flex items-center gap-4">
                                    <div className="font-semibold">
                                        {testimonials[activeIdx].author}
                                        <div className="text-sm text-muted-foreground">
                                            {testimonials[activeIdx].role}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* Testimonial Navigation */}
                        <div className="flex items-center justify-center gap-4 mt-8">
                            <button 
                                className="p-3 rounded-full glass hover:bg-primary transition-all" 
                                onClick={previous}
                            >
                                <ChevronLeft /> 
                            </button>

                            <div className="flex gap-2">
                                {testimonials.map((_, idx) => (
                                    <button
                                        onClick={() => setActiveIdx(idx)} 
                                        className={`w-2 h-2 rounded-full transition-all duration-300 ${idx === activeIdx ? "w-8 bg-primary" : "bg-muted-foreground/30 hover:bg-muted-foreground/50"}`} 
                                    />
                                ))}
                            </div>
                            <button className="p-3 rounded-full glass hover:bg-primary transition-all" onClick={next}>
                                <ChevronRight />
                            </button>
                        </div>
                    </div>
                </div>

            </div>

        </section>
    );
}
