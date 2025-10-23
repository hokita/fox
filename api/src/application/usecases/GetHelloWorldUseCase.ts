import { Message } from '../../domain/entities/Message'

export class GetHelloWorldUseCase {
  execute(): Message {
    return {
      content: 'Hello World',
    }
  }
}
