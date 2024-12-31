import { useState} from "react";
import styles from "./RegistrationForm.module.css";
import Logo from "../../assets/logo-tnv-academy.png"
import {Link, useNavigate} from "react-router";
import useInput from "../../hooks/useInput.js";
import {isEmail, hasMinLength, isNotEmpty, isEqualsToOtherValue} from "../../util/validation.js";
import Input from "../Input/Input.jsx";
import {register} from "../../services/registration.services.js";
import {FaArrowLeftLong} from "react-icons/fa6";

const RegistrationForm = () => {
    const navigate = useNavigate();
    const {value: nameValue, handleChange: handleNameChange} = useInput('');
    const {value: emailValue, handleChange: handleEmailChange} = useInput('');
    const {value: passwordValue, handleChange: handlePasswordChange} = useInput('');
    const {value: confirmPasswordValue, handleChange: handleConfirmPasswordChange} = useInput('');

    const [formInvalid, setFormInvalid] = useState({
        name: false,
        email: false,
        password: false,
        passwordDoNotMatch: false
    })


    const checkInvalidField = (identifier) => {
        setFormInvalid((prevValue) => {
            return {...prevValue, [identifier]: true}
        });
    }


    const submitHandler = async (event) => {
        event.preventDefault();
        setFormInvalid({name: false, email: false, password: false})

        const isEmailInvalid = !isEmail(emailValue);
        const isPasswordInvalid = !hasMinLength(passwordValue, 8);
        const isNameInvalid = !isNotEmpty(nameValue);
        const passwordsDoNotMatch = !isEqualsToOtherValue(passwordValue, confirmPasswordValue);
        if( isEmailInvalid || isPasswordInvalid || isNameInvalid || passwordsDoNotMatch) {
            if (isEmailInvalid) {
                checkInvalidField('email')
            }
            if (isPasswordInvalid) {
                checkInvalidField('password')
            }
            if (isNameInvalid) {
                checkInvalidField('name')
            }
            if (passwordsDoNotMatch) {
                checkInvalidField('passwordDoNotMatch')
            }
            return;
        }

        const payload = {
            displayName: nameValue,
            email: emailValue,
            password: passwordValue
        }

        register(payload).then(res => {
            console.log(res);
            navigate('/')
        }).catch(err => console.log(err));
    }

    return <div className="card">
        <img src={Logo} className="logo" alt="logo"/>
        <h2>Registrati</h2>
        <form onSubmit={submitHandler}>
            <Input label="Nome"
                   type="text"
                   id="name"
                   name="name"
                   value={nameValue}
                   onChange={handleNameChange}
                   error={formInvalid.name && 'Inserisci il tuo nome'}/>
            <Input label="Email"
                   type="text"
                   id="email"
                   name="email"
                   value={emailValue}
                   onChange={handleEmailChange}
                   error={formInvalid.email && 'Digita una mail valida'}/>
            <Input label="Password"
                   type="password"
                   id="password"
                   name="password"
                   value={passwordValue}
                   onChange={handlePasswordChange}
                   error={formInvalid.password && 'La password deve contenere almeno 8 caratteri'}/>
            <Input label="Conferma password"
                   type="password"
                   id="confirm-password"
                   name="confirm-password"
                   value={confirmPasswordValue}
                   onChange={handleConfirmPasswordChange}
                   error={formInvalid.passwordDoNotMatch && 'Le password devono corrispondere'}/>
            <button>Registrati</button>
        </form>
        <div className={styles.backToLogin}>
            <Link to={'/'}><FaArrowLeftLong /> Torna al Login</Link>
        </div>
    </div>
}

export default RegistrationForm