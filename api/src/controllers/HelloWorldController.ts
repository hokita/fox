import { Request, Response } from 'express';
import { GetHelloWorldUseCase } from '../usecases/GetHelloWorldUseCase';

export class HelloWorldController {
  private getHelloWorldUseCase: GetHelloWorldUseCase;

  constructor() {
    this.getHelloWorldUseCase = new GetHelloWorldUseCase();
  }

  getHelloWorld(req: Request, res: Response): void {
    const message = this.getHelloWorldUseCase.execute();
    res.json(message);
  }
}
