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

        const post = new Post({
            title,
            text,
            user: authenticatedUser._id,
            category: category._id,
        });

        await post.save();

        res.status(201).json({
            success: true,
            message: "Publicación creada exitosamente",
            post,
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
        const posts = await Post.find()
            .populate("user", "name") 
            .populate("category", "name") 
            .populate({
                path: "comments",
                select: "comment",
            });

        res.json({
            success: true,
            posts,
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

        const post = await Post.findOne({ _id: id, user: userId });

        if (!post) {
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

            post.category = category._id;
        }

        if (title) post.title = title;
        if (text) post.text = text;

        await post.save();

        res.json({
            success: true,
            message: "Publicación actualizada exitosamente",
            post,
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

        const post = await Post.findOne({ _id: id, user: userId });

        if (!post) {
            return res.status(403).json({
                success: false,
                message: "No puedes eliminar esta publicación",
            });
        }

        await Post.findByIdAndDelete(id);

        res.status(200).json({
            success: true,
            message: "Publicación eliminada exitosamente",
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
