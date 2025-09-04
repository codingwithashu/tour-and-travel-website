"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { MessageCircle } from "lucide-react"
import { QuickEnquiryModal } from "./quick-enquiry-modal"

interface QuickEnquiryButtonProps {
  packageTitle?: string
  className?: string
}

export function QuickEnquiryButton({ packageTitle, className = "" }: QuickEnquiryButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsModalOpen(true)}
        className={`fixed bottom-6 right-6 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-full p-4 shadow-lg hover:shadow-xl transition-all duration-300 z-40 ${className}`}
      >
        <MessageCircle className="h-6 w-6" />
        <span className="sr-only">Quick Enquiry</span>
      </motion.button>

      <QuickEnquiryModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} packageTitle={packageTitle} />
    </>
  )
}
