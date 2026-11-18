export interface Position {
    latitude: number;
    longitude: number;
}

interface PlacedStation {
    latitude?: number | string | null;
    longitude?: number | string | null;
}

const earthRadiusMeters = 6_371_000;

const toRadians = (degrees: number) => (degrees * Math.PI) / 180;

/**
 * Great-circle distance between two positions, in metres (haversine).
 */
export function distanceInMeters(from: Position, to: Position): number {
    const latitudeDelta = toRadians(to.latitude - from.latitude);
    const longitudeDelta = toRadians(to.longitude - from.longitude);
    const a =
        Math.sin(latitudeDelta / 2) ** 2 +
        Math.cos(toRadians(from.latitude)) *
            Math.cos(toRadians(to.latitude)) *
            Math.sin(longitudeDelta / 2) ** 2;

    return 2 * earthRadiusMeters * Math.asin(Math.sqrt(a));
}

/**
 * The closest station with known coordinates within `maxMeters`, or null.
 */
export function nearestStation<T extends PlacedStation>(
    stations: T[],
    position: Position,
    maxMeters: number,
): T | null {
    let nearest: T | null = null;
    let nearestDistance = maxMeters;

    for (const station of stations) {
        if (station.latitude == null || station.longitude == null) {
            continue;
        }

        const distance = distanceInMeters(position, {
            latitude: Number(station.latitude),
            longitude: Number(station.longitude),
        });

        if (distance <= nearestDistance) {
            nearest = station;
            nearestDistance = distance;
        }
    }

    return nearest;
}
