import { Injectable } from "@nestjs/common";
import { User } from "../entities";
import { UserMapper } from "../mappers/user";

@Injectable()
export class UserFactory {
  create(data: any) {
    const user_domain = UserMapper.toDomain(data);
    const user = new User(user_domain);
    return UserMapper.toPersistence(user)
  }

  update(id: string, data: any) {
    const user_domain = UserMapper.toDomain({ id, ...data });
    const user = new User(user_domain, {
      update: true,
    });
    return UserMapper.toPersistence(user) 
  }
}
