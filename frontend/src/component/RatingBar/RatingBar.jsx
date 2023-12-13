import React, {useState} from "react";
import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"
import Rating from "@mui/material/Rating"
import styles from "./RatingBar.module.css"


function RatingBar({stars, name}) {
    const [value, setValue] = React.useState(2);
    return (
        <div className={styles.container}>
            <Typography component="legend">{name}</Typography>
            <Rating name="no-value" value={stars} readOnly/>
        </div>
    )
}

export default RatingBar