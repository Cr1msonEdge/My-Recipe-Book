import React, { useState } from "react";
import Select from "react-select";
import styles from './IngredientButton.module.css'


const style = {
    control: (base, state) => ({
        ...base,

        border: state.isFocused ? '1px solid #8a2be2' : 0,
        transition: 'border-color 0.4s ease',
        // This line disable the blue border
        boxShadow: state.isFocused ? '0 0 10 00000080' : 0,
        height: 40,
        padding: 0,
        outline: 'none',
        marginTop: 0,
        "&:hover": {
            border: state.isFocused ? '1px solid #8a2be2' : 0,
            boxShadow: state.isFocused ? '0 0 10 00000080' : 0,
        },
        fontSize: 15,
    })
}

function IngredientButton({ingredients}) {
    const [ingredient, setIngredient] = useState({});
    ingredients = [{label: "мясо", value: 'adsa'},{label: "ахы", value: 'asd'}]
    return(
        <div>
            <Select styles={style} className={styles.selected} options={ingredients} onChange={setIngredient}></Select>
        </div>
    )
}

export default IngredientButton
