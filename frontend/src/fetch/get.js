export function get(url, params) {
  const result = fetch(url, {
    method: 'GET',
    body: JSON.stringify(params),
    headers: {
      Accept: 'application/json,text/plain.*/*'
    }
  })
  return result
}
