import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
import { EvaluateDto } from './dto/evaluate.dto';

@Injectable()
export class EvaluateService {
  private openai: OpenAI;

  constructor(private configService: ConfigService) {
    this.openai = new OpenAI({
      apiKey: this.configService.get<string>('OPENAI_API_KEY'),
    });
  }

  async evaluateAnswer(evaluateDto: EvaluateDto) {
    const prompt = `
      Question: "${evaluateDto.question}"
      Correct answer: "${evaluateDto.answer}"
      User's answer: "${evaluateDto.user_answer}"

      Evaluate if the user's answer is correct or similar enough to the correct answer.
      Respond with a JSON object containing two fields:
      1. "is_correct": a boolean indicating if the answer is correct or close enough
      2. "explanation": a brief explanation of why the answer is considered correct or incorrect

      Your response should be a valid JSON object and nothing else. Do not include any additional text, markdown formatting, or code blocks.
      And explanation should be in Korean.
    `;
    console.log(prompt);

    try {
        if (evaluateDto.question === undefined) throw new Error('Received wrong data');
        const response = await this.openai.chat.completions.create({
          model: 'gpt-4o-mini',
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.3,
        });
  
        const content = response.choices[0].message.content;
  
        let result;
        try {
          result = JSON.parse(content.trim());
        } catch (parseError) {
          const match = content.match(/```json\s*(\{[\s\S]*\})\s*```/);
          if (match) {
            result = JSON.parse(match[1].trim());
          } else {
            throw new Error('Unable to parse API response');
          }
        }
  
        if (typeof result.is_correct !== 'boolean' || typeof result.explanation !== 'string') {
          throw new Error('Invalid response format from API');
        }
  
        return result;
    } catch (error) {
        throw new Error('Failed to evaluate answer');
    }
  }
}