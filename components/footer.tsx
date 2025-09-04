import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Plane,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Mail,
  Phone,
  MapPin,
  MessageCircle,
} from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-card border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="lg:col-span-1">
              <Link href="/" className="flex items-center space-x-2 mb-6">
                <div className="w-8 h-8 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center">
                  <Plane className="w-5 h-5 text-primary-foreground" />
                </div>
                <span className="text-xl font-bold text-foreground">
                  Atharv
                </span>
              </Link>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                Your trusted Indian travel partner for incredible journeys
                across India and beyond. We specialize in creating authentic
                experiences with local expertise and unbeatable value.
              </p>
              <div className="flex space-x-4">
                <Button
                  size="sm"
                  variant="outline"
                  className="w-10 h-10 p-0 bg-transparent"
                >
                  <Facebook className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="w-10 h-10 p-0 bg-transparent"
                >
                  <Twitter className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="w-10 h-10 p-0 bg-transparent"
                >
                  <Instagram className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="w-10 h-10 p-0 bg-transparent"
                >
                  <Youtube className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-6">
                Popular Destinations
              </h3>
              <ul className="space-y-3">
                <li>
                  <Link
                    href="/packages?category=domestic"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    India Tours
                  </Link>
                </li>
                <li>
                  <Link
                    href="/packages?destination=kerala"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    Kerala Backwaters
                  </Link>
                </li>
                <li>
                  <Link
                    href="/packages?destination=rajasthan"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    Rajasthan Heritage
                  </Link>
                </li>
                <li>
                  <Link
                    href="/packages?destination=dubai"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    Dubai Packages
                  </Link>
                </li>
                <li>
                  <Link
                    href="/packages?destination=thailand"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    Thailand Tours
                  </Link>
                </li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-6">
                Travel Services
              </h3>
              <ul className="space-y-3">
                <li>
                  <Link
                    href="/visa-assistance"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    Visa Assistance
                  </Link>
                </li>
                <li>
                  <Link
                    href="/travel-insurance"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    Travel Insurance
                  </Link>
                </li>
                <li>
                  <Link
                    href="/forex"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    Forex Services
                  </Link>
                </li>
                <li>
                  <Link
                    href="/group-tours"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    Group Tours
                  </Link>
                </li>
                <li>
                  <Link
                    href="/corporate-travel"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    Corporate Travel
                  </Link>
                </li>
              </ul>
            </div>

            {/* Newsletter & Contact */}
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-6">
                Get In Touch
              </h3>
              <p className="text-muted-foreground mb-4">
                Subscribe for exclusive deals and travel tips.
              </p>
              <div className="flex gap-2 mb-6">
                <Input placeholder="Enter your email" className="flex-1" />
                <Button
                  size="sm"
                  className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-primary-foreground"
                >
                  <Mail className="w-4 h-4" />
                </Button>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3 text-muted-foreground">
                  <Phone className="w-4 h-4 text-primary" />
                  <span>+91 98765 43210</span>
                </div>
                <div className="flex items-center gap-3 text-muted-foreground">
                  <MessageCircle className="w-4 h-4 text-green-600" />
                  <a
                    href="https://wa.me/919876543210"
                    className="hover:text-primary transition-colors"
                  >
                    WhatsApp Support
                  </a>
                </div>
                <div className="flex items-center gap-3 text-muted-foreground">
                  <Mail className="w-4 h-4 text-primary" />
                  <span>info@atharvtravels.com</span>
                </div>
                <div className="flex items-center gap-3 text-muted-foreground">
                  <MapPin className="w-4 h-4 text-primary" />
                  <span>Mumbai, Delhi, Bangalore</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="py-6 border-t border-border">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-muted-foreground text-sm">
              © 2024 Atharv Travel. All rights reserved. | IATA Certified
            </p>
            <div className="flex items-center gap-6 text-sm">
              <Link
                href="/privacy-policy"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms-conditions"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                Terms & Conditions
              </Link>
              <Link
                href="/refund-policy"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                Refund Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
