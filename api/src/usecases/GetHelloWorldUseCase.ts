import { Message } from '../entities/Message';

export class GetHelloWorldUseCase {
  execute(): Message {
    return {
      content: 'Hello World'
    };
  }
}
