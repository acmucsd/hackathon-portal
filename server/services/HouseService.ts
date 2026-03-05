import { Service } from "typedi";
import { Repositories, TransactionsManager } from "../repositories";
import { HouseHeadcountsResponse, HousePointsResponse } from "../types/ApiResponses";
import { House } from "../types/Enums";
import { UserModel } from "../models/UserModel";
import { NotFoundError } from "routing-controllers";

@Service()
export class HouseService {
  private transactionsManager: TransactionsManager;

  constructor(transactionsManager: TransactionsManager) {
    this.transactionsManager = transactionsManager;
  }

  public async getHouseHeadcounts(): Promise<HouseHeadcountsResponse> {
    const users = await this.transactionsManager.readOnly(async (entityManager) =>
      Repositories.user(entityManager).findAll(),
    );

    // initialize headcounts using House enum as keys
    const headcounts: HouseHeadcountsResponse = {
      ...Object.values(House).reduce((acc, house) => {
        acc[house] = 0;
        return acc;
      }, {} as Record<House, number>)
    };

    users.forEach(user => {
      headcounts[user.house]++;
    });

    return headcounts;
  }

  public async getLeastPopulated(): Promise<House> {
    const headcounts = await this.getHouseHeadcounts();

    let leastPopulatedHouse: House = House.GEISEL;
    let minCount = Infinity;

    for (const house of Object.values(House)) {
      if (headcounts[house] < minCount) {
        minCount = headcounts[house];
        leastPopulatedHouse = house;
      }
    }

    return leastPopulatedHouse;
  }

  public async getHousePoints(): Promise<HousePointsResponse> {
    const users = await this.transactionsManager.readOnly(async (entityManager) =>
      Repositories.user(entityManager).findAll(),
    );

    // initialize point counts using House enum as keys
    const pointCounts: HousePointsResponse = {
      ...Object.values(House).reduce((acc, house) => {
        acc[house] = 0;
        return acc;
      }, {} as Record<House, number>)
    };

    users.forEach(user => {
      pointCounts[user.house] += user.points;
    });

    return pointCounts;
  }
}