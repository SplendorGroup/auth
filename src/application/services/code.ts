import { Inject, Injectable } from '@nestjs/common';
import { IRepository } from '@/domain/interfaces/irepository';
import { Code } from '@/domain/entities';

@Injectable()
export class CodeService {
  @Inject('code')
  public readonly code: IRepository<'code'>;

  async findAll(code?: Partial<Code>): Promise<Partial<Code>[]> {
    return await this.code.findAll(code);
  }

  async findById(id: string): Promise<Partial<Code>> {
    return await this.code.findById(id);
  }

  async findOne(code: Partial<Code>): Promise<Partial<Code>> {
    return await this.code.findOne(code);
  }

  async create(code: Code): Promise<Partial<Code>> {
    return await this.code.create(code);
  }

  async update(id: string, code: Partial<Code>): Promise<Partial<Code>> {
    return (await this.code.update(id, code)) as unknown as Partial<Code>;
  }

  async delete(id: string): Promise<void> {
    return await this.code.deleteById(id);
  }

  async count(code: Partial<Code>): Promise<number> {
    return await this.code.count(code);
  }
}
