fetch('http://localhost:8000/api/v1/workspaces', {
  headers: {
    Authorization: 'Bearer mock-token-123'
  }
}).then(res => res.json()).then(data => {
  console.log(JSON.stringify(data, null, 2));
}).catch(err => {
  console.error(err.message);
});
