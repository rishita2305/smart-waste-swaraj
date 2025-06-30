// src/components/map/MapList.tsx

import React, { useState, useEffect, useCallback } from 'react';
import { WasteListing, User, WasteStatus, Comment, ContactInfo } from '../../types';
import styles from './waste-map.module.css';
import {
  FaTimes,
  FaMapMarkerAlt,
  FaRulerCombined,
  FaTag,
  FaInfoCircle,
  FaClock,
  FaUser,
  FaPhone,
  FaEnvelope,
  FaComment,
  FaCalendarAlt,
  FaCheckCircle,
  FaTruck,
  FaPencilAlt
} from 'react-icons/fa';
import { formatDistanceToNow, parseISO, isValid } from 'date-fns'; // Import `isValid`

interface ListingDetailPanelProps {
  listing: WasteListing | null;
  currentUser: User | null;
  users: User[] | null;
  onClose: () => void;
  onUpdateListingStatus: (
    listingId: string,
    newStatus: WasteStatus,
    collectorId?: string | null,
    commentText?: string
  ) => Promise<void>;
}

const ListingDetailPanel: React.FC<ListingDetailPanelProps> = ({
  listing,
  currentUser,
  users,
  onClose,
  onUpdateListingStatus,
}) => {
  // --- ALL HOOKS MUST BE DECLARED AT THE TOP LEVEL, UNCONDITIONALLY ---
  const [commentText, setCommentText] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [showCommentInput, setShowCommentInput] = useState(false);

  useEffect(() => {
    if (listing) {
      setCommentText('');
      setShowCommentInput(false);
    }
  }, [listing]);

  // --- Move all useCallback hooks ABOVE the conditional return ---
  const handleAssignToMe = useCallback(async () => {
    if (!currentUser || !listing) return;

    const confirmAssign = window.confirm("Are you sure you want to pick up/assign this item to yourself?");
    if (confirmAssign) {
      try {
        await onUpdateListingStatus(
          listing.id,
          'assigned',
          currentUser.id,
          `Listing assigned to ${currentUser.displayName || currentUser.email || currentUser.name || 'a collector'}.`
        );
      } catch (error) {
        console.error("Failed to assign listing:", error);
        alert("Failed to assign listing. Please try again.");
      }
    }
  }, [currentUser, listing, onUpdateListingStatus]);

  const handleMarkAsCompleted = useCallback(async () => {
    if (!listing) return;

    const confirmComplete = window.confirm("Are you sure you want to mark this item as 'completed'? This action cannot be undone.");
    if (confirmComplete) {
      try {
        await onUpdateListingStatus(
          listing.id,
          'completed',
          null, // Clear assigned collector on completion (design choice)
          `Listing marked as completed by ${currentUser?.displayName || currentUser?.email || currentUser?.name || 'the system'}.`
        );
      } catch (error) {
        console.error("Failed to mark as completed:", error);
        alert("Failed to mark as completed. Please try again.");
      }
    }
  }, [listing, currentUser, onUpdateListingStatus]);

  const handleAddComment = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!listing || !commentText.trim()) return;

    setIsSubmittingComment(true);
    try {
      await onUpdateListingStatus(
        listing.id,
        listing.status,
        listing.assignedCollectorId,
        commentText
      );
      setCommentText('');
      setShowCommentInput(false);
    } catch (error) {
      console.error("Failed to add comment:", error);
      alert("Failed to add comment. Please try again.");
    } finally {
      setIsSubmittingComment(false);
    }
  }, [listing, commentText, onUpdateListingStatus]);


  // --- CONDITIONAL RETURN AFTER ALL HOOKS ---
  if (!listing) return null;

  // Find the assigned collector's display name for display purposes
  // This derivation logic can stay here as it doesn't involve Hooks
  const assignedCollector = listing.assignedCollectorId
    ? users?.find(user => user.id === listing.assignedCollectorId)
    : null;

  // Logic to determine if "Pick Up/Assign" button should be shown
  const canAssign =
    currentUser?.userType === 'collector' &&
    listing.status === 'pending';

  // Logic to determine if "Mark as Completed" button should be shown
  const canComplete =
    currentUser?.userType === 'collector' &&
    listing.status === 'assigned' &&
    listing.assignedCollectorId === currentUser.id;

  // Show contact button if listing has contact info and it's not the current user's listing
  const showContactLister = listing.contactInfo && currentUser?.id !== listing.userId;

  // --- Helper function to safely format dates ---
  const safeFormatDistanceToNow = (dateString: string) => {
    const date = parseISO(dateString);
    return isValid(date) ? formatDistanceToNow(date) : 'unknown time';
  };

  return (
    <div className={styles.detailPanelOverlay}>
      <div className={styles.detailPanel}>
        <button className={styles.closeButton} onClick={onClose}>
          <FaTimes />
        </button>

        <h2 className={styles.detailPanelTitle}>{listing.wasteType}</h2>

        {listing.imageUrl && (
          <div className={styles.detailPanelImageContainer}>
            <img src={listing.imageUrl} alt={listing.wasteType} className={styles.detailPanelImage} />
          </div>
        )}

        <div className={styles.detailSection}>
          <div className={styles.detailItem}>
            <FaInfoCircle className={styles.detailIcon} />
            <strong>Description:</strong> <span>{listing.description || 'N/A'}</span>
          </div>
          <div className={styles.detailItem}>
            <FaMapMarkerAlt className={styles.detailIcon} />
            <strong>Location:</strong> <span>{listing.location.address || listing.location.city || 'Unknown'}</span>
          </div>
          <div className={styles.detailItem}>
            <FaRulerCombined className={styles.detailIcon} />
            <strong>Quantity:</strong> <span>{listing.quantity} {listing.unit || ''}</span>
          </div>
          {listing.itemType === 'old_item' && listing.price !== undefined && (
            <div className={styles.detailItem}>
              <FaTag className={styles.detailIcon} />
              <strong>Price:</strong> <span>₹{listing.price}</span>
            </div>
          )}
          <div className={styles.detailItem}>
            <FaClock className={styles.detailIcon} />
            <strong>Listed:</strong> <span>{safeFormatDistanceToNow(listing.createdAt)} ago</span>
          </div>
          <div className={styles.detailItem}>
            <FaClock className={styles.detailIcon} />
            <strong>Status:</strong>
            <span className={`${styles.detailStatus} ${styles[`status${listing.status.charAt(0).toUpperCase() + listing.status.slice(1)}`]}`}>
              {listing.status}
            </span>
          </div>
          {listing.assignedCollectorId && (
            <div className={styles.detailItem}>
              <FaTruck className={styles.detailIcon} />
              <strong>Assigned To:</strong> <span>{assignedCollector?.displayName || assignedCollector?.name || assignedCollector?.email || 'Unknown Collector'}</span>
            </div>
          )}
        </div>

        <div className={styles.commentsSection}>
          <h3 className={styles.commentsTitle} onClick={() => setShowCommentInput(prev => !prev)}>
            <FaComment className={styles.commentsIcon} /> Comments ({listing.comments?.length || 0})
            <FaPencilAlt style={{ marginLeft: '10px', fontSize: '0.8em', cursor: 'pointer' }} />
          </h3>
          <div className={styles.commentList}>
            {listing.comments && listing.comments.length > 0 ? (
              // Filter and sort comments for display
              [...listing.comments]
                .filter(comment => {
                  const commentDate = parseISO(comment.createdAt);
                  return isValid(commentDate); // Only process valid dates
                })
                .sort((a, b) => parseISO(b.createdAt).getTime() - parseISO(a.createdAt).getTime())
                .map((comment) => (
                  <div key={comment.id} className={styles.commentItem}>
                    <div className={styles.commentHeader}>
                      <strong>{comment.userName}</strong>
                      <span className={styles.commentTime}>
                        <FaCalendarAlt /> {safeFormatDistanceToNow(comment.createdAt)} ago
                      </span>
                    </div>
                    <p className={styles.commentText}>{comment.text}</p>
                  </div>
                ))
            ) : (
              <p className={styles.noCommentsMessage}>No comments yet.</p>
            )}
          </div>
          {showCommentInput && (
            <form onSubmit={handleAddComment} className={styles.addCommentForm}>
              <textarea
                className={styles.commentInput}
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Add a comment..."
                rows={3}
                disabled={isSubmittingComment}
              ></textarea>
              <button
                type="submit"
                className={styles.addCommentButton}
                disabled={!commentText.trim() || isSubmittingComment}
              >
                {isSubmittingComment ? 'Adding...' : 'Add Comment'}
              </button>
            </form>
          )}
        </div>

        <div className={styles.detailActions}>
          {canAssign && (
            <button
              className={styles.actionButtonAssign}
              onClick={handleAssignToMe}
              disabled={!currentUser}
            >
              <FaTruck /> Pick Up / Assign to Me
            </button>
          )}

          {canComplete && (
            <button
              className={styles.actionButtonComplete}
              onClick={handleMarkAsCompleted}
              disabled={!currentUser}
            >
              <FaCheckCircle /> Mark as Completed
            </button>
          )}

          {showContactLister && (
            <button
              className={styles.actionButtonContactSeller}
              onClick={() => {
                if (listing.contactInfo?.phone) {
                  window.open(`tel:${listing.contactInfo.phone}`);
                } else if (listing.contactInfo?.email) {
                  window.open(`mailto:${listing.contactInfo.email}`);
                } else {
                  alert("No contact information available.");
                }
              }}
            >
              <FaUser /> Contact Lister
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ListingDetailPanel;