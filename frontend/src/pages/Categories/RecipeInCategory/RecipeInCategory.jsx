import React, {useEffect, useState} from "react";
import { recipeService } from "../../../services/Posts/RecipeService";
import Core from "../../../ui/Core/core";
import {useParams} from "react-router-dom";
import {logData} from "../../../assets/logData/logData";
import styles from './RecipeInCategory.module.css'
import Post from "../../../component/Post/Post";

function RecipeInCategory() {

    const {slug} = useParams();
    const [recipes, setRecipes] = useState([]);
    useEffect(() => {
        const fetchData = async () => {
            const data = await recipeService.getCategory(slug);
            setRecipes(data.recipes);
        }
        fetchData();
    }, [slug]);

    console.log('recipe in category = ', recipes);
    return (
        <Core onChange={logData.temp}>
            <div className={styles.Home}>
                {recipes.map((el) => (
                    <Post el={el} key={el.id}></Post>
                ))}
            </div>
        </Core>
    )
}


export default RecipeInCategory