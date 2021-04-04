export const formatTime = (time: number): string => {
  var date = new Date(0);
  date.setSeconds(time);

  var timeString = date.toISOString().substr(15, 4);

  return timeString;
}