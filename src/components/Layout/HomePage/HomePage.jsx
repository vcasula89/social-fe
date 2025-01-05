import styles from './HomePage.module.css';
import Header from '../Header/Header';
import Navbar from './Navbar/Navbar';
import Feed from './Feed/Feed';


const HomePage = () => {
    return (
        <div>
            <Navbar />
            <h1>The Social Network</h1>
            <Feed />
            
        </div>
    );
};

export default HomePage;