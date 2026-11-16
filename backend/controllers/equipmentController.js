import Equipment from "../models/equipmentModel.js";

const getEquipment = async (request, response) => {
    try {
        const equipment = await Equipment.find().sort({ createdAt: -1 });

        response.status(200).json({
            success: true,
            count: equipment.length,
            data: equipment
        });
    } catch (error) {
        response.status(500).json({
            success: false,
            message: "Failed to fetch equipment",
            error: error.message
        });
    }
};

const getEquipmentById = async (request, response) => {
    try {
        const equipment = await Equipment.findById(request.params.id);

        if (!equipment) {
            return response.status(404).json({
                success: false,
                message: "Equipment not found"
            });
        }

        response.status(200).json({
            success: true,
            data: equipment
        });
    } catch (error) {
        response.status(500).json({
            success: false,
            message: "Failed to fetch equipment",
            error: error.message
        });
    }
};

const createEquipment = async (request, response) => {
    try {
        const equipment = await Equipment.create(request.body);

        response.status(201).json({
            success: true,
            message: "Equipment created successfully",
            data: equipment
        });
    } catch (error) {
        response.status(400).json({
            success: false,
            message: "Failed to create equipment",
            error: error.message
        });
    }
};

const updateEquipment = async (request, response) => {
    try {
        const equipment = await Equipment.findByIdAndUpdate(
            request.params.id,
            request.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!equipment) {
            return response.status(404).json({
                success: false,
                message: "Equipment not found"
            });
        }

        response.status(200).json({
            success: true,
            message: "Equipment updated successfully",
            data: equipment
        });
    } catch (error) {
        response.status(400).json({
            success: false,
            message: "Failed to update equipment",
            error: error.message
        });
    }
};

const deleteEquipment = async (request, response) => {
    try {
        const equipment = await Equipment.findByIdAndDelete(
            request.params.id
        );

        if (!equipment) {
            return response.status(404).json({
                success: false,
                message: "Equipment not found"
            });
        }

        response.status(200).json({
            success: true,
            message: "Equipment deleted successfully"
        });
    } catch (error) {
        response.status(500).json({
            success: false,
            message: "Failed to delete equipment",
            error: error.message
        });
    }
};

export {
    getEquipment,
    getEquipmentById,
    createEquipment,
    updateEquipment,
    deleteEquipment
};