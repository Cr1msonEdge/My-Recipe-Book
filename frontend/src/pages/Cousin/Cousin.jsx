import React, {useState, useEffect} from "react";
import { recipeService } from "../../services/Posts/RecipeService";
import Core from "../../ui/Core/core";
import styles from './Cousin.module.css'
import {useNavigate} from "react-router-dom";
import PacmanLoader from "react-spinners/PacmanLoader";


function CousinList() {
    const navigate = useNavigate();
    const [cousins, setCousins] = useState([]);
    const [loaded, setLoaded] = useState(false);

    // const setLogHandle = (value) => {
    //     setLoginned(value);
    // }

    useEffect( () => {
        const fetchData = async () => {
            const data = await recipeService.getCousins();
            setCousins(data.filter(cous => cous.name !== 'Не выбрано'));
            setLoaded(true);
        }
        fetchData();
    }, [])

    function handler(cat) {
        navigate('/cousins/' + cat);
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
            <div className={styles.content}>
                {cousins.map((el) => (
                    <button className={styles.btn} key={el.id} onClick={() => handler(el.slug)}>{el.name}</button>
                ))}
            </div>
        </Core>
    )
}


export default CousinList
