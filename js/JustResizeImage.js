var JustResizeImage = (function() {
	var _action = PATH.ajax.Image;
	var _id = {
		'Image' : '.image-file',
		'Fn'	: '.fn'
	};

	var init = function() {
		_header.init();
		_image.init();
	};

	var _header = {
		init : function() {
			$('#header').on('click tap', function() {
				if($(this).hasClass('active')) {
					$(this).removeClass('active');
				} else {
					$(this).addClass('active');
				}
			});
		}
	};

	var _image = {
		type : /^image\/(png|jpg|jpeg)$/,
		max : 10 * 1024 * 1024,
		maxW : 3072,
		resizedHTML : '',
		files : {},
		init : function() {
			_image.fileEvent();
			_image.processEvent();
			_image.resizedHTML = $('#block-resized').html();
			$('#block-resized').remove();
		},
		fileEvent : function() {
			$(_id.Image).on('change drop', function(e) {
				e.preventDefault();
				var $this = $(this);
				var $file = $this;
				if(e.type == 'drop') $file = e.originalEvent.dataTransfer;
				var index = $this.parent().index();
				Common.file.image($file, '', function(f, e) {
					if(!_image.type.test(f.type)) {
						Common.message.alert('Format Error', 'Allow : PNG, JPG, JPEG');
						$this.val('');
						return false;
					}
					if(f.size > _image.max) {
						Common.message.alert('Size Error', 'Max size : 10M');
						$this.val('');
						return false;
					}
					_image.files[index] = f;
					var area = $this.parent();
					var img = area.children('.image');
					img.prop('src', e.target.result);
					area.addClass('active');
				});
			});
		},
		processEvent : function() {
			$(_id.Fn).on('click', function() {
				Common.loop.start('_CHANGE_SWEETALERT_TYPE_', function() {
					if($('.show-input fieldset input').length > 0) {
						$('.show-input fieldset input').prop('type', 'number');
						Common.loop.stop('_CHANGE_SWEETALERT_TYPE_');
					}
				}, 1);
				var index = $(this).parent().index();
				var $file = _image.files[index];
				if(!$file) return false;
				Common.message.input('Resize Width', 'Input want width', 200, function(width) {
					if(width <= 0) {
						Common.message.alert('Width Error', 'Width not less 0');
						return false;
					}
					if(width > _image.maxW) {
						Common.message.alert('Width Error', 'Allow Max Width : ' + _image.maxW);
						return false;
					}
					_image.resize($file, width);
				});
			});
		},
		resize : function(file, width) {
			var param = {
				'_method' : 'Resize',
				'width' : width
			};
			Common.delay.start('_BIG_SIZE_WAIT_', function() {
				Common.message.popup('Resize Process....');
			}, 1);
			Common.ajax.file(_action, file, param, function(rep) {
				Common.delay.stop('_BIG_SIZE_WAIT_');
				if(rep) {
					Common.message.success('Resize Success', _image.resized(rep));
				} else {
					Common.message.error('Resize Error', 'System Error');
				}
			});
		},
		resized : function(url) {
			$('body').append('<div id="__temp__">' + _image.resizedHTML + '</div>');
			$('#resized-image').prop('src', url);
			var html = $('#__temp__').html();
			$('#__temp__').remove();
			return html;
		}
	};

	return {
		init : init
	};
})();
JustResizeImage.init();