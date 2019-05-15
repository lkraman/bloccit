'use strict';
module.exports = (sequelize, DataTypes) => {
  const Rule = sequelize.define('Rule', {
     title: DataTypes.STRING,
    description: DataTypes.STRING,
    topicId: {
      type: DataTypes.INTEGER,
      onDelete: 'CASCADE',
      references: {
        model: 'Topics',
        key: 'id',
        as: 'topicId',
      }
    }
  }, {});
  Rule.associate = function(models) {
    Rule.belongsTo(models.Topic, {
      foreignKey: 'topicId',
      onDelete: 'CASCADE',
    });
  };
  return Rule;
};
