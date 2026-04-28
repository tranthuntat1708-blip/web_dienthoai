# Product Image Coverage Report

Updated: 2026-03-31

## Summary

- Total seeded product slugs: `51`
- Slugs with real image mapping in `Web_DienThoai.client/src/utils/productPhotoMapReal.js`: `42`
- Slugs still using generated fallback gallery: `9`

## Real Image Coverage

These slugs currently have a product-specific image entry and should not fall back to generated mock images.

| Slug | Current image source |
| --- | --- |
| `iphone-16-pro-max-256gb` | CellphoneS CDN |
| `samsung-galaxy-s24-ultra-512gb` | Samsung / CloudFront |
| `xiaomi-14-ultra-256gb` | Xiaomi official |
| `ipad-pro-m4-11-v2024` | Apple official |
| `airpods-pro-gen-2-usb-c` | Apple official |
| `iphone-16-pro-128gb` | CellphoneS CDN |
| `iphone-16-pro-512gb` | CellphoneS CDN |
| `iphone-16-128gb` | CellphoneS CDN |
| `iphone-16-plus-256gb` | CellphoneS CDN |
| `iphone-15-pro-max-256gb` | CellphoneS CDN |
| `iphone-15-128gb` | CellphoneS CDN |
| `iphone-14-128gb` | CellphoneS CDN |
| `samsung-galaxy-s24-256gb` | CellphoneS CDN |
| `samsung-galaxy-s24-plus-256gb` | CellphoneS CDN |
| `samsung-galaxy-z-fold6-256gb` | CellphoneS CDN |
| `samsung-galaxy-z-flip6-256gb` | CellphoneS CDN |
| `samsung-galaxy-a55-256gb` | CellphoneS CDN |
| `samsung-galaxy-a35-128gb` | CellphoneS CDN |
| `xiaomi-14-12gb-512gb` | CellphoneS CDN |
| `redmi-note-13-pro-plus-256gb` | CellphoneS CDN |
| `xiaomi-13t-pro-512gb` | CellphoneS CDN |
| `poco-x6-pro-512gb` | CellphoneS CDN |
| `oppo-find-x8-512gb` | CellphoneS CDN |
| `oppo-reno12-pro-256gb` | CellphoneS CDN |
| `oppo-reno11-f-256gb` | CellphoneS CDN |
| `oppo-a79-256gb` | CellphoneS CDN |
| `galaxy-tab-s9-256gb` | CellphoneS CDN |
| `xiaomi-pad-6-128gb` | CellphoneS CDN |
| `airpods-4-anc` | CellphoneS CDN |
| `apple-watch-series-10-gps-46mm` | CellphoneS CDN |
| `galaxy-watch7-44mm` | CellphoneS CDN |
| `xiaomi-watch-2-pro` | CellphoneS CDN |
| `iphone-13-128gb` | CellphoneS CDN |
| `samsung-galaxy-s23-fe-256gb` | CellphoneS CDN |
| `xiaomi-14t-pro-512gb` | CellphoneS CDN |
| `oppo-find-n3-flip-256gb` | CellphoneS CDN |
| `ipad-mini-7-128gb` | CellphoneS CDN |
| `iphone-12-64gb-cu-dep-99` | CellphoneS CDN |
| `apple-watch-ultra-2` | Apple official |
| `jbl-live-beam-3` | JBL official YouTube thumbnail |
| `anker-powerbank-20000mah-30w` | Anker official |
| `galaxy-z-fold6-thom-browne-edition` | CellphoneS CDN |

## Fallback Coverage

These slugs still rely on generated fallback images. They are safe from cross-model mismatch, but they are not yet mapped to a real product photo.

| Slug | Product name |
| --- | --- |
| `redmi-13-256gb` | Redmi 13 8GB/256GB |
| `ipad-air-m2-11-128gb` | iPad Air M2 11 inch Wi-Fi 128GB |
| `ipad-gen-10-64gb` | iPad Gen 10 Wi-Fi 64GB |
| `samsung-galaxy-buds3-pro` | Samsung Galaxy Buds3 Pro |
| `sony-wh-1000xm5` | Sony WH-1000XM5 |
| `marshall-minor-iv` | Marshall Minor IV |
| `cu-sac-apple-usb-c-20w` | Cu sac Apple USB-C 20W |
| `sac-anker-737-120w` | Sac Anker 737 GaNPrime 120W |
| `cap-baseus-usb-c-100w` | Cap Baseus USB-C to USB-C 100W |
## Notes

- A few CellphoneS image filenames reflect another storage variant while still pointing to the same product hero image. These were kept when the page itself matched the seeded slug and the visual product family was correct.
- For products that do not have a stable CellphoneS page or expose noisy asset candidates, fallback is preferred over assigning a wrong real photo.
- A few final entries use official manufacturer assets instead of CellphoneS because no stable CellphoneS product page was found for those seeded slugs.
- Primary mapping file: `Web_DienThoai.client/src/utils/productPhotoMapReal.js`
- Primary seed source: `Web_DienThoai.Server/Data/DbSeeder.cs`
