import { contextBridge, ipcRenderer } from 'electron'
import { v4 as uuidv4 } from 'uuid'

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld(
    "storage", {
        appendData: (request: any) => {
            ipcRenderer.send("appendToStorageChannel", request);
        },
        loadAllFiles: (request: any) => {
            ipcRenderer.send("loadFromStorageChannel", request);
        },
        listenData: (pathPrefix: any, listener: any) => {
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
    readFile: (filename: string) => {
      return new Promise((resolve) => {
        const eventId = uuidv4();
        ipcRenderer.send("readFile", {filename, eventId});
        ipcRenderer.on(`readFile-${eventId}`, (event: any, data: Buffer) => {
          resolve(new TextDecoder().decode(data))
        });
      });
    },

    listFiles: (path: string) => {
      return new Promise((resolve) => {
        const eventId = uuidv4();
        ipcRenderer.send("listFiles", {path, eventId});
        ipcRenderer.on(`listFiles-${eventId}`, (event: any, data: string[]) => {
          resolve(data)
        });
      });
    },

    readDirectory: (path: string) => {
      return new Promise((resolve) => {
        const eventId = uuidv4();
        ipcRenderer.send("readDirectory", {path, eventId});
        ipcRenderer.on(`readDirectory-${eventId}`, (event: any, data: string) => {
          resolve(data)
        });
      });
    }
  }
)
