import Env from './env';

export default function setEnv(query: object): string[] {
  const env = Env.getInstance();
  const setted: string[] = [];
  Object.entries(query).forEach(([key, value]: [string, any]) => {
    if (value) {
      setted.push(`${key}:${String(value)}`);
      env.set(<any>key, value);
    }
  });
  return setted;
}
