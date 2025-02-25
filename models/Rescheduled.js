import { DataTypes } from 'sequelize';
import db from '../config/db.js'

const Call = db.define('calls',{
    date:{
        type:DataTypes.DATE,
        allowNull:false
    },
    time:{
        type:DataTypes.TIME,
        allowNull:false
    },
})

export default Call