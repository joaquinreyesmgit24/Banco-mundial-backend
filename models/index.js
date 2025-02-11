import User from './User.js'
import Role from './Role.js'
import Panel from './Panel.js'
import SampleSize from './SampleSize.js'
import SampleSector from './SampleSector.js'
import Company from './Company.js'
import Sequelize  from 'sequelize'
import Call from './Call.js'
import Incidence from './Incidence.js'


Role.hasMany(User, {foreignKey:'roleId'})
User.belongsTo(Role, {foreignKey: 'roleId'})
SampleSector.hasMany(Company, {foreignKey: 'sampleSectorId'})
Company.belongsTo(SampleSector, {foreignKey:'sampleSectorId'})
SampleSize.hasMany(Company, {foreignKey:'sampleSizeId'})
Company.belongsTo(SampleSize, {foreignKey: 'sampleSizeId'})
Panel.hasMany(Company, {foreignKey: 'panelId'})
Company.belongsTo(Panel, {foreignKey:'panelId'})
Company.hasMany(Call,{foreignKey:'companyId'})
Call.belongsTo(Company, {foreignKey: 'companyId'})
Incidence.hasMany(Call, {foreignKey: 'incidenceId'})
Call.belongsTo(Incidence, {foreignKey:'incidenceId'})
User.hasMany(Company,{foreignKey: 'assignedId'} )
Company.belongsTo(User,{foreignKey: {name:'assignedId', allowNull:true}} )



export{
    User,
    Role,
    Panel,
    Company,
    Sequelize,
    SampleSector,
    SampleSize,
    Call,
    Incidence
}