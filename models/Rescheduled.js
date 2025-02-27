import { DataTypes } from 'sequelize';
import db from '../config/db.js'

const Rescheduled = db.define('rescheduleds',{
    date:{
        type:DataTypes.DATE,
        allowNull:false
    },
    time:{
        type:DataTypes.TIME,
        allowNull:false
    },
})

export default Rescheduled