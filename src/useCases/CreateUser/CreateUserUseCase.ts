import { User } from '../../entities/User';
import { IMailProvider } from '../../providers/IMailProvider';
import { IUsersRepository } from '../../repositories/IUsersRepository';
import { ICreateUserRequestDTO } from './ICreateUserRequestDTO';

export class CreateUserUseCase {
  public constructor(
    private usersRepository: IUsersRepository,
    private mailProvider: IMailProvider,
  ) {}

  public async execute(data: ICreateUserRequestDTO) {
    const userAlreadyExists = await this.usersRepository.findByEmail(data.email);

    if (userAlreadyExists) {
      throw new Error('User already exists.');
    }

    const user = new User(data);

    await this.usersRepository.save(user);

    this.mailProvider.sendMail({
      to: {
        name: data.name,
        email: data.email,
      },
      from: {
        name: 'Equipe do meu app',
        email: 'equipe@meuapp.com',
      },
      subject: 'Seja bem-vindo à plataforma',
      body: '<p>Você já pode fazer login em nossa plataforma.</p>',
    });
  }
}
