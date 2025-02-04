import { DataTypes } from 'sequelize';
import db from '../config/db.js'

const Company = db.define('companies',{
    code:{
        type:DataTypes.STRING,
        allowNull:false,
        unique:true
    },
    name:{
        type:DataTypes.STRING,
        allowNull:false
    },
    sampleLocation:{
        type:DataTypes.STRING,
        allowNull:false
    },
    floorNumber:{
        type:DataTypes.INTEGER
    },
    street:{
        type:DataTypes.STRING,
        allowNull:false
    },
    city:{
        type:DataTypes.STRING,
        allowNull:false
    },
    state:{
        type:DataTypes.STRING,
        allowNull:false
    },
    phoneNumberOne:{
        type:DataTypes.INTEGER,
        allowNull:false
    },
    phoneNumberSecond:{
        type:DataTypes.INTEGER,
        allowNull:true
    },
    faxNumber:{
        type:DataTypes.INTEGER,
        allowNull:true
    },
    preferenceNumber:{
        type:DataTypes.INTEGER,
        allowNull:false
    },
    emailAdress:{
        type:DataTypes.STRING,
        allowNull:false
    }
})

export default Company