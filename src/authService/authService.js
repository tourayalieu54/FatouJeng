import jwt from 'jsonwebtoken';

const JWT_SECRET = "y0uc@n\'t_S*Ar?E-%-AnY-O*N*E";
export const AuthService = {
  generateToken: (id, emailAddress, role) =>
    jwt.sign({ id, emailAddress, role }, JWT_SECRET, { expiresIn: '1d' }),

  verifyToken: (token) => {
    try {
      return jwt.verify(token, JWT_SECRET);
    } catch (error) {
      console.error('Token verification failed:', error);
      return null;
    }
  }
};
