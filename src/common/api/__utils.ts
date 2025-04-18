export const request = async <T = any>(
  url: string,
  params?: Record<string, any>,
): Promise<T> => {
  const response = await fetch(
    params ? `${url}${new URLSearchParams(params)}` : url,
  );

  if (response.ok) {
    return response.json();
  }

  const error = await response.json();

  throw new Error(error.message);
};
