/**
 * Konfigurasi Tile Layer Peta (Leaflet)
 *
 * Menggunakan OpenStreetMap standar yang 100% bebas watermark dan tanpa API key,
 * dipadukan dengan custom CSS filter civic modern di globals.css agar menghasilkan
 * tampilan minimalis abu-abu terang (Positron style) yang bersih dan elegan.
 */
export const MAP_CONFIG = {
  center: [-7.4478, 112.7183] as [number, number],
  defaultZoom: 11,
  getTileLayerProps: () => {
    return {
      url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      subdomains: "abc",
      maxZoom: 19,
    };
  },
};
