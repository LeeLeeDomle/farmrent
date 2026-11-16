import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

const registerUser = async (request, response) => {
    try {
        const {
            name,
            email,
            phone,
            location,
            address,
            password
        } = request.body;

        if (
            !name ||
            !email ||
            !phone ||
            !location ||
            !address ||
            !password
        ) {
            return response.status(400).json({
                success: false,
                message: "Please provide all required fields"
            });
        }

        if (password.length < 6) {
            return response.status(400).json({
                success: false,
                message: "Password must be at least 6 characters"
            });
        }

        const existingUser = await User.findOne({
            email: email.toLowerCase()
        });

        if (existingUser) {
            return response.status(409).json({
                success: false,
                message: "An account with this email already exists"
            });
        }

        const hashedPassword = await bcrypt.hash(
            password,
            10
        );

        const user = await User.create({
            name,
            email: email.toLowerCase(),
            phone,
            location,
            address,
            password: hashedPassword
        });

        response.status(201).json({
            success: true,
            message: "Account created successfully",
            data: {
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                location: user.location,
                address: user.address,
                role: user.role
            }
        });
    } catch (error) {
        response.status(500).json({
            success: false,
            message: "Failed to create account",
            error: error.message
        });
    }
};

const loginUser = async (request, response) => {
    try {
        const { email, password } = request.body;

        if (!email || !password) {
            return response.status(400).json({
                success: false,
                message: "Please provide email and password"
            });
        }

        const user = await User.findOne({
            email: email.toLowerCase()
        });

        if (!user) {
            return response.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        const passwordMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!passwordMatch) {
            return response.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        const token = jwt.sign(
            {
                id: user._id,
                role: user.role
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "7d"
            }
        );

        response.status(200).json({
            success: true,
            message: "Login successful",
            token,
            data: {
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                location: user.location,
                address: user.address,
                role: user.role
            }
        });
    } catch (error) {
        response.status(500).json({
            success: false,
            message: "Failed to login",
            error: error.message
        });
    }
};

const getUserProfile = async (request, response) => {
    try {
        const user = await User.findById(
            request.user.id
        ).select("-password");

        if (!user) {
            return response.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        response.status(200).json({
            success: true,
            data: user
        });
    } catch (error) {
        response.status(500).json({
            success: false,
            message: "Failed to fetch profile",
            error: error.message
        });
    }
};

const updateUserProfile = async (request, response) => {
    try {
        const {
            name,
            phone,
            location,
            address
        } = request.body;

        const user = await User.findById(
            request.user.id
        );

        if (!user) {
            return response.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        if (name !== undefined) {
            user.name = name;
        }

        if (phone !== undefined) {
            user.phone = phone;
        }

        if (location !== undefined) {
            user.location = location;
        }

        if (address !== undefined) {
            user.address = address;
        }

        await user.save();

        response.status(200).json({
            success: true,
            message: "Profile updated successfully",
            data: {
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                location: user.location,
                address: user.address,
                role: user.role
            }
        });
    } catch (error) {
        response.status(500).json({
            success: false,
            message: "Failed to update profile",
            error: error.message
        });
    }
};

export {
    registerUser,
    loginUser,
    getUserProfile,
    updateUserProfile
};