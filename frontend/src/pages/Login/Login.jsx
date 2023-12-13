import React, {useState} from "react";
import styles from "../Login/Login.module.css";
import Core from "../../ui/Core/core";
import {authService} from "../../services/Authentication/AuthenticationService";
import {useNavigate} from "react-router-dom";


function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');


    function handler() {
        let userdata = {
            'email': email,
            'password': password
        };
        let responseResult = '';
        const data = authService.login(userdata)
            .then(function (a) {
                if(a === 'Incorrect password') {
                    alert('Неверный пароль!');
                }
                else {
                    navigate('/');
                }
            })

    }


    return (
        <Core>
            <div className={styles.log}>
                <span className={styles.sp}>Авторизация</span>
                <div className={styles.frm}>
                    <input className={styles.req} type="email" placeholder="Электронная почта" required
                           onChange={e => setEmail(e.target.value)}/>
                    <input className={styles.req} type="password" placeholder="Пароль" required
                           onChange={e => setPassword(e.target.value)}/>
                    <button type='button' className={styles.btn} onClick={handler}>Подтвердить</button>
                </div>
            </div>
        </Core>
    )
}


export default Login
