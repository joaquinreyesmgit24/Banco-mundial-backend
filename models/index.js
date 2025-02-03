import User from './User.js'
import Role from './Role.js'
import Sequelize  from 'sequelize'


Role.hasMany(User, {foreignKey:'roleId'})
User.belongsTo(Role, {foreignKey: 'roleId'})

export{
    User,
    Role,
    Sequelize
}