import { Router } from "express";
import { check } from "express-validator";
import { savePost, updatePost, listPosts, deletePost } from "./publication.controller.js";
import { validarCampos } from "../middlewares/validar-campos.js";
import { validarJWT } from "../middlewares/validar-jwt.js";
import { existentePublication } from "../helpers/db-validator.js";

const router = Router();

router.post(
  "/",
  [
    validarJWT,
    check("title", "El título es obligatorio").not().isEmpty(),
    check("text", "El texto es obligatorio").not().isEmpty(),
    check("categoryName", "El nombre de la categoría es obligatorio").not().isEmpty(),
    validarCampos,
  ],
  savePost
);

router.put(
  "/:id",
  [
    validarJWT,
    check("id", "No es un ID válido").isMongoId(),
    check("id").custom(existentePublication),
    validarCampos,
  ],
  updatePost
);

router.get("/", 
    [
        validarJWT
    ],
    listPosts
);

router.delete(
  "/:id",
  [
    validarJWT,
    check("id", "No es un ID válido").isMongoId(),
    check("id").custom(existentePublication),
    validarCampos,
  ],
  deletePost
);

export default router;
