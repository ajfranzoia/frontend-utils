/**
 * Archivo de plugins en Javascript:
 *
 * - btnCheckbox: permite pasar un checkbox a un botón con html definido para cada estado.
 * - runFn: ejecuta una función al hacer click en el elemento.
 */

(function( $ ) {

    $.fn.btnCheckbox = function() {

        return this.each(function() {

            var $widget = $(this),
                $button = $widget.find('button'),
                $checkbox = $widget.find('input:checkbox');

            $button.on('click', function () {
                $checkbox.prop('checked', !$checkbox.is(':checked'));
                $checkbox.triggerHandler('change');
            });

            $checkbox.on('change', function () {
                update();
            });

            function update() {
                var isChecked = $checkbox.is(':checked');

                var colorOff = 'btn-default';
                if ($button.data('color-off')) {
                    colorOff = 'btn-' + $button.data('color-off');
                }

                var colorOn = 'btn-success';
                if ($button.data('color-on')) {
                    colorOn = 'btn-' + $button.data('color-on');
                }

                if (isChecked) {
                    $button.html($button.data('html-on'));
                    $button.removeClass(colorOff);
                    $button.addClass(colorOn);
                }
                else {
                    $button.html($button.data('html-off'));
                    $button.removeClass(colorOn);
                    $button.addClass(colorOff);
                }
            }

            update();
        });
    };

    $.fn.runFn = function() {

        return this.each(function() {

            var $widget = $(this);

            $widget.on('click', function (event) {
                event.preventDefault();
                runFn($widget.data('run-fn'), window);
            });
        });
    };

    $.fn.qDatepicker = function() {

    	/*
    	$.fn.datepicker.defaults = {
			autoclose: false,
			beforeShowDay: $.noop,
			calendarWeeks: false,
			clearBtn: false,
			daysOfWeekDisabled: [],
			endDate: Infinity,
			forceParse: true,
			format: 'mm/dd/yyyy',
			keyboardNavigation: true,
			language: 'en',
			minViewMode: 0,
			multidate: false,
			multidateSeparator: ',',
			orientation: "auto",
			rtl: false,
			startDate: -Infinity,
			startView: 0,
			todayBtn: false,
			todayHighlight: false,
			weekStart: 0
		};
		*/

        return this.each(function() {

            var $widget = $(this),
                $input = $widget.find('input');

            $input.attr('readonly', true);
            $input.css({
                'background-color': 'white',
                'cursor': 'pointer',
                'text-align': 'center'
            });
            $widget.css({
                'cursor': 'pointer'
            });

            $widget.datepicker({
                autoclose: true,
                todayHighlight: true,
                format: 'dd/mm/yyyy',
                language: 'es',
                todayBtn: 'linked',
                startDate: $input.data('start-date')
            });

            // Inicializa valor seleccionado por default
            $widget.data('datepicker').setValue();

            // Intercambia elemes para estilo BS
            $input.before($input.next());
        });
    };

    $.fn.qSelectpicker = function() {

        return this.each(function() {

            var $widget = $(this);

    		//if ($widget.data('live-search')) {
	    	//	var liveSearch = $widget.data('live-search');
    		//}
    		//var liveSearch = typeof $widget.data('live-search') == 'undefined' || $widget.find('option') > 5;

            $widget.selectpicker({
                //'liveSearch': liveSearch,
                //'size': 6,
                //'style': $widget.data('style') ? $widget.data('style') : 'btn-default'
            });
        });
    };

    $.fn.qInputEnabler = function() {

        return this.each(function() {

            var $widget = $(this);
        	var $chk = $widget.find('input[type=checkbox]');

            $chk.change(function(event) {
            	var checked = $chk.prop('checked');
            	var $inputGrp = $chk.closest('.input-group');
            	var $target = $inputGrp.find('input').not($chk);

            	if ($chk.parent().hasClass('input-group-addon')) {
	            	if (!checked) {
	            		$target.disable();
	            		$target.val(null);
	            	} else {
	            		$target.enable();
	            		$target.focus();
	            	}
            	} else {
	            	if (!checked) {
	            		$(this).closest('.btn').removeClass('btn-success').addClass('btn-danger');
	            		$(this).closest('.input-enabler').find('input').disable();
	            	} else {
	            		$(this).closest('.btn').removeClass('btn-danger').addClass('btn-success');
	            		$(this).closest('.input-enabler').find('input').enable();
	            	}
            	}
            });
        });
    };

    $.fn.qBtnRadio = function() {

        return this.each(function() {

            var $widget = $(this);
            var defaultClass = $widget.data('default');
            var activeClass = $widget.data('active');
            var $radios = $widget.find('input[type=radio]');

            $radios.change(function(event) {

                $widget.find('.btn').removeClass(activeClass).addClass(defaultClass);
                $widget.find(':checked').parent().removeClass(defaultClass).addClass(activeClass);
            });
        });
    };

    $.fn.qTypeToSelect = function() {

        var _defaults = {
            minLength: 1
        };

        return this.each(function() {

            var $widget = $(this),
                $target = $($widget.data('target')),
                remote  = $widget.data('remote');
            var config = $.extend(_defaults, config);

            $widget.on('keyup', function (event) {
                event.preventDefault();

                if ($widget.val().length < config.minLength) {
                    $target.empty();
                    $target.disable();
                    return;
                }

                var $prev = null;
                if ($target.prev().hasClass('input-group-addon')) {
                    $prev = $target.prev();
                    $prev.find('i').css('visibility', 'hidden');
                    $prev.spin('xsmall');
                }

                $target.enable();
                //$target.emptySelect('Cargando resultados...');

                $.get(remote + '/' + $widget.val() + '.json', function(data) {

                    if ($prev) {
                        $prev.find('i').css('visibility', 'visible');
                        $prev.spin(false);
                    }

                    var currentSelected = $target.val();

                    for (var first in data) { break; }
                    if (data[first].length == 0) {
                        $target.emptySelect('No se encontraron resultados');
                        $target.disable();
                        return;
                    }

                    $target.empty();
                    for (var id in data[first]) {
                        $target.append($('<option/>').val(id).text(data[first][id]));
                    }

                    if (currentSelected && $target.getOpt(currentSelected)) {
                        $target.val(currentSelected);
                    }
                });
            });
        });
    };

    $.fn.qToggler = function() {

        var _defaults = {
        };

        return this.each(function() {

            var $widget = $(this),
                $targetOn = $($widget.data('toggler-on')),
                $targetOff  = $($widget.data('toggler-off'));
            //var config = $.extend(_defaults, config);

		    $widget.change(function() {
				$widget.disable();
			    if ($widget.prop('checked')) {
			    	if ($targetOff.length) {
				    	$targetOff.slideUp(function() {
				    		$targetOn.slideDown(function() {
								$widget.enable();
				    		});
				    	});
			    	} else {
			    		$targetOn.slideDown(function() {
							$widget.enable();
			    		});
			    	}
			    } else {
			    	if ($targetOff.length) {
				    	$targetOn.slideUp(function() {
				    		$targetOff.slideDown(function() {
								$widget.enable();
				    		});
				    	});
			    	} else {
			    		$targetOn.slideUp(function() {
							$widget.enable();
			    		});
			    	}
			    }
		    });
        });
    };

    $.fn.applyParsley = function() {

        return this.each(function() {
            var $form = $(this);

            var excluded = 'input[type=hidden], input[type=file], :disabled';
            if ($form.data('parsley-excluded')) {
                excluded = $form.data('parsley-excluded');
            };

            $form.parsley({

                excluded: excluded,

                // Clase de error en classHandler (.form-group)
                errorClass: 'has-error',

                // fns de error
                errors: {
                    // elemento que recibe la clase de error
                    classHandler: function (elem, isRadioOrCheckbox ) {
                        return elem.closest('.form-group');
                    },

                    // contenedor de lista de errores
                    container: function (elem, isRadioOrCheckbox) {
                        var $errorContainer = elem.closest('.form-group').find('.error-container');
                        $errorContainer.empty();

                        var _class = $form.data('error-div-class');
                        $div = $('<div class="' + _class + '"></div>').appendTo($errorContainer);
                        return $div;
                    }
                },

                // listeners definidos
                listeners: {
                    onFieldSuccess: function (elem) {
                        var $errorContainer = elem.closest('.form-group').find('.error-container');
                        $errorContainer.empty();
                    },
                    onFieldValidate: function (elem) {
                    }
                }
            });
        });

    };

    $.fn.qLaddaBind = function() {

        return this.each(function() {
            var $widget = $(this);

            $widget.addClass('ladda-button');
            $widget.attr('data-style', 'slide-left');
            $widget.html('<span class="ladda-label">' + $widget.html() + '</span>');

            Ladda.bind( this );
        });

    };

    $.fn.qCheckboxToggler = function() {

        var _defaults = {
        };

        return this.each(function() {
            var $widget = $(this);
            $widget.change(function() {
                var $target = $($widget.data('target'));
                if ($widget.prop('checked')) {
                    $target.prop('checked', true);
                } else {
                    $target.prop('checked', false);
                }
            });
        });
    };

    $.fn.cascadeSelect = function() {

        return this.each(function() {
            var $widget = $(this);
            $widget.selectpicker({
            });
        });
    };

    $(function() {
        $('.btn-checkbox').btnCheckbox();
        $('[data-run-fn]').runFn();
        $('.datepicker').qDatepicker();
        $('.selectpicker').qSelectpicker();
        $('.input-enabler').qInputEnabler();
        $('.typetoselect').qTypeToSelect();
        $('.toggler').qToggler();
        $('.checkbox-toggle').qCheckboxToggler();
        $('.btn-radio').qBtnRadio();

        $('.ladda-bind').qLaddaBind();

        $('[data-toggle=tooltip], [rel=tooltip]').tooltip();
        $('[data-toggle=popover], [rel=popover]').popover();
        $('[autofocus]:first').focus();

        $('form[data-parsley-attach]').applyParsley();


        if ($.fn.tooltip != null) {
            $('[rel=tooltip]').tooltip();
        }
        if ($.fn.popover != null) {
            $('[rel=popover]').popover();
        }
        if ($.fn.clickover != null) {
            $('[rel=clickover]').clickover();
        }
        if ($.fn.carousel != null) {
            $('.carousel').carousel();
        }


    $('.modal-submit').on('click', function(e) {
        e.preventDefault();
        $(this).closest('.modal').find('form').submit();
        $(this).closest('.modal').modal('hide');
    }); 
    
    $('.btn-imprimir').on('click', function(e) {
        e.preventDefault();
        window.print();
    }); 
    $('.btn-print').on('click', function(event) {
        event.preventDefault();
        window.print();
    });

    });

})( jQuery );



/**
 * Plugins
 */

(function( $ ) {
    $.fn.inputDisabler = function() {
        return this.each(function() {
            var $this = $(this), 
                $target = $($this.data('disabler-target'));
            $this.change(function(event) { 
                $target.fadeToggle('fast');
                $target.val(''); 
            });
        });
    };
  $('.input-disabler :checkbox').inputDisabler();
})( jQuery );

(function( $ ) {
    $.fn.dtPicker = function() {
        return this.each(function() {
            var $dtp = $(this), $input = $dtp.find('input[data-language]'); 
            $dtp.datetimepicker({
                language: $input.data('language'),
                pickTime: $dtp.data('time') != undefined,
                pickSeconds: $dtp.data('seconds') != undefined,
            });
            
            var $target = $($dtp.data('target'));
            var picker = $dtp.data('datetimepicker');
            picker.setLocalDate(Date.parse($target.val()));
            
            $dtp.on('changeDate', function(e) {
                var formato = $dtp.data('time') ? 'yyyy-MM-dd HH:mm:ss' : 'yyyy-MM-dd';
                var fechaIso = e.localDate.toString(formato);
                $target.val(fechaIso).change();
            });
            
            /*
            var $this = $(this), 
                $target = $($this.data('disabler-target'));
            $this.change(function(event) { 
                $target.fadeToggle('fast');
                $target.val(''); 
            });*/
        });
    };
    $(function() {
        $('.dtpicker').dtPicker();
    });
})( jQuery );

jQuery(function($) {
  $('div.btn-group[data-toggle-name]').each(function(){
    var group   = $(this);
    var form    = group.parents('form').eq(0);
    var name    = group.attr('data-toggle-name');
    var hidden  = $('input[name="' + name + '"]', form);
    $('button', group).each(function(){
      var button = $(this);
      button.live('click', function(){
          hidden.val($(this).val());
      });
      if(button.val() == hidden.val()) {
        button.addClass('active');
      }
    });
  });
});
