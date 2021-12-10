function subTimes(t1, t2) {
    if (t1[0] === t2[0]) {
        return t2[1] - t1[1];
    } else {
      var m = t2[1], h = t1[0];
      while (h != t2[0]) {
        if (h > 0) {
          m += (60 - t1[1]);
          t1[1] = 0;
        } else {
          m += 60;
        }
        h++;
      }
      return m;
    }
}