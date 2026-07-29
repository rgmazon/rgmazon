const faqs = [
  {
    question: "What services do you offer?",
    answer:
      "I help businesses and founders build modern websites and web applications with React, Laravel, PHP, and Tailwind CSS. I focus on fast, responsive, and user-friendly digital experiences.",
  },
  {
    question: "Do you build both front-end and full-stack projects?",
    answer:
      "Yes. I work across the front end and the full stack, from polished user interfaces to application logic, APIs, and database-backed features.",
  },
  {
    question: "What technologies do you use most often?",
    answer:
      "My core stack includes React, JavaScript, TypeScript, Tailwind CSS, Laravel, PHP, MySQL, and modern deployment workflows. I also work with tools like Vite, Supabase, and Docker.",
  },
  {
    question: "Can you help with a new website or web app?",
    answer:
      "Absolutely. I can help turn an idea into a polished website, landing page, or web application with a clean implementation and a strong user experience.",
  },
];

export const FAQ = () => {
  return (
    <section className="py-32 relative overflow-hidden" id="faq">
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <span className="text-secondary-foreground text-sm font-medium tracking-wider uppercase">
            Frequently asked questions
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mt-4 mb-6 text-secondary-foreground">
            Answers to common questions
          </h2>
          <p className="text-muted-foreground text-lg">
            A quick overview of the services, technologies, and approach behind my work.
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-4">
          {faqs.map((item) => (
            <details
              key={item.question}
              className="group glass rounded-2xl border border-primary/20 p-6"
            >
              <summary className="cursor-pointer list-none font-semibold text-foreground flex items-center justify-between gap-4">
                <span>{item.question}</span>
                <span className="text-primary text-xl transition-transform group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="mt-4 text-muted-foreground leading-relaxed">
                {item.answer}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
};
