import { Injectable } from "@nestjs/common";
import { User } from "../entities";
import { UserMapper } from "../mappers/user";

@Injectable()
export class UserFactory {
  create(data: any): User {
    const userDomain = UserMapper.toDomain(data);
    return new User(userDomain);
  }

  update(id: string, data: any) {
    const userDomain = UserMapper.toDomain({ id, ...data });
    return new User(userDomain, {
      update: true,
    });
  }
}
