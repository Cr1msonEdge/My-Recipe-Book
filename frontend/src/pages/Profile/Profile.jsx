import React, {useEffect, useState} from "react";
import styles from "./Profile.module.css"
import Core from "../../ui/Core/core";
import {authService} from "../../services/Authentication/AuthenticationService";
import {useNavigate} from "react-router-dom";
import PacmanLoader from "react-spinners/PacmanLoader";


function Profile() {
    const navigate = useNavigate();
    const [userData, setUserData] = useState({});
    const [isLoginned, setIsLoginned] = useState(0);
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            const data = await authService.isLoginned();
            console.log('userdata', data);
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
    function myPosts() {
        navigate(`/userpanel/${userData.id}`);
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
            <Core>
                <div className={styles.loaderdiv}>
                    <PacmanLoader size={50} color={'#5C5470'} className={styles.loader}></PacmanLoader>
                </div>
            </Core>
        )
    }
    else if (isLoginned === 2) {
        navigate('/register');
    }
    return (
        <Core>
            <div className={styles.Container}>
                <img className={styles.Img} src={userData.avatar} alt={"Изображение отсутствует"}></img>
                <div className={styles.UserData}>
                    <span>Имя пользователя: {userData.username}</span><br/>
                    <span>Электронная почта: {userData.email}</span><br/>
                    <span>О себе: {userData.about}</span><br/>
                    <span>Ранг: {userData.rank}</span><br/>
                    <span>Рецептов до следующего ранга: {userData.toNextRank}</span><br/>
                    {userData.is_banned ? <span>Вы заблокированы. <br/>Причина блокировки: {userData.ban_name} <br/> Подробнее: {userData.ban_info}</span> : <span></span>}
                </div>
            </div>
            <div className={styles.cnt}>
                {!userData.is_banned? (<button className={styles.btn} onClick={handleNewPost}>Добавить рецепт </button>) : <div></div>}
                {!userData.is_banned? (<button className={styles.btn} onClick={handleNew}>Добавить новое </button>) : <div></div>}
                {userData.is_staff ? (<button className={styles.btn} onClick={moderation}>Модерация</button>) : <div></div>}
                <button className={styles.btn} onClick={myPosts}>Мои посты</button>
                <button className={styles.btn} onClick={handleLogout}> Выйти </button>
            </div>
        </Core>
    )

}


export default Profile
