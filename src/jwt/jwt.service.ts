import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtAuthService {
  constructor(private readonly jwtService: JwtService) {}

  async generateToken(payload: any) {
    try {
      const token = await this.jwtService.signAsync(payload, {
        secret: process.env.SECRET,
        expiresIn: '10h'
      })
      return token;
    } catch (error) {
      console.log(error);
    }
  }

  async verifyToken(token: string) {
    try {
      const decoded = await this.jwtService.verifyAsync(token, {
        secret: process.env.SECRET
      })
      return decoded;
    } catch (error) {
      console.log(error);
    }
  }
}
