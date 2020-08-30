## Byurds

Cause everybody has to do a Boids implementation at least once. I tried to do
it in a more physically accurate way (by not locking the velocity and setting
steering angles, and instead actually calculating it based on applied forces).

### Known bugs

If you decrease the size of the Byurds and apply big forces, they sometimes get
stuck at the top left of the screen and can't escape. This is due to some weird
interaction of overflows (maybe from air resistance squaring the velocity?). It
could probably be patched with some max velocity hack or something, but not
really worth the bother (also I worry that the fix would result in another bug,
whose fix would result in another bug, etc., etc.).