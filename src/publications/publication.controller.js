import Publication from "./publication.model.js";  
import Category from "../categories/category.model.js";

export const savePost = async (req, res) => {
    try {
        const { title, text, categoryName } = req.body;
        const authenticatedUser = req.usuario;

        if (!authenticatedUser) {
            return res.status(401).json({
                success: false,
                message: "No estás autenticado",
            });
        }

        const category = await Category.findOne({ name: categoryName });

        if (!category) {
            return res.status(404).json({
                success: false,
                message: "La categoría especificada no existe",
            });
        }

        const publication = new Publication({
            title,
            text,
            user: authenticatedUser._id,
            category: category._id,
        });

        await publication.save();

        res.status(201).json({
            success: true,
            message: "Publicación creada exitosamente",
            publication,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Error al crear la publicación",
            error,
        });
    }
};

export const listPosts = async (req, res) => {
    try {
        const publications = await Publication.find()
            .populate("user", "name")
            .populate("category", "name")
            .populate({ path: "comments", select: "comment" });

        if (publications.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No hay publicaciones disponibles",
            });
        }

        res.json({
            success: true,
            publications,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Error al obtener las publicaciones",
        });
    }
};

export const updatePost = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, text, categoryName } = req.body;
        const userId = req.usuario._id;

        if (!title && !text && !categoryName) {
            return res.status(400).json({
                success: false,
                message: "Debes proporcionar al menos un campo para actualizar",
            });
        }

        const publication = await Publication.findOne({ _id: id, user: userId });

        if (!publication) {
            return res.status(403).json({
                success: false,
                message: "No puedes editar esta publicación",
            });
        }

        if (categoryName) {
            const category = await Category.findOne({ name: categoryName });
            if (!category) {
                return res.status(404).json({
                    success: false,
                    message: "La categoría especificada no existe",
                });
            }
            publication.category = category._id;
        }

        if (title) publication.title = title;
        if (text) publication.text = text;

        await publication.save();

        res.json({
            success: true,
            message: "Publicación actualizada exitosamente",
            publication,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Error al actualizar la publicación",
        });
    }
};

export const deletePost = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.usuario._id;

        const publication = await Publication.findOne({ _id: id, user: userId });

        if (!publication) {
            return res.status(403).json({
                success: false,
                message: "No puedes eliminar esta publicación",
            });
        }

        const deletedPublication = await Publication.findByIdAndDelete(id);

        if (!deletedPublication) {
            return res.status(404).json({
                success: false,
                message: "Publicación no encontrada",
            });
        }

        res.status(200).json({
            success: true,
            message: "Publicación eliminada exitosamente",
            publicationId: id,
        });
    } catch (error) {
        console.error("Error al eliminar publicación:", error);
        res.status(500).json({
            success: false,
            message: "Error al eliminar la publicación",
            error: error.message,
        });
    }
};