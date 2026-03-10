import { Service } from 'typedi';
import { Repositories, TransactionsManager } from '../repositories';
import { HouseHeadcountsResponse, HousePointsResponse } from '../types/ApiResponses';
import { House } from '../types/Enums';

@Service()
export class HouseService {
  private transactionsManager: TransactionsManager;

  constructor(transactionsManager: TransactionsManager) {
    this.transactionsManager = transactionsManager;
  }

  public async getHouseHeadcounts(): Promise<HouseHeadcountsResponse> {
    const counts = await this.transactionsManager.readOnly(async (entityManager) =>
      Repositories.user(entityManager).getHeadcountsByHouse(),
    );

    const headcounts: HouseHeadcountsResponse = Object.values(House).reduce((acc, house) => {
      acc[house] = 0;
      return acc;
    }, {} as Record<House, number>);

    counts.forEach(({ house, count }) => {
      headcounts[house] = Number(count);
    });

    return headcounts;
  }

  public async getLeastPopulated(): Promise<House> {
    const counts = await this.transactionsManager.readOnly(async (entityManager) =>
      Repositories.user(entityManager).getHeadcountsByHouse(),
    );

    let leastPopulatedHouse: House = House.GEISEL;
    let minCount = Infinity;

    const countMap = new Map(counts.map(({ house, count }) => [house, Number(count)]));
    for (const house of Object.values(House)) {
      const count = countMap.get(house) ?? 0;
      if (count < minCount) {
        minCount = count;
        leastPopulatedHouse = house;
      }
    }

    return leastPopulatedHouse;
  }

  public async getHousePoints(): Promise<HousePointsResponse> {
    const sums = await this.transactionsManager.readOnly(async (entityManager) =>
      Repositories.user(entityManager).getPointsSumByHouse(),
    );

    const pointCounts: HousePointsResponse = Object.values(House).reduce((acc, house) => {
      acc[house] = 0;
      return acc;
    }, {} as Record<House, number>);

    sums.forEach(({ house, points }) => {
      pointCounts[house] = Number(points);
    });

    return pointCounts;
  }
}