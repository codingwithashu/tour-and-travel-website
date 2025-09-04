"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, Award, Headphones, Globe, Clock, Heart } from "lucide-react";
import { motion } from "framer-motion";

const features = [
  {
    icon: Shield,
    title: "Trusted & Secure",
    description:
      "Your bookings are protected with industry-leading security and our comprehensive travel insurance options.",
  },
  {
    icon: Award,
    title: "Award-Winning Service",
    description:
      "Recognized globally for excellence in travel services with over 10,000 satisfied customers worldwide.",
  },
  {
    icon: Headphones,
    title: "24/7 Support",
    description:
      "Round-the-clock customer support to assist you before, during, and after your journey.",
  },
  {
    icon: Globe,
    title: "Global Network",
    description:
      "Partnerships with premium hotels, airlines, and local guides in over 100 destinations worldwide.",
  },
  {
    icon: Clock,
    title: "Instant Confirmation",
    description:
      "Get immediate booking confirmations and real-time updates on your travel arrangements.",
  },
  {
    icon: Heart,
    title: "Personalized Experience",
    description:
      "Tailored itineraries and recommendations based on your preferences and travel style.",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

const statsVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.8,
      ease: "easeOut",
    },
  },
};

export function WhyChooseUs() {
  return (
    <section className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Badge
              variant="secondary"
              className="mb-4 px-4 py-2 text-sm font-medium"
            >
              Why Choose Atharv
            </Badge>
          </motion.div>
          <motion.h2
            className="text-3xl md:text-5xl font-bold text-foreground mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Your Journey, Our Expertise
          </motion.h2>
          <motion.p
            className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            With years of experience and a passion for travel, we're committed
            to making your adventures seamless, safe, and spectacular.
          </motion.p>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div key={index} variants={itemVariants}>
                <Card className="group border-0 shadow-md hover:shadow-xl transition-all duration-500 hover:-translate-y-2 bg-card">
                  <CardContent className="p-8 text-center">
                    <motion.div
                      className="w-16 h-16 mx-auto mb-6 bg-gradient-to-r from-primary to-secondary rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300"
                      whileHover={{ rotate: 5 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Icon className="w-8 h-8 text-primary-foreground" />
                    </motion.div>

                    <motion.h3
                      className="text-xl font-bold text-foreground mb-4 group-hover:text-primary transition-colors duration-300"
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: index * 0.1 + 0.3 }}
                    >
                      {feature.title}
                    </motion.h3>

                    <motion.p
                      className="text-muted-foreground leading-relaxed"
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: index * 0.1 + 0.4 }}
                    >
                      {feature.description}
                    </motion.p>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Stats Section */}
        <motion.div
          className="mt-20 bg-gradient-to-r from-primary to-secondary rounded-3xl p-8 md:p-12 text-center"
          variants={statsVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {[
              { number: "10K+", label: "Happy Travelers" },
              { number: "100+", label: "Destinations" },
              { number: "15+", label: "Years Experience" },
              { number: "4.9", label: "Average Rating" },
            ].map((stat, index) => (
              <motion.div
                key={index}
                className="text-primary-foreground"
                variants={itemVariants}
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.2 }}
              >
                <motion.div
                  className="text-3xl md:text-4xl font-bold mb-2"
                  initial={{ opacity: 0, scale: 0.5 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  {stat.number}
                </motion.div>
                <motion.div
                  className="text-primary-foreground/90"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 + 0.2 }}
                >
                  {stat.label}
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
