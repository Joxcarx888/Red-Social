import Category from "./category.model.js";

export const createCategory = async (req, res) => {
  try {
    const authenticatedUser = req.usuario;

    if (!authenticatedUser || authenticatedUser.role !== "ADMIN") {
      return res.status(403).json({
        success: false,
        message: "No tienes permisos para crear una categoría",
      });
    }

    const { name } = req.body;
    const existingCategory = await Category.findOne({ name });

    if (existingCategory) {
      return res.status(400).json({
        success: false,
        message: "La categoría ya existe",
      });
    }

    const category = new Category({ name });
    await category.save();

    res.status(201).json({
      success: true,
      message: "Categoría creada exitosamente",
      category,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al crear la categoría",
      error,
    });
  }
};

export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const authenticatedUser = req.usuario;

    if (!authenticatedUser || authenticatedUser.role !== "ADMIN") {
      return res.status(403).json({
        success: false,
        message: "No tienes permisos para editar esta categoría",
      });
    }

    const updatedCategory = await Category.findByIdAndUpdate(id, req.body, { new: true });

    if (!updatedCategory) {
      return res.status(404).json({
        success: false,
        message: "Categoría no encontrada",
      });
    }

    res.json({
      success: true,
      message: "Categoría actualizada exitosamente",
      category: updatedCategory,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al actualizar la categoría",
      error,
    });
  }
};

export const listCategories = async (req, res) => {
  try {
    const categories = await Category.find({ status: true });

    res.json({
      success: true,
      categories,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al obtener las categorías",
      error,
    });
  }
};

export const deleteCategory = async (req, res) => {
    try {
      const { id } = req.params;
      const authenticatedUser = req.usuario;
  
      if (!authenticatedUser || authenticatedUser.role !== "ADMIN") {
        return res.status(403).json({
          success: false,
          message: "No tienes permisos para eliminar esta categoría",
        });
      }
  
      const category = await Category.findByIdAndUpdate(id, { status: false }, { new: true });
  
      res.status(200).json({
        success: true,
        message: "Categoría eliminada exitosamente",
        category,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error al eliminar categoría",
        error,
      });
    }
  };
  
