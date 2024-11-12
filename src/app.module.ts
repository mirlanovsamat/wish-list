import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { dataSourceOptions } from 'database/data-source';
import { WishesModule } from './modules/wishes/wishes.module';
import { StaticObjectsModule } from './modules/static-objects/static-objects.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(dataSourceOptions),
    AuthModule,
    UsersModule,
    WishesModule,
    StaticObjectsModule,
  ],
  providers: [],
})
export class AppModule {}
