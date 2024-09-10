module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('categories', 'description', {
      type: Sequelize.TEXT,
      allowNull: true
    });

    await queryInterface.sequelize.query(`
    UPDATE categories SET description = 'Delicious dishes featuring the freshest fish, shellfish, and other marine delicacies.' WHERE name = 'Seafood';

UPDATE categories SET description = 'Succulent and flavorful recipes that showcase tender lamb cuts cooked to perfection.' WHERE name = 'Lamb';

UPDATE categories SET description = 'Appetizing small plates designed to excite your taste buds and kickstart your meal.' WHERE name = 'Starter';

UPDATE categories SET description = 'A versatile selection of chicken dishes, from hearty roasts to light salads and everything in between.' WHERE name = 'Chicken';

UPDATE categories SET description = 'Robust and savory beef recipes, from steaks and burgers to stews and casseroles.' WHERE name = 'Beef';

UPDATE categories SET description = 'Indulgent sweet treats and desserts to satisfy your cravings, from cakes to puddings and beyond.' WHERE name = 'Dessert';

UPDATE categories SET description = 'Plant-based dishes that are both nutritious and delicious, free from all animal products.' WHERE name = 'Vegan';

UPDATE categories SET description = 'Juicy and savory pork recipes, from crispy bacon to tender roasts.' WHERE name = 'Pork';

UPDATE categories SET description = 'Flavorful and creative vegetarian meals that highlight the best of vegetables, grains, and legumes.' WHERE name = 'Vegetarian';

UPDATE categories SET description = 'A diverse assortment of various culinary delights that don’t fit into the other categories.' WHERE name = 'Miscellaneous';

UPDATE categories SET description = 'Delectable pasta dishes ranging from classic Italian to innovative fusion creations.' WHERE name = 'Pasta';

UPDATE categories SET description = 'Hearty and energizing breakfast recipes to start your day off right, from eggs to pancakes and more.' WHERE name = 'Breakfast';

UPDATE categories SET description = 'Complementary side dishes that perfectly round out any main course, from veggies to grains.' WHERE name = 'Side';

UPDATE categories SET description = 'Unique and flavorful goat recipes, offering a different take on tender meat dishes.' WHERE name = 'Goat';

UPDATE categories SET description = 'Warm and comforting soup recipes, from broths and bisques to hearty stews.' WHERE name = 'Soup';
    `);
  },

  async down(queryInterface, Sequelize) {}
};
