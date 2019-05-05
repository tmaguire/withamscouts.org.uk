(($) => {

  const INPUT_DATA = {};
  const DATA_COLOR = '';
  const BUTTON_X_COLOR = '';
  const BUTTON_X_BLUR_COLOR = '#ced4da';
  const INPUT_FOCUS = '1px solid #4285f4';
  const INPUT_BLUR = '1px solid #ced4da';
  const INPUT_FOCUS_SHADOW = '0 1px 0 0 #4285f4';
  const INPUT_BLUR_SHADOW = '';
  const ENTER_CHAR_CODE = 13;

  class mdbAutocomplete {

    constructor(input, options) {

      this.defaults = {
        data: INPUT_DATA,
        dataColor: DATA_COLOR,
        xColor: BUTTON_X_COLOR,
        xBlurColor: BUTTON_X_BLUR_COLOR,
        inputFocus: INPUT_FOCUS,
        inputBlur: INPUT_BLUR,
        inputFocusShadow: INPUT_FOCUS_SHADOW,
        inputBlurShadow: INPUT_BLUR_SHADOW
      };

      this.$input = input;
      this.options = this.assignOptions(options);
      this.$clearButton = $('.mdb-autocomplete-clear');
      this.$autocompleteWrap = $('<ul class="mdb-autocomplete-wrap"></ul>');
      this.init();
    }

    init() {

      this.setData();
      this.inputFocus();
      this.inputBlur();
      this.inputKeyupData();
      this.inputLiClick();
      this.clearAutocomplete();
    }

    assignOptions(newOptions) {

      return $.extend({}, this.defaults, newOptions);
    }

    setData() {

      if (Object.keys(this.options.data).length) {
        this.$autocompleteWrap.insertAfter(this.$input);
      }
    }

    inputFocus() {

      this.$input.on('focus', () => {

        this.$input.css('border-bottom', this.options.inputFocus);
        this.$input.css('box-shadow', this.options.inputFocusShadow);
      });
    }

    inputBlur() {

      this.$input.on('blur', () => {

        this.$input.css('border-bottom', this.options.inputBlur);
        this.$input.css('box-shadow', this.options.inputBlurShadow);
      });
    }

    inputKeyupData() {

      this.$input.on('keyup', e => {

        const $inputValue = this.$input.val();

        this.$autocompleteWrap.empty();

        if ($inputValue.length) {

          for (const item in this.options.data) {

            if (this.options.data[item].toLowerCase().indexOf($inputValue.toLowerCase()) !== -1) {

              const option = $(`<li>${this.options.data[item]}</li>`);

              this.$autocompleteWrap.append(option);
            }
          }
        }

        if (e.which === ENTER_CHAR_CODE) {

          this.$autocompleteWrap.children(':first').trigger('click');
          this.$autocompleteWrap.empty();
        }

        if ($inputValue.length === 0) {

          this.$input.parent().find('.mdb-autocomplete-clear').css('visibility', 'hidden');
        } else {

          this.$input.parent().find('.mdb-autocomplete-clear').css('visibility', 'visible');
        }

        this.$autocompleteWrap.children().css('color', this.options.dataColor);
      });
    }

    inputLiClick() {

      this.$autocompleteWrap.on('click', 'li', e => {

        e.preventDefault();

        this.$input.val($(e.target).text());
        this.$autocompleteWrap.empty();
      });
    }

    clearAutocomplete() {

      this.$clearButton.on('click', e => {

        e.preventDefault();

        let $this = $(e.currentTarget);

        $this.parent().find('.mdb-autocomplete').val('');
        $this.css('visibility', 'hidden');
        this.$autocompleteWrap.empty();
        $this.parent().find('label').removeClass('active');
      });
    }

    changeSVGcolors() {

      if (this.$input.hasClass('mdb-autocomplete')) {

        this.$input.on('click keyup', e => {

          e.preventDefault();
          $(e.target).parent().find('.mdb-autocomplete-clear').find('svg').css('fill', xColor);
        });

        this.$input.on('blur', e => {

          e.preventDefault();
          $(e.target).parent().find('.mdb-autocomplete-clear').find('svg').css('fill', xBlurColor);
        });
      }
    }
  }

  $.fn.mdbAutocomplete = function (options) {
    return this.each(function () {
      new mdbAutocomplete($(this), options);
    });
  };

  //deprecated, delete soon
  $.fn.mdb_autocomplete = $.fn.mdbAutocomplete;

})(jQuery);
