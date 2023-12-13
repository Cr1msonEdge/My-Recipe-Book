import React, {useState, useEffect} from "react";
import { recipeService } from "../../services/Posts/RecipeService";
import Core from "../../ui/Core/core";
import styles from './Category.module.css'
import {logData} from "../../assets/logData/logData";
import {useNavigate} from "react-router-dom";
import PacmanLoader from "react-spinners/PacmanLoader";


function CategoryList() {
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);
    const [loaded, setLoaded] = useState(false);

    useEffect( () => {
            const fetchData = async () => {
                const data = await recipeService.getCategories();
                setCategories(data.filter(cat => cat.name !== 'Не выбрано'));
                setLoaded(true);
            }
            fetchData();
        }, [])

    function handler(slug) {
        navigate('/categories/' + slug);
    }
    if (!loaded) {
        return (
            <Core onChange={logData.temp}>
                <div className={styles.loaderdiv}>
                    <PacmanLoader size={50} color={'#5C5470'} className={styles.loader}></PacmanLoader>
                </div>
            </Core>
            )
    }

    return (
        <Core onChange={logData.temp}>
            <div className={styles.content}>
                {categories.map((el) => (
                    <button className={styles.btn} key={el.id} onClick={() => handler(el.slug)}>{el.name}</button>
                ))}
            </div>
        </Core>
    )
}


export default  CategoryList
