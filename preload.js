const { contextBridge } = require('electron');

contextBridge.exposeInMainWorld('api', {
	// Expose any APIs you need here
});
