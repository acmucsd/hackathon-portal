import Container from 'typedi';
import { DataSource } from 'typeorm';
import type { EntityTarget, ObjectLiteral, Repository } from 'typeorm';

type RepositoryOverrides<Entity extends ObjectLiteral = ObjectLiteral> =
  Partial<Repository<Entity>> & Record<string, unknown>;

export function createRepositoryStub<Entity extends ObjectLiteral = ObjectLiteral>(
  overrides: RepositoryOverrides<Entity> = {},
): Repository<Entity> {
  const repository: Record<string, unknown> = {
    find: jest.fn(),
    findOne: jest.fn(),
    findOneBy: jest.fn(),
    findBy: jest.fn(),
    save: jest.fn(),
    delete: jest.fn(),
    create: jest.fn((entity?: Entity) => entity),
    createQueryBuilder: jest.fn(),
    ...overrides,
  };

  repository.extend = jest.fn((extensions: object) => Object.assign(repository, extensions));

  return repository as unknown as Repository<Entity>;
}

export function installDataSourceStub(
  getRepository = <Entity extends ObjectLiteral>(
    _target: EntityTarget<Entity>,
  ): Repository<Entity> => createRepositoryStub<Entity>(),
): void {
  Container.set(DataSource, { getRepository } as unknown as DataSource);
}
