class RouteParser {
  _middles: any;
  constructor(app: { _router: { stack: any[] } }) {
    this._middles = [];
    app._router.stack.forEach((layer: any) => this._collect({ layer }));
    this._middles = this._middles.slice(2);
  }

  _collect({ path = [], layer }: { path?: any; layer: any }) {
    const isRoute = layer.route;
    const isRouter = layer.name === 'router' && layer.handle.stack;
    if (isRoute || isRouter) {
      let entity = [];
      let curPath: never[] = [];
      if (isRoute) {
        entity = layer.route;
        curPath = layer.route.path;
      } else {
        entity = layer.handle;
        curPath = layer.regexp;
      }
      return entity.stack.forEach((eachLayer: any) => {
        this._collect({
          path: path.concat(this._split(curPath)),
          layer: eachLayer,
        });
      });
    }
    const method = layer.method || 'all';
    const funcName = layer.name;
    const handlePath = `/${path
      .concat(this._split(layer.regexp))
      .filter(Boolean)
      .join('/')}`;
    return this._middles.push({
      method: method.toUpperCase().trim(),
      path: handlePath.trim(),
      funcName,
    });
  }

  // eslint-disable-next-line class-methods-use-this
  _split(thing: any) {
    if (typeof thing === 'string') {
      return thing.split('/');
    }
    if (thing.fast_slash) {
      return '';
    }
    const match = thing
      .toString()
      .replace('\\/?', '')
      .replace('(?=\\/|$)', '$')
      .match(/^\/\^((?:\\[.*+?^${}()|[\]\\/]|[^.*+?^${}()|[\]\\/])*)\$\//u);
    return match
      ? match[1].replace(/\\(.)/gu, '$1').split('/')
      : `<complex:${thing.toString()}>`;
  }

  checkPath(targetPath: string, targetMethod: string) {
    const formatTitle = (msg: string) => `${msg}:`;
    const middles = this._middles;
    const isMatchMethod = (input: any, target: string) => {
      return input && (target === input || target === 'ALL');
    };
    const isIncludePath = (input: string, target: any) => {
      return input && input.startsWith(target);
    };
    targetPath = targetPath.trim();
    targetMethod = targetMethod.trim().toUpperCase();
    const mayExecuteMiddles = [];
    let hitted = false;
    for (let index = 0, len = middles.length; index < len; index += 1) {
      const { path, method, funcName } = middles[index];
      if (
        isIncludePath(targetPath, path) &&
        isMatchMethod(targetMethod, method)
      ) {
        if (targetPath === path && method === targetMethod) {
          hitted = true;
          mayExecuteMiddles.push(`<strong>${funcName}</strong>`);
        } else {
          mayExecuteMiddles.push(funcName);
        }
      }
    }
    const msg = [];
    msg.push(formatTitle('两种中间件列表'));
    msg.push(
      `&nbsp;&nbsp;普通中间件-函数小于4个参数。\n&nbsp;&nbsp;错误处理中间件-函数有4个参数。`,
    );
    msg.push(formatTitle('执行逻辑'));
    msg.push(
      `&nbsp;&nbsp;中间件执行后不调用next函数，退出执行。\n&nbsp;&nbsp;如果next回调无参数，执行普通中间件列表下一个。\n&nbsp;&nbsp;如果next回调有参数，执行错误中间件列表下一个。`,
    );
    msg.push(formatTitle('匹配列表'));
    msg.push(`&nbsp;&nbsp;${mayExecuteMiddles.join('->')}`);
    msg.push(formatTitle('是否有完全匹配路由'));
    msg.push(`&nbsp;&nbsp;${hitted ? '是' : '否'}`);
    return msg.join('<br>');
  }

  showAllRoute() {
    const middles = this._middles;
    return middles
      .map(({ method, path, funcName }: any) => {
        return `方法:${method.padEnd(4)} 路径:${path.padEnd(
          40,
        )} 函数名:${funcName}`;
      })
      .join('\n\n');
  }
}

export default RouteParser;
