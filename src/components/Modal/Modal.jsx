import styles from "./Modal.module.css";

const Modal = ({isOpen, children, onClose, header}) => {
    if(!isOpen) return null;

    return (
        <div className={styles["modal-overlay"]} onClick={onClose}>
            <div className={styles["modal-container"]} onClick={(e) => e.stopPropagation()}>
                <div className={styles["modal-header"]}>
                    {header && <h2>{header}</h2>}
                    <button className={styles["modal-close-button"]} onClick={onClose}>X</button>
                </div>
                <div className={styles["modal-content"]}>
                    {children}
                </div>
            </div>
        </div>
    )
};

export default Modal;