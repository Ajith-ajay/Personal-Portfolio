"use client"

import Link from "next/link"
import { Github, Linkedin, Twitter, Instagram, Mail } from "lucide-react"

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-muted py-12 border-t">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Branding & Bio */}
          <div>
            <h3 className="text-xl font-bold mb-4">Ajith</h3>
            <p className="text-muted-foreground mb-4 text-justify">
              A passionate web developer focused on creating beautiful and functional websites With a passion for becoming a Data Scientist and AI Developer
            </p>
            <h3 className="text-xl font-bold mb-4">Coding Profiles</h3>
            <p className="text-muted-foreground mb-4 text-justify">
              <a href="https://www.hackerrank.com/profile/ajithajay1029" target="_blank" rel="noopener noreferrer" className="flex gap-2">
                <img src="/hackerrank.svg" className="h-6 w-6" alt="HackerRank Icon" />
                <span>HackerRank</span>
              </a>
            </p>
            <p className="text-muted-foreground mb-4 text-justify">
              <a href="https://leetcode.com/u/Ajith_ajay/" target="_blank" rel="noopener noreferrer" className="flex gap-2">
                <img src="/leetcode.svg" className="w-6 h-6" alt="LeetCode Icon" />
                <span>LeetCode</span>
              </a>
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {["Home", "About", "Projects", "Skills", "Experience", "Contact"].map((item) => (
                <li key={item}>
                  <a href={`#${item.toLowerCase()}`} className="hover:text-foreground transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-xl font-bold mb-4">Services</h3>
            <p className="mb-4 text-muted-foreground underline">What I can help you with</p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {[
                "Custom Web Development",
                "UI/UX Design & Prototyping",
                "Cross-Platform Mobile App Development",
                "Machine Learning Model Training",
                "AI-Powered Application Development",
              ].map((service) => {
                const subjectText = `${service} Regarding`;
                return (
                  <li key={service}>
                    <a
                      href={`#contact&subject=${encodeURIComponent(subjectText)}`}
                      className="hover:text-foreground transition-colors"
                    >
                      {service}
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Interest and contact info */}
          <div>
            <h3 className="text-xl font-bold mb-4">My Interests</h3>
              <ul className="space-y-2 text-sm text-muted-foreground mb-4">
                <li>Artificial Intelligence</li>
                <li>Data Science</li>
              </ul>
            <h3 className="text-xl font-bold mb-4">Connect With</h3>
            <div className="flex space-x-12">
              <Link href="https://github.com/Ajith-ajay" target="_blank" aria-label="GitHub">
                <Github className="h-5 w-5 text-muted-foreground hover:text-foreground transition-colors" />
              </Link>
              <Link href="https://www.linkedin.com/in/ajith-g-923b25274/" target="_blank" aria-label="LinkedIn">
                <Linkedin className="h-5 w-5 text-muted-foreground hover:text-foreground transition-colors" />
              </Link>
              <Link href="https://x.com/ajithajay1029" target="_blank" aria-label="Twitter">
                <Twitter className="h-5 w-5 text-muted-foreground hover:text-foreground transition-colors" />
              </Link>
              <Link href="https://www.instagram.com/_callme._.peace__fighter.____/" target="_blank" aria-label="Instagram">
                <Instagram className="h-5 w-5 text-muted-foreground hover:text-foreground transition-colors" />
              </Link>
              <Link href="mailto:ajithajay1029@gmail.com" aria-label="Email">
                <Mail className="h-5 w-5 text-muted-foreground hover:text-foreground transition-colors" />
              </Link>
            </div>
          </div>
        </div>

        <div className="border-t border-border mt-10 pt-6 flex flex-col md:flex-row justify-between items-center text-sm text-muted-foreground">
          <p>&copy; {currentYear} Ajith. All rights reserved/Privacy.</p>
          <p className="text-center">"Strive not to be a success, but rather to be of value." - Albert Einstein</p>
          <p className="mt-2 md:mt-0">Designed and Developed with <a href="/login">❤️</a></p>
        </div>
      </div>
    </footer>
  )
}
