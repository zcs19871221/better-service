import { LevelStr } from '../logger';
import settings from '../settings'

interface EnvConfig {
  logger_level: LevelStr;
}


const config: EnvConfig = {
  'logger_level': settings.isDevelopment ? 'debug' : 'info'
}


export { EnvConfig }
export default config;
