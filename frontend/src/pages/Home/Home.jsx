import React, { useEffect, useState } from "react";
import styles from './Home.module.css'
import Post from "../../component/Post/Post";
import Core from "../../ui/Core/core";
import {recipeService} from "../../services/Posts/RecipeService";
import {PacmanLoader} from "react-spinners";
import Select from "react-select"
import { Checkbox } from "@mui/material";
import { useNavigate } from "react-router-dom";


function Home() {
    const navigate = useNavigate();

    const [posts, setPosts] = useState([]);
    const [loaded, setLoaded] = useState(false);
    const [ingredients, setIngredients] = useState([]);
    const [ingredientsChosen, setIngredientsChosen] = useState([]);
    const [checked, setChecked] = useState(false);
    
    useEffect(() => {
            const fetchData = async () => {
                const data = await recipeService.getPosts();
                const ingr = await recipeService.getIngredients();
                setPosts(data);
                setIngredients(ingr);
                setLoaded(true);
            }
            fetchData()
    }, [loaded]);

    function handlePost(e) {
        navigate(`/post/${e.id}`);
    }
    function searchHandle() {
        const fetchRecipes = async () => {
            setLoaded(false);
            const recipes = await recipeService.getSearch(ingredientsChosen.map(el => el.id));
            setPosts(await recipes);
        }
        fetchRecipes();
        setLoaded(true);
    }
    function checkHandler(el) {
        setIngredientsChosen([]);
        setChecked(el.target.checked)
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
            <div className={styles.Home}>
                <div>
                    <div className={styles.search}>
                        {checked ? (<Select className={styles.slct} placeholder="Релевантный поиск" options={ingredients} getOptionLabel={o => o.name} getOptionValue={o => o.id} isMulti
                        onChange={setIngredientsChosen} key={checked}/>) : 
                        (<Select className={styles.slct} placeholder="Поиск по названию" options={posts} getOptionLabel={o => o.name} getOptionValue={o => o.id} key={checked}
                        onChange={(e) => handlePost(e)}/>)}
                        
                        <div className={styles.checkcontainer}>
                            <Checkbox checked={checked} onChange={(e) => checkHandler(e)} label={'Релевантный поиск'} className={styles.check}></Checkbox>
                            <span className={styles.sp}>Релевантный поиск</span>
                        </div>
                    </div>
                    {checked ? (<button className={styles.btn} onClick={searchHandle}>Подтвердить</button>) :
                    (<button className={styles.btnsearch}></button>)}
                </div>
                {posts.map((el) => (
                    <Post el={el} key={el.id}></Post>
                ))}
            </div>
        </Core>
    )
}

export default Home
