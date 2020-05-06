import app from '../app';
import RouteParser from './parseroute';

export default function checkRoute(path: string, method: string) {
  return new RouteParser(app).checkPath(path, method);
}
