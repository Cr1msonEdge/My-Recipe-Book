import React, { useEffect, useState } from "react";
import styles from './AdminPanel.module.css'
import Core from "../../ui/Core/core";
import {PacmanLoader} from "react-spinners";
import { authService } from "../../services/Authentication/AuthenticationService";
import NewModerate from "./NewModerate";
import PostModerate from "./PostModerate";


function AdminPanel() {
    const [posts, setPosts] = useState([]);
    const [loaded, setLoaded] = useState(false);
    const [news, setNews] = useState([]);


    useEffect( () => {
            const fetchData = async () => {
                const data = await authService.moderate();
                setPosts(data.filter((el) => (el.type === 'Recipe')));
                setNews(data.filter((el) => (el.type !== 'Recipe')));
                setLoaded(true);
            }
            fetchData()
    },[]);


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
            <div className={styles.Home}>
                {news.map((el) => (
                        <NewModerate el={el}>asdas</NewModerate>
                ))}
                {posts.map((el) => (
                    <PostModerate el={el} key={el.id}></PostModerate>
                ))}
                {((news.length === 0) && (posts.length === 0)) ? <span>Нечего отображать</span> : <br></br>}
            </div>
        </Core>
    )
}

export default AdminPanel