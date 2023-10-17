import { validationResult } from "express-validator";
import db from "../config/db.js";


export const home = (req, res) => {
    return res.json({ status: "success" });
}



export const addUser = (req, res) => {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.json({
                status: "validationError",
                errors: errors.array()
            });
        }
        const { name, email, mno, gender } = req.body;
        const qry = `SELECT * FROM crudapp WHERE LOWER(email) = LOWER(?)`;
        db.query(qry, [email], (errr, resultt) => {
            if (errr) {
                return res.json({
                    status: "error",
                    message: errr.message || "Internal Server Error"
                });
            }
            if (resultt && resultt.length) {
                return res.json({
                    status: "error",
                    message: "user Already Exists"
                });
            } else {
                const addQry = `INSERT INTO crudapp (name, email, mno, gender) VALUES(?,?,?,?)`;
                db.query(addQry, [name, email, mno, gender], (err, result) => {
                    if (err) {
                        return res.json({
                            status: "error",
                            message: err.message || "Internal Server Error"
                        });
                    }
                    const user = {
                        name,
                        email,
                        gender,
                        mno,
                        id: result.insertId
                    }
                    return res.json({
                        status: "success",
                        user: user,
                        message: `User Inserted SuccessFully at id ${result.insertId}`
                    });
                });
            }
        });
    } catch (error) {
        return res.json({
            status: "error",
            message: error.message || "Internal Server Error"
        });
    }
}



export const allUsers = (req, res) => {
    try {
        const qry = 'SELECT * FROM crudapp';
        db.query(qry, (err, results) => {
            if (err) {
                return res.json({
                    status: "error",
                    message: err.message || "Internal Server Error"
                });
            }
            return res.json({
                status: "success",
                users: results,
                message: `All Users`
            });
        });
    } catch (error) {
        return res.json({
            status: "error",
            message: error.message || "Internal Server Error"
        });
    }
}


export const updateUser = (req, res) => {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.json({
                status: "validationError",
                errors: errors.array()
            });
        }
        const { name, email, mno, userId } = req.body;

        const selectQry = `SELECT * FROM crudapp WHERE id = ?`;
        db.query(selectQry, [userId], (err, result) => {
            if (err) {
                return res.json({
                    status: "error",
                    message: err.message || "Internal Server Error"
                });
            }
            if (!result[0] && !result.length) {
                return res.json({
                    status: "error",
                    message: "User Didnt Exists"
                });
            } else {
                const updateQry = `UPDATE crudapp SET name = ?, email = ?, mno = ? WHERE id = ?`;
                db.query(updateQry, [name, email, mno, userId], (errr, resultt) => {
                    if (errr) {
                        return res.json({
                            status: "error",
                            message: errr.message || "Internal Server Error"
                        });
                    }
                    const newUser = {
                        name,
                        email,
                        mno,
                        gender: result[0].gender,
                        id: result[0].id
                    }
                    return res.json({
                        status: "success",
                        newUser: newUser,
                        message: "userUpdated SuccessFully"
                    });
                });
            }
        });
    } catch (error) {
        return res.json({
            status: "error",
            message: error.message || "Internal Server Error"
        });
    }
}


export const deleteUser = (req, res) => {
    try {
        const { userId } = req.params;
        const selectQry = `SELECT * FROM crudapp WHERE id = ?`;
        db.query(selectQry, [userId], (errr, results) => {
            if (errr) {
                return res.json({
                    status: "error",
                    message: errr.message || "Internal Server Error"
                });
            }
            // Check if results.length is zero, not the other way around
            if (!results || results.length === 0) {
                return res.json({
                    status: "error",
                    message: "User Not Exists"
                });
            } else {
                const qry = `DELETE FROM crudapp WHERE id = ?`;
                db.query(qry, [userId], (err, result) => {
                    if (err) {
                        return res.json({
                            status: "error",
                            message: err.message || "Internal Server Error"
                        });
                    }
                    return res.json({
                        status: "success",
                        message: "User deleted successfully"
                    });
                });
            }
        });
    } catch (error) {
        return res.json({
            status: "error",
            message: error.message || "Internal Server Error"
        });
    }
}



export const allUsersApi = (req, res) => {
    try {
        const { page, pageSize } = req.query;
        const offSet = (page - 1) * pageSize;

        db.query(`SELECT * FROM crudapp ORDER BY id LIMIT ${offSet}, ${pageSize}`, (err, result) => {
            console.log(result.length);
            if (err) {
                return res.json({
                    status: 'error',
                    message: err.message || 'Internal Server Error'
                });
            }
            return res.json({
                status: 'success',
                users: result
            });
        });
    } catch (error) {
        return res.json({
            status: 'error',
            message: error.message || 'Internal Server Error'
        });
    }
}

export const searchUsers = (req, res) => {
    try {
        const { searchTerm } = req.query;
        const qry = `SELECT * FROM crudapp WHERE name REGEXP ? LIMIT 10`;
        db.query(qry, [searchTerm], (err, results) => {
            if (err) {
                return res.json({
                    status: 'error',
                    message: err.message || 'Internal Server Error'
                });
            }

            return res.json({
                status: "success",
                users: results
            });
        });
    } catch (error) {
        return res.json({
            status: 'error',
            message: error.message || 'Internal Server Error'
        });
    }
}

export const deleteAllUsers = (req, res) => {
    try {
        db.query(`DELETE FROM crudapp`, (err, result) => {
            if (err) {
                return res.json({
                    status: 'error',
                    message: err.message || 'Internal Server Error'
                });
            }
            return res.json({
                status: 'success',
                message: "All Users Deleted"
            })
        });
    } catch (error) {
        return res.json({
            status: 'error',
            message: error.message || 'Internal Server Error'
        });
    }
}
export const setAutoIncrement = (req, res) => {
    try {
        db.query(`ALTER TABLE crudapp AUTO_INCREMENT = 1`, (err, result) => {
            if (err) {
                return res.json({
                    status: 'error',
                    message: err.message || 'Internal Server Error'
                });
            }
            return res.json({
                status: 'success',
                message: "Auto_Increment Setted"
            })
        });
    } catch (error) {
        return res.json({
            status: 'error',
            message: error.message || 'Internal Server Error'
        });
    }
}