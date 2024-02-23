'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.hasOne(models.Profile,{
        foreignKey : "UserId"
      })
      User.hasMany(models.Product,{
        foreignKey : "UserId"
      })
    }
  }
  User.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          args: true,
          msg: "Name is require!"
        },
        notEmpty: {
          args: true,
          msg: "Name is require!"
        }
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notNull: {
          args: true,
          msg: "Email is require!"
        },
        notEmpty: {
          args: true,
          msg: "Email is require!"
        }
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          args: true,
          msg: "Password is required!"
        },
        notEmpty: {
          args: true,
          msg: "Password is required!"
        },
        isTrueLength(value) {
          if (value.length < 8) {
            throw new Error('Password length minimum 8')
          }
        }
      }
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          args: true,
          msg: "Select your Role!"
        },
        notEmpty: {
          args: true,
          msg: "Select your Role!"
        }
      }
    }
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};