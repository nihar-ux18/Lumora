import axios from 'axios';
axios.get('http://localhost:8000/api/v1/workspaces', {
  headers: {
    Authorization: 'Bearer mock-token-123'
  }
}).then(res => {
  console.log(JSON.stringify(res.data, null, 2));
}).catch(err => {
  console.error(err.message);
});
