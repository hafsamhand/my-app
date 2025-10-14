// Simple helper alias to use JwtStrategy as guard via provider pattern if needed.
// Here JwtStrategy is itself a CanActivate; you can also create a class wrapper if you prefer.
export { JwtStrategy as JwtAuthGuard } from './jwt.strategy';
