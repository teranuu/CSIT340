import styles from './logout.modal.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle, faTimes } from '@fortawesome/free-solid-svg-icons';

function LogoutModal({ isOpen, onConfirm, onCancel, isLoading }) {
  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={onCancel}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        {/* Close button */}
        <button
          className={styles.closeBtn}
          onClick={onCancel}
          disabled={isLoading}
        >
          <FontAwesomeIcon icon={faTimes} />
        </button>

        {/* Icon */}
        <div className={styles.iconContainer}>
          <FontAwesomeIcon icon={faExclamationTriangle} />
        </div>

        {/* Title */}
        <h2 className={styles.title}>Confirm Logout</h2>

        {/* Message */}
        <p className={styles.message}>
          Are you sure you want to logout? You'll need to login again to access the admin dashboard.
        </p>

        {/* Buttons */}
        <div className={styles.buttonGroup}>
          <button
            className={styles.cancelBtn}
            onClick={onCancel}
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            className={styles.confirmBtn}
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? 'Logging out...' : 'Logout'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default LogoutModal;
