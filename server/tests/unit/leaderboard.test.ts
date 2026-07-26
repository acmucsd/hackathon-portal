import { LeaderboardController } from '../../api/controllers/LeaderboardController';
import { UserModel } from '../../models/UserModel';
import PermissionsService from '../../services/PermissionsService';
import type { HouseService } from '../../services/HouseService';
import { House } from '../../types/Enums';

describe('When a user requests the house leaderboard', () => {
  test('Then, houses are returned sorted by points descending', async () => {
    const currentUser = new UserModel();

    const controller = new LeaderboardController(
      new PermissionsService(),
      {
        getHousePoints: jest.fn().mockResolvedValue({
          [House.GEISEL]: 25,
          [House.SUN_GOD]: 40,
          [House.TRITON]: 10,
          [House.RACCOON]: 30,
        }),
      } as unknown as HouseService,
    );

    const result = await controller.houseLeaderboard(currentUser);

    expect(result).toEqual({
      error: null,
      leaderboard: [
        House.SUN_GOD,
        House.RACCOON,
        House.GEISEL,
        House.TRITON,
      ],
    });
  });
});
