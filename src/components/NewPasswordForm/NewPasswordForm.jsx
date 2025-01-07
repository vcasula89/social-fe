import Logo from "../../assets/logo-tnv-academy.png";
import Input from "../Input/Input.jsx";
import {useParams} from "react-router";
import {hasMinLength, isAlphaNum,isEqualsToOtherValue} from "../../util/validation.js";
import {useState} from "react";
import useInput from "../../hooks/useInput.js";

import {isValidToken, newPassword} from "../../services/newPassword.service.js";


const NewPasswordForm = () => {
    const {value: passwordValue, handleChange: handlePasswordChange} = useInput('');
    const {value: confermaPasswordValue, handleChange: handleconfermaPasswordChange} = useInput('');
    const [formInvalid, setFormInvalid] = useState({
        password: false,
        confermaPassword: false,
    })
    const {token} = useParams();
    const [res, setRes] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const checkInvalidField = (identifier) => {
        setFormInvalid((prevValue) => {
            return {...prevValue, [identifier]: true}
        });
    }
    isValidToken(token)
       .then(responseData => {
            setShowForm(responseData.isValid);
        })
       .catch(error => {
           setShowForm(false);
       })


    const submitHandler = async (event) => {
        event.preventDefault();
        setFormInvalid({password: false, confermaPassword: false})


        const isPasswordInvalidLength = !hasMinLength(passwordValue, 8);
        const isPasswordInvalidAlphaNum = !isAlphaNum(passwordValue);
        if (isPasswordInvalidLength || isPasswordInvalidAlphaNum) {
            checkInvalidField('password')

            return;
        }

        const isPasswordEqualTo = !isEqualsToOtherValue(passwordValue, confermaPasswordValue);
        if (isPasswordEqualTo) {
            checkInvalidField('confermaPassword')

            return;
        }

        const bodyForm = {
            token: token,
            password: passwordValue,
        }

        try {
            const response = await newPassword(bodyForm);
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
        {res === null && showForm === true && (
                <div className="card">
                    <img src={Logo} className="logo" alt="logo"/>
                    <h2>Nuova password</h2>
                    <form onSubmit={submitHandler}>
                        <Input label="Password"
                               id="password"
                               type="password"
                               name="password"
                               value={passwordValue}
                               onChange={handlePasswordChange}
                               error={formInvalid.password && 'La password dev\'essere alfanumerica, deve contenere almeno 8 caratteri, una lettera minuscola e una lettera maiuscola' }/>

                        <Input label="Conferma Password"
                               id="password"
                               type="password"
                               name="confermaPassword"
                               value={confermaPasswordValue}
                               onChange={handleconfermaPasswordChange}
                               error={formInvalid.confermaPassword && 'Le password inserite devono corrispondere'}/>
                        <button>Conferma</button>
                    </form>
                </div>
        )}
        {res === null && showForm === false && (
            <div className="card">
                <p>Token non valido, procedere nuovamente alla richiesta di ripristino </p><br/>
                <a href="/recovery-password"> Ho dimenticato la mia password</a>
            </div>
        )}
    </>
}

export default NewPasswordForm