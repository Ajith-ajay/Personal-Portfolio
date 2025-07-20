"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { collection, getDocs } from "firebase/firestore"
import { db } from '../app/db'
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Briefcase, Calendar, GraduationCap, MapPin } from "lucide-react"

export default function Experience() {

  interface ExperienceItem {
    id: string;
    role: string;
    company: string;
    location: string;
    period: string;
    description: string;
    skills: string[];
  }

interface EducationItem {
  id: string;
  degree: string;
  institution: string;
  location: string;
  period: string;
  description: string;
}

interface CertificateItem {
  id: string;
  year: string;
  title: string;
  issuer: string;
}

const [experience, setExperience] = useState<ExperienceItem[]>([]);
const [education, setEducation] = useState<EducationItem[]>([]);
const [certificates, setCertificates] = useState<CertificateItem[]>([]);

useEffect(() => {
  const fetchData = async () => {
    try {
      const experienceSnapshot = await getDocs(collection(db, 'experience'));
      const educationSnapshot = await getDocs(collection(db, 'education'));
      const certificatesSnapshot = await getDocs(collection(db, 'certificates'));

      setExperience(experienceSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as ExperienceItem[]);
      setEducation(educationSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as EducationItem[]);
      setCertificates(certificatesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as CertificateItem[]);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  fetchData();
}, []);

  return (
    <section id="experience" className="py-20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true, margin: "-100px" }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold mb-2">Experience & Education</h2>
          <div className="w-20 h-1 bg-primary mx-auto mb-6"></div>
          <p className="text-muted-foreground max-w-2xl mx-auto">My professional journey and educational background</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Work Experience */}
          <div>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true, margin: "-100px" }}
              className="flex items-center mb-8"
            >
              <Briefcase className="h-6 w-6 text-primary mr-3" />
              <h3 className="text-2xl font-bold">Work Experience</h3>
            </motion.div>
            <div className="max-h-[700px] overflow-y-auto pr-2">
              <div className="space-y-6">
                {experience.map((job, index) => (
                  <motion.div
                    key={job.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true, margin: "-100px" }}
                  >
                    <Card>
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle>{job.role}</CardTitle>
                            <CardDescription className="flex items-center mt-1">{job.company}</CardDescription>
                          </div>
                          <Badge variant="outline" className="ml-2">{job.period}</Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center text-sm text-muted-foreground mb-4">
                          <MapPin className="h-4 w-4 mr-1" />
                          {job.location}
                          <Calendar className="h-4 w-4 ml-4 mr-1" />
                          {job.period}
                        </div>
                        <p className="text-muted-foreground mb-4">{job.description}</p>
                        <div className="flex flex-wrap gap-2">
                          {(job.skills || []).map((skill: string) => (
                            <Badge key={skill} variant="secondary">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Education + Certifications */}
          <div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true, margin: "-100px" }}
              className="flex items-center mb-8"
            >
              <GraduationCap className="h-6 w-6 text-primary mr-3" />
              <h3 className="text-2xl font-bold">Education</h3>
            </motion.div>

            <div className="space-y-6">
              {education.map((edu, index) => (
                <motion.div
                  key={edu.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true, margin: "-100px" }}
                >
                  <Card>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle>{edu.degree}</CardTitle>
                          <CardDescription className="flex items-center mt-1">{edu.institution}</CardDescription>
                        </div>
                        <Badge variant="outline" className="ml-2">{edu.period}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center text-sm text-muted-foreground mb-4">
                        <MapPin className="h-4 w-4 mr-1" />
                        {edu.location}
                        <Calendar className="h-4 w-4 ml-4 mr-1" />
                        {edu.period}
                      </div>
                      <p className="text-muted-foreground">{edu.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Certifications */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true, margin: "-100px" }}
              className="mt-8"
            >
              <Card>
                <CardHeader>
                  <CardTitle>Certifications</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="max-h-72 overflow-y-auto pr-2">
                    <ul className="space-y-3">
                      {certificates.map((cert: any) => (
                        <li key={cert.id} className="flex items-start">
                          <Badge className="mt-0.5 mr-2">{cert.year}</Badge>
                          <div>
                            <p className="font-medium">{cert.title}</p>
                            <p className="text-sm text-muted-foreground">{cert.issuer}</p>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
