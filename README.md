# Wall of Nandjyot — V17

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

## V16
Show cached preview immediately, then replace with decoded original. Failed original requests retain preview. Warm responsive previews in batches of two after page load, pause new batches during immersive viewing, skip on data-saving or 2G connections. No speculative original downloads.

## V17
After the first preview settles (or a three-second fallback), promote all visible-category lazy previews to eager with normal priority. Browser manages concurrency. Skip speculative loading on data-saving/2G connections; resume when returning to the gallery or changing filters. Immersive viewer and assets unchanged.
