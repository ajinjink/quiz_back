import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EvaluateController } from './evaluate.controller';
import { EvaluateService } from './evaluate.service';

@Module({
  imports: [ConfigModule],
  controllers: [EvaluateController],
  providers: [EvaluateService],
})
export class EvaluateModule {}