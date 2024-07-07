import { compareSync, genSaltSync, hashSync } from 'bcrypt';

export function hashEncrypt(text: string): string {
  return hashSync(text, genSaltSync(12));
}

export function hashCompare(hash: string, compare_hash: string): boolean {
  return compareSync(hash, compare_hash);
}
