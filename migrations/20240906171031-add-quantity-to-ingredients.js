module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('recipeIngredients', 'quantity', {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: '1'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('recipeIngredients', 'quantity');
  }
};
