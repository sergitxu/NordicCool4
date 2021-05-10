	// script to show up the way the drodowns should work
	document.addEventListener('click', function(event){
		var el = event.target;
		if(el.closest('.dropdown-toggle')) {
		// if(event.target.matches('.dropdown-toggle')) {
			// var tr = event.target;
			var tr = el.closest('.dropdown-toggle');

			var ele = tr.parentElement.classList.contains('open');

			remOpen();

			if(!ele) {
				tr.parentElement.classList.add('open');
			}
		}
		else {
			remOpen();
		}

		function remOpen() {
			document.querySelectorAll('.dropdown, .btn-split').forEach(function(e){
				if (e.classList.contains('open')) e.classList.remove('open');
			}, false);
		}
	}, false);