import React, {useState, useEffect} from "react";
import Core from "../../../ui/Core/core";
import styles from './AdminMenu.module.css'
import {useNavigate} from "react-router-dom";
import PacmanLoader from "react-spinners/PacmanLoader";
import { authService } from "../../../services/Authentication/AuthenticationService";


function AdminMenu() {
    const navigate = useNavigate();
    const [cousins, setCousins] = useState([]);
    const [loaded, setLoaded] = useState(false);

    // const setLogHandle = (value) => {
    //     setLoginned(value);
    // }
    useEffect(() => {
        const fetchData = async () => {
            const data = await authService.isLoginned();
            if (data.detail !== 'success' || !data.is_staff) {
                navigate('/');
            }
            setLoaded(true);
        };
        fetchData();
    }, []);
    const buttons = [{name: 'Добавить модератора', nav: '/new-moderator'}, {name: 'Заблокировать пользователя', nav: '/ban'}, {name: 'Предложенные посты', nav: '/admin'}]

    function handler(nav) {
        navigate(nav);
    }

    if (!loaded) {
        return (
            <Core>
                <div className={styles.loaderdiv}>
                    <PacmanLoader size={50} color={'#5C5470'} className={styles.loader}></PacmanLoader>
                </div>
            </Core>
        )
    }
    return (
        <Core>
            <div className={styles.content}>
                {buttons.map((el) => (
                    <button className={styles.btn} key={el.id} onClick={() => handler(el.nav)}>{el.name}</button>
                ))}
            </div>
        </Core>
    )
}


export default AdminMenu
