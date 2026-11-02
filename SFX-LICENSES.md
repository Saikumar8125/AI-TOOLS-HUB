# Sound effect licences

AI Tools Hub ships four short interface sounds in `assets/sfx/` (copied to `public/assets/sfx/` by `build.js`). They are served from this site only; no CDN.

All four come from **Interface Sounds (1.0)** by **Kenney** (www.kenney.nl), released under **Creative Commons Zero (CC0 1.0)**. Downloaded on 2 Nov 2026 from the official pack page: https://kenney.nl/assets/interface-sounds

| File | Original file in the pack | Change | Size |
|------|---------------------------|--------|------|
| `assets/sfx/click.mp3` | `Audio/click_001.ogg` | converted to mono MP3, 64 kbps | 1,296 bytes |
| `assets/sfx/open.mp3` | `Audio/open_001.ogg` | converted to mono MP3, 64 kbps | 1,714 bytes |
| `assets/sfx/add.mp3` | `Audio/pluck_001.ogg` | stereo to mono, MP3 64 kbps | 1,296 bytes |
| `assets/sfx/success.mp3` | `Audio/confirmation_001.ogg` | trimmed to 250 ms with a 60 ms fade-out, MP3 64 kbps | 2,550 bytes |

Conversion: `ffmpeg -i <file>.ogg -ac 1 -ar 44100 -b:a 64k <name>.mp3` (success: `-af "atrim=0:0.25,afade=t=out:st=0.19:d=0.06"`).

## Licence text (License.txt in the pack)

```
Interface Sounds (1.0)

Created/distributed by Kenney (www.kenney.nl)
Creation date: 11-02-2020

License: (Creative Commons Zero, CC0)
http://creativecommons.org/publicdomain/zero/1.0/

This content is free to use in personal, educational and commercial projects.
Support us by crediting Kenney or www.kenney.nl (this is not mandatory)
```

Full CC0 1.0 legal code: https://creativecommons.org/publicdomain/zero/1.0/legalcode
