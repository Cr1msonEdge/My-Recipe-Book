import React, {useEffect, useState} from "react";
import styles from "./UserProfile.module.css"
import Core from "../../ui/Core/core";
import {authService} from "../../services/Authentication/AuthenticationService";
import {useNavigate, useParams} from "react-router-dom";
import { logData } from "../../assets/logData/logData";


function UserProfile() {
    const {id} = useParams();
    const navigate = useNavigate();
    const [userData, setUserData] = useState({});
    const [isLoginned, setIsLoginned] = useState(0);
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            const data = await authService.getUser(id);
            console.log(data);
            data.detail === 'success' ? setIsLoginned(1) : setIsLoginned(2);
            setUserData(data);
            setLoaded(true);
        }
        fetchData();
    }, [isLoginned]);
    
    // handlers
    function handleNewPost() {
        navigate('/addrecipe');
    }
    function handleNew() {
        navigate('/addnew');
    }
    function moderation() {
        navigate('/admin-menu');
    }
    function handleLogout() {
        const doLogout = async () => {
            const data = await authService.logout();
            if (data.data.message !== 'success') {
                alert('Ошибка!');
            }
        }
        doLogout();
        navigate('/about');
    }

    if (!loaded) {
        return (
            <Core onChange={logData.temp}>
                <div className={styles.loaderdiv}>
                </div>
            </Core>
        )
    }
    return (
        <Core onChange={logData.temp}>
            <div className={styles.Container}>
                <img className={styles.Img} src={userData.avatar} alt={"Изображение отсутствует"}></img>
                <div className={styles.UserData}>
                    <span>Имя пользователя: </span>{userData.name}<br/>
                    <span>Электронная почта: {userData.email}</span><br/>
                    <span>О себе: {userData.about}</span><br/>
                    <span>Ранг: {userData.rank}</span><br/>
                </div>
            </div>
        </Core>
    )

}


export default UserProfile
