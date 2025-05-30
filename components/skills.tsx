"use client";

import { motion } from "framer-motion";
import { Braces, Check, Database, Globe, Layers, Palette, Server, Settings } from "lucide-react";

function SkillItem({ label }: { label: string }) {
  return (
    <div className="flex items-center space-x-2 text-muted-foreground text-sm">
      <Check className="w-4 h-4 text-primary" />
      <span>{label}</span>
    </div>
  );
}

function SkillLink({ src, label, href }: { src: string; label: string; href: string }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className="flex items-center space-x-2 text-muted-foreground text-sm">
      <img src={src} alt={label} className="w-5 h-5" />
      <span>{label}</span>
    </a>
  );
}



export default function Skills() {
  const skillCategories = [
    {
      id: 1,
      title: "Frontend Development",
      icon: <Globe className="h-8 w-8 text-primary" />,
      skills: ["HTML", "CSS", "JavaScript", "TypeScript", "React", "Next.js", "Tailwind", "Framer Motion", "Bootstrap"],
    },
    {
      id: 2,
      title: "Backend Development",
      icon: <Server className="h-8 w-8 text-primary" />,
      skills: ["Node.js", "Express.js", "Python", "Django", "Flask", "REST API"],
    },
    {
      id: 3,
      title: "Databases",
      icon: <Database className="h-8 w-8 text-primary" />,
      skills: ["MongoDB", "MySQL", "PostgreSQL", "MS Server", "Oracle", "Firebase", "NoSQL", "SQL"],
    },
    {
      id: 4,
      title: "Mobile & UI/UX",
      icon: <Palette className="h-8 w-8 text-primary" />,
      skills: ["Figma", "React Native", "Flutter", "Dart"],
    },
    {
      id: 5,
      title: "DevOps & Tools",
      icon: <Settings className="h-8 w-8 text-primary" />,
      skills: ["Git", "GitHub", "Docker", "AWS", "Vercel", "Netlify", "Postman"],
    },
    {
      id: 6,
      title: "Other Skills",
      icon: <Layers className="h-8 w-8 text-primary" />,
      skills: ["Machine Learning", "Deep Learning", "Web Scraping", "Technical Writing", "Agile", "Testing"],
    },
  ];

  const softSkills = [
    "Leadership Quality",
    "Communication",
    "Quick Learner",
    "Problem Solving",
    "Creative Thinking",
    "Strategic Planning",
  ];

  const tools = [
    "VS Code",
    "Jupyter Notebook",
    "Github Desktop",
    "Linux",
    "Chrome DevTools",
  ];

  const programmingLang = [
    "Python", "C", "C++", "Java"
  ]

  return (
    <section id="skills" className="py-20 bg-muted/50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold mb-2">My Skills</h2>
          <div className="w-20 h-1 bg-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground max-w-xl mx-auto text-pretty">
            A categorized look at my technical skills, tools I use, and my competitive programming profiles.
          </p>
        </motion.div>

        {/* Grid Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {skillCategories.map((cat, i) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              viewport={{ once: true }}
              className="bg-card rounded-lg p-6 shadow-sm border"
            >
              <div className="flex items-center mb-4">
                {cat.icon}
                <h3 className="text-xl font-semibold ml-3">{cat.title}</h3>
              </div>
              <ul className="space-y-2">
                {cat.skills.map(skill => (
                  <li key={skill} className="flex items-center text-sm text-muted-foreground">
                    <Braces className="w-4 h-4 text-primary mr-2" />
                    {skill}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Competitive Programming */}
        <div className="mt-16">
          <h3 className="text-2xl font-bold text-center mb-6">Competitive Programming</h3>
          <div className="flex justify-center gap-6 flex-wrap">
            <SkillLink src="/hackerrank.svg" label="HackerRank" href="https://www.hackerrank.com/profile/ajithajay1029" />
            <SkillLink src="/leetcode.svg" label="LeetCode" href="https://leetcode.com/u/Ajith_ajay/" />
          </div>
        </div>

        {/* Programming languages */}
        <div className="mt-16">
          <h3 className="text-2xl font-bold text-center mb-6">Soft Skills</h3>
          <div className="flex flex-wrap justify-center gap-4">
            {programmingLang.map(skill => (
              <SkillItem key={skill} label={skill} />
            ))}
          </div>
        </div>

        {/* Tools */}
        <div className="mt-16">
          <h3 className="text-2xl font-bold text-center mb-6">Development Tools</h3>
          <div className="flex flex-wrap justify-center gap-4">
            {tools.map(tool => (
              <SkillItem key={tool} label={tool} />
            ))}
          </div>
        </div>

        {/* Soft Skills */}
        <div className="mt-16">
          <h3 className="text-2xl font-bold text-center mb-6">Soft Skills</h3>
          <div className="flex flex-wrap justify-center gap-4">
            {softSkills.map(skill => (
              <SkillItem key={skill} label={skill} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
