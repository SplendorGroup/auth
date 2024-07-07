import { Injectable } from '@nestjs/common';
import { Code } from '../entities';
import { CodeMapper } from '../mappers/code';

@Injectable()
export class CodeFactory {
  create(data: any): Code {
    const roleDomain = CodeMapper.toDomain(data);
    return roleDomain;
  }

  update(id: string, data: any): Code {
    const roleDomain = CodeMapper.toDomain({ id, ...data });
    return new Code(roleDomain, {
      update: true,
    });
  }
}
