export function buildRoutePath(path) {
  const routeGetId = /:([a-zA-Z]+)/g
  const t = /:([a-z0-9\-_]+)/g
  const pathWithParamsReplaced = path.replaceAll(routeGetId, '(?<$1>[a-z0-9\-_]+)');

  const pathRegex = new RegExp(`^${pathWithParamsReplaced}(?<query>\\?(.*))?$`);
  return pathRegex;
}