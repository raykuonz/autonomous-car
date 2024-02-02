/**
 * Distance
 * @param {Point} p1
 * @param {Point} p2
 * @returns {number}
 */
function distance(p1, p2) {
    return Math.hypot(p1.x - p2.x, p1.y - p2.y);
}

/**
 * Get nearest point
 * @param {Point} location
 * @param {Point[]} points
 * @param {number} [threshold]
 * @returns {Point}
 */
function getNearestPoint(location, points, threshold = Number.MAX_SAFE_INTEGER) {
    let minDistance = Number.MAX_SAFE_INTEGER;
    let nearest = null;
    for (const point of points) {
        const dist = distance(point, location);
        if (dist < minDistance && dist < threshold) {
            minDistance = dist;
            nearest = point;
        }
    }

    return nearest;
}

function getNearestSegment(location, segments, threshold = Number.MIN_SAFE_INTEGER) {
    let minDistance = Number.MAX_SAFE_INTEGER;
    let nearest = null;
    for (const segment of segments) {
        const dist = segment.distanceToPoint(location);

        if (dist < minDistance && dist < threshold) {
            minDistance = dist;
            nearest = segment;
        }
    }

    return nearest;
}

/**
 * Substract
 * @param {Point} p1
 * @param {Point} p2
 * @returns {Point}
 */
function substract(p1, p2) {
    return new Point(p1.x - p2.x, p1.y - p2.y);
}

/**
 * Add
 * @param {Point} p1
 * @param {Point} p2
 * @returns {Point}
 */
function add(p1, p2) {
    return new Point(p1.x + p2.x, p1.y + p2.y);
}

/**
 * Average
 * @param {Point} p1
 * @param {Point} p2
 * @returns {Point}
 */
function average(p1, p2) {
    return new Point((p1.x + p2.x) / 2, (p1.y + p2.y) / 2);
}

/**
 * Dot
 * @param {Point} p1
 * @param {Point} p2
 * @returns {number}
 */
function dot(p1, p2) {
    return p1.x * p2.x + p1.y * p2.y;
}

/**
 * Scale
 * @param {Point} point
 * @param {number} scaler
 */
function scale(point, scaler) {
    return new Point(point.x * scaler, point.y * scaler);
}

/**
 * Translate
 * @param {Point} location
 * @param {number} angle
 * @param {number} offset
 * @returns
 */
function translate(location, angle, offset) {
    return new Point(
        location.x + Math.cos(angle) * offset,
        location.y + Math.sin(angle) * offset,
    );
}

/**
 * Perpendicular
 * @param {Point} point
 * @returns  {Point}
 */
function perpendicular(point) {
    return new Point(-point.y, point.x);
}

/**
 * Angle
 * @param {Point} point
 * @returns {number}
 */
function angle(point) {
    return Math.atan2(point.y, point.x);
}

function normalize(point) {
    return scale(point, 1 / magnitude(point));
}

function magnitude(point) {
    return Math.hypot(point.x, point.y);
}

/**
 * Lerp
 * @param {number} a
 * @param {number} b
 * @param {number} t
 * @returns {number}
 */
function lerp(a, b, t) {
    return a + (b - a) * t;
}

/**
 * Lerp 2D
 * @param {Point} p1
 * @param {Point} p2
 * @param {number} t
 * @returns {Point}
 */
function lerp2D(p1, p2, t) {
    return new Point(
        lerp(p1.x, p2.x, t),
        lerp(p1.y, p2.y, t),
    );
}

/**
 * Invert lerp
 * @param {number} a
 * @param {number} b
 * @param {number} v
 * @returns {number}
 */
function invLerp(a, b, v) {
    return (v - a) / (b - a);
}

/**
 * Degree to radian
 * @param {number} deg
 * @returns {number}
 */
function degToRad(deg) {
    return deg * Math.PI / 180;
}

/**
 * Get intersection
 * @param {Point} a
 * @param {Point} b
 * @param {Point} c
 * @param {Point} d
 * @returns {x: number, y: number, offset: number}
 */
function getIntersection(a, b, c, d) {
    const tTop = (d.x - c.x) * (a.y - c.y) - (d.y - c.y) * (a.x - c.x);
    const uTop = (c.y - a.y) * (a.x - b.x) - (c.x - a.x) * (a.y - b.y);
    const bottom = (d.y - c.y) * (b.x - a.x) - (d.x - c.x) * (b.y - a.y);

    const eps = 0.001;

    if (Math.abs(bottom) > eps) {

        const t = tTop / bottom;
        const u = uTop / bottom;
        if (t >= 0 && t <= 1 && u >=0 && u <= 1) {
            return {
                x: lerp(a.x, b.x, t),
                y: lerp(a.y, b.y, t),
                offset: t,
            }
        }
    }

    return null;
}

/**
 * Get random color
 * @returns {string}
 */
function getRandomColor() {
    const hue = 290 + Math.random() * 260;
    return `hsl(${hue}, 100%, 60%)`;
}

/**
 * Get fake 3d point
 * @param {Point} point
 * @param {Point} viewPoint
 * @param {number} height
 * @returns {Point}
 */
function getFake3dPoint(point, viewPoint, height) {
    const dir = normalize(substract(point, viewPoint));
    const dist = distance(point, viewPoint);
    const scaler = Math.atan(dist/ 300) / (Math.PI / 2);
    return add(point, scale(dir, height * scaler));
}