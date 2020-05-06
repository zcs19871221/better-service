import defaultConfig, { EnvConfig } from './envconfig';

type Value = string;
export { Value };
export default class Env {
  private envs: Map<string, Value>;;
  private constructor(initConfig: EnvConfig) {
    this.envs = new Map(Object.entries(initConfig));
  }

  private static instance: Env | null = null;

  public static getInstance(): Env {
    if (Env.instance === null) {
      Env.instance = new Env(defaultConfig);
    }
    return <Env>Env.instance;
  }


  private checkKey(key: string) {
    if (!this.envs.has(key)) {
      throw new Error(`${key}不存在,请初始化`);
    }
  }

  set(key: keyof EnvConfig, value: Value) {
    this.checkKey(key);
    this.envs.set(key, value);
  }

  get(key: keyof EnvConfig): Value {
    this.checkKey(key)
    return <Value>this.envs.get(key);
  }
}
