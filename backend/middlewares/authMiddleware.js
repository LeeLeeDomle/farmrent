import jwt from "jsonwebtoken";

const protect = (request, response, next) => {
    try {
        const authorizationHeader =
            request.headers.authorization;

        if (
            !authorizationHeader ||
            !authorizationHeader.startsWith("Bearer ")
        ) {
            return response.status(401).json({
                success: false,
                message: "Not authorized. Please login."
            });
        }

        const token =
            authorizationHeader.split(" ")[1];

        const decodedToken = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        request.user = decodedToken;

        next();
    } catch (error) {
        return response.status(401).json({
            success: false,
            message: "Invalid or expired token"
        });
    }
};

export default protect;