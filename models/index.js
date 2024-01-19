import { User } from "./userModal.js";
import { Book } from "./bookModal.js";
import { LentBooks } from "./lentBooksModal.js";

User.belongsToMany(Book, {
  as: 'lentBooks',
  through: LentBooks,
  foreignKey: 'userId',
});

Book.belongsToMany(User, {
  as: 'lentUsers',
  through: LentBooks,
  foreignKey: 'bookId',
});

export { User, Book, LentBooks }