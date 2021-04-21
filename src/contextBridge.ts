import { contextBridge, ipcRenderer } from 'electron'
import { v4 as uuidv4 } from 'uuid'

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld(
    "storage", {
        appendData: (request) => {
            ipcRenderer.send("appendToStorageChannel", request);
        },
        loadAllFiles: (request) => {
            ipcRenderer.send("loadFromStorageChannel", request);
        },
        listenData: (pathPrefix, listener) => {
            ipcRenderer.on("fromStorageChannel", (event: any, request: any) => {
              if(request.path.startsWith(pathPrefix)) {
                listener(request);
              }
            });
        }
    }
);

contextBridge.exposeInMainWorld(
  "filesystem", {
    readFile: (filename) => {
      return new Promise((resolve) => {
        const eventId = uuidv4();
        ipcRenderer.send("readFile", {filename, eventId});
        ipcRenderer.on(`readFile-${eventId}`, (event: any, data: string) => {
          resolve(new TextDecoder().decode(data))
        });
      });
    }
  }
)
