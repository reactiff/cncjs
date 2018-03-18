var poly = (c, s, r, o) => {
    return Array.from({ length: c }).map(function (v, i, a) {
        var p = pi2 / c * i;
        return new Vector(
            sin(p + r) * s / 2 + o.x,
            cos(p + r) * s / 2 + o.y,
            undefined);
    });
};
