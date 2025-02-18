import { Router } from "express";
import { check } from "express-validator";
import { updateUser } from "./user.controller.js";
import { existeUsuarioById } from "../helpers/db-validator.js";
import { validarCampos } from "../middlewares/validar-campos.js";
import { tieneRole } from "../middlewares/validar-roles.js";
import { validarJWT } from "../middlewares/validar-jwt.js";

const router = Router();

router.put(
    "/editar",
    [
        validarJWT,
        validarCampos
    ],
    updateUser
)
export default router;