import Logo from "../../assets/logo-tnv-academy.png";
import Input from "../Input/Input.jsx";
import styles from "../LoginFormComponent/LoginForm.module.css";
import {Link} from "react-router";
import {hasMinLength, isEmail} from "../../util/validation.js";
import {login} from "../../services/login.service.js";
import {setUser} from "../../reducers/user.slice.js";

const emailValue = "";
const submitHandler = async (event) => {
    event.preventDefault();

    const payload = {
        email: emailValue,

    }


}

const RecoveryPasswordPage = () =>{
    return <div className="card">
        <img src={Logo} className="logo" alt="logo"/>

        <form onSubmit={submitHandler}>
            <Input label="Email"
                   id="email"
                   type="text"
                   name="email"
                   />


            <button>Richiedi reset</button>
        </form>
    </div>
}
export default RecoveryPasswordPage;