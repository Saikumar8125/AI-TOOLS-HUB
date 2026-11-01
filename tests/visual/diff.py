# python3 tests/visual/diff.py <dirA> <dirB> [outDir] : pixel diff per screenshot
import sys, os
from PIL import Image, ImageChops
a, b = sys.argv[1], sys.argv[2]; o = sys.argv[3] if len(sys.argv) > 3 else None
worst = 0
for f in sorted(os.listdir(a)):
    if not f.endswith('.png'): continue
    A = Image.open(os.path.join(a, f)).convert('RGB'); B = Image.open(os.path.join(b, f)).convert('RGB')
    if A.size != B.size:
        print(f"{f}: SIZE {A.size} vs {B.size}"); worst = 100; continue
    d = ImageChops.difference(A, B).convert('L').point(lambda p: 255 if p > 16 else 0)
    n = sum(d.histogram()[255:]); pct = 100 * n / (A.size[0] * A.size[1]); worst = max(worst, pct)
    print(f"{f}: {pct:.3f}% pixels differ")
    if o and n: os.makedirs(o, exist_ok=True); d.save(os.path.join(o, f))
print(f"WORST {worst:.3f}%")
