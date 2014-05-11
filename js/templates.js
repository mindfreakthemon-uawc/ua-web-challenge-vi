define(['jade'], function(jade) { if(jade && jade['runtime'] !== undefined) { jade = jade.runtime; }

this["JST"] = this["JST"] || {};

this["JST"]["filters"] = function template(locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;
var locals_ = (locals || {}),filters = locals_.filters;
// iterate filters
;(function(){
  var $$obj = filters;
  if ('number' == typeof $$obj.length) {

    for (var k = 0, $$l = $$obj.length; k < $$l; k++) {
      var v = $$obj[k];

buf.push("<div class=\"radio\"><label><input type=\"radio\" name=\"filterName\"" + (jade.attr("value", v.name, true, false)) + "/>" + (jade.escape(null == (jade_interp = v.label) ? "" : jade_interp)) + "</label></div>");
    }

  } else {
    var $$l = 0;
    for (var k in $$obj) {
      $$l++;      var v = $$obj[k];

buf.push("<div class=\"radio\"><label><input type=\"radio\" name=\"filterName\"" + (jade.attr("value", v.name, true, false)) + "/>" + (jade.escape(null == (jade_interp = v.label) ? "" : jade_interp)) + "</label></div>");
    }

  }
}).call(this);
;return buf.join("");
};

this["JST"]["options"] = function template(locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;
var locals_ = (locals || {}),name = locals_.name,options = locals_.options;
if ( name)
{
// iterate options
;(function(){
  var $$obj = options;
  if ('number' == typeof $$obj.length) {

    for (var k = 0, $$l = $$obj.length; k < $$l; k++) {
      var v = $$obj[k];

buf.push("<div class=\"form-group\">");
if ( v.type === 'checkbox')
{
buf.push("<label class=\"checkbox-inline\">" + (jade.escape(null == (jade_interp = v.label) ? "" : jade_interp)) + "<input" + (jade.attr("type", v.type, true, false)) + (jade.attr("name", k, true, false)) + (jade.attr("checked", v.checked, true, false)) + (jade.cls([v.className], [true])) + "/></label>");
}
else
{
buf.push("<label>" + (jade.escape(null == (jade_interp = v.label) ? "" : jade_interp)) + "</label><input" + (jade.attr("type", v.type, true, false)) + (jade.attr("step", v.step, true, false)) + (jade.attr("min", v.min, true, false)) + (jade.attr("max", v.max, true, false)) + (jade.attr("name", k, true, false)) + (jade.attr("value", v.value, true, false)) + (jade.cls([v.className], [true])) + "/>");
}
buf.push("</div>");
    }

  } else {
    var $$l = 0;
    for (var k in $$obj) {
      $$l++;      var v = $$obj[k];

buf.push("<div class=\"form-group\">");
if ( v.type === 'checkbox')
{
buf.push("<label class=\"checkbox-inline\">" + (jade.escape(null == (jade_interp = v.label) ? "" : jade_interp)) + "<input" + (jade.attr("type", v.type, true, false)) + (jade.attr("name", k, true, false)) + (jade.attr("checked", v.checked, true, false)) + (jade.cls([v.className], [true])) + "/></label>");
}
else
{
buf.push("<label>" + (jade.escape(null == (jade_interp = v.label) ? "" : jade_interp)) + "</label><input" + (jade.attr("type", v.type, true, false)) + (jade.attr("step", v.step, true, false)) + (jade.attr("min", v.min, true, false)) + (jade.attr("max", v.max, true, false)) + (jade.attr("name", k, true, false)) + (jade.attr("value", v.value, true, false)) + (jade.cls([v.className], [true])) + "/>");
}
buf.push("</div>");
    }

  }
}).call(this);

}
else
{
buf.push("<p class=\"text-center\">Select filter</p>");
};return buf.join("");
};

return this["JST"];

});