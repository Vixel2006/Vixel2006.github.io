(function(scope){
'use strict';

function F(arity, fun, wrapper) {
  wrapper.a = arity;
  wrapper.f = fun;
  return wrapper;
}

function F2(fun) {
  return F(2, fun, function(a) { return function(b) { return fun(a,b); }; })
}
function F3(fun) {
  return F(3, fun, function(a) {
    return function(b) { return function(c) { return fun(a, b, c); }; };
  });
}
function F4(fun) {
  return F(4, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return fun(a, b, c, d); }; }; };
  });
}
function F5(fun) {
  return F(5, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return fun(a, b, c, d, e); }; }; }; };
  });
}
function F6(fun) {
  return F(6, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return fun(a, b, c, d, e, f); }; }; }; }; };
  });
}
function F7(fun) {
  return F(7, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return function(g) { return fun(a, b, c, d, e, f, g); }; }; }; }; }; };
  });
}
function F8(fun) {
  return F(8, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return function(g) { return function(h) {
    return fun(a, b, c, d, e, f, g, h); }; }; }; }; }; }; };
  });
}
function F9(fun) {
  return F(9, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return function(g) { return function(h) { return function(i) {
    return fun(a, b, c, d, e, f, g, h, i); }; }; }; }; }; }; }; };
  });
}

function A2(fun, a, b) {
  return fun.a === 2 ? fun.f(a, b) : fun(a)(b);
}
function A3(fun, a, b, c) {
  return fun.a === 3 ? fun.f(a, b, c) : fun(a)(b)(c);
}
function A4(fun, a, b, c, d) {
  return fun.a === 4 ? fun.f(a, b, c, d) : fun(a)(b)(c)(d);
}
function A5(fun, a, b, c, d, e) {
  return fun.a === 5 ? fun.f(a, b, c, d, e) : fun(a)(b)(c)(d)(e);
}
function A6(fun, a, b, c, d, e, f) {
  return fun.a === 6 ? fun.f(a, b, c, d, e, f) : fun(a)(b)(c)(d)(e)(f);
}
function A7(fun, a, b, c, d, e, f, g) {
  return fun.a === 7 ? fun.f(a, b, c, d, e, f, g) : fun(a)(b)(c)(d)(e)(f)(g);
}
function A8(fun, a, b, c, d, e, f, g, h) {
  return fun.a === 8 ? fun.f(a, b, c, d, e, f, g, h) : fun(a)(b)(c)(d)(e)(f)(g)(h);
}
function A9(fun, a, b, c, d, e, f, g, h, i) {
  return fun.a === 9 ? fun.f(a, b, c, d, e, f, g, h, i) : fun(a)(b)(c)(d)(e)(f)(g)(h)(i);
}




// EQUALITY

function _Utils_eq(x, y)
{
	for (
		var pair, stack = [], isEqual = _Utils_eqHelp(x, y, 0, stack);
		isEqual && (pair = stack.pop());
		isEqual = _Utils_eqHelp(pair.a, pair.b, 0, stack)
		)
	{}

	return isEqual;
}

function _Utils_eqHelp(x, y, depth, stack)
{
	if (x === y)
	{
		return true;
	}

	if (typeof x !== 'object' || x === null || y === null)
	{
		typeof x === 'function' && _Debug_crash(5);
		return false;
	}

	if (depth > 100)
	{
		stack.push(_Utils_Tuple2(x,y));
		return true;
	}

	/**_UNUSED/
	if (x.$ === 'Set_elm_builtin')
	{
		x = $elm$core$Set$toList(x);
		y = $elm$core$Set$toList(y);
	}
	if (x.$ === 'RBNode_elm_builtin' || x.$ === 'RBEmpty_elm_builtin')
	{
		x = $elm$core$Dict$toList(x);
		y = $elm$core$Dict$toList(y);
	}
	//*/

	/**/
	if (x.$ < 0)
	{
		x = $elm$core$Dict$toList(x);
		y = $elm$core$Dict$toList(y);
	}
	//*/

	for (var key in x)
	{
		if (!_Utils_eqHelp(x[key], y[key], depth + 1, stack))
		{
			return false;
		}
	}
	return true;
}

var _Utils_equal = F2(_Utils_eq);
var _Utils_notEqual = F2(function(a, b) { return !_Utils_eq(a,b); });



// COMPARISONS

// Code in Generate/JavaScript.hs, Basics.js, and List.js depends on
// the particular integer values assigned to LT, EQ, and GT.

function _Utils_cmp(x, y, ord)
{
	if (typeof x !== 'object')
	{
		return x === y ? /*EQ*/ 0 : x < y ? /*LT*/ -1 : /*GT*/ 1;
	}

	/**_UNUSED/
	if (x instanceof String)
	{
		var a = x.valueOf();
		var b = y.valueOf();
		return a === b ? 0 : a < b ? -1 : 1;
	}
	//*/

	/**/
	if (typeof x.$ === 'undefined')
	//*/
	/**_UNUSED/
	if (x.$[0] === '#')
	//*/
	{
		return (ord = _Utils_cmp(x.a, y.a))
			? ord
			: (ord = _Utils_cmp(x.b, y.b))
				? ord
				: _Utils_cmp(x.c, y.c);
	}

	// traverse conses until end of a list or a mismatch
	for (; x.b && y.b && !(ord = _Utils_cmp(x.a, y.a)); x = x.b, y = y.b) {} // WHILE_CONSES
	return ord || (x.b ? /*GT*/ 1 : y.b ? /*LT*/ -1 : /*EQ*/ 0);
}

var _Utils_lt = F2(function(a, b) { return _Utils_cmp(a, b) < 0; });
var _Utils_le = F2(function(a, b) { return _Utils_cmp(a, b) < 1; });
var _Utils_gt = F2(function(a, b) { return _Utils_cmp(a, b) > 0; });
var _Utils_ge = F2(function(a, b) { return _Utils_cmp(a, b) >= 0; });

var _Utils_compare = F2(function(x, y)
{
	var n = _Utils_cmp(x, y);
	return n < 0 ? $elm$core$Basics$LT : n ? $elm$core$Basics$GT : $elm$core$Basics$EQ;
});


// COMMON VALUES

var _Utils_Tuple0 = 0;
var _Utils_Tuple0_UNUSED = { $: '#0' };

function _Utils_Tuple2(a, b) { return { a: a, b: b }; }
function _Utils_Tuple2_UNUSED(a, b) { return { $: '#2', a: a, b: b }; }

function _Utils_Tuple3(a, b, c) { return { a: a, b: b, c: c }; }
function _Utils_Tuple3_UNUSED(a, b, c) { return { $: '#3', a: a, b: b, c: c }; }

function _Utils_chr(c) { return c; }
function _Utils_chr_UNUSED(c) { return new String(c); }


// RECORDS

function _Utils_update(oldRecord, updatedFields)
{
	var newRecord = {};

	for (var key in oldRecord)
	{
		newRecord[key] = oldRecord[key];
	}

	for (var key in updatedFields)
	{
		newRecord[key] = updatedFields[key];
	}

	return newRecord;
}


// APPEND

var _Utils_append = F2(_Utils_ap);

function _Utils_ap(xs, ys)
{
	// append Strings
	if (typeof xs === 'string')
	{
		return xs + ys;
	}

	// append Lists
	if (!xs.b)
	{
		return ys;
	}
	var root = _List_Cons(xs.a, ys);
	xs = xs.b
	for (var curr = root; xs.b; xs = xs.b) // WHILE_CONS
	{
		curr = curr.b = _List_Cons(xs.a, ys);
	}
	return root;
}



var _List_Nil = { $: 0 };
var _List_Nil_UNUSED = { $: '[]' };

function _List_Cons(hd, tl) { return { $: 1, a: hd, b: tl }; }
function _List_Cons_UNUSED(hd, tl) { return { $: '::', a: hd, b: tl }; }


var _List_cons = F2(_List_Cons);

function _List_fromArray(arr)
{
	var out = _List_Nil;
	for (var i = arr.length; i--; )
	{
		out = _List_Cons(arr[i], out);
	}
	return out;
}

function _List_toArray(xs)
{
	for (var out = []; xs.b; xs = xs.b) // WHILE_CONS
	{
		out.push(xs.a);
	}
	return out;
}

var _List_map2 = F3(function(f, xs, ys)
{
	for (var arr = []; xs.b && ys.b; xs = xs.b, ys = ys.b) // WHILE_CONSES
	{
		arr.push(A2(f, xs.a, ys.a));
	}
	return _List_fromArray(arr);
});

var _List_map3 = F4(function(f, xs, ys, zs)
{
	for (var arr = []; xs.b && ys.b && zs.b; xs = xs.b, ys = ys.b, zs = zs.b) // WHILE_CONSES
	{
		arr.push(A3(f, xs.a, ys.a, zs.a));
	}
	return _List_fromArray(arr);
});

var _List_map4 = F5(function(f, ws, xs, ys, zs)
{
	for (var arr = []; ws.b && xs.b && ys.b && zs.b; ws = ws.b, xs = xs.b, ys = ys.b, zs = zs.b) // WHILE_CONSES
	{
		arr.push(A4(f, ws.a, xs.a, ys.a, zs.a));
	}
	return _List_fromArray(arr);
});

var _List_map5 = F6(function(f, vs, ws, xs, ys, zs)
{
	for (var arr = []; vs.b && ws.b && xs.b && ys.b && zs.b; vs = vs.b, ws = ws.b, xs = xs.b, ys = ys.b, zs = zs.b) // WHILE_CONSES
	{
		arr.push(A5(f, vs.a, ws.a, xs.a, ys.a, zs.a));
	}
	return _List_fromArray(arr);
});

var _List_sortBy = F2(function(f, xs)
{
	return _List_fromArray(_List_toArray(xs).sort(function(a, b) {
		return _Utils_cmp(f(a), f(b));
	}));
});

var _List_sortWith = F2(function(f, xs)
{
	return _List_fromArray(_List_toArray(xs).sort(function(a, b) {
		var ord = A2(f, a, b);
		return ord === $elm$core$Basics$EQ ? 0 : ord === $elm$core$Basics$LT ? -1 : 1;
	}));
});



var _JsArray_empty = [];

function _JsArray_singleton(value)
{
    return [value];
}

function _JsArray_length(array)
{
    return array.length;
}

var _JsArray_initialize = F3(function(size, offset, func)
{
    var result = new Array(size);

    for (var i = 0; i < size; i++)
    {
        result[i] = func(offset + i);
    }

    return result;
});

var _JsArray_initializeFromList = F2(function (max, ls)
{
    var result = new Array(max);

    for (var i = 0; i < max && ls.b; i++)
    {
        result[i] = ls.a;
        ls = ls.b;
    }

    result.length = i;
    return _Utils_Tuple2(result, ls);
});

var _JsArray_unsafeGet = F2(function(index, array)
{
    return array[index];
});

var _JsArray_unsafeSet = F3(function(index, value, array)
{
    var length = array.length;
    var result = new Array(length);

    for (var i = 0; i < length; i++)
    {
        result[i] = array[i];
    }

    result[index] = value;
    return result;
});

var _JsArray_push = F2(function(value, array)
{
    var length = array.length;
    var result = new Array(length + 1);

    for (var i = 0; i < length; i++)
    {
        result[i] = array[i];
    }

    result[length] = value;
    return result;
});

var _JsArray_foldl = F3(function(func, acc, array)
{
    var length = array.length;

    for (var i = 0; i < length; i++)
    {
        acc = A2(func, array[i], acc);
    }

    return acc;
});

var _JsArray_foldr = F3(function(func, acc, array)
{
    for (var i = array.length - 1; i >= 0; i--)
    {
        acc = A2(func, array[i], acc);
    }

    return acc;
});

var _JsArray_map = F2(function(func, array)
{
    var length = array.length;
    var result = new Array(length);

    for (var i = 0; i < length; i++)
    {
        result[i] = func(array[i]);
    }

    return result;
});

var _JsArray_indexedMap = F3(function(func, offset, array)
{
    var length = array.length;
    var result = new Array(length);

    for (var i = 0; i < length; i++)
    {
        result[i] = A2(func, offset + i, array[i]);
    }

    return result;
});

var _JsArray_slice = F3(function(from, to, array)
{
    return array.slice(from, to);
});

var _JsArray_appendN = F3(function(n, dest, source)
{
    var destLen = dest.length;
    var itemsToCopy = n - destLen;

    if (itemsToCopy > source.length)
    {
        itemsToCopy = source.length;
    }

    var size = destLen + itemsToCopy;
    var result = new Array(size);

    for (var i = 0; i < destLen; i++)
    {
        result[i] = dest[i];
    }

    for (var i = 0; i < itemsToCopy; i++)
    {
        result[i + destLen] = source[i];
    }

    return result;
});



// LOG

var _Debug_log = F2(function(tag, value)
{
	return value;
});

var _Debug_log_UNUSED = F2(function(tag, value)
{
	console.log(tag + ': ' + _Debug_toString(value));
	return value;
});


// TODOS

function _Debug_todo(moduleName, region)
{
	return function(message) {
		_Debug_crash(8, moduleName, region, message);
	};
}

function _Debug_todoCase(moduleName, region, value)
{
	return function(message) {
		_Debug_crash(9, moduleName, region, value, message);
	};
}


// TO STRING

function _Debug_toString(value)
{
	return '<internals>';
}

function _Debug_toString_UNUSED(value)
{
	return _Debug_toAnsiString(false, value);
}

function _Debug_toAnsiString(ansi, value)
{
	if (typeof value === 'function')
	{
		return _Debug_internalColor(ansi, '<function>');
	}

	if (typeof value === 'boolean')
	{
		return _Debug_ctorColor(ansi, value ? 'True' : 'False');
	}

	if (typeof value === 'number')
	{
		return _Debug_numberColor(ansi, value + '');
	}

	if (value instanceof String)
	{
		return _Debug_charColor(ansi, "'" + _Debug_addSlashes(value, true) + "'");
	}

	if (typeof value === 'string')
	{
		return _Debug_stringColor(ansi, '"' + _Debug_addSlashes(value, false) + '"');
	}

	if (typeof value === 'object' && '$' in value)
	{
		var tag = value.$;

		if (typeof tag === 'number')
		{
			return _Debug_internalColor(ansi, '<internals>');
		}

		if (tag[0] === '#')
		{
			var output = [];
			for (var k in value)
			{
				if (k === '$') continue;
				output.push(_Debug_toAnsiString(ansi, value[k]));
			}
			return '(' + output.join(',') + ')';
		}

		if (tag === 'Set_elm_builtin')
		{
			return _Debug_ctorColor(ansi, 'Set')
				+ _Debug_fadeColor(ansi, '.fromList') + ' '
				+ _Debug_toAnsiString(ansi, $elm$core$Set$toList(value));
		}

		if (tag === 'RBNode_elm_builtin' || tag === 'RBEmpty_elm_builtin')
		{
			return _Debug_ctorColor(ansi, 'Dict')
				+ _Debug_fadeColor(ansi, '.fromList') + ' '
				+ _Debug_toAnsiString(ansi, $elm$core$Dict$toList(value));
		}

		if (tag === 'Array_elm_builtin')
		{
			return _Debug_ctorColor(ansi, 'Array')
				+ _Debug_fadeColor(ansi, '.fromList') + ' '
				+ _Debug_toAnsiString(ansi, $elm$core$Array$toList(value));
		}

		if (tag === '::' || tag === '[]')
		{
			var output = '[';

			value.b && (output += _Debug_toAnsiString(ansi, value.a), value = value.b)

			for (; value.b; value = value.b) // WHILE_CONS
			{
				output += ',' + _Debug_toAnsiString(ansi, value.a);
			}
			return output + ']';
		}

		var output = '';
		for (var i in value)
		{
			if (i === '$') continue;
			var str = _Debug_toAnsiString(ansi, value[i]);
			var c0 = str[0];
			var parenless = c0 === '{' || c0 === '(' || c0 === '[' || c0 === '<' || c0 === '"' || str.indexOf(' ') < 0;
			output += ' ' + (parenless ? str : '(' + str + ')');
		}
		return _Debug_ctorColor(ansi, tag) + output;
	}

	if (typeof DataView === 'function' && value instanceof DataView)
	{
		return _Debug_stringColor(ansi, '<' + value.byteLength + ' bytes>');
	}

	if (typeof File !== 'undefined' && value instanceof File)
	{
		return _Debug_internalColor(ansi, '<' + value.name + '>');
	}

	if (typeof value === 'object')
	{
		var output = [];
		for (var key in value)
		{
			var field = key[0] === '_' ? key.slice(1) : key;
			output.push(_Debug_fadeColor(ansi, field) + ' = ' + _Debug_toAnsiString(ansi, value[key]));
		}
		if (output.length === 0)
		{
			return '{}';
		}
		return '{ ' + output.join(', ') + ' }';
	}

	return _Debug_internalColor(ansi, '<internals>');
}

function _Debug_addSlashes(str, isChar)
{
	var s = str
		.replace(/\\/g, '\\\\')
		.replace(/\n/g, '\\n')
		.replace(/\t/g, '\\t')
		.replace(/\r/g, '\\r')
		.replace(/\v/g, '\\v')
		.replace(/\0/g, '\\0');

	if (isChar)
	{
		return s.replace(/\'/g, '\\\'');
	}
	else
	{
		return s.replace(/\"/g, '\\"');
	}
}

function _Debug_ctorColor(ansi, string)
{
	return ansi ? '\x1b[96m' + string + '\x1b[0m' : string;
}

function _Debug_numberColor(ansi, string)
{
	return ansi ? '\x1b[95m' + string + '\x1b[0m' : string;
}

function _Debug_stringColor(ansi, string)
{
	return ansi ? '\x1b[93m' + string + '\x1b[0m' : string;
}

function _Debug_charColor(ansi, string)
{
	return ansi ? '\x1b[92m' + string + '\x1b[0m' : string;
}

function _Debug_fadeColor(ansi, string)
{
	return ansi ? '\x1b[37m' + string + '\x1b[0m' : string;
}

function _Debug_internalColor(ansi, string)
{
	return ansi ? '\x1b[36m' + string + '\x1b[0m' : string;
}

function _Debug_toHexDigit(n)
{
	return String.fromCharCode(n < 10 ? 48 + n : 55 + n);
}


// CRASH


function _Debug_crash(identifier)
{
	throw new Error('https://github.com/elm/core/blob/1.0.0/hints/' + identifier + '.md');
}


function _Debug_crash_UNUSED(identifier, fact1, fact2, fact3, fact4)
{
	switch(identifier)
	{
		case 0:
			throw new Error('What node should I take over? In JavaScript I need something like:\n\n    Elm.Main.init({\n        node: document.getElementById("elm-node")\n    })\n\nYou need to do this with any Browser.sandbox or Browser.element program.');

		case 1:
			throw new Error('Browser.application programs cannot handle URLs like this:\n\n    ' + document.location.href + '\n\nWhat is the root? The root of your file system? Try looking at this program with `elm reactor` or some other server.');

		case 2:
			var jsonErrorString = fact1;
			throw new Error('Problem with the flags given to your Elm program on initialization.\n\n' + jsonErrorString);

		case 3:
			var portName = fact1;
			throw new Error('There can only be one port named `' + portName + '`, but your program has multiple.');

		case 4:
			var portName = fact1;
			var problem = fact2;
			throw new Error('Trying to send an unexpected type of value through port `' + portName + '`:\n' + problem);

		case 5:
			throw new Error('Trying to use `(==)` on functions.\nThere is no way to know if functions are "the same" in the Elm sense.\nRead more about this at https://package.elm-lang.org/packages/elm/core/latest/Basics#== which describes why it is this way and what the better version will look like.');

		case 6:
			var moduleName = fact1;
			throw new Error('Your page is loading multiple Elm scripts with a module named ' + moduleName + '. Maybe a duplicate script is getting loaded accidentally? If not, rename one of them so I know which is which!');

		case 8:
			var moduleName = fact1;
			var region = fact2;
			var message = fact3;
			throw new Error('TODO in module `' + moduleName + '` ' + _Debug_regionToString(region) + '\n\n' + message);

		case 9:
			var moduleName = fact1;
			var region = fact2;
			var value = fact3;
			var message = fact4;
			throw new Error(
				'TODO in module `' + moduleName + '` from the `case` expression '
				+ _Debug_regionToString(region) + '\n\nIt received the following value:\n\n    '
				+ _Debug_toString(value).replace('\n', '\n    ')
				+ '\n\nBut the branch that handles it says:\n\n    ' + message.replace('\n', '\n    ')
			);

		case 10:
			throw new Error('Bug in https://github.com/elm/virtual-dom/issues');

		case 11:
			throw new Error('Cannot perform mod 0. Division by zero error.');
	}
}

function _Debug_regionToString(region)
{
	if (region.ao.L === region.av.L)
	{
		return 'on line ' + region.ao.L;
	}
	return 'on lines ' + region.ao.L + ' through ' + region.av.L;
}



// MATH

var _Basics_add = F2(function(a, b) { return a + b; });
var _Basics_sub = F2(function(a, b) { return a - b; });
var _Basics_mul = F2(function(a, b) { return a * b; });
var _Basics_fdiv = F2(function(a, b) { return a / b; });
var _Basics_idiv = F2(function(a, b) { return (a / b) | 0; });
var _Basics_pow = F2(Math.pow);

var _Basics_remainderBy = F2(function(b, a) { return a % b; });

// https://www.microsoft.com/en-us/research/wp-content/uploads/2016/02/divmodnote-letter.pdf
var _Basics_modBy = F2(function(modulus, x)
{
	var answer = x % modulus;
	return modulus === 0
		? _Debug_crash(11)
		:
	((answer > 0 && modulus < 0) || (answer < 0 && modulus > 0))
		? answer + modulus
		: answer;
});


// TRIGONOMETRY

var _Basics_pi = Math.PI;
var _Basics_e = Math.E;
var _Basics_cos = Math.cos;
var _Basics_sin = Math.sin;
var _Basics_tan = Math.tan;
var _Basics_acos = Math.acos;
var _Basics_asin = Math.asin;
var _Basics_atan = Math.atan;
var _Basics_atan2 = F2(Math.atan2);


// MORE MATH

function _Basics_toFloat(x) { return x; }
function _Basics_truncate(n) { return n | 0; }
function _Basics_isInfinite(n) { return n === Infinity || n === -Infinity; }

var _Basics_ceiling = Math.ceil;
var _Basics_floor = Math.floor;
var _Basics_round = Math.round;
var _Basics_sqrt = Math.sqrt;
var _Basics_log = Math.log;
var _Basics_isNaN = isNaN;


// BOOLEANS

function _Basics_not(bool) { return !bool; }
var _Basics_and = F2(function(a, b) { return a && b; });
var _Basics_or  = F2(function(a, b) { return a || b; });
var _Basics_xor = F2(function(a, b) { return a !== b; });



var _String_cons = F2(function(chr, str)
{
	return chr + str;
});

function _String_uncons(string)
{
	var word = string.charCodeAt(0);
	return !isNaN(word)
		? $elm$core$Maybe$Just(
			0xD800 <= word && word <= 0xDBFF
				? _Utils_Tuple2(_Utils_chr(string[0] + string[1]), string.slice(2))
				: _Utils_Tuple2(_Utils_chr(string[0]), string.slice(1))
		)
		: $elm$core$Maybe$Nothing;
}

var _String_append = F2(function(a, b)
{
	return a + b;
});

function _String_length(str)
{
	return str.length;
}

var _String_map = F2(function(func, string)
{
	var len = string.length;
	var array = new Array(len);
	var i = 0;
	while (i < len)
	{
		var word = string.charCodeAt(i);
		if (0xD800 <= word && word <= 0xDBFF)
		{
			array[i] = func(_Utils_chr(string[i] + string[i+1]));
			i += 2;
			continue;
		}
		array[i] = func(_Utils_chr(string[i]));
		i++;
	}
	return array.join('');
});

var _String_filter = F2(function(isGood, str)
{
	var arr = [];
	var len = str.length;
	var i = 0;
	while (i < len)
	{
		var char = str[i];
		var word = str.charCodeAt(i);
		i++;
		if (0xD800 <= word && word <= 0xDBFF)
		{
			char += str[i];
			i++;
		}

		if (isGood(_Utils_chr(char)))
		{
			arr.push(char);
		}
	}
	return arr.join('');
});

function _String_reverse(str)
{
	var len = str.length;
	var arr = new Array(len);
	var i = 0;
	while (i < len)
	{
		var word = str.charCodeAt(i);
		if (0xD800 <= word && word <= 0xDBFF)
		{
			arr[len - i] = str[i + 1];
			i++;
			arr[len - i] = str[i - 1];
			i++;
		}
		else
		{
			arr[len - i] = str[i];
			i++;
		}
	}
	return arr.join('');
}

var _String_foldl = F3(function(func, state, string)
{
	var len = string.length;
	var i = 0;
	while (i < len)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		i++;
		if (0xD800 <= word && word <= 0xDBFF)
		{
			char += string[i];
			i++;
		}
		state = A2(func, _Utils_chr(char), state);
	}
	return state;
});

var _String_foldr = F3(function(func, state, string)
{
	var i = string.length;
	while (i--)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		if (0xDC00 <= word && word <= 0xDFFF)
		{
			i--;
			char = string[i] + char;
		}
		state = A2(func, _Utils_chr(char), state);
	}
	return state;
});

var _String_split = F2(function(sep, str)
{
	return str.split(sep);
});

var _String_join = F2(function(sep, strs)
{
	return strs.join(sep);
});

var _String_slice = F3(function(start, end, str) {
	return str.slice(start, end);
});

function _String_trim(str)
{
	return str.trim();
}

function _String_trimLeft(str)
{
	return str.replace(/^\s+/, '');
}

function _String_trimRight(str)
{
	return str.replace(/\s+$/, '');
}

function _String_words(str)
{
	return _List_fromArray(str.trim().split(/\s+/g));
}

function _String_lines(str)
{
	return _List_fromArray(str.split(/\r\n|\r|\n/g));
}

function _String_toUpper(str)
{
	return str.toUpperCase();
}

function _String_toLower(str)
{
	return str.toLowerCase();
}

var _String_any = F2(function(isGood, string)
{
	var i = string.length;
	while (i--)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		if (0xDC00 <= word && word <= 0xDFFF)
		{
			i--;
			char = string[i] + char;
		}
		if (isGood(_Utils_chr(char)))
		{
			return true;
		}
	}
	return false;
});

var _String_all = F2(function(isGood, string)
{
	var i = string.length;
	while (i--)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		if (0xDC00 <= word && word <= 0xDFFF)
		{
			i--;
			char = string[i] + char;
		}
		if (!isGood(_Utils_chr(char)))
		{
			return false;
		}
	}
	return true;
});

var _String_contains = F2(function(sub, str)
{
	return str.indexOf(sub) > -1;
});

var _String_startsWith = F2(function(sub, str)
{
	return str.indexOf(sub) === 0;
});

var _String_endsWith = F2(function(sub, str)
{
	return str.length >= sub.length &&
		str.lastIndexOf(sub) === str.length - sub.length;
});

var _String_indexes = F2(function(sub, str)
{
	var subLen = sub.length;

	if (subLen < 1)
	{
		return _List_Nil;
	}

	var i = 0;
	var is = [];

	while ((i = str.indexOf(sub, i)) > -1)
	{
		is.push(i);
		i = i + subLen;
	}

	return _List_fromArray(is);
});


// TO STRING

function _String_fromNumber(number)
{
	return number + '';
}


// INT CONVERSIONS

function _String_toInt(str)
{
	var total = 0;
	var code0 = str.charCodeAt(0);
	var start = code0 == 0x2B /* + */ || code0 == 0x2D /* - */ ? 1 : 0;

	for (var i = start; i < str.length; ++i)
	{
		var code = str.charCodeAt(i);
		if (code < 0x30 || 0x39 < code)
		{
			return $elm$core$Maybe$Nothing;
		}
		total = 10 * total + code - 0x30;
	}

	return i == start
		? $elm$core$Maybe$Nothing
		: $elm$core$Maybe$Just(code0 == 0x2D ? -total : total);
}


// FLOAT CONVERSIONS

function _String_toFloat(s)
{
	// check if it is a hex, octal, or binary number
	if (s.length === 0 || /[\sxbo]/.test(s))
	{
		return $elm$core$Maybe$Nothing;
	}
	var n = +s;
	// faster isNaN check
	return n === n ? $elm$core$Maybe$Just(n) : $elm$core$Maybe$Nothing;
}

function _String_fromList(chars)
{
	return _List_toArray(chars).join('');
}




function _Char_toCode(char)
{
	var code = char.charCodeAt(0);
	if (0xD800 <= code && code <= 0xDBFF)
	{
		return (code - 0xD800) * 0x400 + char.charCodeAt(1) - 0xDC00 + 0x10000
	}
	return code;
}

function _Char_fromCode(code)
{
	return _Utils_chr(
		(code < 0 || 0x10FFFF < code)
			? '\uFFFD'
			:
		(code <= 0xFFFF)
			? String.fromCharCode(code)
			:
		(code -= 0x10000,
			String.fromCharCode(Math.floor(code / 0x400) + 0xD800, code % 0x400 + 0xDC00)
		)
	);
}

function _Char_toUpper(char)
{
	return _Utils_chr(char.toUpperCase());
}

function _Char_toLower(char)
{
	return _Utils_chr(char.toLowerCase());
}

function _Char_toLocaleUpper(char)
{
	return _Utils_chr(char.toLocaleUpperCase());
}

function _Char_toLocaleLower(char)
{
	return _Utils_chr(char.toLocaleLowerCase());
}



/**_UNUSED/
function _Json_errorToString(error)
{
	return $elm$json$Json$Decode$errorToString(error);
}
//*/


// CORE DECODERS

function _Json_succeed(msg)
{
	return {
		$: 0,
		a: msg
	};
}

function _Json_fail(msg)
{
	return {
		$: 1,
		a: msg
	};
}

function _Json_decodePrim(decoder)
{
	return { $: 2, b: decoder };
}

var _Json_decodeInt = _Json_decodePrim(function(value) {
	return (typeof value !== 'number')
		? _Json_expecting('an INT', value)
		:
	(-2147483647 < value && value < 2147483647 && (value | 0) === value)
		? $elm$core$Result$Ok(value)
		:
	(isFinite(value) && !(value % 1))
		? $elm$core$Result$Ok(value)
		: _Json_expecting('an INT', value);
});

var _Json_decodeBool = _Json_decodePrim(function(value) {
	return (typeof value === 'boolean')
		? $elm$core$Result$Ok(value)
		: _Json_expecting('a BOOL', value);
});

var _Json_decodeFloat = _Json_decodePrim(function(value) {
	return (typeof value === 'number')
		? $elm$core$Result$Ok(value)
		: _Json_expecting('a FLOAT', value);
});

var _Json_decodeValue = _Json_decodePrim(function(value) {
	return $elm$core$Result$Ok(_Json_wrap(value));
});

var _Json_decodeString = _Json_decodePrim(function(value) {
	return (typeof value === 'string')
		? $elm$core$Result$Ok(value)
		: (value instanceof String)
			? $elm$core$Result$Ok(value + '')
			: _Json_expecting('a STRING', value);
});

function _Json_decodeList(decoder) { return { $: 3, b: decoder }; }
function _Json_decodeArray(decoder) { return { $: 4, b: decoder }; }

function _Json_decodeNull(value) { return { $: 5, c: value }; }

var _Json_decodeField = F2(function(field, decoder)
{
	return {
		$: 6,
		d: field,
		b: decoder
	};
});

var _Json_decodeIndex = F2(function(index, decoder)
{
	return {
		$: 7,
		e: index,
		b: decoder
	};
});

function _Json_decodeKeyValuePairs(decoder)
{
	return {
		$: 8,
		b: decoder
	};
}

function _Json_mapMany(f, decoders)
{
	return {
		$: 9,
		f: f,
		g: decoders
	};
}

var _Json_andThen = F2(function(callback, decoder)
{
	return {
		$: 10,
		b: decoder,
		h: callback
	};
});

function _Json_oneOf(decoders)
{
	return {
		$: 11,
		g: decoders
	};
}


// DECODING OBJECTS

var _Json_map1 = F2(function(f, d1)
{
	return _Json_mapMany(f, [d1]);
});

var _Json_map2 = F3(function(f, d1, d2)
{
	return _Json_mapMany(f, [d1, d2]);
});

var _Json_map3 = F4(function(f, d1, d2, d3)
{
	return _Json_mapMany(f, [d1, d2, d3]);
});

var _Json_map4 = F5(function(f, d1, d2, d3, d4)
{
	return _Json_mapMany(f, [d1, d2, d3, d4]);
});

var _Json_map5 = F6(function(f, d1, d2, d3, d4, d5)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5]);
});

var _Json_map6 = F7(function(f, d1, d2, d3, d4, d5, d6)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5, d6]);
});

var _Json_map7 = F8(function(f, d1, d2, d3, d4, d5, d6, d7)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5, d6, d7]);
});

var _Json_map8 = F9(function(f, d1, d2, d3, d4, d5, d6, d7, d8)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5, d6, d7, d8]);
});


// DECODE

var _Json_runOnString = F2(function(decoder, string)
{
	try
	{
		var value = JSON.parse(string);
		return _Json_runHelp(decoder, value);
	}
	catch (e)
	{
		return $elm$core$Result$Err(A2($elm$json$Json$Decode$Failure, 'This is not valid JSON! ' + e.message, _Json_wrap(string)));
	}
});

var _Json_run = F2(function(decoder, value)
{
	return _Json_runHelp(decoder, _Json_unwrap(value));
});

function _Json_runHelp(decoder, value)
{
	switch (decoder.$)
	{
		case 2:
			return decoder.b(value);

		case 5:
			return (value === null)
				? $elm$core$Result$Ok(decoder.c)
				: _Json_expecting('null', value);

		case 3:
			if (!_Json_isArray(value))
			{
				return _Json_expecting('a LIST', value);
			}
			return _Json_runArrayDecoder(decoder.b, value, _List_fromArray);

		case 4:
			if (!_Json_isArray(value))
			{
				return _Json_expecting('an ARRAY', value);
			}
			return _Json_runArrayDecoder(decoder.b, value, _Json_toElmArray);

		case 6:
			var field = decoder.d;
			if (typeof value !== 'object' || value === null || !(field in value))
			{
				return _Json_expecting('an OBJECT with a field named `' + field + '`', value);
			}
			var result = _Json_runHelp(decoder.b, value[field]);
			return ($elm$core$Result$isOk(result)) ? result : $elm$core$Result$Err(A2($elm$json$Json$Decode$Field, field, result.a));

		case 7:
			var index = decoder.e;
			if (!_Json_isArray(value))
			{
				return _Json_expecting('an ARRAY', value);
			}
			if (index >= value.length)
			{
				return _Json_expecting('a LONGER array. Need index ' + index + ' but only see ' + value.length + ' entries', value);
			}
			var result = _Json_runHelp(decoder.b, value[index]);
			return ($elm$core$Result$isOk(result)) ? result : $elm$core$Result$Err(A2($elm$json$Json$Decode$Index, index, result.a));

		case 8:
			if (typeof value !== 'object' || value === null || _Json_isArray(value))
			{
				return _Json_expecting('an OBJECT', value);
			}

			var keyValuePairs = _List_Nil;
			// TODO test perf of Object.keys and switch when support is good enough
			for (var key in value)
			{
				if (Object.prototype.hasOwnProperty.call(value, key))
				{
					var result = _Json_runHelp(decoder.b, value[key]);
					if (!$elm$core$Result$isOk(result))
					{
						return $elm$core$Result$Err(A2($elm$json$Json$Decode$Field, key, result.a));
					}
					keyValuePairs = _List_Cons(_Utils_Tuple2(key, result.a), keyValuePairs);
				}
			}
			return $elm$core$Result$Ok($elm$core$List$reverse(keyValuePairs));

		case 9:
			var answer = decoder.f;
			var decoders = decoder.g;
			for (var i = 0; i < decoders.length; i++)
			{
				var result = _Json_runHelp(decoders[i], value);
				if (!$elm$core$Result$isOk(result))
				{
					return result;
				}
				answer = answer(result.a);
			}
			return $elm$core$Result$Ok(answer);

		case 10:
			var result = _Json_runHelp(decoder.b, value);
			return (!$elm$core$Result$isOk(result))
				? result
				: _Json_runHelp(decoder.h(result.a), value);

		case 11:
			var errors = _List_Nil;
			for (var temp = decoder.g; temp.b; temp = temp.b) // WHILE_CONS
			{
				var result = _Json_runHelp(temp.a, value);
				if ($elm$core$Result$isOk(result))
				{
					return result;
				}
				errors = _List_Cons(result.a, errors);
			}
			return $elm$core$Result$Err($elm$json$Json$Decode$OneOf($elm$core$List$reverse(errors)));

		case 1:
			return $elm$core$Result$Err(A2($elm$json$Json$Decode$Failure, decoder.a, _Json_wrap(value)));

		case 0:
			return $elm$core$Result$Ok(decoder.a);
	}
}

function _Json_runArrayDecoder(decoder, value, toElmValue)
{
	var len = value.length;
	var array = new Array(len);
	for (var i = 0; i < len; i++)
	{
		var result = _Json_runHelp(decoder, value[i]);
		if (!$elm$core$Result$isOk(result))
		{
			return $elm$core$Result$Err(A2($elm$json$Json$Decode$Index, i, result.a));
		}
		array[i] = result.a;
	}
	return $elm$core$Result$Ok(toElmValue(array));
}

function _Json_isArray(value)
{
	return Array.isArray(value) || (typeof FileList !== 'undefined' && value instanceof FileList);
}

function _Json_toElmArray(array)
{
	return A2($elm$core$Array$initialize, array.length, function(i) { return array[i]; });
}

function _Json_expecting(type, value)
{
	return $elm$core$Result$Err(A2($elm$json$Json$Decode$Failure, 'Expecting ' + type, _Json_wrap(value)));
}


// EQUALITY

function _Json_equality(x, y)
{
	if (x === y)
	{
		return true;
	}

	if (x.$ !== y.$)
	{
		return false;
	}

	switch (x.$)
	{
		case 0:
		case 1:
			return x.a === y.a;

		case 2:
			return x.b === y.b;

		case 5:
			return x.c === y.c;

		case 3:
		case 4:
		case 8:
			return _Json_equality(x.b, y.b);

		case 6:
			return x.d === y.d && _Json_equality(x.b, y.b);

		case 7:
			return x.e === y.e && _Json_equality(x.b, y.b);

		case 9:
			return x.f === y.f && _Json_listEquality(x.g, y.g);

		case 10:
			return x.h === y.h && _Json_equality(x.b, y.b);

		case 11:
			return _Json_listEquality(x.g, y.g);
	}
}

function _Json_listEquality(aDecoders, bDecoders)
{
	var len = aDecoders.length;
	if (len !== bDecoders.length)
	{
		return false;
	}
	for (var i = 0; i < len; i++)
	{
		if (!_Json_equality(aDecoders[i], bDecoders[i]))
		{
			return false;
		}
	}
	return true;
}


// ENCODE

var _Json_encode = F2(function(indentLevel, value)
{
	return JSON.stringify(_Json_unwrap(value), null, indentLevel) + '';
});

function _Json_wrap_UNUSED(value) { return { $: 0, a: value }; }
function _Json_unwrap_UNUSED(value) { return value.a; }

function _Json_wrap(value) { return value; }
function _Json_unwrap(value) { return value; }

function _Json_emptyArray() { return []; }
function _Json_emptyObject() { return {}; }

var _Json_addField = F3(function(key, value, object)
{
	var unwrapped = _Json_unwrap(value);
	if (!(key === 'toJSON' && typeof unwrapped === 'function'))
	{
		object[key] = unwrapped;
	}
	return object;
});

function _Json_addEntry(func)
{
	return F2(function(entry, array)
	{
		array.push(_Json_unwrap(func(entry)));
		return array;
	});
}

var _Json_encodeNull = _Json_wrap(null);



// TASKS

function _Scheduler_succeed(value)
{
	return {
		$: 0,
		a: value
	};
}

function _Scheduler_fail(error)
{
	return {
		$: 1,
		a: error
	};
}

function _Scheduler_binding(callback)
{
	return {
		$: 2,
		b: callback,
		c: null
	};
}

var _Scheduler_andThen = F2(function(callback, task)
{
	return {
		$: 3,
		b: callback,
		d: task
	};
});

var _Scheduler_onError = F2(function(callback, task)
{
	return {
		$: 4,
		b: callback,
		d: task
	};
});

function _Scheduler_receive(callback)
{
	return {
		$: 5,
		b: callback
	};
}


// PROCESSES

var _Scheduler_guid = 0;

function _Scheduler_rawSpawn(task)
{
	var proc = {
		$: 0,
		e: _Scheduler_guid++,
		f: task,
		g: null,
		h: []
	};

	_Scheduler_enqueue(proc);

	return proc;
}

function _Scheduler_spawn(task)
{
	return _Scheduler_binding(function(callback) {
		callback(_Scheduler_succeed(_Scheduler_rawSpawn(task)));
	});
}

function _Scheduler_rawSend(proc, msg)
{
	proc.h.push(msg);
	_Scheduler_enqueue(proc);
}

var _Scheduler_send = F2(function(proc, msg)
{
	return _Scheduler_binding(function(callback) {
		_Scheduler_rawSend(proc, msg);
		callback(_Scheduler_succeed(_Utils_Tuple0));
	});
});

function _Scheduler_kill(proc)
{
	return _Scheduler_binding(function(callback) {
		var task = proc.f;
		if (task.$ === 2 && task.c)
		{
			task.c();
		}

		proc.f = null;

		callback(_Scheduler_succeed(_Utils_Tuple0));
	});
}


/* STEP PROCESSES

type alias Process =
  { $ : tag
  , id : unique_id
  , root : Task
  , stack : null | { $: SUCCEED | FAIL, a: callback, b: stack }
  , mailbox : [msg]
  }

*/


var _Scheduler_working = false;
var _Scheduler_queue = [];


function _Scheduler_enqueue(proc)
{
	_Scheduler_queue.push(proc);
	if (_Scheduler_working)
	{
		return;
	}
	_Scheduler_working = true;
	while (proc = _Scheduler_queue.shift())
	{
		_Scheduler_step(proc);
	}
	_Scheduler_working = false;
}


function _Scheduler_step(proc)
{
	while (proc.f)
	{
		var rootTag = proc.f.$;
		if (rootTag === 0 || rootTag === 1)
		{
			while (proc.g && proc.g.$ !== rootTag)
			{
				proc.g = proc.g.i;
			}
			if (!proc.g)
			{
				return;
			}
			proc.f = proc.g.b(proc.f.a);
			proc.g = proc.g.i;
		}
		else if (rootTag === 2)
		{
			proc.f.c = proc.f.b(function(newRoot) {
				proc.f = newRoot;
				_Scheduler_enqueue(proc);
			});
			return;
		}
		else if (rootTag === 5)
		{
			if (proc.h.length === 0)
			{
				return;
			}
			proc.f = proc.f.b(proc.h.shift());
		}
		else // if (rootTag === 3 || rootTag === 4)
		{
			proc.g = {
				$: rootTag === 3 ? 0 : 1,
				b: proc.f.b,
				i: proc.g
			};
			proc.f = proc.f.d;
		}
	}
}



function _Process_sleep(time)
{
	return _Scheduler_binding(function(callback) {
		var id = setTimeout(function() {
			callback(_Scheduler_succeed(_Utils_Tuple0));
		}, time);

		return function() { clearTimeout(id); };
	});
}




// PROGRAMS


var _Platform_worker = F4(function(impl, flagDecoder, debugMetadata, args)
{
	return _Platform_initialize(
		flagDecoder,
		args,
		impl.bb,
		impl.bB,
		impl.bx,
		function() { return function() {} }
	);
});



// INITIALIZE A PROGRAM


function _Platform_initialize(flagDecoder, args, init, update, subscriptions, stepperBuilder)
{
	var result = A2(_Json_run, flagDecoder, _Json_wrap(args ? args['flags'] : undefined));
	$elm$core$Result$isOk(result) || _Debug_crash(2 /**_UNUSED/, _Json_errorToString(result.a) /**/);
	var managers = {};
	var initPair = init(result.a);
	var model = initPair.a;
	var stepper = stepperBuilder(sendToApp, model);
	var ports = _Platform_setupEffects(managers, sendToApp);

	function sendToApp(msg, viewMetadata)
	{
		var pair = A2(update, msg, model);
		stepper(model = pair.a, viewMetadata);
		_Platform_enqueueEffects(managers, pair.b, subscriptions(model));
	}

	_Platform_enqueueEffects(managers, initPair.b, subscriptions(model));

	return ports ? { ports: ports } : {};
}



// TRACK PRELOADS
//
// This is used by code in elm/browser and elm/http
// to register any HTTP requests that are triggered by init.
//


var _Platform_preload;


function _Platform_registerPreload(url)
{
	_Platform_preload.add(url);
}



// EFFECT MANAGERS


var _Platform_effectManagers = {};


function _Platform_setupEffects(managers, sendToApp)
{
	var ports;

	// setup all necessary effect managers
	for (var key in _Platform_effectManagers)
	{
		var manager = _Platform_effectManagers[key];

		if (manager.a)
		{
			ports = ports || {};
			ports[key] = manager.a(key, sendToApp);
		}

		managers[key] = _Platform_instantiateManager(manager, sendToApp);
	}

	return ports;
}


function _Platform_createManager(init, onEffects, onSelfMsg, cmdMap, subMap)
{
	return {
		b: init,
		c: onEffects,
		d: onSelfMsg,
		e: cmdMap,
		f: subMap
	};
}


function _Platform_instantiateManager(info, sendToApp)
{
	var router = {
		g: sendToApp,
		h: undefined
	};

	var onEffects = info.c;
	var onSelfMsg = info.d;
	var cmdMap = info.e;
	var subMap = info.f;

	function loop(state)
	{
		return A2(_Scheduler_andThen, loop, _Scheduler_receive(function(msg)
		{
			var value = msg.a;

			if (msg.$ === 0)
			{
				return A3(onSelfMsg, router, value, state);
			}

			return cmdMap && subMap
				? A4(onEffects, router, value.i, value.j, state)
				: A3(onEffects, router, cmdMap ? value.i : value.j, state);
		}));
	}

	return router.h = _Scheduler_rawSpawn(A2(_Scheduler_andThen, loop, info.b));
}



// ROUTING


var _Platform_sendToApp = F2(function(router, msg)
{
	return _Scheduler_binding(function(callback)
	{
		router.g(msg);
		callback(_Scheduler_succeed(_Utils_Tuple0));
	});
});


var _Platform_sendToSelf = F2(function(router, msg)
{
	return A2(_Scheduler_send, router.h, {
		$: 0,
		a: msg
	});
});



// BAGS


function _Platform_leaf(home)
{
	return function(value)
	{
		return {
			$: 1,
			k: home,
			l: value
		};
	};
}


function _Platform_batch(list)
{
	return {
		$: 2,
		m: list
	};
}


var _Platform_map = F2(function(tagger, bag)
{
	return {
		$: 3,
		n: tagger,
		o: bag
	}
});



// PIPE BAGS INTO EFFECT MANAGERS
//
// Effects must be queued!
//
// Say your init contains a synchronous command, like Time.now or Time.here
//
//   - This will produce a batch of effects (FX_1)
//   - The synchronous task triggers the subsequent `update` call
//   - This will produce a batch of effects (FX_2)
//
// If we just start dispatching FX_2, subscriptions from FX_2 can be processed
// before subscriptions from FX_1. No good! Earlier versions of this code had
// this problem, leading to these reports:
//
//   https://github.com/elm/core/issues/980
//   https://github.com/elm/core/pull/981
//   https://github.com/elm/compiler/issues/1776
//
// The queue is necessary to avoid ordering issues for synchronous commands.


// Why use true/false here? Why not just check the length of the queue?
// The goal is to detect "are we currently dispatching effects?" If we
// are, we need to bail and let the ongoing while loop handle things.
//
// Now say the queue has 1 element. When we dequeue the final element,
// the queue will be empty, but we are still actively dispatching effects.
// So you could get queue jumping in a really tricky category of cases.
//
var _Platform_effectsQueue = [];
var _Platform_effectsActive = false;


function _Platform_enqueueEffects(managers, cmdBag, subBag)
{
	_Platform_effectsQueue.push({ p: managers, q: cmdBag, r: subBag });

	if (_Platform_effectsActive) return;

	_Platform_effectsActive = true;
	for (var fx; fx = _Platform_effectsQueue.shift(); )
	{
		_Platform_dispatchEffects(fx.p, fx.q, fx.r);
	}
	_Platform_effectsActive = false;
}


function _Platform_dispatchEffects(managers, cmdBag, subBag)
{
	var effectsDict = {};
	_Platform_gatherEffects(true, cmdBag, effectsDict, null);
	_Platform_gatherEffects(false, subBag, effectsDict, null);

	for (var home in managers)
	{
		_Scheduler_rawSend(managers[home], {
			$: 'fx',
			a: effectsDict[home] || { i: _List_Nil, j: _List_Nil }
		});
	}
}


function _Platform_gatherEffects(isCmd, bag, effectsDict, taggers)
{
	switch (bag.$)
	{
		case 1:
			var home = bag.k;
			var effect = _Platform_toEffect(isCmd, home, taggers, bag.l);
			effectsDict[home] = _Platform_insert(isCmd, effect, effectsDict[home]);
			return;

		case 2:
			for (var list = bag.m; list.b; list = list.b) // WHILE_CONS
			{
				_Platform_gatherEffects(isCmd, list.a, effectsDict, taggers);
			}
			return;

		case 3:
			_Platform_gatherEffects(isCmd, bag.o, effectsDict, {
				s: bag.n,
				t: taggers
			});
			return;
	}
}


function _Platform_toEffect(isCmd, home, taggers, value)
{
	function applyTaggers(x)
	{
		for (var temp = taggers; temp; temp = temp.t)
		{
			x = temp.s(x);
		}
		return x;
	}

	var map = isCmd
		? _Platform_effectManagers[home].e
		: _Platform_effectManagers[home].f;

	return A2(map, applyTaggers, value)
}


function _Platform_insert(isCmd, newEffect, effects)
{
	effects = effects || { i: _List_Nil, j: _List_Nil };

	isCmd
		? (effects.i = _List_Cons(newEffect, effects.i))
		: (effects.j = _List_Cons(newEffect, effects.j));

	return effects;
}



// PORTS


function _Platform_checkPortName(name)
{
	if (_Platform_effectManagers[name])
	{
		_Debug_crash(3, name)
	}
}



// OUTGOING PORTS


function _Platform_outgoingPort(name, converter)
{
	_Platform_checkPortName(name);
	_Platform_effectManagers[name] = {
		e: _Platform_outgoingPortMap,
		u: converter,
		a: _Platform_setupOutgoingPort
	};
	return _Platform_leaf(name);
}


var _Platform_outgoingPortMap = F2(function(tagger, value) { return value; });


function _Platform_setupOutgoingPort(name)
{
	var subs = [];
	var converter = _Platform_effectManagers[name].u;

	// CREATE MANAGER

	var init = _Process_sleep(0);

	_Platform_effectManagers[name].b = init;
	_Platform_effectManagers[name].c = F3(function(router, cmdList, state)
	{
		for ( ; cmdList.b; cmdList = cmdList.b) // WHILE_CONS
		{
			// grab a separate reference to subs in case unsubscribe is called
			var currentSubs = subs;
			var value = _Json_unwrap(converter(cmdList.a));
			for (var i = 0; i < currentSubs.length; i++)
			{
				currentSubs[i](value);
			}
		}
		return init;
	});

	// PUBLIC API

	function subscribe(callback)
	{
		subs.push(callback);
	}

	function unsubscribe(callback)
	{
		// copy subs into a new array in case unsubscribe is called within a
		// subscribed callback
		subs = subs.slice();
		var index = subs.indexOf(callback);
		if (index >= 0)
		{
			subs.splice(index, 1);
		}
	}

	return {
		subscribe: subscribe,
		unsubscribe: unsubscribe
	};
}



// INCOMING PORTS


function _Platform_incomingPort(name, converter)
{
	_Platform_checkPortName(name);
	_Platform_effectManagers[name] = {
		f: _Platform_incomingPortMap,
		u: converter,
		a: _Platform_setupIncomingPort
	};
	return _Platform_leaf(name);
}


var _Platform_incomingPortMap = F2(function(tagger, finalTagger)
{
	return function(value)
	{
		return tagger(finalTagger(value));
	};
});


function _Platform_setupIncomingPort(name, sendToApp)
{
	var subs = _List_Nil;
	var converter = _Platform_effectManagers[name].u;

	// CREATE MANAGER

	var init = _Scheduler_succeed(null);

	_Platform_effectManagers[name].b = init;
	_Platform_effectManagers[name].c = F3(function(router, subList, state)
	{
		subs = subList;
		return init;
	});

	// PUBLIC API

	function send(incomingValue)
	{
		var result = A2(_Json_run, converter, _Json_wrap(incomingValue));

		$elm$core$Result$isOk(result) || _Debug_crash(4, name, result.a);

		var value = result.a;
		for (var temp = subs; temp.b; temp = temp.b) // WHILE_CONS
		{
			sendToApp(temp.a(value));
		}
	}

	return { send: send };
}



// EXPORT ELM MODULES
//
// Have DEBUG and PROD versions so that we can (1) give nicer errors in
// debug mode and (2) not pay for the bits needed for that in prod mode.
//


function _Platform_export(exports)
{
	scope['Elm']
		? _Platform_mergeExportsProd(scope['Elm'], exports)
		: scope['Elm'] = exports;
}


function _Platform_mergeExportsProd(obj, exports)
{
	for (var name in exports)
	{
		(name in obj)
			? (name == 'init')
				? _Debug_crash(6)
				: _Platform_mergeExportsProd(obj[name], exports[name])
			: (obj[name] = exports[name]);
	}
}


function _Platform_export_UNUSED(exports)
{
	scope['Elm']
		? _Platform_mergeExportsDebug('Elm', scope['Elm'], exports)
		: scope['Elm'] = exports;
}


function _Platform_mergeExportsDebug(moduleName, obj, exports)
{
	for (var name in exports)
	{
		(name in obj)
			? (name == 'init')
				? _Debug_crash(6, moduleName)
				: _Platform_mergeExportsDebug(moduleName + '.' + name, obj[name], exports[name])
			: (obj[name] = exports[name]);
	}
}




// HELPERS


var _VirtualDom_divertHrefToApp;

var _VirtualDom_doc = typeof document !== 'undefined' ? document : {};


function _VirtualDom_appendChild(parent, child)
{
	parent.appendChild(child);
}

var _VirtualDom_init = F4(function(virtualNode, flagDecoder, debugMetadata, args)
{
	// NOTE: this function needs _Platform_export available to work

	/**/
	var node = args['node'];
	//*/
	/**_UNUSED/
	var node = args && args['node'] ? args['node'] : _Debug_crash(0);
	//*/

	node.parentNode.replaceChild(
		_VirtualDom_render(virtualNode, function() {}),
		node
	);

	return {};
});



// TEXT


function _VirtualDom_text(string)
{
	return {
		$: 0,
		a: string
	};
}



// NODE


var _VirtualDom_nodeNS = F2(function(namespace, tag)
{
	return F2(function(factList, kidList)
	{
		for (var kids = [], descendantsCount = 0; kidList.b; kidList = kidList.b) // WHILE_CONS
		{
			var kid = kidList.a;
			descendantsCount += (kid.b || 0);
			kids.push(kid);
		}
		descendantsCount += kids.length;

		return {
			$: 1,
			c: tag,
			d: _VirtualDom_organizeFacts(factList),
			e: kids,
			f: namespace,
			b: descendantsCount
		};
	});
});


var _VirtualDom_node = _VirtualDom_nodeNS(undefined);



// KEYED NODE


var _VirtualDom_keyedNodeNS = F2(function(namespace, tag)
{
	return F2(function(factList, kidList)
	{
		for (var kids = [], descendantsCount = 0; kidList.b; kidList = kidList.b) // WHILE_CONS
		{
			var kid = kidList.a;
			descendantsCount += (kid.b.b || 0);
			kids.push(kid);
		}
		descendantsCount += kids.length;

		return {
			$: 2,
			c: tag,
			d: _VirtualDom_organizeFacts(factList),
			e: kids,
			f: namespace,
			b: descendantsCount
		};
	});
});


var _VirtualDom_keyedNode = _VirtualDom_keyedNodeNS(undefined);



// CUSTOM


function _VirtualDom_custom(factList, model, render, diff)
{
	return {
		$: 3,
		d: _VirtualDom_organizeFacts(factList),
		g: model,
		h: render,
		i: diff
	};
}



// MAP


var _VirtualDom_map = F2(function(tagger, node)
{
	return {
		$: 4,
		j: tagger,
		k: node,
		b: 1 + (node.b || 0)
	};
});



// LAZY


function _VirtualDom_thunk(refs, thunk)
{
	return {
		$: 5,
		l: refs,
		m: thunk,
		k: undefined
	};
}

var _VirtualDom_lazy = F2(function(func, a)
{
	return _VirtualDom_thunk([func, a], function() {
		return func(a);
	});
});

var _VirtualDom_lazy2 = F3(function(func, a, b)
{
	return _VirtualDom_thunk([func, a, b], function() {
		return A2(func, a, b);
	});
});

var _VirtualDom_lazy3 = F4(function(func, a, b, c)
{
	return _VirtualDom_thunk([func, a, b, c], function() {
		return A3(func, a, b, c);
	});
});

var _VirtualDom_lazy4 = F5(function(func, a, b, c, d)
{
	return _VirtualDom_thunk([func, a, b, c, d], function() {
		return A4(func, a, b, c, d);
	});
});

var _VirtualDom_lazy5 = F6(function(func, a, b, c, d, e)
{
	return _VirtualDom_thunk([func, a, b, c, d, e], function() {
		return A5(func, a, b, c, d, e);
	});
});

var _VirtualDom_lazy6 = F7(function(func, a, b, c, d, e, f)
{
	return _VirtualDom_thunk([func, a, b, c, d, e, f], function() {
		return A6(func, a, b, c, d, e, f);
	});
});

var _VirtualDom_lazy7 = F8(function(func, a, b, c, d, e, f, g)
{
	return _VirtualDom_thunk([func, a, b, c, d, e, f, g], function() {
		return A7(func, a, b, c, d, e, f, g);
	});
});

var _VirtualDom_lazy8 = F9(function(func, a, b, c, d, e, f, g, h)
{
	return _VirtualDom_thunk([func, a, b, c, d, e, f, g, h], function() {
		return A8(func, a, b, c, d, e, f, g, h);
	});
});



// FACTS


var _VirtualDom_on = F2(function(key, handler)
{
	return {
		$: 'a0',
		n: key,
		o: handler
	};
});
var _VirtualDom_style = F2(function(key, value)
{
	return {
		$: 'a1',
		n: key,
		o: value
	};
});
var _VirtualDom_property = F2(function(key, value)
{
	return {
		$: 'a2',
		n: key,
		o: value
	};
});
var _VirtualDom_attribute = F2(function(key, value)
{
	return {
		$: 'a3',
		n: key,
		o: value
	};
});
var _VirtualDom_attributeNS = F3(function(namespace, key, value)
{
	return {
		$: 'a4',
		n: key,
		o: { f: namespace, o: value }
	};
});



// XSS ATTACK VECTOR CHECKS
//
// For some reason, tabs can appear in href protocols and it still works.
// So '\tjava\tSCRIPT:alert("!!!")' and 'javascript:alert("!!!")' are the same
// in practice. That is why _VirtualDom_RE_js and _VirtualDom_RE_js_html look
// so freaky.
//
// Pulling the regular expressions out to the top level gives a slight speed
// boost in small benchmarks (4-10%) but hoisting values to reduce allocation
// can be unpredictable in large programs where JIT may have a harder time with
// functions are not fully self-contained. The benefit is more that the js and
// js_html ones are so weird that I prefer to see them near each other.


var _VirtualDom_RE_script = /^script$/i;
var _VirtualDom_RE_on_formAction = /^(on|formAction$)/i;
var _VirtualDom_RE_js = /^\s*j\s*a\s*v\s*a\s*s\s*c\s*r\s*i\s*p\s*t\s*:/i;
var _VirtualDom_RE_js_html = /^\s*(j\s*a\s*v\s*a\s*s\s*c\s*r\s*i\s*p\s*t\s*:|d\s*a\s*t\s*a\s*:\s*t\s*e\s*x\s*t\s*\/\s*h\s*t\s*m\s*l\s*(,|;))/i;


function _VirtualDom_noScript(tag)
{
	return _VirtualDom_RE_script.test(tag) ? 'p' : tag;
}

function _VirtualDom_noOnOrFormAction(key)
{
	return _VirtualDom_RE_on_formAction.test(key) ? 'data-' + key : key;
}

function _VirtualDom_noInnerHtmlOrFormAction(key)
{
	return key == 'innerHTML' || key == 'outerHTML' || key == 'formAction' ? 'data-' + key : key;
}

function _VirtualDom_noJavaScriptUri(value)
{
	return _VirtualDom_RE_js.test(value)
		? /**/''//*//**_UNUSED/'javascript:alert("This is an XSS vector. Please use ports or web components instead.")'//*/
		: value;
}

function _VirtualDom_noJavaScriptOrHtmlUri(value)
{
	return _VirtualDom_RE_js_html.test(value)
		? /**/''//*//**_UNUSED/'javascript:alert("This is an XSS vector. Please use ports or web components instead.")'//*/
		: value;
}

function _VirtualDom_noJavaScriptOrHtmlJson(value)
{
	return (
		(typeof _Json_unwrap(value) === 'string' && _VirtualDom_RE_js_html.test(_Json_unwrap(value)))
		||
		(Array.isArray(_Json_unwrap(value)) && _VirtualDom_RE_js_html.test(String(_Json_unwrap(value))))
	)
		? _Json_wrap(
			/**/''//*//**_UNUSED/'javascript:alert("This is an XSS vector. Please use ports or web components instead.")'//*/
		) : value;
}



// MAP FACTS


var _VirtualDom_mapAttribute = F2(function(func, attr)
{
	return (attr.$ === 'a0')
		? A2(_VirtualDom_on, attr.n, _VirtualDom_mapHandler(func, attr.o))
		: attr;
});

function _VirtualDom_mapHandler(func, handler)
{
	var tag = $elm$virtual_dom$VirtualDom$toHandlerInt(handler);

	// 0 = Normal
	// 1 = MayStopPropagation
	// 2 = MayPreventDefault
	// 3 = Custom

	return {
		$: handler.$,
		a:
			!tag
				? A2($elm$json$Json$Decode$map, func, handler.a)
				:
			A3($elm$json$Json$Decode$map2,
				tag < 3
					? _VirtualDom_mapEventTuple
					: _VirtualDom_mapEventRecord,
				$elm$json$Json$Decode$succeed(func),
				handler.a
			)
	};
}

var _VirtualDom_mapEventTuple = F2(function(func, tuple)
{
	return _Utils_Tuple2(func(tuple.a), tuple.b);
});

var _VirtualDom_mapEventRecord = F2(function(func, record)
{
	return {
		y: func(record.y),
		ap: record.ap,
		ak: record.ak
	}
});



// ORGANIZE FACTS


function _VirtualDom_organizeFacts(factList)
{
	for (var facts = {}; factList.b; factList = factList.b) // WHILE_CONS
	{
		var entry = factList.a;

		var tag = entry.$;
		var key = entry.n;
		var value = entry.o;

		if (tag === 'a2')
		{
			(key === 'className')
				? _VirtualDom_addClass(facts, key, _Json_unwrap(value))
				: facts[key] = _Json_unwrap(value);

			continue;
		}

		var subFacts = facts[tag] || (facts[tag] = {});
		(tag === 'a3' && key === 'class')
			? _VirtualDom_addClass(subFacts, key, value)
			: subFacts[key] = value;
	}

	return facts;
}

function _VirtualDom_addClass(object, key, newClass)
{
	var classes = object[key];
	object[key] = classes ? classes + ' ' + newClass : newClass;
}



// RENDER


function _VirtualDom_render(vNode, eventNode)
{
	var tag = vNode.$;

	if (tag === 5)
	{
		return _VirtualDom_render(vNode.k || (vNode.k = vNode.m()), eventNode);
	}

	if (tag === 0)
	{
		return _VirtualDom_doc.createTextNode(vNode.a);
	}

	if (tag === 4)
	{
		var subNode = vNode.k;
		var tagger = vNode.j;

		while (subNode.$ === 4)
		{
			typeof tagger !== 'object'
				? tagger = [tagger, subNode.j]
				: tagger.push(subNode.j);

			subNode = subNode.k;
		}

		var subEventRoot = { j: tagger, p: eventNode };
		var domNode = _VirtualDom_render(subNode, subEventRoot);
		domNode.elm_event_node_ref = subEventRoot;
		return domNode;
	}

	if (tag === 3)
	{
		var domNode = vNode.h(vNode.g);
		_VirtualDom_applyFacts(domNode, eventNode, vNode.d);
		return domNode;
	}

	// at this point `tag` must be 1 or 2

	var domNode = vNode.f
		? _VirtualDom_doc.createElementNS(vNode.f, vNode.c)
		: _VirtualDom_doc.createElement(vNode.c);

	if (_VirtualDom_divertHrefToApp && vNode.c == 'a')
	{
		domNode.addEventListener('click', _VirtualDom_divertHrefToApp(domNode));
	}

	_VirtualDom_applyFacts(domNode, eventNode, vNode.d);

	for (var kids = vNode.e, i = 0; i < kids.length; i++)
	{
		_VirtualDom_appendChild(domNode, _VirtualDom_render(tag === 1 ? kids[i] : kids[i].b, eventNode));
	}

	return domNode;
}



// APPLY FACTS


function _VirtualDom_applyFacts(domNode, eventNode, facts)
{
	for (var key in facts)
	{
		var value = facts[key];

		key === 'a1'
			? _VirtualDom_applyStyles(domNode, value)
			:
		key === 'a0'
			? _VirtualDom_applyEvents(domNode, eventNode, value)
			:
		key === 'a3'
			? _VirtualDom_applyAttrs(domNode, value)
			:
		key === 'a4'
			? _VirtualDom_applyAttrsNS(domNode, value)
			:
		((key !== 'value' && key !== 'checked') || domNode[key] !== value) && (domNode[key] = value);
	}
}



// APPLY STYLES


function _VirtualDom_applyStyles(domNode, styles)
{
	var domNodeStyle = domNode.style;

	for (var key in styles)
	{
		domNodeStyle[key] = styles[key];
	}
}



// APPLY ATTRS


function _VirtualDom_applyAttrs(domNode, attrs)
{
	for (var key in attrs)
	{
		var value = attrs[key];
		typeof value !== 'undefined'
			? domNode.setAttribute(key, value)
			: domNode.removeAttribute(key);
	}
}



// APPLY NAMESPACED ATTRS


function _VirtualDom_applyAttrsNS(domNode, nsAttrs)
{
	for (var key in nsAttrs)
	{
		var pair = nsAttrs[key];
		var namespace = pair.f;
		var value = pair.o;

		typeof value !== 'undefined'
			? domNode.setAttributeNS(namespace, key, value)
			: domNode.removeAttributeNS(namespace, key);
	}
}



// APPLY EVENTS


function _VirtualDom_applyEvents(domNode, eventNode, events)
{
	var allCallbacks = domNode.elmFs || (domNode.elmFs = {});

	for (var key in events)
	{
		var newHandler = events[key];
		var oldCallback = allCallbacks[key];

		if (!newHandler)
		{
			domNode.removeEventListener(key, oldCallback);
			allCallbacks[key] = undefined;
			continue;
		}

		if (oldCallback)
		{
			var oldHandler = oldCallback.q;
			if (oldHandler.$ === newHandler.$)
			{
				oldCallback.q = newHandler;
				continue;
			}
			domNode.removeEventListener(key, oldCallback);
		}

		oldCallback = _VirtualDom_makeCallback(eventNode, newHandler);
		domNode.addEventListener(key, oldCallback,
			_VirtualDom_passiveSupported
			&& { passive: $elm$virtual_dom$VirtualDom$toHandlerInt(newHandler) < 2 }
		);
		allCallbacks[key] = oldCallback;
	}
}



// PASSIVE EVENTS


var _VirtualDom_passiveSupported;

try
{
	window.addEventListener('t', null, Object.defineProperty({}, 'passive', {
		get: function() { _VirtualDom_passiveSupported = true; }
	}));
}
catch(e) {}



// EVENT HANDLERS


function _VirtualDom_makeCallback(eventNode, initialHandler)
{
	function callback(event)
	{
		var handler = callback.q;
		var result = _Json_runHelp(handler.a, event);

		if (!$elm$core$Result$isOk(result))
		{
			return;
		}

		var tag = $elm$virtual_dom$VirtualDom$toHandlerInt(handler);

		// 0 = Normal
		// 1 = MayStopPropagation
		// 2 = MayPreventDefault
		// 3 = Custom

		var value = result.a;
		var message = !tag ? value : tag < 3 ? value.a : value.y;
		var stopPropagation = tag == 1 ? value.b : tag == 3 && value.ap;
		var currentEventNode = (
			stopPropagation && event.stopPropagation(),
			(tag == 2 ? value.b : tag == 3 && value.ak) && event.preventDefault(),
			eventNode
		);
		var tagger;
		var i;
		while (tagger = currentEventNode.j)
		{
			if (typeof tagger == 'function')
			{
				message = tagger(message);
			}
			else
			{
				for (var i = tagger.length; i--; )
				{
					message = tagger[i](message);
				}
			}
			currentEventNode = currentEventNode.p;
		}
		currentEventNode(message, stopPropagation); // stopPropagation implies isSync
	}

	callback.q = initialHandler;

	return callback;
}

function _VirtualDom_equalEvents(x, y)
{
	return x.$ == y.$ && _Json_equality(x.a, y.a);
}



// DIFF


// TODO: Should we do patches like in iOS?
//
// type Patch
//   = At Int Patch
//   | Batch (List Patch)
//   | Change ...
//
// How could it not be better?
//
function _VirtualDom_diff(x, y)
{
	var patches = [];
	_VirtualDom_diffHelp(x, y, patches, 0);
	return patches;
}


function _VirtualDom_pushPatch(patches, type, index, data)
{
	var patch = {
		$: type,
		r: index,
		s: data,
		t: undefined,
		u: undefined
	};
	patches.push(patch);
	return patch;
}


function _VirtualDom_diffHelp(x, y, patches, index)
{
	if (x === y)
	{
		return;
	}

	var xType = x.$;
	var yType = y.$;

	// Bail if you run into different types of nodes. Implies that the
	// structure has changed significantly and it's not worth a diff.
	if (xType !== yType)
	{
		if (xType === 1 && yType === 2)
		{
			y = _VirtualDom_dekey(y);
			yType = 1;
		}
		else
		{
			_VirtualDom_pushPatch(patches, 0, index, y);
			return;
		}
	}

	// Now we know that both nodes are the same $.
	switch (yType)
	{
		case 5:
			var xRefs = x.l;
			var yRefs = y.l;
			var i = xRefs.length;
			var same = i === yRefs.length;
			while (same && i--)
			{
				same = xRefs[i] === yRefs[i];
			}
			if (same)
			{
				y.k = x.k;
				return;
			}
			y.k = y.m();
			var subPatches = [];
			_VirtualDom_diffHelp(x.k, y.k, subPatches, 0);
			subPatches.length > 0 && _VirtualDom_pushPatch(patches, 1, index, subPatches);
			return;

		case 4:
			// gather nested taggers
			var xTaggers = x.j;
			var yTaggers = y.j;
			var nesting = false;

			var xSubNode = x.k;
			while (xSubNode.$ === 4)
			{
				nesting = true;

				typeof xTaggers !== 'object'
					? xTaggers = [xTaggers, xSubNode.j]
					: xTaggers.push(xSubNode.j);

				xSubNode = xSubNode.k;
			}

			var ySubNode = y.k;
			while (ySubNode.$ === 4)
			{
				nesting = true;

				typeof yTaggers !== 'object'
					? yTaggers = [yTaggers, ySubNode.j]
					: yTaggers.push(ySubNode.j);

				ySubNode = ySubNode.k;
			}

			// Just bail if different numbers of taggers. This implies the
			// structure of the virtual DOM has changed.
			if (nesting && xTaggers.length !== yTaggers.length)
			{
				_VirtualDom_pushPatch(patches, 0, index, y);
				return;
			}

			// check if taggers are "the same"
			if (nesting ? !_VirtualDom_pairwiseRefEqual(xTaggers, yTaggers) : xTaggers !== yTaggers)
			{
				_VirtualDom_pushPatch(patches, 2, index, yTaggers);
			}

			// diff everything below the taggers
			_VirtualDom_diffHelp(xSubNode, ySubNode, patches, index + 1);
			return;

		case 0:
			if (x.a !== y.a)
			{
				_VirtualDom_pushPatch(patches, 3, index, y.a);
			}
			return;

		case 1:
			_VirtualDom_diffNodes(x, y, patches, index, _VirtualDom_diffKids);
			return;

		case 2:
			_VirtualDom_diffNodes(x, y, patches, index, _VirtualDom_diffKeyedKids);
			return;

		case 3:
			if (x.h !== y.h)
			{
				_VirtualDom_pushPatch(patches, 0, index, y);
				return;
			}

			var factsDiff = _VirtualDom_diffFacts(x.d, y.d);
			factsDiff && _VirtualDom_pushPatch(patches, 4, index, factsDiff);

			var patch = y.i(x.g, y.g);
			patch && _VirtualDom_pushPatch(patches, 5, index, patch);

			return;
	}
}

// assumes the incoming arrays are the same length
function _VirtualDom_pairwiseRefEqual(as, bs)
{
	for (var i = 0; i < as.length; i++)
	{
		if (as[i] !== bs[i])
		{
			return false;
		}
	}

	return true;
}

function _VirtualDom_diffNodes(x, y, patches, index, diffKids)
{
	// Bail if obvious indicators have changed. Implies more serious
	// structural changes such that it's not worth it to diff.
	if (x.c !== y.c || x.f !== y.f)
	{
		_VirtualDom_pushPatch(patches, 0, index, y);
		return;
	}

	var factsDiff = _VirtualDom_diffFacts(x.d, y.d);
	factsDiff && _VirtualDom_pushPatch(patches, 4, index, factsDiff);

	diffKids(x, y, patches, index);
}



// DIFF FACTS


// TODO Instead of creating a new diff object, it's possible to just test if
// there *is* a diff. During the actual patch, do the diff again and make the
// modifications directly. This way, there's no new allocations. Worth it?
function _VirtualDom_diffFacts(x, y, category)
{
	var diff;

	// look for changes and removals
	for (var xKey in x)
	{
		if (xKey === 'a1' || xKey === 'a0' || xKey === 'a3' || xKey === 'a4')
		{
			var subDiff = _VirtualDom_diffFacts(x[xKey], y[xKey] || {}, xKey);
			if (subDiff)
			{
				diff = diff || {};
				diff[xKey] = subDiff;
			}
			continue;
		}

		// remove if not in the new facts
		if (!(xKey in y))
		{
			diff = diff || {};
			diff[xKey] =
				!category
					? (typeof x[xKey] === 'string' ? '' : null)
					:
				(category === 'a1')
					? ''
					:
				(category === 'a0' || category === 'a3')
					? undefined
					:
				{ f: x[xKey].f, o: undefined };

			continue;
		}

		var xValue = x[xKey];
		var yValue = y[xKey];

		// reference equal, so don't worry about it
		if (xValue === yValue && xKey !== 'value' && xKey !== 'checked'
			|| category === 'a0' && _VirtualDom_equalEvents(xValue, yValue))
		{
			continue;
		}

		diff = diff || {};
		diff[xKey] = yValue;
	}

	// add new stuff
	for (var yKey in y)
	{
		if (!(yKey in x))
		{
			diff = diff || {};
			diff[yKey] = y[yKey];
		}
	}

	return diff;
}



// DIFF KIDS


function _VirtualDom_diffKids(xParent, yParent, patches, index)
{
	var xKids = xParent.e;
	var yKids = yParent.e;

	var xLen = xKids.length;
	var yLen = yKids.length;

	// FIGURE OUT IF THERE ARE INSERTS OR REMOVALS

	if (xLen > yLen)
	{
		_VirtualDom_pushPatch(patches, 6, index, {
			v: yLen,
			i: xLen - yLen
		});
	}
	else if (xLen < yLen)
	{
		_VirtualDom_pushPatch(patches, 7, index, {
			v: xLen,
			e: yKids
		});
	}

	// PAIRWISE DIFF EVERYTHING ELSE

	for (var minLen = xLen < yLen ? xLen : yLen, i = 0; i < minLen; i++)
	{
		var xKid = xKids[i];
		_VirtualDom_diffHelp(xKid, yKids[i], patches, ++index);
		index += xKid.b || 0;
	}
}



// KEYED DIFF


function _VirtualDom_diffKeyedKids(xParent, yParent, patches, rootIndex)
{
	var localPatches = [];

	var changes = {}; // Dict String Entry
	var inserts = []; // Array { index : Int, entry : Entry }
	// type Entry = { tag : String, vnode : VNode, index : Int, data : _ }

	var xKids = xParent.e;
	var yKids = yParent.e;
	var xLen = xKids.length;
	var yLen = yKids.length;
	var xIndex = 0;
	var yIndex = 0;

	var index = rootIndex;

	while (xIndex < xLen && yIndex < yLen)
	{
		var x = xKids[xIndex];
		var y = yKids[yIndex];

		var xKey = x.a;
		var yKey = y.a;
		var xNode = x.b;
		var yNode = y.b;

		var newMatch = undefined;
		var oldMatch = undefined;

		// check if keys match

		if (xKey === yKey)
		{
			index++;
			_VirtualDom_diffHelp(xNode, yNode, localPatches, index);
			index += xNode.b || 0;

			xIndex++;
			yIndex++;
			continue;
		}

		// look ahead 1 to detect insertions and removals.

		var xNext = xKids[xIndex + 1];
		var yNext = yKids[yIndex + 1];

		if (xNext)
		{
			var xNextKey = xNext.a;
			var xNextNode = xNext.b;
			oldMatch = yKey === xNextKey;
		}

		if (yNext)
		{
			var yNextKey = yNext.a;
			var yNextNode = yNext.b;
			newMatch = xKey === yNextKey;
		}


		// swap x and y
		if (newMatch && oldMatch)
		{
			index++;
			_VirtualDom_diffHelp(xNode, yNextNode, localPatches, index);
			_VirtualDom_insertNode(changes, localPatches, xKey, yNode, yIndex, inserts);
			index += xNode.b || 0;

			index++;
			_VirtualDom_removeNode(changes, localPatches, xKey, xNextNode, index);
			index += xNextNode.b || 0;

			xIndex += 2;
			yIndex += 2;
			continue;
		}

		// insert y
		if (newMatch)
		{
			index++;
			_VirtualDom_insertNode(changes, localPatches, yKey, yNode, yIndex, inserts);
			_VirtualDom_diffHelp(xNode, yNextNode, localPatches, index);
			index += xNode.b || 0;

			xIndex += 1;
			yIndex += 2;
			continue;
		}

		// remove x
		if (oldMatch)
		{
			index++;
			_VirtualDom_removeNode(changes, localPatches, xKey, xNode, index);
			index += xNode.b || 0;

			index++;
			_VirtualDom_diffHelp(xNextNode, yNode, localPatches, index);
			index += xNextNode.b || 0;

			xIndex += 2;
			yIndex += 1;
			continue;
		}

		// remove x, insert y
		if (xNext && xNextKey === yNextKey)
		{
			index++;
			_VirtualDom_removeNode(changes, localPatches, xKey, xNode, index);
			_VirtualDom_insertNode(changes, localPatches, yKey, yNode, yIndex, inserts);
			index += xNode.b || 0;

			index++;
			_VirtualDom_diffHelp(xNextNode, yNextNode, localPatches, index);
			index += xNextNode.b || 0;

			xIndex += 2;
			yIndex += 2;
			continue;
		}

		break;
	}

	// eat up any remaining nodes with removeNode and insertNode

	while (xIndex < xLen)
	{
		index++;
		var x = xKids[xIndex];
		var xNode = x.b;
		_VirtualDom_removeNode(changes, localPatches, x.a, xNode, index);
		index += xNode.b || 0;
		xIndex++;
	}

	while (yIndex < yLen)
	{
		var endInserts = endInserts || [];
		var y = yKids[yIndex];
		_VirtualDom_insertNode(changes, localPatches, y.a, y.b, undefined, endInserts);
		yIndex++;
	}

	if (localPatches.length > 0 || inserts.length > 0 || endInserts)
	{
		_VirtualDom_pushPatch(patches, 8, rootIndex, {
			w: localPatches,
			x: inserts,
			y: endInserts
		});
	}
}



// CHANGES FROM KEYED DIFF


var _VirtualDom_POSTFIX = '_elmW6BL';


function _VirtualDom_insertNode(changes, localPatches, key, vnode, yIndex, inserts)
{
	var entry = changes[key];

	// never seen this key before
	if (!entry)
	{
		entry = {
			c: 0,
			z: vnode,
			r: yIndex,
			s: undefined
		};

		inserts.push({ r: yIndex, A: entry });
		changes[key] = entry;

		return;
	}

	// this key was removed earlier, a match!
	if (entry.c === 1)
	{
		inserts.push({ r: yIndex, A: entry });

		entry.c = 2;
		var subPatches = [];
		_VirtualDom_diffHelp(entry.z, vnode, subPatches, entry.r);
		entry.r = yIndex;
		entry.s.s = {
			w: subPatches,
			A: entry
		};

		return;
	}

	// this key has already been inserted or moved, a duplicate!
	_VirtualDom_insertNode(changes, localPatches, key + _VirtualDom_POSTFIX, vnode, yIndex, inserts);
}


function _VirtualDom_removeNode(changes, localPatches, key, vnode, index)
{
	var entry = changes[key];

	// never seen this key before
	if (!entry)
	{
		var patch = _VirtualDom_pushPatch(localPatches, 9, index, undefined);

		changes[key] = {
			c: 1,
			z: vnode,
			r: index,
			s: patch
		};

		return;
	}

	// this key was inserted earlier, a match!
	if (entry.c === 0)
	{
		entry.c = 2;
		var subPatches = [];
		_VirtualDom_diffHelp(vnode, entry.z, subPatches, index);

		_VirtualDom_pushPatch(localPatches, 9, index, {
			w: subPatches,
			A: entry
		});

		return;
	}

	// this key has already been removed or moved, a duplicate!
	_VirtualDom_removeNode(changes, localPatches, key + _VirtualDom_POSTFIX, vnode, index);
}



// ADD DOM NODES
//
// Each DOM node has an "index" assigned in order of traversal. It is important
// to minimize our crawl over the actual DOM, so these indexes (along with the
// descendantsCount of virtual nodes) let us skip touching entire subtrees of
// the DOM if we know there are no patches there.


function _VirtualDom_addDomNodes(domNode, vNode, patches, eventNode)
{
	_VirtualDom_addDomNodesHelp(domNode, vNode, patches, 0, 0, vNode.b, eventNode);
}


// assumes `patches` is non-empty and indexes increase monotonically.
function _VirtualDom_addDomNodesHelp(domNode, vNode, patches, i, low, high, eventNode)
{
	var patch = patches[i];
	var index = patch.r;

	while (index === low)
	{
		var patchType = patch.$;

		if (patchType === 1)
		{
			_VirtualDom_addDomNodes(domNode, vNode.k, patch.s, eventNode);
		}
		else if (patchType === 8)
		{
			patch.t = domNode;
			patch.u = eventNode;

			var subPatches = patch.s.w;
			if (subPatches.length > 0)
			{
				_VirtualDom_addDomNodesHelp(domNode, vNode, subPatches, 0, low, high, eventNode);
			}
		}
		else if (patchType === 9)
		{
			patch.t = domNode;
			patch.u = eventNode;

			var data = patch.s;
			if (data)
			{
				data.A.s = domNode;
				var subPatches = data.w;
				if (subPatches.length > 0)
				{
					_VirtualDom_addDomNodesHelp(domNode, vNode, subPatches, 0, low, high, eventNode);
				}
			}
		}
		else
		{
			patch.t = domNode;
			patch.u = eventNode;
		}

		i++;

		if (!(patch = patches[i]) || (index = patch.r) > high)
		{
			return i;
		}
	}

	var tag = vNode.$;

	if (tag === 4)
	{
		var subNode = vNode.k;

		while (subNode.$ === 4)
		{
			subNode = subNode.k;
		}

		return _VirtualDom_addDomNodesHelp(domNode, subNode, patches, i, low + 1, high, domNode.elm_event_node_ref);
	}

	// tag must be 1 or 2 at this point

	var vKids = vNode.e;
	var childNodes = domNode.childNodes;
	for (var j = 0; j < vKids.length; j++)
	{
		low++;
		var vKid = tag === 1 ? vKids[j] : vKids[j].b;
		var nextLow = low + (vKid.b || 0);
		if (low <= index && index <= nextLow)
		{
			i = _VirtualDom_addDomNodesHelp(childNodes[j], vKid, patches, i, low, nextLow, eventNode);
			if (!(patch = patches[i]) || (index = patch.r) > high)
			{
				return i;
			}
		}
		low = nextLow;
	}
	return i;
}



// APPLY PATCHES


function _VirtualDom_applyPatches(rootDomNode, oldVirtualNode, patches, eventNode)
{
	if (patches.length === 0)
	{
		return rootDomNode;
	}

	_VirtualDom_addDomNodes(rootDomNode, oldVirtualNode, patches, eventNode);
	return _VirtualDom_applyPatchesHelp(rootDomNode, patches);
}

function _VirtualDom_applyPatchesHelp(rootDomNode, patches)
{
	for (var i = 0; i < patches.length; i++)
	{
		var patch = patches[i];
		var localDomNode = patch.t
		var newNode = _VirtualDom_applyPatch(localDomNode, patch);
		if (localDomNode === rootDomNode)
		{
			rootDomNode = newNode;
		}
	}
	return rootDomNode;
}

function _VirtualDom_applyPatch(domNode, patch)
{
	switch (patch.$)
	{
		case 0:
			return _VirtualDom_applyPatchRedraw(domNode, patch.s, patch.u);

		case 4:
			_VirtualDom_applyFacts(domNode, patch.u, patch.s);
			return domNode;

		case 3:
			domNode.replaceData(0, domNode.length, patch.s);
			return domNode;

		case 1:
			return _VirtualDom_applyPatchesHelp(domNode, patch.s);

		case 2:
			if (domNode.elm_event_node_ref)
			{
				domNode.elm_event_node_ref.j = patch.s;
			}
			else
			{
				domNode.elm_event_node_ref = { j: patch.s, p: patch.u };
			}
			return domNode;

		case 6:
			var data = patch.s;
			for (var i = 0; i < data.i; i++)
			{
				domNode.removeChild(domNode.childNodes[data.v]);
			}
			return domNode;

		case 7:
			var data = patch.s;
			var kids = data.e;
			var i = data.v;
			var theEnd = domNode.childNodes[i];
			for (; i < kids.length; i++)
			{
				domNode.insertBefore(_VirtualDom_render(kids[i], patch.u), theEnd);
			}
			return domNode;

		case 9:
			var data = patch.s;
			if (!data)
			{
				domNode.parentNode.removeChild(domNode);
				return domNode;
			}
			var entry = data.A;
			if (typeof entry.r !== 'undefined')
			{
				domNode.parentNode.removeChild(domNode);
			}
			entry.s = _VirtualDom_applyPatchesHelp(domNode, data.w);
			return domNode;

		case 8:
			return _VirtualDom_applyPatchReorder(domNode, patch);

		case 5:
			return patch.s(domNode);

		default:
			_Debug_crash(10); // 'Ran into an unknown patch!'
	}
}


function _VirtualDom_applyPatchRedraw(domNode, vNode, eventNode)
{
	var parentNode = domNode.parentNode;
	var newNode = _VirtualDom_render(vNode, eventNode);

	if (!newNode.elm_event_node_ref)
	{
		newNode.elm_event_node_ref = domNode.elm_event_node_ref;
	}

	if (parentNode && newNode !== domNode)
	{
		parentNode.replaceChild(newNode, domNode);
	}
	return newNode;
}


function _VirtualDom_applyPatchReorder(domNode, patch)
{
	var data = patch.s;

	// remove end inserts
	var frag = _VirtualDom_applyPatchReorderEndInsertsHelp(data.y, patch);

	// removals
	domNode = _VirtualDom_applyPatchesHelp(domNode, data.w);

	// inserts
	var inserts = data.x;
	for (var i = 0; i < inserts.length; i++)
	{
		var insert = inserts[i];
		var entry = insert.A;
		var node = entry.c === 2
			? entry.s
			: _VirtualDom_render(entry.z, patch.u);
		domNode.insertBefore(node, domNode.childNodes[insert.r]);
	}

	// add end inserts
	if (frag)
	{
		_VirtualDom_appendChild(domNode, frag);
	}

	return domNode;
}


function _VirtualDom_applyPatchReorderEndInsertsHelp(endInserts, patch)
{
	if (!endInserts)
	{
		return;
	}

	var frag = _VirtualDom_doc.createDocumentFragment();
	for (var i = 0; i < endInserts.length; i++)
	{
		var insert = endInserts[i];
		var entry = insert.A;
		_VirtualDom_appendChild(frag, entry.c === 2
			? entry.s
			: _VirtualDom_render(entry.z, patch.u)
		);
	}
	return frag;
}


function _VirtualDom_virtualize(node)
{
	// TEXT NODES

	if (node.nodeType === 3)
	{
		return _VirtualDom_text(node.textContent);
	}


	// WEIRD NODES

	if (node.nodeType !== 1)
	{
		return _VirtualDom_text('');
	}


	// ELEMENT NODES

	var attrList = _List_Nil;
	var attrs = node.attributes;
	for (var i = attrs.length; i--; )
	{
		var attr = attrs[i];
		var name = attr.name;
		var value = attr.value;
		attrList = _List_Cons( A2(_VirtualDom_attribute, name, value), attrList );
	}

	var tag = node.tagName.toLowerCase();
	var kidList = _List_Nil;
	var kids = node.childNodes;

	for (var i = kids.length; i--; )
	{
		kidList = _List_Cons(_VirtualDom_virtualize(kids[i]), kidList);
	}
	return A3(_VirtualDom_node, tag, attrList, kidList);
}

function _VirtualDom_dekey(keyedNode)
{
	var keyedKids = keyedNode.e;
	var len = keyedKids.length;
	var kids = new Array(len);
	for (var i = 0; i < len; i++)
	{
		kids[i] = keyedKids[i].b;
	}

	return {
		$: 1,
		c: keyedNode.c,
		d: keyedNode.d,
		e: kids,
		f: keyedNode.f,
		b: keyedNode.b
	};
}




// ELEMENT


var _Debugger_element;

var _Browser_element = _Debugger_element || F4(function(impl, flagDecoder, debugMetadata, args)
{
	return _Platform_initialize(
		flagDecoder,
		args,
		impl.bb,
		impl.bB,
		impl.bx,
		function(sendToApp, initialModel) {
			var view = impl.bD;
			/**/
			var domNode = args['node'];
			//*/
			/**_UNUSED/
			var domNode = args && args['node'] ? args['node'] : _Debug_crash(0);
			//*/
			var currNode = _VirtualDom_virtualize(domNode);

			return _Browser_makeAnimator(initialModel, function(model)
			{
				var nextNode = view(model);
				var patches = _VirtualDom_diff(currNode, nextNode);
				domNode = _VirtualDom_applyPatches(domNode, currNode, patches, sendToApp);
				currNode = nextNode;
			});
		}
	);
});



// DOCUMENT


var _Debugger_document;

var _Browser_document = _Debugger_document || F4(function(impl, flagDecoder, debugMetadata, args)
{
	return _Platform_initialize(
		flagDecoder,
		args,
		impl.bb,
		impl.bB,
		impl.bx,
		function(sendToApp, initialModel) {
			var divertHrefToApp = impl.am && impl.am(sendToApp)
			var view = impl.bD;
			var title = _VirtualDom_doc.title;
			var bodyNode = _VirtualDom_doc.body;
			var currNode = _VirtualDom_virtualize(bodyNode);
			return _Browser_makeAnimator(initialModel, function(model)
			{
				_VirtualDom_divertHrefToApp = divertHrefToApp;
				var doc = view(model);
				var nextNode = _VirtualDom_node('body')(_List_Nil)(doc.a$);
				var patches = _VirtualDom_diff(currNode, nextNode);
				bodyNode = _VirtualDom_applyPatches(bodyNode, currNode, patches, sendToApp);
				currNode = nextNode;
				_VirtualDom_divertHrefToApp = 0;
				(title !== doc.aT) && (_VirtualDom_doc.title = title = doc.aT);
			});
		}
	);
});



// ANIMATION


var _Browser_cancelAnimationFrame =
	typeof cancelAnimationFrame !== 'undefined'
		? cancelAnimationFrame
		: function(id) { clearTimeout(id); };

var _Browser_requestAnimationFrame =
	typeof requestAnimationFrame !== 'undefined'
		? requestAnimationFrame
		: function(callback) { return setTimeout(callback, 1000 / 60); };


function _Browser_makeAnimator(model, draw)
{
	draw(model);

	var state = 0;

	function updateIfNeeded()
	{
		state = state === 1
			? 0
			: ( _Browser_requestAnimationFrame(updateIfNeeded), draw(model), 1 );
	}

	return function(nextModel, isSync)
	{
		model = nextModel;

		isSync
			? ( draw(model),
				state === 2 && (state = 1)
				)
			: ( state === 0 && _Browser_requestAnimationFrame(updateIfNeeded),
				state = 2
				);
	};
}



// APPLICATION


function _Browser_application(impl)
{
	var onUrlChange = impl.bp;
	var onUrlRequest = impl.bq;
	var key = function() { key.a(onUrlChange(_Browser_getUrl())); };

	return _Browser_document({
		am: function(sendToApp)
		{
			key.a = sendToApp;
			_Browser_window.addEventListener('popstate', key);
			_Browser_window.navigator.userAgent.indexOf('Trident') < 0 || _Browser_window.addEventListener('hashchange', key);

			return F2(function(domNode, event)
			{
				if (!event.ctrlKey && !event.metaKey && !event.shiftKey && event.button < 1 && !domNode.target && !domNode.hasAttribute('download'))
				{
					event.preventDefault();
					var href = domNode.href;
					var curr = _Browser_getUrl();
					var next = $elm$url$Url$fromString(href).a;
					sendToApp(onUrlRequest(
						(next
							&& curr.aL === next.aL
							&& curr.az === next.az
							&& curr.aI.a === next.aI.a
						)
							? $elm$browser$Browser$Internal(next)
							: $elm$browser$Browser$External(href)
					));
				}
			});
		},
		bb: function(flags)
		{
			return A3(impl.bb, flags, _Browser_getUrl(), key);
		},
		bD: impl.bD,
		bB: impl.bB,
		bx: impl.bx
	});
}

function _Browser_getUrl()
{
	return $elm$url$Url$fromString(_VirtualDom_doc.location.href).a || _Debug_crash(1);
}

var _Browser_go = F2(function(key, n)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function() {
		n && history.go(n);
		key();
	}));
});

var _Browser_pushUrl = F2(function(key, url)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function() {
		history.pushState({}, '', url);
		key();
	}));
});

var _Browser_replaceUrl = F2(function(key, url)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function() {
		history.replaceState({}, '', url);
		key();
	}));
});



// GLOBAL EVENTS


var _Browser_fakeNode = { addEventListener: function() {}, removeEventListener: function() {} };
var _Browser_doc = typeof document !== 'undefined' ? document : _Browser_fakeNode;
var _Browser_window = typeof window !== 'undefined' ? window : _Browser_fakeNode;

var _Browser_on = F3(function(node, eventName, sendToSelf)
{
	return _Scheduler_spawn(_Scheduler_binding(function(callback)
	{
		function handler(event)	{ _Scheduler_rawSpawn(sendToSelf(event)); }
		node.addEventListener(eventName, handler, _VirtualDom_passiveSupported && { passive: true });
		return function() { node.removeEventListener(eventName, handler); };
	}));
});

var _Browser_decodeEvent = F2(function(decoder, event)
{
	var result = _Json_runHelp(decoder, event);
	return $elm$core$Result$isOk(result) ? $elm$core$Maybe$Just(result.a) : $elm$core$Maybe$Nothing;
});



// PAGE VISIBILITY


function _Browser_visibilityInfo()
{
	return (typeof _VirtualDom_doc.hidden !== 'undefined')
		? { a7: 'hidden', a0: 'visibilitychange' }
		:
	(typeof _VirtualDom_doc.mozHidden !== 'undefined')
		? { a7: 'mozHidden', a0: 'mozvisibilitychange' }
		:
	(typeof _VirtualDom_doc.msHidden !== 'undefined')
		? { a7: 'msHidden', a0: 'msvisibilitychange' }
		:
	(typeof _VirtualDom_doc.webkitHidden !== 'undefined')
		? { a7: 'webkitHidden', a0: 'webkitvisibilitychange' }
		: { a7: 'hidden', a0: 'visibilitychange' };
}



// ANIMATION FRAMES


function _Browser_rAF()
{
	return _Scheduler_binding(function(callback)
	{
		var id = _Browser_requestAnimationFrame(function() {
			callback(_Scheduler_succeed(Date.now()));
		});

		return function() {
			_Browser_cancelAnimationFrame(id);
		};
	});
}


function _Browser_now()
{
	return _Scheduler_binding(function(callback)
	{
		callback(_Scheduler_succeed(Date.now()));
	});
}



// DOM STUFF


function _Browser_withNode(id, doStuff)
{
	return _Scheduler_binding(function(callback)
	{
		_Browser_requestAnimationFrame(function() {
			var node = document.getElementById(id);
			callback(node
				? _Scheduler_succeed(doStuff(node))
				: _Scheduler_fail($elm$browser$Browser$Dom$NotFound(id))
			);
		});
	});
}


function _Browser_withWindow(doStuff)
{
	return _Scheduler_binding(function(callback)
	{
		_Browser_requestAnimationFrame(function() {
			callback(_Scheduler_succeed(doStuff()));
		});
	});
}


// FOCUS and BLUR


var _Browser_call = F2(function(functionName, id)
{
	return _Browser_withNode(id, function(node) {
		node[functionName]();
		return _Utils_Tuple0;
	});
});



// WINDOW VIEWPORT


function _Browser_getViewport()
{
	return {
		aO: _Browser_getScene(),
		aV: {
			aX: _Browser_window.pageXOffset,
			aY: _Browser_window.pageYOffset,
			aW: _Browser_doc.documentElement.clientWidth,
			ay: _Browser_doc.documentElement.clientHeight
		}
	};
}

function _Browser_getScene()
{
	var body = _Browser_doc.body;
	var elem = _Browser_doc.documentElement;
	return {
		aW: Math.max(body.scrollWidth, body.offsetWidth, elem.scrollWidth, elem.offsetWidth, elem.clientWidth),
		ay: Math.max(body.scrollHeight, body.offsetHeight, elem.scrollHeight, elem.offsetHeight, elem.clientHeight)
	};
}

var _Browser_setViewport = F2(function(x, y)
{
	return _Browser_withWindow(function()
	{
		_Browser_window.scroll(x, y);
		return _Utils_Tuple0;
	});
});



// ELEMENT VIEWPORT


function _Browser_getViewportOf(id)
{
	return _Browser_withNode(id, function(node)
	{
		return {
			aO: {
				aW: node.scrollWidth,
				ay: node.scrollHeight
			},
			aV: {
				aX: node.scrollLeft,
				aY: node.scrollTop,
				aW: node.clientWidth,
				ay: node.clientHeight
			}
		};
	});
}


var _Browser_setViewportOf = F3(function(id, x, y)
{
	return _Browser_withNode(id, function(node)
	{
		node.scrollLeft = x;
		node.scrollTop = y;
		return _Utils_Tuple0;
	});
});



// ELEMENT


function _Browser_getElement(id)
{
	return _Browser_withNode(id, function(node)
	{
		var rect = node.getBoundingClientRect();
		var x = _Browser_window.pageXOffset;
		var y = _Browser_window.pageYOffset;
		return {
			aO: _Browser_getScene(),
			aV: {
				aX: x,
				aY: y,
				aW: _Browser_doc.documentElement.clientWidth,
				ay: _Browser_doc.documentElement.clientHeight
			},
			a3: {
				aX: x + rect.left,
				aY: y + rect.top,
				aW: rect.width,
				ay: rect.height
			}
		};
	});
}



// LOAD and RELOAD


function _Browser_reload(skipCache)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function(callback)
	{
		_VirtualDom_doc.location.reload(skipCache);
	}));
}

function _Browser_load(url)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function(callback)
	{
		try
		{
			_Browser_window.location = url;
		}
		catch(err)
		{
			// Only Firefox can throw a NS_ERROR_MALFORMED_URI exception here.
			// Other browsers reload the page, so let's be consistent about that.
			_VirtualDom_doc.location.reload(false);
		}
	}));
}



function _Time_now(millisToPosix)
{
	return _Scheduler_binding(function(callback)
	{
		callback(_Scheduler_succeed(millisToPosix(Date.now())));
	});
}

var _Time_setInterval = F2(function(interval, task)
{
	return _Scheduler_binding(function(callback)
	{
		var id = setInterval(function() { _Scheduler_rawSpawn(task); }, interval);
		return function() { clearInterval(id); };
	});
});

function _Time_here()
{
	return _Scheduler_binding(function(callback)
	{
		callback(_Scheduler_succeed(
			A2($elm$time$Time$customZone, -(new Date().getTimezoneOffset()), _List_Nil)
		));
	});
}


function _Time_getZoneName()
{
	return _Scheduler_binding(function(callback)
	{
		try
		{
			var name = $elm$time$Time$Name(Intl.DateTimeFormat().resolvedOptions().timeZone);
		}
		catch (e)
		{
			var name = $elm$time$Time$Offset(new Date().getTimezoneOffset());
		}
		callback(_Scheduler_succeed(name));
	});
}



var _Bitwise_and = F2(function(a, b)
{
	return a & b;
});

var _Bitwise_or = F2(function(a, b)
{
	return a | b;
});

var _Bitwise_xor = F2(function(a, b)
{
	return a ^ b;
});

function _Bitwise_complement(a)
{
	return ~a;
};

var _Bitwise_shiftLeftBy = F2(function(offset, a)
{
	return a << offset;
});

var _Bitwise_shiftRightBy = F2(function(offset, a)
{
	return a >> offset;
});

var _Bitwise_shiftRightZfBy = F2(function(offset, a)
{
	return a >>> offset;
});
var $author$project$Main$UrlChange = function (a) {
	return {$: 2, a: a};
};
var $author$project$Main$UrlRequest = function (a) {
	return {$: 1, a: a};
};
var $elm$core$Basics$EQ = 1;
var $elm$core$Basics$GT = 2;
var $elm$core$Basics$LT = 0;
var $elm$core$List$cons = _List_cons;
var $elm$core$Dict$foldr = F3(
	function (func, acc, t) {
		foldr:
		while (true) {
			if (t.$ === -2) {
				return acc;
			} else {
				var key = t.b;
				var value = t.c;
				var left = t.d;
				var right = t.e;
				var $temp$func = func,
					$temp$acc = A3(
					func,
					key,
					value,
					A3($elm$core$Dict$foldr, func, acc, right)),
					$temp$t = left;
				func = $temp$func;
				acc = $temp$acc;
				t = $temp$t;
				continue foldr;
			}
		}
	});
var $elm$core$Dict$toList = function (dict) {
	return A3(
		$elm$core$Dict$foldr,
		F3(
			function (key, value, list) {
				return A2(
					$elm$core$List$cons,
					_Utils_Tuple2(key, value),
					list);
			}),
		_List_Nil,
		dict);
};
var $elm$core$Dict$keys = function (dict) {
	return A3(
		$elm$core$Dict$foldr,
		F3(
			function (key, value, keyList) {
				return A2($elm$core$List$cons, key, keyList);
			}),
		_List_Nil,
		dict);
};
var $elm$core$Set$toList = function (_v0) {
	var dict = _v0;
	return $elm$core$Dict$keys(dict);
};
var $elm$core$Elm$JsArray$foldr = _JsArray_foldr;
var $elm$core$Array$foldr = F3(
	function (func, baseCase, _v0) {
		var tree = _v0.c;
		var tail = _v0.d;
		var helper = F2(
			function (node, acc) {
				if (!node.$) {
					var subTree = node.a;
					return A3($elm$core$Elm$JsArray$foldr, helper, acc, subTree);
				} else {
					var values = node.a;
					return A3($elm$core$Elm$JsArray$foldr, func, acc, values);
				}
			});
		return A3(
			$elm$core$Elm$JsArray$foldr,
			helper,
			A3($elm$core$Elm$JsArray$foldr, func, baseCase, tail),
			tree);
	});
var $elm$core$Array$toList = function (array) {
	return A3($elm$core$Array$foldr, $elm$core$List$cons, _List_Nil, array);
};
var $elm$core$Result$Err = function (a) {
	return {$: 1, a: a};
};
var $elm$json$Json$Decode$Failure = F2(
	function (a, b) {
		return {$: 3, a: a, b: b};
	});
var $elm$json$Json$Decode$Field = F2(
	function (a, b) {
		return {$: 0, a: a, b: b};
	});
var $elm$json$Json$Decode$Index = F2(
	function (a, b) {
		return {$: 1, a: a, b: b};
	});
var $elm$core$Result$Ok = function (a) {
	return {$: 0, a: a};
};
var $elm$json$Json$Decode$OneOf = function (a) {
	return {$: 2, a: a};
};
var $elm$core$Basics$False = 1;
var $elm$core$Basics$add = _Basics_add;
var $elm$core$Maybe$Just = function (a) {
	return {$: 0, a: a};
};
var $elm$core$Maybe$Nothing = {$: 1};
var $elm$core$String$all = _String_all;
var $elm$core$Basics$and = _Basics_and;
var $elm$core$Basics$append = _Utils_append;
var $elm$json$Json$Encode$encode = _Json_encode;
var $elm$core$String$fromInt = _String_fromNumber;
var $elm$core$String$join = F2(
	function (sep, chunks) {
		return A2(
			_String_join,
			sep,
			_List_toArray(chunks));
	});
var $elm$core$String$split = F2(
	function (sep, string) {
		return _List_fromArray(
			A2(_String_split, sep, string));
	});
var $elm$json$Json$Decode$indent = function (str) {
	return A2(
		$elm$core$String$join,
		'\u000A    ',
		A2($elm$core$String$split, '\u000A', str));
};
var $elm$core$List$foldl = F3(
	function (func, acc, list) {
		foldl:
		while (true) {
			if (!list.b) {
				return acc;
			} else {
				var x = list.a;
				var xs = list.b;
				var $temp$func = func,
					$temp$acc = A2(func, x, acc),
					$temp$list = xs;
				func = $temp$func;
				acc = $temp$acc;
				list = $temp$list;
				continue foldl;
			}
		}
	});
var $elm$core$List$length = function (xs) {
	return A3(
		$elm$core$List$foldl,
		F2(
			function (_v0, i) {
				return i + 1;
			}),
		0,
		xs);
};
var $elm$core$List$map2 = _List_map2;
var $elm$core$Basics$le = _Utils_le;
var $elm$core$Basics$sub = _Basics_sub;
var $elm$core$List$rangeHelp = F3(
	function (lo, hi, list) {
		rangeHelp:
		while (true) {
			if (_Utils_cmp(lo, hi) < 1) {
				var $temp$lo = lo,
					$temp$hi = hi - 1,
					$temp$list = A2($elm$core$List$cons, hi, list);
				lo = $temp$lo;
				hi = $temp$hi;
				list = $temp$list;
				continue rangeHelp;
			} else {
				return list;
			}
		}
	});
var $elm$core$List$range = F2(
	function (lo, hi) {
		return A3($elm$core$List$rangeHelp, lo, hi, _List_Nil);
	});
var $elm$core$List$indexedMap = F2(
	function (f, xs) {
		return A3(
			$elm$core$List$map2,
			f,
			A2(
				$elm$core$List$range,
				0,
				$elm$core$List$length(xs) - 1),
			xs);
	});
var $elm$core$Char$toCode = _Char_toCode;
var $elm$core$Char$isLower = function (_char) {
	var code = $elm$core$Char$toCode(_char);
	return (97 <= code) && (code <= 122);
};
var $elm$core$Char$isUpper = function (_char) {
	var code = $elm$core$Char$toCode(_char);
	return (code <= 90) && (65 <= code);
};
var $elm$core$Basics$or = _Basics_or;
var $elm$core$Char$isAlpha = function (_char) {
	return $elm$core$Char$isLower(_char) || $elm$core$Char$isUpper(_char);
};
var $elm$core$Char$isDigit = function (_char) {
	var code = $elm$core$Char$toCode(_char);
	return (code <= 57) && (48 <= code);
};
var $elm$core$Char$isAlphaNum = function (_char) {
	return $elm$core$Char$isLower(_char) || ($elm$core$Char$isUpper(_char) || $elm$core$Char$isDigit(_char));
};
var $elm$core$List$reverse = function (list) {
	return A3($elm$core$List$foldl, $elm$core$List$cons, _List_Nil, list);
};
var $elm$core$String$uncons = _String_uncons;
var $elm$json$Json$Decode$errorOneOf = F2(
	function (i, error) {
		return '\u000A\u000A(' + ($elm$core$String$fromInt(i + 1) + (') ' + $elm$json$Json$Decode$indent(
			$elm$json$Json$Decode$errorToString(error))));
	});
var $elm$json$Json$Decode$errorToString = function (error) {
	return A2($elm$json$Json$Decode$errorToStringHelp, error, _List_Nil);
};
var $elm$json$Json$Decode$errorToStringHelp = F2(
	function (error, context) {
		errorToStringHelp:
		while (true) {
			switch (error.$) {
				case 0:
					var f = error.a;
					var err = error.b;
					var isSimple = function () {
						var _v1 = $elm$core$String$uncons(f);
						if (_v1.$ === 1) {
							return false;
						} else {
							var _v2 = _v1.a;
							var _char = _v2.a;
							var rest = _v2.b;
							return $elm$core$Char$isAlpha(_char) && A2($elm$core$String$all, $elm$core$Char$isAlphaNum, rest);
						}
					}();
					var fieldName = isSimple ? ('.' + f) : ('[\u0027' + (f + '\u0027]'));
					var $temp$error = err,
						$temp$context = A2($elm$core$List$cons, fieldName, context);
					error = $temp$error;
					context = $temp$context;
					continue errorToStringHelp;
				case 1:
					var i = error.a;
					var err = error.b;
					var indexName = '[' + ($elm$core$String$fromInt(i) + ']');
					var $temp$error = err,
						$temp$context = A2($elm$core$List$cons, indexName, context);
					error = $temp$error;
					context = $temp$context;
					continue errorToStringHelp;
				case 2:
					var errors = error.a;
					if (!errors.b) {
						return 'Ran into a Json.Decode.oneOf with no possibilities' + function () {
							if (!context.b) {
								return '!';
							} else {
								return ' at json' + A2(
									$elm$core$String$join,
									'',
									$elm$core$List$reverse(context));
							}
						}();
					} else {
						if (!errors.b.b) {
							var err = errors.a;
							var $temp$error = err,
								$temp$context = context;
							error = $temp$error;
							context = $temp$context;
							continue errorToStringHelp;
						} else {
							var starter = function () {
								if (!context.b) {
									return 'Json.Decode.oneOf';
								} else {
									return 'The Json.Decode.oneOf at json' + A2(
										$elm$core$String$join,
										'',
										$elm$core$List$reverse(context));
								}
							}();
							var introduction = starter + (' failed in the following ' + ($elm$core$String$fromInt(
								$elm$core$List$length(errors)) + ' ways:'));
							return A2(
								$elm$core$String$join,
								'\u000A\u000A',
								A2(
									$elm$core$List$cons,
									introduction,
									A2($elm$core$List$indexedMap, $elm$json$Json$Decode$errorOneOf, errors)));
						}
					}
				default:
					var msg = error.a;
					var json = error.b;
					var introduction = function () {
						if (!context.b) {
							return 'Problem with the given value:\u000A\u000A';
						} else {
							return 'Problem with the value at json' + (A2(
								$elm$core$String$join,
								'',
								$elm$core$List$reverse(context)) + ':\u000A\u000A    ');
						}
					}();
					return introduction + ($elm$json$Json$Decode$indent(
						A2($elm$json$Json$Encode$encode, 4, json)) + ('\u000A\u000A' + msg));
			}
		}
	});
var $elm$core$Array$branchFactor = 32;
var $elm$core$Array$Array_elm_builtin = F4(
	function (a, b, c, d) {
		return {$: 0, a: a, b: b, c: c, d: d};
	});
var $elm$core$Elm$JsArray$empty = _JsArray_empty;
var $elm$core$Basics$ceiling = _Basics_ceiling;
var $elm$core$Basics$fdiv = _Basics_fdiv;
var $elm$core$Basics$logBase = F2(
	function (base, number) {
		return _Basics_log(number) / _Basics_log(base);
	});
var $elm$core$Basics$toFloat = _Basics_toFloat;
var $elm$core$Array$shiftStep = $elm$core$Basics$ceiling(
	A2($elm$core$Basics$logBase, 2, $elm$core$Array$branchFactor));
var $elm$core$Array$empty = A4($elm$core$Array$Array_elm_builtin, 0, $elm$core$Array$shiftStep, $elm$core$Elm$JsArray$empty, $elm$core$Elm$JsArray$empty);
var $elm$core$Elm$JsArray$initialize = _JsArray_initialize;
var $elm$core$Array$Leaf = function (a) {
	return {$: 1, a: a};
};
var $elm$core$Basics$apL = F2(
	function (f, x) {
		return f(x);
	});
var $elm$core$Basics$apR = F2(
	function (x, f) {
		return f(x);
	});
var $elm$core$Basics$eq = _Utils_equal;
var $elm$core$Basics$floor = _Basics_floor;
var $elm$core$Elm$JsArray$length = _JsArray_length;
var $elm$core$Basics$gt = _Utils_gt;
var $elm$core$Basics$max = F2(
	function (x, y) {
		return (_Utils_cmp(x, y) > 0) ? x : y;
	});
var $elm$core$Basics$mul = _Basics_mul;
var $elm$core$Array$SubTree = function (a) {
	return {$: 0, a: a};
};
var $elm$core$Elm$JsArray$initializeFromList = _JsArray_initializeFromList;
var $elm$core$Array$compressNodes = F2(
	function (nodes, acc) {
		compressNodes:
		while (true) {
			var _v0 = A2($elm$core$Elm$JsArray$initializeFromList, $elm$core$Array$branchFactor, nodes);
			var node = _v0.a;
			var remainingNodes = _v0.b;
			var newAcc = A2(
				$elm$core$List$cons,
				$elm$core$Array$SubTree(node),
				acc);
			if (!remainingNodes.b) {
				return $elm$core$List$reverse(newAcc);
			} else {
				var $temp$nodes = remainingNodes,
					$temp$acc = newAcc;
				nodes = $temp$nodes;
				acc = $temp$acc;
				continue compressNodes;
			}
		}
	});
var $elm$core$Tuple$first = function (_v0) {
	var x = _v0.a;
	return x;
};
var $elm$core$Array$treeFromBuilder = F2(
	function (nodeList, nodeListSize) {
		treeFromBuilder:
		while (true) {
			var newNodeSize = $elm$core$Basics$ceiling(nodeListSize / $elm$core$Array$branchFactor);
			if (newNodeSize === 1) {
				return A2($elm$core$Elm$JsArray$initializeFromList, $elm$core$Array$branchFactor, nodeList).a;
			} else {
				var $temp$nodeList = A2($elm$core$Array$compressNodes, nodeList, _List_Nil),
					$temp$nodeListSize = newNodeSize;
				nodeList = $temp$nodeList;
				nodeListSize = $temp$nodeListSize;
				continue treeFromBuilder;
			}
		}
	});
var $elm$core$Array$builderToArray = F2(
	function (reverseNodeList, builder) {
		if (!builder.a) {
			return A4(
				$elm$core$Array$Array_elm_builtin,
				$elm$core$Elm$JsArray$length(builder.c),
				$elm$core$Array$shiftStep,
				$elm$core$Elm$JsArray$empty,
				builder.c);
		} else {
			var treeLen = builder.a * $elm$core$Array$branchFactor;
			var depth = $elm$core$Basics$floor(
				A2($elm$core$Basics$logBase, $elm$core$Array$branchFactor, treeLen - 1));
			var correctNodeList = reverseNodeList ? $elm$core$List$reverse(builder.d) : builder.d;
			var tree = A2($elm$core$Array$treeFromBuilder, correctNodeList, builder.a);
			return A4(
				$elm$core$Array$Array_elm_builtin,
				$elm$core$Elm$JsArray$length(builder.c) + treeLen,
				A2($elm$core$Basics$max, 5, depth * $elm$core$Array$shiftStep),
				tree,
				builder.c);
		}
	});
var $elm$core$Basics$idiv = _Basics_idiv;
var $elm$core$Basics$lt = _Utils_lt;
var $elm$core$Array$initializeHelp = F5(
	function (fn, fromIndex, len, nodeList, tail) {
		initializeHelp:
		while (true) {
			if (fromIndex < 0) {
				return A2(
					$elm$core$Array$builderToArray,
					false,
					{d: nodeList, a: (len / $elm$core$Array$branchFactor) | 0, c: tail});
			} else {
				var leaf = $elm$core$Array$Leaf(
					A3($elm$core$Elm$JsArray$initialize, $elm$core$Array$branchFactor, fromIndex, fn));
				var $temp$fn = fn,
					$temp$fromIndex = fromIndex - $elm$core$Array$branchFactor,
					$temp$len = len,
					$temp$nodeList = A2($elm$core$List$cons, leaf, nodeList),
					$temp$tail = tail;
				fn = $temp$fn;
				fromIndex = $temp$fromIndex;
				len = $temp$len;
				nodeList = $temp$nodeList;
				tail = $temp$tail;
				continue initializeHelp;
			}
		}
	});
var $elm$core$Basics$remainderBy = _Basics_remainderBy;
var $elm$core$Array$initialize = F2(
	function (len, fn) {
		if (len <= 0) {
			return $elm$core$Array$empty;
		} else {
			var tailLen = len % $elm$core$Array$branchFactor;
			var tail = A3($elm$core$Elm$JsArray$initialize, tailLen, len - tailLen, fn);
			var initialFromIndex = (len - tailLen) - $elm$core$Array$branchFactor;
			return A5($elm$core$Array$initializeHelp, fn, initialFromIndex, len, _List_Nil, tail);
		}
	});
var $elm$core$Basics$True = 0;
var $elm$core$Result$isOk = function (result) {
	if (!result.$) {
		return true;
	} else {
		return false;
	}
};
var $elm$json$Json$Decode$map = _Json_map1;
var $elm$json$Json$Decode$map2 = _Json_map2;
var $elm$json$Json$Decode$succeed = _Json_succeed;
var $elm$virtual_dom$VirtualDom$toHandlerInt = function (handler) {
	switch (handler.$) {
		case 0:
			return 0;
		case 1:
			return 1;
		case 2:
			return 2;
		default:
			return 3;
	}
};
var $elm$browser$Browser$External = function (a) {
	return {$: 1, a: a};
};
var $elm$browser$Browser$Internal = function (a) {
	return {$: 0, a: a};
};
var $elm$core$Basics$identity = function (x) {
	return x;
};
var $elm$browser$Browser$Dom$NotFound = $elm$core$Basics$identity;
var $elm$url$Url$Http = 0;
var $elm$url$Url$Https = 1;
var $elm$url$Url$Url = F6(
	function (protocol, host, port_, path, query, fragment) {
		return {a6: fragment, az: host, aG: path, aI: port_, aL: protocol, bs: query};
	});
var $elm$core$String$contains = _String_contains;
var $elm$core$String$length = _String_length;
var $elm$core$String$slice = _String_slice;
var $elm$core$String$dropLeft = F2(
	function (n, string) {
		return (n < 1) ? string : A3(
			$elm$core$String$slice,
			n,
			$elm$core$String$length(string),
			string);
	});
var $elm$core$String$indexes = _String_indexes;
var $elm$core$String$isEmpty = function (string) {
	return string === '';
};
var $elm$core$String$left = F2(
	function (n, string) {
		return (n < 1) ? '' : A3($elm$core$String$slice, 0, n, string);
	});
var $elm$core$String$toInt = _String_toInt;
var $elm$url$Url$chompBeforePath = F5(
	function (protocol, path, params, frag, str) {
		if ($elm$core$String$isEmpty(str) || A2($elm$core$String$contains, '@', str)) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v0 = A2($elm$core$String$indexes, ':', str);
			if (!_v0.b) {
				return $elm$core$Maybe$Just(
					A6($elm$url$Url$Url, protocol, str, $elm$core$Maybe$Nothing, path, params, frag));
			} else {
				if (!_v0.b.b) {
					var i = _v0.a;
					var _v1 = $elm$core$String$toInt(
						A2($elm$core$String$dropLeft, i + 1, str));
					if (_v1.$ === 1) {
						return $elm$core$Maybe$Nothing;
					} else {
						var port_ = _v1;
						return $elm$core$Maybe$Just(
							A6(
								$elm$url$Url$Url,
								protocol,
								A2($elm$core$String$left, i, str),
								port_,
								path,
								params,
								frag));
					}
				} else {
					return $elm$core$Maybe$Nothing;
				}
			}
		}
	});
var $elm$url$Url$chompBeforeQuery = F4(
	function (protocol, params, frag, str) {
		if ($elm$core$String$isEmpty(str)) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v0 = A2($elm$core$String$indexes, '/', str);
			if (!_v0.b) {
				return A5($elm$url$Url$chompBeforePath, protocol, '/', params, frag, str);
			} else {
				var i = _v0.a;
				return A5(
					$elm$url$Url$chompBeforePath,
					protocol,
					A2($elm$core$String$dropLeft, i, str),
					params,
					frag,
					A2($elm$core$String$left, i, str));
			}
		}
	});
var $elm$url$Url$chompBeforeFragment = F3(
	function (protocol, frag, str) {
		if ($elm$core$String$isEmpty(str)) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v0 = A2($elm$core$String$indexes, '?', str);
			if (!_v0.b) {
				return A4($elm$url$Url$chompBeforeQuery, protocol, $elm$core$Maybe$Nothing, frag, str);
			} else {
				var i = _v0.a;
				return A4(
					$elm$url$Url$chompBeforeQuery,
					protocol,
					$elm$core$Maybe$Just(
						A2($elm$core$String$dropLeft, i + 1, str)),
					frag,
					A2($elm$core$String$left, i, str));
			}
		}
	});
var $elm$url$Url$chompAfterProtocol = F2(
	function (protocol, str) {
		if ($elm$core$String$isEmpty(str)) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v0 = A2($elm$core$String$indexes, '#', str);
			if (!_v0.b) {
				return A3($elm$url$Url$chompBeforeFragment, protocol, $elm$core$Maybe$Nothing, str);
			} else {
				var i = _v0.a;
				return A3(
					$elm$url$Url$chompBeforeFragment,
					protocol,
					$elm$core$Maybe$Just(
						A2($elm$core$String$dropLeft, i + 1, str)),
					A2($elm$core$String$left, i, str));
			}
		}
	});
var $elm$core$String$startsWith = _String_startsWith;
var $elm$url$Url$fromString = function (str) {
	return A2($elm$core$String$startsWith, 'http://', str) ? A2(
		$elm$url$Url$chompAfterProtocol,
		0,
		A2($elm$core$String$dropLeft, 7, str)) : (A2($elm$core$String$startsWith, 'https://', str) ? A2(
		$elm$url$Url$chompAfterProtocol,
		1,
		A2($elm$core$String$dropLeft, 8, str)) : $elm$core$Maybe$Nothing);
};
var $elm$core$Basics$never = function (_v0) {
	never:
	while (true) {
		var nvr = _v0;
		var $temp$_v0 = nvr;
		_v0 = $temp$_v0;
		continue never;
	}
};
var $elm$core$Task$Perform = $elm$core$Basics$identity;
var $elm$core$Task$succeed = _Scheduler_succeed;
var $elm$core$Task$init = $elm$core$Task$succeed(0);
var $elm$core$List$foldrHelper = F4(
	function (fn, acc, ctr, ls) {
		if (!ls.b) {
			return acc;
		} else {
			var a = ls.a;
			var r1 = ls.b;
			if (!r1.b) {
				return A2(fn, a, acc);
			} else {
				var b = r1.a;
				var r2 = r1.b;
				if (!r2.b) {
					return A2(
						fn,
						a,
						A2(fn, b, acc));
				} else {
					var c = r2.a;
					var r3 = r2.b;
					if (!r3.b) {
						return A2(
							fn,
							a,
							A2(
								fn,
								b,
								A2(fn, c, acc)));
					} else {
						var d = r3.a;
						var r4 = r3.b;
						var res = (ctr > 500) ? A3(
							$elm$core$List$foldl,
							fn,
							acc,
							$elm$core$List$reverse(r4)) : A4($elm$core$List$foldrHelper, fn, acc, ctr + 1, r4);
						return A2(
							fn,
							a,
							A2(
								fn,
								b,
								A2(
									fn,
									c,
									A2(fn, d, res))));
					}
				}
			}
		}
	});
var $elm$core$List$foldr = F3(
	function (fn, acc, ls) {
		return A4($elm$core$List$foldrHelper, fn, acc, 0, ls);
	});
var $elm$core$List$map = F2(
	function (f, xs) {
		return A3(
			$elm$core$List$foldr,
			F2(
				function (x, acc) {
					return A2(
						$elm$core$List$cons,
						f(x),
						acc);
				}),
			_List_Nil,
			xs);
	});
var $elm$core$Task$andThen = _Scheduler_andThen;
var $elm$core$Task$map = F2(
	function (func, taskA) {
		return A2(
			$elm$core$Task$andThen,
			function (a) {
				return $elm$core$Task$succeed(
					func(a));
			},
			taskA);
	});
var $elm$core$Task$map2 = F3(
	function (func, taskA, taskB) {
		return A2(
			$elm$core$Task$andThen,
			function (a) {
				return A2(
					$elm$core$Task$andThen,
					function (b) {
						return $elm$core$Task$succeed(
							A2(func, a, b));
					},
					taskB);
			},
			taskA);
	});
var $elm$core$Task$sequence = function (tasks) {
	return A3(
		$elm$core$List$foldr,
		$elm$core$Task$map2($elm$core$List$cons),
		$elm$core$Task$succeed(_List_Nil),
		tasks);
};
var $elm$core$Platform$sendToApp = _Platform_sendToApp;
var $elm$core$Task$spawnCmd = F2(
	function (router, _v0) {
		var task = _v0;
		return _Scheduler_spawn(
			A2(
				$elm$core$Task$andThen,
				$elm$core$Platform$sendToApp(router),
				task));
	});
var $elm$core$Task$onEffects = F3(
	function (router, commands, state) {
		return A2(
			$elm$core$Task$map,
			function (_v0) {
				return 0;
			},
			$elm$core$Task$sequence(
				A2(
					$elm$core$List$map,
					$elm$core$Task$spawnCmd(router),
					commands)));
	});
var $elm$core$Task$onSelfMsg = F3(
	function (_v0, _v1, _v2) {
		return $elm$core$Task$succeed(0);
	});
var $elm$core$Task$cmdMap = F2(
	function (tagger, _v0) {
		var task = _v0;
		return A2($elm$core$Task$map, tagger, task);
	});
_Platform_effectManagers['Task'] = _Platform_createManager($elm$core$Task$init, $elm$core$Task$onEffects, $elm$core$Task$onSelfMsg, $elm$core$Task$cmdMap);
var $elm$core$Task$command = _Platform_leaf('Task');
var $elm$core$Task$perform = F2(
	function (toMessage, task) {
		return $elm$core$Task$command(
			A2($elm$core$Task$map, toMessage, task));
	});
var $elm$browser$Browser$application = _Browser_application;
var $elm$time$Time$Posix = $elm$core$Basics$identity;
var $elm$time$Time$millisToPosix = $elm$core$Basics$identity;
var $elm$core$Platform$Cmd$batch = _Platform_batch;
var $elm$core$Platform$Cmd$none = $elm$core$Platform$Cmd$batch(_List_Nil);
var $author$project$Router$About = {$: 5};
var $author$project$Router$Home = {$: 0};
var $author$project$Router$NotFound = function (a) {
	return {$: 6, a: a};
};
var $author$project$Router$Post = function (a) {
	return {$: 2, a: a};
};
var $author$project$Router$Projects = {$: 3};
var $author$project$Router$Research = {$: 4};
var $author$project$Router$Writing = {$: 1};
var $elm$core$List$any = F2(
	function (isOkay, list) {
		any:
		while (true) {
			if (!list.b) {
				return false;
			} else {
				var x = list.a;
				var xs = list.b;
				if (isOkay(x)) {
					return true;
				} else {
					var $temp$isOkay = isOkay,
						$temp$list = xs;
					isOkay = $temp$isOkay;
					list = $temp$list;
					continue any;
				}
			}
		}
	});
var $elm$core$List$filter = F2(
	function (isGood, list) {
		return A3(
			$elm$core$List$foldr,
			F2(
				function (x, xs) {
					return isGood(x) ? A2($elm$core$List$cons, x, xs) : xs;
				}),
			_List_Nil,
			list);
	});
var $elm$core$List$head = function (list) {
	if (list.b) {
		var x = list.a;
		var xs = list.b;
		return $elm$core$Maybe$Just(x);
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $elm$core$Basics$neq = _Utils_notEqual;
var $author$project$Content$Posts$plastPost = '# Re-designing Plast for more elegant solution\u000A\u000AOver the last couple of weeks I have been working on my robotics communication framework in Zig. I finalized the core for the first version that I will publish, so I thought it\u0027s a good time to go work on something else for a couple of days so I don\u0027t burn out — the project was starting to feel boring. I\u0027m very interested in Physical AI and robotics, so I decided to go back to `plast`, which is my simple deep learning framework written in `c` and `cuda`. I already implemented the cpu and gpu kernels for most of the tensor ops needed, built a tiny `JIT` compiler for it, and made python bindings so people can use it with an experiment tracking system. But there is something else. As someone interested in physical AI and robotics, this library is useless to me without the ability to do reinforcement learning with ease.\u000A\u000A## Why rewrite in Zig?\u000A\u000AI think this shouldn\u0027t be a shocker by now. I invested a good amount of time learning and writing Zig, and built glu from scratch in pure Zig. To be honest, writing python code for robots is not ideal — you don\u0027t get much control over your resources. And writing the api in c is not the most enjoyable experience you can get. So re-writing the core in Zig is a win. It\u0027s a good mixture of both worlds: I still have fine-grained control over hardware resources, and I get a decent api that is enjoyable to work with.\u000A\u000A\u0022But rewriting a full deep learning framework from scratch seems like a premature decision that will take too much time.\u0022 I figured you might ask that. And maybe you\u0027d be correct. But the project wasn\u0027t that big. Running `cloc . --exclude-content=kernels/ --exclude-lang=zig` on my `src/` folder gives me this:\u000A\u000A```\u000A-------------------------------------------------------------------------------\u000ALanguage                     files          blank        comment           code\u000A-------------------------------------------------------------------------------\u000AC                               11            122             12            755\u000AC++                              1             37              9            294\u000ACUDA                             6             30              7            181\u000A-------------------------------------------------------------------------------\u000ASUM:                            18            189             28           1230\u000A-------------------------------------------------------------------------------\u000A```\u000A\u000AMost of the code lives in the `kernels/` folder with the `c` and `cuda` kernels. The project wasn\u0027t that large after all. So I decided to re-write the core in Zig, keep the kernels, and just use the `extern` keyword to link them in the build system. Same kernels, no re-write, but now the system is in a language I can actually enjoy working with. Win-win.\u000A\u000A## The problem with hand-written kernels\u000A\u000AThe approach I\u0027m using right now is hand-writing every single kernel for every operation. This is not ideal. First, it means too much code. In `c` that means writing optimized kernels for every data type. When writing `cuda` kernels, the execution configuration alone can make or break performance. And one of the most important optimization techniques in ML compilers — kernel fusion — becomes a nightmare of combinatorial explosion.\u000A\u000AKernel fusion is about writing a single kernel that composes multiple operations together. Take the most used `nn` layer in deep learning: `Linear`, which is basically `input @ weight.T + bias`. Why load `input` and `weights` from memory, do matmul, store the output, then load that result back to add `bias`, then store again? If you have been paying attention (congrats for not being brain-rotted) you\u0027ll notice we just did `(4) loads` and `(2) stores` across two separate function frames with jump operations in between. That shit is a performance killer.\u000A\u000AWith kernel fusion we write a single `matmul_add` kernel: matmul then add in the same frame. No jump ops. In this version we do `(3) loads` and `(1) store`. We saved one load and one store, which is significant because loads and stores are the most expensive operations in computer hardware.\u000A\u000AWith hand-written kernels we would need to write every fused variant separately, and all of them need to be exported to Zig. Plus the code is ugly. Look at this:\u000A\u000A```cuda\u000A__global__ void add_kernel_float_contig(const float *a, const float *b, float *c, int num_elements) {\u000A    int tid = blockDim.x * blockIdx.x + threadIdx.x;\u000A\u000A    if (tid < num_elements) {\u000A        c[tid] = a[tid] + b[tid];\u000A    }\u000A}\u000A\u000A__global__ void add_kernel_int_contig(const int *a, const int *b, int *c, int num_elements) {\u000A    int tid = blockDim.x * blockIdx.x + threadIdx.x;\u000A\u000A    if (tid < num_elements) {\u000A        c[tid] = a[tid] + b[tid];\u000A    }\u000A}\u000A\u000A__global__ void sub_kernel_float_contig(const float *a, const float *b, float *c, int num_elements) {\u000A    int tid = blockDim.x * blockIdx.x + threadIdx.x;\u000A\u000A    if (tid < num_elements) {\u000A        c[tid] = a[tid] - b[tid];\u000A    }\u000A}\u000A\u000A__global__ void sub_kernel_int_contig(const int *a, const int *b, int *c, int num_elements) {\u000A    int tid = blockDim.x * blockIdx.x + threadIdx.x;\u000A\u000A    if (tid < num_elements) {\u000A        c[tid] = a[tid] - b[tid];\u000A    }\u000A}\u000A\u000A\u000A__global__ void mul_kernel_float_contig(const float *a, const float *b, float *c, int num_elements) {\u000A    int tid = blockDim.x * blockIdx.x + threadIdx.x;\u000A\u000A    if (tid < num_elements) {\u000A        c[tid] = a[tid] * b[tid];\u000A    }\u000A}\u000A\u000A__global__ void mul_kernel_int_contig(const int *a, const int *b, int *c, int num_elements) {\u000A    int tid = blockDim.x * blockIdx.x + threadIdx.x;\u000A\u000A    if (tid < num_elements) {\u000A        c[tid] = a[tid] * b[tid];\u000A    }\u000A}\u000A```\u000A\u000AAnd this is only for two data types, without even considering noncontiguous data layouts from slicing and movement ops like `broadcast` and `expand`.\u000A\u000A## Codegen to the rescue\u000A\u000AAs a big fan of geohot, I was very interested in studying how tinygrad works. Tinygrad has a similar philosophy to `tvm`. Here\u0027s how `tvm` works: it captures the computation graph, lowers it to an `IR` representation, optimizes it with `MLIR`, and executes the optimized graph.\u000A\u000ATinygrad doesn\u0027t work exactly the same way, but the philosophy is similar. Instead of hand-writing every kernel — which is what I\u0027m doing in plast — it has a `codegen` module. This module uses the `UOp` datatype to write kernels at runtime as needed. Using something called a `Linearizer`, it tries different optimization techniques like loop unrolling and shared memory usage on cuda, launches kernels with different configurations, and uses Beam Search to pick the fastest one.\u000A\u000AYou might think \u0022this is very slow\u0022. You\u0027re not completely right, but you\u0027re not completely wrong either. It\u0027s slower on the first batch because it has to build the graph and write the optimized kernels. But with a JIT compiler we cache the resulting graph and kernels, so every subsequent batch uses them directly. This gives us a highly optimized graph without writing a kernel for every single combination of constraints.\u000A\u000ANow let\u0027s look at how to generate all those ugly kernels from the previous section on the fly:\u000A\u000A```zig\u000Aconst std = @import(\u0022std\u0022);\u000A\u000Apub const DataType = enum {\u000A    float,\u000A    int,\u000A\u000A    pub fn toCudaTypeString(self: DataType) []const u8 {\u000A        return switch (self) {\u000A            .float => \u0022float\u0022,\u000A            .int => \u0022int\u0022,\u000A        };\u000A    }\u000A};\u000A\u000Apub const OpType = enum {\u000A    add,\u000A    sub,\u000A    mul,\u000A\u000A    pub fn toChar(self: OpType) u8 {\u000A        return switch (self) {\u000A            .add => \u0027+\u0027,\u000A            .sub => \u0027-\u0027,\u000A            .mul => \u0027*\u0027,\u000A        };\u000A    }\u000A};\u000A\u000Apub const Op = struct {\u000A    op_type: OpType,\u000A    data_type: DataType,\u000A\u000A    pub fn generateKernel(self: Op, allocator: std.mem.Allocator) ![]const u8 {\u000A        const op_name = @tagName(self.op_type);\u000A        const type_name = @tagName(self.data_type);\u000A        const type_c_str = self.data_type.toCudaTypeString();\u000A        const op_char = self.op_type.toChar();\u000A\u000A        const template =\u000A            \u005C\u005C\u005C\u005C__global__ void {s}_kernel_{s}_contig(const {s} *a, const {s} *b, {s} *c, int num_elements) {{\u000A            \u005C\u005C\u005C\u005C    int tid = blockDim.x * blockIdx.x + threadIdx.x;\u000A            \u005C\u005C\u005C\u005C\u000A            \u005C\u005C\u005C\u005C    if (tid < num_elements) {{\u000A            \u005C\u005C\u005C\u005C        c[tid] = a[tid] {c} b[tid];\u000A            \u005C\u005C\u005C\u005C    }}\u000A            \u005C\u005C\u005C\u005C}}\u000A            \u005C\u005C\u005C\u005C\u000A        ;\u000A\u000A        return try std.fmt.allocPrint(allocator, template, .{\u000A            op_name,\u000A            type_name,\u000A            type_c_str,\u000A            type_c_str,\u000A            type_c_str,\u000A            op_char,\u000A        });\u000A    }\u000A};\u000A```\u000A\u000AWith this we can generate kernels for any data type we want. With the right implementation, generating optimized kernels becomes elegant and maintainable instead of a copy-paste factory. That\u0027s why I think codegen is a much better approach than hand-written kernels.\u000A\u000A## What\u0027s next for Plast\u000A\u000ASo where does this leave us? The plan is coming together: rewrite the core in Zig, keep the existing kernels, build a codegen module to replace the kernel copy-paste nightmare, wire it all into the JIT compiler, and finally — finally — have a framework I can actually use for reinforcement learning without wanting to throw my laptop out the window.\u000A\u000ARight now I\u0027m working on the Zig core and the codegen module in parallel. The kernels are already done and battle-tested from the C version, so that part is essentially free — just link and go. Once the codegen is mature enough to handle the full set of elementwise ops, I\u0027ll start fuzzing it against the hand-written kernels to make sure we don\u0027t regress on correctness or performance. After that, the hand-written versions go in the trash where they belong.\u000A\u000AI don\u0027t know when the first version will be ready. Could be weeks, could be months. But for the first time this project actually feels fun again, and that\u0027s worth more than any release date.';
var $author$project$Content$Posts$readCodePost = '# I read the code.\u000A\u000A## The tweet\u000A\u000A\u0022I read the code.\u0022 is a tweet posted by Mitchell Hashimoto, the creator of Ghostty and co-founder of HashiCorp. It started a debate over the internet about whether people should read the slop generated by AI coding agents or not.\u000A\u000AFirst of all, I\u0027m not going to address the dumb \u0022AI as a compiler\u0022 take. The only thing you get out of this argument is knowing the person saying it doesn\u0027t know shit about compilers or LLMs. If you\u0027re willing to spread shitty arguments without understanding the technology, get the fuck out of tech and find something you\u0027re actually willing to learn.\u000A\u000A## When AI works without reading\u000A\u000AYou have a trivial app you use for yourself a couple times and you don\u0027t care how it works. You\u0027re not going to maintain or scale it. Here the AI is perfect. It just gives you what you want in very little time. Big win.\u000A\u000A## The zero-dependency trap\u000A\u000ASo I\u0027ve been thinking a lot about the role of AI in programming, and there are a lot of ideas. But here\u0027s an interesting hypothesis. Say we use AI coding agents to make our code zero-dependency. Sounds nice, huh? The AI builds you the helpers or the low-level stuff you don\u0027t understand and exposes a simple API. It\u0027s like importing a third-party library without actually adding a dependency. And zero-dependency code is great, right? It lets you work on projects out of your league right now. But in fact it\u0027s very bad. Using a third-party library is actually better than going zero-dep. What? How? I\u0027ll tell you.\u000A\u000AWe don\u0027t really think about this when we use a third-party dependency, but when we do, we\u0027re implicitly trusting the maintainers to keep it working with good performance. You don\u0027t need to care about the library. It\u0027s all trust.\u000A\u000AWith AI-generated code, the code is sitting in your codebase, which makes it officially your problem — not someone else\u0027s. So now you\u0027re implicitly trusting the AI agent to maintain this code and meet your application\u0027s functional and non-functional requirements. That\u0027s a real problem if you actually understand how AI works under the hood. And by now, it seems like the big majority are just pretending to know.\u000A\u000A## The 500K lines scenario\u000A\u000AHumans have been generating slop for decades. We write bad code with massive technical debt and abstractions that kill performance. So why is AI much different? Let me paint a scenario. You had AI author a non-trivial piece of software (I\u0027m too lazy to think of a specific example). You don\u0027t review any of it. You let the AI do whatever it wants. Now it\u0027s generated a 500K+ line codebase. Congrats, your code has users. Bug reports start coming in. Feature requests pile up. Maybe it\u0027s a SaaS and you need to scale. In this scenario you\u0027re completely fucked. Here\u0027s why.\u000A\u000ALet\u0027s start with what we can measure. Our biggest AI models have around 1M tokens of context window. Solid, right? But in our scenario you have 500K+ lines of code you know nothing about. You have a logical bug and you need to fix it. How? You go to an LLM, tell it \u0022solve this bug plsss.\u0022 It loads the whole codebase and burns through the entire context window looking for candidates in the over-engineered mess it created. It tries to debug. It fails — because it just exhausted most of its context tokens. 1M tokens is roughly 750K words depending on the tokenizer. It\u0027s trying to fit the codebase plus all its thinking into that. And yeah, I know you can use `AGENT.md`, `CLAUDE.md`, all those markdown files you read about on LinkedIn. The codebase is still too large.\u000A\u000AYou\u0027ll tell me: hahaha, you\u0027re dumb, \u0022solve this bug plsss.\u0022 is a stupid prompt, I can write a better one. And I\u0027ll tell you that as humans we also have context windows. AI mimics our intelligence. In this scenario you don\u0027t know shit about the codebase. You don\u0027t know how it\u0027s organized, where the code lives, how any of the logic works. You have zero context about the problem. And it\u0027s simple: if you don\u0027t understand the problem, you can\u0027t solve it. Just like that.\u000A\u000ANow if you were actually reading the code the AI generates, you\u0027d know where the bug likely is. You do some simple debugging, feed the LLM the relevant places, give it the debugging session results, and tell it the expected behaviour. It solves the problem with way fewer tokens. That means more money saved. If it solves your problem but costs way more than it should, that\u0027s not good after all.\u000A\u000A---\u000A\u000A## So will AI get better?\u000A\u000ALet\u0027s talk about if AI is actually going to get better — good enough that reading doesn\u0027t matter.\u000A\u000AFirst, the cost. You\u0027ll say: it solves everything, it\u0027ll get cheaper like all technology, right? I don\u0027t think AI is getting cheaper. Not with the current market conditions. Anthropic and OpenAI are consistently losing money because they underprice their model serving. Which means it should actually get more expensive. You\u0027ll say: but China\u0027s models are great. And I agree — long live open-source. But that doesn\u0027t really solve the problem. It\u0027s cheap now, but it\u0027s not going to get cheaper. It will only get more expensive. With each new SOTA, the param count grows. Kimi k2 just dropped with 2.8 TRILLION params. Insane.\u000A\u000AAnd these massive models don\u0027t just cost more in API tokens — they need more expensive hardware to run at all. More params means you need GPUs with way more VRAM, which cost a fortune and draw insane amounts of power. Running inference on a 2.8T param model is incredibly inefficient compared to a smaller, fine-tuned model that could do the same job. So even if the API is cheap today, the underlying economics make no sense at scale.\u000A\u000AAnd here is the thing: the companies building these models don\u0027t really have an incentive to make the AI generate less code. Less code means less tokens, and less tokens means less money. They are not going to optimize for conciseness when their business model is selling you tokens. So you\u0027re stuck paying for bloated, over-engineered solutions.\u000A\u000ASecond, the quality problem. AI is still generating over-engineered code with bad abstractions and patterns. You will find yourself in a codebase that could have been much smaller, more elegant. And it\u0027s not the LLMs\u0027 fault. They\u0027re trained on human code, and we generate bad code by definition. Good design isn\u0027t objective — you can\u0027t enforce it with a deterministic feedback loop. There\u0027s no reward signal for clean architecture.\u000A\u000AAnd the most active direction in AI research is architectural hacks to increase params and context window — not better foundational models that could actually change how language generation works. I\u0027m a huge believer in the world model architecture Yann LeCun introduced. But we still don\u0027t have evidence it will deliver here.\u000A\u000AThis should make it obvious. AI will let you down at some point. And at that moment, you\u0027ll have to figure it out yourself.\u000A\u000A## Your own slop is better than AI slop\u000A\u000AAt this point you don\u0027t have a fucking clue how anything works. So the velocity you gained getting to market? It essentially backfires. The time you saved? You\u0027re paying it back to refactor and understand the project.\u000A\u000ASo if I\u0027m a bad programmer who writes slop, at least it\u0027s my own slop. I understand it. I can operate within it. (If you\u0027re a web developer who uses TypeScript, you don\u0027t have the right to call anyone\u0027s code slop tbh.)';
var $author$project$Content$Posts$saasPost = '# What I Learnt Building a SaaS (And Why the Startup Scene is Cancer)\u000A\u000AFor the past few months, I\u0027ve been building a SaaS project with some college mates. To be completely honest, I\u0027ve always found the modern SaaS scene incredibly stupid. Most projects look like absolute garbage to me—glorified AI wrappers attempting to solve problems that don\u0027t exist. Why would anyone need an \u0022AI Alarm Clock\u0022? Human beings are born with a free piece of technology called a biological clock. But hey, maybe the flagship humans are out of production, and the new economical models don\u0027t come with that feature built-in. Who am I to judge?\u000A\u000AActually, I will judge. The entire startup ecosystem is a disease. It\u0027s a playground where marketing, hype, and VC-pleasing buzzwords weigh infinitely more than the actual value or engineering quality of the solution. It\u0027s the natural result of late-stage capitalism: a system that doesn\u0027t care about creating things that are useful or elegant, but instead incentivizes grifters to build bloated, useless tools just to extract subscription fees.\u000A\u000AThis is the story of how we took a failed, hype-driven hackathon project, stripped away the AI bullshit, and built a real-time API security platform called Argos—along with what I learnt about code, useless people, and why the tech industry is broken.\u000A\u000A---\u000A\u000A## 1. The Hackathon Genesis: An AI SIEM Mirage\u000A\u000AThe journey started five months ago at a college hackathon. A teammate opened his phone, prompted ChatGPT (or Gemini, I can\u0027t remember), and immediately declared that our project would be a shiny \u0022AI SIEM Solution.\u0022 I\u0027ve always found conventional security analytics incredibly boring, but as the lead for Machine Learning and Backend Engineering, I had to look into how SIEMs actually function under the hood.\u000A\u000AI quickly realized we needed to pivot. Instead of post-incident log analysis (SIEM)—which is just looking at the ashes of your server after it already burned down—we needed real-time protection at the application layer. An inline API security solution.\u000A\u000ABecause of extreme time constraints—and the fact that I hadn\u0027t slept for three days straight—I wrote some of the worst code of my life. The initial architecture was an absolute disaster:\u000A\u000A```\u000A+------------------+      Unstructured JSON      +----------------------+\u000A| Inbound HTTP Req | --------------------------> |   Naive LLM Prompt   |\u000A+------------------+                             +----------------------+\u000A                                                            |\u000A                                                            v\u000A+------------------+       Massive Latency       +----------------------+\u000A|  Blocked / Pass  | <-------------------------- |  \u0022Retarded\u0022 SOC Bot  |\u000A+------------------+                             +----------------------+\u000A```\u000A\u000AThe pipeline took a raw JSON request, passed it wholesale to a massive LLM with a flimsy prompt, and asked it to act like a tier-one SOC analyst. No schema constraints, no input validation, and zero deterministic parsing. It was slow as hell, expensive as fuck, and completely impractical for real-world production traffic. It was the perfect representation of modern \u0022AI engineering\u0022—retarded, bloated, and useless.\u000A\u000AWhile waiting for the judges to inevitably smoke us during presentation day, the practical solution hit me. I thought about Stripe. They don\u0027t make you reroute your whole network through a slow proxy; they provide lightweight, native SDKs that drop right into your backend code to handle the heavy lifting.\u000A\u000A---\u000A\u000A## 2. The Architecture Shift: Go Backend & Decoupled SDKs\u000A\u000AWe got cooked at the hackathon, but the technical challenge stuck with me. Even though the business side of SaaS makes me sick, I thought building the actual engine would be a fun engineering exercise.\u000A\u000AI chose Go for the backend engine. I\u0027ve never been a pure backend engineer—building CRUD APIs doesn\u0027t give me the same rush as writing compilers, operating systems, or low-level systems infrastructure—but the team dynamics forced my hand. Out of a five-person team, only my close friend and I were actual builders. The other three were non-contributing passengers who did absolutely nothing but talk, show up to meetings, and repeat corporate jargon they probably read on LinkedIn.\u000A\u000ATo make the platform a reality without losing my mind, we had to build fast and bypass the dead weight.\u000A\u000AOur core architectural blueprint decoupled the application runtime from the detection cluster using language-specific middlewares (SDKs):\u000A\u000A```\u000A   User Request\u000A        |\u000A        v\u000A+---------------------------------------+\u000A| Your Web App Runtime (Node/Python/Go) |\u000A|                                       |\u000A|  +---------------------------------+  |\u000A|  |     Argos Middleware / SDK      |  |\u000A|  +---------------------------------+  |\u000A+---------------------------------------+\u000A        |\u000A        | Asynchronous / Synchronous Channel\u000A        v\u000A+---------------------------------------+\u000A|       Argos Go Detection Engine       |\u000A|                                       |\u000A|  [Regex] -> [Statistical] -> [ML/DL]  |\u000A+---------------------------------------+\u000A```\u000A\u000ATo standardize behavioral tracking and model training, we normalized all incoming HTTP metadata into a strictly typed, unified exchange format. Here is a conceptual look at how our lightweight SDK middleware intercepts, extracts, and dispatches payload telemetry without blocking the hot-path:\u000A\u000A```go\u000Apackage argos\u000A\u000Aimport (\u000A	\u0022bytes\u0022\u000A	\u0022io\u0022\u000A	\u0022net/netip\u0022\u000A	\u0022net/http\u0022\u000A	\u0022time\u0022\u000A)\u000A\u000Atype TelemetryPayload struct {\u000A	Method    string            `json:\u0022method\u0022`\u000A	Path      string            `json:\u0022path\u0022`\u000A	Headers   map[string]string `json:\u0022headers\u0022`\u000A	Body      string            `json:\u0022body\u0022`\u000A	RemoteIP  string            `json:\u0022remote_ip\u0022`\u000A	Timestamp int64             `json:\u0022timestamp\u0022`\u000A}\u000A\u000Afunc ArgosMiddleware(client *ArgosClusterClient) func(http.Handler) http.Handler {\u000A	return func(next http.Handler) http.Handler {\u000A		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {\u000A			var bodyBytes []byte\u000A			if r.Body != nil {\u000A				bodyBytes, _ = io.ReadAll(r.Body)\u000A				r.Body = io.NopCloser(bytes.NewBuffer(bodyBytes))\u000A			}\u000A\u000A			payload := TelemetryPayload{\u000A				Method:    r.Method,\u000A				Path:      r.URL.Path,\u000A				Headers:   extractHeaders(r.Header),\u000A				Body:      string(bodyBytes),\u000A				RemoteIP:  r.RemoteAddr,\u000A				Timestamp: time.Now().UnixNano(),\u000A			}\u000A\u000A			// Run in a goroutine to avoid blocking the main request thread\u000A			go client.Analyze(payload)\u000A\u000A			next.ServeHTTP(w, r)\u000A		})\u000A	}\u000A}\u000A```\u000A\u000A---\u000A\u000A## 3. Optimizing the Pipeline: Mechanical Pentesting\u000A\u000ADuring my university final exams, I needed a productive way to procrastinate. Instead of studying legacy rendering hooks for my Computer Graphics course, I started learning web application penetration testing.\u000A\u000AI quickly realized something critical: Web pentesting is deeply mechanical. When an attacker or an automated scanner maps an API, they systematically spray known, highly predictable structural patterns against your endpoints to check for vulnerabilities (SQLi, XSS, Path Traversal).\u000A\u000AIf you can catch those mechanical trials on the ultra-fast hot path using a strict cascade of deterministic filters, you don\u0027t need a heavy deep learning model or a slow LLM for standard exploitation attempts.\u000A\u000A### The Multi-Tier Inspection Stack\u000A\u000AWe threw the single, slow LLM bottleneck in the trash and built a multi-tier pipeline:\u000A\u000A1. **Deterministic Filter (Regex & Tokenizer)**: Instantly drops obvious, raw signatures (e.g., `\u0027 OR 1=1 --`, `<script>`).\u000A2. **Statistical Analyzer**: Evaluates entropy variations, character distribution shifts, and structural anomalies in the payload lengths.\u000A3. **Machine Learning / Deep Learning Module**: Processes deep contextual threats only when the first two layers raise suspicion flags.\u000A\u000A```\u000AIncoming Payload\u000A      |\u000A      v\u000A  +----------------------------------+\u000A  | Tier 1: Deterministic Regex/Tok  | ---> [Signature Match] -> Immediate IP Block\u000A  +----------------------------------+\u000A      | Clean\u000A      v\u000A  +----------------------------------+\u000A  | Tier 2: Statistical Entropy      | ---> [Anomalous Deviation] -> Trigger ML/DL\u000A  +----------------------------------+\u000A      | Clean\u000A      v\u000A  +----------------------------------+\u000A  | Tier 3: Contextual ML/DL Models  | ---> [Malicious Intent] -> Action & Flag\u000A  +----------------------------------+\u000A```\u000A\u000ABy instantly dropping an automated firewall block on the attacker\u0027s IP the moment a mechanical signature is hit, we break the attacker\u0027s feedback loop. If a malicious actor has to rotate their proxy or IP address after every single exploit variation, the cost of attack skyrockets, and they move on.\u000A\u000A---\u000A\u000A## 4. What I Learnt (The Hard Way)\u000A\u000A**Capitalism is the Cancer of Software**:\u000AAs a developer, I love pure engineering, solving complex algorithmic bottlenecks, and writing clean, minimal code. But in our capitalistic society, none of that matters. Capitalism does not reward good engineering; it rewards marketing grift. A bulletproof software engine is useless in the market if you cannot write slick copy, buy ads, and convince corporate managers to buy it. This is why I absolutely despise the startup scene. It forces talented builders to stop building and start selling, converting engineering passion into corporate marketing noise.\u000A\u000A**Most People Just Want a Free Ride**:\u000AYou will quickly learn that most people suck. In group projects, hackathons, and startups, you will always find passengers—people who want the title, the equity, and the glory, but won\u0027t write a single line of code. They will spend hours talking about \u0022strategy\u0022 and \u0022positioning\u0022 to cover up the fact that they have zero technical skills. Build exclusively with active creators, protect your peace, and kick the dead weight out early. As Drake put it in *Fair Trade*:\u000A\u000A> \u0022I\u0027ve been losing friends and finding peace, honestly that sounds like a fair trade to me.\u0022\u000A\u000A**Backend is Fine, but It\u0027s Not Compilers**:\u000AGo is a highly concurrent, practical language for processing request streams, but backend development still lacks the intellectual beauty of compiler design or low-level systems. At the end of the day, building a SaaS often feels like assembling pre-existing puzzle pieces. But if you have to do it, at least do it without the typical corporate bloat.\u000A\u000A---\u000A\u000A## The Reality of the Roadmap\u000A\u000AThe platform is live at [argossecops.com](https://argossecops.com). We are using an open-core model, keeping our core high-concurrency detection engine proprietary while open-sourcing our client SDKs.\u000A\u000AIs it a revolutionary breakthrough in computer science? No. At its core, it\u0027s just a fast, clean, multi-tiered firewall and detection system. But unlike the bloated, VC-backed \u0022AI security\u0022 garbage polluting the internet today, it actually works, it doesn\u0027t kill your request latency, and it doesn\u0027t feed your sensitive data to OpenAI.\u000A\u000AIf you\u0027re a developer who cares about performance and wants to secure your APIs without adopting 200MB of dependencies and a slow AI proxy, check it out. Or don\u0027t. At least the code is clean.';
var $author$project$Content$Posts$zigPost = '# Why I fell in love with Zig\u000A\u000AOver the last couple of weeks, I set out to learn Zig. I went into it assuming it would be just another bloated piece of software weighed down by too many layers of abstraction—the kind that makes a language more complex instead of making development easier.\u000A\u000AThe last language that gave me that headache was Rust. Don\u0027t get me wrong, Rust\u0027s ownership model for managing memory is clever. But for me, it\u0027s just not worth dealing with all the unnecessary complexity Rust forces on you while you work. To put it simply: Rust is just not fun to write or read.\u000A\u000ASome people will claim Rust is more fun than a language like Go because Go is \u0022too repetitive\u0022, or something like that, and my only response to that is: \u0022go work on real problems, bro.\u0022 as the fun, creative thinking should be spent solving the actual problem at hand—not fighting the language\u0027s syntax or trying to figure out which hyper-abstract concept you need to implement basic logic.\u000A\u000ASo, what makes Zig so great, besides its simplicity?\u000A\u000A---\u000A\u000A## comptime\u000A\u000A`comptime` is absolutely incredible. It is a massive upgrade over C/C++ macros and Rust\u0027s `proc_macro`. It is so intuitive and easy to use because it flows naturally with the rest of the program.\u000A\u000A### C Approach: Preprocessor Magic\u000A```c\u000A#include <stdio.h>\u000A#include <stdbool.h>\u000A\u000A// The \u0022Macro Template\u0022\u000A#define DECLARE_STACK(Type, Name, Capacity) \u005C\u005C\u000A    typedef struct { \u005C\u005C\u000A        Type data[Capacity]; \u005C\u005C\u000A        size_t top; \u005C\u005C\u000A    } Name; \u005C\u005C\u000A    \u005C\u005C\u000A    static inline void Name##_push(Name* s, Type item) { \u005C\u005C\u000A        if (s->top < Capacity) { \u005C\u005C\u000A            s->data[s->top++] = item; \u005C\u005C\u000A        } \u005C\u005C\u000A    } \u005C\u005C\u000A    \u005C\u005C\u000A    static inline Type Name##_pop(Name* s) { \u005C\u005C\u000A        return s->data[--s->top]; \u005C\u005C\u000A    }\u000A\u000A// Generating a specific type: IntStack\u000ADECLARE_STACK(int, IntStack, 10)\u000A\u000Aint main() {\u000A    IntStack stack = { .top = 0 };\u000A    IntStack_push(&stack, 42);\u000A    printf(\u0022%d\u005Cn\u0022, IntStack_pop(&stack));\u000A    return 0;\u000A}\u000A```\u000A\u000A### Rust Approach: Procedural Macros\u000A```rust\u000Aextern crate proc_macro;\u000Ause proc_macro::TokenStream;\u000Ause quote::quote;\u000Ause syn::{parse_macro_input, Expr, Type, parse::Parse, parse::ParseStream, Token};\u000A\u000A// A custom parser struct to handle: Stack!(i32, 10)\u000Astruct StackArgs {\u000A    ty: Type,\u000A    _comma: Token![,],\u000A    cap: Expr,\u000A}\u000A\u000Aimpl Parse for StackArgs {\u000A    fn parse(input: ParseStream) -> syn::Result<Self> {\u000A        Ok(StackArgs {\u000A            ty: input.parse()?,\u000A            _comma: input.parse()?,\u000A            cap: input.parse()?,\u000A        })\u000A    }\u000A}\u000A\u000A#[proc_macro]\u000Apub fn make_stack(input: TokenStream) -> TokenStream {\u000A    let StackArgs { ty, cap, .. } = parse_macro_input!(input as StackArgs);\u000A\u000A    let expanded = quote! {\u000A        struct Stack {\u000A            data: [#ty; #cap],\u000A            top: usize,\u000A        }\u000A\u000A        impl Stack {\u000A            fn new() -> Self { Self { data: [0; #cap], top: 0 } } // Simplification\u000A            fn push(&mut self, item: #ty) {\u000A                if self.top < #cap {\u000A                    self.data[self.top] = item;\u000A                    self.top += 1;\u000A                }\u000A            }\u000A            fn pop(&mut self) -> #ty {\u000A                self.top -= 1;\u000A                self.data[self.top]\u000A            }\u000A        }\u000A    };\u000A    TokenStream::from(expanded)\u000A}\u000A\u000A// Generates the struct and implementation at compile time\u000Amake_stack!(i32, 10); \u000A\u000Afn main() {\u000A    let mut s = Stack::new();\u000A    s.push(100);\u000A    println!(\u0022{}\u0022, s.pop());\u000A}\u000A```\u000A\u000A### Zig Approach: comptime\u000A```zig\u000Aconst std = @import(\u0022std\u0022);\u000A\u000A// Just a normal function, but it returns a `type` \u000A// and takes compile-time arguments.\u000Afn Stack(comptime T: type, comptime capacity: usize) type {\u000A    return struct {\u000A        data: [capacity]T = undefined,\u000A        top: usize = 0,\u000A\u000A        const Self = @this();\u000A\u000A        pub fn push(self: *Self, item: T) void {\u000A            if (self.top < capacity) {\u000A                self.data[self.top] = item;\u000A                self.top += 1;\u000A            }\u000A        }\u000A\u000A        pub fn pop(self: *Self) T {\u000A            self.top -= 1;\u000A            return self.data[self.top];\u000A        }\u000A    };\u000A}\u000A\u000Apub fn main() !void {\u000A    // Instantiating the type naturally\u000A    var my_stack = Stack(i32, 10){};\u000A    \u000A    my_stack.push(1337);\u000A    std.debug.print(\u0022{d}\u005Cn\u0022, .{my_stack.pop()});\u000A}\u000A```\u000A\u000AIf you have any taste for programming, you can clearly see that the `comptime` solution is miles ahead in terms of elegance.\u000A\u000A---\u000A\u000A## How Zig Proved That Adding More Abstractions Isn\u0027t the Answer\u000A\u000AIt is fascinating to me how Rust and C++ tried to \u0022fix\u0022 C by stacking layers of abstraction on top of it, only to end up being bloated, complicated, and a chore to read and write. Meanwhile, Zig took a different path: it removed some of the few implicit abstractions C actually has (like hidden memory allocations and magic I/O), giving us a language that is both incredibly simple and fun to work with.\u000A\u000ABy now, it\u0027s probably obvious that I\u0027m a massive fan of having no hidden allocations, no hidden control flow, and no preprocessor magic. This philosophy makes your code predictable and debugging infinitely easier.\u000A\u000A### Explicit Memory Allocation\u000A\u000A```zig\u000Aconst std = @import(\u0022std\u0022);\u000A\u000Apub fn main() !void {\u000A    // 1. Explicit Memory Strategy\u000A    // We explicitly choose a General Purpose Allocator. The runtime does not hide this.\u000A    var gpa = std.heap.GeneralPurposeAllocator(.{}){};\u000A    defer _ = gpa.deinit(); // Enforce leak checking at scope exit\u000A    const allocator = gpa.allocator();\u000A\u000A    // 2. Explicit Dependency Injection\u000A    // The ArrayList cannot exist in a vacuum; it *must* hold a reference to our allocator.\u000A    var list = std.ArrayList(i32).init(allocator);\u000A    defer list.deinit(); // Explicit cleanup\u000A\u000A    // 3. Explicit Control Flow and Error Handling\u000A    // Appending can fail if the system runs out of memory. \u000A    // Zig forces you to acknowledge this with the `try` keyword. \u000A    // There are no invisible exceptions—it explicitly bubbles up the call stack.\u000A    try list.append(42);\u000A    try list.append(1337);\u000A\u000A    std.debug.print(\u0022Elements: {any}\u005Cn\u0022, .{list.items});\u000A}\u000A```\u000A\u000ADefining your allocation strategy explicitly makes managing memory straightforward, and the `defer` keyword keeps cleanup simple and clean.\u000A\u000A---\u000A\u000A### Explicit I/O Subsystem\u000A\u000A```zig\u000Aconst std = @import(\u0022std\u0022);\u000A\u000Apub fn main() !void {\u000A    // 1. Explicitly acquire a handle to Standard Output\u000A    // This doesn\u0027t happen automatically; you must ask the OS subsystem for it.\u000A    const stdout_file = std.io.getStdOut();\u000A    \u000A    // 2. Initialize a buffered Writer stream\u000A    // Zig separates the raw file descriptor from the stream interface.\u000A    // If you want buffering to prevent frequent system calls, you wrap it explicitly.\u000A    var bw = std.io.bufferedWriter(stdout_file.writer());\u000A    const stdout = bw.writer();\u000A\u000A    // 3. Perform the I/O operation\u000A    // Because I/O can always fail (e.g., broken pipe, disk full), \u000A    // the compiler forces you to handle the error with \u0027try\u0027.\u000A    try stdout.print(\u0022Hello, {s}!\u005Cn\u0022, .{\u0022systems engineering\u0022});\u000A\u000A    // 4. Explicitly flush the buffer to the OS\u000A    // With buffered I/O, you control exactly when the syscall happens.\u000A    try bw.flush(); \u000A}\u000A```\u000A\u000AThe code above is essentially how you write a production-grade `printf` in Zig. You might look at this and think it\u0027s tedious boilerplate. You might even be right. But I think it\u0027s beautiful.\u000A\u000AWhat it actually does is force you to initialize your I/O devices with explicit implementation details. You get absolute control over your code. If you think that\u0027s \u0022too much control,\u0022 then go back to doing web development at some bloated startup, selling over-engineered solutions to non-existent problems using 100K lines of boilerplate for basic CRUD apps.\u000A\u000A### How `std.io` Actually Works Under the Hood (Peak Comptime)\u000A\u000AIf you look at how other languages handle I/O, they usually rely on virtual tables (vtables) or interface types for dynamic dispatch. Rust has `std::io::Write` trait objects; Go has `io.Writer` interfaces. This works, but it adds runtime overhead.\u000A\u000AZig doesn\u0027t do dynamic dispatch here. Instead, it uses `comptime` duck typing to construct writers and readers on the fly.\u000A\u000AIn the standard library, `std.io.Writer` is just a function that returns a type:\u000A\u000A```zig\u000Apub fn Writer(\u000A    comptime Context: type,\u000A    comptime Error: type,\u000A    comptime writeFn: fn (context: Context, bytes: []const u8) Error!usize,\u000A) type {\u000A    return struct {\u000A        context: Context,\u000A        pub const ErrorSet = Error;\u000A        const Self = @this();\u000A\u000A        pub fn write(self: Self, bytes: []const u8) Error!usize {\u000A            return writeFn(self.context, bytes);\u000A        }\u000A        \u000A        // ... provides helper methods like print(), writeAll(), writeByte() at compile-time\u000A    };\u000A}\u000A```\u000A\u000AThis is insanely powerful. Any struct that implements a `write` function can be instantly wrapped into a full-featured `Writer` at compile time. No vtables, no interfaces, and zero virtual call overhead. The compiler resolves it all down to direct function calls.\u000A\u000AFor a project like `glu`—where I\u0027m building a lightweight robotics communication framework to replace the bloated monster that is ROS2—this is a lifesaver. When publishing telemetry or serializing command payloads over TCP/UDP sockets or serial lines, I can wrap raw handles in custom writers without paying any abstraction tax. Every single byte goes exactly where it needs to, precisely when it needs to, with absolute predictability.\u000A\u000A---\u000A\u000A## Build Systems: What Got Me Into Zig in the First Place\u000A\u000AThis is the main reason I got into Zig. I love C, but its build system options are enough to drive anyone crazy. You are stuck wrestling with CMake or Makefiles, and you have to manually install, build, and link your third-party dependencies. (Though to be honest, a big reason I got decent at programming was because I used to build C projects with zero external dependencies out of sheer laziness to avoid the linking nightmare).\u000A\u000ABut when you want to build actual, real-world systems, you need a solid build system. Zig gives you that—and it doubles as an amazing build system for C and C++ projects too.\u000A\u000AWhile I haven\u0027t used the full C/C++ build system integration yet, importing libraries like `cuda` and `vulkan` into Zig was incredibly smooth. And for my latest project, `glu`, exporting my Zig API functions and types back into C has been a flawless experience.\u000A\u000A---\u000A\u000A## Zig is Not Perfect\u000A\u000AI\u0027ve spent this entire post trying to convince you why Zig is great and why you should use it. But it is not perfect. Nothing is.\u000A\u000AFor one, I\u0027m definitely not a Zig expert yet, so I\u0027m still discovering its rough edges. But the most obvious challenge right now is that Zig has not reached `v1.0.0`. With every new release, parts of the standard library API are broken or deprecated. It\u0027s a backward-compatibility nightmare. You might pull in a third-party package only for it to fail to compile because the library was written for Zig `v0.15.0` and you\u0027re using `v0.16.0`.\u000A\u000AOn top of that, the community is still relatively small. They are brilliant and incredibly helpful people, but it\u0027s a small crowd nonetheless.\u000A\u000A---\u000A\u000A## Will I Use Zig for Large Projects?\u000A\u000AAbsolutely. I am currently building a robotics communication framework called `glu` from scratch. The goal is to make it a lightweight, high-performance alternative to ROS2—a framework that is widely disliked by indie developers and frustrating for labs that need maximum performance without the ROS2 bloat.\u000A\u000AI\u0027m writing `glu` entirely in Zig. Will the backward-compatibility breaks bite me in the ass? Probably. But the language is so good that it\u0027s a risk I\u0027m more than willing to take. I want `glu` to be a rock-solid, reliable system for real production work.\u000A\u000A---\u000A\u000A## A Final Note on AI and Zig\u000A\u000ABecause Zig is a younger language and still changes rapidly, LLMs struggle with it. LLMs are essentially advanced copycats, and since there aren\u0027t millions of Zig repositories to copy from yet, they often write broken code.\u000A\u000ABut if you want to learn a systems language like Zig, you should have the passion to write most of the heavy-lifting logic yourself anyway. Use the AI to spit out the boring boilerplate, and write the real code on your own.';
var $author$project$Content$Posts$posts = _List_fromArray(
	[
		{
		a$: $author$project$Content$Posts$readCodePost,
		a1: '“I read the code” is the highest-signal advice in software. A protocol for reading source like an engineer instead of a tourist.',
		bg: 1,
		an: '2026-07-21-i-read-code',
		M: 'complete',
		aS: _List_fromArray(
			['craft', 'reading-code']),
		aT: 'I read the code.'
	},
		{
		a$: $author$project$Content$Posts$plastPost,
		a1: 'Treating the training stack as a black box stopped being fun. Notes from rebuilding a deep learning engine from autograd up.',
		bg: 2,
		an: '2026-07-18-redesigning-plast',
		M: 'complete',
		aS: _List_fromArray(
			['plast', 'deep-learning', 'cuda']),
		aT: 'Re-designing Plast for a more elegant solution'
	},
		{
		a$: $author$project$Content$Posts$zigPost,
		a1: 'Comptime, no hidden control flow, errors as values — notes on why Zig feels like the first language that respects the programmer since C.',
		bg: 3,
		an: '2026-07-09-zig',
		M: 'complete',
		aS: _List_fromArray(
			['zig', 'systems', 'languages']),
		aT: 'Why I fell in love with Zig'
	},
		{
		a$: $author$project$Content$Posts$saasPost,
		a1: 'Five months inside a startup taught me what the ecosystem actually optimizes for. Field notes from stripping an AI-SIEM hackathon demo down into a real engine.',
		bg: 4,
		an: '2026-06-20-what-I-have-learnt-building-a-SaaS-startup',
		M: 'complete',
		aS: _List_fromArray(
			['startups', 'systems', 'culture']),
		aT: 'What I Learnt Building a SaaS'
	}
	]);
var $elm$core$Maybe$withDefault = F2(
	function (_default, maybe) {
		if (!maybe.$) {
			var value = maybe.a;
			return value;
		} else {
			return _default;
		}
	});
var $author$project$Router$parseFragment = function (fragment) {
	var raw = function () {
		if (!fragment.$) {
			var f = fragment.a;
			return A2($elm$core$String$startsWith, '/', f) ? f : ('/' + f);
		} else {
			return '/';
		}
	}();
	var parts = A2(
		$elm$core$Maybe$withDefault,
		raw,
		$elm$core$List$head(
			A2($elm$core$String$split, '?', raw)));
	var _v0 = A2(
		$elm$core$List$filter,
		function (p) {
			return p !== '';
		},
		A2($elm$core$String$split, '/', parts));
	_v0$7:
	while (true) {
		if (!_v0.b) {
			return $author$project$Router$Home;
		} else {
			if (_v0.b.b) {
				if ((_v0.a === 'writing') && (!_v0.b.b.b)) {
					var _v1 = _v0.b;
					var slug = _v1.a;
					return A2(
						$elm$core$List$any,
						function (p) {
							return _Utils_eq(p.an, slug);
						},
						$author$project$Content$Posts$posts) ? $author$project$Router$Post(slug) : $author$project$Router$NotFound('/writing/' + slug);
				} else {
					break _v0$7;
				}
			} else {
				switch (_v0.a) {
					case 'writing':
						return $author$project$Router$Writing;
					case 'projects':
						return $author$project$Router$Projects;
					case 'research':
						return $author$project$Router$Research;
					case 'about':
						return $author$project$Router$About;
					case 'home':
						return $author$project$Router$Home;
					default:
						break _v0$7;
				}
			}
		}
	}
	return $author$project$Router$NotFound(raw);
};
var $author$project$Router$parse = function (url) {
	return $author$project$Router$parseFragment(url.a6);
};
var $author$project$Main$requestedPathOf = F2(
	function (url, route) {
		if (route.$ === 6) {
			var path = route.a;
			return A2($elm$core$String$startsWith, '/', path) ? path : ('/' + path);
		} else {
			return '/' + A2($elm$core$Maybe$withDefault, '', url.a6);
		}
	});
var $author$project$Main$init = F3(
	function (_v0, url, key) {
		var route = $author$project$Router$parse(url);
		return _Utils_Tuple2(
			{
				K: false,
				bc: key,
				G: 0,
				bf: $elm$time$Time$millisToPosix(0),
				r: false,
				v: false,
				bs: '',
				U: A2($author$project$Main$requestedPathOf, url, route),
				bv: route,
				bw: 0
			},
			$elm$core$Platform$Cmd$none);
	});
var $author$project$Main$GlobalKey = function (a) {
	return {$: 4, a: a};
};
var $author$project$Main$Tick = function (a) {
	return {$: 3, a: a};
};
var $elm$core$Platform$Sub$batch = _Platform_batch;
var $elm$time$Time$Every = F2(
	function (a, b) {
		return {$: 0, a: a, b: b};
	});
var $elm$time$Time$State = F2(
	function (taggers, processes) {
		return {aK: processes, aR: taggers};
	});
var $elm$core$Dict$RBEmpty_elm_builtin = {$: -2};
var $elm$core$Dict$empty = $elm$core$Dict$RBEmpty_elm_builtin;
var $elm$time$Time$init = $elm$core$Task$succeed(
	A2($elm$time$Time$State, $elm$core$Dict$empty, $elm$core$Dict$empty));
var $elm$core$Basics$compare = _Utils_compare;
var $elm$core$Dict$get = F2(
	function (targetKey, dict) {
		get:
		while (true) {
			if (dict.$ === -2) {
				return $elm$core$Maybe$Nothing;
			} else {
				var key = dict.b;
				var value = dict.c;
				var left = dict.d;
				var right = dict.e;
				var _v1 = A2($elm$core$Basics$compare, targetKey, key);
				switch (_v1) {
					case 0:
						var $temp$targetKey = targetKey,
							$temp$dict = left;
						targetKey = $temp$targetKey;
						dict = $temp$dict;
						continue get;
					case 1:
						return $elm$core$Maybe$Just(value);
					default:
						var $temp$targetKey = targetKey,
							$temp$dict = right;
						targetKey = $temp$targetKey;
						dict = $temp$dict;
						continue get;
				}
			}
		}
	});
var $elm$core$Dict$Black = 1;
var $elm$core$Dict$RBNode_elm_builtin = F5(
	function (a, b, c, d, e) {
		return {$: -1, a: a, b: b, c: c, d: d, e: e};
	});
var $elm$core$Dict$Red = 0;
var $elm$core$Dict$balance = F5(
	function (color, key, value, left, right) {
		if ((right.$ === -1) && (!right.a)) {
			var _v1 = right.a;
			var rK = right.b;
			var rV = right.c;
			var rLeft = right.d;
			var rRight = right.e;
			if ((left.$ === -1) && (!left.a)) {
				var _v3 = left.a;
				var lK = left.b;
				var lV = left.c;
				var lLeft = left.d;
				var lRight = left.e;
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					0,
					key,
					value,
					A5($elm$core$Dict$RBNode_elm_builtin, 1, lK, lV, lLeft, lRight),
					A5($elm$core$Dict$RBNode_elm_builtin, 1, rK, rV, rLeft, rRight));
			} else {
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					color,
					rK,
					rV,
					A5($elm$core$Dict$RBNode_elm_builtin, 0, key, value, left, rLeft),
					rRight);
			}
		} else {
			if ((((left.$ === -1) && (!left.a)) && (left.d.$ === -1)) && (!left.d.a)) {
				var _v5 = left.a;
				var lK = left.b;
				var lV = left.c;
				var _v6 = left.d;
				var _v7 = _v6.a;
				var llK = _v6.b;
				var llV = _v6.c;
				var llLeft = _v6.d;
				var llRight = _v6.e;
				var lRight = left.e;
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					0,
					lK,
					lV,
					A5($elm$core$Dict$RBNode_elm_builtin, 1, llK, llV, llLeft, llRight),
					A5($elm$core$Dict$RBNode_elm_builtin, 1, key, value, lRight, right));
			} else {
				return A5($elm$core$Dict$RBNode_elm_builtin, color, key, value, left, right);
			}
		}
	});
var $elm$core$Dict$insertHelp = F3(
	function (key, value, dict) {
		if (dict.$ === -2) {
			return A5($elm$core$Dict$RBNode_elm_builtin, 0, key, value, $elm$core$Dict$RBEmpty_elm_builtin, $elm$core$Dict$RBEmpty_elm_builtin);
		} else {
			var nColor = dict.a;
			var nKey = dict.b;
			var nValue = dict.c;
			var nLeft = dict.d;
			var nRight = dict.e;
			var _v1 = A2($elm$core$Basics$compare, key, nKey);
			switch (_v1) {
				case 0:
					return A5(
						$elm$core$Dict$balance,
						nColor,
						nKey,
						nValue,
						A3($elm$core$Dict$insertHelp, key, value, nLeft),
						nRight);
				case 1:
					return A5($elm$core$Dict$RBNode_elm_builtin, nColor, nKey, value, nLeft, nRight);
				default:
					return A5(
						$elm$core$Dict$balance,
						nColor,
						nKey,
						nValue,
						nLeft,
						A3($elm$core$Dict$insertHelp, key, value, nRight));
			}
		}
	});
var $elm$core$Dict$insert = F3(
	function (key, value, dict) {
		var _v0 = A3($elm$core$Dict$insertHelp, key, value, dict);
		if ((_v0.$ === -1) && (!_v0.a)) {
			var _v1 = _v0.a;
			var k = _v0.b;
			var v = _v0.c;
			var l = _v0.d;
			var r = _v0.e;
			return A5($elm$core$Dict$RBNode_elm_builtin, 1, k, v, l, r);
		} else {
			var x = _v0;
			return x;
		}
	});
var $elm$time$Time$addMySub = F2(
	function (_v0, state) {
		var interval = _v0.a;
		var tagger = _v0.b;
		var _v1 = A2($elm$core$Dict$get, interval, state);
		if (_v1.$ === 1) {
			return A3(
				$elm$core$Dict$insert,
				interval,
				_List_fromArray(
					[tagger]),
				state);
		} else {
			var taggers = _v1.a;
			return A3(
				$elm$core$Dict$insert,
				interval,
				A2($elm$core$List$cons, tagger, taggers),
				state);
		}
	});
var $elm$core$Process$kill = _Scheduler_kill;
var $elm$core$Dict$foldl = F3(
	function (func, acc, dict) {
		foldl:
		while (true) {
			if (dict.$ === -2) {
				return acc;
			} else {
				var key = dict.b;
				var value = dict.c;
				var left = dict.d;
				var right = dict.e;
				var $temp$func = func,
					$temp$acc = A3(
					func,
					key,
					value,
					A3($elm$core$Dict$foldl, func, acc, left)),
					$temp$dict = right;
				func = $temp$func;
				acc = $temp$acc;
				dict = $temp$dict;
				continue foldl;
			}
		}
	});
var $elm$core$Dict$merge = F6(
	function (leftStep, bothStep, rightStep, leftDict, rightDict, initialResult) {
		var stepState = F3(
			function (rKey, rValue, _v0) {
				stepState:
				while (true) {
					var list = _v0.a;
					var result = _v0.b;
					if (!list.b) {
						return _Utils_Tuple2(
							list,
							A3(rightStep, rKey, rValue, result));
					} else {
						var _v2 = list.a;
						var lKey = _v2.a;
						var lValue = _v2.b;
						var rest = list.b;
						if (_Utils_cmp(lKey, rKey) < 0) {
							var $temp$rKey = rKey,
								$temp$rValue = rValue,
								$temp$_v0 = _Utils_Tuple2(
								rest,
								A3(leftStep, lKey, lValue, result));
							rKey = $temp$rKey;
							rValue = $temp$rValue;
							_v0 = $temp$_v0;
							continue stepState;
						} else {
							if (_Utils_cmp(lKey, rKey) > 0) {
								return _Utils_Tuple2(
									list,
									A3(rightStep, rKey, rValue, result));
							} else {
								return _Utils_Tuple2(
									rest,
									A4(bothStep, lKey, lValue, rValue, result));
							}
						}
					}
				}
			});
		var _v3 = A3(
			$elm$core$Dict$foldl,
			stepState,
			_Utils_Tuple2(
				$elm$core$Dict$toList(leftDict),
				initialResult),
			rightDict);
		var leftovers = _v3.a;
		var intermediateResult = _v3.b;
		return A3(
			$elm$core$List$foldl,
			F2(
				function (_v4, result) {
					var k = _v4.a;
					var v = _v4.b;
					return A3(leftStep, k, v, result);
				}),
			intermediateResult,
			leftovers);
	});
var $elm$core$Platform$sendToSelf = _Platform_sendToSelf;
var $elm$time$Time$Name = function (a) {
	return {$: 0, a: a};
};
var $elm$time$Time$Offset = function (a) {
	return {$: 1, a: a};
};
var $elm$time$Time$Zone = F2(
	function (a, b) {
		return {$: 0, a: a, b: b};
	});
var $elm$time$Time$customZone = $elm$time$Time$Zone;
var $elm$time$Time$setInterval = _Time_setInterval;
var $elm$core$Process$spawn = _Scheduler_spawn;
var $elm$time$Time$spawnHelp = F3(
	function (router, intervals, processes) {
		if (!intervals.b) {
			return $elm$core$Task$succeed(processes);
		} else {
			var interval = intervals.a;
			var rest = intervals.b;
			var spawnTimer = $elm$core$Process$spawn(
				A2(
					$elm$time$Time$setInterval,
					interval,
					A2($elm$core$Platform$sendToSelf, router, interval)));
			var spawnRest = function (id) {
				return A3(
					$elm$time$Time$spawnHelp,
					router,
					rest,
					A3($elm$core$Dict$insert, interval, id, processes));
			};
			return A2($elm$core$Task$andThen, spawnRest, spawnTimer);
		}
	});
var $elm$time$Time$onEffects = F3(
	function (router, subs, _v0) {
		var processes = _v0.aK;
		var rightStep = F3(
			function (_v6, id, _v7) {
				var spawns = _v7.a;
				var existing = _v7.b;
				var kills = _v7.c;
				return _Utils_Tuple3(
					spawns,
					existing,
					A2(
						$elm$core$Task$andThen,
						function (_v5) {
							return kills;
						},
						$elm$core$Process$kill(id)));
			});
		var newTaggers = A3($elm$core$List$foldl, $elm$time$Time$addMySub, $elm$core$Dict$empty, subs);
		var leftStep = F3(
			function (interval, taggers, _v4) {
				var spawns = _v4.a;
				var existing = _v4.b;
				var kills = _v4.c;
				return _Utils_Tuple3(
					A2($elm$core$List$cons, interval, spawns),
					existing,
					kills);
			});
		var bothStep = F4(
			function (interval, taggers, id, _v3) {
				var spawns = _v3.a;
				var existing = _v3.b;
				var kills = _v3.c;
				return _Utils_Tuple3(
					spawns,
					A3($elm$core$Dict$insert, interval, id, existing),
					kills);
			});
		var _v1 = A6(
			$elm$core$Dict$merge,
			leftStep,
			bothStep,
			rightStep,
			newTaggers,
			processes,
			_Utils_Tuple3(
				_List_Nil,
				$elm$core$Dict$empty,
				$elm$core$Task$succeed(0)));
		var spawnList = _v1.a;
		var existingDict = _v1.b;
		var killTask = _v1.c;
		return A2(
			$elm$core$Task$andThen,
			function (newProcesses) {
				return $elm$core$Task$succeed(
					A2($elm$time$Time$State, newTaggers, newProcesses));
			},
			A2(
				$elm$core$Task$andThen,
				function (_v2) {
					return A3($elm$time$Time$spawnHelp, router, spawnList, existingDict);
				},
				killTask));
	});
var $elm$time$Time$now = _Time_now($elm$time$Time$millisToPosix);
var $elm$time$Time$onSelfMsg = F3(
	function (router, interval, state) {
		var _v0 = A2($elm$core$Dict$get, interval, state.aR);
		if (_v0.$ === 1) {
			return $elm$core$Task$succeed(state);
		} else {
			var taggers = _v0.a;
			var tellTaggers = function (time) {
				return $elm$core$Task$sequence(
					A2(
						$elm$core$List$map,
						function (tagger) {
							return A2(
								$elm$core$Platform$sendToApp,
								router,
								tagger(time));
						},
						taggers));
			};
			return A2(
				$elm$core$Task$andThen,
				function (_v1) {
					return $elm$core$Task$succeed(state);
				},
				A2($elm$core$Task$andThen, tellTaggers, $elm$time$Time$now));
		}
	});
var $elm$core$Basics$composeL = F3(
	function (g, f, x) {
		return g(
			f(x));
	});
var $elm$time$Time$subMap = F2(
	function (f, _v0) {
		var interval = _v0.a;
		var tagger = _v0.b;
		return A2(
			$elm$time$Time$Every,
			interval,
			A2($elm$core$Basics$composeL, f, tagger));
	});
_Platform_effectManagers['Time'] = _Platform_createManager($elm$time$Time$init, $elm$time$Time$onEffects, $elm$time$Time$onSelfMsg, 0, $elm$time$Time$subMap);
var $elm$time$Time$subscription = _Platform_leaf('Time');
var $elm$time$Time$every = F2(
	function (interval, tagger) {
		return $elm$time$Time$subscription(
			A2($elm$time$Time$Every, interval, tagger));
	});
var $author$project$Main$KeyInfo = F4(
	function (key, ctrl, meta, inField) {
		return {ac: ctrl, aA: inField, bc: key, ae: meta};
	});
var $elm$json$Json$Decode$field = _Json_decodeField;
var $elm$json$Json$Decode$at = F2(
	function (fields, decoder) {
		return A3($elm$core$List$foldr, $elm$json$Json$Decode$field, decoder, fields);
	});
var $elm$json$Json$Decode$bool = _Json_decodeBool;
var $elm$json$Json$Decode$map4 = _Json_map4;
var $elm$json$Json$Decode$oneOf = _Json_oneOf;
var $elm$json$Json$Decode$string = _Json_decodeString;
var $author$project$Main$keyDecoder = A5(
	$elm$json$Json$Decode$map4,
	$author$project$Main$KeyInfo,
	A2($elm$json$Json$Decode$field, 'key', $elm$json$Json$Decode$string),
	A2($elm$json$Json$Decode$field, 'ctrlKey', $elm$json$Json$Decode$bool),
	A2($elm$json$Json$Decode$field, 'metaKey', $elm$json$Json$Decode$bool),
	$elm$json$Json$Decode$oneOf(
		_List_fromArray(
			[
				A2(
				$elm$json$Json$Decode$map,
				function (tag) {
					return (tag === 'INPUT') || (tag === 'TEXTAREA');
				},
				A2(
					$elm$json$Json$Decode$at,
					_List_fromArray(
						['target', 'tagName']),
					$elm$json$Json$Decode$string)),
				$elm$json$Json$Decode$succeed(false)
			])));
var $elm$browser$Browser$Events$Document = 0;
var $elm$browser$Browser$Events$MySub = F3(
	function (a, b, c) {
		return {$: 0, a: a, b: b, c: c};
	});
var $elm$browser$Browser$Events$State = F2(
	function (subs, pids) {
		return {aH: pids, aQ: subs};
	});
var $elm$browser$Browser$Events$init = $elm$core$Task$succeed(
	A2($elm$browser$Browser$Events$State, _List_Nil, $elm$core$Dict$empty));
var $elm$browser$Browser$Events$nodeToKey = function (node) {
	if (!node) {
		return 'd_';
	} else {
		return 'w_';
	}
};
var $elm$browser$Browser$Events$addKey = function (sub) {
	var node = sub.a;
	var name = sub.b;
	return _Utils_Tuple2(
		_Utils_ap(
			$elm$browser$Browser$Events$nodeToKey(node),
			name),
		sub);
};
var $elm$core$Dict$fromList = function (assocs) {
	return A3(
		$elm$core$List$foldl,
		F2(
			function (_v0, dict) {
				var key = _v0.a;
				var value = _v0.b;
				return A3($elm$core$Dict$insert, key, value, dict);
			}),
		$elm$core$Dict$empty,
		assocs);
};
var $elm$browser$Browser$Events$Event = F2(
	function (key, event) {
		return {aw: event, bc: key};
	});
var $elm$browser$Browser$Events$spawn = F3(
	function (router, key, _v0) {
		var node = _v0.a;
		var name = _v0.b;
		var actualNode = function () {
			if (!node) {
				return _Browser_doc;
			} else {
				return _Browser_window;
			}
		}();
		return A2(
			$elm$core$Task$map,
			function (value) {
				return _Utils_Tuple2(key, value);
			},
			A3(
				_Browser_on,
				actualNode,
				name,
				function (event) {
					return A2(
						$elm$core$Platform$sendToSelf,
						router,
						A2($elm$browser$Browser$Events$Event, key, event));
				}));
	});
var $elm$core$Dict$union = F2(
	function (t1, t2) {
		return A3($elm$core$Dict$foldl, $elm$core$Dict$insert, t2, t1);
	});
var $elm$browser$Browser$Events$onEffects = F3(
	function (router, subs, state) {
		var stepRight = F3(
			function (key, sub, _v6) {
				var deads = _v6.a;
				var lives = _v6.b;
				var news = _v6.c;
				return _Utils_Tuple3(
					deads,
					lives,
					A2(
						$elm$core$List$cons,
						A3($elm$browser$Browser$Events$spawn, router, key, sub),
						news));
			});
		var stepLeft = F3(
			function (_v4, pid, _v5) {
				var deads = _v5.a;
				var lives = _v5.b;
				var news = _v5.c;
				return _Utils_Tuple3(
					A2($elm$core$List$cons, pid, deads),
					lives,
					news);
			});
		var stepBoth = F4(
			function (key, pid, _v2, _v3) {
				var deads = _v3.a;
				var lives = _v3.b;
				var news = _v3.c;
				return _Utils_Tuple3(
					deads,
					A3($elm$core$Dict$insert, key, pid, lives),
					news);
			});
		var newSubs = A2($elm$core$List$map, $elm$browser$Browser$Events$addKey, subs);
		var _v0 = A6(
			$elm$core$Dict$merge,
			stepLeft,
			stepBoth,
			stepRight,
			state.aH,
			$elm$core$Dict$fromList(newSubs),
			_Utils_Tuple3(_List_Nil, $elm$core$Dict$empty, _List_Nil));
		var deadPids = _v0.a;
		var livePids = _v0.b;
		var makeNewPids = _v0.c;
		return A2(
			$elm$core$Task$andThen,
			function (pids) {
				return $elm$core$Task$succeed(
					A2(
						$elm$browser$Browser$Events$State,
						newSubs,
						A2(
							$elm$core$Dict$union,
							livePids,
							$elm$core$Dict$fromList(pids))));
			},
			A2(
				$elm$core$Task$andThen,
				function (_v1) {
					return $elm$core$Task$sequence(makeNewPids);
				},
				$elm$core$Task$sequence(
					A2($elm$core$List$map, $elm$core$Process$kill, deadPids))));
	});
var $elm$core$List$maybeCons = F3(
	function (f, mx, xs) {
		var _v0 = f(mx);
		if (!_v0.$) {
			var x = _v0.a;
			return A2($elm$core$List$cons, x, xs);
		} else {
			return xs;
		}
	});
var $elm$core$List$filterMap = F2(
	function (f, xs) {
		return A3(
			$elm$core$List$foldr,
			$elm$core$List$maybeCons(f),
			_List_Nil,
			xs);
	});
var $elm$browser$Browser$Events$onSelfMsg = F3(
	function (router, _v0, state) {
		var event = _v0.aw;
		var key = _v0.bc;
		var toMessage = function (_v2) {
			var subKey = _v2.a;
			var _v3 = _v2.b;
			var node = _v3.a;
			var name = _v3.b;
			var decoder = _v3.c;
			return _Utils_eq(subKey, key) ? A2(_Browser_decodeEvent, decoder, event) : $elm$core$Maybe$Nothing;
		};
		var messages = A2($elm$core$List$filterMap, toMessage, state.aQ);
		return A2(
			$elm$core$Task$andThen,
			function (_v1) {
				return $elm$core$Task$succeed(state);
			},
			$elm$core$Task$sequence(
				A2(
					$elm$core$List$map,
					$elm$core$Platform$sendToApp(router),
					messages)));
	});
var $elm$browser$Browser$Events$subMap = F2(
	function (func, _v0) {
		var node = _v0.a;
		var name = _v0.b;
		var decoder = _v0.c;
		return A3(
			$elm$browser$Browser$Events$MySub,
			node,
			name,
			A2($elm$json$Json$Decode$map, func, decoder));
	});
_Platform_effectManagers['Browser.Events'] = _Platform_createManager($elm$browser$Browser$Events$init, $elm$browser$Browser$Events$onEffects, $elm$browser$Browser$Events$onSelfMsg, 0, $elm$browser$Browser$Events$subMap);
var $elm$browser$Browser$Events$subscription = _Platform_leaf('Browser.Events');
var $elm$browser$Browser$Events$on = F3(
	function (node, name, decoder) {
		return $elm$browser$Browser$Events$subscription(
			A3($elm$browser$Browser$Events$MySub, node, name, decoder));
	});
var $elm$browser$Browser$Events$onKeyDown = A2($elm$browser$Browser$Events$on, 0, 'keydown');
var $author$project$Main$subscriptions = function (_v0) {
	return $elm$core$Platform$Sub$batch(
		_List_fromArray(
			[
				$elm$browser$Browser$Events$onKeyDown(
				A2($elm$json$Json$Decode$map, $author$project$Main$GlobalKey, $author$project$Main$keyDecoder)),
				A2($elm$time$Time$every, 30000, $author$project$Main$Tick)
			]));
};
var $author$project$Main$NoOp = {$: 0};
var $elm$core$Basics$always = F2(
	function (a, _v0) {
		return a;
	});
var $elm$core$Task$onError = _Scheduler_onError;
var $elm$core$Task$attempt = F2(
	function (resultToMessage, task) {
		return $elm$core$Task$command(
			A2(
				$elm$core$Task$onError,
				A2(
					$elm$core$Basics$composeL,
					A2($elm$core$Basics$composeL, $elm$core$Task$succeed, resultToMessage),
					$elm$core$Result$Err),
				A2(
					$elm$core$Task$andThen,
					A2(
						$elm$core$Basics$composeL,
						A2($elm$core$Basics$composeL, $elm$core$Task$succeed, resultToMessage),
						$elm$core$Result$Ok),
					task)));
	});
var $elm$json$Json$Encode$object = function (pairs) {
	return _Json_wrap(
		A3(
			$elm$core$List$foldl,
			F2(
				function (_v0, obj) {
					var k = _v0.a;
					var v = _v0.b;
					return A3(_Json_addField, k, v, obj);
				}),
			_Json_emptyObject(0),
			pairs));
};
var $elm$json$Json$Encode$string = _Json_wrap;
var $author$project$Ports$copyCode = _Platform_outgoingPort(
	'copyCode',
	function ($) {
		return $elm$json$Json$Encode$object(
			_List_fromArray(
				[
					_Utils_Tuple2(
					'id',
					$elm$json$Json$Encode$string($.a8)),
					_Utils_Tuple2(
					'text',
					$elm$json$Json$Encode$string($.bz))
				]));
	});
var $elm$core$List$drop = F2(
	function (n, list) {
		drop:
		while (true) {
			if (n <= 0) {
				return list;
			} else {
				if (!list.b) {
					return list;
				} else {
					var x = list.a;
					var xs = list.b;
					var $temp$n = n - 1,
						$temp$list = xs;
					n = $temp$n;
					list = $temp$list;
					continue drop;
				}
			}
		}
	});
var $author$project$Router$href = function (route) {
	switch (route.$) {
		case 0:
			return '#/';
		case 1:
			return '#/writing';
		case 2:
			var slug = route.a;
			return '#/writing/' + slug;
		case 3:
			return '#/projects';
		case 4:
			return '#/research';
		case 5:
			return '#/about';
		default:
			return '#/404';
	}
};
var $elm$browser$Browser$Navigation$load = _Browser_load;
var $elm$browser$Browser$Navigation$pushUrl = _Browser_pushUrl;
var $author$project$Main$executeTarget = F2(
	function (target, model) {
		var closed = _Utils_update(
			model,
			{r: false, v: false, bs: '', bw: 0});
		if (!target.$) {
			var route = target.a;
			return _Utils_Tuple2(
				closed,
				A2(
					$elm$browser$Browser$Navigation$pushUrl,
					model.bc,
					$author$project$Router$href(route)));
		} else {
			var url = target.a;
			return _Utils_Tuple2(
				closed,
				$elm$browser$Browser$Navigation$load(url));
		}
	});
var $elm$core$Basics$not = _Basics_not;
var $elm$core$List$all = F2(
	function (isOkay, list) {
		return !A2(
			$elm$core$List$any,
			A2($elm$core$Basics$composeL, $elm$core$Basics$not, isOkay),
			list);
	});
var $author$project$Components$Palette$External = function (a) {
	return {$: 1, a: a};
};
var $author$project$Components$Palette$GoTo = function (a) {
	return {$: 0, a: a};
};
var $author$project$Components$Palette$Suggestion = F5(
	function (label, kind, detail, haystack, target) {
		return {au: detail, ax: haystack, aC: kind, bd: label, by: target};
	});
var $author$project$Utils$Date$iso = function (slug) {
	return A2($elm$core$String$left, 10, slug);
};
var $elm$core$String$replace = F3(
	function (before, after, string) {
		return A2(
			$elm$core$String$join,
			after,
			A2($elm$core$String$split, before, string));
	});
var $author$project$Utils$Date$display = function (slug) {
	return A3(
		$elm$core$String$replace,
		'-',
		'.',
		$author$project$Utils$Date$iso(slug));
};
var $elm$core$String$cons = _String_cons;
var $elm$core$String$fromChar = function (_char) {
	return A2($elm$core$String$cons, _char, '');
};
var $elm$core$Bitwise$and = _Bitwise_and;
var $elm$core$Bitwise$shiftRightBy = _Bitwise_shiftRightBy;
var $elm$core$String$repeatHelp = F3(
	function (n, chunk, result) {
		return (n <= 0) ? result : A3(
			$elm$core$String$repeatHelp,
			n >> 1,
			_Utils_ap(chunk, chunk),
			(!(n & 1)) ? result : _Utils_ap(result, chunk));
	});
var $elm$core$String$repeat = F2(
	function (n, chunk) {
		return A3($elm$core$String$repeatHelp, n, chunk, '');
	});
var $elm$core$String$padLeft = F3(
	function (n, _char, string) {
		return _Utils_ap(
			A2(
				$elm$core$String$repeat,
				n - $elm$core$String$length(string),
				$elm$core$String$fromChar(_char)),
			string);
	});
var $author$project$Components$Palette$pad2 = function (n) {
	return A3(
		$elm$core$String$padLeft,
		2,
		'0',
		$elm$core$String$fromInt(n));
};
var $author$project$Components$Palette$postSuggestion = function (post) {
	return A5(
		$author$project$Components$Palette$Suggestion,
		post.aT,
		'fn-' + $author$project$Components$Palette$pad2(post.bg),
		$author$project$Utils$Date$display(post.an) + (' · ' + A2($elm$core$String$join, ', ', post.aS)),
		A2(
			$elm$core$String$join,
			' ',
			_List_fromArray(
				[
					post.an,
					post.aT,
					A2($elm$core$String$join, ' ', post.aS),
					post.a1
				])),
		$author$project$Components$Palette$GoTo(
			$author$project$Router$Post(post.an)));
};
var $author$project$Components$Palette$suggestions = _Utils_ap(
	_List_fromArray(
		[
			A5(
			$author$project$Components$Palette$Suggestion,
			'index',
			'page',
			'start here',
			'home index start root ~/ landing',
			$author$project$Components$Palette$GoTo($author$project$Router$Home)),
			A5(
			$author$project$Components$Palette$Suggestion,
			'writing',
			'page',
			'field notes, newest first',
			'writing blog posts notes field notebook',
			$author$project$Components$Palette$GoTo($author$project$Router$Writing)),
			A5(
			$author$project$Components$Palette$Suggestion,
			'projects',
			'page',
			'glu · plast · argos · grf',
			'projects builds software glu plast argos grf',
			$author$project$Components$Palette$GoTo($author$project$Router$Projects)),
			A5(
			$author$project$Components$Palette$Suggestion,
			'research',
			'page',
			'open problems and experiments',
			'research papers experiments world models representation learning',
			$author$project$Components$Palette$GoTo($author$project$Router$Research)),
			A5(
			$author$project$Components$Palette$Suggestion,
			'about',
			'page',
			'who is behind this',
			'about bio who contact email',
			$author$project$Components$Palette$GoTo($author$project$Router$About)),
			A5(
			$author$project$Components$Palette$Suggestion,
			'rss',
			'feed',
			'subscribe without an account',
			'rss feed subscribe atom xml',
			$author$project$Components$Palette$External('rss.xml')),
			A5(
			$author$project$Components$Palette$Suggestion,
			'github',
			'link',
			'github.com/Vixel2006 ↗',
			'github source code repos vixel2006 git',
			$author$project$Components$Palette$External('https://github.com/Vixel2006'))
		]),
	A2($elm$core$List$map, $author$project$Components$Palette$postSuggestion, $author$project$Content$Posts$posts));
var $elm$core$String$toLower = _String_toLower;
var $elm$core$String$trim = _String_trim;
var $elm$core$String$words = _String_words;
var $author$project$Components$Palette$filterSuggestions = function (query) {
	var needle = $elm$core$String$toLower(
		$elm$core$String$trim(query));
	var words = $elm$core$String$words(needle);
	return (needle === '') ? $author$project$Components$Palette$suggestions : A2(
		$elm$core$List$filter,
		function (s) {
			var hay = $elm$core$String$toLower(s.ax);
			return A2(
				$elm$core$List$all,
				function (w) {
					return A2($elm$core$String$contains, w, hay);
				},
				words);
		},
		$author$project$Components$Palette$suggestions);
};
var $author$project$Main$chordRoute = function (key) {
	switch (key) {
		case 'h':
			return $elm$core$Maybe$Just($author$project$Router$Home);
		case 'w':
			return $elm$core$Maybe$Just($author$project$Router$Writing);
		case 'p':
			return $elm$core$Maybe$Just($author$project$Router$Projects);
		case 'r':
			return $elm$core$Maybe$Just($author$project$Router$Research);
		case 'a':
			return $elm$core$Maybe$Just($author$project$Router$About);
		default:
			return $elm$core$Maybe$Nothing;
	}
};
var $author$project$Ports$consoleArt = _Platform_outgoingPort('consoleArt', $elm$json$Json$Encode$string);
var $author$project$Main$konami = _List_fromArray(
	['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a']);
var $author$project$Main$konamiStep = F2(
	function (key, model) {
		var expected = $elm$core$List$head(
			A2($elm$core$List$drop, model.G, $author$project$Main$konami));
		var nextIdx = _Utils_eq(
			expected,
			$elm$core$Maybe$Just(key)) ? (model.G + 1) : (_Utils_eq(
			$elm$core$Maybe$Just(key),
			$elm$core$List$head($author$project$Main$konami)) ? 1 : 0);
		return _Utils_eq(
			nextIdx,
			$elm$core$List$length($author$project$Main$konami)) ? _Utils_Tuple2(
			_Utils_update(
				model,
				{K: !model.K, G: 0}),
			$author$project$Ports$consoleArt(
				A2(
					$elm$core$String$join,
					'\u000A',
					_List_fromArray(
						['┌─────────────────────────────────────────┐', '│ 10 PRINT \u0022VIXEL\u0022                        │', '│ 20 GOTO 10                              │', '│ RUN                                     │', '└── phosphor mode engaged ────────────────┘'])))) : _Utils_Tuple2(
			_Utils_update(
				model,
				{G: nextIdx}),
			$elm$core$Platform$Cmd$none);
	});
var $elm$browser$Browser$Dom$focus = _Browser_call('focus');
var $author$project$Main$togglePalette = function (model) {
	return model.r ? _Utils_Tuple2(
		_Utils_update(
			model,
			{r: false}),
		$elm$core$Platform$Cmd$none) : _Utils_Tuple2(
		_Utils_update(
			model,
			{r: true, bs: '', bw: 0}),
		A2(
			$elm$core$Task$attempt,
			$elm$core$Basics$always($author$project$Main$NoOp),
			$elm$browser$Browser$Dom$focus('palette-input')));
};
var $author$project$Main$globalKey = F2(
	function (info, model) {
		if ((info.ac || info.ae) && ((info.bc === 'k') || (info.bc === 'K'))) {
			return $author$project$Main$togglePalette(model);
		} else {
			if (info.bc === 'Escape') {
				return (model.r || model.v) ? _Utils_Tuple2(
					_Utils_update(
						model,
						{r: false, v: false}),
					$elm$core$Platform$Cmd$none) : _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
			} else {
				if (model.r || (info.aA || (info.ac || info.ae))) {
					return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
				} else {
					if (model.v) {
						var _v0 = $author$project$Main$chordRoute(info.bc);
						if (!_v0.$) {
							var route = _v0.a;
							return _Utils_Tuple2(
								_Utils_update(
									model,
									{v: false}),
								A2(
									$elm$browser$Browser$Navigation$pushUrl,
									model.bc,
									$author$project$Router$href(route)));
						} else {
							return _Utils_Tuple2(
								_Utils_update(
									model,
									{v: false}),
								$elm$core$Platform$Cmd$none);
						}
					} else {
						var _v1 = info.bc;
						switch (_v1) {
							case '/':
								return $author$project$Main$togglePalette(model);
							case 'g':
								return _Utils_Tuple2(
									_Utils_update(
										model,
										{v: true}),
									$elm$core$Platform$Cmd$none);
							default:
								return A2($author$project$Main$konamiStep, info.bc, model);
						}
					}
				}
			}
		}
	});
var $elm$core$Basics$min = F2(
	function (x, y) {
		return (_Utils_cmp(x, y) < 0) ? x : y;
	});
var $author$project$Main$paletteKey = F2(
	function (key, model) {
		var list = $author$project$Components$Palette$filterSuggestions(model.bs);
		var cur = model.bw;
		var count = $elm$core$List$length(list);
		switch (key) {
			case 'ArrowDown':
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							bw: A2($elm$core$Basics$min, count - 1, cur + 1)
						}),
					$elm$core$Platform$Cmd$none);
			case 'ArrowUp':
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							bw: A2($elm$core$Basics$max, 0, cur - 1)
						}),
					$elm$core$Platform$Cmd$none);
			case 'Enter':
				var _v1 = $elm$core$List$head(
					A2($elm$core$List$drop, cur, list));
				if (!_v1.$) {
					var s = _v1.a;
					return A2($author$project$Main$executeTarget, s.by, model);
				} else {
					return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
				}
			default:
				return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
		}
	});
var $author$project$Ports$scrollToId = _Platform_outgoingPort('scrollToId', $elm$json$Json$Encode$string);
var $elm$browser$Browser$Dom$setViewport = _Browser_setViewport;
var $elm$url$Url$addPort = F2(
	function (maybePort, starter) {
		if (maybePort.$ === 1) {
			return starter;
		} else {
			var port_ = maybePort.a;
			return starter + (':' + $elm$core$String$fromInt(port_));
		}
	});
var $elm$url$Url$addPrefixed = F3(
	function (prefix, maybeSegment, starter) {
		if (maybeSegment.$ === 1) {
			return starter;
		} else {
			var segment = maybeSegment.a;
			return _Utils_ap(
				starter,
				_Utils_ap(prefix, segment));
		}
	});
var $elm$url$Url$toString = function (url) {
	var http = function () {
		var _v0 = url.aL;
		if (!_v0) {
			return 'http://';
		} else {
			return 'https://';
		}
	}();
	return A3(
		$elm$url$Url$addPrefixed,
		'#',
		url.a6,
		A3(
			$elm$url$Url$addPrefixed,
			'?',
			url.bs,
			_Utils_ap(
				A2(
					$elm$url$Url$addPort,
					url.aI,
					_Utils_ap(http, url.az)),
				url.aG)));
};
var $author$project$Main$update = F2(
	function (msg, model) {
		switch (msg.$) {
			case 0:
				return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
			case 1:
				var request = msg.a;
				if (!request.$) {
					var url = request.a;
					return _Utils_Tuple2(
						model,
						A2(
							$elm$browser$Browser$Navigation$pushUrl,
							model.bc,
							$elm$url$Url$toString(url)));
				} else {
					var href = request.a;
					return _Utils_Tuple2(
						model,
						$elm$browser$Browser$Navigation$load(href));
				}
			case 2:
				var url = msg.a;
				var route = $author$project$Router$parse(url);
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							r: false,
							v: false,
							U: A2($author$project$Main$requestedPathOf, url, route),
							bv: route
						}),
					A2(
						$elm$core$Task$attempt,
						$elm$core$Basics$always($author$project$Main$NoOp),
						A2($elm$browser$Browser$Dom$setViewport, 0, 0)));
			case 3:
				var posix = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{bf: posix}),
					$elm$core$Platform$Cmd$none);
			case 4:
				var info = msg.a;
				return A2($author$project$Main$globalKey, info, model);
			case 5:
				return $author$project$Main$togglePalette(model);
			case 6:
				var q = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{bs: q, bw: 0}),
					$elm$core$Platform$Cmd$none);
			case 7:
				var key = msg.a;
				return A2($author$project$Main$paletteKey, key, model);
			case 8:
				var i = msg.a;
				var _v2 = $elm$core$List$head(
					A2(
						$elm$core$List$drop,
						i,
						$author$project$Components$Palette$filterSuggestions(model.bs)));
				if (!_v2.$) {
					var s = _v2.a;
					return A2($author$project$Main$executeTarget, s.by, model);
				} else {
					return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
				}
			case 9:
				var i = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{bw: i}),
					$elm$core$Platform$Cmd$none);
			case 10:
				return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
			case 11:
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{r: false}),
					$elm$core$Platform$Cmd$none);
			case 12:
				var payload = msg.a;
				return _Utils_Tuple2(
					model,
					$author$project$Ports$copyCode(payload));
			default:
				var id = msg.a;
				return _Utils_Tuple2(
					model,
					$author$project$Ports$scrollToId(id));
		}
	});
var $author$project$Main$PaletteToggle = {$: 5};
var $elm$html$Html$Attributes$stringProperty = F2(
	function (key, string) {
		return A2(
			_VirtualDom_property,
			key,
			$elm$json$Json$Encode$string(string));
	});
var $elm$html$Html$Attributes$class = $elm$html$Html$Attributes$stringProperty('className');
var $elm$core$Tuple$second = function (_v0) {
	var y = _v0.b;
	return y;
};
var $elm$html$Html$Attributes$classList = function (classes) {
	return $elm$html$Html$Attributes$class(
		A2(
			$elm$core$String$join,
			' ',
			A2(
				$elm$core$List$map,
				$elm$core$Tuple$first,
				A2($elm$core$List$filter, $elm$core$Tuple$second, classes))));
};
var $elm$html$Html$div = _VirtualDom_node('div');
var $elm$html$Html$a = _VirtualDom_node('a');
var $elm$virtual_dom$VirtualDom$attribute = F2(
	function (key, value) {
		return A2(
			_VirtualDom_attribute,
			_VirtualDom_noOnOrFormAction(key),
			_VirtualDom_noJavaScriptOrHtmlUri(value));
	});
var $elm$html$Html$Attributes$attribute = $elm$virtual_dom$VirtualDom$attribute;
var $author$project$Components$Chrome$catArt = ' /\u005C_/\u005C\u000A( o.o )\u000A > ^ <';
var $author$project$Content$Site$elsewhere = _List_fromArray(
	[
		{bd: 'github', aU: 'https://github.com/Vixel2006'},
		{bd: 'x', aU: 'https://x.com/this_vixel'},
		{bd: 'mail', aU: 'mailto:yusufshihata2006@gmail.com'},
		{bd: 'linkedin', aU: 'https://www.linkedin.com/in/yusufmohamed2006'}
	]);
var $elm$html$Html$footer = _VirtualDom_node('footer');
var $elm$html$Html$Attributes$href = function (url) {
	return A2(
		$elm$html$Html$Attributes$stringProperty,
		'href',
		_VirtualDom_noJavaScriptUri(url));
};
var $elm$html$Html$nav = _VirtualDom_node('nav');
var $author$project$Components$Chrome$navItems = _List_fromArray(
	[
		_Utils_Tuple3('01', 'index', $author$project$Router$Home),
		_Utils_Tuple3('02', 'writing', $author$project$Router$Writing),
		_Utils_Tuple3('03', 'projects', $author$project$Router$Projects),
		_Utils_Tuple3('04', 'research', $author$project$Router$Research),
		_Utils_Tuple3('05', 'about', $author$project$Router$About)
	]);
var $elm$html$Html$p = _VirtualDom_node('p');
var $elm$html$Html$pre = _VirtualDom_node('pre');
var $elm$html$Html$Attributes$rel = _VirtualDom_attribute('rel');
var $elm$html$Html$Attributes$target = $elm$html$Html$Attributes$stringProperty('target');
var $elm$virtual_dom$VirtualDom$text = _VirtualDom_text;
var $elm$html$Html$text = $elm$virtual_dom$VirtualDom$text;
var $author$project$Components$Chrome$socialLink = function (s) {
	return A2(
		$elm$html$Html$a,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('colo-link'),
				$elm$html$Html$Attributes$href(s.aU),
				A2($elm$core$String$startsWith, 'mailto:', s.aU) ? $elm$html$Html$Attributes$class('') : $elm$html$Html$Attributes$target('_blank'),
				$elm$html$Html$Attributes$rel('noopener me')
			]),
		_List_fromArray(
			[
				$elm$html$Html$text(s.bd + ' ↗')
			]));
};
var $elm$html$Html$Attributes$title = $elm$html$Html$Attributes$stringProperty('title');
var $author$project$Components$Chrome$footerView = A2(
	$elm$html$Html$footer,
	_List_fromArray(
		[
			$elm$html$Html$Attributes$class('colophon')
		]),
	_List_fromArray(
		[
			A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('wrap colo-grid')
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('colo-id')
						]),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$pre,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('cat'),
									A2($elm$html$Html$Attributes$attribute, 'aria-hidden', 'true'),
									$elm$html$Html$Attributes$title('it\u0027s a cat')
								]),
							_List_fromArray(
								[
									$elm$html$Html$text($author$project$Components$Chrome$catArt)
								])),
							A2(
							$elm$html$Html$p,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('colo-line')
								]),
							_List_fromArray(
								[
									$elm$html$Html$text('© 2026 vixel — hand-built, no framework survived.')
								]))
						])),
					A2(
					$elm$html$Html$nav,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('colo-col'),
							A2($elm$html$Html$Attributes$attribute, 'aria-label', 'colophon index')
						]),
					A2(
						$elm$core$List$cons,
						A2(
							$elm$html$Html$p,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('colo-head')
								]),
							_List_fromArray(
								[
									$elm$html$Html$text('INDEX')
								])),
						A2(
							$elm$core$List$map,
							function (_v0) {
								var label = _v0.b;
								var route = _v0.c;
								return A2(
									$elm$html$Html$a,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$class('colo-link'),
											$elm$html$Html$Attributes$href(
											$author$project$Router$href(route))
										]),
									_List_fromArray(
										[
											$elm$html$Html$text(label)
										]));
							},
							$author$project$Components$Chrome$navItems))),
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('colo-col')
						]),
					A2(
						$elm$core$List$cons,
						A2(
							$elm$html$Html$p,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('colo-head')
								]),
							_List_fromArray(
								[
									$elm$html$Html$text('CHANNELS')
								])),
						A2($elm$core$List$map, $author$project$Components$Chrome$socialLink, $author$project$Content$Site$elsewhere))),
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('colo-col')
						]),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$p,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('colo-head')
								]),
							_List_fromArray(
								[
									$elm$html$Html$text('SYSTEM')
								])),
							A2(
							$elm$html$Html$p,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('colo-line')
								]),
							_List_fromArray(
								[
									$elm$html$Html$text('elm 0.19 · zero js frameworks')
								])),
							A2(
							$elm$html$Html$p,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('colo-line')
								]),
							_List_fromArray(
								[
									$elm$html$Html$text('no cookies · no analytics · no tracking')
								])),
							A2(
							$elm$html$Html$a,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('colo-link'),
									$elm$html$Html$Attributes$href('rss.xml')
								]),
							_List_fromArray(
								[
									$elm$html$Html$text('rss feed ↗')
								]))
						]))
				])),
			A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('wrap colo-keys'),
					A2($elm$html$Html$Attributes$attribute, 'aria-hidden', 'true')
				]),
			_List_fromArray(
				[
					$elm$html$Html$text('keys:  / search  ·  g h index  ·  g w writing  ·  esc close')
				]))
		]));
var $elm$html$Html$Attributes$id = $elm$html$Html$Attributes$stringProperty('id');
var $elm$html$Html$main_ = _VirtualDom_node('main');
var $elm$html$Html$button = _VirtualDom_node('button');
var $author$project$Components$Chrome$pad = function (n) {
	return A3(
		$elm$core$String$padLeft,
		2,
		'0',
		$elm$core$String$fromInt(n));
};
var $elm$time$Time$flooredDiv = F2(
	function (numerator, denominator) {
		return $elm$core$Basics$floor(numerator / denominator);
	});
var $elm$core$Basics$modBy = _Basics_modBy;
var $elm$time$Time$posixToMillis = function (_v0) {
	var millis = _v0;
	return millis;
};
var $elm$time$Time$toAdjustedMinutesHelp = F3(
	function (defaultOffset, posixMinutes, eras) {
		toAdjustedMinutesHelp:
		while (true) {
			if (!eras.b) {
				return posixMinutes + defaultOffset;
			} else {
				var era = eras.a;
				var olderEras = eras.b;
				if (_Utils_cmp(era.ao, posixMinutes) < 0) {
					return posixMinutes + era.aF;
				} else {
					var $temp$defaultOffset = defaultOffset,
						$temp$posixMinutes = posixMinutes,
						$temp$eras = olderEras;
					defaultOffset = $temp$defaultOffset;
					posixMinutes = $temp$posixMinutes;
					eras = $temp$eras;
					continue toAdjustedMinutesHelp;
				}
			}
		}
	});
var $elm$time$Time$toAdjustedMinutes = F2(
	function (_v0, time) {
		var defaultOffset = _v0.a;
		var eras = _v0.b;
		return A3(
			$elm$time$Time$toAdjustedMinutesHelp,
			defaultOffset,
			A2(
				$elm$time$Time$flooredDiv,
				$elm$time$Time$posixToMillis(time),
				60000),
			eras);
	});
var $elm$time$Time$toHour = F2(
	function (zone, time) {
		return A2(
			$elm$core$Basics$modBy,
			24,
			A2(
				$elm$time$Time$flooredDiv,
				A2($elm$time$Time$toAdjustedMinutes, zone, time),
				60));
	});
var $elm$time$Time$toMinute = F2(
	function (zone, time) {
		return A2(
			$elm$core$Basics$modBy,
			60,
			A2($elm$time$Time$toAdjustedMinutes, zone, time));
	});
var $elm$time$Time$utc = A2($elm$time$Time$Zone, 0, _List_Nil);
var $author$project$Components$Chrome$clockText = function (posix) {
	return $author$project$Components$Chrome$pad(
		A2($elm$time$Time$toHour, $elm$time$Time$utc, posix)) + (':' + $author$project$Components$Chrome$pad(
		A2($elm$time$Time$toMinute, $elm$time$Time$utc, posix)));
};
var $author$project$Components$Chrome$monthNumber = function (month) {
	switch (month) {
		case 0:
			return 1;
		case 1:
			return 2;
		case 2:
			return 3;
		case 3:
			return 4;
		case 4:
			return 5;
		case 5:
			return 6;
		case 6:
			return 7;
		case 7:
			return 8;
		case 8:
			return 9;
		case 9:
			return 10;
		case 10:
			return 11;
		default:
			return 12;
	}
};
var $elm$core$Basics$ge = _Utils_ge;
var $elm$core$Basics$negate = function (n) {
	return -n;
};
var $elm$time$Time$toCivil = function (minutes) {
	var rawDay = A2($elm$time$Time$flooredDiv, minutes, 60 * 24) + 719468;
	var era = (((rawDay >= 0) ? rawDay : (rawDay - 146096)) / 146097) | 0;
	var dayOfEra = rawDay - (era * 146097);
	var yearOfEra = ((((dayOfEra - ((dayOfEra / 1460) | 0)) + ((dayOfEra / 36524) | 0)) - ((dayOfEra / 146096) | 0)) / 365) | 0;
	var dayOfYear = dayOfEra - (((365 * yearOfEra) + ((yearOfEra / 4) | 0)) - ((yearOfEra / 100) | 0));
	var mp = (((5 * dayOfYear) + 2) / 153) | 0;
	var month = mp + ((mp < 10) ? 3 : (-9));
	var year = yearOfEra + (era * 400);
	return {
		at: (dayOfYear - ((((153 * mp) + 2) / 5) | 0)) + 1,
		aE: month,
		aZ: year + ((month <= 2) ? 1 : 0)
	};
};
var $elm$time$Time$toDay = F2(
	function (zone, time) {
		return $elm$time$Time$toCivil(
			A2($elm$time$Time$toAdjustedMinutes, zone, time)).at;
	});
var $elm$time$Time$Apr = 3;
var $elm$time$Time$Aug = 7;
var $elm$time$Time$Dec = 11;
var $elm$time$Time$Feb = 1;
var $elm$time$Time$Jan = 0;
var $elm$time$Time$Jul = 6;
var $elm$time$Time$Jun = 5;
var $elm$time$Time$Mar = 2;
var $elm$time$Time$May = 4;
var $elm$time$Time$Nov = 10;
var $elm$time$Time$Oct = 9;
var $elm$time$Time$Sep = 8;
var $elm$time$Time$toMonth = F2(
	function (zone, time) {
		var _v0 = $elm$time$Time$toCivil(
			A2($elm$time$Time$toAdjustedMinutes, zone, time)).aE;
		switch (_v0) {
			case 1:
				return 0;
			case 2:
				return 1;
			case 3:
				return 2;
			case 4:
				return 3;
			case 5:
				return 4;
			case 6:
				return 5;
			case 7:
				return 6;
			case 8:
				return 7;
			case 9:
				return 8;
			case 10:
				return 9;
			case 11:
				return 10;
			default:
				return 11;
		}
	});
var $elm$time$Time$toYear = F2(
	function (zone, time) {
		return $elm$time$Time$toCivil(
			A2($elm$time$Time$toAdjustedMinutes, zone, time)).aZ;
	});
var $author$project$Components$Chrome$clockIso = function (posix) {
	return $elm$core$String$fromInt(
		A2($elm$time$Time$toYear, $elm$time$Time$utc, posix)) + ('-' + ($author$project$Components$Chrome$pad(
		$author$project$Components$Chrome$monthNumber(
			A2($elm$time$Time$toMonth, $elm$time$Time$utc, posix))) + ('-' + ($author$project$Components$Chrome$pad(
		A2($elm$time$Time$toDay, $elm$time$Time$utc, posix)) + ('T' + ($author$project$Components$Chrome$clockText(posix) + ':00Z'))))));
};
var $elm$html$Html$Attributes$datetime = _VirtualDom_attribute('datetime');
var $elm$html$Html$header = _VirtualDom_node('header');
var $elm$html$Html$span = _VirtualDom_node('span');
var $author$project$Components$Chrome$navLink = F2(
	function (current, _v0) {
		var num = _v0.a;
		var label = _v0.b;
		var route = _v0.c;
		var isActive = function () {
			var _v1 = _Utils_Tuple2(route, current);
			_v1$6:
			while (true) {
				switch (_v1.a.$) {
					case 0:
						if (!_v1.b.$) {
							var _v2 = _v1.a;
							var _v3 = _v1.b;
							return true;
						} else {
							break _v1$6;
						}
					case 1:
						switch (_v1.b.$) {
							case 1:
								var _v4 = _v1.a;
								var _v5 = _v1.b;
								return true;
							case 2:
								var _v6 = _v1.a;
								return true;
							default:
								break _v1$6;
						}
					case 3:
						if (_v1.b.$ === 3) {
							var _v7 = _v1.a;
							var _v8 = _v1.b;
							return true;
						} else {
							break _v1$6;
						}
					case 4:
						if (_v1.b.$ === 4) {
							var _v9 = _v1.a;
							var _v10 = _v1.b;
							return true;
						} else {
							break _v1$6;
						}
					case 5:
						if (_v1.b.$ === 5) {
							var _v11 = _v1.a;
							var _v12 = _v1.b;
							return true;
						} else {
							break _v1$6;
						}
					default:
						break _v1$6;
				}
			}
			return false;
		}();
		return A2(
			$elm$html$Html$a,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('nav-link'),
					$elm$html$Html$Attributes$href(
					$author$project$Router$href(route)),
					isActive ? A2($elm$html$Html$Attributes$attribute, 'aria-current', 'page') : $elm$html$Html$Attributes$class('')
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$span,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('nav-num'),
							A2($elm$html$Html$Attributes$attribute, 'aria-hidden', 'true')
						]),
					_List_fromArray(
						[
							$elm$html$Html$text(num)
						])),
					$elm$html$Html$text(label)
				]));
	});
var $elm$virtual_dom$VirtualDom$Normal = function (a) {
	return {$: 0, a: a};
};
var $elm$virtual_dom$VirtualDom$on = _VirtualDom_on;
var $elm$html$Html$Events$on = F2(
	function (event, decoder) {
		return A2(
			$elm$virtual_dom$VirtualDom$on,
			event,
			$elm$virtual_dom$VirtualDom$Normal(decoder));
	});
var $elm$html$Html$Events$onClick = function (msg) {
	return A2(
		$elm$html$Html$Events$on,
		'click',
		$elm$json$Json$Decode$succeed(msg));
};
var $elm$html$Html$time = _VirtualDom_node('time');
var $elm$html$Html$Attributes$type_ = $elm$html$Html$Attributes$stringProperty('type');
var $author$project$Components$Chrome$masthead = function (_v0) {
	var onSearch = _v0.bn;
	var now = _v0.bf;
	var route = _v0.bv;
	return A2(
		$elm$html$Html$header,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('masthead')
			]),
		_List_fromArray(
			[
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('wrap mast-row')
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$a,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('brand'),
								$elm$html$Html$Attributes$href(
								$author$project$Router$href($author$project$Router$Home))
							]),
						_List_fromArray(
							[
								A2(
								$elm$html$Html$span,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('brand-mark'),
										A2($elm$html$Html$Attributes$attribute, 'aria-hidden', 'true')
									]),
								_List_fromArray(
									[
										$elm$html$Html$text('▮')
									])),
								A2(
								$elm$html$Html$span,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('brand-name')
									]),
								_List_fromArray(
									[
										$elm$html$Html$text('VIXEL')
									]))
							])),
						A2(
						$elm$html$Html$nav,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('site-nav'),
								A2($elm$html$Html$Attributes$attribute, 'aria-label', 'primary')
							]),
						A2(
							$elm$core$List$map,
							$author$project$Components$Chrome$navLink(route),
							$author$project$Components$Chrome$navItems)),
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('head-tools')
							]),
						_List_fromArray(
							[
								A2(
								$elm$html$Html$time,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('clock'),
										$elm$html$Html$Attributes$datetime(
										$author$project$Components$Chrome$clockIso(now))
									]),
								_List_fromArray(
									[
										$elm$html$Html$text(
										'UTC ' + $author$project$Components$Chrome$clockText(now))
									])),
								A2(
								$elm$html$Html$button,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('search-btn'),
										$elm$html$Html$Attributes$type_('button'),
										$elm$html$Html$Events$onClick(onSearch),
										$elm$html$Html$Attributes$title('search (/)'),
										A2($elm$html$Html$Attributes$attribute, 'aria-label', 'open search')
									]),
								_List_fromArray(
									[
										A2(
										$elm$html$Html$span,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$class('search-glyph'),
												A2($elm$html$Html$Attributes$attribute, 'aria-hidden', 'true')
											]),
										_List_fromArray(
											[
												$elm$html$Html$text('⌕')
											])),
										A2(
										$elm$html$Html$span,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$class('search-key')
											]),
										_List_fromArray(
											[
												$elm$html$Html$text('/')
											]))
									]))
							]))
					]))
			]));
};
var $elm$virtual_dom$VirtualDom$keyedNode = function (tag) {
	return _VirtualDom_keyedNode(
		_VirtualDom_noScript(tag));
};
var $elm$html$Html$Keyed$node = $elm$virtual_dom$VirtualDom$keyedNode;
var $author$project$Main$CopyCode = function (a) {
	return {$: 12, a: a};
};
var $author$project$Main$ScrollToId = function (a) {
	return {$: 13, a: a};
};
var $author$project$Pages$About$about = 'I taught myself to write code at 11, calculus at 14, Lagrangian mechanics at 16. Since then I\u0027ve lived somewhere between C, Zig, CUDA and whatever problem refuses to leave me alone. In two years college takes the \u0022self-taught\u0022 label away from me — I intend to make the most of it while it\u0027s still mine.\u000A\u000AI build [glu](https://github.com/Vixel2006/glu), a robotics middleware in Zig, and [plast](https://github.com/Vixel2006/plast), a deep learning engine in C/CUDA. The long game is a software stack for robotics built from the ground up — no bloat, no abstractions that leak, no corporate rot — with machine intelligence that actually understands physics running on top of it: world models, representation learning, agents that model the world rather than paraphrase the internet.\u000A\u000AThis site is my lab notebook. What I\u0027m building, breaking, reading and failing at — documented as honestly as I can manage.\u000A\u000A---\u000A\u000A## Why robotics\u000A\u000ASoftware that only lives on a screen always felt like half the story. Robots force every abstraction you write to survive contact with physics — timing budgets, sensor noise, gravity. That constraint is exactly what makes the engineering interesting: you can\u0027t argue your way out of a bug that ends with a broken actuator.\u000A\u000A## Why systems\u000A\u000ABecause performance is a design decision, not an afterthought. I like being close enough to the metal to know what the machine is actually doing — allocators, schedulers, syscalls, cache lines. Understanding the whole stack is the difference between *using* tools and *making* them. Zig is currently my favorite place to stand: C-level control, compile-time metaprogramming, and no hidden control flow.\u000A\u000A## Why AI\u000A\u000ANot wrappers — foundations. I care about the training systems, the architectures, and eventually models that hold a predictive representation of the world good enough to act in it. Deep learning gave us perception; world models are how it gets imagination. Someone has to build the infrastructure that makes those trainable at robot timescales — I want to be one of those someones.\u000A\u000A> NOTE: currently on the bench — STM32 boards, a logic analyzer, and more jumper wires than any one desk should contain. Control theory textbooks are winning so far.\u000A\u000A## Things I\u0027m learning right now\u000A\u000A- Embedded systems & electronics\u000A- Control theory\u000A- Reinforcement learning\u000A- World models & representation learning\u000A- Robotics middleware design\u000A- Compilers, slowly and stubbornly\u000A\u000A## What I want to build eventually\u000A\u000A- A complete open software stack for robots, built bottom-up: middleware, control, and learned models designed together instead of stapled apart.\u000A- A robot running entirely on software I wrote — from the wire protocol up to the world model.\u000A- Tooling that makes embodied intelligence cheaper to build, so more people can do it.\u000A\u000A## Contact\u000A\u000AThe fastest way to reach me is [email](mailto:yusufshihata2006@gmail.com). I\u0027m also on [GitHub](https://github.com/Vixel2006), [X](https://x.com/this_vixel) and [LinkedIn](https://www.linkedin.com/in/yusufmohamed2006).\u000A\u000A---\u000A\u000A> webmaster: vixel\u000A> pgp: ask nicely\u000A> uptime: since 2006\u000A> theme: catppuccin mocha, forever';
var $elm$html$Html$h1 = _VirtualDom_node('h1');
var $author$project$Markdown$levelOf = function (block) {
	if (!block.$) {
		var lvl = block.a;
		return $elm$core$Maybe$Just(lvl);
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $elm$core$List$minimum = function (list) {
	if (list.b) {
		var x = list.a;
		var xs = list.b;
		return $elm$core$Maybe$Just(
			A3($elm$core$List$foldl, $elm$core$Basics$min, x, xs));
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $author$project$Markdown$baseLevel = function (blocks) {
	var _v0 = A2($elm$core$List$filterMap, $author$project$Markdown$levelOf, blocks);
	if (!_v0.b) {
		return 1;
	} else {
		var levels = _v0;
		return A2(
			$elm$core$Maybe$withDefault,
			1,
			$elm$core$List$minimum(levels));
	}
};
var $elm$core$String$lines = _String_lines;
var $author$project$Markdown$CodeBlock_ = F3(
	function (a, b, c) {
		return {$: 2, a: a, b: b, c: c};
	});
var $author$project$Markdown$Head = F2(
	function (a, b) {
		return {$: 0, a: a, b: b};
	});
var $author$project$Markdown$Hr = {$: 7};
var $author$project$Markdown$Image = function (a) {
	return {$: 6, a: a};
};
var $author$project$Markdown$ListBlock = F2(
	function (a, b) {
		return {$: 3, a: a, b: b};
	});
var $author$project$Markdown$Para = function (a) {
	return {$: 1, a: a};
};
var $author$project$Markdown$Quote = F2(
	function (a, b) {
		return {$: 4, a: a, b: b};
	});
var $author$project$Markdown$countHashes = function (line) {
	return A2($elm$core$String$startsWith, '#', line) ? (1 + $author$project$Markdown$countHashes(
		A2($elm$core$String$dropLeft, 1, line))) : 0;
};
var $author$project$Markdown$headingLevel = function (line) {
	if (A2($elm$core$String$startsWith, '#', line)) {
		var n = $author$project$Markdown$countHashes(line);
		return (n <= 6) ? n : 0;
	} else {
		return 0;
	}
};
var $elm$core$String$dropRight = F2(
	function (n, string) {
		return (n < 1) ? string : A3($elm$core$String$slice, 0, -n, string);
	});
var $elm$core$String$endsWith = _String_endsWith;
var $author$project$Markdown$imageOf = function (paras) {
	if (paras.b && (!paras.b.b)) {
		var single = paras.a;
		var trimmed = $elm$core$String$trim(single);
		if (A2($elm$core$String$startsWith, '![', trimmed) && A2($elm$core$String$endsWith, ')', trimmed)) {
			var inner = A2(
				$elm$core$String$dropRight,
				1,
				A2($elm$core$String$dropLeft, 2, trimmed));
			var _v1 = A2($elm$core$String$indexes, '](', inner);
			if (_v1.b && (!_v1.b.b)) {
				var i = _v1.a;
				return $elm$core$Maybe$Just(
					{
						ab: A2($elm$core$String$left, i, inner),
						aP: A2($elm$core$String$dropLeft, i + 2, inner)
					});
			} else {
				return $elm$core$Maybe$Nothing;
			}
		} else {
			return $elm$core$Maybe$Nothing;
		}
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $author$project$Markdown$isBullet = function (line) {
	return A2($elm$core$String$startsWith, '- ', line) || A2($elm$core$String$startsWith, '* ', line);
};
var $elm$core$List$member = F2(
	function (x, xs) {
		return A2(
			$elm$core$List$any,
			function (a) {
				return _Utils_eq(a, x);
			},
			xs);
	});
var $author$project$Markdown$isHr = function (line) {
	return A2(
		$elm$core$List$member,
		$elm$core$String$trim(line),
		_List_fromArray(
			['---', '***', '___']));
};
var $author$project$Markdown$isOrderedLine = function (line) {
	var _v0 = $elm$core$List$head(
		A2($elm$core$String$indexes, '. ', line));
	if (!_v0.$) {
		var i = _v0.a;
		return !_Utils_eq(
			$elm$core$String$toInt(
				$elm$core$String$trim(
					A2($elm$core$String$left, i, line))),
			$elm$core$Maybe$Nothing);
	} else {
		return false;
	}
};
var $author$project$Markdown$isTableRow = function (line) {
	return A2($elm$core$String$startsWith, '|', line) && A2(
		$elm$core$String$endsWith,
		'|',
		$elm$core$String$trim(line));
};
var $author$project$Markdown$Table = F2(
	function (a, b) {
		return {$: 5, a: a, b: b};
	});
var $author$project$Markdown$splitRow = function (row) {
	return A2(
		$elm$core$List$map,
		$elm$core$String$trim,
		$elm$core$List$reverse(
			A2(
				$elm$core$List$drop,
				1,
				$elm$core$List$reverse(
					A2(
						$elm$core$List$drop,
						1,
						A2(
							$elm$core$String$split,
							'|',
							$elm$core$String$trim(row)))))));
};
var $author$project$Markdown$parseTable = function (rows) {
	if (rows.b && rows.b.b) {
		var header = rows.a;
		var _v1 = rows.b;
		var sep = _v1.a;
		var bodyRows = _v1.b;
		var isSep = A2(
			$elm$core$List$all,
			function (c) {
				return A2(
					$elm$core$String$all,
					function (ch) {
						return (ch === '-') || ((ch === ':') || (ch === ' '));
					},
					c) && (c !== '');
			},
			$author$project$Markdown$splitRow(sep));
		var headerCells = $author$project$Markdown$splitRow(header);
		var cells = A2($elm$core$List$map, $author$project$Markdown$splitRow, rows);
		return isSep ? $elm$core$Maybe$Just(
			A2(
				$author$project$Markdown$Table,
				headerCells,
				A2($elm$core$List$drop, 1, cells))) : $elm$core$Maybe$Nothing;
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $author$project$Markdown$Note = 1;
var $author$project$Markdown$Pull = 0;
var $author$project$Markdown$Warn = 2;
var $author$project$Markdown$quoteKind = function (lines) {
	var _v0 = $elm$core$List$head(lines);
	if (_v0.$ === 1) {
		return 0;
	} else {
		var first = _v0.a;
		var up = $elm$core$String$toLower(
			$elm$core$String$trim(first));
		return (A2($elm$core$String$startsWith, 'note', up) || A2($elm$core$String$startsWith, '[!note]', up)) ? 1 : ((A2($elm$core$String$startsWith, 'warn', up) || (A2($elm$core$String$startsWith, '[!warning]', up) || A2($elm$core$String$startsWith, '[!warn]', up))) ? 2 : 0);
	}
};
var $author$project$Markdown$stripBullet = function (line) {
	return A2($elm$core$String$dropLeft, 2, line);
};
var $author$project$Markdown$stripOrdered = function (line) {
	var _v0 = $elm$core$List$head(
		A2($elm$core$String$indexes, '. ', line));
	if (!_v0.$) {
		var i = _v0.a;
		return A2($elm$core$String$dropLeft, i + 2, line);
	} else {
		return line;
	}
};
var $elm$core$Maybe$andThen = F2(
	function (callback, maybeValue) {
		if (!maybeValue.$) {
			var value = maybeValue.a;
			return callback(value);
		} else {
			return $elm$core$Maybe$Nothing;
		}
	});
var $elm$core$String$trimLeft = _String_trimLeft;
var $author$project$Markdown$fenceHelp = F4(
	function (lang, file, acc, rest) {
		fenceHelp:
		while (true) {
			if (!rest.b) {
				return {
					a$: A2(
						$elm$core$String$join,
						'\u000A',
						$elm$core$List$reverse(acc)),
					R: file,
					be: lang,
					V: _List_Nil
				};
			} else {
				var line = rest.a;
				var more = rest.b;
				if (A2(
					$elm$core$String$startsWith,
					'```',
					$elm$core$String$trimLeft(line))) {
					return {
						a$: A2(
							$elm$core$String$join,
							'\u000A',
							$elm$core$List$reverse(acc)),
						R: file,
						be: lang,
						V: more
					};
				} else {
					var $temp$lang = lang,
						$temp$file = file,
						$temp$acc = A2($elm$core$List$cons, line, acc),
						$temp$rest = more;
					lang = $temp$lang;
					file = $temp$file;
					acc = $temp$acc;
					rest = $temp$rest;
					continue fenceHelp;
				}
			}
		}
	});
var $elm$core$String$filter = _String_filter;
var $author$project$Markdown$nonEmpty = function (s) {
	return (s === '') ? $elm$core$Maybe$Nothing : $elm$core$Maybe$Just(s);
};
var $author$project$Markdown$takeFence = F2(
	function (opener, rest) {
		var tokens = $elm$core$String$words(
			A2(
				$elm$core$String$filter,
				function (c) {
					return c !== '`';
				},
				$elm$core$String$trim(
					A2($elm$core$String$dropLeft, 3, opener))));
		var lang = A2(
			$elm$core$Maybe$andThen,
			$author$project$Markdown$nonEmpty,
			$elm$core$List$head(tokens));
		var file = function () {
			if (tokens.b && tokens.b.b) {
				var _v1 = tokens.b;
				var f = _v1.a;
				return $author$project$Markdown$nonEmpty(f);
			} else {
				return $elm$core$Maybe$Nothing;
			}
		}();
		return A4($author$project$Markdown$fenceHelp, lang, file, _List_Nil, rest);
	});
var $author$project$Markdown$listHelp = F2(
	function (acc, rest) {
		listHelp:
		while (true) {
			if (!rest.b) {
				return _Utils_Tuple2(
					$elm$core$List$reverse(acc),
					_List_Nil);
			} else {
				var line = rest.a;
				var more = rest.b;
				if ($author$project$Markdown$isBullet(line) || $author$project$Markdown$isOrderedLine(line)) {
					var $temp$acc = A2($elm$core$List$cons, line, acc),
						$temp$rest = more;
					acc = $temp$acc;
					rest = $temp$rest;
					continue listHelp;
				} else {
					return _Utils_Tuple2(
						$elm$core$List$reverse(acc),
						rest);
				}
			}
		}
	});
var $author$project$Markdown$takeList = F2(
	function (first, rest) {
		return A2(
			$author$project$Markdown$listHelp,
			_List_fromArray(
				[first]),
			rest);
	});
var $author$project$Markdown$paraHelp = F2(
	function (acc, rest) {
		paraHelp:
		while (true) {
			if (!rest.b) {
				return _Utils_Tuple2(
					$elm$core$List$reverse(acc),
					_List_Nil);
			} else {
				var line = rest.a;
				var more = rest.b;
				if ($elm$core$String$trim(line) === '') {
					return _Utils_Tuple2(
						$elm$core$List$reverse(acc),
						more);
				} else {
					var $temp$acc = A2($elm$core$List$cons, line, acc),
						$temp$rest = more;
					acc = $temp$acc;
					rest = $temp$rest;
					continue paraHelp;
				}
			}
		}
	});
var $author$project$Markdown$takePara = F2(
	function (line, rest) {
		return A2(
			$author$project$Markdown$paraHelp,
			_List_fromArray(
				[line]),
			rest);
	});
var $author$project$Markdown$stripQuote = function (line) {
	var rest = A2($elm$core$String$dropLeft, 1, line);
	return A2($elm$core$String$startsWith, ' ', rest) ? A2($elm$core$String$dropLeft, 1, rest) : rest;
};
var $author$project$Markdown$quoteHelp = F2(
	function (acc, rest) {
		quoteHelp:
		while (true) {
			if (!rest.b) {
				return _Utils_Tuple2(
					$elm$core$List$reverse(acc),
					_List_Nil);
			} else {
				var line = rest.a;
				var more = rest.b;
				if (A2($elm$core$String$startsWith, '>', line)) {
					var $temp$acc = A2(
						$elm$core$List$cons,
						$author$project$Markdown$stripQuote(line),
						acc),
						$temp$rest = more;
					acc = $temp$acc;
					rest = $temp$rest;
					continue quoteHelp;
				} else {
					return _Utils_Tuple2(
						$elm$core$List$reverse(acc),
						rest);
				}
			}
		}
	});
var $author$project$Markdown$takeQuote = F2(
	function (first, rest) {
		return A2(
			$author$project$Markdown$quoteHelp,
			_List_fromArray(
				[
					$author$project$Markdown$stripQuote(first)
				]),
			rest);
	});
var $author$project$Markdown$tableHelp = F2(
	function (acc, rest) {
		tableHelp:
		while (true) {
			if (!rest.b) {
				return _Utils_Tuple2(
					$elm$core$List$reverse(acc),
					_List_Nil);
			} else {
				var line = rest.a;
				var more = rest.b;
				if ($author$project$Markdown$isTableRow(line)) {
					var $temp$acc = A2($elm$core$List$cons, line, acc),
						$temp$rest = more;
					acc = $temp$acc;
					rest = $temp$rest;
					continue tableHelp;
				} else {
					return _Utils_Tuple2(
						$elm$core$List$reverse(acc),
						rest);
				}
			}
		}
	});
var $author$project$Markdown$takeTable = F2(
	function (first, rest) {
		return A2(
			$author$project$Markdown$tableHelp,
			_List_fromArray(
				[first]),
			rest);
	});
var $author$project$Markdown$parseHelp = F2(
	function (lines, acc) {
		parseHelp:
		while (true) {
			if (!lines.b) {
				return $elm$core$List$reverse(acc);
			} else {
				var line = lines.a;
				var rest = lines.b;
				if (A2($elm$core$String$startsWith, '```', line)) {
					var fence = A2($author$project$Markdown$takeFence, line, rest);
					var $temp$lines = fence.V,
						$temp$acc = A2(
						$elm$core$List$cons,
						A3($author$project$Markdown$CodeBlock_, fence.be, fence.R, fence.a$),
						acc);
					lines = $temp$lines;
					acc = $temp$acc;
					continue parseHelp;
				} else {
					if ($author$project$Markdown$isTableRow(line)) {
						var _v1 = A2($author$project$Markdown$takeTable, line, rest);
						var rows = _v1.a;
						var rest2 = _v1.b;
						var _v2 = $author$project$Markdown$parseTable(rows);
						if (!_v2.$) {
							var t = _v2.a;
							var $temp$lines = rest2,
								$temp$acc = A2($elm$core$List$cons, t, acc);
							lines = $temp$lines;
							acc = $temp$acc;
							continue parseHelp;
						} else {
							var $temp$lines = rest2,
								$temp$acc = A2(
								$elm$core$List$cons,
								$author$project$Markdown$Para(
									A2($elm$core$String$join, ' ', rows)),
								acc);
							lines = $temp$lines;
							acc = $temp$acc;
							continue parseHelp;
						}
					} else {
						if ($author$project$Markdown$headingLevel(line) > 0) {
							var lvl = $author$project$Markdown$headingLevel(line);
							var $temp$lines = rest,
								$temp$acc = A2(
								$elm$core$List$cons,
								A2(
									$author$project$Markdown$Head,
									lvl,
									$elm$core$String$trim(
										A2($elm$core$String$dropLeft, lvl, line))),
								acc);
							lines = $temp$lines;
							acc = $temp$acc;
							continue parseHelp;
						} else {
							if ($author$project$Markdown$isHr(line)) {
								var $temp$lines = rest,
									$temp$acc = A2($elm$core$List$cons, $author$project$Markdown$Hr, acc);
								lines = $temp$lines;
								acc = $temp$acc;
								continue parseHelp;
							} else {
								if ($author$project$Markdown$isBullet(line)) {
									var _v3 = A2($author$project$Markdown$takeList, line, rest);
									var items = _v3.a;
									var rest2 = _v3.b;
									var $temp$lines = rest2,
										$temp$acc = A2(
										$elm$core$List$cons,
										A2(
											$author$project$Markdown$ListBlock,
											false,
											A2($elm$core$List$map, $author$project$Markdown$stripBullet, items)),
										acc);
									lines = $temp$lines;
									acc = $temp$acc;
									continue parseHelp;
								} else {
									if ($author$project$Markdown$isOrderedLine(line)) {
										var _v4 = A2($author$project$Markdown$takeList, line, rest);
										var items = _v4.a;
										var rest2 = _v4.b;
										var $temp$lines = rest2,
											$temp$acc = A2(
											$elm$core$List$cons,
											A2(
												$author$project$Markdown$ListBlock,
												true,
												A2($elm$core$List$map, $author$project$Markdown$stripOrdered, items)),
											acc);
										lines = $temp$lines;
										acc = $temp$acc;
										continue parseHelp;
									} else {
										if (A2($elm$core$String$startsWith, '>', line)) {
											var _v5 = A2($author$project$Markdown$takeQuote, line, rest);
											var paras = _v5.a;
											var rest2 = _v5.b;
											var $temp$lines = rest2,
												$temp$acc = A2(
												$elm$core$List$cons,
												A2(
													$author$project$Markdown$Quote,
													$author$project$Markdown$quoteKind(paras),
													A2($elm$core$String$join, '\u000A', paras)),
												acc);
											lines = $temp$lines;
											acc = $temp$acc;
											continue parseHelp;
										} else {
											if ($elm$core$String$trim(line) === '') {
												var $temp$lines = rest,
													$temp$acc = acc;
												lines = $temp$lines;
												acc = $temp$acc;
												continue parseHelp;
											} else {
												var _v6 = A2($author$project$Markdown$takePara, line, rest);
												var paras = _v6.a;
												var rest2 = _v6.b;
												var _v7 = $author$project$Markdown$imageOf(paras);
												if (!_v7.$) {
													var img = _v7.a;
													var $temp$lines = rest2,
														$temp$acc = A2(
														$elm$core$List$cons,
														$author$project$Markdown$Image(img),
														acc);
													lines = $temp$lines;
													acc = $temp$acc;
													continue parseHelp;
												} else {
													var $temp$lines = rest2,
														$temp$acc = A2(
														$elm$core$List$cons,
														$author$project$Markdown$Para(
															A2($elm$core$String$join, ' ', paras)),
														acc);
													lines = $temp$lines;
													acc = $temp$acc;
													continue parseHelp;
												}
											}
										}
									}
								}
							}
						}
					}
				}
			}
		}
	});
var $author$project$Markdown$parse = function (src) {
	return A2(
		$author$project$Markdown$parseHelp,
		$elm$core$String$lines(src),
		_List_Nil);
};
var $elm$html$Html$Attributes$alt = $elm$html$Html$Attributes$stringProperty('alt');
var $elm$html$Html$aside = _VirtualDom_node('aside');
var $elm$html$Html$blockquote = _VirtualDom_node('blockquote');
var $elm$html$Html$figcaption = _VirtualDom_node('figcaption');
var $elm$html$Html$figure = _VirtualDom_node('figure');
var $elm$html$Html$h2 = _VirtualDom_node('h2');
var $elm$html$Html$h3 = _VirtualDom_node('h3');
var $elm$html$Html$h4 = _VirtualDom_node('h4');
var $author$project$Markdown$Bold = function (a) {
	return {$: 1, a: a};
};
var $author$project$Markdown$Code = function (a) {
	return {$: 3, a: a};
};
var $author$project$Markdown$Italic = function (a) {
	return {$: 2, a: a};
};
var $author$project$Markdown$Link = F2(
	function (a, b) {
		return {$: 4, a: a, b: b};
	});
var $author$project$Markdown$Txt = function (a) {
	return {$: 0, a: a};
};
var $author$project$Markdown$firstMarker = function (str) {
	return $elm$core$List$minimum(
		A2(
			$elm$core$List$filterMap,
			$elm$core$Basics$identity,
			A2(
				$elm$core$List$map,
				function (m) {
					return $elm$core$List$head(
						A2($elm$core$String$indexes, m, str));
				},
				_List_fromArray(
					['**', '*', '`', '[']))));
};
var $author$project$Markdown$segment = F2(
	function (marker, str) {
		var _v0 = $elm$core$List$head(
			A2($elm$core$String$indexes, marker, str));
		if (!_v0.$) {
			var i = _v0.a;
			return $elm$core$Maybe$Just(
				_Utils_Tuple2(
					A2($elm$core$String$left, i, str),
					A2(
						$elm$core$String$dropLeft,
						i + $elm$core$String$length(marker),
						str)));
		} else {
			return $elm$core$Maybe$Nothing;
		}
	});
var $author$project$Markdown$linkSplit = function (str) {
	var _v0 = A2(
		$author$project$Markdown$segment,
		'](',
		A2($elm$core$String$dropLeft, 1, str));
	if (!_v0.$) {
		var _v1 = _v0.a;
		var label = _v1.a;
		var rest = _v1.b;
		var _v2 = A2($author$project$Markdown$segment, ')', rest);
		if (!_v2.$) {
			var _v3 = _v2.a;
			var url = _v3.a;
			var rest2 = _v3.b;
			return $elm$core$Maybe$Just(
				_Utils_Tuple3(url, label, rest2));
		} else {
			return $elm$core$Maybe$Nothing;
		}
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $author$project$Markdown$inline = function (str) {
	if (A2($elm$core$String$startsWith, '**', str)) {
		var _v0 = A2(
			$author$project$Markdown$segment,
			'**',
			A2($elm$core$String$dropLeft, 2, str));
		if (!_v0.$) {
			var _v1 = _v0.a;
			var body = _v1.a;
			var rest = _v1.b;
			return A2(
				$elm$core$List$cons,
				$author$project$Markdown$Bold(
					$author$project$Markdown$inline(body)),
				$author$project$Markdown$inline(rest));
		} else {
			return A2(
				$elm$core$List$cons,
				$author$project$Markdown$Txt('**'),
				$author$project$Markdown$inline(
					A2($elm$core$String$dropLeft, 2, str)));
		}
	} else {
		if (A2($elm$core$String$startsWith, '*', str)) {
			var _v2 = A2(
				$author$project$Markdown$segment,
				'*',
				A2($elm$core$String$dropLeft, 1, str));
			if (!_v2.$) {
				var _v3 = _v2.a;
				var body = _v3.a;
				var rest = _v3.b;
				return A2(
					$elm$core$List$cons,
					$author$project$Markdown$Italic(
						$author$project$Markdown$inline(body)),
					$author$project$Markdown$inline(rest));
			} else {
				return A2(
					$elm$core$List$cons,
					$author$project$Markdown$Txt('*'),
					$author$project$Markdown$inline(
						A2($elm$core$String$dropLeft, 1, str)));
			}
		} else {
			if (A2($elm$core$String$startsWith, '`', str)) {
				var _v4 = A2(
					$author$project$Markdown$segment,
					'`',
					A2($elm$core$String$dropLeft, 1, str));
				if (!_v4.$) {
					var _v5 = _v4.a;
					var body = _v5.a;
					var rest = _v5.b;
					return A2(
						$elm$core$List$cons,
						$author$project$Markdown$Code(body),
						$author$project$Markdown$inline(rest));
				} else {
					return A2(
						$elm$core$List$cons,
						$author$project$Markdown$Txt('`'),
						$author$project$Markdown$inline(
							A2($elm$core$String$dropLeft, 1, str)));
				}
			} else {
				if (A2($elm$core$String$startsWith, '[', str)) {
					var _v6 = $author$project$Markdown$linkSplit(str);
					if (!_v6.$) {
						var _v7 = _v6.a;
						var url = _v7.a;
						var label = _v7.b;
						var rest = _v7.c;
						return A2(
							$elm$core$List$cons,
							A2(
								$author$project$Markdown$Link,
								url,
								$author$project$Markdown$inline(label)),
							$author$project$Markdown$inline(rest));
					} else {
						return A2(
							$elm$core$List$cons,
							$author$project$Markdown$Txt('['),
							$author$project$Markdown$inline(
								A2($elm$core$String$dropLeft, 1, str)));
					}
				} else {
					var _v8 = $author$project$Markdown$firstMarker(str);
					if (!_v8.$) {
						var i = _v8.a;
						return A2(
							$elm$core$List$cons,
							$author$project$Markdown$Txt(
								A2($elm$core$String$left, i, str)),
							$author$project$Markdown$inline(
								A2($elm$core$String$dropLeft, i, str)));
					} else {
						return _List_fromArray(
							[
								$author$project$Markdown$Txt(str)
							]);
					}
				}
			}
		}
	}
};
var $elm$html$Html$code = _VirtualDom_node('code');
var $elm$html$Html$em = _VirtualDom_node('em');
var $elm$html$Html$strong = _VirtualDom_node('strong');
var $author$project$Markdown$renderInline = function (i) {
	switch (i.$) {
		case 0:
			var s = i.a;
			return $elm$html$Html$text(s);
		case 1:
			var c = i.a;
			return A2(
				$elm$html$Html$strong,
				_List_Nil,
				A2($elm$core$List$map, $author$project$Markdown$renderInline, c));
		case 2:
			var c = i.a;
			return A2(
				$elm$html$Html$em,
				_List_Nil,
				A2($elm$core$List$map, $author$project$Markdown$renderInline, c));
		case 3:
			var c = i.a;
			return A2(
				$elm$html$Html$code,
				_List_Nil,
				_List_fromArray(
					[
						$elm$html$Html$text(c)
					]));
		default:
			var url = i.a;
			var c = i.b;
			return A2($elm$core$String$startsWith, '#/', url) ? A2(
				$elm$html$Html$a,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$href(url)
					]),
				A2($elm$core$List$map, $author$project$Markdown$renderInline, c)) : A2(
				$elm$html$Html$a,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$href(url),
						$elm$html$Html$Attributes$target('_blank'),
						$elm$html$Html$Attributes$rel('noopener')
					]),
				A2($elm$core$List$map, $author$project$Markdown$renderInline, c));
	}
};
var $author$project$Markdown$renderInlineAll = function (s) {
	return A2(
		$elm$core$List$map,
		$author$project$Markdown$renderInline,
		$author$project$Markdown$inline(s));
};
var $elm$core$String$fromList = _String_fromList;
var $elm$core$String$foldr = _String_foldr;
var $elm$core$String$toList = function (string) {
	return A3($elm$core$String$foldr, $elm$core$List$cons, _List_Nil, string);
};
var $author$project$Markdown$slug = function (s) {
	return $elm$core$String$fromList(
		A2(
			$elm$core$List$map,
			function (c) {
				return (c === ' ') ? '-' : c;
			},
			A2(
				$elm$core$List$filter,
				function (c) {
					return $elm$core$Char$isAlphaNum(c) || ((c === ' ') || (c === '-'));
				},
				$elm$core$String$toList(
					$elm$core$String$toLower(s)))));
};
var $author$project$Markdown$headingTag = F2(
	function (rendered, rawTitle) {
		var kids = $author$project$Markdown$renderInlineAll(rawTitle);
		var attrs = _List_fromArray(
			[
				$elm$html$Html$Attributes$id(
				$author$project$Markdown$slug(rawTitle))
			]);
		switch (rendered) {
			case 2:
				return A2(
					$elm$html$Html$h2,
					A2(
						$elm$core$List$cons,
						$elm$html$Html$Attributes$class('md-h1'),
						attrs),
					kids);
			case 3:
				return A2(
					$elm$html$Html$h3,
					A2(
						$elm$core$List$cons,
						$elm$html$Html$Attributes$class('md-h2'),
						attrs),
					kids);
			default:
				return A2(
					$elm$html$Html$h4,
					A2(
						$elm$core$List$cons,
						$elm$html$Html$Attributes$class('md-h3'),
						attrs),
					kids);
		}
	});
var $elm$html$Html$hr = _VirtualDom_node('hr');
var $elm$html$Html$img = _VirtualDom_node('img');
var $elm$html$Html$li = _VirtualDom_node('li');
var $author$project$Markdown$afterFirstWord = function (s) {
	return A2(
		$elm$core$String$join,
		' ',
		A2(
			$elm$core$List$drop,
			1,
			$elm$core$String$words(s)));
};
var $elm$core$Basics$composeR = F3(
	function (f, g, x) {
		return g(
			f(x));
	});
var $elm$core$Maybe$map = F2(
	function (f, maybe) {
		if (!maybe.$) {
			var value = maybe.a;
			return $elm$core$Maybe$Just(
				f(value));
		} else {
			return $elm$core$Maybe$Nothing;
		}
	});
var $author$project$Markdown$trimLeadingPunct = function (s) {
	trimLeadingPunct:
	while (true) {
		if (A2($elm$core$String$startsWith, ':', s) || (A2($elm$core$String$startsWith, '-', s) || (A2($elm$core$String$startsWith, '—', s) || A2($elm$core$String$startsWith, ' ', s)))) {
			var $temp$s = A2($elm$core$String$dropLeft, 1, s);
			s = $temp$s;
			continue trimLeadingPunct;
		} else {
			return s;
		}
	}
};
var $author$project$Markdown$markerRemainder = function (line) {
	var trimmed = $elm$core$String$trim(line);
	var lowered = $elm$core$String$toLower(trimmed);
	var body = function () {
		if (A2($elm$core$String$startsWith, '[!', lowered)) {
			var _v0 = A2($elm$core$String$indexes, ']', lowered);
			if (_v0.b) {
				var i = _v0.a;
				return $elm$core$Maybe$Just(
					A2($elm$core$String$dropLeft, i + 1, trimmed));
			} else {
				return $elm$core$Maybe$Nothing;
			}
		} else {
			if (A2($elm$core$String$startsWith, 'note ', lowered) || (A2($elm$core$String$startsWith, 'warning ', lowered) || (A2($elm$core$String$startsWith, 'warn ', lowered) || (A2($elm$core$String$startsWith, 'note:', lowered) || (A2($elm$core$String$startsWith, 'warning:', lowered) || A2($elm$core$String$startsWith, 'warn:', lowered)))))) {
				return $elm$core$Maybe$Just(
					$author$project$Markdown$afterFirstWord(trimmed));
			} else {
				if ((lowered === 'note') || ((lowered === 'warning') || ((lowered === 'warn') || ((lowered === '[!note]') || ((lowered === '[!warning]') || (lowered === '[!warn]')))))) {
					return $elm$core$Maybe$Just('');
				} else {
					return $elm$core$Maybe$Nothing;
				}
			}
		}
	}();
	return A2(
		$elm$core$Maybe$map,
		A2($elm$core$Basics$composeR, $author$project$Markdown$trimLeadingPunct, $elm$core$String$trim),
		body);
};
var $author$project$Markdown$stripMarkerLine = function (lines) {
	if (lines.b) {
		var first = lines.a;
		var rest = lines.b;
		var _v1 = $author$project$Markdown$markerRemainder(first);
		if (!_v1.$) {
			if (_v1.a === '') {
				return rest;
			} else {
				var remainder = _v1.a;
				return A2($elm$core$List$cons, remainder, rest);
			}
		} else {
			return lines;
		}
	} else {
		return _List_Nil;
	}
};
var $author$project$Markdown$noteLines = function (s) {
	return A2(
		$elm$core$List$map,
		function (line) {
			return A2(
				$elm$html$Html$p,
				_List_Nil,
				$author$project$Markdown$renderInlineAll(line));
		},
		$author$project$Markdown$stripMarkerLine(
			A2($elm$core$String$split, '\u000A', s)));
};
var $elm$html$Html$ol = _VirtualDom_node('ol');
var $author$project$Markdown$pad2 = function (n) {
	return A3(
		$elm$core$String$padLeft,
		2,
		'0',
		$elm$core$String$fromInt(n));
};
var $author$project$Markdown$renderedLevel = F2(
	function (base, lvl) {
		var _v0 = lvl - base;
		switch (_v0) {
			case 0:
				return 2;
			case 1:
				return 3;
			default:
				return 4;
		}
	});
var $elm$html$Html$Attributes$src = function (url) {
	return A2(
		$elm$html$Html$Attributes$stringProperty,
		'src',
		_VirtualDom_noJavaScriptOrHtmlUri(url));
};
var $elm$html$Html$table = _VirtualDom_node('table');
var $elm$html$Html$td = _VirtualDom_node('td');
var $author$project$Markdown$tdCell = function (cell) {
	return A2(
		$elm$html$Html$td,
		_List_Nil,
		$author$project$Markdown$renderInlineAll(cell));
};
var $elm$html$Html$tr = _VirtualDom_node('tr');
var $author$project$Markdown$tbodyRow = function (cells) {
	return A2(
		$elm$html$Html$tr,
		_List_Nil,
		A2($elm$core$List$map, $author$project$Markdown$tdCell, cells));
};
var $elm$html$Html$Attributes$scope = $elm$html$Html$Attributes$stringProperty('scope');
var $elm$html$Html$th = _VirtualDom_node('th');
var $author$project$Markdown$thCell = function (cell) {
	return A2(
		$elm$html$Html$th,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$scope('col')
			]),
		$author$project$Markdown$renderInlineAll(cell));
};
var $elm$html$Html$thead = _VirtualDom_node('thead');
var $elm$html$Html$ul = _VirtualDom_node('ul');
var $author$project$Syntax$cFamily = {
	h: false,
	i: '*/',
	f: $elm$core$Maybe$Just('/*'),
	g: false,
	j: _List_fromArray(
		['break', 'case', 'catch', 'class', 'co_await', 'co_return', 'co_yield', 'const', 'constexpr', 'const_cast', 'continue', 'decltype', 'default', 'delete', 'do', 'dynamic_cast', 'else', 'enum', 'explicit', 'export', 'extern', 'false', 'for', 'friend', 'goto', 'if', 'inline', 'mutable', 'namespace', 'new', 'noexcept', 'nullptr', 'operator', 'override', 'private', 'protected', 'public', 'reinterpret_cast', 'requires', 'restrict', 'return', 'sizeof', 'static', 'static_assert', 'static_cast', 'struct', 'switch', 'template', 'this', 'throw', 'true', 'try', 'typedef', 'typename', 'union', 'using', 'virtual', 'volatile', 'while', '__global__', '__device__', '__host__', '__shared__', '__constant__', '__managed__', '__syncthreads', '__forceinline__']),
	k: _List_fromArray(
		['//']),
	l: _List_fromArray(
		['NULL', 'nullptr']),
	n: true,
	o: _List_fromArray(
		['auto', 'bool', 'char', 'char16_t', 'char32_t', 'dim3', 'double', 'float', 'int', 'int8_t', 'int16_t', 'int32_t', 'int64_t', 'long', 'short', 'signed', 'size_t', 'ssize_t', 'unsigned', 'void', 'wchar_t', 'uint8_t', 'uint16_t', 'uint32_t', 'uint64_t', 'uintptr_t', 'ptrdiff_t', 'half', 'float2', 'float4'])
};
var $author$project$Syntax$data = {
	h: false,
	i: '',
	f: $elm$core$Maybe$Nothing,
	g: true,
	j: _List_Nil,
	k: _List_fromArray(
		['#']),
	l: _List_fromArray(
		['true', 'false', 'null', 'yes', 'no', 'on', 'off']),
	n: false,
	o: _List_Nil
};
var $author$project$Syntax$elm = {
	h: false,
	i: '-}',
	f: $elm$core$Maybe$Just('{-'),
	g: false,
	j: _List_fromArray(
		['if', 'then', 'else', 'case', 'of', 'let', 'in', 'where', 'module', 'import', 'exposing', 'type', 'alias', 'port', 'as']),
	k: _List_fromArray(
		['--']),
	l: _List_fromArray(
		['True', 'False']),
	n: false,
	o: _List_Nil
};
var $author$project$Syntax$commonLiterals = _List_fromArray(
	['true', 'false', 'null', 'undefined']);
var $author$project$Syntax$generic = {
	h: false,
	i: '*/',
	f: $elm$core$Maybe$Just('/*'),
	g: false,
	j: _List_fromArray(
		['break', 'case', 'catch', 'class', 'const', 'continue', 'default', 'def', 'do', 'elif', 'else', 'enum', 'except', 'fn', 'for', 'foreach', 'func', 'function', 'if', 'import', 'in', 'lambda', 'let', 'match', 'module', 'namespace', 'new', 'package', 'private', 'protected', 'public', 'pub', 'return', 'static', 'struct', 'switch', 'trait', 'try', 'type', 'typedef', 'union', 'using', 'var', 'while', 'with']),
	k: _List_fromArray(
		['//']),
	l: $author$project$Syntax$commonLiterals,
	n: false,
	o: _List_fromArray(
		['bool', 'char', 'double', 'float', 'int', 'long', 'short', 'string', 'void'])
};
var $author$project$Syntax$go_ = {
	h: false,
	i: '*/',
	f: $elm$core$Maybe$Just('/*'),
	g: false,
	j: _List_fromArray(
		['break', 'case', 'chan', 'const', 'continue', 'default', 'defer', 'else', 'fallthrough', 'for', 'func', 'go', 'goto', 'if', 'import', 'interface', 'map', 'package', 'range', 'return', 'select', 'struct', 'switch', 'type', 'var']),
	k: _List_fromArray(
		['//']),
	l: _List_fromArray(
		['nil', 'true', 'false', 'iota']),
	n: false,
	o: _List_fromArray(
		['bool', 'byte', 'complex64', 'complex128', 'error', 'float32', 'float64', 'int', 'int8', 'int16', 'int32', 'int64', 'rune', 'string', 'uint', 'uint8', 'uint16', 'uint32', 'uint64', 'uintptr', 'any'])
};
var $author$project$Syntax$javascript = {
	h: false,
	i: '*/',
	f: $elm$core$Maybe$Just('/*'),
	g: false,
	j: _List_fromArray(
		['async', 'await', 'break', 'case', 'catch', 'class', 'const', 'continue', 'debugger', 'default', 'delete', 'do', 'else', 'export', 'extends', 'finally', 'for', 'from', 'function', 'if', 'import', 'in', 'instanceof', 'let', 'new', 'of', 'return', 'static', 'super', 'switch', 'this', 'throw', 'try', 'typeof', 'var', 'void', 'while', 'with', 'yield', 'interface', 'enum', 'implements', 'readonly', 'namespace', 'declare']),
	k: _List_fromArray(
		['//']),
	l: $author$project$Syntax$commonLiterals,
	n: false,
	o: _List_fromArray(
		['boolean', 'number', 'string', 'symbol', 'bigint', 'object', 'unknown', 'never', 'Array', 'Promise', 'Map', 'Set'])
};
var $author$project$Syntax$json_ = {
	h: false,
	i: '',
	f: $elm$core$Maybe$Nothing,
	g: false,
	j: _List_Nil,
	k: _List_Nil,
	l: _List_fromArray(
		['true', 'false', 'null']),
	n: false,
	o: _List_Nil
};
var $author$project$Syntax$python = {
	h: true,
	i: '',
	f: $elm$core$Maybe$Nothing,
	g: true,
	j: _List_fromArray(
		['and', 'as', 'assert', 'async', 'await', 'break', 'case', 'class', 'continue', 'def', 'del', 'elif', 'else', 'except', 'finally', 'for', 'from', 'global', 'if', 'import', 'in', 'is', 'lambda', 'match', 'nonlocal', 'not', 'or', 'pass', 'raise', 'return', 'try', 'while', 'with', 'yield']),
	k: _List_fromArray(
		['#']),
	l: _List_fromArray(
		['True', 'False', 'None', 'self', 'cls']),
	n: false,
	o: _List_fromArray(
		['bool', 'bytes', 'dict', 'float', 'frozenset', 'int', 'list', 'object', 'set', 'str', 'tuple', 'Exception', 'BaseException'])
};
var $author$project$Syntax$rust = {
	h: false,
	i: '*/',
	f: $elm$core$Maybe$Just('/*'),
	g: false,
	j: _List_fromArray(
		['as', 'async', 'await', 'break', 'const', 'continue', 'crate', 'dyn', 'else', 'enum', 'extern', 'fn', 'for', 'if', 'impl', 'in', 'let', 'loop', 'match', 'mod', 'move', 'mut', 'pub', 'ref', 'return', 'self', 'Self', 'static', 'struct', 'super', 'trait', 'type', 'unsafe', 'use', 'where', 'while']),
	k: _List_fromArray(
		['//']),
	l: $author$project$Syntax$commonLiterals,
	n: false,
	o: _List_fromArray(
		['bool', 'char', 'f32', 'f64', 'i8', 'i16', 'i32', 'i64', 'i128', 'isize', 'str', 'u8', 'u16', 'u32', 'u64', 'u128', 'usize', 'String', 'Vec', 'Option', 'Result', 'Box'])
};
var $author$project$Syntax$shell = {
	h: false,
	i: '',
	f: $elm$core$Maybe$Nothing,
	g: true,
	j: _List_fromArray(
		['if', 'then', 'elif', 'else', 'fi', 'for', 'while', 'until', 'do', 'done', 'case', 'esac', 'function', 'in', 'select', 'time', 'coproc', 'return', 'break', 'continue', 'exit', 'set', 'unset', 'export', 'local', 'readonly', 'declare']),
	k: _List_fromArray(
		['#']),
	l: _List_fromArray(
		['true', 'false']),
	n: false,
	o: _List_Nil
};
var $author$project$Syntax$zig = {
	h: true,
	i: '',
	f: $elm$core$Maybe$Nothing,
	g: false,
	j: _List_fromArray(
		['align', 'allowzero', 'and', 'anyframe', 'asm', 'async', 'await', 'break', 'callconv', 'catch', 'comptime', 'const', 'continue', 'defer', 'else', 'enum', 'errdefer', 'error', 'export', 'extern', 'fn', 'for', 'if', 'inline', 'noalias', 'nosuspend', 'or', 'orelse', 'packed', 'pub', 'resume', 'return', 'linksection', 'struct', 'suspend', 'switch', 'test', 'threadlocal', 'try', 'union', 'unreachable', 'usingnamespace', 'var', 'volatile', 'while']),
	k: _List_fromArray(
		['//']),
	l: $author$project$Syntax$commonLiterals,
	n: false,
	o: _List_fromArray(
		['bool', 'f16', 'f32', 'f64', 'f128', 'i8', 'i16', 'i32', 'i64', 'i128', 'isize', 'u1', 'u8', 'u16', 'u32', 'u64', 'u128', 'usize', 'void', 'noreturn', 'type', 'anyerror', 'anytype', 'comptime_int', 'comptime_float', 'c_short', 'c_ushort', 'c_int', 'c_uint', 'c_long', 'c_ulong', 'c_longlong', 'c_ulonglong'])
};
var $author$project$Syntax$langFor = function (name) {
	var _v0 = A2(
		$elm$core$Maybe$map,
		A2($elm$core$Basics$composeR, $elm$core$String$toLower, $elm$core$String$trim),
		name);
	if (!_v0.$) {
		var l = _v0.a;
		return A2(
			$elm$core$List$member,
			l,
			_List_fromArray(
				['zig', 'zon'])) ? $author$project$Syntax$zig : (A2(
			$elm$core$List$member,
			l,
			_List_fromArray(
				['c', 'h', 'cpp', 'c++', 'cxx', 'hpp', 'cc', 'cuda', 'cu', 'hip'])) ? $author$project$Syntax$cFamily : (A2(
			$elm$core$List$member,
			l,
			_List_fromArray(
				['python', 'py', 'python3'])) ? $author$project$Syntax$python : ((l === 'go') ? $author$project$Syntax$go_ : (A2(
			$elm$core$List$member,
			l,
			_List_fromArray(
				['rust', 'rs'])) ? $author$project$Syntax$rust : ((l === 'elm') ? $author$project$Syntax$elm : (A2(
			$elm$core$List$member,
			l,
			_List_fromArray(
				['js', 'ts', 'javascript', 'typescript', 'jsx', 'tsx'])) ? $author$project$Syntax$javascript : (A2(
			$elm$core$List$member,
			l,
			_List_fromArray(
				['sh', 'bash', 'shell', 'zsh', 'console'])) ? $author$project$Syntax$shell : ((l === 'json') ? $author$project$Syntax$json_ : (A2(
			$elm$core$List$member,
			l,
			_List_fromArray(
				['yaml', 'yml', 'toml'])) ? $author$project$Syntax$data : $author$project$Syntax$generic)))))))));
	} else {
		return $author$project$Syntax$generic;
	}
};
var $author$project$Syntax$Comment = 1;
var $author$project$Syntax$Deco = 7;
var $author$project$Syntax$Num = 3;
var $author$project$Syntax$Str = 2;
var $author$project$Syntax$Token = F2(
	function (kind, text) {
		return {aC: kind, bz: text};
	});
var $author$project$Syntax$atLineStart = function (buf) {
	if (!buf.b) {
		return true;
	} else {
		var c = buf.a;
		return c === '\n';
	}
};
var $author$project$Syntax$Fn = 6;
var $author$project$Syntax$Kw = 4;
var $author$project$Syntax$Plain = 0;
var $author$project$Syntax$Ty = 5;
var $elm$core$List$isEmpty = function (xs) {
	if (!xs.b) {
		return true;
	} else {
		return false;
	}
};
var $author$project$Syntax$allCaps = function (word) {
	var letters = $elm$core$String$toList(
		A2($elm$core$String$filter, $elm$core$Char$isAlpha, word));
	return (!$elm$core$List$isEmpty(letters)) && A2($elm$core$List$all, $elm$core$Char$isUpper, letters);
};
var $author$project$Syntax$memberStr = F2(
	function (s, list) {
		return A2($elm$core$List$member, s, list);
	});
var $author$project$Syntax$nextNonSpaceIs = F2(
	function (target, rest) {
		nextNonSpaceIs:
		while (true) {
			if (rest.b) {
				var c = rest.a;
				var more = rest.b;
				if ((c === ' ') || (c === '\t')) {
					var $temp$target = target,
						$temp$rest = more;
					target = $temp$target;
					rest = $temp$rest;
					continue nextNonSpaceIs;
				} else {
					return _Utils_eq(c, target);
				}
			} else {
				return false;
			}
		}
	});
var $author$project$Syntax$startsUpper = function (word) {
	var _v0 = $elm$core$String$uncons(word);
	if (!_v0.$) {
		var _v1 = _v0.a;
		var c = _v1.a;
		return $elm$core$Char$isUpper(c);
	} else {
		return false;
	}
};
var $author$project$Syntax$classifyWord = F3(
	function (lang, word, rest) {
		return A2($author$project$Syntax$memberStr, word, lang.j) ? 4 : (A2($author$project$Syntax$memberStr, word, lang.o) ? 5 : (A2($author$project$Syntax$memberStr, word, lang.l) ? 3 : ($author$project$Syntax$allCaps(word) ? 3 : ($author$project$Syntax$startsUpper(word) ? 5 : (A2($author$project$Syntax$nextNonSpaceIs, '(', rest) ? 6 : 0)))));
	});
var $author$project$Syntax$flush = F2(
	function (buf, acc) {
		return $elm$core$List$isEmpty(buf) ? acc : A2(
			$elm$core$List$cons,
			A2(
				$author$project$Syntax$Token,
				0,
				$elm$core$String$fromList(
					$elm$core$List$reverse(buf))),
			acc);
	});
var $author$project$Syntax$isDigit = function (c) {
	return (c >= '0') && (c <= '9');
};
var $author$project$Syntax$isIdentStart = function (c) {
	return $elm$core$Char$isAlpha(c) || (c === '_');
};
var $author$project$Syntax$hasPrefix = F2(
	function (expected, actual) {
		hasPrefix:
		while (true) {
			var _v0 = _Utils_Tuple2(expected, actual);
			if (!_v0.a.b) {
				return true;
			} else {
				if (_v0.b.b) {
					var _v1 = _v0.a;
					var e = _v1.a;
					var es = _v1.b;
					var _v2 = _v0.b;
					var a = _v2.a;
					var as_ = _v2.b;
					if (_Utils_eq(e, a)) {
						var $temp$expected = es,
							$temp$actual = as_;
						expected = $temp$expected;
						actual = $temp$actual;
						continue hasPrefix;
					} else {
						return false;
					}
				} else {
					var _v3 = _v0.a;
					return false;
				}
			}
		}
	});
var $author$project$Syntax$startsStr = F2(
	function (prefix, cursor) {
		return A2(
			$author$project$Syntax$hasPrefix,
			$elm$core$String$toList(prefix),
			cursor);
	});
var $author$project$Syntax$memberStart = F2(
	function (opener, cursor) {
		if (!opener.$) {
			var o = opener.a;
			return A2($author$project$Syntax$startsStr, o, cursor);
		} else {
			return false;
		}
	});
var $author$project$Syntax$nextIsDigit = function (rest) {
	if (rest.b) {
		var c = rest.a;
		return $author$project$Syntax$isDigit(c);
	} else {
		return false;
	}
};
var $author$project$Syntax$nextIsIdentStart = function (rest) {
	if (rest.b) {
		var c = rest.a;
		return $author$project$Syntax$isIdentStart(c);
	} else {
		return false;
	}
};
var $author$project$Syntax$startsAny = F2(
	function (patterns, cursor) {
		return A2(
			$elm$core$List$any,
			function (p) {
				return A2($author$project$Syntax$startsStr, p, cursor);
			},
			patterns);
	});
var $author$project$Syntax$isHexDigit = function (c) {
	return $author$project$Syntax$isDigit(c) || (((c >= 'a') && (c <= 'f')) || ((c >= 'A') && (c <= 'F')));
};
var $author$project$Syntax$takeNumber = F2(
	function (cursor, acc) {
		takeNumber:
		while (true) {
			if (cursor.b) {
				var c = cursor.a;
				var rest = cursor.b;
				if ($author$project$Syntax$isDigit(c) || ($author$project$Syntax$isHexDigit(c) || ((c === '_') || ((c === '.') || (((c === 'x') || (c === 'X')) && A2(
					$elm$core$List$all,
					function (ch) {
						return ch === '0';
					},
					acc)))))) {
					var $temp$cursor = rest,
						$temp$acc = A2($elm$core$List$cons, c, acc);
					cursor = $temp$cursor;
					acc = $temp$acc;
					continue takeNumber;
				} else {
					return _Utils_Tuple2(
						$elm$core$String$fromList(
							$elm$core$List$reverse(acc)),
						cursor);
				}
			} else {
				return _Utils_Tuple2(
					$elm$core$String$fromList(
						$elm$core$List$reverse(acc)),
					_List_Nil);
			}
		}
	});
var $author$project$Syntax$takeString = F3(
	function (quote, cursor, acc) {
		takeString:
		while (true) {
			_v0$3:
			while (true) {
				if (!cursor.b) {
					return _Utils_Tuple2(
						$elm$core$String$fromList(
							$elm$core$List$reverse(acc)),
						_List_Nil);
				} else {
					switch (cursor.a) {
						case '\n':
							var rest = cursor.b;
							return _Utils_Tuple2(
								$elm$core$String$fromList(
									$elm$core$List$reverse(
										A2($elm$core$List$cons, '\n', acc))),
								rest);
						case '\\':
							if (cursor.b.b) {
								var _v1 = cursor.b;
								var esc = _v1.a;
								var rest = _v1.b;
								var $temp$quote = quote,
									$temp$cursor = rest,
									$temp$acc = A2(
									$elm$core$List$cons,
									esc,
									A2($elm$core$List$cons, '\\', acc));
								quote = $temp$quote;
								cursor = $temp$cursor;
								acc = $temp$acc;
								continue takeString;
							} else {
								break _v0$3;
							}
						default:
							break _v0$3;
					}
				}
			}
			var c = cursor.a;
			var rest = cursor.b;
			if (_Utils_eq(c, quote)) {
				return _Utils_Tuple2(
					$elm$core$String$fromList(
						$elm$core$List$reverse(
							A2($elm$core$List$cons, c, acc))),
					rest);
			} else {
				var $temp$quote = quote,
					$temp$cursor = rest,
					$temp$acc = A2($elm$core$List$cons, c, acc);
				quote = $temp$quote;
				cursor = $temp$cursor;
				acc = $temp$acc;
				continue takeString;
			}
		}
	});
var $author$project$Syntax$takeToEol = F2(
	function (cursor, acc) {
		takeToEol:
		while (true) {
			if (!cursor.b) {
				return _Utils_Tuple2(
					$elm$core$String$fromList(
						$elm$core$List$reverse(acc)),
					_List_Nil);
			} else {
				if ('\n' === cursor.a) {
					var rest = cursor.b;
					return _Utils_Tuple2(
						$elm$core$String$fromList(
							$elm$core$List$reverse(
								A2($elm$core$List$cons, '\n', acc))),
						rest);
				} else {
					var c = cursor.a;
					var rest = cursor.b;
					var $temp$cursor = rest,
						$temp$acc = A2($elm$core$List$cons, c, acc);
					cursor = $temp$cursor;
					acc = $temp$acc;
					continue takeToEol;
				}
			}
		}
	});
var $author$project$Syntax$takeUntilStr = F3(
	function (closer, cursor, acc) {
		takeUntilStr:
		while (true) {
			if (A2($author$project$Syntax$startsStr, closer, cursor)) {
				return _Utils_Tuple2(
					$elm$core$String$fromList(
						_Utils_ap(
							$elm$core$List$reverse(acc),
							$elm$core$String$toList(closer))),
					A2(
						$elm$core$List$drop,
						$elm$core$String$length(closer),
						cursor));
			} else {
				if (!cursor.b) {
					return _Utils_Tuple2(
						$elm$core$String$fromList(
							$elm$core$List$reverse(acc)),
						_List_Nil);
				} else {
					var c = cursor.a;
					var rest = cursor.b;
					var $temp$closer = closer,
						$temp$cursor = rest,
						$temp$acc = A2($elm$core$List$cons, c, acc);
					closer = $temp$closer;
					cursor = $temp$cursor;
					acc = $temp$acc;
					continue takeUntilStr;
				}
			}
		}
	});
var $author$project$Syntax$isIdentChar = function (c) {
	return $elm$core$Char$isAlphaNum(c) || (c === '_');
};
var $author$project$Syntax$takeWord = F2(
	function (cursor, acc) {
		takeWord:
		while (true) {
			if (cursor.b) {
				var c = cursor.a;
				var rest = cursor.b;
				if ($author$project$Syntax$isIdentChar(c)) {
					var $temp$cursor = rest,
						$temp$acc = A2($elm$core$List$cons, c, acc);
					cursor = $temp$cursor;
					acc = $temp$acc;
					continue takeWord;
				} else {
					return _Utils_Tuple2(
						$elm$core$List$reverse(acc),
						cursor);
				}
			} else {
				return _Utils_Tuple2(
					$elm$core$List$reverse(acc),
					_List_Nil);
			}
		}
	});
var $author$project$Syntax$push = F6(
	function (kind, text, lang, remaining, buf, acc) {
		return A4(
			$author$project$Syntax$tokHelp,
			lang,
			remaining,
			_List_Nil,
			A2(
				$elm$core$List$cons,
				A2($author$project$Syntax$Token, kind, text),
				A2($author$project$Syntax$flush, buf, acc)));
	});
var $author$project$Syntax$tokHelp = F4(
	function (lang, cursor, buf, acc) {
		tokHelp:
		while (true) {
			if (!cursor.b) {
				return A2($author$project$Syntax$flush, buf, acc);
			} else {
				if ('\\' === cursor.a) {
					var rest = cursor.b;
					var $temp$lang = lang,
						$temp$cursor = rest,
						$temp$buf = A2($elm$core$List$cons, '\\', buf),
						$temp$acc = acc;
					lang = $temp$lang;
					cursor = $temp$cursor;
					buf = $temp$buf;
					acc = $temp$acc;
					continue tokHelp;
				} else {
					var c = cursor.a;
					var rest = cursor.b;
					if (c === '\n') {
						var $temp$lang = lang,
							$temp$cursor = rest,
							$temp$buf = A2($elm$core$List$cons, '\n', buf),
							$temp$acc = acc;
						lang = $temp$lang;
						cursor = $temp$cursor;
						buf = $temp$buf;
						acc = $temp$acc;
						continue tokHelp;
					} else {
						if (A2($author$project$Syntax$startsAny, lang.k, cursor)) {
							var _v1 = A2($author$project$Syntax$takeToEol, cursor, _List_Nil);
							var body = _v1.a;
							var remaining = _v1.b;
							return A6($author$project$Syntax$push, 1, body, lang, remaining, buf, acc);
						} else {
							if (A2($author$project$Syntax$memberStart, lang.f, cursor)) {
								var opener = A2($elm$core$Maybe$withDefault, '', lang.f);
								var afterOpen = A2(
									$elm$core$List$drop,
									$elm$core$String$length(opener),
									cursor);
								var _v2 = A3($author$project$Syntax$takeUntilStr, lang.i, afterOpen, _List_Nil);
								var body = _v2.a;
								var remaining = _v2.b;
								return A6(
									$author$project$Syntax$push,
									1,
									_Utils_ap(opener, body),
									lang,
									remaining,
									buf,
									acc);
							} else {
								if ((c === '"') || ((c === '\'') || (c === '`'))) {
									var _v3 = A3(
										$author$project$Syntax$takeString,
										c,
										A2($elm$core$List$drop, 1, cursor),
										_List_fromArray(
											[c]));
									var body = _v3.a;
									var remaining = _v3.b;
									return A6($author$project$Syntax$push, 2, body, lang, remaining, buf, acc);
								} else {
									if ($author$project$Syntax$isDigit(c) || ((c === '.') && $author$project$Syntax$nextIsDigit(rest))) {
										var _v4 = A2($author$project$Syntax$takeNumber, cursor, _List_Nil);
										var chars = _v4.a;
										var remaining = _v4.b;
										return A6($author$project$Syntax$push, 3, chars, lang, remaining, buf, acc);
									} else {
										if ($author$project$Syntax$isIdentStart(c)) {
											var _v5 = A2($author$project$Syntax$takeWord, cursor, _List_Nil);
											var wordChars = _v5.a;
											var remaining = _v5.b;
											var word = $elm$core$String$fromList(wordChars);
											var kind = A3($author$project$Syntax$classifyWord, lang, word, remaining);
											return A6($author$project$Syntax$push, kind, word, lang, remaining, buf, acc);
										} else {
											if ((c === '@') && (lang.h && $author$project$Syntax$nextIsIdentStart(rest))) {
												var _v6 = A2(
													$author$project$Syntax$takeWord,
													rest,
													_List_fromArray(
														['@']));
												var wordChars = _v6.a;
												var remaining = _v6.b;
												return A6(
													$author$project$Syntax$push,
													7,
													$elm$core$String$fromList(wordChars),
													lang,
													remaining,
													buf,
													acc);
											} else {
												if ((c === '#') && (lang.g || (lang.n && $author$project$Syntax$atLineStart(buf)))) {
													var _v7 = A2($author$project$Syntax$takeToEol, cursor, _List_Nil);
													var body = _v7.a;
													var remaining = _v7.b;
													return A6(
														$author$project$Syntax$push,
														lang.g ? 1 : 7,
														body,
														lang,
														remaining,
														buf,
														acc);
												} else {
													var $temp$lang = lang,
														$temp$cursor = rest,
														$temp$buf = A2($elm$core$List$cons, c, buf),
														$temp$acc = acc;
													lang = $temp$lang;
													cursor = $temp$cursor;
													buf = $temp$buf;
													acc = $temp$acc;
													continue tokHelp;
												}
											}
										}
									}
								}
							}
						}
					}
				}
			}
		}
	});
var $author$project$Syntax$highlight = F2(
	function (langName, src) {
		return $elm$core$List$reverse(
			A4(
				$author$project$Syntax$tokHelp,
				$author$project$Syntax$langFor(langName),
				$elm$core$String$toList(src),
				_List_Nil,
				_List_Nil));
	});
var $elm$virtual_dom$VirtualDom$node = function (tag) {
	return _VirtualDom_node(
		_VirtualDom_noScript(tag));
};
var $elm$html$Html$node = $elm$virtual_dom$VirtualDom$node;
var $author$project$Components$CodeBlock$kindClass = function (kind) {
	switch (kind) {
		case 0:
			return '';
		case 1:
			return 'tk-cm';
		case 2:
			return 'tk-st';
		case 3:
			return 'tk-nu';
		case 4:
			return 'tk-kw';
		case 5:
			return 'tk-ty';
		case 6:
			return 'tk-fn';
		default:
			return 'tk-de';
	}
};
var $author$project$Components$CodeBlock$pieceView = function (_v0) {
	var kind = _v0.a;
	var txt = _v0.b;
	var _v1 = $author$project$Components$CodeBlock$kindClass(kind);
	if (_v1 === '') {
		return $elm$html$Html$text(txt);
	} else {
		var cls = _v1;
		return A2(
			$elm$html$Html$span,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class(cls)
				]),
			_List_fromArray(
				[
					$elm$html$Html$text(txt)
				]));
	}
};
var $author$project$Components$CodeBlock$pieceViews = function (spans) {
	var meaningful = A2(
		$elm$core$List$filter,
		function (_v0) {
			var s = _v0.b;
			return s !== '';
		},
		spans);
	return $elm$core$List$isEmpty(meaningful) ? _List_fromArray(
		[
			$elm$html$Html$text('\u00A0')
		]) : A2($elm$core$List$map, $author$project$Components$CodeBlock$pieceView, meaningful);
};
var $author$project$Components$CodeBlock$lineView = function (spans) {
	return A3(
		$elm$html$Html$node,
		'span',
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('cb-ln')
			]),
		_List_fromArray(
			[
				A3(
				$elm$html$Html$node,
				'span',
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('cb-no'),
						A2($elm$html$Html$Attributes$attribute, 'aria-hidden', 'true')
					]),
				_List_Nil),
				A2(
				$elm$html$Html$span,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('cb-tx')
					]),
				$author$project$Components$CodeBlock$pieceViews(spans))
			]));
};
var $author$project$Components$CodeBlock$suffix = function (filename) {
	if (!filename.$) {
		var f = filename.a;
		return ' (' + (f + ')');
	} else {
		return '';
	}
};
var $elm$html$Html$Attributes$tabindex = function (n) {
	return A2(
		_VirtualDom_attribute,
		'tabIndex',
		$elm$core$String$fromInt(n));
};
var $author$project$Syntax$appendPiece = F3(
	function (kind, seg, acc) {
		if (acc.b) {
			var current = acc.a;
			var rest = acc.b;
			return A2(
				$elm$core$List$cons,
				_Utils_ap(
					current,
					_List_fromArray(
						[
							_Utils_Tuple2(kind, seg)
						])),
				rest);
		} else {
			return _List_fromArray(
				[
					_List_fromArray(
					[
						_Utils_Tuple2(kind, seg)
					])
				]);
		}
	});
var $author$project$Syntax$addSegs = F4(
	function (kind, index, segs, acc) {
		addSegs:
		while (true) {
			if (!segs.b) {
				return acc;
			} else {
				var seg = segs.a;
				var rest = segs.b;
				var openedAcc = (!index) ? acc : A2($elm$core$List$cons, _List_Nil, acc);
				var $temp$kind = kind,
					$temp$index = index + 1,
					$temp$segs = rest,
					$temp$acc = A3($author$project$Syntax$appendPiece, kind, seg, openedAcc);
				kind = $temp$kind;
				index = $temp$index;
				segs = $temp$segs;
				acc = $temp$acc;
				continue addSegs;
			}
		}
	});
var $author$project$Syntax$addToken = F2(
	function (token, acc) {
		return A4(
			$author$project$Syntax$addSegs,
			token.aC,
			0,
			A2($elm$core$String$split, '\u000A', token.bz),
			acc);
	});
var $author$project$Syntax$allEmpty = function (line) {
	return A2(
		$elm$core$List$all,
		function (_v0) {
			var s = _v0.b;
			return s === '';
		},
		line);
};
var $author$project$Syntax$dropLast = function (xs) {
	return $elm$core$List$reverse(
		A2(
			$elm$core$List$drop,
			1,
			$elm$core$List$reverse(xs)));
};
var $author$project$Syntax$toLines = function (tokens) {
	var rawReversed = A3($elm$core$List$foldl, $author$project$Syntax$addToken, _List_Nil, tokens);
	var lines = $elm$core$List$reverse(rawReversed);
	if (lines.b) {
		var last = lines.a;
		return ($author$project$Syntax$allEmpty(last) && ($elm$core$List$length(lines) > 1)) ? $author$project$Syntax$dropLast(lines) : lines;
	} else {
		return _List_Nil;
	}
};
var $author$project$Components$CodeBlock$view = function (_v0) {
	var onCopy = _v0.bh;
	var body = _v0.a$;
	var filename = _v0.a5;
	var lang = _v0.be;
	var index = _v0.ba;
	var lines = $author$project$Syntax$toLines(
		A2($author$project$Syntax$highlight, lang, body));
	var cbId = 'cb-' + $elm$core$String$fromInt(index);
	return A2(
		$elm$html$Html$figure,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('cb')
			]),
		_List_fromArray(
			[
				A2(
				$elm$html$Html$figcaption,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('cb-head')
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$span,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('cb-file')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text(
								A2($elm$core$Maybe$withDefault, '', filename))
							])),
						A2(
						$elm$html$Html$span,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('cb-tools')
							]),
						_List_fromArray(
							[
								A2(
								$elm$html$Html$span,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('cb-lang')
									]),
								_List_fromArray(
									[
										$elm$html$Html$text(
										A2($elm$core$Maybe$withDefault, 'text', lang))
									])),
								A2(
								$elm$html$Html$button,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('cb-copy'),
										$elm$html$Html$Attributes$type_('button'),
										A2($elm$html$Html$Attributes$attribute, 'data-cb-id', cbId),
										$elm$html$Html$Attributes$title('copy to clipboard'),
										A2(
										$elm$html$Html$Attributes$attribute,
										'aria-label',
										'copy code' + $author$project$Components$CodeBlock$suffix(filename)),
										$elm$html$Html$Events$onClick(
										onCopy(
											{a8: cbId, bz: body}))
									]),
								_List_fromArray(
									[
										$elm$html$Html$text('copy')
									]))
							]))
					])),
				A2(
				$elm$html$Html$pre,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('cb-pre'),
						$elm$html$Html$Attributes$tabindex(0)
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$code,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('cb-code')
							]),
						A2($elm$core$List$map, $author$project$Components$CodeBlock$lineView, lines))
					]))
			]));
};
var $author$project$Markdown$viewBlock = F4(
	function (cfg, base, index, block) {
		switch (block.$) {
			case 0:
				var lvl = block.a;
				var rawTitle = block.b;
				return _Utils_Tuple2(
					A2(
						$author$project$Markdown$headingTag,
						A2($author$project$Markdown$renderedLevel, base, lvl),
						rawTitle),
					index);
			case 1:
				var s = block.a;
				return _Utils_Tuple2(
					A2(
						$elm$html$Html$p,
						_List_Nil,
						$author$project$Markdown$renderInlineAll(s)),
					index);
			case 2:
				var lang = block.a;
				var file = block.b;
				var body = block.c;
				return _Utils_Tuple2(
					$author$project$Components$CodeBlock$view(
						{a$: body, a5: file, ba: index, be: lang, bh: cfg.as}),
					index + 1);
			case 3:
				var ordered = block.a;
				var items = block.b;
				return _Utils_Tuple2(
					ordered ? A2(
						$elm$html$Html$ol,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('md-ol')
							]),
						A2(
							$elm$core$List$indexedMap,
							F2(
								function (i, item) {
									return A2(
										$elm$html$Html$li,
										_List_Nil,
										A2(
											$elm$core$List$cons,
											A2(
												$elm$html$Html$span,
												_List_fromArray(
													[
														$elm$html$Html$Attributes$class('md-num'),
														A2($elm$html$Html$Attributes$attribute, 'aria-hidden', 'true')
													]),
												_List_fromArray(
													[
														$elm$html$Html$text(
														$author$project$Markdown$pad2(i + 1))
													])),
											$author$project$Markdown$renderInlineAll(item)));
								}),
							items)) : A2(
						$elm$html$Html$ul,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('md-ul')
							]),
						A2(
							$elm$core$List$map,
							function (item) {
								return A2(
									$elm$html$Html$li,
									_List_Nil,
									A2(
										$elm$core$List$cons,
										A2(
											$elm$html$Html$span,
											_List_fromArray(
												[
													$elm$html$Html$Attributes$class('md-dash'),
													A2($elm$html$Html$Attributes$attribute, 'aria-hidden', 'true')
												]),
											_List_fromArray(
												[
													$elm$html$Html$text('▪')
												])),
										$author$project$Markdown$renderInlineAll(item)));
							},
							items)),
					index);
			case 4:
				var kind = block.a;
				var s = block.b;
				return _Utils_Tuple2(
					function () {
						switch (kind) {
							case 0:
								return A2(
									$elm$html$Html$blockquote,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$class('md-quote')
										]),
									A2(
										$elm$core$List$map,
										function (line) {
											return A2(
												$elm$html$Html$p,
												_List_Nil,
												$author$project$Markdown$renderInlineAll(line));
										},
										A2($elm$core$String$split, '\u000A', s)));
							case 1:
								return A2(
									$elm$html$Html$aside,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$class('md-note md-note-info')
										]),
									A2(
										$elm$core$List$cons,
										A2(
											$elm$html$Html$span,
											_List_fromArray(
												[
													$elm$html$Html$Attributes$class('md-note-tag')
												]),
											_List_fromArray(
												[
													$elm$html$Html$text('NOTE')
												])),
										$author$project$Markdown$noteLines(s)));
							default:
								return A2(
									$elm$html$Html$aside,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$class('md-note md-note-warn')
										]),
									A2(
										$elm$core$List$cons,
										A2(
											$elm$html$Html$span,
											_List_fromArray(
												[
													$elm$html$Html$Attributes$class('md-note-tag')
												]),
											_List_fromArray(
												[
													$elm$html$Html$text('WARNING')
												])),
										$author$project$Markdown$noteLines(s)));
						}
					}(),
					index);
			case 5:
				var header = block.a;
				var rows = block.b;
				return _Utils_Tuple2(
					A2(
						$elm$html$Html$figure,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('md-table-wrap')
							]),
						_List_fromArray(
							[
								A2(
								$elm$html$Html$table,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('md-table')
									]),
								A2(
									$elm$core$List$cons,
									A2(
										$elm$html$Html$thead,
										_List_Nil,
										_List_fromArray(
											[
												A2(
												$elm$html$Html$tr,
												_List_Nil,
												A2($elm$core$List$map, $author$project$Markdown$thCell, header))
											])),
									A2($elm$core$List$map, $author$project$Markdown$tbodyRow, rows)))
							])),
					index);
			case 6:
				var img = block.a;
				return _Utils_Tuple2(
					A2(
						$elm$html$Html$figure,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('md-img')
							]),
						_List_fromArray(
							[
								A2(
								$elm$html$Html$img,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$src(img.aP),
										$elm$html$Html$Attributes$alt(img.ab),
										A2($elm$html$Html$Attributes$attribute, 'loading', 'lazy')
									]),
								_List_Nil),
								A2(
								$elm$html$Html$figcaption,
								_List_Nil,
								_List_fromArray(
									[
										$elm$html$Html$text(img.ab)
									]))
							])),
					index);
			default:
				return _Utils_Tuple2(
					A2(
						$elm$html$Html$hr,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('md-hr')
							]),
						_List_Nil),
					index);
		}
	});
var $author$project$Markdown$renderBlocks = F4(
	function (cfg, base, index, blocks) {
		if (!blocks.b) {
			return _List_Nil;
		} else {
			var b = blocks.a;
			var rest = blocks.b;
			var _v1 = A4($author$project$Markdown$viewBlock, cfg, base, index, b);
			var html = _v1.a;
			var nextIndex = _v1.b;
			return A2(
				$elm$core$List$cons,
				html,
				A4($author$project$Markdown$renderBlocks, cfg, base, nextIndex, rest));
		}
	});
var $author$project$Markdown$render = F2(
	function (cfg, src) {
		var blocks = $author$project$Markdown$parse(src);
		var base = $author$project$Markdown$baseLevel(blocks);
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('md')
				]),
			A4($author$project$Markdown$renderBlocks, cfg, base, 0, blocks));
	});
var $elm$html$Html$section = _VirtualDom_node('section');
var $author$project$Main$aboutPage = A2(
	$elm$html$Html$section,
	_List_fromArray(
		[
			$elm$html$Html$Attributes$class('wrap page doc doc--page')
		]),
	_List_fromArray(
		[
			A2(
			$elm$html$Html$p,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('crumb')
				]),
			_List_fromArray(
				[
					$elm$html$Html$text('~/about')
				])),
			A2(
			$elm$html$Html$h1,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('page-title')
				]),
			_List_fromArray(
				[
					$elm$html$Html$text('ABOUT THE OPERATOR')
				])),
			A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('md doc-body doc-body--wide')
				]),
			_List_fromArray(
				[
					A2(
					$author$project$Markdown$render,
					{as: $author$project$Main$CopyCode},
					$author$project$Pages$About$about)
				]))
		]));
var $elm$html$Html$article = _VirtualDom_node('article');
var $author$project$Pages$Projects$engItem = function (item) {
	return A2(
		$elm$html$Html$li,
		_List_Nil,
		_List_fromArray(
			[
				A2(
				$elm$html$Html$span,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('eng-mark'),
						A2($elm$html$Html$Attributes$attribute, 'aria-hidden', 'true')
					]),
				_List_fromArray(
					[
						$elm$html$Html$text('▸')
					])),
				$elm$html$Html$text(item)
			]));
};
var $author$project$Content$Projects$gluTopology = '  DRIVERS                      GLU BUS                       CONSUMERS\u000A ┌──────────┐   publish    ┌─────────────────┐   subscribe   ┌──────────────┐\u000A │ camera   │ ───────────▶ │ shared mem rings│ ────────────▶ │ control loop │\u000A │ imu      │ ───────────▶ │ io_uring net    │ ────────────▶ │ logger       │\u000A │ teleop   │ ───────────▶ │ discovery       │ ────────────▶ │ telemetry    │\u000A │ ...      │ ───────────▶ │ typed msgs      │ ────────────▶ │ ...          │\u000A └──────────┘              └─────────────────┘               └──────────────┘\u000A        same host: shm, zero copy   ·   off host: tcp/udp over io_uring';
var $author$project$Pages$Projects$pad2 = function (n) {
	return A3(
		$elm$core$String$padLeft,
		2,
		'0',
		$elm$core$String$fromInt(n));
};
var $elm$html$Html$dl = _VirtualDom_node('dl');
var $elm$html$Html$dd = _VirtualDom_node('dd');
var $elm$html$Html$dt = _VirtualDom_node('dt');
var $author$project$Components$Ui$row = function (r) {
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('spec-row')
			]),
		_List_fromArray(
			[
				A2(
				$elm$html$Html$dt,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('spec-key')
					]),
				_List_fromArray(
					[
						$elm$html$Html$text(r.bc)
					])),
				A2(
				$elm$html$Html$dd,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('spec-val')
					]),
				_List_fromArray(
					[
						$elm$html$Html$text(r.bC)
					]))
			]));
};
var $author$project$Components$Ui$specTable = function (rows) {
	return A2(
		$elm$html$Html$dl,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('spec')
			]),
		A2($elm$core$List$map, $author$project$Components$Ui$row, rows));
};
var $author$project$Types$statusClass = function (s) {
	switch (s) {
		case 'active':
			return 'ok';
		case 'production':
			return 'ok';
		case 'stable':
			return 'ok';
		case 'complete':
			return 'ok';
		case 'experimental':
			return 'warn';
		case 'building':
			return 'warn';
		case 'redesigning':
			return 'warn';
		case 'drafting':
			return 'warn';
		case 'unfinished':
			return 'warn';
		case 'research':
			return 'info';
		case 'preprint':
			return 'info';
		case 'exploring':
			return 'info';
		case 'researching':
			return 'info';
		case 'ongoing':
			return 'info';
		default:
			return 'dim';
	}
};
var $author$project$Components$Ui$statusLed = function (s) {
	return A2(
		$elm$html$Html$span,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class(
				'status st-' + $author$project$Types$statusClass(s))
			]),
		_List_fromArray(
			[
				A2(
				$elm$html$Html$span,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('status-led'),
						A2($elm$html$Html$Attributes$attribute, 'aria-hidden', 'true')
					]),
				_List_Nil),
				$elm$html$Html$text(s)
			]));
};
var $author$project$Pages$Projects$dossier = F2(
	function (i, proj) {
		return A2(
			$elm$html$Html$article,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('dossier'),
					$elm$html$Html$Attributes$id('proj-' + proj.a8)
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$aside,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('dos-rail')
						]),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$span,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('dos-no'),
									A2($elm$html$Html$Attributes$attribute, 'aria-hidden', 'true')
								]),
							_List_fromArray(
								[
									$elm$html$Html$text(
									'P.' + $author$project$Pages$Projects$pad2(i + 1))
								])),
							$author$project$Components$Ui$statusLed(proj.M),
							$author$project$Components$Ui$specTable(
							_List_fromArray(
								[
									{bc: 'domain', bC: proj.P},
									{bc: 'lang', bC: proj.be},
									{bc: 'period', bC: proj.T}
								])),
							A2(
							$elm$html$Html$div,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('dos-stack')
								]),
							A2(
								$elm$core$List$map,
								function (s) {
									return A2(
										$elm$html$Html$span,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$class('tag')
											]),
										_List_fromArray(
											[
												$elm$html$Html$text(s)
											]));
								},
								proj.W))
						])),
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('dos-main')
						]),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$div,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('dos-name-row')
								]),
							_List_fromArray(
								[
									A2(
									$elm$html$Html$h2,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$class('dos-name')
										]),
									_List_fromArray(
										[
											$elm$html$Html$text(proj.S)
										])),
									A2(
									$elm$html$Html$a,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$class('ext-link'),
											$elm$html$Html$Attributes$href(proj.aU),
											$elm$html$Html$Attributes$target('_blank'),
											$elm$html$Html$Attributes$rel('noopener'),
											A2($elm$html$Html$Attributes$attribute, 'aria-label', proj.S + (' on ' + proj.Z))
										]),
									_List_fromArray(
										[
											$elm$html$Html$text(proj.Z + ' ↗')
										]))
								])),
							A2(
							$elm$html$Html$p,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('dos-tagline')
								]),
							_List_fromArray(
								[
									$elm$html$Html$text(proj.X)
								])),
							A2(
							$elm$html$Html$h3,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('mini-head')
								]),
							_List_fromArray(
								[
									$elm$html$Html$text('WHY IT EXISTS')
								])),
							A2(
							$elm$html$Html$p,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('dos-why')
								]),
							_List_fromArray(
								[
									$elm$html$Html$text(proj._)
								])),
							A2(
							$elm$html$Html$h3,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('mini-head')
								]),
							_List_fromArray(
								[
									$elm$html$Html$text('ENGINEERING')
								])),
							A2(
							$elm$html$Html$ul,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('eng-list')
								]),
							A2($elm$core$List$map, $author$project$Pages$Projects$engItem, proj.Q)),
							(proj.a8 === 'glu') ? A2(
							$elm$html$Html$figure,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('ascii-diagram')
								]),
							_List_fromArray(
								[
									A2(
									$elm$html$Html$pre,
									_List_Nil,
									_List_fromArray(
										[
											$elm$html$Html$text($author$project$Content$Projects$gluTopology)
										])),
									A2(
									$elm$html$Html$figcaption,
									_List_Nil,
									_List_fromArray(
										[
											$elm$html$Html$text('fig.01 — glu process topology. drawn in ascii because it was good enough for plan9.')
										]))
								])) : $elm$html$Html$text('')
						]))
				]));
	});
var $author$project$Content$Projects$projects = _List_fromArray(
	[
		{
		P: 'robotics middleware',
		Q: _List_fromArray(
			['Shared-memory transport between processes on the same host — zero-copy where it matters most.', 'io_uring on Linux for network I/O; TCP when delivery matters, UDP when latency does.', 'Peer discovery, so nodes find each other without a central master process.', 'Message schemas defined once and turned into code — types checked at compile time, not at runtime.']),
		a8: 'glu',
		be: 'zig',
		S: 'glu',
		T: '2026—',
		W: _List_fromArray(
			['zig', 'posix', 'io_uring', 'shared memory', 'tcp / udp', 'codegen']),
		M: 'active',
		X: 'Robotics communication infrastructure. One binary, predictable latency, no daemon to negotiate with.',
		aU: 'https://github.com/Vixel2006/glu',
		Z: 'source',
		_: 'ROS 2 is incredibly capable, but it drags a decade of abstraction and configuration with it. I wanted to find out how small a robotics communication system could be if it were designed around explicit performance instead of layers of middleware.'
	},
		{
		P: 'deep learning systems',
		Q: _List_fromArray(
			['Hand-optimized CUDA kernels instead of vendor calls everywhere.', 'A graph-based scheduler that owns execution order and memory lifetimes.', 'A minimal JIT backend to strip runtime overhead out of the hot path.', 'Autograd built from first principles, not bolted on.']),
		a8: 'plast',
		be: 'c / cuda',
		S: 'plast',
		T: '2025—',
		W: _List_fromArray(
			['c', 'cuda', 'autograd', 'jit']),
		M: 'redesigning',
		X: 'A deep learning engine written from scratch — no framework magic.',
		aU: 'https://github.com/Vixel2006/plast',
		Z: 'source',
		_: 'I didn\u0027t want to treat the training stack as a black box. Building my own means every autograd edge, kernel launch and allocator decision passes through my hands — which turns \u0022deep learning frameworks\u0022 from magic into machinery I fully understand.'
	},
		{
		P: 'security infrastructure',
		Q: _List_fromArray(
			['Zero-allocation ingestion pipeline for high-concurrency traffic.', 'Detection cascade: fast regex pass, statistical scoring, ML only where it earns its latency.', 'Language-specific SDK middlewares so apps stream events without rerouting their network.', 'Native C core for the hot path; Go for orchestration.']),
		a8: 'argos',
		be: 'go / c',
		S: 'argos',
		T: '2026',
		W: _List_fromArray(
			['go', 'kafka', 'redis', 'c']),
		M: 'production',
		X: 'Real-time API security that parses traffic at line rate.',
		aU: 'https://argossecops.com',
		Z: 'argossecops.com',
		_: 'Started as a hackathon project that deserved to lose. We stripped the AI theater and rebuilt it as an actual engine: a zero-allocation ingestion pipeline feeding a detection core designed to parse traffic at line rate, not after the incident.'
	},
		{
		P: 'research',
		Q: _List_fromArray(
			['Linear-scaling attention variant for fused vision-language sequences.', 'Fusion layer design compared against standard cross-attention baselines.', 'Experiments run on tooling that grew into plast.']),
		a8: 'grf',
		be: 'multimodal learning',
		S: 'grf',
		T: '2026',
		W: _List_fromArray(
			['transformers', 'attention', 'vision-language']),
		M: 'preprint',
		X: 'Multimodal fusion layers with linear-scaling attention for vision-language models.',
		aU: 'https://github.com/Vixel2006/GRF',
		Z: 'preprint',
		_: 'Cross-modal attention gets expensive quadratically as you fuse longer sequences. GRF is an attempt at fusion layers that scale linearly without gutting downstream quality — explored through a pre-print on multimodal fusion in transformer architectures.'
	}
	]);
var $author$project$Pages$Projects$projectsView = function (_v0) {
	return A2(
		$elm$html$Html$section,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('wrap page')
			]),
		_List_fromArray(
			[
				A2(
				$elm$html$Html$p,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('crumb')
					]),
				_List_fromArray(
					[
						$elm$html$Html$text('~/projects')
					])),
				A2(
				$elm$html$Html$h1,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('page-title')
					]),
				_List_fromArray(
					[
						$elm$html$Html$text('PROJECTS')
					])),
				A2(
				$elm$html$Html$p,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('page-intro')
					]),
				_List_fromArray(
					[
						$elm$html$Html$text('Technical artifacts, not demos. Each one exists because I wanted to\u000Aunderstand a layer of the stack by building it myself.')
					])),
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('dossiers')
					]),
				A2($elm$core$List$indexedMap, $author$project$Pages$Projects$dossier, $author$project$Content$Projects$projects))
			]));
};
var $author$project$Content$Projects$research = _List_fromArray(
	[
		{
		aa: 'Working toward predictive models that learn dynamics in latent space — the long-term goal is a robot that imagines the outcome of an action before committing actuators to it.',
		a8: 'world-models',
		aC: 'notes',
		ad: _List_Nil,
		ah: _List_fromArray(
			['Studying JEPA-style predictive architectures versus pixel-reconstruction approaches.', 'Latent rollouts: cheap imagination, but how much physics do they actually retain?', 'glu\u0027s telemetry stream could double as the data plumbing for training such models.']),
		al: _List_fromArray(
			[
				_Utils_Tuple2('project: glu', '#/projects'),
				_Utils_Tuple2('field note: zig', '#/writing/2026-07-09-zig')
			]),
		M: 'exploring',
		aT: 'World models for robot control'
	},
		{
		aa: 'Ongoing notes on representation learning: contrastive versus reconstructive objectives, what a policy actually needs from its encoder, and how much of the world a compressed state can afford to forget.',
		a8: 'representation-learning',
		aC: 'notes',
		ad: _List_Nil,
		ah: _List_fromArray(
			['Contrastive objectives throw away detail — sometimes exactly the detail control needs.', 'Small-scale experiments before scaling: measure what survives compression.']),
		al: _List_fromArray(
			[
				_Utils_Tuple2('project: plast', '#/projects')
			]),
		M: 'ongoing',
		aT: 'What should a representation remember?'
	},
		{
		aa: 'A pre-print on multimodal fusion layers in transformer architectures. Cross-attention cost explodes as fused sequences grow; GRF explores a linear-scaling attention mechanism for vision-language models and measures where it holds up.',
		a8: 'grf-fusion',
		aC: 'paper',
		ad: _List_fromArray(
			[
				_Utils_Tuple2('github.com/Vixel2006/GRF', 'https://github.com/Vixel2006/GRF')
			]),
		ah: _List_fromArray(
			['Attention over the fused sequence drops from quadratic to linear in length.', 'Quality gap measured against standard cross-attention baselines.']),
		al: _List_fromArray(
			[
				_Utils_Tuple2('project: grf', '#/projects'),
				_Utils_Tuple2('project: plast', '#/projects')
			]),
		M: 'preprint',
		aT: 'GRF: multimodal fusion at linear cost'
	}
	]);
var $author$project$Pages$Projects$externalLinks = function (links) {
	return A2(
		$elm$core$List$map,
		function (_v0) {
			var label = _v0.a;
			var url = _v0.b;
			return A2(
				$elm$html$Html$a,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('related-link is-ext'),
						$elm$html$Html$Attributes$href(url),
						$elm$html$Html$Attributes$target('_blank'),
						$elm$html$Html$Attributes$rel('noopener')
					]),
				_List_fromArray(
					[
						$elm$html$Html$text(label + ' ↗')
					]));
		},
		links);
};
var $author$project$Pages$Projects$relatedLink = function (_v0) {
	var label = _v0.a;
	var url = _v0.b;
	return A2(
		$elm$html$Html$a,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('related-link'),
				$elm$html$Html$Attributes$href(url)
			]),
		_List_fromArray(
			[
				$elm$html$Html$text(label)
			]));
};
var $author$project$Pages$Projects$researchEntry = function (entry) {
	return A2(
		$elm$html$Html$article,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('research-entry')
			]),
		_List_fromArray(
			[
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('re-head')
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$span,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('re-kind')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text(entry.aC)
							])),
						$author$project$Components$Ui$statusLed(entry.M)
					])),
				A2(
				$elm$html$Html$h3,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('re-title')
					]),
				_List_fromArray(
					[
						$elm$html$Html$text(entry.aT)
					])),
				A2(
				$elm$html$Html$p,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('re-abstract')
					]),
				_List_fromArray(
					[
						$elm$html$Html$text(entry.aa)
					])),
				A2(
				$elm$html$Html$ul,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('eng-list')
					]),
				A2($elm$core$List$map, $author$project$Pages$Projects$engItem, entry.ah)),
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('related-row')
					]),
				A2(
					$elm$core$List$cons,
					A2(
						$elm$html$Html$span,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('dim related-label')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text('related:')
							])),
					_Utils_ap(
						A2($elm$core$List$map, $author$project$Pages$Projects$relatedLink, entry.al),
						$author$project$Pages$Projects$externalLinks(entry.ad))))
			]));
};
var $author$project$Pages$Projects$researchView = function (_v0) {
	return A2(
		$elm$html$Html$section,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('wrap page')
			]),
		_List_fromArray(
			[
				A2(
				$elm$html$Html$p,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('crumb')
					]),
				_List_fromArray(
					[
						$elm$html$Html$text('~/research')
					])),
				A2(
				$elm$html$Html$h1,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('page-title')
					]),
				_List_fromArray(
					[
						$elm$html$Html$text('OPEN THREADS')
					])),
				A2(
				$elm$html$Html$p,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('page-intro')
					]),
				_List_fromArray(
					[
						$elm$html$Html$text('A lab notebook, not a publication database: questions I\u0027m actively pulling on,\u000Ain various states of being wrong about.')
					])),
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('research-list')
					]),
				A2($elm$core$List$map, $author$project$Pages$Projects$researchEntry, $author$project$Content$Projects$research))
			]));
};
var $author$project$Pages$Home$pad2 = function (n) {
	return A3(
		$elm$core$String$padLeft,
		2,
		'0',
		$elm$core$String$fromInt(n));
};
var $author$project$Components$Ui$sectionHead = F3(
	function (index, title, note) {
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('sec-head')
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$span,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('sec-index'),
							A2($elm$html$Html$Attributes$attribute, 'aria-hidden', 'true')
						]),
					_List_fromArray(
						[
							$elm$html$Html$text('[' + (index + ']'))
						])),
					A2(
					$elm$html$Html$h2,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('sec-title')
						]),
					_List_fromArray(
						[
							$elm$html$Html$text(title)
						])),
					A2(
					$elm$html$Html$span,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('sec-rule'),
							A2($elm$html$Html$Attributes$attribute, 'aria-hidden', 'true')
						]),
					_List_Nil),
					(note === '') ? $elm$html$Html$text('') : A2(
					$elm$html$Html$span,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('sec-count')
						]),
					_List_fromArray(
						[
							$elm$html$Html$text(note)
						]))
				]));
	});
var $elm$core$List$takeReverse = F3(
	function (n, list, kept) {
		takeReverse:
		while (true) {
			if (n <= 0) {
				return kept;
			} else {
				if (!list.b) {
					return kept;
				} else {
					var x = list.a;
					var xs = list.b;
					var $temp$n = n - 1,
						$temp$list = xs,
						$temp$kept = A2($elm$core$List$cons, x, kept);
					n = $temp$n;
					list = $temp$list;
					kept = $temp$kept;
					continue takeReverse;
				}
			}
		}
	});
var $elm$core$List$takeTailRec = F2(
	function (n, list) {
		return $elm$core$List$reverse(
			A3($elm$core$List$takeReverse, n, list, _List_Nil));
	});
var $elm$core$List$takeFast = F3(
	function (ctr, n, list) {
		if (n <= 0) {
			return _List_Nil;
		} else {
			var _v0 = _Utils_Tuple2(n, list);
			_v0$1:
			while (true) {
				_v0$5:
				while (true) {
					if (!_v0.b.b) {
						return list;
					} else {
						if (_v0.b.b.b) {
							switch (_v0.a) {
								case 1:
									break _v0$1;
								case 2:
									var _v2 = _v0.b;
									var x = _v2.a;
									var _v3 = _v2.b;
									var y = _v3.a;
									return _List_fromArray(
										[x, y]);
								case 3:
									if (_v0.b.b.b.b) {
										var _v4 = _v0.b;
										var x = _v4.a;
										var _v5 = _v4.b;
										var y = _v5.a;
										var _v6 = _v5.b;
										var z = _v6.a;
										return _List_fromArray(
											[x, y, z]);
									} else {
										break _v0$5;
									}
								default:
									if (_v0.b.b.b.b && _v0.b.b.b.b.b) {
										var _v7 = _v0.b;
										var x = _v7.a;
										var _v8 = _v7.b;
										var y = _v8.a;
										var _v9 = _v8.b;
										var z = _v9.a;
										var _v10 = _v9.b;
										var w = _v10.a;
										var tl = _v10.b;
										return (ctr > 1000) ? A2(
											$elm$core$List$cons,
											x,
											A2(
												$elm$core$List$cons,
												y,
												A2(
													$elm$core$List$cons,
													z,
													A2(
														$elm$core$List$cons,
														w,
														A2($elm$core$List$takeTailRec, n - 4, tl))))) : A2(
											$elm$core$List$cons,
											x,
											A2(
												$elm$core$List$cons,
												y,
												A2(
													$elm$core$List$cons,
													z,
													A2(
														$elm$core$List$cons,
														w,
														A3($elm$core$List$takeFast, ctr + 1, n - 4, tl)))));
									} else {
										break _v0$5;
									}
							}
						} else {
							if (_v0.a === 1) {
								break _v0$1;
							} else {
								break _v0$5;
							}
						}
					}
				}
				return list;
			}
			var _v1 = _v0.b;
			var x = _v1.a;
			return _List_fromArray(
				[x]);
		}
	});
var $elm$core$List$take = F2(
	function (n, list) {
		return A3($elm$core$List$takeFast, 0, n, list);
	});
var $author$project$Pages$Home$workRow = F2(
	function (i, proj) {
		return A2(
			$elm$html$Html$a,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('work-row'),
					$elm$html$Html$Attributes$href(
					$author$project$Router$href($author$project$Router$Projects)),
					A2($elm$html$Html$Attributes$attribute, 'role', 'listitem'),
					A2($elm$html$Html$Attributes$attribute, 'aria-label', proj.S + (': ' + proj.X))
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$span,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('wr-no'),
							A2($elm$html$Html$Attributes$attribute, 'aria-hidden', 'true')
						]),
					_List_fromArray(
						[
							$elm$html$Html$text(
							$author$project$Pages$Home$pad2(i + 1))
						])),
					$author$project$Components$Ui$statusLed(proj.M),
					A2(
					$elm$html$Html$span,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('wr-name')
						]),
					_List_fromArray(
						[
							$elm$html$Html$text(proj.S)
						])),
					A2(
					$elm$html$Html$span,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('wr-desc')
						]),
					_List_fromArray(
						[
							$elm$html$Html$text(proj.X)
						])),
					A2(
					$elm$html$Html$span,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('wr-stack')
						]),
					_List_fromArray(
						[
							$elm$html$Html$text(
							A2(
								$elm$core$String$join,
								' · ',
								A2($elm$core$List$take, 3, proj.W)))
						])),
					A2(
					$elm$html$Html$span,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('wr-arr'),
							A2($elm$html$Html$Attributes$attribute, 'aria-hidden', 'true')
						]),
					_List_fromArray(
						[
							$elm$html$Html$text('→')
						]))
				]));
	});
var $author$project$Pages$Home$currentWork = A2(
	$elm$html$Html$section,
	_List_fromArray(
		[
			$elm$html$Html$Attributes$class('wrap home-sec')
		]),
	_List_fromArray(
		[
			A3(
			$author$project$Components$Ui$sectionHead,
			'01',
			'CURRENT WORK',
			$author$project$Pages$Home$pad2(
				$elm$core$List$length($author$project$Content$Projects$projects)) + ' PROCESSES'),
			A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('work-table'),
					A2($elm$html$Html$Attributes$attribute, 'role', 'list')
				]),
			A2($elm$core$List$indexedMap, $author$project$Pages$Home$workRow, $author$project$Content$Projects$projects))
		]));
var $author$project$Utils$Text$readMinutes = function (body) {
	return (A2(
		$elm$core$Basics$max,
		1,
		$elm$core$List$length(
			$elm$core$String$words(body)) + 219) / 220) | 0;
};
var $author$project$Pages$Home$fnRow = function (post) {
	return A2(
		$elm$html$Html$a,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('fn-row'),
				$elm$html$Html$Attributes$href(
				$author$project$Router$href(
					$author$project$Router$Post(post.an)))
			]),
		_List_fromArray(
			[
				A2(
				$elm$html$Html$span,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('fnr-date')
					]),
				_List_fromArray(
					[
						$elm$html$Html$text(
						$author$project$Utils$Date$display(post.an))
					])),
				A2(
				$elm$html$Html$span,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('fnr-no')
					]),
				_List_fromArray(
					[
						$elm$html$Html$text(
						'FN-' + $author$project$Pages$Home$pad2(post.bg))
					])),
				A2(
				$elm$html$Html$span,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('fnr-title')
					]),
				_List_fromArray(
					[
						$elm$html$Html$text(post.aT)
					])),
				A2(
				$elm$html$Html$span,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('fnr-time')
					]),
				_List_fromArray(
					[
						$elm$html$Html$text(
						$elm$core$String$fromInt(
							$author$project$Utils$Text$readMinutes(post.a$)) + ' min')
					])),
				A2(
				$elm$html$Html$span,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('wr-arr'),
						A2($elm$html$Html$Attributes$attribute, 'aria-hidden', 'true')
					]),
				_List_fromArray(
					[
						$elm$html$Html$text('→')
					]))
			]));
};
var $author$project$Pages$Home$fieldNotes = A2(
	$elm$html$Html$section,
	_List_fromArray(
		[
			$elm$html$Html$Attributes$class('wrap home-sec')
		]),
	_List_fromArray(
		[
			A3($author$project$Components$Ui$sectionHead, '02', 'FIELD NOTES', 'LATEST'),
			A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('fn-list')
				]),
			A2(
				$elm$core$List$map,
				$author$project$Pages$Home$fnRow,
				A2($elm$core$List$take, 4, $author$project$Content$Posts$posts))),
			A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('more-row')
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$a,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('more-link'),
							$elm$html$Html$Attributes$href(
							$author$project$Router$href($author$project$Router$Writing))
						]),
					_List_fromArray(
						[
							$elm$html$Html$text('full notebook → '),
							A2(
							$elm$html$Html$span,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('dim')
								]),
							_List_fromArray(
								[
									$elm$html$Html$text(
									$elm$core$String$fromInt(
										$elm$core$List$length($author$project$Content$Posts$posts)) + ' entries')
								]))
						]))
				]))
		]));
var $author$project$Content$Site$domains = 'ai / robotics / systems / electronics';
var $author$project$Content$Site$spec = _List_fromArray(
	[
		{bc: 'focus', bC: 'robotics · ml systems'},
		{bc: 'languages', bC: 'zig · c · cuda · python'},
		{bc: 'hardware', bC: 'stm32 · scopes · solder'},
		{bc: 'os', bC: 'linux'},
		{bc: 'tracking', bC: 'none. zero scripts.'}
	]);
var $author$project$Content$Site$statement = 'I build machines, systems, and ideas.';
var $author$project$Content$Site$uptimeLine = 'est. 2006 · self-taught · no institution was consulted';
var $author$project$Pages$Home$hero = A2(
	$elm$html$Html$section,
	_List_fromArray(
		[
			$elm$html$Html$Attributes$class('wrap hero')
		]),
	_List_fromArray(
		[
			A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('hero-main')
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$p,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('hero-kicker')
						]),
					_List_fromArray(
						[
							$elm$html$Html$text('~/index '),
							A2(
							$elm$html$Html$span,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('dim')
								]),
							_List_fromArray(
								[
									$elm$html$Html$text('· ' + $author$project$Content$Site$uptimeLine)
								]))
						])),
					A2(
					$elm$html$Html$h1,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('hero-name')
						]),
					_List_fromArray(
						[
							$elm$html$Html$text('VIXEL'),
							A2(
							$elm$html$Html$span,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('cursor'),
									A2($elm$html$Html$Attributes$attribute, 'aria-hidden', 'true')
								]),
							_List_Nil)
						])),
					A2(
					$elm$html$Html$p,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('hero-statement')
						]),
					_List_fromArray(
						[
							$elm$html$Html$text($author$project$Content$Site$statement)
						])),
					A2(
					$elm$html$Html$p,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('hero-domains')
						]),
					_List_fromArray(
						[
							$elm$html$Html$text($author$project$Content$Site$domains)
						])),
					A2(
					$elm$html$Html$p,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('hero-lede')
						]),
					_List_fromArray(
						[
							$elm$html$Html$text('Curious enough to take things apart. Arrogant enough to rebuild them.\u000ADisciplined enough to document what happens. This site is the documentation half —\u000Aa lab notebook of middleware, runtimes, world models, embedded hardware,\u000Aand the failures between the commits.')
						])),
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('hero-cta')
						]),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$a,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('cta cta-solid'),
									$elm$html$Html$Attributes$href(
									$author$project$Router$href($author$project$Router$Writing))
								]),
							_List_fromArray(
								[
									$elm$html$Html$text('read field notes'),
									A2(
									$elm$html$Html$span,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$class('cta-arr')
										]),
									_List_fromArray(
										[
											$elm$html$Html$text('→')
										]))
								])),
							A2(
							$elm$html$Html$a,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('cta'),
									$elm$html$Html$Attributes$href(
									$author$project$Router$href($author$project$Router$Projects))
								]),
							_List_fromArray(
								[
									$elm$html$Html$text('inspect projects')
								])),
							A2(
							$elm$html$Html$a,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('cta cta-dim'),
									$elm$html$Html$Attributes$href('https://github.com/Vixel2006'),
									$elm$html$Html$Attributes$target('_blank'),
									$elm$html$Html$Attributes$rel('noopener')
								]),
							_List_fromArray(
								[
									$elm$html$Html$text('github ↗')
								]))
						]))
				])),
			A2(
			$elm$html$Html$aside,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('hero-side')
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('spec-box')
						]),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$div,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('spec-head')
								]),
							_List_fromArray(
								[
									A2(
									$elm$html$Html$span,
									_List_Nil,
									_List_fromArray(
										[
											$elm$html$Html$text('SPEC.SYS')
										])),
									A2(
									$elm$html$Html$span,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$class('live'),
											A2($elm$html$Html$Attributes$attribute, 'aria-hidden', 'true')
										]),
									_List_fromArray(
										[
											$elm$html$Html$text('●')
										]))
								])),
							$author$project$Components$Ui$specTable($author$project$Content$Site$spec),
							A2(
							$elm$html$Html$p,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('spec-foot')
								]),
							_List_fromArray(
								[
									A2(
									$elm$html$Html$span,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$class('dim')
										]),
									_List_fromArray(
										[
											$elm$html$Html$text('$ ')
										])),
									$elm$html$Html$text('whoami'),
									A2(
									$elm$html$Html$span,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$class('dim')
										]),
									_List_fromArray(
										[
											$elm$html$Html$text(' → vixel')
										]))
								]))
						]))
				]))
		]));
var $author$project$Pages$Home$latestSlug = function (_v0) {
	var _v1 = $elm$core$List$head($author$project$Content$Posts$posts);
	if (!_v1.$) {
		var p = _v1.a;
		return p.an;
	} else {
		return '';
	}
};
var $author$project$Content$Site$nowFeed = _List_fromArray(
	[
		{au: 'shared-memory transport + io_uring — making robots talk faster than they can move', M: 'active', Y: 'glu'},
		{au: 'latent rollouts, jepa-style objectives — can a network imagine physics?', M: 'researching', Y: 'world models'},
		{au: 'redesign around a graph scheduler that owns memory lifetimes', M: 'building', Y: 'plast v2'},
		{au: 'state-space, LQR, and what PID hides from you', M: 'studying', Y: 'control theory'}
	]);
var $author$project$Pages$Home$nowItem = function (item) {
	return A2(
		$elm$html$Html$li,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('now-item')
			]),
		_List_fromArray(
			[
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('now-top')
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$span,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('now-topic')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text(item.Y)
							])),
						$author$project$Components$Ui$statusLed(item.M)
					])),
				A2(
				$elm$html$Html$p,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('now-detail')
					]),
				_List_fromArray(
					[
						$elm$html$Html$text(item.au)
					]))
			]));
};
var $author$project$Pages$Home$statusNow = function () {
	var totalWords = A3(
		$elm$core$List$foldl,
		F2(
			function (p, acc) {
				return acc + $elm$core$List$length(
					$elm$core$String$words(p.a$));
			}),
		0,
		$author$project$Content$Posts$posts);
	return A2(
		$elm$html$Html$section,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('wrap home-sec')
			]),
		_List_fromArray(
			[
				A3($author$project$Components$Ui$sectionHead, '03', 'STATUS / NOW', 'RUNTIME'),
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('now-grid')
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('now-col')
							]),
						_List_fromArray(
							[
								A2(
								$elm$html$Html$p,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('col-label')
									]),
								_List_fromArray(
									[
										$elm$html$Html$text('OCCUPYING THE WORKBENCH')
									])),
								A2(
								$elm$html$Html$ul,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('now-list')
									]),
								A2($elm$core$List$map, $author$project$Pages$Home$nowItem, $author$project$Content$Site$nowFeed))
							])),
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('now-col')
							]),
						_List_fromArray(
							[
								A2(
								$elm$html$Html$p,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('col-label')
									]),
								_List_fromArray(
									[
										$elm$html$Html$text('NOTEBOOK')
									])),
								$author$project$Components$Ui$specTable(
								_List_fromArray(
									[
										{
										bc: 'entries',
										bC: $elm$core$String$fromInt(
											$elm$core$List$length($author$project$Content$Posts$posts))
									},
										{
										bc: 'words',
										bC: '~' + ($elm$core$String$fromInt((totalWords / 1000) | 0) + 'k')
									},
										{
										bc: 'latest',
										bC: $author$project$Utils$Date$display(
											$author$project$Pages$Home$latestSlug(0))
									},
										{bc: 'feed', bC: 'rss.xml'}
									])),
								A2(
								$elm$html$Html$p,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('now-note')
									]),
								_List_fromArray(
									[
										$elm$html$Html$text('No comments section. If something here is wrong,\u000Athat is what email is for.')
									]))
							]))
					]))
			]));
}();
var $author$project$Pages$Home$view = function (_v0) {
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('home')
			]),
		_List_fromArray(
			[$author$project$Pages$Home$hero, $author$project$Pages$Home$currentWork, $author$project$Pages$Home$fieldNotes, $author$project$Pages$Home$statusNow]));
};
var $author$project$Pages$NotFound$view = function (requestedPath) {
	var path = ((requestedPath === '') || (requestedPath === '/')) ? '/dev/null' : requestedPath;
	return A2(
		$elm$html$Html$section,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('wrap nf')
			]),
		_List_fromArray(
			[
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('nf-term')
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$p,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('nf-line')
							]),
						_List_fromArray(
							[
								A2(
								$elm$html$Html$span,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('nf-prompt')
									]),
								_List_fromArray(
									[
										$elm$html$Html$text('vixel@www:~$ ')
									])),
								A2(
								$elm$html$Html$span,
								_List_Nil,
								_List_fromArray(
									[
										$elm$html$Html$text('cat ' + path)
									]))
							])),
						A2(
						$elm$html$Html$p,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('nf-line nf-err')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text('cat: ' + (path + ': No such file or directory'))
							])),
						A2(
						$elm$html$Html$p,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('nf-line nf-err')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text('[exit code 1 — one process reaped]')
							])),
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('nf-block')
							]),
						_List_fromArray(
							[
								A2(
								$elm$html$Html$p,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('nf-halt')
									]),
								_List_fromArray(
									[
										$elm$html$Html$text('ERROR 404 · REQUESTED OBJECT NOT FOUND')
									])),
								A2(
								$elm$html$Html$p,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('nf-sub dim')
									]),
								_List_fromArray(
									[
										$elm$html$Html$text('core dumped. stack trace follows.')
									]))
							])),
						A2(
						$elm$html$Html$p,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('nf-line nf-causes-head')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text('possible causes:')
							])),
						A2(
						$elm$html$Html$ol,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('nf-causes')
							]),
						_List_fromArray(
							[
								A2(
								$elm$html$Html$li,
								_List_Nil,
								_List_fromArray(
									[
										A2(
										$elm$html$Html$span,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$class('nf-no')
											]),
										_List_fromArray(
											[
												$elm$html$Html$text('01')
											])),
										$elm$html$Html$text(' typo — humans make them, even you')
									])),
								A2(
								$elm$html$Html$li,
								_List_Nil,
								_List_fromArray(
									[
										A2(
										$elm$html$Html$span,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$class('nf-no')
											]),
										_List_fromArray(
											[
												$elm$html$Html$text('02')
											])),
										$elm$html$Html$text(' deleted — probably during a refactor it deserved')
									])),
								A2(
								$elm$html$Html$li,
								_List_Nil,
								_List_fromArray(
									[
										A2(
										$elm$html$Html$span,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$class('nf-no')
											]),
										_List_fromArray(
											[
												$elm$html$Html$text('03')
											])),
										$elm$html$Html$text(' never existed — like that startup\u0027s moat')
									])),
								A2(
								$elm$html$Html$li,
								_List_Nil,
								_List_fromArray(
									[
										A2(
										$elm$html$Html$span,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$class('nf-no')
											]),
										_List_fromArray(
											[
												$elm$html$Html$text('04')
											])),
										$elm$html$Html$text(' reality diverged — checkout a stable branch and try again')
									]))
							])),
						A2(
						$elm$html$Html$p,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('nf-line nf-links')
							]),
						_List_fromArray(
							[
								A2(
								$elm$html$Html$span,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('nf-prompt')
									]),
								_List_fromArray(
									[
										$elm$html$Html$text('$ ')
									])),
								$elm$html$Html$text('cd '),
								A2(
								$elm$html$Html$a,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('nf-link'),
										$elm$html$Html$Attributes$href('#/')
									]),
								_List_fromArray(
									[
										$elm$html$Html$text('~/')
									])),
								$elm$html$Html$text(' && ls '),
								A2(
								$elm$html$Html$a,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('nf-link'),
										$elm$html$Html$Attributes$href('#/writing')
									]),
								_List_fromArray(
									[
										$elm$html$Html$text('writing/')
									])),
								$elm$html$Html$text(' || '),
								A2(
								$elm$html$Html$a,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('nf-link'),
										$elm$html$Html$Attributes$href('#/projects')
									]),
								_List_fromArray(
									[
										$elm$html$Html$text('projects/')
									]))
							])),
						A2(
						$elm$html$Html$p,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('nf-line')
							]),
						_List_fromArray(
							[
								A2(
								$elm$html$Html$span,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('nf-prompt')
									]),
								_List_fromArray(
									[
										$elm$html$Html$text('$ ')
									])),
								A2(
								$elm$html$Html$span,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('cursor'),
										A2($elm$html$Html$Attributes$attribute, 'aria-hidden', 'true')
									]),
								_List_Nil)
							]))
					])),
				A2(
				$elm$html$Html$p,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('nf-foot dim')
					]),
				_List_fromArray(
					[
						$elm$html$Html$text('(the webmaster has been notified. the webmaster is also the one who broke it.)')
					]))
			]));
};
var $author$project$Markdown$plainTitle = function (s) {
	return A3(
		$elm$core$String$replace,
		'`',
		'',
		A3(
			$elm$core$String$replace,
			'*',
			'',
			A3($elm$core$String$replace, '**', '', s)));
};
var $author$project$Markdown$headings = function (src) {
	var blocks = $author$project$Markdown$parse(src);
	var base = $author$project$Markdown$baseLevel(blocks);
	return A2(
		$elm$core$List$filterMap,
		function (block) {
			if (!block.$) {
				var lvl = block.a;
				var title = block.b;
				return $elm$core$Maybe$Just(
					{
						a8: $author$project$Markdown$slug(title),
						aB: _Utils_eq(lvl, base),
						aD: A2($author$project$Markdown$renderedLevel, base, lvl),
						aT: $author$project$Markdown$plainTitle(title)
					});
			} else {
				return $elm$core$Maybe$Nothing;
			}
		},
		blocks);
};
var $elm$virtual_dom$VirtualDom$MayPreventDefault = function (a) {
	return {$: 2, a: a};
};
var $elm$html$Html$Events$preventDefaultOn = F2(
	function (event, decoder) {
		return A2(
			$elm$virtual_dom$VirtualDom$on,
			event,
			$elm$virtual_dom$VirtualDom$MayPreventDefault(decoder));
	});
var $author$project$Pages$Post$tocItem = F2(
	function (onClick, h) {
		return A2(
			$elm$html$Html$li,
			_List_Nil,
			_List_fromArray(
				[
					A2(
					$elm$html$Html$a,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$href('#' + h.a8),
							A2(
							$elm$html$Html$Events$preventDefaultOn,
							'click',
							$elm$json$Json$Decode$succeed(
								_Utils_Tuple2(
									onClick(h.a8),
									true)))
						]),
					_List_fromArray(
						[
							$elm$html$Html$text(h.aT)
						]))
				]));
	});
var $author$project$Pages$Post$navToc = F2(
	function (onClick, items) {
		return A2(
			$elm$html$Html$aside,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('toc'),
					A2($elm$html$Html$Attributes$attribute, 'aria-label', 'table of contents')
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$p,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('toc-head')
						]),
					_List_fromArray(
						[
							$elm$html$Html$text('§ CONTENTS')
						])),
					A2(
					$elm$html$Html$ol,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('toc-list')
						]),
					A2(
						$elm$core$List$map,
						$author$project$Pages$Post$tocItem(onClick),
						items))
				]));
	});
var $author$project$Pages$Post$lookupAt = F2(
	function (i, indexed) {
		return A2(
			$elm$core$Maybe$map,
			$elm$core$Tuple$second,
			$elm$core$List$head(
				A2(
					$elm$core$List$filter,
					function (_v0) {
						var j = _v0.a;
						return _Utils_eq(j, i);
					},
					indexed)));
	});
var $elm$core$Tuple$pair = F2(
	function (a, b) {
		return _Utils_Tuple2(a, b);
	});
var $author$project$Pages$Post$neighboursOf = function (slug) {
	var indexed = A2($elm$core$List$indexedMap, $elm$core$Tuple$pair, $author$project$Content$Posts$posts);
	var _v0 = $elm$core$List$head(
		A2(
			$elm$core$List$filter,
			function (_v1) {
				var p = _v1.b;
				return _Utils_eq(p.an, slug);
			},
			indexed));
	if (!_v0.$) {
		var _v2 = _v0.a;
		var i = _v2.a;
		return {
			ag: A2($author$project$Pages$Post$lookupAt, i - 1, indexed),
			aj: A2($author$project$Pages$Post$lookupAt, i + 1, indexed)
		};
	} else {
		return {ag: $elm$core$Maybe$Nothing, aj: $elm$core$Maybe$Nothing};
	}
};
var $author$project$Pages$Post$pad2 = function (n) {
	return A3(
		$elm$core$String$padLeft,
		2,
		'0',
		$elm$core$String$fromInt(n));
};
var $author$project$Pages$Post$stripTitle = function (body) {
	var _v0 = $elm$core$String$lines(body);
	if (_v0.b) {
		var first = _v0.a;
		var rest = _v0.b;
		return A2($elm$core$String$startsWith, '# ', first) ? A2($elm$core$String$join, '\u000A', rest) : body;
	} else {
		return body;
	}
};
var $author$project$Pages$Post$view = F2(
	function (handlers, slug) {
		var _v0 = $elm$core$List$head(
			A2(
				$elm$core$List$filter,
				function (p) {
					return _Utils_eq(p.an, slug);
				},
				$author$project$Content$Posts$posts));
		if (_v0.$ === 1) {
			return $elm$html$Html$text('');
		} else {
			var post = _v0.a;
			var neighbours = $author$project$Pages$Post$neighboursOf(slug);
			var bodySrc = $author$project$Pages$Post$stripTitle(post.a$);
			var toc = A2(
				$elm$core$List$filter,
				function ($) {
					return $.aB;
				},
				$author$project$Markdown$headings(bodySrc));
			return A2(
				$elm$html$Html$article,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('wrap doc')
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$header,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('doc-head')
							]),
						_List_fromArray(
							[
								A2(
								$elm$html$Html$p,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('crumb')
									]),
								_List_fromArray(
									[
										A2(
										$elm$html$Html$a,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$class('crumb-link'),
												$elm$html$Html$Attributes$href(
												$author$project$Router$href($author$project$Router$Writing))
											]),
										_List_fromArray(
											[
												$elm$html$Html$text('~/writing')
											])),
										$elm$html$Html$text('/' + slug)
									])),
								A2(
								$elm$html$Html$div,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('doc-band')
									]),
								_List_fromArray(
									[
										A2(
										$elm$html$Html$span,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$class('field-no')
											]),
										_List_fromArray(
											[
												$elm$html$Html$text(
												'FIELD NOTE ' + $author$project$Pages$Post$pad2(post.bg))
											])),
										A2(
										$elm$html$Html$span,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$class(
												'status st-' + $author$project$Types$statusClass(post.M))
											]),
										_List_fromArray(
											[
												A2(
												$elm$html$Html$span,
												_List_fromArray(
													[
														$elm$html$Html$Attributes$class('status-led'),
														A2($elm$html$Html$Attributes$attribute, 'aria-hidden', 'true')
													]),
												_List_Nil),
												$elm$html$Html$text(post.M)
											]))
									])),
								A2(
								$elm$html$Html$h1,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('doc-title')
									]),
								_List_fromArray(
									[
										$elm$html$Html$text(post.aT)
									])),
								$author$project$Components$Ui$specTable(
								_List_fromArray(
									[
										{
										bc: 'published',
										bC: $author$project$Utils$Date$display(post.an)
									},
										{
										bc: 'reading',
										bC: $elm$core$String$fromInt(
											$author$project$Utils$Text$readMinutes(post.a$)) + ' min'
									},
										{
										bc: 'topics',
										bC: A2($elm$core$String$join, ' / ', post.aS)
									},
										{
										bc: 'index',
										bC: 'fn-' + $author$project$Pages$Post$pad2(post.bg)
									}
									]))
							])),
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('doc-layout')
							]),
						_List_fromArray(
							[
								A2(
								$elm$html$Html$div,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('md doc-body')
									]),
								_List_fromArray(
									[
										A2(
										$author$project$Markdown$render,
										{as: handlers.as},
										bodySrc)
									])),
								($elm$core$List$length(toc) >= 2) ? A2($author$project$Pages$Post$navToc, handlers.bA, toc) : $elm$html$Html$text('')
							])),
						A2(
						$elm$html$Html$footer,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('doc-end')
							]),
						_List_fromArray(
							[
								A2(
								$elm$html$Html$span,
								_List_fromArray(
									[
										A2($elm$html$Html$Attributes$attribute, 'aria-hidden', 'true')
									]),
								_List_fromArray(
									[
										$elm$html$Html$text(
										'■ END OF DOCUMENT · FN-' + ($author$project$Pages$Post$pad2(post.bg) + ' ■'))
									]))
							])),
						A2(
						$elm$html$Html$nav,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('doc-neighbours'),
								A2($elm$html$Html$Attributes$attribute, 'aria-label', 'more field notes')
							]),
						_Utils_ap(
							_List_fromArray(
								[
									function () {
									var _v1 = neighbours.aj;
									if (!_v1.$) {
										var older = _v1.a;
										return A2(
											$elm$html$Html$a,
											_List_fromArray(
												[
													$elm$html$Html$Attributes$class('nb nb-prev'),
													$elm$html$Html$Attributes$href(
													$author$project$Router$href(
														$author$project$Router$Post(older.an)))
												]),
											_List_fromArray(
												[
													A2(
													$elm$html$Html$span,
													_List_fromArray(
														[
															$elm$html$Html$Attributes$class('nb-dir')
														]),
													_List_fromArray(
														[
															$elm$html$Html$text('← older')
														])),
													A2(
													$elm$html$Html$span,
													_List_fromArray(
														[
															$elm$html$Html$Attributes$class('nb-title')
														]),
													_List_fromArray(
														[
															$elm$html$Html$text(older.aT)
														]))
												]));
									} else {
										return A2(
											$elm$html$Html$span,
											_List_fromArray(
												[
													$elm$html$Html$Attributes$class('nb nb-empty')
												]),
											_List_Nil);
									}
								}()
								]),
							_Utils_ap(
								_List_fromArray(
									[
										A2(
										$elm$html$Html$a,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$class('nb nb-index'),
												$elm$html$Html$Attributes$href(
												$author$project$Router$href($author$project$Router$Writing))
											]),
										_List_fromArray(
											[
												A2(
												$elm$html$Html$span,
												_List_fromArray(
													[
														$elm$html$Html$Attributes$class('nb-dir')
													]),
												_List_fromArray(
													[
														$elm$html$Html$text('↑')
													])),
												A2(
												$elm$html$Html$span,
												_List_fromArray(
													[
														$elm$html$Html$Attributes$class('nb-title')
													]),
												_List_fromArray(
													[
														$elm$html$Html$text('all field notes')
													]))
											]))
									]),
								_List_fromArray(
									[
										function () {
										var _v2 = neighbours.ag;
										if (!_v2.$) {
											var newer = _v2.a;
											return A2(
												$elm$html$Html$a,
												_List_fromArray(
													[
														$elm$html$Html$Attributes$class('nb nb-next'),
														$elm$html$Html$Attributes$href(
														$author$project$Router$href(
															$author$project$Router$Post(newer.an)))
													]),
												_List_fromArray(
													[
														A2(
														$elm$html$Html$span,
														_List_fromArray(
															[
																$elm$html$Html$Attributes$class('nb-dir')
															]),
														_List_fromArray(
															[
																$elm$html$Html$text('newer →')
															])),
														A2(
														$elm$html$Html$span,
														_List_fromArray(
															[
																$elm$html$Html$Attributes$class('nb-title')
															]),
														_List_fromArray(
															[
																$elm$html$Html$text(newer.aT)
															]))
													]));
										} else {
											return A2(
												$elm$html$Html$span,
												_List_fromArray(
													[
														$elm$html$Html$Attributes$class('nb nb-empty')
													]),
												_List_Nil);
										}
									}()
									]))))
					]));
		}
	});
var $author$project$Pages$Writing$pad2 = function (n) {
	return A3(
		$elm$core$String$padLeft,
		2,
		'0',
		$elm$core$String$fromInt(n));
};
var $author$project$Pages$Writing$entry = function (post) {
	return A2(
		$elm$html$Html$a,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('fni-row'),
				$elm$html$Html$Attributes$href(
				$author$project$Router$href(
					$author$project$Router$Post(post.an)))
			]),
		_List_fromArray(
			[
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('fni-meta')
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$span,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('fni-no')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text(
								'FN-' + $author$project$Pages$Writing$pad2(post.bg))
							])),
						A2(
						$elm$html$Html$span,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('dim')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text(' / ')
							])),
						A2(
						$elm$html$Html$time,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$datetime(
								$author$project$Utils$Date$iso(post.an))
							]),
						_List_fromArray(
							[
								$elm$html$Html$text(
								$author$project$Utils$Date$display(post.an))
							])),
						A2(
						$elm$html$Html$span,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('dim')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text(' · ')
							])),
						$elm$html$Html$text(
						$elm$core$String$fromInt(
							$author$project$Utils$Text$readMinutes(post.a$)) + ' min'),
						A2(
						$elm$html$Html$span,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class(
								'fni-status st-' + $author$project$Types$statusClass(post.M))
							]),
						_List_fromArray(
							[
								$elm$html$Html$text(post.M)
							]))
					])),
				A2(
				$elm$html$Html$span,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('fni-title')
					]),
				_List_fromArray(
					[
						$elm$html$Html$text(post.aT)
					])),
				A2(
				$elm$html$Html$p,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('fni-desc')
					]),
				_List_fromArray(
					[
						$elm$html$Html$text(post.a1)
					])),
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('fni-tags')
					]),
				A2(
					$elm$core$List$map,
					function (t) {
						return A2(
							$elm$html$Html$span,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('tag')
								]),
							_List_fromArray(
								[
									$elm$html$Html$text(t)
								]));
					},
					post.aS)),
				A2(
				$elm$html$Html$span,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('wr-arr fni-arr'),
						A2($elm$html$Html$Attributes$attribute, 'aria-hidden', 'true')
					]),
				_List_fromArray(
					[
						$elm$html$Html$text('→')
					]))
			]));
};
var $author$project$Utils$Text$totalWords = function (bodies) {
	return A3(
		$elm$core$List$foldl,
		F2(
			function (b, acc) {
				return acc + $elm$core$List$length(
					$elm$core$String$words(b));
			}),
		0,
		bodies);
};
var $author$project$Pages$Writing$view = function (_v0) {
	var words = $author$project$Utils$Text$totalWords(
		A2(
			$elm$core$List$map,
			function ($) {
				return $.a$;
			},
			$author$project$Content$Posts$posts));
	var count = $elm$core$List$length($author$project$Content$Posts$posts);
	return A2(
		$elm$html$Html$section,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('wrap page')
			]),
		_List_fromArray(
			[
				A2(
				$elm$html$Html$p,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('crumb')
					]),
				_List_fromArray(
					[
						$elm$html$Html$text('~/writing')
					])),
				A2(
				$elm$html$Html$h1,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('page-title')
					]),
				_List_fromArray(
					[
						$elm$html$Html$text('FIELD NOTES')
					])),
				A2(
				$elm$html$Html$p,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('page-intro')
					]),
				_List_fromArray(
					[
						$elm$html$Html$text('An engineering notebook: build logs, post-mortems, opinions with receipts.\u000AEverything documented while the scars are still fresh.')
					])),
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('index-stats'),
						A2($elm$html$Html$Attributes$attribute, 'aria-hidden', 'true')
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$span,
						_List_Nil,
						_List_fromArray(
							[
								$elm$html$Html$text(
								$author$project$Pages$Writing$pad2(count) + ' entries')
							])),
						A2(
						$elm$html$Html$span,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('dim')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text(' · ')
							])),
						A2(
						$elm$html$Html$span,
						_List_Nil,
						_List_fromArray(
							[
								$elm$html$Html$text(
								'~' + ($elm$core$String$fromInt((words / 100) | 0) + '00 words'))
							])),
						A2(
						$elm$html$Html$span,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('dim')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text(' · newest first')
							]))
					])),
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('fn-index')
					]),
				A2($elm$core$List$map, $author$project$Pages$Writing$entry, $author$project$Content$Posts$posts))
			]));
};
var $author$project$Main$pageView = function (model) {
	var _v0 = model.bv;
	switch (_v0.$) {
		case 0:
			return $author$project$Pages$Home$view(0);
		case 1:
			return $author$project$Pages$Writing$view(0);
		case 2:
			var slug = _v0.a;
			return A2(
				$author$project$Pages$Post$view,
				{as: $author$project$Main$CopyCode, bA: $author$project$Main$ScrollToId},
				slug);
		case 3:
			return $author$project$Pages$Projects$projectsView(0);
		case 4:
			return $author$project$Pages$Projects$researchView(0);
		case 5:
			return $author$project$Main$aboutPage;
		default:
			return $author$project$Pages$NotFound$view(model.U);
	}
};
var $author$project$Main$OverlayClick = {$: 11};
var $author$project$Main$PaletteHover = function (a) {
	return {$: 9, a: a};
};
var $author$project$Main$PaletteInput = function (a) {
	return {$: 6, a: a};
};
var $author$project$Main$PaletteKey = function (a) {
	return {$: 7, a: a};
};
var $author$project$Main$PalettePick = function (a) {
	return {$: 8, a: a};
};
var $author$project$Main$PaletteSwallow = {$: 10};
var $elm$html$Html$Attributes$autocomplete = function (bool) {
	return A2(
		$elm$html$Html$Attributes$stringProperty,
		'autocomplete',
		bool ? 'on' : 'off');
};
var $elm$html$Html$input = _VirtualDom_node('input');
var $elm$html$Html$Events$onMouseEnter = function (msg) {
	return A2(
		$elm$html$Html$Events$on,
		'mouseenter',
		$elm$json$Json$Decode$succeed(msg));
};
var $author$project$Components$Palette$itemView = F5(
	function (sel, onPick, onHover, i, s) {
		return A2(
			$elm$html$Html$li,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class(
					'palette-item' + (_Utils_eq(sel, i) ? ' is-active' : '')),
					A2($elm$html$Html$Attributes$attribute, 'role', 'option'),
					A2(
					$elm$html$Html$Attributes$attribute,
					'aria-selected',
					_Utils_eq(sel, i) ? 'true' : 'false'),
					$elm$html$Html$Events$onMouseEnter(
					onHover(i)),
					$elm$html$Html$Events$onClick(
					onPick(i))
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$span,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('pi-kind')
						]),
					_List_fromArray(
						[
							$elm$html$Html$text(s.aC)
						])),
					A2(
					$elm$html$Html$span,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('pi-label')
						]),
					_List_fromArray(
						[
							$elm$html$Html$text(s.bd)
						])),
					A2(
					$elm$html$Html$span,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('pi-detail')
						]),
					_List_fromArray(
						[
							$elm$html$Html$text(s.au)
						]))
				]));
	});
var $author$project$Components$Palette$keyDecoder = function (tag) {
	return A2(
		$elm$json$Json$Decode$map,
		function (key) {
			return _Utils_Tuple2(
				tag(key),
				A2(
					$elm$core$List$member,
					key,
					_List_fromArray(
						['Enter', 'Tab', 'ArrowDown', 'ArrowUp'])));
		},
		A2($elm$json$Json$Decode$field, 'key', $elm$json$Json$Decode$string));
};
var $elm$html$Html$Events$alwaysStop = function (x) {
	return _Utils_Tuple2(x, true);
};
var $elm$virtual_dom$VirtualDom$MayStopPropagation = function (a) {
	return {$: 1, a: a};
};
var $elm$html$Html$Events$stopPropagationOn = F2(
	function (event, decoder) {
		return A2(
			$elm$virtual_dom$VirtualDom$on,
			event,
			$elm$virtual_dom$VirtualDom$MayStopPropagation(decoder));
	});
var $elm$html$Html$Events$targetValue = A2(
	$elm$json$Json$Decode$at,
	_List_fromArray(
		['target', 'value']),
	$elm$json$Json$Decode$string);
var $elm$html$Html$Events$onInput = function (tagger) {
	return A2(
		$elm$html$Html$Events$stopPropagationOn,
		'input',
		A2(
			$elm$json$Json$Decode$map,
			$elm$html$Html$Events$alwaysStop,
			A2($elm$json$Json$Decode$map, tagger, $elm$html$Html$Events$targetValue)));
};
var $elm$html$Html$Attributes$placeholder = $elm$html$Html$Attributes$stringProperty('placeholder');
var $elm$json$Json$Encode$bool = _Json_wrap;
var $elm$html$Html$Attributes$boolProperty = F2(
	function (key, bool) {
		return A2(
			_VirtualDom_property,
			key,
			$elm$json$Json$Encode$bool(bool));
	});
var $elm$html$Html$Attributes$spellcheck = $elm$html$Html$Attributes$boolProperty('spellcheck');
var $elm$html$Html$Attributes$value = $elm$html$Html$Attributes$stringProperty('value');
var $author$project$Components$Palette$view = function (_v0) {
	var onSwallow = _v0.bo;
	var onDismiss = _v0.bi;
	var onHover = _v0.bj;
	var onPick = _v0.bm;
	var onKey = _v0.bl;
	var onInput = _v0.bk;
	var results = _v0.bt;
	var selected = _v0.bw;
	var query = _v0.bs;
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('palette-overlay'),
				$elm$html$Html$Events$onClick(onDismiss)
			]),
		_List_fromArray(
			[
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('palette'),
						A2($elm$html$Html$Attributes$attribute, 'role', 'dialog'),
						A2($elm$html$Html$Attributes$attribute, 'aria-modal', 'true'),
						A2($elm$html$Html$Attributes$attribute, 'aria-label', 'search'),
						A2(
						$elm$html$Html$Events$stopPropagationOn,
						'click',
						$elm$json$Json$Decode$succeed(
							_Utils_Tuple2(onSwallow, true)))
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('palette-inputrow')
							]),
						_List_fromArray(
							[
								A2(
								$elm$html$Html$span,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('palette-prompt'),
										A2($elm$html$Html$Attributes$attribute, 'aria-hidden', 'true')
									]),
								_List_fromArray(
									[
										$elm$html$Html$text('$ grep -i')
									])),
								A2(
								$elm$html$Html$input,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$id('palette-input'),
										$elm$html$Html$Attributes$class('palette-input'),
										$elm$html$Html$Attributes$type_('text'),
										$elm$html$Html$Attributes$value(query),
										$elm$html$Html$Attributes$placeholder('query…'),
										$elm$html$Html$Attributes$spellcheck(false),
										$elm$html$Html$Attributes$autocomplete(false),
										A2($elm$html$Html$Attributes$attribute, 'autocapitalize', 'off'),
										A2($elm$html$Html$Attributes$attribute, 'autocorrect', 'off'),
										A2($elm$html$Html$Attributes$attribute, 'role', 'combobox'),
										A2($elm$html$Html$Attributes$attribute, 'aria-expanded', 'true'),
										A2($elm$html$Html$Attributes$attribute, 'aria-controls', 'palette-listbox'),
										A2($elm$html$Html$Attributes$attribute, 'aria-autocomplete', 'list'),
										A2($elm$html$Html$Attributes$attribute, 'aria-label', 'search the site'),
										$elm$html$Html$Events$onInput(onInput),
										A2(
										$elm$html$Html$Events$preventDefaultOn,
										'keydown',
										$author$project$Components$Palette$keyDecoder(onKey))
									]),
								_List_Nil)
							])),
						A2(
						$elm$html$Html$ul,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('palette-list'),
								$elm$html$Html$Attributes$id('palette-listbox'),
								A2($elm$html$Html$Attributes$attribute, 'role', 'listbox')
							]),
						$elm$core$List$isEmpty(results) ? _List_fromArray(
							[
								A2(
								$elm$html$Html$li,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('palette-item palette-empty'),
										A2($elm$html$Html$Attributes$attribute, 'role', 'option')
									]),
								_List_fromArray(
									[
										A2(
										$elm$html$Html$span,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$class('pi-label')
											]),
										_List_fromArray(
											[
												$elm$html$Html$text('no matches — grep returned nothing')
											]))
									]))
							]) : A2(
							$elm$core$List$indexedMap,
							A3($author$project$Components$Palette$itemView, selected, onPick, onHover),
							results)),
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('palette-foot')
							]),
						_List_fromArray(
							[
								A2(
								$elm$html$Html$span,
								_List_Nil,
								_List_fromArray(
									[
										$elm$html$Html$text('↑↓ select · ⏎ open · esc close')
									])),
								A2(
								$elm$html$Html$span,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('palette-count')
									]),
								_List_fromArray(
									[
										$elm$html$Html$text(
										A3(
											$elm$core$String$padLeft,
											2,
											'0',
											$elm$core$String$fromInt(
												$elm$core$List$length(results))) + ' hits')
									]))
							]))
					]))
			]));
};
var $author$project$Main$paletteView = function (model) {
	return $author$project$Components$Palette$view(
		{
			bi: $author$project$Main$OverlayClick,
			bj: $author$project$Main$PaletteHover,
			bk: $author$project$Main$PaletteInput,
			bl: $author$project$Main$PaletteKey,
			bm: $author$project$Main$PalettePick,
			bo: $author$project$Main$PaletteSwallow,
			bs: model.bs,
			bt: $author$project$Components$Palette$filterSuggestions(model.bs),
			bw: model.bw
		});
};
var $author$project$Main$routeKey = function (route) {
	switch (route.$) {
		case 2:
			var slug = route.a;
			return 'post:' + slug;
		case 6:
			var path = route.a;
			return '404:' + path;
		default:
			var other = route;
			return $author$project$Router$href(other);
	}
};
var $author$project$Main$skipLink = A2(
	$elm$html$Html$a,
	_List_fromArray(
		[
			$elm$html$Html$Attributes$class('skip-link'),
			$elm$html$Html$Attributes$href('#content')
		]),
	_List_fromArray(
		[
			$elm$html$Html$text('skip to content')
		]));
var $author$project$Router$title = function (route) {
	switch (route.$) {
		case 0:
			return 'VIXEL — machines, systems, ideas';
		case 1:
			return 'Field Notes — VIXEL';
		case 2:
			var slug = route.a;
			var _v1 = $elm$core$List$head(
				A2(
					$elm$core$List$filter,
					function (p) {
						return _Utils_eq(p.an, slug);
					},
					$author$project$Content$Posts$posts));
			if (!_v1.$) {
				var post = _v1.a;
				return post.aT + ' — VIXEL';
			} else {
				return 'Not found — VIXEL';
			}
		case 3:
			return 'Projects — VIXEL';
		case 4:
			return 'Research — VIXEL';
		case 5:
			return 'About — VIXEL';
		default:
			return '404 — VIXEL';
	}
};
var $author$project$Main$view = function (model) {
	return {
		a$: _List_fromArray(
			[
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('app'),
						$elm$html$Html$Attributes$classList(
						_List_fromArray(
							[
								_Utils_Tuple2('app--crt', model.K)
							]))
					]),
				_List_fromArray(
					[
						$author$project$Main$skipLink,
						$author$project$Components$Chrome$masthead(
						{bf: model.bf, bn: $author$project$Main$PaletteToggle, bv: model.bv}),
						A2(
						$elm$html$Html$main_,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('site-main'),
								$elm$html$Html$Attributes$id('content')
							]),
						_List_fromArray(
							[
								A3(
								$elm$html$Html$Keyed$node,
								'div',
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('page-swap')
									]),
								_List_fromArray(
									[
										_Utils_Tuple2(
										$author$project$Main$routeKey(model.bv),
										$author$project$Main$pageView(model))
									]))
							])),
						$author$project$Components$Chrome$footerView,
						model.r ? $author$project$Main$paletteView(model) : $elm$html$Html$text('')
					]))
			]),
		aT: $author$project$Router$title(model.bv)
	};
};
var $author$project$Main$main = $elm$browser$Browser$application(
	{bb: $author$project$Main$init, bp: $author$project$Main$UrlChange, bq: $author$project$Main$UrlRequest, bx: $author$project$Main$subscriptions, bB: $author$project$Main$update, bD: $author$project$Main$view});
_Platform_export({'Main':{'init':$author$project$Main$main(
	$elm$json$Json$Decode$succeed(0))(0)}});}(this));