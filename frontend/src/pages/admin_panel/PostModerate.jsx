import React from "react";
import styles from './PostModerate.module.css'
import {useNavigate} from 'react-router-dom'


function PostModerate({el}) {
    const navigate = useNavigate();
    function handlePost() {
        navigate(`/admin/post/${el.id}`);
    }

    return (
        <div className={styles.post}>
            <span className={styles.title}>{el.name}</span><br/>
            <div className={styles.flx}>
                <img className={styles.img} src={el.image} alt={'Изображение не найдено'}></img>
                <div className={styles.flxcol}>
                    <span className={styles.subtitle}>Описание:</span><br/>
                    <span className={styles.txt}>{el.short_description}</span><br/><br/>
                    <span>Сложность: {el.difficulty}</span><br/>
                </div>
            </div>
            <button className={styles.btn} onClick={handlePost}>Показать полностью</button>
        </div>
    )
}

export default PostModerate