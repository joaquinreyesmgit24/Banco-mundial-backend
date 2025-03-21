import { DataTypes } from 'sequelize';
import db from '../config/db.js'

const Report = db.define('reports', {
    countryName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    countryCode: {
        type: DataTypes.STRING,
        allowNull: false
    },
    nameStratificationRegion: {
        type: DataTypes.STRING,
        allowNull: false
    },
    regionalStratificationCode: {
        type: DataTypes.STRING,
        allowNull: false
    },
    nameSizeStratification: {
        type: DataTypes.STRING,
        allowNull: false
    },
    sizeStratificationCode: {
        type: DataTypes.STRING,
        allowNull: false
    },
    nameStratificationSector: {
        type: DataTypes.STRING,
        allowNull: false
    },
    sectorStratificationCode: {
        type: DataTypes.STRING,
        allowNull: false
    },
    panelName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    panelCode: {
        type: DataTypes.STRING,
        allowNull: false
    },
    eligibilityCode: {
        type: DataTypes.STRING,
        allowNull: false
    },
    statusCode: {
        type: DataTypes.STRING,
        allowNull: false
    },
    rejectionCode: {
        type: DataTypes.STRING,
        allowNull: false
    },
    companyName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    locality: {
        type: DataTypes.STRING,
        allowNull: false
    },
    address: {
        type: DataTypes.STRING,
        allowNull: false
    },
    zipCode: {
        type: DataTypes.STRING,
        allowNull: false
    },
    contactPerson: {
        type: DataTypes.STRING,
        allowNull: false
    },
    contactPosition: {
        type: DataTypes.STRING,
        allowNull: false
    },
    phoneNumberOne: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    phoneNumberSecond: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    faxNumber: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    emailAddress: {
        type: DataTypes.STRING,
        allowNull: false
    },
    web: {
        type: DataTypes.STRING,
        allowNull: false
    },
    companyNameUpdate: {
        type: DataTypes.STRING,
        allowNull: true
    },
    companyFloorNumberUpdate: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    companyStreetUpdate: {
        type: DataTypes.STRING,
        allowNull: true
    },
    companyCityUpdate: {
        type: DataTypes.STRING,
        allowNull: true
    },
    companyStateUpdate: {
        type: DataTypes.STRING,
        allowNull: true
    },
    companyFaxNumberUpdate: {
        type: DataTypes.STRING,
        allowNull: true
    },
    companyEmailAddressUpdate: {
        type: DataTypes.STRING,
        allowNull: true
    },
    companyPhoneNumberOneUpdate: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    companyPhoneNumberSecondUpdate: {
        type: DataTypes.INTEGER,
        allowNull: true
    }
})

export default Report