import React, {useEffect} from "react";
import styles from "./core.module.css"
import ButtonMenu from "../../component/ButtonMenu/ButtonMenu";
import { menuData } from "../../assets/MenuButtons/menuButtons";
import {authService} from "../../services/Authentication/AuthenticationService";


function Core(props) {
    let md = menuData;
    //const [isLoginned, setIsLoginned] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            const data = await authService.isLoginned();
            if (data.detail !== 'Unauthenticated') {
                //setIsLoginned(true);
                //props.onChange(true);
                md[md.length - 1].nav = '/profile';
            }
            else {
                //setIsLoginned(false);
                //props.onChange(false);
                md[md.length - 1].nav = '/register';
            }
        }
        fetchData()
    }, [md]);

    return (
        <div className={styles.skeleton}>
            <div className={styles.head}>
                <div className={styles.title}>Recipe Book</div>
            </div>
            <div className={styles.menu}>
                {md.map((el) => (
                    <ButtonMenu key={el.id} el={el}/>
                ))}
            </div>
            <div className={styles.body}>
                <div className={styles.background}>
                    {props.children}
                </div>
            </div>
        </div>
    )
}

export default Core
