'use client'
import React, { useState } from 'react';
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

import { Separator } from '@/components/ui/separator'

import { ArrowDown, OpenInBrowser, Mail, Page, GraduationCap, Link as LinkIcon, MapPin, Minus, Plus, Emoji, Book, Linkedin } from 'iconoir-react'

let readcvSrc = "/fa/readcv.svg";

interface AboutSectionProps {
  // Define the props for your component here
}

const AboutSection: React.FC<AboutSectionProps> = () => {
  const [contactView, setContactView] = useState(true);

  return (
      <section id="aboutSection" className="flex flex-col gap-4 md:sticky md:top-16 md:min-w-[300px] md:max-w-[400px] elevation-1 ">
        <div className="rounded-md overflow-clip">
          <Image
              src="https://schultzdavidg-portfolio.s3.us-west-1.amazonaws.com/images/selfie.jpg"
              alt="a selfie of the soul"
              height={0}
              width={0}
              sizes="225vw"
              unoptimized
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
        </div>
        <div className="card flex flex-col px-6 py-5 gap-4">
          <div className="flex">
            <div className="flex flex-col w-full">
              <h4>David Schultz</h4>
              <p className="text-secondary">AR/VR/XR Designer</p>
            </div>

            {contactView ? 
              <Button variant="primary" onClick={() => setContactView(!contactView)}>
                About
                <Plus className="ml-2 w-4 h-4" />
              </Button>
            :
              <Button variant="primary" onClick={() => setContactView(!contactView)}>
                Contact
                <Minus className="ml-2 w-4 h-4" />
              </Button>
            }
          </div>

          <Separator />

          {contactView ? 
            <div id="contactView"className="flex flex-col gap-3">
              <div className="flex gap-4">
                <Button variant="secondary" className="w-full" asChild>
                  <Link href="https://schultzdavidg-portfolio.s3.us-west-1.amazonaws.com/files/SchultzDavid-Resume.pdf" target="_blank">
                      <Page className="mr-2 w-4 h-4" />
                      Resume
                  </Link>
                </Button>
                <Button variant="secondary" className="w-full" asChild>
                  <Link href="https://www.linkedin.com/in/schultzdavidg/" target="_blank">
                      <Linkedin className="mr-2 w-4 h-4" />
                      LinkedIn
                  </Link>
                </Button>
              </div>
              <div className="flex gap-4">
                <Button variant="secondary" className="w-full" asChild>
                  <Link href="mailto:david@davidschultz.co" target="_blank">
                      <Mail className="mr-2 w-4 h-4" />
                      Email
                  </Link>
                </Button>
                <Button variant="secondary" className="w-full" asChild>
                  <Link href="https://read.cv/davidschultz" target="_blank">
                    <Image
                      src={readcvSrc}
                      width={16}
                      height={16}
                      alt="readcv logo"
                      className="mr-2"
                    />
                      read.cv
                  </Link>
                </Button>
              </div>
            </div>
          : 
            <div id="detailsView" className="flex flex-col">
              {/* <div className="flex items-center gap-2 mb-2 text-red-500">
                <FontAwesomeIcon icon={faMapPin} />
                <span className="font-500">Seattle, WA</span>
              </div> */}
              <div className="bg-background flex flex-col gap-3">
                <p>I design both interfaces and code.</p>
                <p>I consider myself, first-and-foremost, a designer. I graduated from the University of Washington&apos;s prestigious Interaction Design program in 2024, where I ultimately focused on sharpening my design process. This involved extensive user research&mdash;both academically, and professionally.</p>
                <p>But historically, I&apos;ve spent a lot of time developing. I have extensive experience in frontend technologies. My bread-and-butter is Next.js and TailwindCSS, which I have been practicing since 2020. Recently, I&apos;ve developed proficiency in Rust (backend) and Swift (iOS). I&apos;ve also worked with 3D technologies: namely, prototyping with extended reality (XR) in C# (Unity + Meta&apos;s XR SDK). My niche in XR focuses on hand/gestural interactions&mdash;i.e., designing for a future without traditional controllers.</p>
                <p>When I was in high school, I was introduced to computer science, and later on, &ldquo;Special Topics&rdquo; &mdash; a class dedicated to data structures and algorithms (taught by Microsoft TEALS). Programming came very naturally to me, and my teachers were extremely effective at helping us build a deep gnosis for efficent computing. This set a strong technical foundation for &ldquo;left brain&rdquo; activity (in other words, engineering).</p>
                <p>But after being denied to UW&apos;s (very competitive) CSE program, I found myself forced to engage with my &ldquo;right brain&rdquo;. In this, I&apos;ve come to understand that design is the intersection between art and engineering&mdash;and this blend guides everything I do. My calling is to build products for end-users, and this entails picking up any hard skill that serves that end.</p>
                <p>I believe my greatest strength is that I do for the sake of doing&mdash;and in trying to do the best I can, I&apos;ve developed a strong sense for where my energy is most valuable. This means walking the line of expansion and contraction; confidence is knowing what you don&apos;t know, and I walk the line well. I seek out information when it&apos;s needed, and shift my focus to action once I&apos;ve accumulated enough. (e.g. knowing when I need to do user research, and when I&apos;ve learned enough.)</p>

                {/* <p>Currently, my weakest link is that I'm not great at selling things. I'm more interested in letting my contributions speak for themselves. That being said, in my last role I </p> */}
              </div>

              
              {/* <p className="font-500">B.Des from the University of Washington</p> */}
              {/* <div className="flex items-center gap-2 mb-2 text-purple-600">
                <FontAwesomeIcon icon={faGraduationCap} />
                <span className="font-500">University of Washington</span>
              </div> */}
            </div>
          }
          
          
        </div>
      </section>
  );
};

export default AboutSection;