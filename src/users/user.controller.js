import { response, request } from "express";
import { hash, verify } from "argon2";
import User from "./user.model.js";

export const updateUser = async (req, res = response) => {
    try {
        const userId = req.usuario._id; 
        const { password, newPassword, ...data } = req.body;

        const existingUser = await User.findById(userId);
        if (!existingUser) {
            return res.status(404).json({
                success: false,
                msg: 'Usuario no encontrado'
            });
        }

        data.email = existingUser.email;

        if (newPassword) {
            if (!password) {
                return res.status(400).json({
                    success: false,
                    msg: 'Debe ingresar su contraseña actual para cambiarla'
                });
            }

            const esIgual = await verify(existingUser.password, password);
            if (!esIgual) {
                return res.status(400).json({
                    success: false,
                    msg: 'La contraseña actual es incorrecta'
                });
            }

            data.password = await hash(newPassword);
        }

        const user = await User.findByIdAndUpdate(userId, data, { new: true });

        res.status(200).json({
            success: true,
            msg: 'Usuario actualizado',
            user
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            msg: 'Error al actualizar usuario',
            error
        });
    }
};
