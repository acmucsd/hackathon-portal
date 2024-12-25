import { Get, JsonController, UseBefore } from "routing-controllers";
import { UserAuthentication } from "../../middleware/UserAuth";
import { Service } from "typedi";


@JsonController('/auth')
@Service()
export class AuthController {

  // @UseBefore(UserAuthentication)
  @Get('/verifyToken')
  async verifyToken(req: any) {
    console.log("server verifyToken whoami");

    // Access the user from the request (added by the middleware)
    // const isValidAuthToken = !!req.user;
    // return { error: null, message: 'Token verified successfully!', authenticated: isValidAuthToken };
    return {
      success: true,
      message: 'whoAmI endpoint is working!',
      data: {
        testValue: 123,
        status: 'ok'
      }
    };
  }

}
