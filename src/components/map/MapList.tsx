// src/components/map/ListingDetailPanel.tsx
'use client';

import React, { useState } from 'react'; // Added useState for comment input
import { WasteListingLocation, User, Comment } from '../../types'; // Import types
import { FaTimes, FaMapMarkerAlt, FaCalendarAlt, FaUser, FaTag, FaWeight, FaMoneyBillWave, FaPaperclip, FaCheckCircle, FaClipboardCheck, FaEnvelope, FaCommentDots, FaClock, FaTrash } from 'react-icons/fa';
import styles from './waste-map.module.css';
import { useData } from '../../contexts/DataContext'; // IMPORTANT: Import useData to get context functions

interface ListingDetailPanelProps {
  listing: WasteListingLocation | null;
  // currentUser is passed from parent to ensure it's loaded
  currentUser: User | null;
  // users are passed to resolve display names
  users: User[];
  onClose: () => void;
}

export default function ListingDetailPanel({
  listing,
  currentUser,
  users,
  onClose,
}: ListingDetailPanelProps) {
  // Retrieve the functions directly from the DataContext
  const { assignCollectorToListing, completeListing, addCommentToListing } = useData();
  const [commentText, setCommentText] = useState('');

  if (!listing) {
    return null; // Don't render if no listing is selected
  }

  const isGenerator = currentUser?.userType === 'generator';
  const isCollector = currentUser?.userType === 'collector';
  const isAssignedToCurrentUser = listing.assignedCollectorId === currentUser?.id;
  const isMyListing = currentUser?.id === listing.userId;

  const getDisplayName = (userId: string) => {
    const user = users.find(u => u.id === userId);
    return user ? user.name || user.email.split('@')[0] : 'Unknown User';
  };

  const getCollectorName = (collectorId?: string) => {
    if (!collectorId) return 'N/A';
    const collector = users.find(u => u.id === collectorId);
    return collector ? collector.name || collector.email.split('@')[0] : 'Unknown Collector';
  };

  const handleAddComment = async () => {
    if (commentText.trim() && currentUser && listing) {
      const newComment: Omit<Comment, 'id' | 'createdAt'> = {
        userId: currentUser.id,
        userName: currentUser.name || currentUser.email.split('@')[0],
        text: commentText.trim(),
      };
      await addCommentToListing(listing.id, newComment);
      setCommentText(''); // Clear comment input after adding
    }
  };

  return (
    <div className={styles.detailPanelOverlay}>
      <div className={styles.detailPanel}>
        <button className={styles.closeButton} onClick={onClose}>
          <FaTimes />
        </button>
        <h2 className={styles.detailPanelTitle}>{listing.itemType === 'waste' ? 'Waste Listing' : 'Old Item for Sale/Donate'}</h2>

        {listing.imageUrl && (
          <div className={styles.detailPanelImageContainer}>
            <img src={listing.imageUrl} alt={listing.wasteType} className={styles.detailPanelImage} onError={(e) => { e.currentTarget.src = 'https://placehold.co/400x300/e0e0e0/555555?text=No+Image'; }} />
          </div>
        )}

        <div className={styles.detailSection}>
          <div className={styles.detailItem}>
            <FaTag className={styles.detailIcon} />
            <strong>Type:</strong> {listing.wasteType}
          </div>
          <div className={styles.detailItem}>
            <FaWeight className={styles.detailIcon} />
            <strong>Quantity:</strong> {listing.quantity} {listing.unit}
          </div>
          {listing.itemType === 'waste' && listing.wasteCategory && (
            <div className={styles.detailItem}>
              <FaTrash className={styles.detailIcon} />
              <strong>Category:</strong> {listing.wasteCategory.replace(/_/g, ' ').toUpperCase()}
            </div>
          )}
          {listing.price !== undefined && listing.itemType === 'old_item' && (
            <div className={styles.detailItem}>
              <FaMoneyBillWave className={styles.detailIcon} />
              <strong>Price:</strong> {listing.price === 0 ? 'Donation' : `₹${listing.price.toFixed(2)}`}
            </div>
          )}
          {listing.description && (
            <div className={styles.detailItem}>
              <FaPaperclip className={styles.detailIcon} />
              <strong>Description:</strong> {listing.description}
            </div>
          )}
          <div className={styles.detailItem}>
            <FaMapMarkerAlt className={styles.detailIcon} />
            <strong>Location:</strong> {listing.location.address || `Lat: ${listing.location.latitude.toFixed(4)}, Lng: ${listing.location.longitude.toFixed(4)}`}
          </div>
          <div className={styles.detailItem}>
            <FaCalendarAlt className={styles.detailIcon} />
            <strong>Listed On:</strong> {new Date(listing.createdAt).toLocaleDateString()}
          </div>
          <div className={styles.detailItem}>
            <FaUser className={styles.detailIcon} />
            <strong>Listed By:</strong> {getDisplayName(listing.userId)}
          </div>
          {listing.status !== 'pending' && (
            <div className={styles.detailItem}>
              <FaClipboardCheck className={styles.detailIcon} />
              <strong>Assigned To:</strong> {getCollectorName(listing.assignedCollectorId)}
            </div>
          )}
          <div className={styles.detailItem}>
            <strong>Status:</strong>
            <span className={`${styles.detailStatus} ${
              listing.status === 'pending' ? styles.statusPending :
              listing.status === 'assigned' ? styles.statusAssigned :
              styles.statusCompleted
            }`}>
              {listing.status.charAt(0).toUpperCase() + listing.status.slice(1)}
            </span>
          </div>
        </div>

        {/* Action Buttons (Conditional) */}
        <div className={styles.detailActions}>
          {isCollector && listing.status === 'pending' && listing.itemType === 'waste' && (
            <button
              onClick={() => currentUser && assignCollectorToListing(listing.id, currentUser.id)}
              className={styles.actionButtonAssign}
            >
              <FaClipboardCheck className={styles.buttonIcon} /> Assign to me
            </button>
          )}

          {isCollector && listing.status === 'assigned' && isAssignedToCurrentUser && (
            <button
              onClick={() => completeListing(listing.id)}
              className={styles.actionButtonComplete}
            >
              <FaCheckCircle className={styles.buttonIcon} /> Mark Complete
            </button>
          )}

          {/* Contact button for Old Items (if not your own listing) */}
          {listing.itemType === 'old_item' && currentUser && !isMyListing && (
            <button
              onClick={() => alert(`Contacting ${getDisplayName(listing.userId)} about ${listing.wasteType} (Price: ₹${listing.price || 'N/A'}). (Simulated: Replace with chat/email integration)`)}
              className={styles.actionButtonContactSeller}
            >
              <FaEnvelope className={styles.buttonIcon} /> Contact Seller
            </button>
          )}
        </div>

        {/* Comments Section */}
        <div className={styles.commentsSection}>
          <h3 className={styles.commentsTitle}>
            <FaCommentDots className={styles.commentsIcon} /> Comments ({listing.comments?.length || 0})
          </h3>
          <div className={styles.commentList}>
            {listing.comments && listing.comments.length > 0 ? (
              listing.comments.map(comment => (
                <div key={comment.id} className={styles.commentItem}>
                  <div className={styles.commentHeader}>
                    <strong>{comment.userName}</strong>
                    <span className={styles.commentTime}>
                      <FaClock /> {new Date(comment.createdAt).toLocaleTimeString()} {new Date(comment.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className={styles.commentText}>{comment.text}</p>
                </div>
              ))
            ) : (
              <p className={styles.noCommentsMessage}>No comments yet.</p>
            )}
          </div>
          {currentUser && (
            <div className={styles.addCommentForm}>
              <textarea
                className={styles.commentInput}
                placeholder="Add a comment..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                rows={2}
              ></textarea>
              <button
                className={styles.addCommentButton}
                onClick={handleAddComment}
                disabled={!commentText.trim()}
              >
                Add Comment
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}