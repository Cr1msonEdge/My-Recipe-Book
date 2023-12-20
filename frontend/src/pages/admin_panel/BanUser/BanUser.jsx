import React, { useState, useEffect } from "react";
import styles from './BanUser.module.css'
import Core from "../../../ui/Core/core";
import { authService } from "../../../services/Authentication/AuthenticationService";
import { useNavigate } from "react-router-dom";
import * as yup from 'yup'


const shape = yup.object().shape({
    email: yup.string().email().required(),
    name: yup.string().required(),
    text: yup.string().required()
});



function BanUser() {
    const navigate = useNavigate();
    
    const [email, setEmail] = useState('');
    const [banShort, setBanShort] = useState('');
    const [banFull, setBanFull] = useState('');
    useEffect(() => {
        const fetchData = async () => {
            const data = await authService.isLoginned();
            if (data.detail !== 'success' || !data.is_staff) {
                navigate('/');
            }
        }
        fetchData()
    }, [navigate]);



    async function handler() {
        const banData = {email: email, name: banShort, text: banFull};
        console.log('bandata', banData);
        const isValid = await shape.isValid(banData);
        if (!isValid) {
            alert('Заполните поля!');
        }
        else {
            const data = await authService.banUser(banData);
            alert(data);
            navigate('/profile');
        }
    }

    return (
        <Core>
            <div className={styles.reg}>
                <span className={styles.sp}>Заблокировать пользователя</span>
                <div className={styles.logFrm}>
                    <input className={styles.req} type="email" placeholder="Электронная почта" required
                    onChange={e => setEmail(e.target.value)}/>
                    <input className={styles.req} placeholder="Причина блокировки:" required
                    onChange={e => setBanShort(e.target.value)}/>
                    <textarea className={styles.reqtext}  placeholder="Подробная причина блокировки:" required
                    onChange={e => setBanFull(e.target.value)} rows={3}/>
                    <button type='button' className={styles.btn} onClick={handler}>Подтвердить</button>
                </div>
            </div>
        </Core>
    )
}


export default BanUser
