const Sequelize = require('sequelize');
class General_member extends Sequelize.Model {
    static initiate(sequelize) {
        General_member.init({
            id: {
                type: Sequelize.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            name: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            student_id: {
                type: Sequelize.STRING,
                allowNull: false,
                unique: true,
            },
            major: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            phone_number: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            motivation: {
                type: Sequelize.TEXT,
                allowNull: false,
            },
        }, {
            sequelize,
            timestamps: true,
            underscored: true,
            modelName: 'General_member',
            tableName: 'general_members',
            paranoid: false,
            charset: 'utf8mb4',
            collate: 'utf8mb4_general_ci',
        });
    }
}

module.exports = General_member;