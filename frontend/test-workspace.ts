import { workspaceService } from "./services/workspace.service";
workspaceService.listWorkspaces().then(console.log).catch(console.error);
