# EgoClip media register

Last reviewed: 2026-08-17

All runtime media is stored locally under `public/media/`. Stock imagery is illustrative and does not imply that a depicted person, creator or third-party brand endorses EgoClip.

## Product geometry and generated visuals

### Supplied product sources

- `egoclip最终设计案.3dm` — Rhino 7 design model supplied by the user.
- `egoclip渲染图.bip` — KeyShot 10.2 scene supplied by the user; used to confirm the black glass face, lens, status light, U-shaped guide, side control, shell materials and camera views.
- Six printable STL files under `设计参考文件/egoclip打印/` — supplied by the user; used to verify the circular assembly and shell variants.
- The source directory's PDF files were intentionally not opened or used.

STL does not encode units. The page therefore avoids publishing a physical dimension even though the model coordinates are consistent with a palm-scale object. No battery, runtime, capture resolution, storage, connectivity or waterproof specification was present in the inspected sources.

### Runtime product visuals

- `product/egoclip-hero-cutout.webp` — generated product concept, 2026-08-17. Image generation was constrained with the supplied KeyShot preview and read-only STL assembly views, then the background was removed and the selected result was compressed to WebP. It is a concept render, not a photograph of a manufactured unit.
- `product/shells/egoclip-shell-{cream,navy,coral,sage,lilac}.webp` — local colour studies derived from the same product concept with `scripts/create-shell-variants.py`; only the pale exterior shell region was recoloured.
- PNG files beside these assets are high-resolution working sources. `product/egoclip-*-study.webp` and matching PNGs are deterministic STL point-render studies made with `scripts/render-stl-assets.py`; they are retained as internal geometry evidence and are not loaded by the page.

## Licensed stock photos

All four photos are used under the [Pexels License](https://www.pexels.com/license/), downloaded and locally compressed on 2026-08-17.

- `life/pov-bike.jpg` — “Close-up of Bicycle Handlebars on Sunny Day” by Jonathan Borba. Source: https://www.pexels.com/photo/close-up-of-bicycle-handlebars-on-sunny-day-33865638/
- `life/friends-walk.jpg` — “Two Friends Talking on Walk in Park” by Mizuno K. Source: https://www.pexels.com/photo/two-friends-talking-on-walk-in-park-12886718/
- `life/wear-fabric.jpg` — “Close-up of Person in a Light Outfit Standing with Hand in a Pocket” by Filipp Romanovski. Source: https://www.pexels.com/photo/close-up-of-person-in-a-light-outfit-standing-with-hand-in-a-pocket-20003441/
- `life/friends-lawn.jpg` — “Group of Friends Enjoying a Sunny Day Outdoors” by Jessica Iroh. Source: https://www.pexels.com/photo/group-of-friends-enjoying-a-sunny-day-outdoors-32875777/

## Licensed stock video

Both videos are used under the [Pexels License](https://www.pexels.com/license/), downloaded on 2026-08-17, trimmed to short silent loops, transcoded for the web and paired with local poster images.

- `life/pov-cycling.mp4` and `life/pov-cycling-poster.jpg` — “POV Cycling Through Urban Park at Sunset” by Alan Morales. Source: https://www.pexels.com/video/pov-cycling-through-urban-park-at-sunset-32065829/ . Runtime edit: first 8 seconds, 720p. Used as illustrative first-person footage.
- `life/prototype-layers.mp4` and `life/prototype-layers-poster.jpg` — “3D Printer Printing Filament Object Surface Close Up” by Jakub Zerdzicki. Source: https://www.pexels.com/video/3d-printer-printing-filament-object-surface-close-up-25048171/ . Runtime edit: seven-second excerpt beginning at approximately 00:01, 480p. Used only as illustrative additive-fabrication footage, not as an EgoClip production claim.

## Legacy, not loaded by this page

- `hero-water-master.mp4` and `hero-water-poster.jpg` — earlier UBL opening-page study, “Hand Holding Water” by cottonbro studio. Source: https://www.pexels.com/video/hand-holding-water-10678277/ . Licensed under the Pexels License. These legacy files remain documented for provenance but are intentionally not copied into `版本2`; neither file is referenced by the current EgoClip page.

Third-party product websites used during design research are not media sources. No imagery from Insta360, PLAUD, Bee, Narrative, OXMAN, ICON or WASP is copied into this delivery.
