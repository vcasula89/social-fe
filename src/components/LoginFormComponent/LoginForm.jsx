import {useState} from "react";
import Logo from "../../assets/logo-tnv-academy.png"
import {Link, useNavigate} from "react-router";
import Input from "../Input/Input.jsx";
import useInput from "../../hooks/useInput.js";
import styles from "./LoginForm.module.css";
import {login} from "../../services/login.service.js";
import {hasMinLength, isEmail} from "../../util/validation.js";
import {useDispatch} from "react-redux";
import {setUser} from "../../reducers/user.slice.js";

const LoginForm = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const {value: emailValue, handleChange: handleEmailChange} = useInput('');
    const {value: passwordValue, handleChange: handlePasswordChange} = useInput('');
    const [formInvalid, setFormInvalid] = useState({
        email: false,
        password: false,
    })

    const checkInvalidField = (identifier) => {
        setFormInvalid((prevValue) => {
            return {...prevValue, [identifier]: true}
        });
    }

    const submitHandler = async (event) => {
        event.preventDefault();
        setFormInvalid({email: false, password: false})

        const isEmailInvalid = !isEmail(emailValue);
        const isPasswordInvalid = !hasMinLength(passwordValue, 8);
        if (isEmailInvalid || isPasswordInvalid) {
            if (isEmailInvalid) {
                checkInvalidField('email')
            }
            if (isPasswordInvalid) {
                checkInvalidField('password')
            }
            return;
        }

        const bodyForm = {
            email: emailValue,
            password: passwordValue,
        }

        const res = await login(bodyForm)
        if (res) {
            dispatch(setUser(res));
            navigate('/');
        }
    }


    return <div className="card">
        <img src={Logo} className="logo" alt="logo"/>
        <h2>Accedi</h2>
        <form onSubmit={submitHandler}>
            <Input label="Email"
                   id="email"
                   type="text"
                   name="email"
                   value={emailValue}
                   onChange={handleEmailChange}
                   error={formInvalid.email && 'Digita una mail valida'}/>

            <Input label="Password"
                   id="password"
                   type="password"
                   name="password"
                   value={passwordValue}
                   onChange={handlePasswordChange}
                   error={formInvalid.password && 'La password deve contenere almeno 8 caratteri'}/>
            <div className={styles.registrationLink}>
                <Link to={'/registration'}>Registrati</Link>
            </div>
                <div className={styles.resetPasswordLink}>
                    <Link to={'/recovery-password'}>Ho dimenticato la password</Link>
                </div>
                <button>Accedi</button>
        </form>
    </div>
}

export default LoginForm