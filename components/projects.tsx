"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { collection, getDocs } from "firebase/firestore";
import { db } from "../app/db";

type Project = {
  id: number
  title: string
  category: string
  image: string
  description: string
  technologies: string[]
  link: string
  demo: string
  details: string
}

export default function Projects() {
  const [projectsData, setProjects] = useState<Project[]>([])
  const [activeFilter, setActiveFilter] = useState("Machine Learning")
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)

  useEffect(() => {
    const fetchProjects = async () => {
      const projectCollection = collection(db, "project_category")
      const projectSnapshot = await getDocs(projectCollection)
      const projectList = projectSnapshot.docs.map(doc => ({
        id: doc.id, // assuming doc.id is needed as 'id'
        ...doc.data()
      })) as unknown as Project[]

      setProjects(projectList)
      console.log("Ajith",projectsData);
      

      // Set unique categories from fetched data
      const uniqueCategories = [...new Set(projectList.map(p => p.category))]
      setCategories(uniqueCategories)

      // Filter the default category (e.g., Machine Learning)
      setFilteredProjects(projectList.filter(p => p.category === activeFilter))
    }

    fetchProjects()
  }, [])

  // Update filtered projects when filter changes
  useEffect(() => {
    if (activeFilter === "All") {
      setFilteredProjects(projectsData)
    } else {
      setFilteredProjects(projectsData.filter(p => p.category === activeFilter))
    }
  }, [activeFilter, projectsData])

  const handleFilterClick = (category: string) => {
    setActiveFilter(category)
  }

  return (
    <section id="projects" className="py-20">
      <div className="container mx-auto px-4">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">My Projects</h2>
          <div className="w-16 h-1 bg-white mx-auto mb-6"></div>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Here are some of my recent projects. Each project is unique and showcases different skills and technologies.
          </p>
        </motion.div>

        {/* Filter Buttons */}
        <motion.div
          className="flex flex-wrap justify-center gap-4 mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {categories.map((category, index) => (
            <button
              key={index}
              onClick={() => handleFilterClick(category)}
              className={`px-6 py-2 rounded-full transition-colors duration-300 ${
                activeFilter === category
                  ? "bg-stone-50 text-black"
                  : "bg-gray-200 dark:bg-neutral-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600"
              }`}
            >
              {category}
            </button>
          ))}
        </motion.div>

        {/* Project Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project, index) => (
            <motion.div
              key={project.id}
              className="bg-white dark:bg-neutral-800 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -10 }}
            >
              {/* <img
                src={project.image || "/placeholder.svg"}
                alt={project.title}
                className="w-full h-48 object-cover"
              /> */}
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">{project.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">{project.description}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.technologies.map((tech, techIndex) => (
                    <span
                      key={techIndex}
                      className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-3 py-1 rounded-full text-sm"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
                <button
                  onClick={() => setSelectedProject(project)}
                  className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
                >
                  View Details
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Modal */}
        {selectedProject && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <motion.div
              className="bg-white dark:bg-neutral-950 rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-2xl font-bold">{selectedProject.title}</h3>
                  <button
                    onClick={() => setSelectedProject(null)}
                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                {/* <img
                  src={selectedProject.image || "/placeholder.svg"}
                  alt={selectedProject.title}
                  className="w-full h-64 object-cover rounded-lg mb-4"
                /> */}
                <p className="text-gray-600 dark:text-gray-400 mb-4">{selectedProject.details}</p>
                <div className="mb-4">
                  <h4 className="font-bold mb-2">Technologies Used:</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedProject.technologies.map((tech, techIndex) => (
                      <span
                        key={techIndex}
                        className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-3 py-1 rounded-full text-sm"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
                <a
                  href={selectedProject.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-neutral-800 hover:bg-neutral-600 dark:bg-neutral-200 dark:text-black text-white font-bold py-2 px-6 rounded-full inline-block transition-colors duration-300"
                >
                  Visit Project
                </a>
                {selectedProject.demo && (
                  <a
                    href={selectedProject.demo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-neutral-800 hover:bg-neutral-600 dark:bg-neutral-200 dark:text-black text-white font-bold py-2 px-6 rounded-full inline-block transition-colors duration-300"
                  >
                    Visit Demo
                  </a>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </section>
  )
}
