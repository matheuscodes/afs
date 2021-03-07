import { contextBridge, ipcRenderer } from 'electron'

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld(
    "storage", {
        appendData: (request) => {
            ipcRenderer.send("appendToStorageChannel", request);
        },
        listenData: (pathPrefix, listener) => {
            ipcRenderer.on("fromStorageChannel", (event, request) => {
              if(request.path.startsWith(pathPrefix)) {
                listener(request);
              }
            });
        }
    }
);
