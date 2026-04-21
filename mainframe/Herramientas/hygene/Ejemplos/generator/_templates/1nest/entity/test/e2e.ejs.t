---
to: test-src/modules/<%= h.changeCase.param(name) %>/tests/e2e.spect.ts
---
<% 
Name = h.changeCase.pascal(name) 
Lname = h.changeCase.camel(name)
kname = h.changeCase.kebabCase(name)
IdName = Name + 'IdVo'
LIdName = kname + '-vos'  
-%>
export * from './domain/<%= h.changeCase.camel(name) %>.entity';
export * from './application/<%= h.changeCase.camel(name) %>.usecase-funnel';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { <%= Name %>Module } from '../<%= Lname %>.module';

describe('<%= Name %>Controller (E2E)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [<%= Name %>Module],
    }).compile();

    app = moduleFixture.createNestApplication();
    
    // IMPORTANTE: Usa los pipes de validación para que los DTOs funcionen [cite: 192]
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/<%= Lname %> (POST) - Debería crear un <%= Lname %> exitosamente', () => {
    return request(app.getHttpServer())
      .post('/<%= Lname %>')
      .send({
        name: 'Geronimo',
        email: 'gero@test.com'
      })
      .expect(201); // Creado
  });

  it('/<%= Lname %> (POST) - Debería fallar si el email es inválido (Regla de Dominio/DTO)', () => {
    return request(app.getHttpServer())
      .post('/<%= Lname %>')
      .send({
        name: 'Geronimo',
        email: 'email-invalido' // Esto debería ser atrapado por @IsEmail() en tu DTO [cite: 194]
      })
      .expect(400); // Bad Request
  });
});