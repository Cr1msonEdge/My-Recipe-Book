import React, { useState, useEffect } from "react";
import styles from './NewModerator.module.css'
import Core from "../../../ui/Core/core";
import { authService } from "../../../services/Authentication/AuthenticationService";
import { useNavigate } from "react-router-dom";
import * as yup from 'yup'


const shape = yup.object().shape({
    email: yup.string().email().required(),
});



function NewModerator() {
    const navigate = useNavigate();
    
    const [email, setEmail] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            const data = await authService.isLoginned();
            if (data.detail !== 'success' || !data.is_staff) {
                navigate('/');
            }
        }
        fetchData()
    }, []);



    async function handler() {
        const data = await authService.newModerator(email);
        alert(data);
        navigate('/profile');
    }

    return (
        <Core>
            <div className={styles.reg}>
                <span className={styles.sp}>Добавить модератора</span>
                <div className={styles.logFrm}>
                    <input className={styles.req} type="email" placeholder="Электронная почта" required
                    onChange={e => setEmail(e.target.value)}/>
                    <button type='button' className={styles.btn} onClick={handler}>Подтвердить</button>
                </div>
            </div>
        </Core>
    )
}


export default NewModerator
