login();

function test() {
	let pass = document.querySelector('.pass');
	let passChk = document.querySelector('.passChk');
	let passMsg = document.querySelector('.passMsg');
	if(passChk.value) {
		if(pass.value !== passChk.value) {
			passMsg.innerHTML = '⩗ 비밀번호가 일치하지 않습니다';
			passMsg.style.color = 'var(--errorColor)';
		} else {
			passMsg.innerHTML = '⩗ 비밀번호가 일치합니다'
			passMsg.style.color = 'var(--successColor)';
		}
	} else {
		passMsg.innerHTML = '';
	}
}
async function idCheck(evt) {
	if(evt.target.value.trim().length > 0) {
		let idErr = document.querySelector('.idErr');
		let response = await fetch('/api/idCheck?id=' + evt.target.value, {method :"get"});
		let result = await response.json();
		if(result.success) {
			idErr.innerHTML = '⩗ 사용할 수 있는 아이디입니다';
			idErr.style.color = 'var(--successColor)';
		}else {
			idErr.innerHTML = '⩗ 이미 사용 중인 아이디입니다';
			idErr.style.color = 'var(--errorColor)';
		}
		console.log(result, [evt.target.value]);
	}
}
function submit() {
	let inp = document.querySelectorAll('input');
	let i = 0;
	while(i <= inp.length) {
		console.log(inp[i].value);
		i++
	}
}
function login() {
	let userInfoLink = document.querySelector('.headerRight');
	let html = `
		<a href="/account/signin" class="loginoutLink"><button type="button"><i class="fi fi-rr-sign-in-alt"></i> Login</button></a>
	`
	userInfoLink.innerHTML = html;
}