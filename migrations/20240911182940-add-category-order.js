const { Sequelize } = require('sequelize');

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('categories', 'order', {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0
    });

    await queryInterface.sequelize.query(`
      UPDATE categories SET "order" = 0
      WHERE name = 'Beef';
    `);

    await queryInterface.sequelize.query(`
      UPDATE categories SET "order" = 1
      WHERE name = 'Breakfast';
    `);

    await queryInterface.sequelize.query(`
      UPDATE categories SET "order" = 2
      WHERE name = 'Dessert';
    `);

    await queryInterface.sequelize.query(`
      UPDATE categories SET "order" = 3
      WHERE name = 'Lamb';
    `);

    await queryInterface.sequelize.query(`
      UPDATE categories SET "order" = 4
      WHERE name = 'Goat';
    `);

    await queryInterface.sequelize.query(`
      UPDATE categories SET "order" = 5
      WHERE name = 'Miscellaneous';
    `);

    await queryInterface.sequelize.query(`
      UPDATE categories SET "order" = 6
      WHERE name = 'Pasta';
    `);

    await queryInterface.sequelize.query(`
      UPDATE categories SET "order" = 7
      WHERE name = 'Pork';
    `);

    await queryInterface.sequelize.query(`
      UPDATE categories SET "order" = 8
      WHERE name = 'Seafood';
    `);

    await queryInterface.sequelize.query(`
      UPDATE categories SET "order" = 9
      WHERE name = 'Side';
    `);

    await queryInterface.sequelize.query(`
      UPDATE categories SET "order" = 10
      WHERE name = 'Starter';
    `);

    await queryInterface.sequelize.query(`
      UPDATE categories SET "order" = 11
      WHERE name = 'Vegetarian';
    `);

    await queryInterface.sequelize.query(`
      UPDATE categories SET "order" = 12
      WHERE name = 'Vegan';
    `);

    await queryInterface.sequelize.query(`
      UPDATE categories SET "order" = 13
      WHERE name = 'Chicken';
    `);

    await queryInterface.sequelize.query(`
      UPDATE categories SET "order" = 14
      WHERE name = 'Soup';
    `);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('categories', 'order');
  }
};
