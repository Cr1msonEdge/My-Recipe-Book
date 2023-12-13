import React, {useEffect, useState} from "react";
import Core from "../../ui/Core/core";
import {useParams} from "react-router-dom";
import { recipeService } from "../../services/Posts/RecipeService";
import styles from "./RecipeModerate.module.css";
import {PacmanLoader} from "react-spinners";
import { authService } from "../../services/Authentication/AuthenticationService";
import { useNavigate } from "react-router-dom";


function RecipeModerate() {
    const navigate = useNavigate();
    const {id} = useParams();
    const [loaded, setLoaded] = useState(false);
    const [recipeData, setRecipeData] = useState({});

    useEffect(() => {
        const fetchData = async () => {
            const data = await recipeService.getRecipe(id);
            const userData = await authService.isLoginned();
            if (userData.detail !== 'success') {
                navigate('/');
            }

            setRecipeData(data);
            setLoaded(true);
        };
        fetchData();
        
    }, [id]);


    // handle buttons
    function acceptHandle() {
        const fetchData = async () => { 
            const data = await authService.patchRecipe({id: id, data: {is_published: true}});
            console.log('accepted', data);
        }
        fetchData();
        navigate('/profile');
    }
    function deleteHandle() {
        const fetchData = async () => { 
            const data = await authService.deleteRecipe({id: id});
            console.log('deleted', data);
        }
        fetchData();
        navigate('/profile');
    }
    function userProfileHandle() {
        navigate(`/user/${recipeData.author.id}`);
    }
    if (!loaded) {
        return (
            <Core>
                <PacmanLoader size={100} color={'#5C5470'} className={styles.loader}></PacmanLoader>
            </Core>
        )
    }
    else {      
        return (
            <Core>
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
                            </div>
                        </div>
                        <div onClick={userProfileHandle} className={styles.author}>Автор рецепта: {recipeData.author.username}</div>
                        <button className={styles.btn} onClick={acceptHandle}>Принять</button>
                        <button className={styles.btn} onClick={deleteHandle}>Удалить</button>
                    </div>
                </div>
            </Core>
        )
    }
}

export default RecipeModerate