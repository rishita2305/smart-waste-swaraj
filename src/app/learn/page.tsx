// src/app/learn/page.tsx
import Image from 'next/image';
import Link from 'next/link';
import { FaRecycle, FaTree, FaLightbulb, FaPlayCircle } from 'react-icons/fa';
import styles from './learn.module.css'; // Dedicated CSS Module

export default function LearnPage() {
  return (
    <div className={styles.learnContainer}>
      <header className={styles.heroSection}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>
            Empower Your Knowledge, Empower Our Planet.
          </h1>
          <p className={styles.heroSubtitle}>
            Dive deep into the world of sustainable waste management. Learn,
            act, and inspire change.
          </p>
          <Link href="#featured-topics" className={styles.heroButton}>
            Explore Topics <FaLightbulb className={styles.heroButtonIcon} />
          </Link>
        </div>
      </header>

      <section id="featured-topics" className={styles.section}>
        <h2 className={styles.sectionTitle}>Featured Learning Paths</h2>
        <p className={styles.sectionSubtitle}>
          Start your journey with these essential guides.
        </p>
        <div className={styles.cardGrid}>
          <div className={styles.card}>
            <Image
              src="/zero-waste.jpg"
              alt="Zero Waste Lifestyle"
              width={400}
              height={250}
              className={styles.cardImage}
            />
            <h3 className={styles.cardTitle}>Zero Waste Lifestyle</h3>
            <p className={styles.cardDescription}>
              Learn how to reduce your household waste and embrace a minimal
              waste lifestyle.
            </p>
            <Link
              href="https://www.zerowastehome.com/"
              target="_blank"
              className={styles.cardButton}
            >
              Explore Tips <FaRecycle />
            </Link>
          </div>

          <div className={styles.card}>
            <Image
              src="/e waste.jpeg"
              alt="E-Waste Management"
              width={400}
              height={250}
              className={styles.cardImage}
            />
            <h3 className={styles.cardTitle}>Understanding E-Waste</h3>
            <p className={styles.cardDescription}>
              Electronic waste is rising fast. Learn how to safely recycle and
              dispose of e-waste.
            </p>
            <Link
              href="https://www.geeksforgeeks.org/computer-science-fundamentals/what-is-e-waste/"
              target="_blank"
              className={styles.cardButton}
            >
              Learn More <FaLightbulb />
            </Link>
          </div>

          <div className={styles.card}>
            <Image
              src="/circular economy.png"
              alt="Circular Economy"
              width={400}
              height={250}
              className={styles.cardImage}
            />
            <h3 className={styles.cardTitle}>Intro to Circular Economy</h3>
            <p className={styles.cardDescription}>
              Discover how circular systems reduce waste and make businesses
              more sustainable.
            </p>
            <Link
              href="https://ellenmacarthurfoundation.org/topics/circular-economy-introduction/overview"
              target="_blank"
              className={styles.cardButton}
            >
              Read Article <FaTree />
            </Link>
          </div>

          <div className={styles.card}>
            <Image
              src="/waste segregation.jpg"
              alt="Waste Segregation Guide"
              width={400}
              height={250}
              className={`${styles.cardImage}`}
            />

            <h3 className={styles.cardTitle}>Mastering Waste Segregation</h3>
            <p className={styles.cardDescription}>
              Learn the crucial art of separating waste at its source for
              efficient recycling and composting.
            </p>
            <Link
              href="https://greensutra.in/news/start-waste-segregation-at-source/"
              target="_blank"
              className={styles.cardButton}
            >
              Read More <FaRecycle />
            </Link>
          </div>

          <div className={styles.card}>
            <Image
              src="/composting.jpg" // Path to your image
              alt="Benefits of Composting"
              width={400}
              height={250}
              className={styles.cardImage}
            />
            <h3 className={styles.cardTitle}>The Power of Composting</h3>
            <p className={styles.cardDescription}>
              Transform organic waste into valuable fertilizer. Discover its
              environmental and economic benefits.
            </p>
            <Link
              href="https://www.youtube.com/watch?v=_K25WjjCBuw"
              target="_blank"
              className={styles.cardButton}
            >
              Watch Video <FaTree />
            </Link>
          </div>

          <div className={styles.card}>
            <Image
              src="/recycling.jpeg" // Path to your image
              alt="Urban Recycling"
              width={400}
              height={250}
              className={styles.cardImage}
            />
            <h3 className={styles.cardTitle}>Recycling in Urban Areas</h3>
            <p className={styles.cardDescription}>
              Navigate the complexities of urban recycling programs and
              contribute effectively.
            </p>
            <Link
              href="https://we-recycle.org/"
              target="_blank"
              className={styles.cardButton}
            >
              Get Started <FaRecycle />
            </Link>
          </div>
        </div>
      </section>

      <section className={styles.sectionAlt}>
        <h2 className={styles.sectionTitle}>Watch & Learn: Video Resources</h2>
        <p className={styles.sectionSubtitle}>
          Visual guides and inspiring stories to deepen your understanding.
        </p>
        <div className={styles.videoGrid}>
          <div className={styles.videoCard}>
            <div className={styles.videoThumbnail}>
              <Image
                src="/images/video_thumbnail_1.jpg" // Thumbnail for the video
                alt="How to Compost at Home"
                width={500}
                height={300}
                layout="responsive" // Make image responsive within container
                className={styles.videoImage}
              />
              <a
                href="https://www.youtube.com/watch?v=your-video-id-1"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.playButton}
              >
                <FaPlayCircle />
              </a>
            </div>
            <h3 className={styles.videoTitle}>
              Composting Basics for Beginners
            </h3>
            <p className={styles.videoDescription}>
              A comprehensive guide to starting your home composting journey.
            </p>
          </div>

          <div className={styles.videoCard}>
            <div className={styles.videoThumbnail}>
              <Image
                src="/images/video_thumbnail_2.jpg" // Thumbnail for the video
                alt="Impact of Plastic Waste"
                width={500}
                height={300}
                layout="responsive"
                className={styles.videoImage}
              />
              <a
                href="https://www.youtube.com/watch?v=your-video-id-2"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.playButton}
              >
                <FaPlayCircle />
              </a>
            </div>
            <h3 className={styles.videoTitle}>
              The Global Plastic Crisis: What You Can Do
            </h3>
            <p className={styles.videoDescription}>
              Understand the impact of plastic and simple steps to reduce it.
            </p>
          </div>
        </div>
      </section>

      {/* Example for a specific detailed learning page (e.g., src/app/learn/segregation/page.tsx) */}
      {/* This page would have more detailed text, more images, maybe embedded videos directly */}
      {/* <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Detailed Guide: Waste Segregation</h2>
        <div className={styles.contentBlock}>
          <p>Proper waste segregation is the first and most critical step in effective waste management...</p>
          <Image src="/images/segregation_chart.png" alt="Segregation Chart" width={600} height={400} />
          <h3>Why Segregate?</h3>
          <ul>
            <li>Reduces landfill burden</li>
            <li>Enables efficient recycling</li>
            <li>Prevents contamination</li>
          </ul>
          <video width="640" height="360" controls className={styles.embeddedVideo}>
            <source src="/videos/segregation_demo.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      </section> */}

      <section className={styles.callToAction}>
        <h2 className={styles.callToActionTitle}>
          Ready to Make a Difference?
        </h2>
        <p className={styles.callToActionSubtitle}>
          Join our community and apply your knowledge to real-world impact.
        </p>
        <Link href="/dashboard" className={styles.callToActionLink}>
          Start Contributing Now!
        </Link>
      </section>
    </div>
  );
}
