// src/app/about/page.tsx
import styles from './about.module.css';

export default function AboutPage() {
  return (
    <div className={styles.aboutContainer}>
      <h1 className={styles.aboutTitle}>About Smart Waste Swaraj</h1>
      <p className={styles.aboutText}>
        Our mission is to revolutionize waste management in India by connecting waste generators with collectors...
      </p>
      {/* More about content */}
    </div>
  );
}