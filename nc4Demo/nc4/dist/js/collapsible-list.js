document.addEventListener('click', function(event){
	var _el = event.target;

	if(_el.closest('[data-toggle="collapse"]')) {
		var _tr, _selector, _toggleElem;
		if (event) event.preventDefault();
		_tr = _el.closest('[data-toggle="collapse"]');
		_selector = _tr.getAttribute('data-target');

		if (!_selector) _selector = _tr.getAttribute('href');

		_selector = _selector && _selector.replace(/[^a-zA-Z\d\#]/g, '');

		if (!_selector) return false;

		_selector = _selector.charAt(0) === '#' ? _selector.slice(1) : null;

		_toggleElem = document.getElementById(_selector);

		_toggleElem.classList.toggle('in');

		if (!_toggleElem.classList.contains('in')) {
			_tr.classList.add('collapsed');
			_tr.ariaExpanded = false;
			_toggleElem.ariaExpanded = false;
			_toggleElem.ariaHidden = true;
		} else {
			_tr.classList.remove('collapsed');
			_tr.ariaExpanded = true;
			_toggleElem.ariaExpanded = true;
			_toggleElem.ariaHidden = false;
		}
	}
}, false);