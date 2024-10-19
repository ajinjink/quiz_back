import { Controller, Post, Body } from '@nestjs/common';
import { EvaluateService } from './evaluate.service';
import { EvaluateDto } from './dto/evaluate.dto';


@Controller('evaluate')
export class EvaluateController {
    constructor(private readonly evaluateService: EvaluateService) {}

    @Post()
    async evaluate(@Body() evaluateDto: EvaluateDto) {
        console.log(evaluateDto);
        return this.evaluateService.evaluateAnswer(evaluateDto);
    }
}
