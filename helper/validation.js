import { check } from "express-validator";


export const addUserValidaion = [
    check("name", "Please Enter Proper Name").not().isEmpty().isLength({ min: 2 }),
    check("email", "Please Enter Proper Email").notEmpty().isEmail().normalizeEmail({ gmail_remove_dots: true }),
    check("mno", "Please Enter Correct Number").notEmpty().isMobilePhone("any")
]

export const updateUservalidation = [
    check("name", "Please Enter Proper Name").not().isEmpty().isLength({ min: 2 }),
    check("email", "Please Enter Proper Email").notEmpty().isEmail().normalizeEmail({ gmail_remove_dots: true }),
    check("mno", "Please Enter Correct Number").notEmpty().isMobilePhone("any")
]