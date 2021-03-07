import { contextBridge, ipcRenderer } from 'electron'

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
