type NominatimAddress = {
    road?: string;
    house_number?: string;
    postcode?: string;
    city?: string;
    town?: string;
    village?: string;
    suburb?: string;
    city_district?: string;
};

type NominatimReverseResponse = {
    address?: NominatimAddress;
    display_name?: string;
};

/**
 * Look up a human-readable address for a coordinate with OpenStreetMap Nominatim.
 * Returns null when the lookup fails or finds nothing, so callers can ignore it.
 */
export async function reverseGeocode(latitude: number, longitude: number): Promise<string | null> {
    let data: NominatimReverseResponse;

    try {
        const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);

        if (!response.ok) {
            return null;
        }

        data = (await response.json()) as NominatimReverseResponse;
    } catch {
        return null;
    }

    const address = data.address ?? {};
    const street = [address.road, address.house_number].filter(Boolean).join(' ');
    const locality = address.city || address.town || address.village || address.suburb || address.city_district;
    const cityLine = [address.postcode, locality].filter(Boolean).join(' ');
    const formatted = [street, cityLine].filter(Boolean).join(', ');

    return formatted || data.display_name || null;
}
