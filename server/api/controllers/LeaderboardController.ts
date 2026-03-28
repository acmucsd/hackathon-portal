import { Get, JsonController, UseBefore } from 'routing-controllers';
import { Service } from 'typedi';
import { HouseService } from '../../services/HouseService';
import { HouseLeaderboardResponse } from '../../types/ApiResponses';
import { House } from '../../types/Enums';
import { AuthenticatedUser } from '../decorators/AuthenticatedUser';
import { UserModel } from '../../models/UserModel';
import PermissionsService from '../../services/PermissionsService';
import { UserAuthentication } from '../middleware/UserAuthentication';

@JsonController('/leaderboard')
@Service()
export class LeaderboardController {
  private permissionsService: PermissionsService;

  private houseService: HouseService;

  constructor(
    permissionsService: PermissionsService,
    houseService: HouseService,
  ) {
    this.permissionsService = permissionsService;
    this.houseService = houseService;
  }

  @UseBefore(UserAuthentication)
  @Get()
  async houseLeaderboard(
    @AuthenticatedUser() user: UserModel,
  ): Promise<HouseLeaderboardResponse> {
    const pointsByHouse = await this.houseService.getHousePoints();

    const leaderboard = Object.entries(pointsByHouse)
      .sort(([, pointsA], [, pointsB]) => pointsB - pointsA)
      .map(([house]) => house as House);

    return { error: null, leaderboard };
  }
}