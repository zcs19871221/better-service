# http.request使用(url)时如果参数有#会认为是hash,使用path可以
如果使用http.request(url)的形式,而url的参数中包含:#,比如
`http.request('http://domaih.com/getKeyword?keyword=#abcd&name=zcs)`这个#abcd不会被认为是请求参数,而会被当成hash,总之不会正确发送.应该对#abcd编码
但是如果使用选项对象的方式

    http.request({
      host: domaih.com
      path:/getKeyword?keyword=#abcd&name=zcs
    })

就可以正确发送