# Wall of Nandjyot — V15

V12 treats the complete gallery as one continuous curated journey rather than a new collection followed by older work.

Fullscreen behaviour:
- artwork requests genuine fullscreen where the browser permits it
- close (×) and `© Nandjyot` appear together for 2 seconds
- both fade away for an unobstructed artwork view
- tapping/clicking the artwork brings the controls back
- casual right-click/drag image saving remains discouraged

The artwork files themselves are not watermarked.

## V14 changes
- Standardised copyright attribution to “© Nandjyot”.
- Added a restrained “Tap an artwork to immerse” discovery hint.
- The hint quietly disappears after the visitor opens an artwork, leaving the gallery uncluttered.


### V14 loading refinement
The first gallery works load immediately; remaining artworks are gently prefetched in the background to reduce blank tiles during fast scrolling.

## V15
Gallery uses responsive WebP previews; original assets are unchanged and loaded on opening the viewer. First two previews eager, others lazy. Background prefetch removed. Explicit dimensions reserve layout. For new artworks generate 640px and 1280px width previews (maximum heights 1280/2560), add data-original, dimensions and sizing variables matching existing markup.
