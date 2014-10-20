(function($) {

  /**
   * Scroll viewport to element
   * @param  {[type]} time [description]
   * @return {[type]}      [description]
   */
  $.fn.scrollTo = function(time) {
    $('html, body').animate({
      scrollTop: $(this).offset().top
    }, 1000);
  };

  /**
   * [emptySelect description]
   * @param  {[type]} emptyMessage [description]
   * @return {[type]}              [description]
   */
  $.fn.emptySelect = function(emptyMessage) {
    $(this).empty()
    if (emptyMessage) {
      $(this).addOpt('', emptyMessage);
    }
  };

  /**
   * [fetchOptions description]
   * @param  {[type]} options [description]
   * @return {[type]}         [description]
   */
  $.fn.fetchOptions = function(options) {
    var defaults = {
      data: false,
      loadingText: 'Cargando...',
      noResultsText: 'No se encontraron resultados',
      formatter: false
    };
    var options = $.extend(defaults, options);
    var $this = $(this);
    $this.empty();
    $this.addOpt('', options.loadingText);
    $.post(options.url, options.data, function(data) {
      $this.empty();
      if (data == null || !data.length) {
        $this.addOpt('', options.noResultsText);
      } else {
        for (var i = 0; i < data.length; i++) {
          if (options.formatter) {
            formatted = options.formatter(data[i]);
            var value = formatted.value;
            var text = formatted.text;
          } else {
            for (var value in data[i]) break;
            var text = data[i][value];
          }
          $this.addOpt(value, text);
        }
      }
    });
  };

  /**
   * [addOpt description]
   * @param {[type]} val  [description]
   * @param {[type]} text [description]
   */
  $.fn.addOption = function(val, text) {
    $(this).append($('<option></option>').val(val).html(text));
  };

  /**
   * [getOpt description]
   * @param  {[type]} val [description]
   * @return {[type]}     [description]
   */
  $.fn.getOpt = function(val) {
    return $(this).find('option[value="' + val + '"]');
  };

  /**
   * [disable description]
   * @return {[type]} [description]
   */
  $.fn.disable = function() {
    $(this).enable(false);
  };

  /**
   * [enable description]
   * @param  {[type]} enable [description]
   * @return {[type]}        [description]
   */
  $.fn.enable = function(enable) {
    if (typeof enable == 'undefined' || enable === null || enable) {
      $(this).removeAttr('disabled');
    } else {
      $(this).attr('disabled', true);
    }
  };

  /**
   * [sortSelect description]
   * @return {[type]} [description]
   */
  $.fn.sortOptions = function(sortByText) {
    sortByText = typeof sortByText !== 'undefined' && sortByText !== false;

    var $this = $(this);
    var selected = $(this).find('option:selected').val();
    var opts = $(this).find('option');
    opts.sort(function(a, b) {
      if (sortByText) {
        if (a.text > b.text) return 1;
        else if (a.text < b.text) return -1;
        else return 0;
      } else {
        return $(a).val() - $(b).val();
      }
    });

    $this.empty().append(opts);
    $this.find('option[value="' + selected + '"]').attr('selected', true);
    $this.prepend($this.find('option[value=""]').remove());
  }

  /**
   * [selEnd description]
   * @return {[type]} [description]
   */
  $.fn.selectToEnd = function() {
    var $this = $(this);
    $this[0].selectionStart = $this[0].selectionEnd = $this.val().length;
  }

  /**
   * [replaceSelDiv description]
   * @param  {[type]} txt [description]
   * @return {[type]}     [description]
   */
  $.fn.replaceSelection = function(txt) {
    var $this = $(this);
    $this.html($this.html().substring(0, $this[0].selectionStart) + txt + $this.html().substring($this[0].selectionEnd));
  }

  /**
   * Get attribute from elements
   * @param  {[type]} attr [description]
   * @return {[type]}      [description]
   */
  $.fn.getAttribute = function(attr) {
    return $(this).map(function() {
      return $(this).attr(attr);
    }).get();
  }

  /**
   * Copy css from another element
   * @param  {[type]} source [description]
   * @return {[type]}        [description]
   */
  $.fn.copyCSS = function(source) {
    var dom = $(source).get(0);
    var dest = {};
    var style, prop;
    if (window.getComputedStyle) {
      var camelize = function(a, b) {
        return b.toUpperCase();
      };
      style = window.getComputedStyle(dom, null);
      if (style) {
        var camel, val;
        if (style.length) {
          for (var i = 0, l = style.length; i < l; i++) {
            prop = style[i];
            camel = prop.replace(/\-([a-z])/, camelize);
            val = style.getPropertyValue(prop);
            dest[camel] = val;
          }
        } else {
          for (prop in style) {
            camel = prop.replace(/\-([a-z])/, camelize);
            val = style.getPropertyValue(prop) || style[prop];
            dest[camel] = val;
          }
        }
        return this.css(dest);
      }
    }
    if (style = dom.currentStyle) {
      for (prop in style) {
        dest[prop] = style[prop];
      }
      return this.css(dest);
    }
    if (style = dom.style) {
      for (prop in style) {
        if (typeof style[prop] != 'function') {
          dest[prop] = style[prop];
        }
      }
    }
    return this.css(dest);
  };

  /**
   * [validateEmail description]
   * @param  {[type]} email [description]
   * @return {[type]}       [description]
   */
  String.prototype.isEmail = function() {
    var email = this;
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  }

  /**
   * Repeat string n times
   * @param  {[type]} num [description]
   * @return {[type]}     [description]
   */
  String.prototype.repeat = function(n) {
    return new Array(n + 1).join(this);
  };

  /**
   * Slugify string
   * @param  {[type]} separator [description]
   * @return {[type]}           [description]
   */
  String.prototype.slug = function(separator) {
    if (typeof separator == 'undefined') {
      separator = '-';
    }
    var str = this.replace(/^\s+|\s+$/g, ''); // trim
    str = str.toLowerCase();
    // remove accents, swap ñ for n, etc
    var from = "ãàáäâẽèéëêìíïîõòóöôùúüûñç·/_,:;";
    var to = "aaaaaeeeeeiiiiooooouuuunc" + separator.repeat(6);
    for (var i = 0, l = from.length; i < l; i++) {
      str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
    }
    str = str.replace(/[^a-z0-9 -]/g, '') // remove invalid chars
    .replace(/\s+/g, separator) // collapse whitespace and replace by -
    .replace(/-+/g, separator); // collapse dashes
    return str;
  };

  /**
   * [stripTags description]
   * @param  {[type]} input   [description]
   * @param  {[type]} allowed [description]
   * @return {[type]}         [description]
   */
  String.prototype.stripTags = function(allowed) {
    var input = this;
    allowed = (((allowed || "") + "").toLowerCase().match(/<[a-z][a-z0-9]*>/g) || []).join('');
    var tags = /<\/?([a-z][a-z0-9]*)\b[^>]*>/gi,
      commentsAndPhpTags = /<!--[\s\S]*?-->|<\?(?:php)?[\s\S]*?\?>/gi;
    return input.replace(commentsAndPhpTags, '').replace(tags, function($0, $1) {
      return allowed.indexOf('<' + $1.toLowerCase() + '>') > -1 ? $0 : '';
    });
  }

  Utils = {};

  /**
   * Run function by name passed as string
   * @param  {[type]} functionName [description]
   * @param  {[type]} context      [description]
   * @return {[type]}              [description]
   */
  Utils.runFn = function(functionName, context /*, args */ ) {
    var args = Array.prototype.slice.call(arguments, 2);
    var namespaces = functionName.split(".");
    var func = namespaces.pop();
    for (var i = 0; i < namespaces.length; i++) {
      context = context[namespaces[i]];
    }
    return context[func].apply(context, args);
  }

  /**
   * Check if variable is empty
   * @param  {Object|Number|String} variable
   * @return {String}
   */
  Utils.empty = function(variable) {
    return variable == null || variable == '' || variable == 0;
  }

  /**
   * [here description]
   * @return {[type]} [description]
   */
  Utils.here = function() {
    return location.protocol + '//' + location.host + location.pathname;
  }

  /**
   * Check if n is a number
   * @param  {[type]}  n [description]
   * @return {Boolean}   [description]
   */
  Utils.isNumber = function(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
  }

  /**
   * Check if n is a number
   * @param  {[type]}  n [description]
   * @return {Boolean}   [description]
   */
  Utils.firstKey = function(obj) {
    for (var prop in obj) {
      return prop;
    }
  }

})(jQuery);
