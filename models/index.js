import User from './User.js'
import Role from './Role.js'
import Panel from './Panel.js'
import SampleSize from './SampleSize.js'
import SampleSector from './SampleSector.js'
import Company from './Company.js'
import Sequelize  from 'sequelize'


Role.hasMany(User, {foreignKey:'roleId'})
User.belongsTo(Role, {foreignKey: 'roleId'})
SampleSector.hasMany(Company, {foreignKey: 'sampleSectorId'})
Company.belongsTo(SampleSector, {foreignKey:'sampleSectorId'})
SampleSize.hasMany(Company, {foreignKey:'sampleSizeId'})
Company.belongsTo(SampleSize, {foreignKey: 'sampleSizeId'})
Panel.hasMany(Company, {foreignKey: 'panelId'})
Company.belongsTo(Panel, {foreignKey:'panelId'})




export{
    User,
    Role,
    Panel,
    Company,
    Sequelize,
    SampleSector,
    SampleSize
}