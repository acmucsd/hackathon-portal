import 'reflect-metadata';
import Container from 'typedi';
import { installDataSourceStub } from './helpers';

jest.mock('../FirebaseAuth', () => ({ auth: {}, adminAuth: {} }));

installDataSourceStub();

beforeEach(() => {
  installDataSourceStub();
});

afterEach(() => {
  Container.reset();
  installDataSourceStub();
});
