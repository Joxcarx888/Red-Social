import { Router } from "express";
import { check } from "express-validator";
import {deleteComment, editarComment, listarCommentsUsuario } from "./comment.controller.js";
import { validarCampos } from "../middlewares/validar-campos.js";
import { validarJWT } from "../middlewares/validar-jwt.js"; 
import { existeCommentById } from "../helpers/db-validator.js";

const router = Router();

router.get(
    "/",
    [
        validarJWT
    ],
    listarCommentsUsuario
);

router.delete(
    "/:id",
    [
        validarJWT, 
        check("id").custom(existeCommentById),
        validarCampos
    ],
    deleteComment
);

router.put(
    "/:id",
    [
        validarJWT, 
        check("id").custom(existeCommentById),
        check("comment", "El comentario es obligatorio").not().isEmpty(),
        check("comment", "El comentario debe tener entre 3 y 500 caracteres").isLength({ min: 3, max: 500 }),
        validarCampos
    ],
    editarComment
);

export default router;