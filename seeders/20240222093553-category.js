'use strict';
const fs = require('fs')
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
   let categorie = JSON.parse(fs.readFileSync("./data/categories.json", "utf-8"))
   categorie.forEach(element => {
    delete element.id 

    element.createdAt = new Date () 
    element.updatedAt = new Date ()
   });
   await queryInterface.bulkInsert('Categories', categorie)
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Categories', null, {})
  }
};
