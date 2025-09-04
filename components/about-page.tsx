"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Award, Users, MapPin, Heart, Shield, Clock, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export function AboutPage() {
  const stats = [
    { icon: Users, label: "Happy Travelers", value: "50,000+" },
    { icon: MapPin, label: "Destinations", value: "100+" },
    { icon: Award, label: "Years Experience", value: "15+" },
    { icon: Star, label: "Average Rating", value: "4.8" },
  ];

  const values = [
    {
      icon: Heart,
      title: "Passion for Travel",
      description:
        "We believe travel transforms lives and creates lasting memories that enrich your soul.",
    },
    {
      icon: Shield,
      title: "Trust & Safety",
      description:
        "Your safety is our priority. We ensure secure bookings and reliable travel experiences.",
    },
    {
      icon: Clock,
      title: "24/7 Support",
      description:
        "Our dedicated team is available round the clock to assist you throughout your journey.",
    },
  ];

  const team = [
    {
      name: "Rajesh Kumar",
      role: "Founder & CEO",
      image: "/indian-ceo.png",
      description:
        "With 15+ years in travel industry, Rajesh founded Atharv to make travel accessible to everyone.",
    },
    {
      name: "Priya Sharma",
      role: "Head of Operations",
      image: "/indian-business-woman-operations-head.png",
      description:
        "Priya ensures seamless operations and exceptional customer experiences across all our services.",
    },
    {
      name: "Amit Patel",
      role: "Travel Expert",
      image: "/indian-travel-expert.png",
      description:
        "Amit curates unique experiences and hidden gems that make your journey truly unforgettable.",
    },
  ];

  return (
    <main className="pt-20">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-amber-50 to-orange-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto"
          >
            <Badge
              variant="secondary"
              className="mb-4 bg-amber-100 text-amber-800"
            >
              About Atharv Travels
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Your Journey{" "}
              <span className="bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                Begins Here
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              For over 15 years, we've been crafting extraordinary travel
              experiences that connect people with the beauty, culture, and
              wonder of destinations across India and beyond.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-amber-100 to-orange-100 rounded-full mb-4">
                  <stat.icon className="h-8 w-8 text-amber-600" />
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-2">
                  {stat.value}
                </h3>
                <p className="text-gray-600">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Our Story
              </h2>
              <p className="text-gray-600 mb-6">
                Founded in 2009 by travel enthusiast Rajesh Kumar, Atharv
                Travels began as a small agency with a big dream - to make
                incredible travel experiences accessible to every Indian family.
              </p>
              <p className="text-gray-600 mb-6">
                What started as organizing weekend getaways for friends and
                family has grown into one of India's most trusted travel
                companies, serving over 50,000 happy travelers and counting.
              </p>
              <p className="text-gray-600 mb-8">
                Today, we specialize in both domestic and international travel,
                offering everything from spiritual journeys through Rajasthan to
                exotic beach holidays in Thailand, always with the personal
                touch that makes us different.
              </p>
              <Link href="/contact">
                <Button className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700">
                  Get in Touch
                </Button>
              </Link>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <Image
                src="/placeholder-h07b0.png"
                alt="Our Story"
                width={600}
                height={500}
                className="rounded-lg shadow-xl"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              What Drives Us
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our core values guide everything we do, ensuring every journey
              with us is memorable, safe, and transformative.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="text-center h-full hover:shadow-lg transition-shadow duration-300">
                  <CardContent className="p-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-amber-100 to-orange-100 rounded-full mb-6">
                      <value.icon className="h-8 w-8 text-amber-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4">
                      {value.title}
                    </h3>
                    <p className="text-gray-600">{value.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Meet Our Team
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              The passionate individuals behind your unforgettable travel
              experiences.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="text-center overflow-hidden hover:shadow-lg transition-shadow duration-300">
                  <div className="relative h-64">
                    <Image
                      src={member.image || "/placeholder.svg"}
                      alt={member.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {member.name}
                    </h3>
                    <p className="text-amber-600 font-medium mb-4">
                      {member.role}
                    </p>
                    <p className="text-gray-600 text-sm">
                      {member.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
