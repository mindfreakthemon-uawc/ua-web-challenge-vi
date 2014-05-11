define(function () {
	var mul_table = [512, 512, 456, 512, 328, 456, 335, 512, 405, 328, 271, 456, 388, 335, 292, 512, 454, 405, 364,
			328, 298, 271, 496, 456, 420, 388, 360, 335, 312, 292, 273, 512],
		shg_table = [ 9, 11, 12, 13, 13, 14, 14, 15, 15, 15, 15, 16, 16, 16, 16, 17, 17, 17, 17, 17, 17, 17,
			18, 18, 18, 18, 18, 18, 18, 18, 18, 19 ];

	/**
	 * @constructor
	 */
	function Stack() {
		this.r = 0;
		this.g = 0;
		this.b = 0;
		this.a = 0;
		this.next = null;
	}

	/**
	 * @param imageData
	 * @param options {{radius: number}}
	 */
	function gaussian(imageData, options) {
		var pixels = imageData.data;

		var x, y, i, p, yp, yi, yw,
			r_sum, g_sum, b_sum, a_sum,
			r_out_sum, g_out_sum, b_out_sum, a_out_sum,
			r_in_sum, g_in_sum, b_in_sum, a_in_sum,
			pr, pg, pb, pa, rbs;

		var div = options.radius + options.radius + 1,
			widthMinus1 = imageData.width - 1,
			heightMinus1 = imageData.height - 1,
			radiusPlus1 = options.radius + 1,
			sumFactor = radiusPlus1 * (radiusPlus1 + 1) / 2;

		var stackStart = new Stack(),
			stack = stackStart,
			stackIn = null,
			stackOut = null,
			stackEnd;

		for (i = 1; i < div; i++) {
			stack = stack.next = new Stack();

			if (i == radiusPlus1) {
				stackEnd = stack;
			}
		}

		stack.next = stackStart;

		yw = yi = 0;

		var mul_sum = mul_table[options.radius],
			shg_sum = shg_table[options.radius];

		for (y = 0; y < imageData.height; y++) {
			r_in_sum = g_in_sum = b_in_sum = a_in_sum = r_sum = g_sum = b_sum = a_sum = 0;

			r_out_sum = radiusPlus1 * (pr = pixels[yi]);
			g_out_sum = radiusPlus1 * (pg = pixels[yi + 1]);
			b_out_sum = radiusPlus1 * (pb = pixels[yi + 2]);
			a_out_sum = radiusPlus1 * (pa = pixels[yi + 3]);

			r_sum += sumFactor * pr;
			g_sum += sumFactor * pg;
			b_sum += sumFactor * pb;
			a_sum += sumFactor * pa;

			stack = stackStart;

			for (i = 0; i < radiusPlus1; i++) {
				stack.r = pr;
				stack.g = pg;
				stack.b = pb;
				stack.a = pa;
				stack = stack.next;
			}

			for (i = 1; i < radiusPlus1; i++) {
				p = yi + ((widthMinus1 < i ? widthMinus1 : i) << 2);
				r_sum += (stack.r = (pr = pixels[p])) * (rbs = radiusPlus1 - i);
				g_sum += (stack.g = (pg = pixels[p + 1])) * rbs;
				b_sum += (stack.b = (pb = pixels[p + 2])) * rbs;
				a_sum += (stack.a = (pa = pixels[p + 3])) * rbs;

				r_in_sum += pr;
				g_in_sum += pg;
				b_in_sum += pb;
				a_in_sum += pa;

				stack = stack.next;
			}

			stackIn = stackStart;
			stackOut = stackEnd;

			for (x = 0; x < imageData.width; x++) {
				pixels[yi + 3] = pa = (a_sum * mul_sum) >> shg_sum;

				if (pa != 0) {
					pa = 255 / pa;
					pixels[yi] = ((r_sum * mul_sum) >> shg_sum) * pa;
					pixels[yi + 1] = ((g_sum * mul_sum) >> shg_sum) * pa;
					pixels[yi + 2] = ((b_sum * mul_sum) >> shg_sum) * pa;
				} else {
					pixels[yi] = pixels[yi + 1] = pixels[yi + 2] = 0;
				}

				r_sum -= r_out_sum;
				g_sum -= g_out_sum;
				b_sum -= b_out_sum;
				a_sum -= a_out_sum;

				r_out_sum -= stackIn.r;
				g_out_sum -= stackIn.g;
				b_out_sum -= stackIn.b;
				a_out_sum -= stackIn.a;

				p = (yw + ((p = x + options.radius + 1) < widthMinus1 ? p : widthMinus1)) << 2;

				r_in_sum += (stackIn.r = pixels[p]);
				g_in_sum += (stackIn.g = pixels[p + 1]);
				b_in_sum += (stackIn.b = pixels[p + 2]);
				a_in_sum += (stackIn.a = pixels[p + 3]);

				r_sum += r_in_sum;
				g_sum += g_in_sum;
				b_sum += b_in_sum;
				a_sum += a_in_sum;

				stackIn = stackIn.next;

				r_out_sum += (pr = stackOut.r);
				g_out_sum += (pg = stackOut.g);
				b_out_sum += (pb = stackOut.b);
				a_out_sum += (pa = stackOut.a);

				r_in_sum -= pr;
				g_in_sum -= pg;
				b_in_sum -= pb;
				a_in_sum -= pa;

				stackOut = stackOut.next;

				yi += 4;
			}

			yw += imageData.width;
		}

		for (x = 0; x < imageData.width; x++) {
			g_in_sum = b_in_sum = a_in_sum = r_in_sum = g_sum = b_sum = a_sum = r_sum = 0;

			yi = x << 2;
			r_out_sum = radiusPlus1 * (pr = pixels[yi]);
			g_out_sum = radiusPlus1 * (pg = pixels[yi + 1]);
			b_out_sum = radiusPlus1 * (pb = pixels[yi + 2]);
			a_out_sum = radiusPlus1 * (pa = pixels[yi + 3]);

			r_sum += sumFactor * pr;
			g_sum += sumFactor * pg;
			b_sum += sumFactor * pb;
			a_sum += sumFactor * pa;

			stack = stackStart;

			for (i = 0; i < radiusPlus1; i++) {
				stack.r = pr;
				stack.g = pg;
				stack.b = pb;
				stack.a = pa;
				stack = stack.next;
			}

			yp = imageData.width;

			for (i = 1; i <= options.radius; i++) {
				yi = (yp + x) << 2;

				r_sum += (stack.r = (pr = pixels[yi])) * (rbs = radiusPlus1 - i);
				g_sum += (stack.g = (pg = pixels[yi + 1])) * rbs;
				b_sum += (stack.b = (pb = pixels[yi + 2])) * rbs;
				a_sum += (stack.a = (pa = pixels[yi + 3])) * rbs;

				r_in_sum += pr;
				g_in_sum += pg;
				b_in_sum += pb;
				a_in_sum += pa;

				stack = stack.next;

				if (i < heightMinus1) {
					yp += imageData.width;
				}
			}

			yi = x;
			stackIn = stackStart;
			stackOut = stackEnd;

			for (y = 0; y < imageData.height; y++) {
				p = yi << 2;
				pixels[p + 3] = pa = (a_sum * mul_sum) >> shg_sum;

				if (pa > 0) {
					pa = 255 / pa;
					pixels[p] = ((r_sum * mul_sum) >> shg_sum) * pa;
					pixels[p + 1] = ((g_sum * mul_sum) >> shg_sum) * pa;
					pixels[p + 2] = ((b_sum * mul_sum) >> shg_sum) * pa;
				} else {
					pixels[p] = pixels[p + 1] = pixels[p + 2] = 0;
				}

				r_sum -= r_out_sum;
				g_sum -= g_out_sum;
				b_sum -= b_out_sum;
				a_sum -= a_out_sum;

				r_out_sum -= stackIn.r;
				g_out_sum -= stackIn.g;
				b_out_sum -= stackIn.b;
				a_out_sum -= stackIn.a;

				p = (x + (((p = y + radiusPlus1) < heightMinus1 ? p : heightMinus1) * imageData.width)) << 2;

				r_sum += (r_in_sum += (stackIn.r = pixels[p]));
				g_sum += (g_in_sum += (stackIn.g = pixels[p + 1]));
				b_sum += (b_in_sum += (stackIn.b = pixels[p + 2]));
				a_sum += (a_in_sum += (stackIn.a = pixels[p + 3]));

				stackIn = stackIn.next;

				r_out_sum += (pr = stackOut.r);
				g_out_sum += (pg = stackOut.g);
				b_out_sum += (pb = stackOut.b);
				a_out_sum += (pa = stackOut.a);

				r_in_sum -= pr;
				g_in_sum -= pg;
				b_in_sum -= pb;
				a_in_sum -= pa;

				stackOut = stackOut.next;

				yi += imageData.width;
			}
		}
	}

	return {
		label: 'Gaussian blur',
		name: 'gaussian',
		runner: gaussian,
		options: {
			radius: {
				label: 'Radius',
				min: 1,
				max: 25,
				value: 10,
				type: 'range'
			}
		}
	};
});
