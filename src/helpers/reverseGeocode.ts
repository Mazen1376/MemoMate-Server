// src/helpers/reverseGeocode.ts
// Uses OpenStreetMap Nominatim — free, no API key required.
// Nominatim policy: max 1 request/sec, must send a descriptive User-Agent.

interface GeocodeResult {
  city:    string | null;
  country: string | null;
}

export const reverseGeocode = async (
  lat: number,
  lng: number
): Promise<GeocodeResult> => {
  try {
    const url =
      `https://nominatim.openstreetmap.org/reverse` +
      `?lat=${lat}&lon=${lng}&format=json&addressdetails=1`;

    const response = await fetch(url, {
      headers: {
        // Nominatim requires a meaningful User-Agent identifying your app
        "User-Agent": "MemoMate-Server/1.0 (contact@memomate.app)",
        "Accept-Language": "en", // Always return English names
      },
    });

    if (!response.ok) {
      console.error("Nominatim error:", response.status, response.statusText);
      return { city: null, country: null };
    }

    const data: any = await response.json();

    const address = data?.address ?? {};

    // Nominatim uses different keys depending on the area type
    const city =
      address.city        ??
      address.town        ??
      address.village     ??
      address.county      ??
      address.suburb      ??
      null;

    const country = address.country ?? null;

    return { city, country };
  } catch (err) {
    console.error("reverseGeocode failed:", err);
    return { city: null, country: null };
  }
};
