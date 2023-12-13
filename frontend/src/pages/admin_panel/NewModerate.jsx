import React from "react";
import styles from './NewModerate.module.css'
import {useNavigate} from 'react-router-dom'
import { authService } from "../../services/Authentication/AuthenticationService";


function NewModerate({el}) {
    const navigate = useNavigate();
    // function handlePost() {
    //     navigate(`/admin/post/${el.id}`);
    // }
    console.log('el', el);

    const labelHandler = {
        'Ingredient': 'Ингредиент',
        'Category': 'Категория',
        'Cousin': 'Кухня',
    }

    // button handler
    function acceptHandler(type) {
        const fetchData = async () => {
            switch (type) {
                case 'Ingredient':
                    await authService.patchIngredient({data: {is_published: true}, slug: el.slug});
                    alert('Выложено!');
                    navigate('/profile');
                    break;
                case 'Cousin':
                    await authService.patchCousin({data: {is_published: true}, slug: el.slug});     
                    alert('Выложено!');
                    navigate('/profile');
                    break;  
                case 'Category':
                    await authService.patchCategory({data: {is_published: true}, slug: el.slug});
                    alert('Выложено');
                    navigate('/profile');
                    break;     
                default:
                    break;
            }
        }
        fetchData();
        navigate('/admin');
    }

    function deleteHandler(type, slug) {
        const fetchData = async () => {
            switch (type) {
                case 'Ingredient':
                    await authService.deleteIngredient({slug: el.slug});       
                    alert('Успешно!');
                    navigate('/profile');
                    break;
                case 'Cousin':
                    await authService.deleteCousin({slug: el.slug});     
                    alert('Успешно!');
                    navigate('/profile');
                    break;  
                case 'Category':
                    await authService.deleteCategory({slug: el.slug});  
                    alert('Успешно!');
                    navigate('/profile');
                    break;     
                default:
                    break;
            }
        }
        fetchData();
        navigate('/admin');
    }

    return (
        <div className={styles.post}>
            <span className={styles.title}>{labelHandler[el.type]}</span><br/>
            <div className={styles.flx}>
                <div className={styles.flxcol}>
                    <span className={styles.txt}>Название: </span>
                    <span className={styles.txt}>{el.name}</span><br/>
                    <span className={styles.txt}>Уникальный идентификатор: </span>
                    <span className={styles.txt}>{el.slug}</span><br/>
                    {el.type === 'Ingredient'? 
                    <div>
                        <span className={styles.txt}>Единица измерения: {el.measure}</span>
                    </div> : <span></span>}
                </div>
            </div>
            <button className={styles.btn} onClick={() => (acceptHandler(el.type))}>Принять</button>
            <button className={styles.btn} onClick={() => (deleteHandler(el.type))}>Удалить</button>
        </div>
    )
}

export default NewModerate