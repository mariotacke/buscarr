export async function getStoredValueAsync<T>(key: string): Promise<T> {
  return new Promise((resolve) => {
    chrome.storage.sync.get([key], function (value: any) {
      console.debug(`Loaded value from storage, key: "${key}"`, value[key]);
      return resolve(value[key]);
    });
  })
}

export async function setStoredValueAsync<T>(key: string, value: T): Promise<void> {
  return new Promise((resolve) => {
    chrome.storage.sync.set({ [key]: value }, function () {
      console.debug(`Stored value in storage, key: "${key}"`, value);
      return resolve();
    });
  });
}