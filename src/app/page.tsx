// src/app/page.tsx
'use client';

import Link from 'next/link';
import { FaRecycle, FaMapMarkedAlt, FaLeaf, FaQuestionCircle, FaEnvelope, FaBolt } from 'react-icons/fa';
import styles from './landing-page.module.css'; // Import module CSS

export default function LandingPage() {
  return (

    
    <div className={styles.landingPageContainer}>

      {/* Hero Section */}
      <section
        className={styles.heroSection}
        style={{ backgroundImage: 'url("/waste-hero-bg.jpg")' }}
      >
        <div className={styles.heroOverlay}></div>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>
            Revolutionizing Waste Management for a Cleaner India
          </h1>
          <p className={styles.heroSubtitle}>
            Connect waste generators with collectors for efficient, sustainable waste disposal.
          </p>
          <Link href="/auth/signup" className={styles.getStartedButton}>
            <FaBolt className={styles.buttonIcon} /> Get Started Today
          </Link>
        </div>
      </section>

      {/* About Us Section */}
      <section className={styles.aboutUsSection}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>
            What is Smart Waste Swaraj?
          </h2>
          <div className={styles.aboutContent}>
            <div className={styles.aboutImageWrapper}>
              <img
                src="/Waste-Management.jpg"
                alt="Waste Sorting"
                className={styles.aboutImage}
              />
            </div>
            <div className={styles.aboutText}>
              <p className={styles.aboutParagraph}>
                Smart Waste Swaraj is an innovative platform designed to bridge the gap between households/businesses generating waste and dedicated waste collectors. We empower users to easily list their recyclable and non-recyclable waste, making it visible to local collectors who can efficiently pick it up.
              </p>
              <p className={styles.aboutParagraph}>
                Our mission is to foster a cleaner environment, reduce landfill burden, and support a circular economy by streamlining the waste collection process and promoting responsible disposal practices across India.
              </p>
              <Link href="/map" className={styles.exploreMapButton}>
                <FaMapMarkedAlt className={styles.buttonIcon} /> Explore Waste Map
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features/Benefits Section */}
      <section className={styles.benefitsSection}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>
            Key Benefits
          </h2>
          <div className={styles.benefitsGrid}>
            <div className={styles.benefitCard}>
              <FaLeaf className={styles.benefitIcon} style={{ color: 'var(--status-completed)' }} />
              <h3 className={styles.benefitTitle}>Eco-Friendly</h3>
              <p className={styles.benefitDescription}>Reduce your carbon footprint and contribute to a healthier planet by recycling efficiently.</p>
            </div>
            <div className={styles.benefitCard}>
              <FaMapMarkedAlt className={styles.benefitIcon} style={{ color: 'var(--color-primary)' }} />
              <h3 className={styles.benefitTitle}>Efficient Collection</h3>
              <p className={styles.benefitDescription}>Connect directly with collectors, ensuring timely and convenient waste pickup.</p>
            </div>
            <div className={styles.benefitCard}>
              <FaRecycle className={styles.benefitIcon} style={{ color: '#8a2be2' /* Custom purple */ }} />
              <h3 className={styles.benefitTitle}>Sustainable Future</h3>
              <p className={styles.benefitDescription}>Support a circular economy and promote responsible waste management practices.</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className={styles.faqSection}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>
            Frequently Asked Questions
          </h2>
          <div className={styles.faqList}>
            {faqData.map((item, index) => (
              <details key={index} className={styles.faqItem}>
                <summary className={styles.faqSummary}>
                  {item.question}
                  <FaQuestionCircle className={styles.faqIcon} style={{ color: 'var(--color-secondary)' }} />
                </summary>
                <p className={styles.faqAnswer}>{item.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Us Section */}
      <section className={styles.contactSection}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>
            Get in Touch
          </h2>
          <p className={styles.contactSubtitle}>
            Have questions or need support? Reach out to us!
          </p>
          <div className={styles.contactLinks}>
            <a href="mailto:info@wastewiseswaraj.com" className={styles.contactLink}>
              <FaEnvelope /> Email Us
            </a>
            <a href="tel:+919876543210" className={styles.contactLink}>
              <FaRecycle /> Call Us
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.container}>
          <p>&copy; {new Date().getFullYear()} Smart Waste Swaraj. All rights reserved.</p>
          <div className={styles.footerLinks}>
            <Link href="/privacy" className={styles.footerLink}>Privacy Policy</Link>
            <Link href="/terms" className={styles.footerLink}>Terms of Service</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

const faqData = [
  {
    question: "How do I list my waste?",
    answer: "As a 'generator', simply log in, navigate to the 'List Waste' section, fill in the details about your waste type, quantity, and location, and submit. Collectors in your area will be notified.",
  },
  {
    question: "How do I collect waste as a collector?",
    answer: "As a 'collector', log in and view the 'Map' or 'Dashboard'. Pending listings will be visible. You can 'Assign' yourself to a listing and then 'Complete' it once collected.",
  },
  {
    question: "What waste types are accepted?",
    answer: "We categorize waste into common types like paper & cardboard, plastics, glass, metals, e-waste, and organic waste (compostable). Please categorize your waste appropriately.",
  },
  {
    question: "Is there a charge for using the service?",
    answer: "Our platform aims to facilitate connections. Specific charges or remuneration for waste collection are agreed upon between the generator and collector directly, outside the platform.",
  },
];