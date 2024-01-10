import * as userModel from '../../models/userModal.js';

export const activateUser = async (req, res) => {
    try {
        const userId = parseInt(req.params.id);
        const users = await userModel.getUsers();

        const userIndex = users.findIndex(user => user.id === userId);

        if (userIndex !== -1) {
            // Check if req.body is empty
            if (Object.keys(req.body).length === 0) {
                return res.status(400).json({ message: 'Request body is empty.' });
            }

            // Check if 'deleted' property is provided in the request body
            if (typeof req.body.deleted !== 'boolean') {
                return res.status(400).json({ message: 'Please provide the "deleted" property in the request body as a boolean.' });
            }

            if (!users[userIndex].deleted) {
              if (req.body.deleted) {
                  // User is already activated, but attempting to delete
                  return res.status(400).json({ message: 'User cannot be deleted from the update route.' });
              }
              return res.json({ message: 'User is already activated.' });
            }
            

            // Activate the user and update the timestamp
            users[userIndex].deleted = req.body.deleted;
            users[userIndex].timestamp = new Date().toISOString();

            await userModel.saveUsers(users);
            res.json({ message: 'User activated successfully.', data: users[userIndex] });
        } else {
            res.status(404).json({ message: 'User not found.' });
        }
    } catch (err) {
        console.error('Error activating user', err);
        res.status(500).send('Internal Server Error');
    }
};
