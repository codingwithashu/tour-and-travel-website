"use client"

import type React from "react"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Phone, Mail, MessageCircle, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"

interface QuickEnquiryModalProps {
  isOpen: boolean
  onClose: () => void
  packageTitle?: string
}

export function QuickEnquiryModal({ isOpen, onClose, packageTitle }: QuickEnquiryModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    destination: packageTitle || "",
    travelDate: "",
    travelers: "",
    budget: "",
    message: "",
    whatsappUpdates: false,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission
    console.log("Quick enquiry submitted:", formData)
    onClose()
    // Show success message
  }

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="relative bg-gradient-to-r from-amber-500 to-orange-500 p-6 rounded-t-2xl">
              <button
                onClick={onClose}
                className="absolute top-4 right-4 text-white hover:bg-white/20 rounded-full p-2 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
              <div className="text-white">
                <h2 className="text-2xl font-bold mb-2">Quick Enquiry</h2>
                <p className="text-amber-100">Get instant quotes and expert advice</p>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                    Full Name *
                  </Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder="Enter your name"
                    required
                    className="mt-1 border-2"
                  />
                </div>
                <div>
                  <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
                    Phone Number *
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    placeholder="+91 98765 43210"
                    required
                    className="mt-1 border-2"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                  Email Address *
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="your.email@example.com"
                  required
                  className="mt-1 border-2"
                />
              </div>

              <div>
                <Label htmlFor="destination" className="text-sm font-medium text-gray-700">
                  Interested Destination
                </Label>
                <Select value={formData.destination} onValueChange={(value) => handleInputChange("destination", value)}>
                  <SelectTrigger className="mt-1 border-2 border-border bg-background hover:bg-muted">
                    <SelectValue placeholder="Select destination" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="kerala">Kerala Backwaters</SelectItem>
                    <SelectItem value="rajasthan">Rajasthan Heritage</SelectItem>
                    <SelectItem value="dubai">Dubai Luxury</SelectItem>
                    <SelectItem value="thailand">Thailand Beach</SelectItem>
                    <SelectItem value="himachal">Himachal Hills</SelectItem>
                    <SelectItem value="singapore">Singapore Family</SelectItem>
                    <SelectItem value="goa">Goa Beaches</SelectItem>
                    <SelectItem value="kashmir">Kashmir Valley</SelectItem>
                    <SelectItem value="other">Other Destination</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="travelers" className="text-sm font-medium text-gray-700">
                    No. of Travelers
                  </Label>
                  <Select value={formData.travelers} onValueChange={(value) => handleInputChange("travelers", value)}>
                    <SelectTrigger className="mt-1 border-2 border-border bg-background hover:bg-muted">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 Person</SelectItem>
                      <SelectItem value="2">2 People</SelectItem>
                      <SelectItem value="3-4">3-4 People</SelectItem>
                      <SelectItem value="5-8">5-8 People</SelectItem>
                      <SelectItem value="9+">9+ People</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="budget" className="text-sm font-medium text-gray-700">
                    Budget Range
                  </Label>
                  <Select value={formData.budget} onValueChange={(value) => handleInputChange("budget", value)}>
                    <SelectTrigger className="mt-1 border-2 border-border bg-background hover:bg-muted">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="under-25k">Under ₹25,000</SelectItem>
                      <SelectItem value="25k-50k">₹25,000 - ₹50,000</SelectItem>
                      <SelectItem value="50k-1l">₹50,000 - ₹1,00,000</SelectItem>
                      <SelectItem value="1l-2l">₹1,00,000 - ₹2,00,000</SelectItem>
                      <SelectItem value="above-2l">Above ₹2,00,000</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="message" className="text-sm font-medium text-gray-700">
                  Additional Requirements
                </Label>
                <Textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) => handleInputChange("message", e.target.value)}
                  placeholder="Tell us about your travel preferences, special requirements, or any questions..."
                  rows={3}
                  className="mt-1 border-2"
                />
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="whatsapp"
                  checked={formData.whatsappUpdates}
                  onCheckedChange={(checked) => handleInputChange("whatsappUpdates", checked as boolean)}
                />
                <Label htmlFor="whatsapp" className="text-sm text-gray-600">
                  Send updates on WhatsApp
                </Label>
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold py-3 rounded-lg transition-all duration-300 transform hover:scale-105"
              >
                <Send className="h-4 w-4 mr-2" />
                Send Enquiry
              </Button>

              <div className="text-center pt-4 border-t">
                <p className="text-sm text-gray-600 mb-3">Or contact us directly:</p>
                <div className="flex justify-center space-x-4">
                  <a
                    href="tel:+919876543210"
                    className="flex items-center text-amber-600 hover:text-amber-700 transition-colors"
                  >
                    <Phone className="h-4 w-4 mr-1" />
                    <span className="text-sm">Call Now</span>
                  </a>
                  <a
                    href="https://wa.me/919876543210"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-green-600 hover:text-green-700 transition-colors"
                  >
                    <MessageCircle className="h-4 w-4 mr-1" />
                    <span className="text-sm">WhatsApp</span>
                  </a>
                  <a
                    href="mailto:info@travelcompany.com"
                    className="flex items-center text-blue-600 hover:text-blue-700 transition-colors"
                  >
                    <Mail className="h-4 w-4 mr-1" />
                    <span className="text-sm">Email</span>
                  </a>
                </div>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
