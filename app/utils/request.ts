export class HttpError extends Error {
  constructor(public res: Response) {
    super();
  }
}
export class NetworkError extends Error {}

export const request = async <Res = unknown>(
  path: string,
  {
    method,
    headers,
    data,
    queryParams,
  }: {
    method?: "DELETE" | "GET" | "PATCH" | "POST" | "PUT";
    headers?: { [header: string]: string };
    data?: unknown;
    queryParams?: { [param: string]: number | string };
  } = {
    method: "GET",
    headers: {},
    data: {},
  },
) => {
  // @ts-expect-error: Incorrect types, URLSearchParams accepts numbers as well
  const qp = queryParams ? "?" + new URLSearchParams(queryParams) : "",
    body = method === "GET" ? undefined : JSON.stringify(data),
    req = new Request(path + qp, {
      method,
      body,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        ...headers,
      },
    });

  try {
    const res = await fetch(req),
      json = (await res.json()) as Res;

    if (!res.ok) throw new HttpError(res);

    return { json, res };
  } catch (error) {
    console.error({ path, error });

    if (error instanceof TypeError) {
      throw new NetworkError(error.message);
    }
    throw error;
  }
};
