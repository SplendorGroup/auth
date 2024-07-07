import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Infraestructure } from './infraestructure';
import { Application } from './application';
import { Presentation } from './presentation';
import { Domain } from './domain';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    Infraestructure,
    Domain,
    Application,
    Presentation
  ],
})
export class App {}
