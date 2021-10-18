import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import { join } from 'path';
import { parse } from 'dotenv';

@Injectable()
export class EnvironmentService {
  private readonly env: { [key: string]: string };

  constructor() {
    const path = join(__dirname, '../../', '.env');
    const existsFile = fs.existsSync(path);

    if (!existsFile) {
      console.log('File not found.');
      process.exit(0);
    }

    this.env = parse(fs.readFileSync(path));
  }

  get(key: string): string {
    return this.env[key];
  }
}
