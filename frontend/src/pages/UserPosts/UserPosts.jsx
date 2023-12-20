import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import styles from './UserPosts.module.css'
import Core from "../../ui/Core/core";
import {PacmanLoader} from "react-spinners";
import { recipeService } from "../../services/Posts/RecipeService";
import UserNew from "./UserNew";
import UserPost from "./UserPost";


function UserPosts() {
    const {id} = useParams();
    const [posts, setPosts] = useState([]);
    const [loaded, setLoaded] = useState(false);
    const [news, setNews] = useState([]);


    useEffect(() => {
            const fetchData = async () => {
                const data = await recipeService.userPosts(id);
                setPosts(data.filter((el) => (el.type === 'Recipe')));
                setNews(data.filter((el) => (el.type !== 'Recipe')));
                setLoaded(true);
            }
            fetchData()
    },[id]);


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
                <span className={styles.txt}>Если Ваш пост отсутствует на этой странице, то он НЕ прошёл проверку модерацией</span><br/>
                {news.map((el) => (
                        <UserNew el={el}></UserNew>
                ))}
                {posts.map((el) => (
                    <UserPost el={el} key={el.id}></UserPost>
                ))}
            </div>
        </Core>
    )
}

export default UserPosts