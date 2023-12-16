import React, { useState, useEffect } from "react";
import styles from './Register.module.css'
import Core from "../../ui/Core/core";
import { authService } from "../../services/Authentication/AuthenticationService";
import { useNavigate } from "react-router-dom";
import * as yup from 'yup'


const shape = yup.object().shape({
    email: yup.string().email().required(),
    password: yup.string().min(8).required(),
    username: yup.string().required(),
    about: yup.string()
});



function Register() {
    const navigate = useNavigate();
    const [isLoginned, setIsLoginned] = useState(false);
    useEffect(() => {
        const fetchData = async () => {
            const data = await authService.isLoginned();
            const a = data.detail !== 'Unauthenticated';
            setIsLoginned(a);
        }
        fetchData()
    }, []);

    if (isLoginned) {
        navigate('/Profile');
    }

    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [about, setAbout] = useState('');
    const [logEmail, setLogEmail] = useState('');
    const [logPassword, setLogPassword] = useState('');

    function toLogin() {
        let userdataLog = {
            'email': logEmail,
            'password': logPassword
        }
        const fetchData = async () => {
            const data = await authService.login(userdataLog);
            if (data.detail === 'Incorrect password') {
                alert("Проверьте правильность пароля!");
            }
            else if (data.detail === 'User not found') {
                alert("Пользователь не найден");
            }
            else {
                navigate('/profile');
            }
        }
        fetchData();
        //navigate('/login');
    }

    async function handler() {
        const userdata = {
            username: username,
            email: email,
            password: password,
            about: about,
            is_banned: false,
            is_staff: false,
            rank: 1
        };
        const isValid = await shape.isValid(userdata);
        if (!isValid) {
            alert('Заполните логин, почту, пароль (не менее 8 символов)')
        }
        else {
            const data = await authService.register(userdata);
            if (data === 'Success') {
                alert('Регистрация успешна!');
                navigate('/');
            }
            else {
                alert("Пользователь уже существует");        
            }    
        }
    }

    return (
        <Core>
            <div className={styles.reg}>
                <span className={styles.sp}>Регистрация</span>
                <div className={styles.frm}>
                    <input className={styles.req} type="username" placeholder="Имя пользователя" required
                    onChange={e => setUsername(e.target.value)}/>
                    <input className={styles.req} type="email" placeholder="Электронная почта" required
                    onChange={e => setEmail(e.target.value)}/>
                    <input className={styles.req} type="password" placeholder="Пароль" required
                    onChange={e => setPassword(e.target.value)}/>
                    <textarea className={styles.abt} placeholder="О себе" rows={10}
                    onChange={e => setAbout(e.target.value)}/>
                    <button type='button' className={styles.btn} onClick={handler}>Подтвердить</button>
                </div>
                <span className={styles.sp}>Уже зарегистрированы?</span>
                <div className={styles.logFrm}>
                    <input className={styles.logReq} type="email" placeholder="Электронная почта" required
                    onChange={e => setLogEmail(e.target.value)}/>
                    <input className={styles.logReq} type="password" placeholder="Пароль" required
                           onChange={e => setLogPassword(e.target.value)}/>
                    <button type='button' className={styles.logBtn} onClick={toLogin}>Вход</button>
                </div>
            </div>
        </Core>
    )
}


export default Register
