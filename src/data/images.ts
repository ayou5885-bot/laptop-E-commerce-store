/**
 * Centralized product image paths.
 *
 * To replace images: drop your optimized WebP files into
 *   public/images/laptops/
 * and update the paths here. All UI components reference
 * these keys, so swapping an image is a one-line change.
 *
 * Recommended: 800x600 (4:3) WebP, ~50–120 KB each.
 * Gallery images are optional (1–2 per product).
 */

export const productImages = {
  // Dell
  dellInspiron15: '/images/laptops/dell-inspiron-15.svg',
  dellInspiron14: '/images/laptops/dell-inspiron-14.svg',
  dellXps13: '/images/laptops/dell-xps-13.svg',
  dellXps15: '/images/laptops/dell-xps-15.svg',
  dellXps17: '/images/laptops/dell-xps-17.svg',
  dellLatitude5440: '/images/laptops/dell-latitude-5440.svg',
  dellLatitude7440: '/images/laptops/dell-latitude-7440.svg',
  dellG15: '/images/laptops/dell-g15.svg',
  dellG16: '/images/laptops/dell-g16.svg',
  dellInspiron16: '/images/laptops/dell-inspiron-16.svg',

  // HP
  hpPavilion15: '/images/laptops/hp-pavilion-15.svg',
  hpPavilion14: '/images/laptops/hp-pavilion-14.svg',
  hpEnvy13: '/images/laptops/hp-envy-13.svg',
  hpEnvy14: '/images/laptops/hp-envy-14.svg',
  hpEnvy16: '/images/laptops/hp-envy-16.svg',
  hpProBook450: '/images/laptops/hp-probook-450.svg',
  hpEliteBook840: '/images/laptops/hp-elitebook-840.svg',
  hpVictus15: '/images/laptops/hp-victus-15.svg',
  hpVictus16: '/images/laptops/hp-victus-16.svg',
  hpOmen16: '/images/laptops/hp-omen-16.svg',

  // Lenovo
  lenovoIdeaPad3: '/images/laptops/lenovo-ideapad-3.svg',
  lenovoIdeaPadFlex5: '/images/laptops/lenovo-ideapad-flex-5.svg',
  lenovoThinkPadE14: '/images/laptops/lenovo-thinkpad-e14.svg',
  lenovoThinkPadT14: '/images/laptops/lenovo-thinkpad-t14.svg',
  lenovoThinkPadX1Carbon: '/images/laptops/lenovo-thinkpad-x1-carbon.svg',
  lenovoYoga7i: '/images/laptops/lenovo-yoga-7i.svg',
  lenovoYoga9i: '/images/laptops/lenovo-yoga-9i.svg',
  lenovoLOQ15: '/images/laptops/lenovo-loq-15.svg',
  lenovoLegion5: '/images/laptops/lenovo-legion-5.svg',
  lenovoLegionPro5: '/images/laptops/lenovo-legion-pro-5.svg',

  // ASUS
  asusVivobook15: '/images/laptops/asus-vivobook-15.svg',
  asusVivobook14: '/images/laptops/asus-vivobook-14.svg',
  asusZenbook14: '/images/laptops/asus-zenbook-14.svg',
  asusZenbook14OLED: '/images/laptops/asus-zenbook-14-oled.svg',
  asusTUFGamingA15: '/images/laptops/asus-tuf-gaming-a15.svg',
  asusTUFGamingA16: '/images/laptops/asus-tuf-gaming-a16.svg',
  asusROGStrixG16: '/images/laptops/asus-rog-strix-g16.svg',
  asusROGZephyrusG14: '/images/laptops/asus-rog-zephyrus-g14.svg',

  // Acer
  acerAspire5: '/images/laptops/acer-aspire-5.svg',
  acerSwift3: '/images/laptops/acer-swift-3.svg',
  acerSwiftGo14: '/images/laptops/acer-swift-go-14.svg',
  acerNitro5: '/images/laptops/acer-nitro-5.svg',
  acerNitro16: '/images/laptops/acer-nitro-16.svg',

  // Apple
  macbookAir13: 'public/images/laptops/macbook-air-13.svg',
  macbookAir15: 'public/images/laptops/macbook-air-15.svg',
  macbookPro14: 'public/images/laptops/macbook-pro-14.svg',

  // Brand logos (optional — replace with your own if desired)
  brandDell: '/images/brands/dell.svg',
  brandHP: '/images/brands/hp.svg',
  brandLenovo: '/images/brands/lenovo.svg',
  brandAsus: '/images/brands/asus.svg',
  brandAcer: '/images/brands/acer.svg',
  brandApple: '/images/brands/apple.svg',
} as const;

export type ProductImageKey = keyof typeof productImages;
