import React from "react";
import styles from './About.module.css'
import Core from "../../ui/Core/core";
import { logData } from "../../assets/logData/logData";


function About() {
    return (
        <Core onChange={logData.temp}>
            <div className={styles.about}>
                <span className={styles.title}>Релевантный поиск</span><br></br>
                <span className={styles.text}>Представим, что у пользователя в холодильнике имеется набор ингредиентов. Он вводит список имеющихся 
                ингредиентов на сайте, 
                    далее сайт сортирует рецепты из всей базы данных по следующему правилу: в порядке не возрастания мощности пересечения множеств
                    игредиентов пользователя и игредиентов блюда.</span><br/><br/><br/>
                <span className={styles.title}>Ранговая система</span><br></br>
                <span className={styles.text}>На данный момент имеется три ранга: </span>
                <ul>
                    <li className={styles.text}>Ранг 1 - новичок. Доступен по умолчанию. коэффициент: 1</li>
                    <li className={styles.text}>Ранг 2 - любитель. Доступен при написании 5 одобренных модерацией рецептов. коэффициент: 1.5</li>
                    <li className={styles.text}>Ранг 3 - шеф. Доступен при написании 10 одобренных модерацией рецептов. коэффициент: 2</li>
                </ul>
            </div>
        </Core>
    )
}


export default About