import React, {useEffect, useState} from "react";
import { recipeService } from "../../../services/Posts/RecipeService";
import Core from "../../../ui/Core/core";
import {useParams} from "react-router-dom";
import {logData} from "../../../assets/logData/logData";
import styles from './RecipeInCousin.module.css'
import Post from "../../../component/Post/Post";

function RecipeInCousin() {

    const {slug} = useParams();
    const [recipes, setRecipes] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const data = await recipeService.getCousin(slug);
            setRecipes(data.recipes);
        }
        fetchData();
    }, [slug]);
    
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


export default RecipeInCousin