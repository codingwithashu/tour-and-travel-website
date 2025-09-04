import { AlignCenter } from "lucide-react";
import * as React from "react";

interface Booking {
  fullName: string;
  email: string;
  phone: string;
  departureDate: string;
  returnDate: string;
  travelers: number;
  roomType: string;
  status: string;
}

interface BookingConfirmationEmailProps {
  booking: Booking;
}

const main = {
  backgroundColor: "#f0f4f8",
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Ubuntu, sans-serif',
};

const container = {
  margin: "40px auto",
  maxWidth: "600px",
  backgroundColor: "#ffffff",
  borderRadius: "16px",
  overflow: "hidden",
  boxShadow:
    "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
};

const header = {
  background: "linear-gradient(135deg, #3b82f6 0%, #6366f1 100%)",
  padding: "48px 32px 40px",
  textAlign: "center" as const,
};

const heading = {
  color: "#ffffff",
  fontSize: "32px",
  fontWeight: "700",
  margin: "0 0 12px 0",
  letterSpacing: "-0.025em",
};

const subHeading = {
  color: "rgba(255, 255, 255, 0.9)",
  fontSize: "18px",
  margin: "0",
  fontWeight: "400",
};

const contentSection = {
  padding: "40px 32px",
};

const greeting = {
  fontSize: "22px",
  fontWeight: "600",
  color: "#111827",
  margin: "0 0 16px 0",
};

const bodyText = {
  fontSize: "16px",
  color: "#6b7280",
  lineHeight: "1.6",
  margin: "0 0 32px 0",
};

const detailCard = {
  backgroundColor: "#f8fafc",
  borderRadius: "12px",
  padding: "32px",
  marginBottom: "32px",
  border: "1px solid #e2e8f0",
};

const travelDatesCard = {
  backgroundColor: "#ffffff",
  borderRadius: "12px",
  padding: "24px",
  marginBottom: "24px",
  border: "1px solid #e2e8f0",
};

const datesHeading = {
  fontSize: "14px",
  fontWeight: "600",
  color: "#3b82f6",
  textTransform: "uppercase" as const,
  letterSpacing: "0.05em",
  margin: "0 0 12px 0",
  textAlign: "center" as const,
};

const dateWrapper = {
  textAlign: "center" as const,
  flex: "1",
};

const dateLabel = {
  fontSize: "12px",
  color: "#6b7280",
  margin: "0 0 4px 0",
  textTransform: "uppercase" as const,
};

const dateValue = {
  fontSize: "18px",
  fontWeight: "700",
  color: "#111827",
  margin: "0",
};

const arrow = {
  fontSize: "20px",
  color: "#d1d5db",
  margin: "0 16px",
};

const detailGrid = {
  display: "flex",
  gap: "16px",
  marginBottom: "16px",
};

const detailItem = {
  flex: "1",
};

const detailLabel = {
  fontSize: "12px",
  fontWeight: "600",
  color: "#4b5563",
  textTransform: "uppercase" as const,
  letterSpacing: "0.05em",
  margin: "0 0 8px 0",
};

const detailValue = {
  fontSize: "16px",
  fontWeight: "600",
  color: "#111827",
  margin: "0",
};

const statusBadge = {
  display: "inline-block",
  backgroundColor: "#d1fae5",
  color: "#065f46",
  fontSize: "14px",
  fontWeight: "600",
  padding: "8px 16px",
  borderRadius: "20px",
  margin: "0",
};

const ctaSection = {
  textAlign: "center" as const,
  margin: "32px 0",
};

const ctaButton = {
  backgroundColor: "#3b82f6",
  color: "#ffffff",
  fontSize: "16px",
  fontWeight: "600",
  textDecoration: "none",
  padding: "16px 32px",
  borderRadius: "8px",
  border: "none",
  cursor: "pointer",
  boxShadow:
    "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
};

const whatsNextSection = {
  backgroundColor: "#fef3c7",
  borderRadius: "8px",
  padding: "20px",
  marginBottom: "32px",
};

const whatsNextHeading = {
  fontSize: "16px",
  fontWeight: "600",
  color: "#92400e",
  margin: "0 0 8px 0",
};

const whatsNextText = {
  fontSize: "14px",
  color: "#78350f",
  lineHeight: "1.5",
  margin: "0",
};

const footer = {
  backgroundColor: "#f9fafb",
  padding: "24px 32px",
  textAlign: "center" as const,
  borderTop: "1px solid #e5e7eb",
};

const footerText = {
  fontSize: "12px",
  color: "#9ca3af",
  margin: "0",
  lineHeight: "1.4",
};

// Main App component to simulate the email template
export default function App({ booking }: BookingConfirmationEmailProps) {
  return (
    <div style={main}>
      <div style={container}>
        {/* Header with brand colors */}
        <div style={header}>
          <h1 style={heading}>✅ Booking Confirmed</h1>
          <p style={subHeading}>Your adventure is all set!</p>
        </div>

        {/* Main content */}
        <div style={contentSection}>
          {/* Greeting */}
          <p style={greeting}>Hi {booking.fullName} 👋</p>
          <p style={bodyText}>
            We're thrilled to confirm your booking! Everything is set up
            perfectly for your upcoming trip. Here are your booking details:
          </p>

          {/* Booking details in modern card */}
          <div style={detailCard}>
            {/* Trip dates - prominent display */}
            <p style={datesHeading}>Travel Dates</p>

            <div style={travelDatesCard}>
              <div style={{ display: "flex", alignItems: "center" }}>
                <div style={dateWrapper}>
                  <p style={dateLabel}>Departure</p>
                  <p style={dateValue}>{booking.departureDate}</p>
                </div>
                <p style={arrow}>→</p>
                <div style={dateWrapper}>
                  <p style={dateLabel}>Return</p>
                  <p style={dateValue}>{booking.returnDate}</p>
                </div>
              </div>
            </div>

            {/* Other details in grid */}
            <div style={detailGrid}>
              <div style={detailItem}>
                <p style={detailLabel}>Travelers</p>
                <p style={detailValue}>{booking.travelers}</p>
              </div>
              <div style={detailItem}>
                <p style={detailLabel}>Room Type</p>
                <p style={detailValue}>{booking.roomType}</p>
              </div>
            </div>

            {/* Status badge */}
            <div>
              <p style={detailLabel}>Status</p>
              <span style={statusBadge}>✓ {booking.status}</span>
            </div>
          </div>

          {/* CTA Button */}
          <div style={ctaSection}>
            <a href="#" style={{ ...ctaButton, display: "inline-block" }}>
              View Full Itinerary
            </a>
          </div>

          <hr
            style={{
              border: "none",
              borderTop: "1px solid #e5e7eb",
              margin: "40px 0",
            }}
          />

          {/* What's next section */}
          <div style={whatsNextSection}>
            <p style={whatsNextHeading}>📋 What's Next?</p>
            <p style={whatsNextText}>
              We'll send you detailed travel information and check-in
              instructions 48 hours before your departure. Keep this email
              handy!
            </p>
          </div>

          {/* Footer message */}
          <p style={bodyText}>
            Questions? Just reply to this email or contact our support team
            anytime. We're here to help make your trip perfect!
          </p>

          <p
            style={{
              fontSize: "16px",
              color: "#111827",
              fontWeight: "600",
              margin: "0",
            }}
          >
            Happy travels! ✈️
            <br />
            <span style={{ color: "#3b82f6" }}>The Tours & Travels Team</span>
          </p>
        </div>

        {/* Footer */}
        <div style={footer}>
          <p style={footerText}>
            © {new Date().getFullYear()} Tours & Travels
            <br />
            Making travel dreams come true since 2020
          </p>
        </div>
      </div>
    </div>
  );
}
