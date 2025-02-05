import Logo from "../../assets/logosocial.png";
import Input from "../Input/Input.jsx";
import {useNavigate} from "react-router";
import {isEmail} from "../../util/validation.js";
import {recoveryPassword} from "../../services/recoveryPassword.service.js";
import {useState} from "react";
import {useDispatch} from "react-redux";
import useInput from "../../hooks/useInput.js";
import Grid from "@mui/material/Grid2";
import styles from "../LoginFormComponent/LoginForm.module.css";


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
                <div className="card" style={{backgroundColor: "#00000018"}}>
                    <p style={{ color:"white"}}>{res.message}</p>
                </div>
            )}
            {res === null && (
                <div className="card">
                    <img src={Logo} className="logo" alt="logo"/>
                    <Grid container direction="column" spacing={1}>
                    <form onSubmit={submitHandler} className={styles.recoveryPasswordForm}>
                        <Input label="Email"
                               id="email"
                               type="text"
                               name="email"
                               value={emailValue}
                               onChange={handleEmailChange}
                               error={formInvalid.email && 'Digita una mail valida'}/>
                        <button className={styles.loginButton}>Richiedi reset</button>
                    </form>
                    </Grid>
                </div>
            )}

        </>

}
export default RecoveryPasswordPage;