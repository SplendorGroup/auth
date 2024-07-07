import { randomBytes } from 'crypto';

export function generateCodeWithSixNumbers(): string {
  return Math.floor(Math.random() * 1000000)
    .toString()
    .padStart(6, '0');
}

export function generateOpacToken() {
  return randomBytes(16).toString('hex');
}
