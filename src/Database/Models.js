const { DataTypes, Model } = require('sequelize');

module.exports = {
    User: class User extends Model {
        static init(sequelize) {
            return super.init({
                guildId: { type: DataTypes.STRING },
                inviterId: { type: DataTypes.STRING },
                userId: { type: DataTypes.STRING },
                invites: { type: DataTypes.INTEGER },
                bonus: { type: DataTypes.INTEGER },
                leave: { type: DataTypes.INTEGER }
            }, {
                tableName: 'Users',
                timestamps: false,
                sequelize
            });
        }
    },
    GuildConfig: class extends Model {
        static init(sequelize) {
            return super.init({
                guildId: { type: DataTypes.STRING },
                joinMessage: { type: DataTypes.STRING, defaultValue: JSON.stringify({
                    title: 'Novo Convite',
                    description: 'O membro {member} acaba de entrar no servidor!\nConvidado por: {inviter} ({invites} convites, {bonus} bonus, {leave} saíram)',
                    color: '#00ff00'
                }) },
                leaveMessage: { type: DataTypes.STRING, defaultValue: JSON.stringify({
                    title: 'Saiu do Servidor',
                    description: 'O membro {member} saiu do servidor!\nConvidado por: {inviter} ({invites} convites, {bonus} bonus, {leave} saíram)',
                    color: '#ff0000'
                }) },
                joinMessageChannel: { type: DataTypes.STRING },
                leaveMessageChannel: { type: DataTypes.STRING }
            }, {
                tableName: 'GuildConfig',
                timestamps: false,
                sequelize
            });
        }
    }
}