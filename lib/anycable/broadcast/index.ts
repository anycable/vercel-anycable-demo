export type IBroadcast = (stream: string, data: any) => Promise<void>;

export const broadcaster = (url: string, secret: string): IBroadcast => {
  const broadcast = async (stream: string, data: any) => {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${secret}`,
      },
      body: JSON.stringify({
        stream,
        data: JSON.stringify(data),
      }),
    });

    if (!res.ok) {
      throw new Error(`Error broadcasting to ${stream}: ${res.statusText}`);
    }
  };

  return broadcast;
};
