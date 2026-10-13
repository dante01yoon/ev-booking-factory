export function searchStations<T extends { name: string; address: string }>(
  stations: readonly T[],
  query: string,
): T[] {
  const normalizedQuery = query.toLowerCase();
  return stations.filter((station) =>
    `${station.name} ${station.address}`.toLowerCase().includes(normalizedQuery),
  );
}
