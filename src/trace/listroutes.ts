import app from '../app';
import RouteParser from './parseroute';

export default function checkRoute() {
  return new RouteParser(app).showAllRoute();
}
