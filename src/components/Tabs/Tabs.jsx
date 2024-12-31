import styles from './Tabs.module.css';
import {useState} from "react";

const Tabs = ({children}) => {
    const [activeTab, setActiveTab] = useState(0);

    const tabHeaders = [];
    const tabContents = []

    children.forEach((child, index) => {
        tabHeaders.push(
            <button
                key={index}
                className={`${styles['tab-button']} ${activeTab === index ? styles.active : ""}`}
                onClick={() => setActiveTab(index)}
            >
                {child.props.header}
            </button>
        );

        tabContents.push(child)
    });

    return <div className={styles['tabs-container']}>
        <div className={styles['tabs-header']}>{tabHeaders}</div>
        <div className={styles['tab-content']}>{tabContents[activeTab]}</div>
    </div>
}

const TabPanel = ({header, children}) => {

    return <div>{children}</div>
}

export {Tabs, TabPanel}