import { Code } from '../entities/code';
import { DateValuesObject } from '../values-object/date';
import { UserMapper, UserResponse } from './user';

export interface CodeResponse {
  id: string;
  user_id: string;
  code: string;
  used: boolean;
  created_at: string;
  updated_at: string;
  user: UserResponse;
}

export class CodeMapper {
  static toDomain(raw: any): Code {
    return new Code({
      id: raw?.id,
      user_id: raw?.user_id,
      code: raw?.code,
      used: raw?.used,
      created_at: new DateValuesObject(raw?.created_at).toDate(),
      updated_at: new DateValuesObject(raw?.updated_at).toDate(),
      user: raw?.user,
    });
  }

  static toResponse(code: Code): CodeResponse {
    return {
      id: code.id,
      user_id: code.user_id,
      code: code.code,
      used: code.used,
      created_at: new DateValuesObject(code.created_at).toISOString(),
      updated_at: new DateValuesObject(code.updated_at).toISOString(),
      user: UserMapper.toResponse(code.user),
    };
  }
}
