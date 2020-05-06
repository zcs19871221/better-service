const ignoreMessages = (msg: string): boolean => {
  const ignoreMessages = ['不存在或已删除', 'url校验错误', '数据错误'];
  if (ignoreMessages.some(ignore => msg.includes(ignore))) {
    return true;
  }
  return false;
};
export default function isIgnoreError(error: any) {
  if (!error) {
    return true;
  }
  if (typeof error === 'string') {
    return ignoreMessages(error);
  }
  if (error && error instanceof Error) {
    const msg = error.message;
    return ignoreMessages(msg);
  }
  return false;
}
