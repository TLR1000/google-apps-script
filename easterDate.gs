function easterDate(year) {
/*

The algorithm used by the easterDate() function is called the Meeus/Jones/Butcher algorithm and it is used to calculate the date of Easter for a given year.

Here's a brief explanation of the algorithm:

First, we need to calculate the values of several variables based on the year for which we want to calculate Easter. These variables are a, b, c, d, e, f, g, h, i, k, l, m, n, and p.

Using these variables, we can then calculate the date of Easter. The date of Easter is the first Sunday after the first full moon after the vernal equinox (the first day of spring). In other words, we need to find the date of the full moon that falls on or after March 21st (the vernal equinox), and then find the Sunday that follows that full moon.

To calculate the date of the full moon, we can use the values of a, b, c, d, e, f, g, h, i, k, l, m, n, and p that we calculated earlier, along with a few more calculations.

Once we have the date of the full moon, we can find the Sunday that follows it by simply adding the appropriate number of days.

That's a high-level overview of the algorithm. If you're interested in more details, you can check out this Wikipedia article on the computus, which is the calculation of the date of Easter in the Christian calendar: https://en.wikipedia.org/wiki/Computus
*/

  const a = year % 19; //Y mod 19: we take the year and divide it by 19 using integer division (which means that we ignore any remainder)
  const b = Math.floor(year / 100); //get the integer value of the first two digits of the year
  const c = year % 100; //extract the first two digits of the year.
  const d = Math.floor(b / 4); 
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const n = Math.floor((h + l - 7 * m + 114) / 31);
  const p = (h + l - 7 * m + 114) % 31;
  return new Date(year, n - 1, p + 1);
}
