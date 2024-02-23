'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ProductHasCategory extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here

      // ProductHasCategory.belongsTo(models.Category)
      //  ProductHasCategory.belongsTo(models.Product)
      ProductHasCategory.belongsTo(models.Category,{
        foreignKey : "CategoriesId"
       })
       ProductHasCategory.belongsTo(models.Product,{
        foreignKey: "ProductId"
       })
    }
  }
  ProductHasCategory.init({
    ProductId: DataTypes.INTEGER,
    CategoriesId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'ProductHasCategory',
  });
  return ProductHasCategory;
};