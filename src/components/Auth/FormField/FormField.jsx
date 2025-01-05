import styles from "./FormField.module.css";

const FormField = ({label, id, error, children}) => {
    return (
        <div className={styles.field}>
            <label htmlFor={id}>{label}</label>
            {children}
            {error && <p className={styles.error}>{error}</p>}
        </div>
    )
}

export default FormField;