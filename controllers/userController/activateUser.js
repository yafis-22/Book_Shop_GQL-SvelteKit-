import { User } from "../../models/userModal.js";

export const activateUser = async (req, res) => {
    try {
        const userId = req.params.id;

        // Find the soft-deleted book by ID
        const deletedUser = await User.findOne({
          where: { id: userId },
          paranoid: false, // Include soft-deleted records
        });

        if (deletedUser) {
            // Restore the soft-deleted user
            await deletedUser.restore();
      
            res.json({ message: 'User restored successfully', data: deletedUser });
          } else {
            res.status(404).json({ message: 'User not found or permanently deleted.' });
          }
        } catch (err) {
          console.error('Error restoring user:', err);
          res.status(500).send('Internal Server Error');
        }
};
