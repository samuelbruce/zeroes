# ZEROES
A MediaMonkey addon for removing (or even adding) leading zeroes from (or to) numerical tags.

## Why this?
Sometimes I find myself adding tracks or albums to my MediaMonkey library from sources that add leading zeroes to the track number by default. And I don't like this! Removing them manually was a drag so eventually I got around to making this addon. Perhaps someone else will find it useful!

## How do?
This addon adds a 'Zeroes' submenu under 'Edit tags' in MediaMonkey's contextual menu (the one which appears when right-clicking on a track), with the following actions:
### De-zero
  This action removes all leading zeroes (if any are present) from all supported tags of all selected tracks.
### Re-zero
  This action pads values with leading zeroes up to the maximum number of digits found in each supported tag of all selected tracks.

## What tags?
- Track Number
- Disc Number
- Season Number
- Episode Number
