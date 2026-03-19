import { Service } from 'typedi';
import { BadRequestError, NotFoundError } from 'routing-controllers';
import { Repositories, TransactionsManager } from '../repositories';
import { UserModel } from '../models/UserModel';

const FETCH_AI_LINK_PATTERN =
  /^https?:\/\/asi1\.ai\/ai\/([a-zA-Z0-9_-]+)\/?(?:\?.*)?$/;
const BLOCKED_FETCH_AI_USERNAMES = new Set([
  'sherlockholmes',
  'example',
  'test',
  'yourusername',
  'your-username',
]);
const FETCH_AI_HANDLE_POINTS = 15;

@Service()
export class FetchAiHandleValidationService {
  private transactionsManager: TransactionsManager;

  constructor(transactionsManager: TransactionsManager) {
    this.transactionsManager = transactionsManager;
  }

  public async validateOrThrow(
    currentUserId: string,
    link: string,
  ): Promise<void> {
    const usernameMatch = FETCH_AI_LINK_PATTERN.exec(link);
    if (!usernameMatch) {
      throw new BadRequestError(
        'Invalid link. Must be in the format: https://asi1.ai/ai/<username>',
      );
    }

    const username = usernameMatch[1].toLowerCase();
    if (BLOCKED_FETCH_AI_USERNAMES.has(username)) {
      throw new BadRequestError(
        `'${username}' is an example agent from the docs. Please submit your own agent link.`,
      );
    }

    await this.ensureAgentExists(username);
    await this.ensureUsernameNotTaken(currentUserId, username);
  }

  public async updateFetchAiHandle(
    currentUserId: string,
    fetchAiHandle: string | null,
  ): Promise<UserModel> {
    if (fetchAiHandle !== null) {
      await this.validateOrThrow(currentUserId, fetchAiHandle);
    }

    return this.transactionsManager.readWrite(async (entityManager) => {
      const userRepository = Repositories.user(entityManager);
      const existingUser = await userRepository.findById(currentUserId);
      if (!existingUser) throw new NotFoundError('User not found');

      const hadHandle = existingUser.fetchAiHandle !== null;
      const hasHandle = fetchAiHandle !== null;

      if (!hadHandle && hasHandle) {
        existingUser.points += FETCH_AI_HANDLE_POINTS;
      } else if (hadHandle && !hasHandle) {
        existingUser.points -= FETCH_AI_HANDLE_POINTS;
      }

      existingUser.fetchAiHandle = fetchAiHandle;
      return userRepository.save(existingUser);
    });
  }

  private async ensureAgentExists(username: string): Promise<void> {
    const apiUrl = `https://asi1.ai/p/platform/v2/public/agents/shared_agent/${username}`;
    let response: Response;

    try {
      response = await fetch(apiUrl, {
        headers: { Accept: 'application/json' },
        signal: AbortSignal.timeout(10000),
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Unknown network error';
      throw new BadRequestError(
        `Could not reach asi1.ai to verify link: ${message}`,
      );
    }

    if (response.status === 404) {
      throw new BadRequestError(
        `Agent '${username}' does not exist on asi1.ai.`,
      );
    }

    if (response.status !== 200) {
      throw new BadRequestError(
        `Could not verify agent. API returned status ${response.status}.`,
      );
    }
  }

  private async ensureUsernameNotTaken(
    currentUserId: string,
    username: string,
  ): Promise<void> {
    await this.transactionsManager.readOnly(async (entityManager) => {
      const userRepository = Repositories.user(entityManager);

      const usersWithHandles = await userRepository
        .createQueryBuilder('user')
        .select(['user.id', 'user.fetchAiHandle'])
        .where('user.fetchAiHandle IS NOT NULL')
        .andWhere('user.id != :currentUserId', { currentUserId })
        .getMany();

      for (const existingUser of usersWithHandles) {
        if (!existingUser.fetchAiHandle) continue;

        const existingMatch = FETCH_AI_LINK_PATTERN.exec(
          existingUser.fetchAiHandle.trim(),
        );
        if (!existingMatch) continue;

        const existingUsername = existingMatch[1].toLowerCase();
        if (existingUsername === username) {
          throw new BadRequestError(
            `Duplicate link. Username '${username}' has already been submitted.`,
          );
        }
      }
    });
  }
}
