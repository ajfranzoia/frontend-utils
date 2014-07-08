/**
 * Archivo de funciones en Javascript:
 *
 * - runFn: ejecuta una función pasada como string.
 */

function runFn(functionName, context /*, args */) {
    var args = Array.prototype.slice.call(arguments, 2);
    var namespaces = functionName.split(".");
    var func = namespaces.pop();
    for (var i = 0; i < namespaces.length; i++) {
        context = context[namespaces[i]];
    }
    return context[func].apply(context, args);
}

$.fn.emptySelect = function(emptyMessage) {
    $(this).empty();
    if (emptyMessage) {
        $(this).addOpt('', emptyMessage);
    }
};

$.fn.addOpt = function(val, text) {
    $(this).append(
        $('<option></option>').val(val).html(text)
    );
};

$.fn.getOpt = function(val) {
    return $(this).find('option[value="' + val + '"]');
};

$.fn.disable = function() {
    $(this).attr('disabled', true);
};

$.fn.enable = function(enable) {
    if (typeof enable == 'undefined' || enable === null || enable) {
        $(this).removeAttr('disabled');
    }
    else {
        $(this).disable();
    }
};



function type(o){
    return !!o && Object.prototype.toString.call(o).match(/(\w+)\]/)[1];
}

function undef(v){
    return typeof(v) === 'undefined';
}

$.fn.reset = function () {
  $(this).each (function() { this.reset(); });
}

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
        }
        else {
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

$.fn.sortOptions = function() {
	var options = $(this).find('option');
	options.sort(function(a,b) {
	    if (a.text > b.text) return 1;
	    else if (a.text < b.text) return -1;
	    else return 0
	    //a = $(a).value;
	    //b = b.value;
	    //return a-b;
	});

	$(this).html(options);
}

String.prototype.repeat = function(num) {
    return new Array( num + 1 ).join( this );
};

String.prototype.slug = function(separator) {
	if (typeof separator == 'undefined') {
		separator = '-';
	}

  var str = this.replace(/^\s+|\s+$/g, ''); // trim
  str = str.toLowerCase();

  // remove accents, swap ñ for n, etc
  var from = "ãàáäâẽèéëêìíïîõòóöôùúüûñç·/_,:;";
  var to   = "aaaaaeeeeeiiiiooooouuuunc" + separator.repeat(6);
  for (var i=0, l=from.length ; i<l ; i++) {
    str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
  }

  str = str.replace(/[^a-z0-9 -]/g, '') // remove invalid chars
    .replace(/\s+/g, separator) // collapse whitespace and replace by -
    .replace(/-+/g, separator); // collapse dashes

  return str;
};




function isNumber(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}


$.fn.scrollTo = function(time) {
    $('html, body').animate({
        scrollTop: $(this).offset().top
    }, 1000);
};

$.fn.addOpt = function(val, text) {
    $(this).append(
        $('<option></option>').val(val).html(text)
    );
};


$(function() {
    
    inicializarLimitarCaracteres();
    inicializarCheckToggle();
    
    $('body').on('click', '[data-slide-toggle]', function(event) {
        if (!$(this).is(':checkbox')) {
            event.preventDefault();
        }
        $($(this).data('slide-toggle')).slideToggle();
    });
    
    $('[data-fade-toggle]').click(function(event) {
        if (!$(this).is(':checkbox')) {
            event.preventDefault();
        }
        $($(this).data('fade-toggle')).toggleClass('hide');
        //$($(this).data('fade-toggle')).fadeToggle();
    });
    
    $('[data-clear-input]').click(function(event) { 
        if (!$(this).is(':checkbox')) {
            event.preventDefault();
        }
        $($(this).data('clear-input')).val('');
    });
    
    $('[data-check-all]').click(function(event) {
        var $this = $(this),
            $target = $this.data('check-all');
        if ($this.is(':checkbox')) {
            $($target).attr('checked', $this.is(':checked'));
        } 
        else {
            $($target).attr('checked', true);
        }
    });
    
    $('[data-check-none]').click(function(event) { 
        $($(this).data('check-none')).attr('checked', false);
    });
    
    

    $('body').on('click', '.input-disabler [type=checkbox]', function(event) {
        $($(this).attr('data-disabler')).enable(!$(this).is(':checked'));
    });
    
    $('body').on('change', '.pagination .limit select', function(event) {
        window.location.href = $(this).find('option:selected').data('url');
        return;
        var url = window.location.href.replace(new RegExp('/limit:\\d+', 'g'), '');
        
        var idx = url.indexOf('/index');
        if (idx != -1) {
            var url1 = url.substr(0, idx);
            var url2 = url.substr(idx);
            url2 = url2.replace(new RegExp('/index', 'g'), '');
        }
        else {
            url1 = url;
            url2 = '';
        }
            
        url = url1 + '/index' + url2;
        window.location.href = url + '/limit:' + $(this).val();
    });
    
    //$('.first-focus').focus();
    //$("form:not(.filter) :input:visible:enabled:first").focus();
});

function borrarErrores($form, errores) {
    $form.find('div.alert-error').remove();
    $form.find('.control-group').each(function(idx,div){
        $div = $(div);
        $div.removeClass('error');
        $div.find('.help-inline').remove();
    });
}

$.fn.selEnd = function() {
    $campo = $(this);
    $campo[0].selectionStart = $campo[0].selectionEnd = $campo.val().length;
}

$.fn.replaceSel = function(txt) {
    $campo = $(this);
    $campo.val(
        $campo.val().substring(0, $campo[0].selectionStart) +
            txt +
        $campo.val().substring($campo[0].selectionEnd)
    );  
}
$.fn.replaceSelDiv = function(txt) {
    $div = $(this);
    $div.html(
        $div.html().substring(0, $div[0].selectionStart) +
            txt +
        $div.html().substring($div[0].selectionEnd)
    );  
}

function replaceSelectedText(replacementText) {
    var sel, range;
    if (window.getSelection) {
        sel = window.getSelection();
        if (sel.rangeCount) {
            range = sel.getRangeAt(0);
            range.deleteContents();
            range.insertNode(document.createTextNode(replacementText));
        }
    } else if (document.selection && document.selection.createRange) {
        range = document.selection.createRange();
        range.text = replacementText;
    }
}

$.fn.sortSelect = function() {
    var selected = $(this).find('option:selected').val();
    var opts = $(this).find('option');
    opts.sort(function(a,b) {
        if (a.text > b.text) return 1;
        else if (a.text < b.text) return -1;
        else return 0
    })
    $(this).empty().append(opts);
    $(this).find('option[value=' + selected + ']').attr('selected', true);
    $(this).prepend($(this).find('option[value=""]').remove());
}

function getProp(obj) {
    for (var prop in obj) {
        return prop;
    }
}

function empty(variable) {
    return typeof(variable) === 'undefined' || variable == null || variable == '' || variable == 0;
}

function here() {
    return location.protocol + '//' + location.host + location.pathname;
}

$.fn.copyCSS = function (source) {
    var dom = $(source).get(0);
    var dest = {};
    var style, prop;
    if (window.getComputedStyle) {
        var camelize = function (a, b) {
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




function pasteHtmlAtCaret(html, editable, fnCheck) {
    var sel, range;
    if (window.getSelection) {
        // IE9 and non-IE
        sel = window.getSelection();
        if (fnCheck) {
            if (!fnCheck(sel)) {
                return false;
            }
        }
        if (sel.getRangeAt && sel.rangeCount) {
            range = sel.getRangeAt(0);
            range.deleteContents();

            // Range.createContextualFragment() would be useful here but is
            // non-standard and not supported in all browsers (IE9, for one)
            var el = document.createElement("div");
            el.innerHTML = html;
            var frag = document.createDocumentFragment(), node, lastNode;
            while ( (node = el.firstChild) ) {
                node.contentEditable = editable === true;
                lastNode = frag.appendChild(node);
            }
            range.insertNode(frag);

            // Preserve the selection
            if (lastNode) {
                range = range.cloneRange();
                range.setStartAfter(lastNode);
                range.collapse(true);
                sel.removeAllRanges();
                sel.addRange(range);
            }
        }
    } else if (document.selection && document.selection.type != "Control") {
        // IE < 9
        document.selection.createRange().pasteHTML(html);
    }
    return true;
}


function strip_tags(input, allowed) {
    allowed = (((allowed || "") + "").toLowerCase().match(/<[a-z][a-z0-9]*>/g) || []).join('');
    // making sure the allowed arg is a string containing only tags in lowercase (<a><b><c>)
    var tags = /<\/?([a-z][a-z0-9]*)\b[^>]*>/gi, commentsAndPhpTags = /<!--[\s\S]*?-->|<\?(?:php)?[\s\S]*?\?>/gi;
    return input.replace(commentsAndPhpTags, '').replace(tags, function($0, $1) {
        return allowed.indexOf('<' + $1.toLowerCase() + '>') > -1 ? $0 : '';
    });
}

function validateEmail(email) { 
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

function attrs(elems, attr) {
    return $(elems).map(function(){return $(this).attr(attr);}).get();
}
