import Comment from "../models/comment.model.js";


export const saveComment = async (req, res) => {
    try {
        const { comment } = req.body;
        const authenticatedUser = req.usuario; 

        if (!authenticatedUser) {
            return res.status(403).json({
                success: false,
                message: "No tienes permisos para comentar"
            });
        }

        const newComment = new Comment({
            comment,
            user: authenticatedUser._id
        });

        await newComment.save();

        res.status(201).json({
            success: true,
            message: "Comentario guardado exitosamente",
            comment: newComment
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Error al guardar el comentario",
            error
        });
    }
};

export const listarCommentsUsuario = async (req, res) => {
    try {
        const userId = req.usuario._id; 

        const comments = await Comment.find({ user: userId });

        res.json({
            success: true,
            comments,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            msg: "Error al obtener los comentarios",
        });
    }
};

export const deleteComment = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.usuario._id; 

        const comment = await Comment.findOne({ _id: id, user: userId });

        if (!comment) {
            return res.status(403).json({
                success: false,
                msg: "No puedes eliminar este comentario",
            });
        }

        await Comment.findByIdAndDelete(id);

        res.status(200).json({
            success: true,
            message: "Comentario eliminado exitosamente",
        });

    } catch (error) {
        console.error("Error al eliminar comentario:", error); 
        res.status(500).json({
            success: false,
            message: "Error al eliminar comentario",
            error: error.message 
        });
    }
};


export const editarComment = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.usuario._id; 

        const comment = await Comment.findOne({ _id: id, user: userId });

        if (!comment) {
            return res.status(403).json({
                success: false,
                msg: "No puedes editar este comentario",
            });
        }

        const updatedComment = await Comment.findByIdAndUpdate(id, req.body, { new: true });

        res.json({
            success: true,
            msg: "Comentario actualizado exitosamente",
            comment: updatedComment,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            msg: "Error al actualizar el comentario",
        });
    }
};
