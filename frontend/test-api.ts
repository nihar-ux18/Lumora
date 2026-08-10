import apiClient from "./lib/api-client";
apiClient.get("/workspaces").then(res => console.log(JSON.stringify(res.data, null, 2))).catch(err => console.error(err.message));
