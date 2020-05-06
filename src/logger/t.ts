interface FetchInterface {}

enum Layout {
  'table-filter',
}

interface Component {
  search: object;
  body: object;
  method: 'get' | 'post';
  response: {
    code: number;
    data: object;
    msg: string;
  };
}
