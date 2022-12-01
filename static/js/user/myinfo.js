
logout();
function preview(evt) {
	if(evt.target.files && evt.target.files[0]) {
		// image preview
		console.log(evt.target.files[0]);
		let reader = new FileReader();	// browser host 객체
		reader.readAsDataURL(evt.target.files[0]);
		reader.onload = function(rst) {
			console.log(rst.target.result);
			document.querySelector('.userProfileImg').src = rst.target.result;
		}
		// update button
		let updateBtn = document.querySelector('.updateBtn');
		updateBtn.style.display = 'block'
	}
}

function logout() {
	let userInfoLink = document.querySelector('.headerRight');
	let html = `
		<a href="/user/exit" class="loginoutLink"><button type="button"><i class="fi fi-rr-sign-out-alt"></i> Logout</button></a>
	`
	userInfoLink.innerHTML = html;
}