(function($) {

  $.fn.fnRunner = function() {
    return this.each(function() {
      var $widget = $(this);
      $widget.on('click', function(event) {
        event.preventDefault();
        Utils.runFn($widget.data('run-fn'), window);
      });
    });
  };

  $.fn.myDatepicker = function() {
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

  $.fn.enabler = function() {
    return this.each(function() {

      var $el = $(this),
        $target = $($el.attr('data-enable'));

      $el.on('click', function(event) {
        toggleEnable();
      });

      function toggleEnable() {
        $target.enable($el.is(':checked'));
      }

      toggleEnable();
    });
  };

  $.fn.checkAll = function() {
    return this.each(function() {
      $(this).click(function(event) {
        var $this = $(this),
          $target = $this.data('check-all');
        if ($this.is(':checkbox')) {
          $($target).attr('checked', $this.is(':checked'));
        } else {
          $($target).attr('checked', true);
        }
      });
    });
  };

  $.fn.checkNone = function() {
    return this.each(function() {
      $(this).click(function(event) {
        $($(this).data('check-none')).attr('checked', false);
      });
    });
  };

  $.fn.toggler = function() {
    return this.each(function() {

      var $el = $(this),
        $target = $($el.attr('data-toggle')),
          effect = $(this).data('toggle-effect');

      $el.on('click', function(event) {
        toggleTarget();
      });

      function toggleTarget(doEffect) {
        doEffect = typeof doEffect !== 'undefined' && doEffect != false;

        if (doEffect && effect == 'slide') {
          $target.slideToggle();
        } else if (doEffect && effect == 'fade') {
          $target.fadeToggle();
        } else {
          $target.toggle();
        }
      }

      toggleTarget(false);
    });
  }

  $.fn.doPrint = function() {
    return this.each(function() {
      $(this).on('click', function(event) {
        event.preventDefault();
        window.print();
      });
    });
  }

  $.fn.inputClearer = function() {
    return this.each(function() {
      $(this).click(function(event) {
        $($(this).data('clear')).val('');
      });
    });
  }

  $(function() {
    $('[data-run-fn]').fnRunner();
    $('[data-enable]').enabler();
    $('[data-clear]').inputClearer();
    $('.my-datepicker').myDatepicker();
    $('.do-print').doPrint();
    $('[data-toggle]').toggler();
    $('[data-check-all]').checkAll();
    $('[data-check-none]').checkNone();    
    //$(':input:visible:enabled:first').focus();

    //$('[data-toggle=tooltip], [rel=tooltip]').tooltip();
    //$('[data-toggle=popover], [rel=popover]').popover();
  });

})(jQuery);
