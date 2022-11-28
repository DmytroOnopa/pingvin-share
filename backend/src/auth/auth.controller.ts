import {
  Body,
  Controller,
  ForbiddenException,
  HttpCode,
  Post,
} from "@nestjs/common";
import { Throttle } from "@nestjs/throttler";
import { ConfigService } from "src/config/config.service";
import { AuthService } from "./auth.service";
import { AuthRegisterDTO } from "./dto/authRegister.dto";
import { AuthSignInDTO } from "./dto/authSignIn.dto";
import { RefreshAccessTokenDTO } from "./dto/refreshAccessToken.dto";

@Controller("auth")
export class AuthController {
  constructor(
    private authService: AuthService,
    private config: ConfigService
  ) {}

  @Throttle(10, 5 * 60)
  @Post("signUp")
  async signUp(@Body() dto: AuthRegisterDTO) {
    if (!this.config.get("allowRegistration"))
      throw new ForbiddenException("Registration is not allowed");
    return this.authService.signUp(dto);
  }

  @Throttle(10, 5 * 60)
  @Post("signIn")
  @HttpCode(200)
  signIn(@Body() dto: AuthSignInDTO) {
    return this.authService.signIn(dto);
  }

  @Post("token")
  @HttpCode(200)
  async refreshAccessToken(@Body() body: RefreshAccessTokenDTO) {
    const accessToken = await this.authService.refreshAccessToken(
      body.refreshToken
    );
    return { accessToken };
  }
}
