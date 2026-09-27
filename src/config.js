// config.js: project settings.
//   duration: the video's length in seconds.
//   bpm:      the rhythm that bounces, dances and pulse() follow. Clawd always moves to some beat; if the video has music,
//             set this to the song's tempo, and set offset to the time in seconds of its first downbeat.
//   lite:     no watercolour fills (each fill becomes a translucent wash). Turn it on without a GPU, where fills cost
//             seconds a frame each.
const PROJECT = { duration: 30, bpm: 96, offset: 0, lite: true };
