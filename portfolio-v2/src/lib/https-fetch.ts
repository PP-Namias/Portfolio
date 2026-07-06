import https from "https";

export async function httpsFetch<T>(url: string): Promise<T> {
  return new Promise((resolve, reject) => {
    https
      .get(url, (res) => {
        let body = "";
        res.on("data", (chunk) => {
          body += chunk;
        });
        res.on("end", () => {
          try {
            resolve(JSON.parse(body) as T);
          } catch (error) {
            reject(new Error(`Failed to parse JSON: ${String(error)}`));
          }
        });
      })
      .on("error", (error) => {
        reject(error);
      });
  });
}
