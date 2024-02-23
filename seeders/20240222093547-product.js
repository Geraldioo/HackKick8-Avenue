'use strict';
const fs = require('fs')
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
   let shoe = JSON.parse(fs.readFileSync("./data/products.json", "utf-8"))
   shoe.forEach(element => {
    delete element.id 
    element.createdAt = new Date ()
    element.updatedAt = new Date ()
   });
   await queryInterface.bulkInsert('Products', shoe);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Products', null, {})
  }
};
