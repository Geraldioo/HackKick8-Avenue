'use strict';
const { Model } = require('sequelize');
const formatRupiah = require("../utils/helper")
const { Op } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Product.belongsTo(models.User,{
        foreignKey : "UserId"
      })
      Product.hasMany(models.ProductHasCategory,{
        foreignKey : "ProductId"
      })
    }

    get formatRupiah(){
      return formatRupiah(this.price)
    }

    static async productAdminShowAll(){
      let data = Product.findAll({
        order : [["price", "ASC"], ["stock", "ASC"]]
    })
    return data
    }

    static async productShowAll(orderBy){
      let options = {}
      if (orderBy) {
        if (orderBy ==='Formal') {
          options.where = {
            type:{
              [Op.eq]:"Formal"
            }
          } 
        }else if (orderBy === "Casual"){
          options.where = {
            type:{
              [Op.eq]:"Casual"
            }
          } 
        }else if (orderBy === "Sport"){
          options.where = {
            type:{
              [Op.eq]:"Sport"
            }
          } 
        }else {
          options = {
            order:[
              ["id", "ASC"]
            ],
            where : {
              stock : {
                  [Op.gt] : 1
              }
            }
          }
        }
        
      }
      let data = await Product.findAll(options, {
        order: [
            ["id", "DESC"]
        ]
    })
    return data
    }

  }
  Product.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          args: true,
          msg: "Name Can't be null"
        },
        notNull: {
          args: true,
          msg: "Name Can't be empty"
        }
      }
    },
    stock: {
      type : DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: {
          args: true,
          msg: "Stock Can't Be null"
        },
        notNull: {
          args: true,
          msg: "Stock Can't Be empty"
        }
      }
    },
    price: {
      type : DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: {
          args: true,
          msg: "Price Can't Be null"
        },
        notNull: {
          args: true,
          msg: "Price Can't Be empty"
        }
      }
    },
    image: {
      type : DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          args: true,
          msg: "Image Can't Be null"
        },
        notNull: {
          args: true,
          msg: "Image Can't Be empty"
        }
      }
    },
    type: {
      type : DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          args: true,
          msg: "Type Can't Be null"
        },
        notNull: {
          args: true,
          msg: "Type Can't Be empty"
        }
      }
    },
    UserId: DataTypes.INTEGER
  }, {
    hooks: {
      beforeCreate: (instance) => {
        instance.name = instance.name.toUpperCase()
      },
    },
    sequelize,
    modelName: 'Product',
  });
  return Product;
};