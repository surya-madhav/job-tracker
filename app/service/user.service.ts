import { BaseService } from './base.service';
import { UserSchema, UserUpdateSchema } from './zod.schema';

export class UserService extends BaseService {
  constructor() {
    super(
      prisma.user,
      UserSchema,
      UserUpdateSchema,
      ['name', 'email'],
      {
        jobs: true,
        contacts: true,
        resumes: true,
      }
    );
  }

  async create(data: any) {
    const validated = this.createSchema.parse(data);
    const hashedPassword = await hashPassword(validated.password);
    
    return this.model.create({
      data: {
        ...validated,
        password: hashedPassword,
      },
      include: this.defaultIncludes,
    });
  }

  async findByEmail(email: string) {
    return this.model.findUnique({
      where: { email },
      include: this.defaultIncludes,
    });
  }
}