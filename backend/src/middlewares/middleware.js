import { AuthService } from '../authService/authService.js';

// Protect routes
export async function authMiddleware(req, res, next) {
  const token = req.header('Authorization')?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Access denied, token missing' });
  }

  const decoded = AuthService.verifyToken(token);
  if (!decoded) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }

  req.user = decoded;
  next();
}

// Role guard
export function authorizeRole(requiredRoles) {
  return (req, res, next) => {
    const userRole = req.user?.role;
    if (!requiredRoles.includes(userRole)) {
      return res.status(403).json({ message: 'Forbidden: Insufficient permissions' });
    }
    next();
  };
}
