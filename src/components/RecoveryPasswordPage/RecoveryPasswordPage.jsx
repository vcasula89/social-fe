import Logo from "../../assets/logo-tnv-academy.png";
import Input from "../Input/Input.jsx";
import styles from "../LoginFormComponent/LoginForm.module.css";
import {Link, useNavigate} from "react-router";
import {hasMinLength, isEmail} from "../../util/validation.js";
import {recoveryPassword} from "../../services/recoveryPassword.service.js";
import {setUser} from "../../reducers/user.slice.js";
import {useState} from "react";
import {useDispatch} from "react-redux";
import useInput from "../../hooks/useInput.js";


const RecoveryPasswordPage = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const {value: emailValue, handleChange: handleEmailChange} = useInput('');
    const [formInvalid, setFormInvalid] = useState({
        email: false,

    })
    const [res, setRes] = useState(null);
        const checkInvalidField = (identifier) => {
            setFormInvalid((prevValue) => {
                return {...prevValue, [identifier]: true}
            });
        }

        const submitHandler = async (event) => {
            event.preventDefault();
            setFormInvalid({email: false})

            const isEmailInvalid = !isEmail(emailValue);

            if (isEmailInvalid) {
                if (isEmailInvalid) {
                    checkInvalidField('email')
                }
                return;

            }
            try {
                const response = await recoveryPassword(emailValue);
                setRes(response);
            } catch (error) {
                console.error("Errore durante il recupero della password:", error);
                setRes(error);
            }

        }
        return <>
            {res !== null && (
                <div className="card">
                    <p>{res.message}</p>
                </div>
            )}
            {res === null && (
                <div className="card">
                    <img src={Logo} className="logo" alt="logo"/>

                    <form onSubmit={submitHandler}>
                        <Input label="Email"
                               id="email"
                               type="text"
                               name="email"
                               value={emailValue}
                               onChange={handleEmailChange}
                               error={formInvalid.email && 'Digita una mail valida'}/>

                        <button>Richiedi reset</button>
                    </form>
                </div>
            )}

        </>

}
export default RecoveryPasswordPage;