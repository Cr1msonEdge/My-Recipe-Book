import React from "react";
import styles from './UserNew.module.css'


function UserNew({el, status}) {
    const labelHandler = {
        'Ingredient': 'Ингредиент',
        'Category': 'Категория',
        'Cousin': 'Кухня',
    }
    console.log('el', el);
    return (
        <div className={styles.post}>
            <span className={styles.title}>{labelHandler[el.type]}</span><br/>
            <span className={styles.title}>{el.status ? "Статус: одобрено" : "Статус: на модерации"}</span>
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
        </div>
    )
}

export default UserNew