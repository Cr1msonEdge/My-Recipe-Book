import React, {useEffect, useState} from "react";
import Core from "../../ui/Core/core";
import Select from "react-select";
import styles from "./AddSomethingNew.module.css";
import {recipeService} from "../../services/Posts/RecipeService";
import {useNavigate} from "react-router-dom";


const style = {
    control: base => ({
        ...base,
        border: 0,
        boxShadow: 'none',
    })
};

const options = [
    {label: 'Категория', value: 'category'},
    {label: 'Кухня', value: 'cousin'},
    {label: 'Ингредиент', value: 'ingredient'},
];

function AddSomethingNew() {
    const navigate = useNavigate();

    const [measures, setMeasures] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const data = await recipeService.getMeasures();
            setMeasures(data);
        }
        fetchData();
    }, [])


    console.log('ms = ', measures);

    const [option, setOption] = useState({});
    const [itemName, setItemName] = useState('');
    const [itemSlug, setItemSlug] = useState('');
    const [ingrMeasure, setIngrMeasure] = useState(0);
    function handler() {
        const postData = async () => {
            switch (option.value) {
                case 'ingredient':
                    const ingr = {
                        measure: ingrMeasure.id,
                        name: itemName,
                        slug: itemSlug,
                    }
                    const data1 = await recipeService.postIngredient(ingr);
                    if (data1.message.includes('error')) {
                        alert(data1.message);
                        navigate('/addnew');
                    }
                    else {
                        alert('Будет выложено после модерации!');
                    }
                    break;
                case 'category':
                    const cat = {
                        name: itemName,
                        slug: itemSlug,
                    }
                    const data2 = await recipeService.postCategory(cat);
                    if (data2.message.includes('error')) {
                        alert(data2.message);
                        navigate('/addnew');
                    }
                    alert('Будет выложено после модерации!');
                    break;
                case 'cousin':
                    const cous = {
                        name: itemName,
                        slug: itemSlug,
                    }
                    const data3 = await recipeService.postCousin(cous);
                    if (data3.message.includes('error')) {
                        alert(data3.message);
                        navigate('/addnew');
                    }
                    alert('Будет выложено после модерации!');
                    break;
                default:
                    break;
            }
        }
        postData();
        navigate('/profile');
    }

    return (
        <Core>
            <div className={styles.outCont}>
                <div className={styles.cont}>
                    <span className={styles.title}>Добавить что-то новое</span>
                    <div className={styles.nt}>
                        <Select styles={style} className={styles.slct} options={options} onChange={setOption} placeholder={"Сущность"}></Select>
                        <input onChange={(e) => setItemName(e.target.value)}
                        placeholder={"Название"} className={styles.inp}></input>
                        <input onChange={(e) => setItemSlug(e.target.value)}
                               placeholder={"Уникальный идентификатор"} className={styles.inp}></input>
                        {option.value === 'ingredient' ?
                            <Select styles={style} className={styles.slct} options={measures} getOptionLabel={(options) => (options.name)}
                            getOptionValue={(option) => (option.id)} onChange={setIngrMeasure} placeholder={"Единица измерения"}></Select> : <span></span>
                        }
                        <button type='button' className={styles.btn} onClick={handler}>Подтвердить</button>
                    </div>
                </div>
            </div>
        </Core>
    )
}

export default AddSomethingNew