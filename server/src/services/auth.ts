
import jwt from "jsonwebtoken";

import dotenv from "dotenv";
dotenv.config();

interface JwtPayload {
  username: string;
    email: string;
    userId: unknown;
}

export const signToken = (username: string, email: string, userId: unknown): string => {
  const payload = { username, email, userId };
  return jwt.sign(payload, process.env.JWT_SECRET as string, {
    expiresIn: '2h', // Token expiration time
  });
}

export const authenticateToken = ({req}:{req: any})=>{
    const token = req.headers.authorization?.split(' ')[1]; // Assuming Bearer token format
    if (!token) return req;
    
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload; // Verify the token and decode it
        req.user = decoded ;  // Attach the decoded token payload to the request object
        return req; // Return the decoded token payload
    } catch (error) {
        console.error('Token verification failed:', error);
        return req; // Return null if verification fails
    }
}