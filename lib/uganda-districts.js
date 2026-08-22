/**
 * Uganda Districts & Cities — GPS coordinates + base land prices
 * Base price = median land price per acre in UGX for that district.
 * Source: public URA, Uganda Bureau of Statistics, and market listings data.
 * Tiers: 1 = metro (Kampala metro), 2 = major city, 3 = district HQ, 4 = rural
 */

export const UGANDA_DISTRICTS = [
  // ── Tier 1: Kampala Metro ──────────────────────────────────────────
  { name: 'Kampala', region: 'Central', tier: 1, lat: 0.3476, lng: 32.5825, basePricePerAcre: 180_000_000 },
  { name: 'Wakiso', region: 'Central', tier: 1, lat: 0.4048, lng: 32.4594, basePricePerAcre: 120_000_000 },
  { name: 'Mukono', region: 'Central', tier: 1, lat: 0.5128, lng: 32.7565, basePricePerAcre: 80_000_000 },

  // ── Tier 2: Major Cities ────────────────────────────────────────────
  { name: 'Entebbe', region: 'Central', tier: 2, lat: 0.0512, lng: 32.4601, basePricePerAcre: 90_000_000 },
  { name: 'Jinja', region: 'Eastern', tier: 2, lat: 0.4244, lng: 33.2041, basePricePerAcre: 60_000_000 },
  { name: 'Mbarara', region: 'Western', tier: 2, lat: -0.6092, lng: 30.6569, basePricePerAcre: 50_000_000 },
  { name: 'Gulu', region: 'Northern', tier: 2, lat: 2.7747, lng: 32.2990, basePricePerAcre: 35_000_000 },
  { name: 'Mbale', region: 'Eastern', tier: 2, lat: 1.0834, lng: 34.1740, basePricePerAcre: 45_000_000 },
  { name: 'Masaka', region: 'Central', tier: 2, lat: -0.3430, lng: 31.7350, basePricePerAcre: 40_000_000 },
  { name: 'Lira', region: 'Northern', tier: 2, lat: 2.2499, lng: 32.9000, basePricePerAcre: 30_000_000 },
  { name: 'Soroti', region: 'Eastern', tier: 2, lat: 1.7125, lng: 33.6111, basePricePerAcre: 28_000_000 },
  { name: 'Hoima', region: 'Western', tier: 2, lat: 1.4318, lng: 31.3508, basePricePerAcre: 35_000_000 },
  { name: 'Fort Portal', region: 'Western', tier: 2, lat: 0.6619, lng: 30.2760, basePricePerAcre: 38_000_000 },
  { name: 'Kabale', region: 'Western', tier: 2, lat: -1.2489, lng: 29.9892, basePricePerAcre: 35_000_000 },
  { name: 'Arua', region: 'Northern', tier: 2, lat: 3.0201, lng: 30.9110, basePricePerAcre: 25_000_000 },
  { name: 'Mbale Town', region: 'Eastern', tier: 2, lat: 1.0834, lng: 34.1740, basePricePerAcre: 42_000_000 },

  // ── Tier 3: District Headquarters ───────────────────────────────────
  { name: 'Kyenjojo', region: 'Western', tier: 3, lat: 0.6333, lng: 30.6333, basePricePerAcre: 22_000_000 },
  { name: 'Kasese', region: 'Western', tier: 3, lat: 0.1833, lng: 30.0833, basePricePerAcre: 20_000_000 },
  { name: 'Kabarole', region: 'Western', tier: 3, lat: 0.6619, lng: 30.2760, basePricePerAcre: 25_000_000 },
  { name: 'Kamwenge', region: 'Western', tier: 3, lat: 0.2333, lng: 30.4167, basePricePerAcre: 18_000_000 },
  { name: 'Kyegegwa', region: 'Western', tier: 3, lat: 0.4833, lng: 30.8833, basePricePerAcre: 16_000_000 },
  { name: 'Ntoroko', region: 'Western', tier: 3, lat: 0.9833, lng: 30.3833, basePricePerAcre: 12_000_000 },
  { name: 'Bundibugyo', region: 'Western', tier: 3, lat: 0.7083, lng: 30.0667, basePricePerAcre: 14_000_000 },
  { name: 'Ntoroko', region: 'Western', tier: 3, lat: 0.9833, lng: 30.3833, basePricePerAcre: 12_000_000 },
  { name: 'Bunyangabu', region: 'Western', tier: 3, lat: 0.6000, lng: 30.4333, basePricePerAcre: 16_000_000 },
  { name: 'Rubirizi', region: 'Western', tier: 3, lat: -0.2667, lng: 30.0667, basePricePerAcre: 14_000_000 },
  { name: 'Mitooma', region: 'Western', tier: 3, lat: -0.6167, lng: 30.3667, basePricePerAcre: 15_000_000 },
  { name: 'Sheema', region: 'Western', tier: 3, lat: -0.5333, lng: 30.3833, basePricePerAcre: 16_000_000 },
  { name: 'Bushenyi', region: 'Western', tier: 3, lat: -0.5833, lng: 30.1833, basePricePerAcre: 18_000_000 },
  { name: 'Ntungamo', region: 'Western', tier: 3, lat: -0.9000, lng: 30.2667, basePricePerAcre: 15_000_000 },
  { name: 'Isingiro', region: 'Western', tier: 3, lat: -1.0333, lng: 30.8333, basePricePerAcre: 12_000_000 },
  { name: 'Kiruhura', region: 'Western', tier: 3, lat: -0.2000, lng: 30.8000, basePricePerAcre: 14_000_000 },
  { name: 'Ibanda', region: 'Western', tier: 3, lat: -0.3500, lng: 31.5000, basePricePerAcre: 15_000_000 },
  { name: 'Kazo', region: 'Western', tier: 3, lat: -0.1000, lng: 31.0000, basePricePerAcre: 14_000_000 },
  { name: 'Kagadi', region: 'Western', tier: 3, lat: 0.9500, lng: 30.9833, basePricePerAcre: 15_000_000 },
  { name: 'Kakumiro', region: 'Western', tier: 3, lat: 0.8167, lng: 31.5333, basePricePerAcre: 14_000_000 },
  { name: 'Kibaale', region: 'Western', tier: 3, lat: 0.8333, lng: 31.4667, basePricePerAcre: 14_000_000 },
  { name: 'Kikuube', region: 'Western', tier: 3, lat: 1.0500, lng: 30.9000, basePricePerAcre: 13_000_000 },
  { name: 'Buliisa', region: 'Western', tier: 3, lat: 1.7333, lng: 31.4167, basePricePerAcre: 10_000_000 },
  { name: 'Masindi', region: 'Western', tier: 3, lat: 1.6833, lng: 31.7167, basePricePerAcre: 18_000_000 },
  { name: 'Kanungu', region: 'Western', tier: 3, lat: -0.8833, lng: 29.7833, basePricePerAcre: 12_000_000 },
  { name: 'Rukungiri', region: 'Western', tier: 3, lat: -0.7833, lng: 29.9333, basePricePerAcre: 14_000_000 },
  { name: 'Kisoro', region: 'Western', tier: 3, lat: -1.2833, lng: 29.6833, basePricePerAcre: 16_000_000 },
  { name: 'Rukiga', region: 'Western', tier: 3, lat: -1.1833, lng: 30.0000, basePricePerAcre: 14_000_000 },
  { name: 'Rubanda', region: 'Western', tier: 3, lat: -1.2333, lng: 29.8833, basePricePerAcre: 12_000_000 },

  // ── Central Region Districts ────────────────────────────────────────
  { name: 'Mpigi', region: 'Central', tier: 3, lat: 0.2333, lng: 32.3167, basePricePerAcre: 35_000_000 },
  { name: 'Butambala', region: 'Central', tier: 3, lat: 0.1333, lng: 32.2333, basePricePerAcre: 28_000_000 },
  { name: 'Gomba', region: 'Central', tier: 3, lat: 0.2167, lng: 32.1667, basePricePerAcre: 22_000_000 },
  { name: 'Mityana', region: 'Central', tier: 3, lat: 0.4000, lng: 32.0333, basePricePerAcre: 25_000_000 },
  { name: 'Mubende', region: 'Central', tier: 3, lat: 0.5667, lng: 32.0333, basePricePerAcre: 20_000_000 },
  { name: 'Kassanda', region: 'Central', tier: 3, lat: 0.5833, lng: 32.0667, basePricePerAcre: 18_000_000 },
  { name: 'Luwero', region: 'Central', tier: 3, lat: 0.8333, lng: 32.5000, basePricePerAcre: 28_000_000 },
  { name: 'Nakaseke', region: 'Central', tier: 3, lat: 1.0000, lng: 32.5000, basePricePerAcre: 18_000_000 },
  { name: 'Nakasongola', region: 'Central', tier: 4, lat: 1.3167, lng: 32.4500, basePricePerAcre: 12_000_000 },
  { name: 'Kayunga', region: 'Central', tier: 3, lat: 1.0833, lng: 32.8833, basePricePerAcre: 22_000_000 },
  { name: 'Buikwe', region: 'Central', tier: 3, lat: 0.5833, lng: 33.0333, basePricePerAcre: 25_000_000 },
  { name: 'Buvuma', region: 'Central', tier: 4, lat: 0.3167, lng: 33.2333, basePricePerAcre: 8_000_000 },
  { name: 'Kalangala', region: 'Central', tier: 4, lat: -0.3333, lng: 32.3000, basePricePerAcre: 15_000_000 },
  { name: 'Lwengo', region: 'Central', tier: 4, lat: -0.4167, lng: 31.7333, basePricePerAcre: 16_000_000 },
  { name: 'Sembabule', region: 'Central', tier: 4, lat: -0.0833, lng: 31.5667, basePricePerAcre: 12_000_000 },
  { name: 'Kalungu', region: 'Central', tier: 4, lat: -0.2667, lng: 31.7500, basePricePerAcre: 14_000_000 },
  { name: 'Bukomansimbi', region: 'Central', tier: 4, lat: -0.1833, lng: 31.8667, basePricePerAcre: 15_000_000 },
  { name: 'Kalamba', region: 'Central', tier: 4, lat: -0.2500, lng: 31.7833, basePricePerAcre: 14_000_000 },
  { name: 'Ggomba', region: 'Central', tier: 4, lat: 0.2000, lng: 32.1833, basePricePerAcre: 20_000_000 },
  { name: 'Rakai', region: 'Central', tier: 4, lat: -0.6833, lng: 31.5167, basePricePerAcre: 14_000_000 },
  { name: 'Kyotera', region: 'Central', tier: 4, lat: -0.6333, lng: 31.7333, basePricePerAcre: 15_000_000 },
  { name: 'Lyantonde', region: 'Central', tier: 4, lat: -0.2167, lng: 31.4000, basePricePerAcre: 14_000_000 },
  { name: 'Kiboga', region: 'Central', tier: 4, lat: 0.9167, lng: 31.7667, basePricePerAcre: 12_000_000 },
  { name: 'Kiboga East', region: 'Central', tier: 4, lat: 0.9167, lng: 31.8333, basePricePerAcre: 10_000_000 },

  // ── Eastern Region Districts ────────────────────────────────────────
  { name: 'Tororo', region: 'Eastern', tier: 3, lat: 0.6833, lng: 33.9167, basePricePerAcre: 22_000_000 },
  { name: 'Busia', region: 'Eastern', tier: 3, lat: 0.4833, lng: 33.9333, basePricePerAcre: 18_000_000 },
  { name: 'Pallisa', region: 'Eastern', tier: 4, lat: 1.1833, lng: 33.7000, basePricePerAcre: 12_000_000 },
  { name: 'Butebo', region: 'Eastern', tier: 4, lat: 1.0833, lng: 33.7833, basePricePerAcre: 10_000_000 },
  { name: 'Kibuku', region: 'Eastern', tier: 4, lat: 1.1167, lng: 33.7333, basePricePerAcre: 10_000_000 },
  { name: 'Budaka', region: 'Eastern', tier: 4, lat: 1.0000, lng: 33.8333, basePricePerAcre: 12_000_000 },
  { name: 'Butaleja', region: 'Eastern', tier: 4, lat: 0.9167, lng: 33.9333, basePricePerAcre: 10_000_000 },
  { name: 'Bugiri', region: 'Eastern', tier: 4, lat: 0.5667, lng: 33.6667, basePricePerAcre: 14_000_000 },
  { name: 'Namayingo', region: 'Eastern', tier: 4, lat: 0.2833, lng: 33.7833, basePricePerAcre: 10_000_000 },
  { name: 'Mayuge', region: 'Eastern', tier: 4, lat: 0.4500, lng: 33.5000, basePricePerAcre: 12_000_000 },
  { name: 'Iganga', region: 'Eastern', tier: 3, lat: 0.6333, lng: 33.4667, basePricePerAcre: 20_000_000 },
  { name: 'Luuka', region: 'Eastern', tier: 4, lat: 0.7333, lng: 33.3333, basePricePerAcre: 14_000_000 },
  { name: 'Kaliro', region: 'Eastern', tier: 4, lat: 1.0833, lng: 33.5000, basePricePerAcre: 10_000_000 },
  { name: 'Kamuli', region: 'Eastern', tier: 4, lat: 0.9167, lng: 33.1167, basePricePerAcre: 12_000_000 },
  { name: 'Buyende', region: 'Eastern', tier: 4, lat: 1.3667, lng: 33.1667, basePricePerAcre: 8_000_000 },
  { name: 'Namutumba', region: 'Eastern', tier: 4, lat: 0.7833, lng: 33.6833, basePricePerAcre: 12_000_000 },
  { name: 'Buvuma', region: 'Eastern', tier: 4, lat: 0.3167, lng: 33.2333, basePricePerAcre: 8_000_000 },
  { name: 'Manafwa', region: 'Eastern', tier: 4, lat: 0.9333, lng: 34.2833, basePricePerAcre: 12_000_000 },
  { name: 'Mbale', region: 'Eastern', tier: 2, lat: 1.0834, lng: 34.1740, basePricePerAcre: 45_000_000 },
  { name: 'Bududa', region: 'Eastern', tier: 4, lat: 1.0500, lng: 34.3500, basePricePerAcre: 14_000_000 },
  { name: 'Sironko', region: 'Eastern', tier: 4, lat: 1.2833, lng: 34.2500, basePricePerAcre: 14_000_000 },
  { name: 'Kapchorwa', region: 'Eastern', tier: 4, lat: 1.4000, lng: 34.4667, basePricePerAcre: 12_000_000 },
  { name: 'Kween', region: 'Eastern', tier: 4, lat: 1.5000, lng: 34.5333, basePricePerAcre: 10_000_000 },
  { name: 'Bukwo', region: 'Eastern', tier: 4, lat: 1.5167, lng: 34.5833, basePricePerAcre: 10_000_000 },
  { name: 'Amuria', region: 'Eastern', tier: 4, lat: 2.0000, lng: 33.9333, basePricePerAcre: 8_000_000 },
  { name: 'Katakwi', region: 'Eastern', tier: 4, lat: 1.9000, lng: 34.1667, basePricePerAcre: 8_000_000 },
  { name: 'Kaberamaido', region: 'Eastern', tier: 4, lat: 1.7167, lng: 33.2333, basePricePerAcre: 8_000_000 },
  { name: 'Serere', region: 'Eastern', tier: 4, lat: 1.5500, lng: 33.4667, basePricePerAcre: 10_000_000 },
  { name: 'Ngora', region: 'Eastern', tier: 4, lat: 1.4500, lng: 33.3333, basePricePerAcre: 10_000_000 },
  { name: 'Kumi', region: 'Eastern', tier: 4, lat: 1.4833, lng: 33.9333, basePricePerAcre: 10_000_000 },
  { name: 'Bukedea', region: 'Eastern', tier: 4, lat: 1.8500, lng: 34.2000, basePricePerAcre: 8_000_000 },

  // ── Northern Region Districts ───────────────────────────────────────
  { name: 'Kitgum', region: 'Northern', tier: 4, lat: 3.2833, lng: 32.8833, basePricePerAcre: 8_000_000 },
  { name: 'Pader', region: 'Northern', tier: 4, lat: 2.8667, lng: 32.8000, basePricePerAcre: 8_000_000 },
  { name: 'Agago', region: 'Northern', tier: 4, lat: 2.8333, lng: 33.3333, basePricePerAcre: 6_000_000 },
  { name: 'Lamwo', region: 'Northern', tier: 4, lat: 3.5333, lng: 32.7000, basePricePerAcre: 5_000_000 },
  { name: 'Amuru', region: 'Northern', tier: 4, lat: 3.2000, lng: 31.9500, basePricePerAcre: 6_000_000 },
  { name: 'Nwoya', region: 'Northern', tier: 4, lat: 2.6333, lng: 31.9500, basePricePerAcre: 7_000_000 },
  { name: 'Gulu', region: 'Northern', tier: 2, lat: 2.7747, lng: 32.2990, basePricePerAcre: 35_000_000 },
  { name: 'Omoro', region: 'Northern', tier: 4, lat: 2.6167, lng: 32.3000, basePricePerAcre: 8_000_000 },
  { name: 'Oyam', region: 'Northern', tier: 4, lat: 2.2333, lng: 32.3833, basePricePerAcre: 8_000_000 },
  { name: 'Kole', region: 'Northern', tier: 4, lat: 2.4167, lng: 32.6667, basePricePerAcre: 7_000_000 },
  { name: 'Apac', region: 'Northern', tier: 4, lat: 2.0167, lng: 32.5333, basePricePerAcre: 8_000_000 },
  { name: 'Kwania', region: 'Northern', tier: 4, lat: 1.9167, lng: 32.7000, basePricePerAcre: 7_000_000 },
  { name: 'Dokolo', region: 'Northern', tier: 4, lat: 1.9000, lng: 33.1833, basePricePerAcre: 7_000_000 },
  { name: 'Amolatar', region: 'Northern', tier: 4, lat: 1.5833, lng: 32.8500, basePricePerAcre: 6_000_000 },
  { name: 'Lira', region: 'Northern', tier: 2, lat: 2.2499, lng: 32.9000, basePricePerAcre: 30_000_000 },
  { name: 'Alebtong', region: 'Northern', tier: 4, lat: 2.3667, lng: 33.0000, basePricePerAcre: 7_000_000 },
  { name: 'Otuke', region: 'Northern', tier: 4, lat: 2.6500, lng: 33.2500, basePricePerAcre: 6_000_000 },
  { name: 'Kaberamaido', region: 'Northern', tier: 4, lat: 1.7167, lng: 33.2333, basePricePerAcre: 7_000_000 },
  { name: 'Kaabong', region: 'Northern', tier: 4, lat: 3.5167, lng: 34.1667, basePricePerAcre: 5_000_000 },
  { name: 'Kotido', region: 'Northern', tier: 4, lat: 3.0167, lng: 34.1000, basePricePerAcre: 5_000_000 },
  { name: 'Abim', region: 'Northern', tier: 4, lat: 2.7000, lng: 33.6667, basePricePerAcre: 5_000_000 },
  { name: 'Napak', region: 'Northern', tier: 4, lat: 2.5500, lng: 34.2000, basePricePerAcre: 5_000_000 },
  { name: 'Moroto', region: 'Northern', tier: 4, lat: 2.5333, lng: 34.6667, basePricePerAcre: 6_000_000 },
  { name: 'Nakapiripirit', region: 'Northern', tier: 4, lat: 1.7000, lng: 34.7667, basePricePerAcre: 6_000_000 },
  { name: 'Amudat', region: 'Northern', tier: 4, lat: 1.5833, lng: 34.9500, basePricePerAcre: 5_000_000 },
  { name: 'Pakwach', region: 'Northern', tier: 4, lat: 2.4333, lng: 31.3000, basePricePerAcre: 7_000_000 },
  { name: 'Nebbi', region: 'Northern', tier: 3, lat: 2.4833, lng: 31.4333, basePricePerAcre: 15_000_000 },
  { name: 'Zombo', region: 'Northern', tier: 4, lat: 2.5000, lng: 30.9333, basePricePerAcre: 8_000_000 },
  { name: 'Pakwach', region: 'Northern', tier: 4, lat: 2.4333, lng: 31.3000, basePricePerAcre: 7_000_000 },
  { name: 'Koboko', region: 'Northern', tier: 4, lat: 3.4167, lng: 30.9667, basePricePerAcre: 8_000_000 },
  { name: 'Yumbe', region: 'Northern', tier: 4, lat: 3.4667, lng: 31.2500, basePricePerAcre: 6_000_000 },
  { name: 'Maracha', region: 'Northern', tier: 4, lat: 3.2833, lng: 30.9333, basePricePerAcre: 6_000_000 },
  { name: 'Terego', region: 'Northern', tier: 4, lat: 3.2000, lng: 30.9833, basePricePerAcre: 6_000_000 },
  { name: 'Madi Okollo', region: 'Northern', tier: 4, lat: 2.9667, lng: 31.0500, basePricePerAcre: 6_000_000 },
  { name: 'Nebbi', region: 'Northern', tier: 3, lat: 2.4833, lng: 31.4333, basePricePerAcre: 15_000_000 },
  { name: 'Adjumani', region: 'Northern', tier: 4, lat: 3.3667, lng: 31.7833, basePricePerAcre: 6_000_000 },
  { name: 'Moyo', region: 'Northern', tier: 4, lat: 3.6500, lng: 31.7167, basePricePerAcre: 6_000_000 },
  { name: 'Obongi', region: 'Northern', tier: 4, lat: 3.2333, lng: 31.4667, basePricePerAcre: 5_000_000 },
]

/**
 * Haversine distance between two lat/lng points in km.
 */
export function haversineKm(lat1, lng1, lat2, lng2) {
  const R = 6371
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLng = (lng2 - lng1) * Math.PI / 180
  const a = Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

/**
 * Find the nearest town/city to a given GPS coordinate.
 * Returns { name, distanceKm, basePricePerAcre, tier, region }
 */
export function findNearestTown(lat, lng) {
  let nearest = null
  let minDist = Infinity

  for (const d of UGANDA_DISTRICTS) {
    const dist = haversineKm(lat, lng, d.lat, d.lng)
    if (dist < minDist) {
      minDist = dist
      nearest = d
    }
  }

  return {
    name: nearest.name,
    distanceKm: Math.round(minDist * 10) / 10,
    basePricePerAcre: nearest.basePricePerAcre,
    tier: nearest.tier,
    region: nearest.region,
  }
}

/**
 * Match a location string to the nearest district.
 * Tries to find the district name within the location string.
 */
export function matchDistrict(locationStr) {
  if (!locationStr) return null
  const lower = locationStr.toLowerCase()
  for (const d of UGANDA_DISTRICTS) {
    if (lower.includes(d.name.toLowerCase())) return d
  }
  return null
}
