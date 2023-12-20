import React, {useEffect, useState} from "react";
import Core from "../../ui/Core/core";
import {useParams} from "react-router-dom";
import { recipeService } from "../../services/Posts/RecipeService";
import styles from "./UserRecipe.module.css";
import {PacmanLoader} from "react-spinners";
import { authService } from "../../services/Authentication/AuthenticationService";
import { useNavigate } from "react-router-dom";


function UserRecipe() {
    const navigate = useNavigate();
    const {id} = useParams();
    const [loaded, setLoaded] = useState(false);
    const [recipeData, setRecipeData] = useState({});

    useEffect(() => {
        const fetchData = async () => {
            const userData = await authService.isLoginned();
            if (userData.detail !== 'success') {
                navigate('/');
            }
            const data = await recipeService.getRecipe(id);

            setRecipeData(data);
            setLoaded(true);
        };
        fetchData();
        
    }, [id, navigate]);


    // handle buttons
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
                        <span className={styles.title}>{recipeData.status ? "Статус: выложено" : "Статус: на модерации"}</span>
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
                    </div>
                </div>
            </Core>
        )
    }
}

export default UserRecipe