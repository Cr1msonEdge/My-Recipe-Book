import React, { useState, useEffect } from "react";
import styles from './AddRecipe.module.css'
import Core from "../../ui/Core/core";
import Select from "react-select";
import {recipeService} from "../../services/Posts/RecipeService";
import makeAnimated from 'react-select/animated';
import PacmanLoader from "react-spinners/PacmanLoader";
import { authService } from "../../services/Authentication/AuthenticationService";
import { useNavigate } from "react-router-dom";


const style = {
    control: base => ({
        ...base,
        border: 0,
        boxShadow: 'none',
    })
};


function AddRecipe() {
    const navigate = useNavigate();
    const [userData, setUserData] = useState(false);

    const animatedComponents = makeAnimated();

    const [recipeName, setRecipeName] = useState('');
    const [recipeShortDescription, setRecipeShortDescription] = useState('');
    const [recipeFullDescription, setRecipeFullDescription] = useState('');
    const [recipeDifficulty, setRecipeDifficulty] = useState('');
    const [recipeCousin, setRecipeCousin] = useState('');
    const [recipeCategory, setRecipeCategory] = useState('');
    const [recipeIngredients, setRecipeIngredients] = useState([]);
    const [recipeImage, setRecipeImage] = useState([]);

    const [cousin, setCousin] = useState([]);
    const [category, setCategory] = useState([]);
    const [ingredients, setIngredients] = useState([]);

    const [cousinLoaded, setCousinLoaded] = useState(false);
    const [categoryLoaded, setCategoryLoaded] = useState(false);
    const [ingredientsLoaded, setIngredientsLoaded] = useState(false);


    // difficulty
    let difficulty = [{value: 1, label: 1}, {value: 2, label: 2},{value: 3, label: 3}];
    useEffect(() => {
        const fetchUser = async () => {
            const data = await authService.isLoginned();
            if (data.detail !== 'success') {
                alert(`Вы должны зайти в аккаунт${data.detail}`);
                navigate('/profile');
            }
            else if (data.is_banned) {
                alert('Вы заблокированы.');
                navigate('/');
            }
            setUserData(data);
        }
        const fetchCousinData = async () => {
            const data = await recipeService.getCousins();
            setCousin(data);
            setCousinLoaded(true);
        }
        const fetchCategoryData = async () => {
            const data = await recipeService.getCategories();
            setCategory(data);
            setCategoryLoaded(true);
        }

        const fetchIngredients = async() => {
            const data = await recipeService.getIngredients();
            setIngredients(data);
            setIngredientsLoaded(true);
        }
        fetchUser();
        fetchCousinData();
        fetchCategoryData();
        fetchIngredients();
    }, [cousinLoaded, categoryLoaded, navigate]);

    function publishRecipe() {
        const postData = async () => {
            if (!recipeImage.type) {
                alert('Изображение блюда обязательно!');
                return;
            }
            const filetype = recipeImage.type.slice(recipeImage.type.lastIndexOf('/') + 1, recipeImage.type.length);
            const recipePicture = new File([recipeImage], recipeName + '.' + filetype);
            let rcp = {
                recipe: {
                    name: recipeName,
                    short_description: recipeShortDescription,
                    category: recipeCategory.id,
                    difficulty: recipeDifficulty.value,
                    cousin: recipeCousin.id,
                    instruction: recipeFullDescription,
                    image: recipePicture,
                    user: userData.id,
                    is_published: false
                },
                composition: []
            };
            let data2 = null;
            await recipeService.postRecipe(rcp.recipe)
                .then((response) => (data2 = response))
                .catch((error) => (data2 = error));
            if (data2.response && data2.response.data.detail === 'Recipe with such name already exists') {
                alert('Блюдо с таким названием уже существует!');
                return;
            }
            
            if (!rcp.recipe.image) {
                alert('Изображение блюда обязательно!');
                return;
            }
            for (let i = 0; i < recipeIngredients.length; ++i) {
                if (!recipeIngredients[i].value) {
                    alert("Заполните все поля ингредиентов!");
                    return;
                }
                let comp = {
                    ingredient: recipeIngredients[i].id,
                    value: recipeIngredients[i].value,
                    recipe: data2.id
                }
                rcp.composition.push(comp);
            }
            await recipeService.postComposition(rcp.composition).then((response) => (console.log(response)));
            alert('Рецепт будет выложен после проверки модерацией.');
            navigate('/');
            return;
        }
        postData();
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        recipeIngredients.find((o, i) => {
            if (o.id.toString() === name) {
                recipeIngredients[i].value = value;
            }
        })
    };
    if (!(categoryLoaded && cousinLoaded && ingredientsLoaded)) {
        return (
            <Core>
                <div className={styles.loaderdiv}>
                    <PacmanLoader size={50} color={'#5C5470'} className={styles.loader}></PacmanLoader>
                </div>
            </Core>
        )
    }
    else {
        return (
            <Core>
                <div className={styles.Container}>
                    <input className={styles.inp} placeholder={'Название рецепта'} onChange={e =>
                        (setRecipeName(e.target.value))} value={recipeName}></input>
                    <textarea className={styles.txtr} placeholder={'Краткое описание рецепта'} onChange={e =>
                        (setRecipeShortDescription(e.target.value))} value={recipeShortDescription} rows={8}></textarea>
                    <Select styles={style} className={styles.slct}
                            placeholder={'Кухня'} onChange={setRecipeCousin}
                            value={recipeCousin} options={cousin}
                            getOptionValue={option => option.slug}
                            getOptionLabel={option => option.name}
                            components={animatedComponents}
                            defaultValue={recipeCousin[4]}/>

                    <Select styles={style} className={styles.slct} placeholder={'Категория'} onChange={setRecipeCategory}
                            value={recipeCategory} options={category}
                            getOptionValue={option => option.slug}
                            getOptionLabel={option => option.name}
                            defaultValue={recipeCategory[3]}/>
                    <textarea className={styles.txtr} placeholder={'Инструкция'} rows={15}
                              onChange={e => (setRecipeFullDescription(e.target.value))}
                              value={recipeFullDescription}></textarea>
                    <Select className={styles.slct} placeholder={'Сложность'} options={difficulty} value={recipeDifficulty} onChange={setRecipeDifficulty} styles={style}></Select>
                    {/*<MultiSelect value={ingredients} onChange={(e) => setSelectedIngredients(e.value)}*/}
                    {/*filter placeholder="Ингредиенты" options={temp} optionLabel={name}>*/}
                    {/*</MultiSelect>*/}
                    {/* <div className={styles.inpimage}>Изображение блюда
                    <input type={'file'} className={styles.inp} placeholder="ИЗображение"
                           onChange={(e) =>
                           {console.log('dasd', e.target.files[0].type.slice(e.target.files[0].type.lastIndexOf('/') + 1, e.target.files[0].type.length));
                           setRecipeImage(e.target.files[0])}}></input>
                    </div> */}
                    
                    <input type="file" id='actual-btn' hidden accept=".png,.jpeg,.jpg" onChange={(e) => (setRecipeImage(e.target.files[0]))}
                    onClick={(e) => e.target.value = null} />                     
                    <label className={styles.inp} htmlFor='actual-btn'> 
                    Изображение блюда: {recipeImage.name}</label>
                    <Select styles={style} className={styles.slct}
                            closeMenuOnSelect={false} isMulti options={ingredients} getOptionLabel={option => option.name}
                            getOptionValue={option => option.slug} onChange={setRecipeIngredients}
                    placeholder={'Ингредиенты'}/>
                    {recipeIngredients.map(el => (
                        <div className={styles.ingrdiv}>
                            <input className={styles.ingrinp} placeholder={"Количество"} value={recipeIngredients.id}
                            onChange={handleInputChange} name={el.id} type="number"></input>
                            <label className={styles.ingrlabel}>{el.name + ' ' + el.measure}</label>
                        </div>
                    ))}
                    <button type='button' className={styles.btn} onClick={publishRecipe}>Опубликовать</button>
                </div>
            </Core>
        )
    }
}


export default AddRecipe
