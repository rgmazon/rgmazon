import { useState } from "react";

export const BackgroundDots = ({
    count = 30,
    color = "#5966cc",
    durationMin = 15,
    durationRange = 20,
    delayMax = 5,
}) => {
    const [dots] = useState(() =>
        Array.from({ length: count }, () => ({
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            duration: durationMin + Math.random() * durationRange,
            delay: Math.random() * delayMax,
        }))
    );

    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
            {dots.map((dot, i) => (
                <div
                    key={i}
                    className="absolute w-0.5 h-0.5 rounded-full opacity-60 animate-pulse"
                    style={{
                        backgroundColor: color,
                        left: dot.left,
                        top: dot.top,
                        animation: `slow-drift ${dot.duration}s ease-in-out infinite`,
                        animationDelay: `${dot.delay}s`,
                    }}
                />
            ))}
        </div>
    );
};
