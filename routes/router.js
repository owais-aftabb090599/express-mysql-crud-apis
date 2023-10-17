import express from "express";
import { addUser, allUsers, allUsersApi, deleteAllUsers, deleteUser, home, searchUsers, setAutoIncrement, updateUser } from "../controller/controller.js";
import { addUserValidaion, updateUservalidation } from "../helper/validation.js";
const router = express.Router();


router.get('/', home);
router.post('/api/add-user', addUserValidaion, addUser);
router.get('/api/all-users', allUsers);
router.put('/api/update-user', updateUservalidation, updateUser);
router.delete('/api/delete-user/:userId', deleteUser);
router.get('/api/users', allUsersApi);
router.get('/api/search-user', searchUsers);
router.delete('/api/delete-all-users', deleteAllUsers);
router.get('/api/set-auto_increment', setAutoIncrement);


export default router;