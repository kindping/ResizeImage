var swal = swal || false;
var Common = (function($, swal) {
	var _URL = {
		get : function() {
			return window.location.href;
		},
		param : function(decode) {
			var result = {};
			var param = window.location.search.substring(1).split('&');
			var temp = '';
			for(var k in param) {
				temp = param[k].split('=');
				result[temp[0]] = temp[1];
				if(decode) result[temp[0]] = decodeURIComponent(result[temp[0]]);
			}
			return result;
		}
	};
	var _HOTKEY = {
		spKey : {
			112 : 'F1',
			113 : 'F2',
			114 : 'F3',
			115 : 'F4',
			116 : 'F5',
			117 : 'F6',
			118 : 'F7',
			119 : 'F8',
			120 : 'F9',
			121 : 'F10',
			122 : 'F11',
			123 : 'F12',
		},
		set : function(target, keys, notcharcode) {
			if(!keys) keys = {};
			var charcode = (!notcharcode) ? true : false;
			var spKey = _HOTKEY.spKey;
			$(target).off('keydown').on('keydown', function(e) {
				var keyword = (charcode) ? String.fromCharCode(e.keyCode) : e.keyCode;
				if(spKey[e.keyCode]) keyword = spKey[e.keyCode];
				if(keys[keyword] && typeof keys[keyword] == 'function') {
					e.preventDefault();
					keys[keyword]($(this).val(), keyword);
				}	
			});
		},
		remove : function(target) {
			$(target).off('keydown');
		}
	};
	var _HISTORY = {
		push : function(state, title, url) {
			state = $.extend({}, _HISTORY.def(), state);
			window.history.pushState(state, title, url);
		},
		replace : function(state, title, url) {
			state = $.extend({}, _HISTORY.def(), state);
			window.history.replaceState(state, title, url);
		},
		bind : function(callback) {
			window.onpopstate = function(event) {
				if(typeof callback == 'function') callback(event.state, event);
			}
		},
		def : function() {
			return {
				url : window.location.href,
				title : window.document.title
			};
		}
	};
	var _FORMAT = {
		thousandComma : function(num) {
			num = num.toString();
			var pattern = /(-?\d+)(\d{3})/;
			while(pattern.test(num)) num = num.replace(pattern, "$1,$2");
			return num;
		},
		thousandCommaToNumber : function(num) {
			num = num.toString();
			return num.replace(/,/g, '');				
		},
		hour24To12 : function(time) {
			var t = time.substr(0,5).split(':');
			var clock = 'AM';
			if(t[0] >= 12) {
				if(t[0] > 12) {
					t[0] = Math.abs(t[0] - 12);					
				}
				clock = 'PM';
			}
			if(t[0] < 10) t[0] = '0' + parseInt(t[0],10);
			return t[0] + ':' + t[1] + clock;
		},
		weekNumberToString : function(number) {
			return String.fromCharCode(_mappingNumberString[number]);
		}
	};
	var _CHECK = {
		isChinese : function(s, is, not) {
			var state = s.search(RegExp("[一-" + String.fromCharCode(40869) + "]")) > -1;
			_YNCallback(state, is, not);
			return state;
		},
		isDate : function(date, is, not) {
			var state = /^\d{4}-\d{2}-\d{2}$/.test(date);
			_YNCallback(state, is, not);
			return state;
		},
		isTime : function(time, is, not) {
			var state = /^\d{2}:\d{2}:\d{2}$/.test(time);
			_YNCallback(state, is, not);
			return state;
		},
		isNumber : function(number, is, not) {
			var state = /^\d*$/.test(number);
			_YNCallback(state, is, not);
			return state;
		},
		isEmail : function(email, is, not) {
			var state = /^[\w\.][\w\.]*@[\w\.]*\w$/.test(email);
			_YNCallback(state, is, not);
			return state;
		},
		isMobile : function(mobile, is, not) {
			var state = /^\d{10}$/.test(mobile);
			_YNCallback(state, is, not);
			return state;
		},
		isJSONContentType : function(contentType, is, not) {
			var state = /\/json/.test(contentType);
			_YNCallback(state, is, not);
			return state;
		},
		valid : function(field, require, success, error) {
			var data = {};
			for(var i in field) {
				data[i] = $('#' + field[i]).val();
				if(!data[i] && require[i]) {
					Common.message.alert('警告', require[i] + ' 未填寫', function() {
						Common.delay.start('error', function() {
							$('#' + field[i]).focus();
						}, 0.4);
						if(typeof error == 'function') error(data);
					});					
					return false;
				}
			}
			if(typeof success == 'function') success(data);
			return data;
		}
	};
	var _FILE = {
		image : function(file, target, callback) {
			file = $(file)[0].files || file.files;
			if(!file[0]) return false;
			file = file[0];
			var reader = new FileReader();
			reader.onload = function(e) {
				$(target).prop('src', e.target.result);
				if(typeof callback == 'function') callback(file, e);
			};
			reader.readAsDataURL(file);
		}
	};
	var _AJAX = {
		post : function(url, data, success, customerSetting, error, callback) {
			_ajaxProcess(_ajaxSetting(url, data, 'POST', customerSetting), success, error, callback);
		},

		get : function(url, data, success, customerSetting, error, callback) {
			_ajaxProcess(_ajaxSetting(url, data, 'GET', customerSetting), success, error, callback);
		},

		html : function(url, data, success, customerSetting, error, callback) {
			_ajaxProcess(_ajaxSetting(url, data, 'GET', customerSetting), success, error, callback, true);
		},
		file : function(url, file, param, success, error, callback) {
			if(file[0] && file[0].files) file = file[0].files[0];
			var fileIndex = 'uploadFile';
			var method = 'upload';
			if(param._fileIndex && param._fileIndex != '') fileIndex = param._fileIndex;
			if(param._method && param._method != '') method = param._method;
			var customerSetting = {
				cache : false,
				processData : false,
				contentType : false
			};
			var formData = new FormData();
			if(!file.length) {
				formData.append(fileIndex, file);
			} else {
				var tmp = '';
				for(var i = 0;i < file.length; i++) {
					tmp = (file[i][0] && file[i][0].files) ? file[i][0].files[0] : file[i];
					formData.append(fileIndex + i, tmp);
				}
				formData.append('fileCount', file.length);
			}
			formData.append('fileIndex', fileIndex);
			formData.append('_method', method);
			formData.append('param', JSON.stringify(param));
			_ajaxProcess(_ajaxSetting(url, formData, 'POST', customerSetting), success, error, callback);	
		}
	};
	var _PARSE = {
		json : function(data) {
			return (data) ? $.parseJSON(data) : false;
		}
	};
	var _LOCK = {
		class : '_lock2common',
		enable : function(target) {
			$(target).addClass(_LOCK.class);
			$('.' + _LOCK.class).css({
				'-moz-user-select':'-moz-none',
                '-moz-user-select':'none',
                '-o-user-select':'none',
                '-khtml-user-select':'none',
                '-webkit-user-select':'none',
                '-ms-user-select':'none',
                'user-select':'none'
			});
		},
		disable : function(target) {
			$(target).removeClass(_LOCK.class).css({
                '-moz-user-select':'',
                '-o-user-select':'',
                '-khtml-user-select':'',
                '-webkit-user-select':'',
                '-ms-user-select':'',
                'user-select':''
			});
		}
	};
	var _ARRAY = {
		in : function(need, array) {
			for(var i = 0; i < array.length; i++) {
				if(array[i] == need) return true;
			}
			return false;
		},
		remove : function(need, array) {
			for(var i = 0; i < array.length; i++) {
				if(array[i] == need) array.splice(i, 1);
			}
			return array;
		},
		min : function(array) {
			return Math.min.apply(null, array);
			//ECMAScript 6
			// return Math.min(...array);
		},
		max : function(array) {
			return Math.max.apply(null, array);
			//ECMAScript 6
			// return Math.max(...array);
		}
	};
	var _JSON = {
		length : function(json) {
			var len = 0;
			for(var i in json) {
				len++;
			}
			return len;
		}
	};
	var _DELAY = {
		id : '_delay2common',
		pool : {},
		start : function(uid, process, seconds) {
			var uuid = _DELAY.id + uid;
			_DELAY.stop(uid);
			_DELAY.pool[uuid] = setTimeout(function() {
				if(typeof process == 'function') process(uid);
			}, seconds * 1000);
		},
		stop : function(uid) {
			var uuid = _DELAY.id + uid;
			clearTimeout(_DELAY.pool[uuid]);
			delete _DELAY.pool[uuid];
		}
	};
	var _LOOP = {
		id : '_loop2common',
		pool : {},
		start : function(uid, process, seconds, isRun) {
			if(isRun && typeof process == 'function') process(uid);
			var uuid = _LOOP.id + uid;
			_LOOP.stop(uid);
			_LOOP.pool[uuid] = setInterval(function() {
				if(typeof process == 'function') process(uid);
			}, seconds * 1000);
		},
		stop : function(uid) {
			var uuid = _LOOP.id + uid;
			clearInterval(_LOOP.pool[uuid]);
			delete _LOOP.pool[uuid];
		}
	};
	var _STORAGE = {
		set : function(key, value, isLocal) {
			var storage = (isLocal) ? localStorage : sessionStorage; 
			storage[key] = JSON.stringify(value);
		},
		get : function(key, isLocal) {
			var storage = (isLocal) ? localStorage : sessionStorage;
			return (storage[key]) ? JSON.parse(storage[key]) : false;
		}
	};
	var _INFO = {
		unicodeLength : function(s) {
			return encodeURIComponent(s).replace(/%[A-F\d]{2}/g, '.').replace(/[a-zA-Z\d]{1}/g, '...').length;
		}
	};
	var _MESSAGE = {
		success : function(title, content, closeEvent, callback) {
			var msg = (swal) ? _swal : _defmsg;
			msg.success(title, content, closeEvent);
			if(typeof callback == 'function') callback();
		},
		alert : function(title, content, closeEvent, callback) {
			var msg = (swal) ? _swal : _defmsg;
			msg.alert(title, content, closeEvent);
			if(typeof callback == 'function') callback();
		},
		error : function(title, content, closeEvent, callback) {
			var msg = (swal) ? _swal : _defmsg;
			msg.error(title, content, closeEvent);
			if(typeof callback == 'function') callback();
		},
		confirm : function(title, content, y, n, nf, nc, callback) {
			var msg = (swal) ? _swal : _defmsg;
			msg.confirm(title, content, y, n, nf, nc);
			if(typeof callback == 'function') callback();
		},
		popup : function(title, content, callback) {
			var msg = (swal) ? _swal : _defmsg;
			msg.popup(title, content, callback);
		},
		input : function(title, content, value, callback, placeholder) {
			if(!swal) return false;
			_swal.input(title, content, value, callback, placeholder);
		},
		file : function(url, callback, dbclose) {
			_defmsg.file(url, function() {
				if(typeof callback == 'function') callback();
				if(dbclose) _defmsg.dbclose(function() {
					_defmsg.close();
				});
			});
		},
		close : function() {
			var msg = (swal) ? _swal : _defmsg;
			msg.close();
		},
		dbclose : function(callback) {
			var msg = (swal) ? _swal : _defmsg;
			msg.dbclose(callback);
		},
		inputError : function(msg) {
			if(swal) swal.showInputError(msg);
		}
	};
	var _defmsg = {
		id : '#_defmsg2common',
		success : function(title, content, callback) {
			_defmsg._make(title, content, '', '', function() {
				if(typeof callback == 'function') callback();
				_defmsg.close();
			});
			_defmsg.icon('&#10004;', 'green');
			_defmsg.hideCancel();
		},
		alert : function(title, content, callback) {
			_defmsg._make(title, content, '', '', function() {
				if(typeof callback == 'function') callback();
				_defmsg.close();
			});
			_defmsg.icon('&#33;', '#C0A935');
			_defmsg.hideCancel();
		},
		error : function(title, content, callback) {
			_defmsg._make(title, content, '', '', function() {
				if(typeof callback == 'function') callback();
				_defmsg.close();
			});
			_defmsg.icon('&#10006;', 'red');
			_defmsg.hideCancel();
		},
		confirm : function(title, content, y, n, nf, nc) {
			_defmsg._make(title, content, '', '', function() {
				if(typeof y == 'function') y();
				if(!nf) _defmsg.close();
			}, function() {
				if(typeof n == 'function') n();
				if(!nc) _defmsg.close();
			});
			_defmsg.icon('&#63;', 'red');
		},
		popup : function(title, content, callback) {
			_defmsg._make(title, content);
			_defmsg.hideCancel();
			_defmsg.hideRun();
			_defmsg.icon('&#9202;');
			if(typeof callback == 'function') callback();
		},
		file : function(url, callback) {
			_defmsg._make();
			$(_defmsg.id).html('').load(url, function() {
				if(typeof callback == 'function') callback();
			});
		},
		close : function() {
			_DELAY.stop('_defmsg');
			_DELAY.start('_defmsg', function() {
				_defmsg._close();
				_mask.hide();
			}, 0.2);
			$(_defmsg.id).html('').stop().animate({
				'width' : 0,
				'height' : 0,
				'margin' : 0
			}, 200);
		},
		dbclose : function(callback) {
			_mask.dbclose(callback);
		},
		_close : function() {
			$(_defmsg.id).remove();
		},
		_make : function(title, content, yText, nText, yEvent, nEvent) {
			_defmsg._close();
			_mask.hide();
			_mask.show();
			$('body').append('<div id="' + _defmsg.id.toString().replace('#', '') + '"></div>');
			var msg = $(_defmsg.id);
			msg.css({
				'position' : 'fixed',
				'width' : '520px',
				'height' : '320px',
				'top' : '50%',
				'left' : '50%',
				'margin' : '-160px 0 0 -260px',
				'background' : '#fff',
				'border-radius' : '8px',
				'z-index' : 101,
				'overflow' : 'auto'
			});
			msg.append('<h1>' + title + '</h1><span class="_defmsgicon">!</span>');
			msg.find('h1').css({
				'height' : '60px',
				'line-height' : '60px',
				'text-align' : 'center',
				'font-size' : '30px',
				'width' : '90%',
				'margin' : 'auto',
				'border-bottom' : '2px solid #2C2E2E'
			});
			msg.find('span._defmsgicon').css({
				'position' : 'absolute',
				'width' : '32px',
				'height' : '32px',
				'line-height' : '32px',
				'top' : '14px',
				'left' : '5%',
				'border-radius' : '100px',
				'border' : '2px solid #000',
				'text-align' : 'center',
				'font-size' : '24px' 
			});
			msg.append('<div class="_defmagcontent">' + content + '</div>');
			msg.find('div._defmagcontent').css({
				'width' : '90%',
				'margin' : 'auto',
				'height' : '180px',
				'line-height' : '36px',
				'font-size' : '18px'
			});
			msg.append('<div class="_defmsgbutton"><span class="_defmsgbutton-cancel _defmsgbuttons">取消</span><span class="_defmsgbutton-run _defmsgbuttons">確認</span></div>');
			msg.find('._defmsgbutton').css({
				'width' : '90%',
				'margin' : 'auto',
				'text-align' : 'center'
			});
			msg.find('._defmsgbuttons').css({
				'display' : 'inline-block',
				'width' : '120px',
				'height' : '46px',
				'line-height' : '46px',
				'text-align' : 'center',
				'border-radius' : '5px',
				'margin-right' : '20px',
				'font-size' : '20px',
				'border' : 0,
				'cursor' : 'pointer'
			});
			msg.find('._defmsgbutton-cancel')
				.html(nText || '取消')
				.off('click').on('click', function() {
					if(typeof nEvent == 'function') nEvent();
				})
				.css({
					'background' : '#AB3D43',
					'border-bottom' : '2px solid #8B3236',
					'border-right' : '2px solid #8B3236',
					'color' : '#dedede'
				})
				.hover(function() {
					$(this).css({
						'background' : '#D04A51',
						'border-bottom' : '2px solid #AB3D43',
						'border-right' : '2px solid #AB3D43',
					});
				}, function() {
					$(this).css({
						'background' : '#AB3D43',
						'border-bottom' : '2px solid #8B3236',
						'border-right' : '2px solid #8B3236',
					});
				});
			msg.find('._defmsgbutton-run')
				.html(nText || '確認')
				.off('click').on('click', function() {
					if(typeof yEvent == 'function') yEvent();
				})
				.css({
					'background' : '#418475',
					'border-bottom' : '2px solid #306157',
					'border-right' : '2px solid #306157',
					'color' : '#dedede'
				})
				.hover(function() {
					$(this).css({
						'background' : '#489285',
						'border-bottom' : '2px solid #418475',
						'border-right' : '2px solid #418475',
					});
				}, function() {
					$(this).css({
						'background' : '#418475',
						'border-bottom' : '2px solid #306157',
						'border-right' : '2px solid #306157',
					});
				});
		},
		hideCancel : function() {
			$('._defmsgbutton-cancel').hide();
		},
		hideRun : function() {
			$('._defmsgbutton-run').hide();
		},
		icon : function(text, color) {
			color = color || '#000';
			$('span._defmsgicon').html(text).css({
				color : color,
				'border-color' : color
			});
		}
	};
	var _swal = {
        success : function(title, content, callback) {
            swal({
				title             : title,
				text              : content,
				type              : 'success',
				html              : true,
				confirmButtonText : '確定'
            }, function() {
                if(typeof callback == 'function') callback();
            });
        },
        alert : function(title, content, callback) {
            swal({
				title              : title,
				text               : content,
				type               : 'warning',
				html               : true,
				confirmButtonColor : '#DD6B55',
				confirmButtonText  : '確定'
            }, function() {
                if(typeof callback == 'function') callback();
            });
        },
        error : function(title, content, callback) {
            swal({
				title              : title,
				text               : content,
				type               : 'error',
				html               : true,
				confirmButtonColor : '#DD6B55',
				confirmButtonText  : '確定'
            }, function() {
                if(typeof callback == 'function') callback();
            });
        },
        confirm : function(title, content, y, n, nf, nc) {
            nf = !nf ? true : false;
            nc = !nc ? true : false;
            swal({
				title              : title,
				text               : content,
				type               : 'warning',
				showCancelButton   : true,
				confirmButtonColor : '#DD6B55',
				confirmButtonText  : '確定',
				cancelButtonText   : '取消',
				closeOnConfirm     : nf,   
				closeOnCancel      : nc,
				html               : true
            }, function(isConfirm) {
                if(isConfirm) {
                    if(typeof y == 'function') y();
                } else {
                    if(typeof n == 'function') n();
                }               
            });
        },
        popup : function(title, content, callback) {
            swal({
				title             : title,
				text              : content,
				showCancelButton  : false,
				showConfirmButton : false
            });
            if(typeof callback == 'function') callback();
        },
        input : function(title, content, value, callback, placeholder) {
        	swal({
				title             : title,   
				text              : content,   
				type              : "input",
				html 			  : true,
				showCancelButton  : true,   
				closeOnConfirm    : false,  
				animation         : "slide-from-top",   
				confirmButtonText : '確定',
				cancelButtonText  : '取消',
				inputPlaceholder  : (placeholder) ? placeholder : '',
				inputValue		  : (value) ? value : '' 
        	}, function(inputValue) {
        		if(inputValue === false) return false;
        		if(typeof callback == 'function') callback(inputValue);
        	});
        },
        close : function() {
            swal.close();
        },
        dbclose : function(callback) {
        	$('.sweet-overlay').off('click').on('click', function() {
        		 if(typeof callback == 'function') callback();
        		_swal.close();
        	});
        }
    };
    var _mask = {
        id : '#_masktocommon',
        show : function() {
        	$('body').append('<div id="' + _mask.id.toString().replace('#', '') + '"></div>');
            $(_mask.id).css({
            	'position' : 'fixed',
            	'width' : '100%',
            	'height' : '100%',
            	'top' : 0,
            	'left' : 0,
            	'background' : '#000',
            	'opacity' : '0.7',
            	'z-index' : 100
            });
        },
        hide : function() {
            $(_mask.id).remove();
        },
        dbclose : function(callback) {
            $(_mask.id).off('click').on('click', function() {
                if(typeof callback == 'function') callback();
                _mask.hide();               
            });
        }
    };
	var _ajaxProcess = function(setting, success, error, callback, notParse) {
		$.ajax(setting)
		.fail(function(xhr, status) { 
			if(typeof error == 'function') error(status); 
		})
		.done(function(rep, status, xhr) {
			if(!notParse && !_CHECK.isJSONContentType(xhr.getResponseHeader("content-type"))) rep = _PARSE.json(rep);
			if(typeof success == 'function') success(rep, status, xhr);
		})
		.always(function(xhr, status) {
			if(typeof callback == 'function') callback(status, xhr)
		});
	};
	var _ajaxSetting = function(url, data, type, customerSetting) {
		var def = {
			cache : false,
			processData : true
		};

		var setting = $.extend({}, def, customerSetting);
		setting['url'] = url;
		setting['data'] = data;
		setting['type'] = type;
		return setting;
	};
	var _YNCallback = function(state, y, n) {
		if(state) {
			if(typeof y == 'function') y();
		} else {
			if(typeof n == 'function') n();
		}
	};
	var _mappingNumberString = {
		1 : 19968,
		2 : 20108,
		3 : 19977,
		4 : 22235,
		5 : 20116,
		6 : 20845,
		7 : 26085
	};
	var _week = {
		0 : '日',
		1 : '一',
		2 : '二',
		3 : '三',
		4 : '四',
		5 : '五',
		6 : '六'
	};
	var _DATE = {
		today : function() {
			return _DATE.format(new Date());
		},
		nextYear : function(date) {
			return _DATE.calc(date, {y : 1});
		},
		prevYear : function(date) {
			return _DATE.calc(date, {y : -1});
		},
		nextMonth : function(date) {
			return _DATE.calc(date, {m : 1});
		},
		prevMonth : function(date) {
			return _DATE.calc(date, {m : -1});
		},
		nextDay : function(date) {
			return _DATE.calc(date, {d : 1});
		},
		prevDay : function(date) {
			return _DATE.calc(date, {d : -1});
		},
		calc : function(date, diff) {
			diff = $.extend({}, {y : 0, m : 0, d : 0}, diff);
			date = $.extend({}, _DATE.today(), date);
			var da = new Date();
			da.setFullYear(parseInt(date.y, 10) + parseInt(diff.y, 10));
			da.setMonth(parseInt(date.m, 10) - 1 + parseInt(diff.m, 10));
			da.setDate(parseInt(date.d, 10) + parseInt(diff.d, 10));
			return _DATE.format(da);
		},
		format : function(dateObject) {
			var m = dateObject.getMonth() + 1;
			m = (m < 10) ? '0' + m : m;
			var d = dateObject.getDate();
			d = (d < 10) ? '0' + d : d;
			return {
				y : dateObject.getFullYear(),
				m : m,
				d : d,
				w : dateObject.getDay(),
				wstr : _week[dateObject.getDay()]
			};
		}
	};
	var _EVENT = {
		register : function(uid, target, event, fn, start) {
			_EVENT.stop(uid, target, event)
			if(!_eventPool[event]) _eventPool[event] = {};
			if(!_eventPool[event][target]) _eventPool[event][target] = {};
			_eventPool[event][target][uid] = fn;
			if(start) _EVENT.start(uid, target, event);
		},
		stop : function(uid, target, event) {
			if(!_eventPool[event] || !_eventPool[event][target] || !_eventPool[event][target][uid]) return false;
			$(target).off(event, _eventPool[event][target][uid]);
		},
		start : function(uid, target, event) {
			_EVENT.stop(uid, target, event)
			if(!_eventPool[event] || !_eventPool[event][target] || !_eventPool[event][target][uid]) return false;
			$(target).on(event, _eventPool[event][target][uid]);
		}
	};
	var _eventPool = {};
	/** CKEDITOR CONTROLLER http://ckeditor.com/*/
	var _CKEDITOR = {
		register : function(uid, readonly) {
			CKEDITOR.replace(uid, {
				on : {
					instanceReady : function(ev) {
						_ckeditor[uid] = ev.editor;
						_CKEDITOR.readonly(uid, readonly);
					}
				}
			});
		},
		set : function(uid, value) {
			if(_ckeditor[uid]) _ckeditor[uid].setData(value);
		},
		get : function(uid) {
			return (_ckeditor[uid]) ? _ckeditor[uid].getData() : '';
		},
		readonly : function(uid, isReadOnly, ALL) {
			ALL = (ALL) ? true : false;
			isReadOnly = (isReadOnly) ? true : false;
			if(!ALL) {
				if(_ckeditor[uid]) _ckeditor[uid].setReadOnly(isReadOnly);
			} else {
				for(var i in _ckeditor) {
					if(_ckeditor[i]) _ckeditor[i].setReadOnly(isReadOnly);
				}
			}
		},
		selectOnStart : function(uid) {
			return (_ckeditor[uid]) ? _ckeditor[uid].getSelection() : false;
		},
		clear : function(uid, ALL) {
			ALL = (ALL) ? true : false;
			if(!ALL) {
				if(_ckeditor[uid]) _CKEDITOR.set(uid, '');
			} else {
				for(var i in _ckeditor) {
					if(_ckeditor[i]) _CKEDITOR.set(i, '');
				}
			}
		},
		insert : function(uid, str, isTEXT) {
			var html = (isTEXT) ? str : CKEDITOR.dom.element.createFromHtml(str);
			if(_ckeditor[uid]) {
				try {
					(isTEXT) ? _ckeditor[uid].insertText(html) : _ckeditor[uid].insertElement(html);
				} catch(e) {
					console.log(e);
				}
			}
		}
	};
	var _ckeditor = {};
	/** CKEDITOR CONTROLLER http://ckeditor.com/*/
	/** BARCODE GENERAL http://barcode-coder.com/en/*/
	var _BARCODE = {
		isLoaded : function() {
			if(typeof jQuery().barcode != 'function') {
				console.log('Not Load barcode Plugin! http://barcode-coder.com/en/');
				return false;
			}
			return true;
		},
		code11 : function(str, target, setting) {
			_BARCODE.other(str, target, 'code11', setting);
		},
		code39 : function(str, target, setting) {
			_BARCODE.other(str, target, 'code39', setting);
		},
		code93 : function(str, target, setting) {
			_BARCODE.other(str, target, 'code93', setting);
		},
		code128 : function(str, target, setting) {
			_BARCODE.other(str, target, 'code128', setting);
		},
		other : function(str, target, type, setting) {
			if(!_BARCODE.isLoaded()) return false;
			$(target).barcode(str, type, setting);
		}
	};
	/** BARCODE GENERAL http://barcode-coder.com/en/*/
	/** WEBSOCKET */
	var _WEBSOCKET = {
		uuid : null,
		conn : null,
		retry : 0,
		config : {ip : '', port : '', action : {}},
		init : function(ip, port, action) {
			_WEBSOCKET.config.ip = ip;
			_WEBSOCKET.config.port = port;
			_WEBSOCKET.connect();
			_WEBSOCKET.action(action);
			_WEBSOCKET.bind();
			return this;
		},
		action : function(action) {
			var action = $.extend({}, {
				open : function(e) {
					console.log('connect!');
				},
				close : function(e) {
					console.log('close!');
				},
				message : function(data) {
					console.log(data);
				}
			}, action);
			_WEBSOCKET.config.action = action;
		},
		connect : function() {
			_WEBSOCKET.conn = new WebSocket('ws://' + _WEBSOCKET.config.ip + ':' + _WEBSOCKET.config.port);
		},
		reconnect : function(callback) {
			_WEBSOCKET.connect();
			_WEBSOCKET.action(_WEBSOCKET.config.action);
			_WEBSOCKET.bind(callback);
			if(typeof callback == 'function') callback();
		},
		bind : function() {
			_WEBSOCKET.conn.onopen = function(e) {
				_WEBSOCKET.config.action.open(e);
			};
			_WEBSOCKET.conn.onclose = function(e) {
				_WEBSOCKET.conn = null;
				_WEBSOCKET.uuid = null;
				_WEBSOCKET.config.action.close(e);
			};
			_WEBSOCKET.conn.onmessage = function(e) {
				var data = $.parseJSON(e.data);
				_WEBSOCKET.getUUID(data);
				_WEBSOCKET.config.action.message(data);
			};
		},
		send : function(msg) {
			var parseMsg = JSON.stringify(msg);
			if(_WEBSOCKET.conn) {
				_WEBSOCKET.conn.send(parseMsg);
				_WEBSOCKET.retry = 0
			} else {
				_WEBSOCKET.retry++;
				if(_WEBSOCKET.retry > 3) return _WEBSOCKET.error();
				_WEBSOCKET.reconnect(function() {
					Common.delay.start('reconnect', function() {
						_WEBSOCKET.send(msg);
					}, 2);
				});
			}
		},
		close : function() {
			_WEBSOCKET.conn.close();
		},
		getUUID : function(result) {
			if(result._method == 'getUUID') {
				_WEBSOCKET.uuid = result._data;
			}
		},
		error : function() {
			console.log('Not Connect!');
			_WEBSOCKET.retry = 0;
		}
	};
	/** WEBSOCKET */
	return {
		url : _URL,
		history : _HISTORY,
		format : _FORMAT,
		check : _CHECK,
		file : _FILE,
		ajax : _AJAX,
		lock : _LOCK,
		array : _ARRAY,
		delay : _DELAY,
		loop : _LOOP,
		storage : _STORAGE,
		message : _MESSAGE,
		hotkey : _HOTKEY,
		info : _INFO,
		json : _JSON,
		date : _DATE,
		event : _EVENT,
		editor : _CKEDITOR,
		barcode : _BARCODE,
		websocket : _WEBSOCKET
	};
})(jQuery, swal);
