"use client"

import { useState } from "react"
import { Dialog } from "@headlessui/react"
import { motion } from "framer-motion"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { FileText } from "lucide-react"

export default function About() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <section id="about" className="py-20 bg-muted/50">
      <div className="container mx-auto px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true, margin: "-100px" }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold mb-2">About Me</h2>
          <div className="w-20 h-1 bg-primary mx-auto mb-6"></div>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Here you'll find more information about me, what I do, and my current skills in terms of programming and technology.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <h3 className="text-2xl font-bold mb-4">Get to know me!</h3>
            <div className="space-y-4 text-muted-foreground mb-6">
              <p>
                I am a third year Engineering student specializing in AI&DS. I hold certifications in multiple programming languages and have experience with Flutter and the MERN stack. I am passionate about solving real-world problems using code.
              </p>
              <Button onClick={() => setIsOpen(true)} variant="outline">
                View More
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <h4 className="font-bold">Name:</h4>
                <p className="text-muted-foreground">Ajith G</p>
              </div>
              <div>
                <h4 className="font-bold">Email:</h4>
                <p className="text-muted-foreground">ajithajay1029@gmail.com</p>
              </div>
              <div>
                <h4 className="font-bold">Location:</h4>
                <p className="text-muted-foreground">Chennai, Tamilnadu, India</p>
              </div>
              <div>
                <h4 className="font-bold">Availability:</h4>
                <p className="text-muted-foreground">Freelance/Intern</p>
              </div>
            </div>
            <a href="/Resume.pdf" download>
              <Button className="mt-6" size="lg">
                <FileText className="mr-2 h-4 w-4" /> Download CV
              </Button>
            </a>
            <a href="/Resume.pdf" target="_blank" rel="noopener noreferrer">
              <Button className="mt-6 ml-[5px] md:ml-10" size="lg">
                <FileText className="mr-2 h-4 w-4" /> Open CV
              </Button>
            </a>

          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            viewport={{ once: true, margin: "-100px" }}
            className="relative"
          >
            <div className="relative h-48 sm:h-64 md:h-80 lg:h-[400px] rounded-lg overflow-hidden shadow-xl">
              <Image
                src="/aboutme.webp?height=400&width=600"
                alt="About Me"
                fill
                className="object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-primary/10 rounded-lg"></div>
            <div className="absolute -top-6 -left-6 w-32 h-32 bg-primary/10 rounded-lg"></div>
          </motion.div>
        </div>
      </div>

      {/* Modal */}
      <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="bg-white dark:bg-neutral-950 border-white border-10 max-w-2xl w-full p-6 rounded-lg shadow-xl">
            <Dialog.Title className="text-xl font-bold mb-4">More About Me</Dialog.Title>
            <div className="text-muted-foreground space-y-4 overflow-y-auto max-h-[70vh]">
              <p>
                I am a third year Engineering student specializing in Artificial Intelligence and Data Science (AI&DS) at Velammal Engineering College, Chennai. I got an overall CGPA of 8.575 at the end of my second year. I hold certifications in multiple programming languages including Python, C, C++, Java, JavaScript, HTML, CSS, and Dart. I have practical experience with the Flutter framework.
              </p>
              <p>
                I have expertise in SQL and NoSQL databases, backed by practical experience in project implementation. Additionally, I have hands-on experience working with the MERN stack (MongoDB, Express.js, React.js, Node.js), enabling me to build full-stack web applications.
              </p>
              <p>
                I am passionate about solving real-world problems using code. I actively solve problems on LeetCode and <a href="https://www.hackerrank.com/profile/ajithajay1029" target="_blank" className="underline text-primary">HackerRank</a>, having solved over 50+ problems.
              </p>
              <p>
                I also like sharing content related to the stuff that I have learned over the years so it can help other people of the Dev Community. Feel free to connect or follow me on my LinkedIn where I post useful content related to Programming.
              </p>
            </div>
            <div className="mt-6 text-right">
              <Button onClick={() => setIsOpen(false)}>Close</Button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </section>
  )
}
