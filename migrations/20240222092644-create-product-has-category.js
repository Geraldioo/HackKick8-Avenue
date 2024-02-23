'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('ProductHasCategories', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      ProductId: {
        type: Sequelize.INTEGER,
        references : {
          model : 'Products',
          key : 'id'
        },
        onUpdate : 'cascade',
        onDelete : 'cascade'
      },
      CategoriesId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Categories',
          key: 'id'
        },
        onUpdate: 'cascade',
        onDelete: 'cascade'
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('ProductHasCategories');
  }
};