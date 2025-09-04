"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { MessageCircle, Check, ChevronsUpDown, Send } from "lucide-react"
import { cn } from "@/lib/utils"
import { packages, destinations } from "@/lib/data"
import type { EnquiryForm } from "@/types"

const interests = [
  "Adventure Sports",
  "Cultural Experiences",
  "Beach & Relaxation",
  "Wildlife & Nature",
  "Food & Wine",
  "Photography",
  "Luxury Travel",
  "Budget Travel",
  "Family Friendly",
  "Romantic Getaway",
]

const budgetRanges = [
  "Under $1,000",
  "$1,000 - $2,500",
  "$2,500 - $5,000",
  "$5,000 - $10,000",
  "Above $10,000",
  "I'm flexible",
]

export function EnquiryPage() {
  const [formData, setFormData] = useState<EnquiryForm>({
    personalInfo: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
    },
    travelPreferences: {
      destination: "",
      budget: "",
      travelDates: "",
      groupSize: 2,
      interests: [],
    },
    message: "",
  })

  const [openDestination, setOpenDestination] = useState(false)
  const [openPackage, setOpenPackage] = useState(false)
  const [selectedPackage, setSelectedPackage] = useState("")
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Enquiry submitted:", formData)
    setIsSubmitted(true)
  }

  const updatePersonalInfo = (field: keyof EnquiryForm["personalInfo"], value: string) => {
    setFormData((prev) => ({
      ...prev,
      personalInfo: { ...prev.personalInfo, [field]: value },
    }))
  }

  const updateTravelPreferences = (
    field: keyof EnquiryForm["travelPreferences"],
    value: string | number | string[],
  ) => {
    setFormData((prev) => ({
      ...prev,
      travelPreferences: { ...prev.travelPreferences, [field]: value },
    }))
  }

  const toggleInterest = (interest: string) => {
    const currentInterests = formData.travelPreferences.interests
    if (currentInterests.includes(interest)) {
      updateTravelPreferences(
        "interests",
        currentInterests.filter((i) => i !== interest),
      )
    } else {
      updateTravelPreferences("interests", [...currentInterests, interest])
    }
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-muted/30 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md mx-auto text-center"
        >
          <Card className="border-0 shadow-xl">
            <CardContent className="p-8">
              <div className="w-16 h-16 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center mx-auto mb-6">
                <Check className="w-8 h-8 text-primary-foreground" />
              </div>
              <h2 className="text-2xl font-bold mb-4">Enquiry Sent Successfully!</h2>
              <p className="text-muted-foreground mb-6">
                Thank you for your enquiry. Our travel experts will review your requirements and get back to you within
                24 hours with a personalized travel proposal.
              </p>
              <Button
                onClick={() => setIsSubmitted(false)}
                className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-primary-foreground"
              >
                Send Another Enquiry
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <section className="bg-gradient-to-r from-primary to-secondary py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-primary-foreground"
          >
            <MessageCircle className="w-16 h-16 mx-auto mb-6" />
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Send Us An Enquiry</h1>
            <p className="text-xl text-primary-foreground/90 max-w-2xl mx-auto">
              Tell us about your dream vacation and our travel experts will create a personalized itinerary just for you
            </p>
          </motion.div>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card className="border-0 shadow-xl">
            <CardHeader className="text-center pb-8">
              <CardTitle className="text-2xl">Tell Us About Your Travel Plans</CardTitle>
              <p className="text-muted-foreground">
                The more details you provide, the better we can tailor your perfect vacation
              </p>
            </CardHeader>
            <CardContent className="p-8">
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Personal Information */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="space-y-6"
                >
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center text-primary-foreground font-bold text-sm">
                      1
                    </div>
                    <h3 className="text-xl font-semibold">Personal Information</h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name *</Label>
                      <Input
                        id="firstName"
                        value={formData.personalInfo.firstName}
                        onChange={(e) => updatePersonalInfo("firstName", e.target.value)}
                        placeholder="Enter your first name"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name *</Label>
                      <Input
                        id="lastName"
                        value={formData.personalInfo.lastName}
                        onChange={(e) => updatePersonalInfo("lastName", e.target.value)}
                        placeholder="Enter your last name"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.personalInfo.email}
                        onChange={(e) => updatePersonalInfo("email", e.target.value)}
                        placeholder="Enter your email address"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.personalInfo.phone}
                        onChange={(e) => updatePersonalInfo("phone", e.target.value)}
                        placeholder="Enter your phone number"
                      />
                    </div>
                  </div>
                </motion.div>

                {/* Travel Preferences */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                  className="space-y-6"
                >
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center text-primary-foreground font-bold text-sm">
                      2
                    </div>
                    <h3 className="text-xl font-semibold">Travel Preferences</h3>
                  </div>

                  {/* Package Selection */}
                  <div className="space-y-2">
                    <Label>Interested in a Specific Package?</Label>
                    <Popover open={openPackage} onOpenChange={setOpenPackage}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          role="combobox"
                          aria-expanded={openPackage}
                          className="w-full justify-between border-2 border-border bg-background hover:bg-muted hover:border-primary/60"
                        >
                          {selectedPackage
                            ? packages.find((pkg) => pkg.id === selectedPackage)?.title
                            : "Select a package (optional)"}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-full p-0">
                        <Command>
                          <CommandInput placeholder="Search packages..." />
                          <CommandList>
                            <CommandEmpty>No packages found.</CommandEmpty>
                            <CommandGroup>
                              {packages.map((pkg) => (
                                <CommandItem
                                  key={pkg.id}
                                  value={pkg.id}
                                  onSelect={(currentValue) => {
                                    setSelectedPackage(currentValue === selectedPackage ? "" : currentValue)
                                    setFormData((prev) => ({ ...prev, packageId: currentValue }))
                                    setOpenPackage(false)
                                  }}
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      selectedPackage === pkg.id ? "opacity-100" : "opacity-0",
                                    )}
                                  />
                                  <div>
                                    <div className="font-medium">{pkg.title}</div>
                                    <div className="text-sm text-muted-foreground">{pkg.destination}</div>
                                  </div>
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  </div>

                  {/* Destination */}
                  <div className="space-y-2">
                    <Label>Preferred Destination</Label>
                    <Popover open={openDestination} onOpenChange={setOpenDestination}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          role="combobox"
                          aria-expanded={openDestination}
                          className="w-full justify-between border-2 border-border bg-background hover:bg-muted hover:border-primary/60"
                        >
                          {formData.travelPreferences.destination || "Select destination (optional)"}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-full p-0">
                        <Command>
                          <CommandInput placeholder="Search destinations..." />
                          <CommandList>
                            <CommandEmpty>No destinations found.</CommandEmpty>
                            <CommandGroup>
                              {destinations.map((destination) => (
                                <CommandItem
                                  key={destination.id}
                                  value={destination.name}
                                  onSelect={(currentValue) => {
                                    updateTravelPreferences(
                                      "destination",
                                      currentValue === formData.travelPreferences.destination ? "" : currentValue,
                                    )
                                    setOpenDestination(false)
                                  }}
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      formData.travelPreferences.destination === destination.name
                                        ? "opacity-100"
                                        : "opacity-0",
                                    )}
                                  />
                                  <div>
                                    <div className="font-medium">{destination.name}</div>
                                    <div className="text-sm text-muted-foreground">{destination.description}</div>
                                  </div>
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="budget">Budget Range</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full justify-between border-2 border-border bg-background hover:bg-muted hover:border-primary/60"
                            role="combobox"
                          >
                            {formData.travelPreferences.budget || "Select budget"}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-full p-0">
                          <Command>
                            <CommandList>
                              <CommandGroup>
                                {budgetRanges.map((range) => (
                                  <CommandItem
                                    key={range}
                                    value={range}
                                    onSelect={() => updateTravelPreferences("budget", range)}
                                  >
                                    <Check
                                      className={cn(
                                        "mr-2 h-4 w-4",
                                        formData.travelPreferences.budget === range ? "opacity-100" : "opacity-0",
                                      )}
                                    />
                                    {range}
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="travelDates">Preferred Travel Dates</Label>
                      <Input
                        id="travelDates"
                        value={formData.travelPreferences.travelDates}
                        onChange={(e) => updateTravelPreferences("travelDates", e.target.value)}
                        placeholder="e.g., June 2024, Summer 2024"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="groupSize">Group Size</Label>
                      <Input
                        id="groupSize"
                        type="number"
                        min="1"
                        max="20"
                        value={formData.travelPreferences.groupSize}
                        onChange={(e) => updateTravelPreferences("groupSize", Number.parseInt(e.target.value) || 1)}
                      />
                    </div>
                  </div>

                  {/* Interests */}
                  <div className="space-y-4">
                    <Label>Travel Interests (Select all that apply)</Label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {interests.map((interest) => (
                        <div key={interest} className="flex items-center space-x-2">
                          <Checkbox
                            id={interest}
                            checked={formData.travelPreferences.interests.includes(interest)}
                            onCheckedChange={() => toggleInterest(interest)}
                          />
                          <Label htmlFor={interest} className="text-sm cursor-pointer">
                            {interest}
                          </Label>
                        </div>
                      ))}
                    </div>
                    {formData.travelPreferences.interests.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {formData.travelPreferences.interests.map((interest) => (
                          <Badge key={interest} variant="secondary" className="text-xs">
                            {interest}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>

                {/* Message */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                  className="space-y-4"
                >
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center text-primary-foreground font-bold text-sm">
                      3
                    </div>
                    <h3 className="text-xl font-semibold">Additional Details</h3>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Tell us more about your ideal trip *</Label>
                    <Textarea
                      id="message"
                      value={formData.message}
                      onChange={(e) => setFormData((prev) => ({ ...prev, message: e.target.value }))}
                      placeholder="Describe your dream vacation, any specific requirements, activities you'd like to include, or questions you have..."
                      rows={6}
                      required
                    />
                  </div>
                </motion.div>

                {/* Submit Button */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="pt-6"
                >
                  <Button
                    type="submit"
                    size="lg"
                    className="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-primary-foreground"
                  >
                    <Send className="w-5 h-5 mr-2" />
                    Send Enquiry
                  </Button>
                  <p className="text-sm text-muted-foreground text-center mt-4">
                    Our travel experts will review your enquiry and respond within 24 hours with a personalized
                    proposal.
                  </p>
                </motion.div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
