import React, {useEffect, useState} from "react";
import Core from "../../ui/Core/core";
import {useNavigate, useParams} from "react-router-dom";
import { recipeService } from "../../services/Posts/RecipeService";
import styles from "./Recipe.module.css";
import {PacmanLoader} from "react-spinners";
import { Rating } from "@mui/material";
import { authService } from "../../services/Authentication/AuthenticationService";


function Recipe() {
    const navigate = useNavigate();
    const {id} = useParams();
    const [loaded, setLoaded] = useState(false);
    const [recipeData, setRecipeData] = useState({});
    const [loginned, setLoginned] = useState(false);
    const [stars, setStars] = useState(null);
    const [userData, setUserData] = useState({});

    const setLogHandle = (value) => {
        setLoginned(value);
    }

    useEffect(() => {
        const fetchData = async () => {
            const data = await recipeService.getRecipe(id);
            const userData = await authService.isLoginned();
            setUserData(userData);
            setLoginned(userData.detail === 'success');
            if (userData.detail === 'success') {
                const stars = await recipeService.getRating(userData.id, id);
                setStars(stars.star);
            }
            setRecipeData(data);
            setLoaded(true);
        };
        fetchData();
        
    }, [id, stars]);
    
    function ratingHandle(value) {
        const fetchRating = async () => {
            const data = await recipeService.patchRating(value, userData.id, id);
            setStars(data.star);
        }
        fetchRating();
    }
    function userProfileHandle() {
        navigate(`/user/${recipeData.author.id}`);
    }
    if (!loaded) {
        return (
            <Core onChange={setLogHandle}>
                <PacmanLoader size={100} color={'#5C5470'} className={styles.loader}></PacmanLoader>
            </Core>
        )
    }
    else {      
        return (
            <Core onChange={setLogHandle}>
                <div className={styles.outCont}>
                    <div className={styles.cont}>
                        <span className={styles.title}>{recipeData.name}</span>
                        <div className={styles.nt}>
                            <img className={styles.img} src={recipeData.image} alt={'Изображение не найдено'}></img>
                            <div className={styles.txt}>
                                <span className={styles.subtitle}>Краткое описание:</span>
                                <span className={styles.desc}>{recipeData.short_description}</span>
                                <span className={styles.subtitle}>Инструкция:</span>
                                <span className={styles.desc}>{recipeData.instruction}</span>
                                <span className={styles.subtitle}>Состав</span>
                                <table className={styles.table}>
                                    <thead>
                                    <tr>
                                        <td>Ингредиент</td>
                                        <td>Количество</td>
                                        <td>Единица измерения</td>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {recipeData.ingredients.map((el) => (
                                        <tr className={styles.tabletr}>
                                            <td>{el.ingredient}</td>
                                            <td>{el.value}</td>
                                            <td>{el.measure}</td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                                <div onClick={userProfileHandle} className={styles.author}>Автор рецепта: {recipeData.author.username}</div>
                                {userData.is_banned? (
                                <div>
                                    <span>Оценка рецепта</span> <br/>
                                    <Rating value={recipeData.rating} precision={0.5} readOnly/><br/>
                                    <span>Вы не имеете права оценивать рецепты.</span>
                                </div>) :
                                loginned ? 
                                (<div>
                                    <span>Оценка рецепта: {recipeData.rating}</span> <br/>
                                        <Rating value={recipeData.rating} precision={0.5} readOnly/>
                                        <br/>
                                    <span>Ваша оценка:</span> <br/>
                                        <Rating value={stars} onChange={(e) => {ratingHandle(e.target.value)}}/>
                                </div>) : 
                                (<div>
                                    <span>Оценка рецепта</span> <br/>
                                    <Rating value={recipeData.rating} precision={0.5} readOnly/><br/>
                                    <span>Для выставления оценки необходимо зайти в аккаунт</span>
                                </div>)
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </Core>
        )
    }
}

export default Recipe