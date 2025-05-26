"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { send } from "emailjs-com"
import { motion } from "framer-motion"
import { collection, getDocs } from "firebase/firestore"
import { db } from '../app/db'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Mail, MapPin, Phone, Send, Linkedin, Github, Instagram, Facebook, Twitter } from "lucide-react"


export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    phone: ""
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const [highlightSubject, setHighlightSubject] = useState(false)

  useEffect(() => {
  const fetchAvailability = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "active_status"));
      const doc = querySnapshot.docs[0]; 
      const data = doc.data();
      setIsAvailable(data.status); 
    } catch (error) {
      console.error("Error fetching availability:", error);
    }
  };

  fetchAvailability();
}, []);

useEffect(() => {
  const handleHash = () => {
    const hash = window.location.hash;

    if (hash.startsWith("#contact")) {
      const match = hash.match(/subject=([^&]+)/);
      const subject = match ? decodeURIComponent(match[1]) : "";

      if (subject) {
        setFormData((prev) => ({ ...prev, subject }));

        // Scroll into view
        setTimeout(() => {
          const contactEl = document.getElementById("contact")
          contactEl?.scrollIntoView({ behavior: "smooth" })

          // Trigger subject highlight
          setHighlightSubject(true)
          setTimeout(() => setHighlightSubject(false), 5000)

          // Clean the URL
          history.replaceState(null, "", "#contact")
        }, 100)
      }
    }
  };

  // Initial check on mount
  handleHash();

  // Listen for future hash changes
  window.addEventListener("hashchange", handleHash);

  // Cleanup
  return () => window.removeEventListener("hashchange", handleHash);
}, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name || !formData.email || !formData.message) {
      alert("Please fill in all required fields.")
      return
    }

    setIsSubmitting(true)

    const templateParams = {
      name: formData.name,
      email: formData.email,
      subject: formData.subject,
      message: formData.message,
      phone: formData.phone
    }

    send(
      process.env.NEXT_PUBLIC_EMAILIS_SERVICE_NO!,
      process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!,
      templateParams,
      process.env.NEXT_PUBLIC_EMAILJS_ID!
    )
      .then((response) => {
        console.log("Email sent successfully:", response.status, response.text)
        setSubmitSuccess(true)
        setFormData({ name: "", email: "", subject: "", message: "", phone: "" })
        setTimeout(() => setSubmitSuccess(false), 3000)
      })
      .catch((err) => {
        console.error("Failed to send email. Error:", err)
        alert("Something went wrong, please try again later.")
      })
      .finally(() => {
        setIsSubmitting(false)
      })
  }

  return (
    <section id="contact" className="py-20 bg-muted/50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true, margin: "-100px" }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold mb-2">Contact Me</h2>
          <div className="w-20 h-1 bg-primary mx-auto mb-6"></div>
          <p className="text-muted-foreground max-w-2xl mx-auto">Feel free to contact me for any work or suggestions</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-22">
          {/* Left Column (Form) */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <Card>
              {highlightSubject && (
                <p className="text-xl text-muted-foreground text-center p-8"> Fill the form to get the service details</p>
              )}
              <CardHeader>
                <CardTitle>Get In Touch</CardTitle>
                <CardDescription>Fill out the form and I'll get back to you as soon as possible</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Name</Label>
                      <Input
                        id="name"
                        name="name"
                        placeholder="Your name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="Your email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone No</Label>
                    <Input
                      id="phone"
                      name="phone"
                      placeholder="Phone No"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Input
                      id="subject"
                      name="subject"
                      placeholder="Subject"
                      value={formData.subject}
                      onChange={handleChange}
                      // className={highlightSubject ? "border-2 border-yellow-400 animate-pulse" : ""}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      name="message"
                      placeholder="Your message"
                      rows={5}
                      value={formData.message}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? "Sending..." : (
                      <>
                        <Send className="mr-2 h-4 w-4" /> Send Message
                      </>
                    )}
                  </Button>
                  {submitSuccess && (
                    <p className="text-green-600 text-center">Message sent successfully!</p>
                  )}
                </form>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            viewport={{ once: true, margin: "-100px" }}
            className="flex flex-col justify-between"
          >
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
                <CardDescription>Here are the ways you can reach me</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <Mail className="h-5 w-5 text-primary mr-3 mt-0.5" />
                    <div>
                      <h4 className="font-medium">Email</h4>
                      <a href="mailto:ajithajay1029@gmail.com" className="text-muted-foreground">ajithajay1029@gmail.com</a>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Phone className="h-5 w-5 text-primary mr-3 mt-0.5" />
                    <div>
                      <h4 className="font-medium">Phone</h4>
                      <a href="tel:919047251565" className="text-muted-foreground">+91 9047251565</a>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <MapPin className="h-5 w-5 text-primary mr-3 mt-0.5" />
                    <div>
                      <h4 className="font-medium">Location</h4>
                      <p className="text-muted-foreground">Chennai, Tamilnadu, india</p>
                    </div>
                  </div>
                    <div className="mt-10">
                      <h3 className="text-xl font-bold mb-4">Connect With Me</h3>
                      <div className="flex space-x-4">
                        <a
                          href="https://www.linkedin.com/in/ajith-g-923b25274/"
                          target="_blank"
                        >
                          <Linkedin className="h-5 w-5 text-primary mr-3 mt-0.5" />
                        </a>
                        <a
                          href="https://github.com/Ajith-ajay"
                          target="_blank"
                        >
                            <Github className="h-5 w-5 text-primary mr-3 mt-0.5" />
                        </a>
                        <a
                          href="https://www.instagram.com/_callme._.peace__fighter.____/"
                          target="_blank"
                        >
                          <Instagram className="h-5 w-5 text-primary mr-3 mt-0.5" />
                        </a>
                        <a
                          href="#"
                        >
                          <Facebook className="h-5 w-5 text-primary mr-3 mt-0.5" />
                        </a>
                        <a
                          href="#"
                        >
                          <Twitter className="h-5 w-5 text-primary mr-3 mt-0.5" />
                        </a>
                      </div>
                    </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Availability</CardTitle>
              </CardHeader>
              <CardContent>
                {isAvailable === null ? (
                  <p className="text-muted-foreground">Checking availability...</p>
                ) : isAvailable ? (
                  <>
                    <p className="text-muted-foreground mb-4">
                      I'm currently <strong>available</strong> for freelance work, Intern and Part-time positions. If you have a project that you
                      want to get started or need help with an existing one, feel free to get in touch.
                    </p>
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                      <span className="font-medium">Available for work</span>
                    </div>
                  </>
                ) : (
                  <>
                    <p className="text-muted-foreground mb-4">
                      I'm <strong>not available</strong> for work at the moment. Please check back later or drop a message to connect when I'm open.
                    </p>
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                      <span className="font-medium">Currently unavailable</span>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
