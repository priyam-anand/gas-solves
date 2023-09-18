import { DataSourceOptions } from 'typeorm';

export interface DBConfig {
  entities: DataSourceOptions['entities'];
}
