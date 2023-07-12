import { DataSource } from 'typeorm';
import AiChat from './entity/AiChat';
import Learn from './entity/Learn';
import OpenAi from './entity/OpenAi';
import Plus from './entity/Plus';

// create a type that allows for only two string values and allows strings to be used as keys
export type DataSourceTypeOptions = 'better-sqlite3' | 'mysql';

const entities = [Learn, Plus, AiChat, OpenAi];

// create a data source based on the input
export const createDataSource = (type: DataSourceTypeOptions) => {
  if (type === 'better-sqlite3') {
    return new DataSource({
      type: 'better-sqlite3',
      database: `./db/${process.env.DB_NAME || 'local.db'}`,
      synchronize: true,
      logging: true,
      entities,
      subscribers: [],
      migrations: [],
    });
  } else if (type === 'mysql') {
    return new DataSource({
      type: 'mysql',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '3306', 10),
      username: process.env.DB_USER || 'root',
      password: process.env.DB_PASS || 'root',
      database: process.env.DB_NAME || 'local',
      synchronize: true,
      logging: true,
      entities,
      subscribers: [],
      migrations: [],
    });
  } else {
    throw new Error('Invalid data source type');
  }
};
