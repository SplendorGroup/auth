import { Injectable } from '@nestjs/common';
import { Code } from '../entities';
import { CodeMapper } from '../mappers/code';

@Injectable()
export class CodeFactory {
  create(data: any) {
    const role_domain = CodeMapper.toDomain(data);
    const role = new Code(role_domain);
    return CodeMapper.toPersistence(role);
  }

  update(id: string, data: any) {
    const role_domain = CodeMapper.toDomain({ id, ...data });
    const role = new Code(role_domain, {
      update: true,
    });
    return CodeMapper.toPersistence(role);
  }
}
